// src/lib/firebase.ts
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function initializeFirebaseApp() {
  try {
    // Valida se todas as variáveis estão preenchidas
    const isConfigValid = Object.values(firebaseConfig).every(
      (value) => typeof value === 'string' && value.trim() !== ''
    );

    if (!isConfigValid) {
      console.warn('Firebase: Variáveis de ambiente não configuradas corretamente');
      return null;
    }

    // Inicializa apenas uma vez
    const apps = getApps();
    if (apps.length === 0) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
    } else {
      app = apps[0];
      auth = getAuth(app);
      db = getFirestore(app);
    }

    return app;
  } catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
    return null;
  }
}

export function getFirebaseAuth(): Auth | null {
  if (!auth) {
    initializeFirebaseApp();
  }
  return auth;
}

export function getFirebaseFirestore(): Firestore | null {
  if (!db) {
    initializeFirebaseApp();
  }
  return db;
}