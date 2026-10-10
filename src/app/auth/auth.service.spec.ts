import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AuthService, roleForEmail } from './auth.service';

describe('AuthService', () => {
  let auth: AuthService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    auth = TestBed.inject(AuthService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('fails closed until Firebase is configured', async () => {
    await expect(auth.login('admin@test.com', 'Test@123')).rejects.toThrow('Firebase is not configured');
    expect(auth.isAuthenticated()).toBe(false);
  });

  it('maps only the two Firebase demo accounts to roles', () => {
    expect(roleForEmail('ADMIN@test.com')).toBe('admin');
    expect(roleForEmail('member@test.com')).toBe('member');
    expect(roleForEmail('other@test.com')).toBeNull();
  });

  it('clears the local session on logout', async () => {
    sessionStorage.setItem('gmw-firebase-session', 'old-session');

    await auth.logout();
    expect(auth.role()).toBeNull();
    expect(sessionStorage.getItem('gmw-firebase-session')).toBeNull();
  });
});
