# HOUSEHOLD JOIN FLOW — REPLACES ALL PREVIOUS DESKTOP/ONBOARDING SPECS
# No Electron app. No setup.exe. No QR codes. No Play Store.
# Two APKs downloaded directly. Joined by 6-digit code inside the app.

---

## APK DISTRIBUTION

Both APKs are built and uploaded to GitHub Releases:
`https://github.com/xpliciton3/Imperium/releases`

Imperium APK filename: `sovereign-imperium-v1.0.0.apk`
Tending APK filename: `sovereign-tending-v1.0.0.apk`

Users download the correct APK directly from the URL.
Android will show "Install from unknown sources" warning — this is expected.
User enables "Install unknown apps" for their browser in Android Settings once, then installs.

Build commands:
```bash
# Imperium APK
cd apps/imperium
npx expo prebuild --platform android --clean
cd android
gradlew.bat assembleRelease   # Windows
# Output: apps/imperium/android/app/build/outputs/apk/release/app-release.apk

# Tending APK
cd apps/tending
npx expo prebuild --platform android --clean
cd android
gradlew.bat assembleRelease
# Output: apps/tending/android/app/build/outputs/apk/release/app-release.apk
```

---

## FIRST LAUNCH — IMPERIUM (Garrin installs first)

### Screen 1 — Welcome
```
[Imperium sigil — centered, gold on black]

THE IMPERIUM
Uncrowned Operating System

[Create Household]
[Join Existing Household]
```

### Screen 2 — Create Household (Garrin's path)
```
NAME YOUR HOUSEHOLD

This connects both phones to the same system.

[________________________]
e.g. Bane

[Create →]
```

On tap Create:
- Creates Firebase document at `households/{auto-generated-id}`
- Writes: `householdName`, `createdAt`, `joinCode` (6 random digits, expires 48hrs)
- Writes member: `members/imperium` with `profile: "imperium"`, `joinedAt`, `deviceToken`
- Stores `householdId` and `profile: "imperium"` in AsyncStorage on device

### Screen 3 — Household Created
```
THE BANE HOUSEHOLD

Your household is ready.

Share this code with Holli so she can join:

        847-291

[Copy Code]   [Share via Text]

────────────────────────────────────────
Waiting for Holli to join...

[Skip for now — continue solo]
```

"Share via Text" opens the native share sheet with pre-written message:
"Download The Tending app at [URL] and use code 847-291 to join our household."

"Skip for now" proceeds to the guided tour without waiting.
Once Holli joins, the app detects it via Firebase listener and updates immediately.

---

## FIRST LAUNCH — TENDING (Holli installs second)

### Screen 1 — Welcome
```
[Tending sigil — centered, rose on dark]

THE TENDING
Unspent Operating System

[Join Existing Household]
[Create New Household]
```

### Screen 2 — Join Household (Holli's path)
```
JOIN YOUR HOUSEHOLD

Enter the code Garrin shared with you.

[8] [4] [7] [-] [2] [9] [1]
  ↑ Six-digit entry — large tap targets

[Join →]
```

On tap Join:
- Queries Firebase for household where `joinCode == "847291"`
- If found and not expired: writes `members/tending` to that household document
- Stores `householdId` and `profile: "tending"` in AsyncStorage
- Proceeds to guided tour

If code not found: "Code not found. Ask Garrin to check the code or generate a new one."
If code expired (48hrs): "This code has expired. Ask Garrin to generate a new one from Settings."

---

## CODE REGENERATION (in Settings)

Settings → Household → Regenerate Join Code

Generates a new 6-digit code, resets 48-hour expiry, displays it on screen.
Used when Holli needs to reinstall the app, or the original code expired.

---

## FIREBASE HOUSEHOLD SCHEMA (from 02_FIREBASE_SCHEMA.md)

```
households/
  {householdId}/
    householdName: "Bane"
    createdAt: 1234567890
    joinCode: "847291"
    joinCodeExpiry: 1234567890   ← timestamp 48hrs after creation
    members/
      imperium/
        profile: "imperium"
        personName: "Garrin"
        deviceToken: "..."
        joinedAt: 1234567890
      tending/
        profile: "tending"
        personName: "Holli"
        deviceToken: "..."
        joinedAt: 1234567890
```

---

## ANONYMOUS AUTH FLOW

Firebase Anonymous Auth — no email, no password, no account creation.

```typescript
import { getAuth, signInAnonymously } from 'firebase/auth';

// On app first launch, before anything else:
async function initAuth(): Promise<void> {
  const auth = getAuth();
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
  // Auth UID is now available — used for Firebase security rules
}
```

Security rules allow read/write only when `auth.uid != null`.
The anonymous UID is stored on the device. If the app is uninstalled and reinstalled,
a new anonymous UID is generated — the user rejoins via the 6-digit code.

---

## WHAT REPLACES THE ELECTRON DESKTOP APP

Nothing. There is no desktop app in Phase 1.

If Garrin wants to view the household data on a computer, he can use the Firebase console directly:
`https://console.firebase.google.com/project/sovereign-works-v4/database`

A desktop admin panel (Electron) can be added in a future phase if needed.
It is not required for Phase 1.

