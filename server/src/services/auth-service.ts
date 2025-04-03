import { auth, db } from "../config/firebase";
import { generateToken } from "../utils/helpers";
import { UserRegistrationData } from "../types/user";
import * as firestoreUtils from "../utils/firestore";
import logger from "../utils/logger";
import { ApiError } from "../middleware/error";
import { STATUS_CODES, ERROR_MESSAGES } from "../utils/constants";

/**
 * Register a new user with email and password
 */
export const registerUser = async (
  userData: UserRegistrationData
): Promise<{ uid: string; token: string }> => {
  try {
    // Create the user in Firebase Authentication
    const userRecord = await auth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
    });

    // Create user document in Firestore
    await firestoreUtils.setDoc(`users/${userRecord.uid}`, {
      uid: userRecord.uid,
      email: userData.email,
      displayName: userData.displayName,
      recoveryDate: userData.recoveryDate || null,
      notificationSettings: {
        meetings: true,
        announcements: true,
        celebrations: true,
      },
      privacySettings: {
        showRecoveryDate: false,
        allowDirectMessages: true,
      },
      homeGroups: [],
      role: "user",
      lastLogin: new Date(),
    });

    // Generate JWT token
    const token = generateToken(userRecord.uid, userData.email, "user");

    return { uid: userRecord.uid, token };
  } catch (error) {
    logger.error(`Error registering user: ${error}`);

    // Check for email already exists error
    if (error.code === "auth/email-already-exists") {
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
      );
    }

    throw error;
  }
};

/**
 * Login a user with email and password
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<{ uid: string; token: string }> => {
  try {
    // Since Firebase Admin SDK doesn't support email/password sign-in directly,
    // in a real app, you'd typically:
    // 1. Use Firebase Auth REST API
    // 2. Or handle this in the client and just verify the token on the server

    // For now, we'll use a workaround to simulate email/password auth
    // This is NOT how you would do this in production - this is just for demonstration

    // Find the user by email
    const userRecord = await auth.getUserByEmail(email);

    // In a real app, the password validation would be handled by Firebase Auth
    // Here we're just simulating successful auth

    // Update last login time
    await firestoreUtils.updateDoc(`users/${userRecord.uid}`, {
      lastLogin: new Date(),
    });

    // Generate JWT token
    const token = generateToken(userRecord.uid, email, "user"); // In a real app, you'd get the role from Firestore

    return { uid: userRecord.uid, token };
  } catch (error) {
    logger.error(`Error logging in user: ${error}`);

    // If user not found or password incorrect
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      ERROR_MESSAGES.INVALID_CREDENTIALS
    );
  }
};

/**
 * Get user data by ID
 */
export const getUserById = async (uid: string) => {
  try {
    const userRecord = await auth.getUser(uid);
    const userData = await firestoreUtils.getDoc(`users/${uid}`);

    if (!userData) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return userData;
  } catch (error) {
    logger.error(`Error getting user by ID: ${error}`);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
  }
};

/**
 * Reset user password
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    // Get user by email to verify they exist
    await auth.getUserByEmail(email);

    // In a real app, you would:
    // 1. Generate a password reset link
    // 2. Send it via email
    // For now, we'll just log it
    logger.info(`Password reset requested for email: ${email}`);

    // This would typically be handled by Firebase Auth directly from the client
    // since the Admin SDK doesn't have a direct method for this
  } catch (error) {
    logger.error(`Error resetting password: ${error}`);

    // Don't reveal if the email exists or not for security
    // Just return success regardless
  }
};

/**
 * Delete a user
 */
export const deleteUser = async (uid: string): Promise<void> => {
  try {
    // Delete from Firebase Auth
    await auth.deleteUser(uid);

    // Delete user document from Firestore
    await firestoreUtils.deleteDoc(`users/${uid}`);
  } catch (error) {
    logger.error(`Error deleting user: ${error}`);
    throw error;
  }
};

/**
 * Update user email
 */
export const updateUserEmail = async (
  uid: string,
  newEmail: string
): Promise<void> => {
  try {
    await auth.updateUser(uid, { email: newEmail });

    // Update email in Firestore document
    await firestoreUtils.updateDoc(`users/${uid}`, { email: newEmail });
  } catch (error) {
    logger.error(`Error updating user email: ${error}`);
    throw error;
  }
};
