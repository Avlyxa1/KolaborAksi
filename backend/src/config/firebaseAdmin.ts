import * as admin from 'firebase-admin';

/**
 * Initialize Firebase Admin SDK for server-side token verification.
 *
 * Expects FIREBASE_SERVICE_ACCOUNT_KEY as a JSON string in environment variables.
 * In development, you can also place the service account JSON file locally
 * and set GOOGLE_APPLICATION_CREDENTIALS instead.
 */
function initializeFirebaseAdmin(): admin.app.App {
  // Already initialized — return existing app
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch {
      console.error(
        '[Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. ' +
          'Make sure it is a valid JSON string.',
      );
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY');
    }
  }

  // Fallback: use GOOGLE_APPLICATION_CREDENTIALS (file path) or default credentials
  console.warn(
    '[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_KEY not set. ' +
      'Falling back to application default credentials.',
  );
  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const firebaseAdmin = initializeFirebaseAdmin();

export default firebaseAdmin;
export { admin };
