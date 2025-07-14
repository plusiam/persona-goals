import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC9x6BLB_qtY4LKWeEBKVGR5wLhUteSus",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "persona-goals.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "persona-goals",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "persona-goals.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1009586920103",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1009586920103:web:1350d202cf54a3bf2c5982",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-9VK54BN046"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

// Initialize Analytics (only in browser)
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export default app;