# 01 — TECH STACK

## EXACT VERSIONS

```bash
# Expo
npx create-expo-app@latest apps/imperium --template blank-typescript
npx create-expo-app@latest apps/tending  --template blank-typescript

# Core Expo packages
npx expo install expo-router expo-sqlite expo-secure-store
npx expo install expo-notifications expo-task-manager expo-av expo-haptics
npx expo install expo-barcode-scanner
npx expo install @react-native-async-storage/async-storage

# Firebase
npm install firebase@^10.0.0

# QR Code
npx expo install react-native-qrcode-svg react-native-svg

# Groq SDK
npm install groq-sdk

# Status bar
npx expo install expo-status-bar
```

## FIREBASE CONFIG (Spark free plan)
```typescript
// packages/shared/firebase/config.ts
// Garrin creates the Firebase project at console.firebase.google.com
// Enable: Realtime Database (NOT Firestore), Anonymous Auth
// Copy config object here — Cursor leaves placeholders:
export const firebaseConfig = {
  apiKey:            "// TODO: from Firebase console",
  authDomain:        "// TODO: from Firebase console",
  databaseURL:       "// TODO: from Firebase console",
  projectId:         "// TODO: from Firebase console",
  storageBucket:     "// TODO: from Firebase console",
  messagingSenderId: "// TODO: from Firebase console",
  appId:             "// TODO: from Firebase console",
};
```

## GROQ API CONFIG
```typescript
// packages/shared/ai/groq.ts
// Garrin pastes API key from console.groq.com (free tier)
const GROQ_API_KEY = "// TODO: from Groq console";
const GROQ_MODEL   = "llama-3.3-70b-versatile";
const GROQ_MAX_RPD = 14400;  // free tier daily limit
```

## ANDROID TARGET
- minSdkVersion: 26 (Android 8.0)
- targetSdkVersion: 34
- compileSdkVersion: 34

## FOLDER STRUCTURE
```
sovereign-works/
├── apps/imperium/          ← INTJ app
├── apps/tending/           ← ESFJ app
├── packages/shared/
│   ├── firebase/
│   ├── data/               ← recipes.ts, quotes.ts, weekPlan.ts, content files
│   ├── hooks/
│   ├── ai/
│   └── types/
└── SOVEREIGN_WORKS_PHASE1/ ← spec files (read-only)
```
