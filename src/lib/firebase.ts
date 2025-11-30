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

let app: FirebaseApp | null = null;

export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    if (typeof window === 'undefined') {
      // Opcional: lançar erro ou retornar mock em SSR, mas geralmente não é usado no server
      throw new Error('Firebase cannot be initialized on the server.');
    }
    const apps = getApps();
    app = apps.length ? apps[0] : initializeApp(firebaseConfig);
  }
  return app;
};

export const getAuthInstance = (): Auth => {
  const app = getFirebaseApp();
  return getAuth(app);
};

export const getDbInstance = (): Firestore => {
  const app = getFirebaseApp();
  return getFirestore(app);
};