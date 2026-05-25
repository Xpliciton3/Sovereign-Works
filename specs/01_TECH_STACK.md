# TECH STACK — PHASE 1

---

## CONFIRMED STACK — ALL FREE

| Layer | Technology | Version / Notes |
|-------|-----------|----------------|
| Mobile framework | React Native + Expo | Expo SDK 50+ |
| Navigation | Expo Router 3+ | File-based |
| Language | TypeScript | Required — Cursor is better with it |
| APK build | Android Studio + Gradle + Expo EAS Build | Free tier |
| Desktop app | Electron | Latest stable |
| Backend | Firebase Realtime Database | Spark free plan — no credit card |
| Local storage | expo-sqlite | All private/offline data |
| Settings/flags | AsyncStorage | Simple key-value |
| Secure tokens | expo-secure-store | Family codes encrypted on device |
| Notifications | expo-notifications | Local alarms + push |
| Background tasks | expo-task-manager | Keep alarms firing when app closed |
| Audio | expo-av | Alarm sound playback |
| Vibration | expo-haptics | Alarm vibration pattern |
| AI — cloud | Groq API (free tier) | llama-3.3-70b-versatile, 14,400 req/day |
| Widgets | react-native-widget-extension | Android widget |
| QR code | expo-barcode-scanner + react-native-qrcode-svg | Desktop generates, phone scans |

---

## PROJECT FOLDER STRUCTURE

```
sovereign-works/
├── apps/
│   ├── imperium/           ← Garrin's app (INTJ / The Uncrowned)
│   │   ├── app/            ← Expo Router pages
│   │   ├── components/     ← Imperium-specific components
│   │   ├── constants/      ← Colors, profile config
│   │   └── assets/
│   └── tending/            ← Holli's app (ESFJ / The Unspent)
│       ├── app/
│       ├── components/
│       ├── constants/
│       └── assets/
├── packages/
│   └── shared/             ← Shared logic both apps import
│       ├── firebase/       ← Firebase hooks and schema
│       ├── alarm/          ← Alarm engine
│       ├── scheduler/      ← Shift + sleep scheduler
│       ├── mood/           ← Mood tracker + translator
│       ├── hydration/      ← Hydration tracker
│       ├── nourish/        ← Meal plan + grocery logic
│       ├── quotes/         ← Daily quote system
│       └── types/          ← All TypeScript interfaces
├── desktop/                ← Electron desktop app
│   ├── src/
│   └── package.json
└── firebase/               ← Firebase config + security rules
    └── database.rules.json
```

---

## COLOR SYSTEMS

### Imperium (Garrin / INTJ)
```typescript
export const IMPERIUM_COLORS = {
  // Dark mode (system dark)
  dark: {
    background: '#0D0D0D',
    surface: '#1A1A1A',
    accent: '#B8962E',       // gold
    accentSoft: '#7A5C1E',
    text: '#F5F5F0',
    textMuted: '#888880',
    border: '#2A2A2A',
    danger: '#8B2020',
  },
  // Light mode (system light)
  light: {
    background: '#F5F0E8',
    surface: '#FFFFFF',
    accent: '#8B6B1A',
    accentSoft: '#C4A020',
    text: '#1A1208',
    textMuted: '#666050',
    border: '#D4C8A8',
    danger: '#8B2020',
  }
}
```

### Tending (Holli / ESFJ)
```typescript
export const TENDING_COLORS = {
  dark: {
    background: '#120A0E',
    surface: '#1E1218',
    accent: '#C47878',       // rose
    accentSoft: '#8B4A4A',
    text: '#F5E8EC',
    textMuted: '#AA8888',
    border: '#2E1820',
    danger: '#8B2040',
  },
  light: {
    background: '#FFF5F0',
    surface: '#FFFFFF',
    accent: '#A85050',
    accentSoft: '#E8A0A0',
    text: '#200A10',
    textMuted: '#806060',
    border: '#F0D0D0',
    danger: '#8B2040',
  }
}
```

---

## PROFILE CONFIG

```typescript
export type Profile = 'imperium' | 'tending';

export interface ProfileConfig {
  id: Profile;
  displayName: string;         // "The Imperium"
  personName: string;          // "Garrin"
  practitionerTitle: string;   // "The Uncrowned"
  motto: string;
  axiom: string;
  morningDeclaration: string;
  colors: typeof IMPERIUM_COLORS;
  defaultAlarms: AlarmConfig[];
  hydrationTargetOz: number;
  shiftType: 'law_enforcement' | 'nursing';
}
```

---

## GROQ API SETUP

```typescript
// Cloud Functions handle the Groq key — never on device
// Firebase Cloud Functions call Groq API
// Apps call Cloud Functions — no API key on phone

const GROQ_FUNCTIONS = {
  generateQuoteBank: 'generateQuoteBank',   // 30 quotes per tradition per month
  translateMood: 'translateMood',           // INTJ ↔ ESFJ mood translation
};

// Free tier: 14,400 requests/day
// Expected usage: ~2-3 mood translations/day + 1 quote bank/month
// We will never approach the limit.
```

