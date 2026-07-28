import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createRequire } from 'module';

/**
 * Initialize Firebase Admin SDK for server-side token verification.
 *
 * Reads the service-account.json file from the project root (backend/).
 */
function initializeFirebaseAdmin(): App {
  // Already initialized — return existing app
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0]!;
  }

  // Try loading from service-account.json file
  try {
    const require = createRequire(process.cwd() + '/');
    const serviceAccount = require('./service-account.json');
    return initializeApp({
      credential: cert(serviceAccount),
    });
  } catch {
    // Fallback: try env variable
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        return initializeApp({
          credential: cert(serviceAccount),
        });
      } catch {
        console.error(
          '[Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY.',
        );
        throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY');
      }
    }
  }

  throw new Error(
    '[Firebase Admin] No service account found. ' +
      'Place service-account.json in backend/ or set FIREBASE_SERVICE_ACCOUNT_KEY env variable.',
  );
}

const firebaseApp = initializeFirebaseAdmin();
const firebaseAuth = getAuth(firebaseApp);

export default firebaseApp;
export { firebaseAuth };
