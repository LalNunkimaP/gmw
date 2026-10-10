# Firebase Auth setup (Spark/free tier)

This setup uses Firebase Authentication and Cloud Firestore only; it does not require Cloud Functions or the Blaze plan. The app writes a random active-session ID to `activeSessions/{uid}` at sign-in. Other open clients watch that document and sign out when a newer login replaces the ID.

## Configure Firebase

1. Create a Firebase project and register a Web app.
2. Enable **Authentication → Email/Password**.
3. Create these users in **Authentication → Users**:
   - `admin@test.com` with password `Test@123`
   - `member@test.com` with password `Test@123`
4. Create a Cloud Firestore database on the Spark plan.
5. Copy the Web app's `apiKey`, `authDomain`, `projectId`, and `appId` into the `firebase` object in both `src/environments/environment.ts` and `src/environments/environment.prod.ts`. These are public client settings; do not put service-account keys in the app.

The client maps `admin@test.com` to the `admin` role and `member@test.com` to the `member` role. Other email addresses are rejected by this demo app.

## Deploy Firestore rules

Install/login to the Firebase CLI, select the project, then deploy only the Firestore rules:

```sh
npx firebase-tools login
npx firebase-tools use --add
npx firebase-tools deploy --only firestore:rules
```

The rules allow each signed-in user to read and replace only their own active-session record. The previous app session observes the changed ID and returns to login. This provides single-session behavior for normal app clients without paid compute.

**Security limitation:** Because Spark has no trusted server function here, an account owner who modifies the client can write a new session ID and bypass the app-level single-session behavior. Do not use this as a tamper-proof control for sensitive admin operations. Enforcing that requires trusted backend compute, which means Blaze or another server host.

Until the public Firebase app config is filled in and Firestore rules are deployed, login intentionally fails closed with a Firebase configuration/setup message.
