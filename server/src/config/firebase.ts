import * as admin from "firebase-admin";
import logger from "../utils/logger";

/**
 * Initialize Firebase Admin SDK
 */
const initializeFirebaseAdmin = (): admin.app.App => {
  try {
    // Check if an app has already been initialized
    try {
      return admin.app();
    } catch {
      // No app exists, initialize a new one

      // For production, use environment variables or service account file
      if (process.env.FIREBASE_PRIVATE_KEY) {
        // Initialize with environment variables
        return admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          }),
        });
      } else {
        // If no environment variables, try to use a service account file or default credentials
        const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS
          ? process.env.GOOGLE_APPLICATION_CREDENTIALS
          : "./serviceAccountKey.json";

        return admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error initializing Firebase Admin SDK: ${error.message}`);
    } else {
      logger.error("Unknown error initializing Firebase Admin SDK");
    }

    throw error; // Re-throw to halt application startup
  }
};

// Initialize Firebase Admin SDK
const firebaseAdmin = initializeFirebaseAdmin();
const auth = firebaseAdmin.auth();
const db = firebaseAdmin.firestore();

// Configure Firestore
db.settings({
  ignoreUndefinedProperties: true,
  timestampsInSnapshots: true,
});

export { firebaseAdmin, auth, db };
