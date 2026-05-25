import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';

export interface FirebaseConfigShape {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Load from env at build/runtime — do not commit real keys to public repos.
// Project: sovereign-works-v4
export const firebaseConfig: FirebaseConfigShape = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: 'sovereign-works-v4.firebaseapp.com',
  databaseURL: 'https://sovereign-works-v4-default-rtdb.firebaseio.com',
  projectId: 'sovereign-works-v4',
  storageBucket: 'sovereign-works-v4.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

let app: FirebaseApp | null = null;
let db: Database | null = null;
let auth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseDb(): Database {
  if (!db) {
    db = getDatabase(getFirebaseApp());
  }
  return db;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.appId);
}
