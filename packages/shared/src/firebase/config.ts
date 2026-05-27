import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, type FirebaseApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  type Auth,
} from 'firebase/auth';
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

const FIREBASE_DEFAULTS: FirebaseConfigShape = {
  apiKey: 'AIzaSyAgrCx_F9AnB35EeVQcPy5AGE-ed0xbT3A',
  authDomain: 'sovereign-works-v4.firebaseapp.com',
  databaseURL: 'https://sovereign-works-v4-default-rtdb.firebaseio.com',
  projectId: 'sovereign-works-v4',
  storageBucket: 'sovereign-works-v4.firebasestorage.app',
  messagingSenderId: '448966886183',
  appId: '1:448966886183:android:302a6967f405d693071f02',
};

export const firebaseConfig: FirebaseConfigShape = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || FIREBASE_DEFAULTS.apiKey,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || FIREBASE_DEFAULTS.authDomain,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || FIREBASE_DEFAULTS.databaseURL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || FIREBASE_DEFAULTS.projectId,
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || FIREBASE_DEFAULTS.storageBucket,
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || FIREBASE_DEFAULTS.messagingSenderId,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || FIREBASE_DEFAULTS.appId,
};

let app: FirebaseApp | null = null;
let db: Database | null = null;
let auth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
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
    const firebaseApp = getFirebaseApp();
    try {
      auth = initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch (e: unknown) {
      const code =
        e && typeof e === 'object' && 'code' in e ? String((e as { code: string }).code) : '';
      if (code === 'auth/already-initialized') {
        auth = getAuth(firebaseApp);
      } else {
        throw e;
      }
    }
  }
  return auth;
}

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.appId);
}
