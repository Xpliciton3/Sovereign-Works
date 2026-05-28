# FIX 11 — TOOL INSTALLATION MANIFEST + LAYER 2/3 HANDOFF
# Cursor must install ALL required tools before writing a single line of code.
# Layer 2 has been completed per prior build. This file defines:
# (A) Every tool that must be installed for the full project
# (B) What "Layer 2 complete" means exactly
# (C) Where Layer 3 picks up (with FIX files applied first)

---

# PART A — COMPLETE TOOL INSTALLATION MANIFEST

Run this BEFORE touching any source code. Every item here is required.

---

## SYSTEM REQUIREMENTS

```bash
# Verify Node.js ≥ 18
node --version       # must be ≥ 18.0.0

# Verify Java 17 (required for Android builds)
java --version       # must be 17.x

# Verify Android SDK
echo $ANDROID_HOME   # must be set
# Android Build Tools 34, Platform 34 must be installed

# Verify Gradle
gradle --version     # must be ≥ 8.0 (or use gradlew wrapper)

# Verify Git
git --version
```

---

## GLOBAL TOOLS

```bash
# Expo CLI
npm install -g @expo/cli

# EAS CLI (builds APKs)
npm install -g eas-cli
eas login   # login with Expo account

# React Native Community CLI (optional but recommended)
npm install -g @react-native-community/cli
```

---

## MONOREPO SETUP

```bash
# From repo root — installs ALL workspaces
npm install

# Verify workspaces
ls apps/           # should show: imperium/  tending/  tending-wear/
ls packages/       # should show: shared/
```

---

## FIREBASE

```bash
# Firebase CLI
npm install -g firebase-tools
firebase login
firebase init    # if not already initialized

# Firebase project: SOVEREIGN_WORKS (already configured)
# Rules file: firebase.rules (already written per 02_FIREBASE_SCHEMA.md)
```

---

## ANDROID BUILD DEPENDENCIES

```bash
# In apps/imperium/ and apps/tending/:
cd apps/imperium && npm install

# Android native dependencies — run ONCE after npm install
cd android && ./gradlew clean
cd ..

cd apps/tending && npm install
cd android && ./gradlew clean
cd ..
```

---

## REACT NATIVE PACKAGES (MUST BE IN BOTH APPS)

```bash
# Navigation
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# Storage
npm install @react-native-async-storage/async-storage
npm install react-native-sqlite-storage

# Firebase
npm install @react-native-firebase/app @react-native-firebase/database

# Notifications (Layer 3)
npm install @notifee/react-native
cd android && ./gradlew app:assembleDebug && cd ..

# Icons and SVG
npm install react-native-svg
npm install @expo/vector-icons

# Scheduler / Alarms (Layer 3)
npm install react-native-alarm-manager  # or AlarmManagerModule

# Voice / Audio (Layer 5)
npm install react-native-whisper
npm install @tflite/react-native-tflite-task

# Widget (Layer 5)
npm install react-native-android-widget

# QR Code (Layer 4 + Layer 8)
npm install react-native-qrcode-svg

# Charts (Layer 7)
npm install victory-native

# AI (all layers)
# Groq API — no package needed, uses native fetch
# Store API key in encrypted AsyncStorage only
```

---

## WEAR OS DEPENDENCIES (TENDING APP — FIX 08)

```bash
# apps/tending/android/app/build.gradle — add:
implementation 'com.google.android.gms:play-services-wearable:18.1.0'

# apps/tending-wear/build.gradle — create module with:
implementation 'androidx.wear.compose:compose-material:1.2.1'
implementation 'androidx.wear.tiles:tiles:1.2.1'
implementation 'androidx.wear.tiles:tiles-material:1.2.1'
implementation 'com.google.android.gms:play-services-wearable:18.1.0'
```

---

## GARMIN CONNECT IQ (IMPERIUM ONLY — LAYER 9)

```
Download: https://developer.garmin.com/connect-iq/sdk/
Install: Garmin Connect IQ SDK 4.2.4+
Add to PATH: $CIQ_HOME/bin
Verify: monkeyc --version
Target device: vivoactive4 (device ID: vivoactive4)
```

---

## ELECTRON (LAYER 8)

```bash
cd apps/desktop
npm install electron electron-builder
npm install electron-updater  # for auto-update
npm install qrcode             # for QR code generation
```

---

## VERIFY COMPLETE INSTALLATION

```bash
# Run from repo root
node scripts/verify-install.js

# This script checks:
# - All required packages present in each app
# - Firebase config files exist
# - Android SDK tools available
# - Node/Java version requirements met
# - EAS logged in
# - Garmin SDK available (warns if not — Layer 9 only)
```

Cursor must CREATE this verify-install.js script if it does not exist.

---

# PART B — LAYER 2 COMPLETION BASELINE

Layer 2 is considered complete when ALL of the following are confirmed:

```
[x] L2.01  Project scaffold — apps/imperium/, apps/tending/, packages/shared/
[x] L2.02  TypeScript interfaces (17_HOOKS_AND_EXPANSION.md)
[x] L2.03  Color constants (TH object from sovereign_v9.jsx)
[x] L2.04  Firebase config + writeShared() + drainSyncQueue()
[x] L2.05  SQLite schema (all tables from 02_FIREBASE_SCHEMA.md)
[x] L2.06  Recipe data imported → recipes.ts (ALL recipes from RECIPE_CARDS_v3_1.md)
[x] L2.07  Quote fallback bank → quotes.ts (30 per tradition)
[x] L2.08  Imperium content → imperium-content.ts
[x] L2.09  Tending content → tending-content.ts
[x] L2.10  useCart hook
[x] L2.11  useHydration hook
[x] L2.12  useMood hook
[x] L2.13  useSchedule hook
[x] L2.14  usePlanner hook
[x] L2.15  Bottom tab navigator — 4 tabs each app
[x] L2.16  Home tab — matches sovereign_v9.jsx exactly
[x] L2.17  Planner tab → Today sub-tab
[x] L2.18  Nourish tab → Plan sub-tab
[x] L2.19  Nourish tab → Grocery sub-tab
[x] L2.20  Mood modal
[x] L2.21  Overtime modal
[x] L2.22  Hydration tracker in Body hub
[x] L2.23  Mind + Soul hub stubs
[x] L2.24  AI model folder scaffold (packages/shared/ai/)
[x] APK built and installed on test device — BOTH apps
```

---

# PART C — WHAT MUST BE APPLIED BEFORE LAYER 3 BEGINS

Apply these FIX files BEFORE starting Layer 3. In this order:

1. **FIX_01_ICONS_AND_VISUAL_MATCH.md** — Icons and visual matching
2. **FIX_02_MOOD_GROQ_TRANSLATION.md** — Mood note Groq translation
3. **FIX_03_WORK_SCHEDULER.md** — Shift strip and 2-2-3 pattern
4. **FIX_04_05_06_STRUCTURE.md** — Tab structure, invented locks, bad URLs
5. **FIX_07_PLANNER_HOME_IMPROVEMENTS.md** — Planner expansion
6. **FIX_09_GROQ_SHIFT_PLANNER.md** — Shift-aware planner (Groq)
7. **FIX_10_RECIPE_ALTERNATIVES.md** — Dietary alternatives

Rebuild both APKs after all FIX files are applied. Install and verify before Layer 3.

**FIX_08_SAMSUNG_GALAXY_WATCH.md** — Apply during Layer 5 (same layer as Garmin).
All other FIX files before Layer 3.

---

## CONFIRMING LAYER 3 IS READY

Before typing the first line of Layer 3 code, confirm:

```
[ ] All FIX_01–FIX_07, FIX_09, FIX_10 applied and verified
[ ] Both APKs rebuilt with fixes
[ ] APKs installed on test device
[ ] Icons render correctly (FIX_01 verified)
[ ] Shift strip shows correct data (FIX_03 verified)
[ ] Tab structure is 4 tabs only (FIX_04 verified)
[ ] Mood Groq translation fires (FIX_02 verified)
[ ] Dietary profile section exists in Settings (FIX_10 verified)
[ ] Shift planner generates Groq schedule for current shift type (FIX_09 verified)
[ ] All tools installed per Part A of this file
```

Only then open LAYER3_PRIME_PROMPT.md.
