// src/lib/firebase.ts
import { getApps, getApp, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Configuração do Firebase vinda das variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// 🔹 Inicializa apenas uma vez, mesmo em SSR ou hot-reload
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🔹 Exporta instâncias prontas para uso
export const firebaseApp = app;
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
