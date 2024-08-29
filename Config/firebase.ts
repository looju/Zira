// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const key = process.env.EXPO_PUBLIC_FIREBASEKEY;
const authDomain = process.env.EXPO_PUBLIC_FIREBASEAUTHDOMIAN;
const projectId = process.env.EXPO_PUBLIC_FIREBASEPROJECTID;
const storageBucket = process.env.EXPO_PUBLIC_FIREBASESTORAGEBUCKET;
const messagingSenderId = process.env.EXPO_PUBLIC_FIREBASESENDERID;
const appId = process.env.EXPO_PUBLIC_FIREBASEAPPID;

const firebaseConfig = {
  apiKey: key,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export default app;
