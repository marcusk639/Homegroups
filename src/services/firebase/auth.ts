import {auth, firestore} from './config';
const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} = auth;
const {collection, doc} = firestore;
import FirebaseAuth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import FirebaseFirestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
const {GoogleAuthProvider} = FirebaseAuth;

// const createUserWithEmailAndPaso sword = auth.createUserWithEmailAndPassword;
// const signInWithEmailAndPassword = auth.signInWithEmailAndPassword;
// const signOut = auth.signOut;
// const sendPasswordResetEmail = auth.sendPasswordResetEmail;
// const updateProfile = auth.updateProfile;
// const doc = firestore.doc;
// const setDoc = firestore.setDoc;
// Google sign-in requires additional setup in your project, including:
// 1. expo-google-app-auth or expo-auth-session/expo-crypto for Expo projects
// 2. @react-native-google-signin/google-signin for bare React Native projects

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  recoveryDate?: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Register a new user with email and password
export const registerWithEmail = async (
  data: RegisterData,
): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      data.email,
      data.password,
    );

    // Update display name
    if (userCredential.user) {
      await userCredential.user.updateProfile({
        displayName: data.displayName,
      });

      collection('users')
        .doc(userCredential.user.uid)
        .set({
          email: data.email,
          displayName: data.displayName,
          recoveryDate: data.recoveryDate ? new Date(data.recoveryDate) : null,
          createdAt: FirebaseFirestoreTypes.FieldValue.serverTimestamp(),
          lastLogin: FirebaseFirestoreTypes.FieldValue.serverTimestamp(),
        });
    }

    return userCredential;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Sign in with email and password
export const loginWithEmail = async (
  data: LoginData,
): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      data.email,
      data.password,
    );

    // Update last login timestamp
    if (userCredential.user) {
      await collection('users').doc(userCredential.user.uid).update({
        lastLogin: FirebaseFirestoreTypes.FieldValue.serverTimestamp(),
      });
    }

    return userCredential;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign in with Google - this is a placeholder for the actual implementation
// which requires additional setup with expo-google-app-auth or @react-native-google-signin/google-signin
export const signInWithGoogle =
  async (): Promise<FirebaseAuthTypes.UserCredential | null> => {
    try {
      // This is a placeholder - you'll need to implement the actual Google sign-in flow
      // based on whether you're using Expo or plain React Native

      // Example with @react-native-google-signin/google-signin:
      // 1. Get ID token from Google Sign In
      // const { idToken } = await GoogleSignin.signIn();
      // 2. Create a Google credential with the token
      // const googleCredential = GoogleAuthProvider.credential(idToken);
      // 3. Sign-in with credential
      // const userCredential = await signInWithCredential(auth, googleCredential);

      console.warn(
        'Google sign-in not fully implemented - requires platform-specific setup',
      );
      return null;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

// Sign out the current user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(email);
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw error;
  }
};

// Get the current user's profile data
export const getUserProfile = async (userId: string) => {
  try {
    const userDoc = await collection('users').doc(userId).get();

    if (userDoc.exists) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};
