// import {initializeApp} from '@react-native-firebase/app';
// import {getAuth} from '@react-native-firebase/auth';
// import {getFirestore} from '@react-native-firebase/firestore';

// // Your web app's Firebase configuration
// // Replace with your actual Firebase config
// const firebaseConfig = {
//   apiKey: 'AIzaSyBbLyVKe0sgdIg3rJLhVqxG8ur-mDKC8wE',
//   authDomain: 'recovery-connect.firebaseapp.com',
//   projectId: 'recovery-connect',
//   storageBucket: 'recovery-connect.appspot.com',
//   messagingSenderId: '421876308052',
//   appId: '1:421876308052:ios:0000000000000000000000',
// };
// import firebase from '@react-native-firebase/app';
import FirebaseAuth from '@react-native-firebase/auth';
// import FirebaseMessaging from '@react-native-firebase/messaging';
// import FirebaseDatabase from '@react-native-firebase/database';
import FirebaseFunctions from '@react-native-firebase/functions';
// import FirebaseDynamicLinks from '@react-native-firebase/dynamic-links';
import FirebaseFirestore from '@react-native-firebase/firestore';
// import FirebaseStorage from '@react-native-firebase/storage';
// import { FirebaseDatabaseTypes } from '@react-native-firebase/database';
// import { FirebaseStorageTypes } from '@react-native-firebase/storage';
//
// const app = firebase.app();
// const db = FirebaseDatabase();
const auth = FirebaseAuth();
// const messaging = FirebaseMessaging();
// const storage = FirebaseStorage();
const functions = FirebaseFunctions();

export const callHttpsFunction = (name: string, payload: any) => {
  return FirebaseFunctions().httpsCallable(name)(payload);
};

// const links = FirebaseDynamicLinks();
// auth.signOut();
const firestore = FirebaseFirestore();
firestore.settings({ignoreUndefinedProperties: true});
// firebase.enablePersistence(true);
// const channelId = 'notification-channel';
// const channel = new firebase.notifications.Android.Channel(channelId, 'Notification Channel', firebase.notifications.Android.Importance.Max);
// // firebase.notifications().android.createChannel(channel);
// notifications.android.createChannel(channel);

export {
  // db,
  firestore,
  auth,
  // messaging,
  // storage,
  functions,
  // links,
  // FirebaseAuthTypes,
  // FirebaseDatabaseTypes,
  // FirebaseFirestoreTypes,
  // FirebasepStorageTypes,
};
