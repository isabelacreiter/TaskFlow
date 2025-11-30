// src/lib/firebase.ts
import { getApps, getApp, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Verifica se estamos no cliente e se as credenciais existem
const isClient = typeof window !== 'undefined';
const isConfigValid = Object.values(clientCredentials).every(value => value !== undefined && value !== '');

let app: FirebaseApp;

if (isClient && isConfigValid) {
  app = getApps().length ? getApp() : initializeApp(clientCredentials);
} else {
  // Em SSR ou se faltarem variáveis, app não é criado (evita erro no servidor)
  app = {} as FirebaseApp; // placeholder; não será usado no server
}

export const firebaseApp = app;
export const auth = isClient && isConfigValid ? getAuth(app) : (null as unknown as Auth);
export const db = isClient && isConfigValid ? getFirestore(app) : (null as unknown as Firestore);