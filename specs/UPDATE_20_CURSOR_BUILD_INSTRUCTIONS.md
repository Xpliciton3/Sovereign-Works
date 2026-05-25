# CURSOR BUILD INSTRUCTIONS — PHASE 1
# Cursor v3.1 · Agent Mode · YOLO Mode
# Read this completely before starting any build session.

---

## BEFORE YOU START — FIVE THINGS TO HAVE READY

1. **Firebase config object**
   Go to: https://console.firebase.google.com/project/sovereign-works-v4/overview
   → Project Settings → Your apps → Add web app → copy the `firebaseConfig` object
   You will paste this when the build reaches Firebase setup.

2. **Groq API key**
   Go to: https://console.groq.com → API Keys → Create
   Free. No credit card. Paste when the build reaches mood translation and quote generation.

3. **Expo account**
   Go to: https://expo.dev → create free account
   Required for EAS build. Paste email/password when the build reaches APK build step.

4. **Android Studio installed**
   Download from: developer.android.com/studio
   Open it once after install to complete SDK setup.
   Required SDK: Android SDK Platform 34, Build-Tools 34.x.x
   Set environment variable: `ANDROID_HOME = C:\Users\YOUR_NAME\AppData\Local\Android\Sdk`

5. **Node.js 18+ installed**
   Download from: nodejs.org (LTS version)
   Verify: `node --version` must show 18.x or higher

---

## CURSOR SETUP — DO THIS ONCE

```
1. Open Cursor
2. Composer panel: Ctrl+I
3. Mode selector at top of panel → "Agent"
4. Settings → Features → Agent → YOLO mode: ON
5. Settings → Features → Agent → Auto-run: ON
6. Settings → Terminal → Default Profile → Git Bash (Windows)
```

---

## PROJECT FOLDER SETUP

```bash
mkdir C:\SovereignWorks
cd C:\SovereignWorks
git init
git remote add origin https://github.com/xpliciton3/Imperium.git
```

Place these files inside `C:\SovereignWorks\specs\`:
- All numbered spec files (00 through 21)
- sovereign_v7.jsx (the prototype — this is the visual reference)
- RECIPE_CARDS_v3_1.md
- MASTER_IMPERIUM.md
- MASTER_TENDING.md

Open `C:\SovereignWorks` in Cursor.

---

## THE PRIME PROMPT — PASTE THIS EXACTLY

```
Read every file in the specs/ folder completely before writing any code.

Read order:
1. specs/UPDATE_00_IGNITION.md          ← start here
2. specs/UPDATE_04_HOUSEHOLD_JOIN.md    ← replaces old desktop onboarding
3. specs/UPDATE_20_CURSOR_BUILD_INSTRUCTIONS.md  ← this file
4. specs/02_FIREBASE_SCHEMA.md
5. specs/03_PROFILES.md
6. specs/05_SHIFT_SLEEP_SCHEDULER.md
7. specs/06_CALENDAR_PLANNER.md
8. specs/07_ALARM_SYSTEM.md
9. specs/08_MOOD_SYSTEM.md
10. specs/09_DAILY_QUOTE.md
11. specs/10_HYDRATION.md
12. specs/11_NOURISH.md
13. specs/12_SETTINGS.md
14. specs/13_WIDGET.md
15. specs/14_ONBOARDING_TOUR.md
16. specs/15_VISUAL_DESIGN.md
17. specs/16_PHASE_DEFINITIONS.md
18. specs/17_HOOKS_AND_EXPANSION.md
19. specs/18_TAB_MANIFEST.md
20. specs/19_PHONE_SETUP_TUTORIAL.md
21. specs/21_BUILD_SEQUENCE.md
22. specs/RECIPE_CARDS_v3_1.md          ← source data, read-only
23. specs/MASTER_IMPERIUM.md            ← source data, read-only
24. specs/MASTER_TENDING.md             ← source data, read-only

Then open and run sovereign_v7.jsx. This is the visual and behavioral contract.
Every screen you build must match it exactly. Do not invent UI not shown in the prototype.

Firebase project: sovereign-works-v4
Firebase Realtime Database URL: https://sovereign-works-v4-default-rtdb.firebaseio.com/

There is no Electron app. There is no setup.exe.
Household join is done by 6-digit code inside the app — see UPDATE_04_HOUSEHOLD_JOIN.md.

APKs are built with Android Studio + Gradle and distributed via direct GitHub Releases URL.
No Play Store.

Begin building in the order specified in 21_BUILD_SEQUENCE.md.
Do not stop until every checkbox in 21_BUILD_SEQUENCE.md is checked.
Do not ask for permission. Do not ask for confirmation. Fix errors and continue.
YOLO mode is enabled.
```

---

## FIREBASE SETUP

Firebase project already exists: `sovereign-works-v4`

Enable in Firebase console before building:
1. Realtime Database → Create database → Start in test mode
2. Authentication → Sign-in method → Anonymous → Enable
3. Project Settings → Your apps → Add web app → copy firebaseConfig

```typescript
// packages/shared/firebase/config.ts
// Paste the firebaseConfig object here:
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // PASTE YOUR CONFIG HERE — retrieve from Firebase console
  // https://console.firebase.google.com/project/sovereign-works-v4/settings/general
  apiKey: "...",
  authDomain: "sovereign-works-v4.firebaseapp.com",
  databaseURL: "https://sovereign-works-v4-default-rtdb.firebaseio.com",
  projectId: "sovereign-works-v4",
  storageBucket: "sovereign-works-v4.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
```

---

## GRADLE CACHE CLEARING — RUN BEFORE EVERY APK BUILD

```bash
# Stop running Gradle daemons
cd C:\SovereignWorks\apps\imperium\android
gradlew.bat --stop

# Clear global Gradle cache (can be 5-15GB of stale data)
powershell -Command "Remove-Item -Recurse -Force '$env:USERPROFILE\.gradle\caches' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force '$env:USERPROFILE\.gradle\daemon' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force '$env:USERPROFILE\.gradle\wrapper\dists' -ErrorAction SilentlyContinue"

# Clear local build folders
powershell -Command "Remove-Item -Recurse -Force 'C:\SovereignWorks\apps\imperium\android\app\build' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force 'C:\SovereignWorks\apps\imperium\android\build' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force 'C:\SovereignWorks\apps\imperium\android' -ErrorAction SilentlyContinue"

# Clear Cursor's own cache (hidden files that accumulate across sessions)
powershell -Command "Remove-Item -Recurse -Force '$env:APPDATA\Cursor\Cache' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force '$env:APPDATA\Cursor\CachedData' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force '$env:APPDATA\Cursor\Code Cache' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force '$env:APPDATA\Cursor\GPUCache' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force '$env:APPDATA\Cursor\User\workspaceStorage' -ErrorAction SilentlyContinue"

# Clear all prior node_modules and .expo directories
powershell -Command "Get-ChildItem 'C:\SovereignWorks' -Recurse -Directory -Filter 'node_modules' | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue"
powershell -Command "Get-ChildItem 'C:\SovereignWorks' -Recurse -Directory -Filter '.expo' | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue"

# Clear Windows temp
powershell -Command "Remove-Item -Recurse -Force '$env:TEMP\*' -ErrorAction SilentlyContinue"
powershell -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"

# Verify free space — must be 5GB or more before building
powershell -Command "(Get-PSDrive C).Free / 1GB"
```

---

## APK BUILD COMMANDS

```bash
# Build Imperium APK
cd C:\SovereignWorks\apps\imperium
npx expo prebuild --platform android --clean
cd android
gradlew.bat assembleRelease
# APK: apps/imperium/android/app/build/outputs/apk/release/app-release.apk

# Rename and upload to GitHub Releases
# Rename to: sovereign-imperium-v1.0.0.apk
# Upload to: https://github.com/xpliciton3/Imperium/releases

# Clear Gradle cache between builds (repeat the cache-clear block above)

# Build Tending APK
cd C:\SovereignWorks\apps\tending
npx expo prebuild --platform android --clean
cd android
gradlew.bat assembleRelease
# APK: apps/tending/android/app/build/outputs/apk/release/app-release.apk
# Rename to: sovereign-tending-v1.0.0.apk
# Upload to same GitHub Releases page
```

---

## WHEN CURSOR GETS STUCK

**If it pauses and waits:**
```
Continue. YOLO mode is on. Check 21_BUILD_SEQUENCE.md for the next
unchecked item. Build it. Do not stop.
```

**If there is a build error:**
```
Read the full error. Identify the cause. Fix it. Continue building.
Do not ask for permission.
```

**If Gradle fails — out of memory:**
Add to `apps/imperium/android/gradle.properties`:
```
org.gradle.jvmargs=-Xmx4096m -XX:+HeapDumpOnOutOfMemoryError
```

**If Gradle fails — SDK not found:**
```bash
echo %ANDROID_HOME%
# If blank:
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
# Restart terminal and retry
```

**If npm install fails:**
```bash
npm cache clean --force
npm install --legacy-peer-deps
```

---

## PHASE 1 COMPLETE WHEN

```
□ Imperium APK installs on Garrin's Android phone from direct URL
□ Tending APK installs on Holli's Android phone from direct URL
□ Garrin creates household — 6-digit code appears on screen
□ Holli enters the code — both phones connect to sovereign-works-v4 Firebase
□ Shared calendar event added by Garrin appears on Holli's phone
□ Alarm fires at max volume on both phones
□ Are You Awake screen locks both phones completely
□ Every item in the home screen checklist expands with full instructions
□ Add to Cart adds ingredients to the shared grocery list
□ All 60+ checkboxes in 16_PHASE_DEFINITIONS.md confirmed
```

When all checked: Phase 1 is done. Request Phase 2 files.

