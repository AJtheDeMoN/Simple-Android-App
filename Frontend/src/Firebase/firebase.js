// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; 
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDf-97DCUV31e_ZLMMe4a8zIOrbTcxJ9Lc",
  authDomain: "dep-authassignment.firebaseapp.com",
  projectId: "dep-authassignment",
  storageBucket: "dep-authassignment.appspot.com",
  messagingSenderId: "1034807467884",
  appId: "1:1034807467884:web:c283bdb574bd09a2265d49",
  measurementId: "G-ER66E688QY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
export const db=getFirestore(app);

export default app;