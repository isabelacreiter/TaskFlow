// src/lib/firebase.ts
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp | null = null;

export const getFirebaseApp = (): FirebaseApp | null => {
  // Don't initialize Firebase during SSR/prerender — only on the client
  if (typeof window === 'undefined') return null;

  if (!firebaseApp) {
    firebaseApp = getApps().length ? (getApps()[0] as FirebaseApp) : initializeApp(firebaseConfig);
  }

  return firebaseApp;
};

export const getAuthInstance = (): Auth | null => {
  const app = getFirebaseApp();
  if (!app) return null;
  return getAuth(app);
};

export const getDbInstance = (): Firestore | null => {
  const app = getFirebaseApp();
  if (!app) return null;
  return getFirestore(app);
};