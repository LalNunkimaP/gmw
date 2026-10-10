import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  User,
  browserSessionPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  Unsubscribe,
  doc,
  getFirestore,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { environment } from '../../environments/environment';

export type UserRole = 'admin' | 'member';

const demoRoles: Record<string, UserRole> = {
  'admin@test.com': 'admin',
  'member@test.com': 'member',
};

export function roleForEmail(email: string | null): UserRole | null {
  return email ? demoRoles[email.trim().toLowerCase()] ?? null : null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionStorageKey = 'gmw-firebase-session';
  private readonly router = inject(Router);
  private readonly roleState = signal<UserRole | null>(null);
  readonly role = this.roleState.asReadonly();
  private initialization?: Promise<void>;
  private authStateSubscription?: Unsubscribe;
  private activeSessionSubscription?: Unsubscribe;
  private activeSessionId: string | null = null;
  private isExpiringSession = false;
  private isSigningIn = false;

  initialize(): Promise<void> {
    if (this.initialization) return this.initialization;

    if (!this.isFirebaseConfigured()) {
      this.clearLocalSession();
      this.initialization = Promise.resolve();
      return this.initialization;
    }

    this.initialization = new Promise((resolve) => {
      this.authStateSubscription = onAuthStateChanged(this.firebaseAuth, (user) => {
        if (this.isSigningIn) return;
        if (user) {
          void this.restoreSession(user).finally(resolve);
        } else {
          this.clearLocalSession();
          resolve();
        }
      });
    });

    return this.initialization;
  }

  async login(email: string, password: string): Promise<UserRole> {
    await this.initialize();
    const auth = this.firebaseAuth;
    let signedInUser: User | null = null;
    this.isSigningIn = true;
    try {
      await setPersistence(auth, browserSessionPersistence);
      const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      signedInUser = credential.user;
      const role = roleForEmail(credential.user.email);
      if (!role) throw new Error('This account is not enabled for the demo app.');

      const sessionId = globalThis.crypto.randomUUID();
      const sessionReference = doc(getFirestore(this.firebaseApp), 'activeSessions', credential.user.uid);
      await runTransaction(getFirestore(this.firebaseApp), async (transaction) => {
        await transaction.get(sessionReference);
        transaction.set(sessionReference, {
          sessionId,
          updatedAt: serverTimestamp(),
        });
      });

      this.activeSessionId = sessionId;
      this.roleState.set(role);
      globalThis.sessionStorage?.setItem(this.sessionStorageKey, sessionId);
      this.watchActiveSession(credential.user.uid, sessionId);
      return role;
    } catch {
      this.clearLocalSession();
      if (signedInUser && auth.currentUser) await signOut(auth);
      throw new Error('Sign-in failed. Check your Firebase setup and account credentials.');
    } finally {
      this.isSigningIn = false;
    }
  }

  async logout(): Promise<void> {
    const sessionId = this.activeSessionId;
    const auth = this.isFirebaseConfigured() ? this.firebaseAuth : null;
    this.stopWatchingSession();
    this.clearLocalSession();

    if (auth?.currentUser && sessionId) {
      try {
        const sessionReference = doc(getFirestore(this.firebaseApp), 'activeSessions', auth.currentUser.uid);
        await runTransaction(getFirestore(this.firebaseApp), async (transaction) => {
          const activeSession = await transaction.get(sessionReference);
          if (activeSession.data()?.['sessionId'] === sessionId) {
            transaction.delete(sessionReference);
          }
        });
      } catch {
        // Local sign-out still proceeds if the server is temporarily unreachable.
      }
    }

    if (auth?.currentUser) await signOut(auth);
  }

  isAuthenticated(): boolean {
    return this.roleState() !== null;
  }

  private isFirebaseConfigured(): boolean {
    const config = environment.firebase;
    return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
  }

  private get firebaseApp(): FirebaseApp {
    if (!this.isFirebaseConfigured()) {
      throw new Error('Firebase is not configured. Add your Firebase web app settings to the environment files.');
    }

    return getApps().length ? getApp() : initializeApp(environment.firebase);
  }

  private get firebaseAuth(): Auth {
    return getAuth(this.firebaseApp);
  }

  private async restoreSession(user: User): Promise<void> {
    try {
      const sessionId = globalThis.sessionStorage?.getItem(this.sessionStorageKey);
      const role = roleForEmail(user.email);
      if (role && sessionId) {
        this.roleState.set(role);
        this.activeSessionId = sessionId;
        this.watchActiveSession(user.uid, sessionId);
        return;
      }
    } catch {
      // Missing browser storage means this client cannot prove its active session.
    }

    this.clearLocalSession();
    void signOut(this.firebaseAuth);
  }

  private watchActiveSession(uid: string, sessionId: string): void {
    this.stopWatchingSession();
    this.activeSessionSubscription = onSnapshot(
      doc(getFirestore(this.firebaseApp), 'activeSessions', uid),
      (snapshot) => {
        if (!snapshot.exists() || snapshot.data()['sessionId'] !== sessionId) {
          void this.expireReplacedSession();
        }
      },
      () => void this.expireReplacedSession(),
    );
  }

  private async expireReplacedSession(): Promise<void> {
    if (this.isExpiringSession) return;
    this.isExpiringSession = true;
    try {
      this.stopWatchingSession();
      this.clearLocalSession();
      if (this.isFirebaseConfigured() && this.firebaseAuth.currentUser) {
        await signOut(this.firebaseAuth);
      }
      await this.router.navigateByUrl('/login?session=replaced');
    } finally {
      this.isExpiringSession = false;
    }
  }

  private stopWatchingSession(): void {
    this.activeSessionSubscription?.();
    this.activeSessionSubscription = undefined;
  }

  private clearLocalSession(): void {
    this.roleState.set(null);
    this.activeSessionId = null;
    try {
      globalThis.sessionStorage?.removeItem(this.sessionStorageKey);
    } catch {
      // The in-memory role is cleared even if browser storage is unavailable.
    }
  }
}
