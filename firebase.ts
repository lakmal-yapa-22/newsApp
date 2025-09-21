import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, indexedDBLocalPersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfgMTYYXj8x34M1dle4R3MI-i-PZaT2Dw",
  authDomain: "news-92b00.firebaseapp.com",
  projectId: "news-92b00",
  storageBucket: "news-92b00.firebasestorage.app",
  messagingSenderId: "676673121198",
  appId: "1:676673121198:web:1cf56f584071b25c29363f"
};
// Initialize Firebase app
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// **Initialize Auth for React Native**
export const auth =
  typeof window === "undefined"
    ? initializeAuth(app, { persistence: indexedDBLocalPersistence }) // works in Expo + Node
    : getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);