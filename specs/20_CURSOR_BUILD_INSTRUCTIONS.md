# CURSOR BUILD INSTRUCTIONS — PHASE 1
# Cursor v3.1 (April 2026) · Agent Mode · YOLO Mode
# This is the operating manual for the build session.
# Read this first. Then paste the Prime Prompt. Then do not interrupt.

---

## CURSOR VERSION

**Required: Cursor v3.1 or later.**
Check your version: Help → About → Version number.
Download latest from cursor.com if needed.

All instructions in this spec are written for Cursor v3.1 agent behavior
as of April 2026. Earlier versions had different YOLO mode locations.

---

## ONE-TIME SETUP BEFORE THE FIRST PROMPT

Do this once. It persists across sessions.

### Step 1 — Open Agent Mode
```
Cursor sidebar → Composer panel    (Ctrl+I on Windows / Cmd+I on Mac)
Top of the Composer panel → mode selector → choose "Agent"
```

### Step 2 — Enable YOLO Mode

YOLO mode removes all confirmation dialogs. The agent runs commands,
installs packages, creates and deletes files without asking.
Without it, the agent stops every 30 seconds waiting for approval.
This build has 200+ automated steps. YOLO mode is required.

```
Cursor menu → Settings → Features → Agent
  ✓ Enable YOLO mode
  ✓ Auto-run terminal commands
```

If you don't see it there, try:
```
Settings → Features → Chat & Composer → Enable YOLO mode: ON
```

### Step 3 — Set Terminal to Git Bash (Windows only)

Windows CMD breaks many Node and shell commands. Git Bash is required.
Install Git for Windows from git-scm.com if not already installed.

```
Cursor menu → Settings → Terminal → Default Profile → Git Bash
```

### Step 4 — Verify prerequisite tools are installed

Open a terminal in Cursor (Ctrl+`) and run:
```bash
node --version       # Must show 18.x or higher
npm --version        # Must show 9.x or higher  
git --version        # Must be installed
java -version        # Must be 17+ (required for Android Studio Gradle)
```

If node is missing: install from nodejs.org (LTS version)
If java is missing: install from adoptium.net (Temurin 17 LTS, free)

### Step 5 — Verify Android Studio is installed

Android Studio is required to build the APKs via Gradle.
Download from developer.android.com/studio if not installed.
After install, open Android Studio once to complete SDK setup.

Required SDK components (Android Studio → SDK Manager):
```
Android SDK Platform 34 (Android 14)    ← primary target
Android SDK Platform 33 (Android 13)    ← fallback compatibility
Android Build-Tools 34.x.x
Android Emulator (optional but useful for testing)
```

Set ANDROID_HOME environment variable:
```bash
# Windows (run in terminal, then restart terminal)
setx ANDROID_HOME "C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools"
```

### Step 6 — Gather credentials before starting

The agent will ask for these at specific build steps.
Have them ready to paste — do not let the agent wait.

| What | Where to get it | Cost |
|------|----------------|------|
| Firebase config object | console.firebase.google.com → New project → Project Settings → Your apps → Add web app → copy the `firebaseConfig` object | Free |
| Expo account email + password | expo.dev → create account | Free |
| Groq API key | console.groq.com → API Keys → Create API Key | Free, no card |
| GitHub repo URL | github.com/xpliciton3/Imperium (existing repo) | Free |

### Step 7 — Create the project folder and open it

```bash
mkdir C:\SovereignWorks
cd C:\SovereignWorks
git init
git remote add origin https://github.com/xpliciton3/Imperium.git
```

Copy the entire specs/ folder into `C:\SovereignWorks\specs\`

Open in Cursor:
```
File → Open Folder → C:\SovereignWorks
```

---

## THE PRIME PROMPT — PASTE THIS EXACTLY AS THE FIRST MESSAGE

```
Read every file in the specs/ folder before writing any code.

Read order:
1. specs/README.md
2. specs/00_IGNITION.md through specs/21_BUILD_SEQUENCE.md in number order
3. specs/RECIPE_CARDS_v3_1.md
4. specs/MASTER_IMPERIUM.md
5. specs/MASTER_TENDING.md
6. specs/SOVEREIGN_WORKS_MASTER_FEATURE_DOC_v2.md

After reading all 23 files, confirm by listing the five rules from 
00_IGNITION.md that are marked as non-negotiable.

Then begin Phase 1 of the Sovereign Works app. Follow the task list in
21_BUILD_SEQUENCE.md exactly, in order, checking off each item as it completes.

Use Android Studio and Gradle for APK builds.
Use Expo EAS for managed builds when Android Studio alone is insufficient.
Use electron-builder for the Windows setup.exe.

Clear all caches and verify free disk space before building the setup.exe.
Minimum required: 5GB free on the build drive.

Do not stop until every checkbox in 21_BUILD_SEQUENCE.md is checked.
Do not ask for confirmation. Do not wait for approval.
Fix errors and continue. YOLO mode is enabled.
```

---

## ANDROID STUDIO + GRADLE BUILD FLOW

Cursor uses Android Studio's Gradle system to build APKs directly.
This is more reliable than EAS alone and does not require a paid Expo account.

### How Cursor builds the APKs

```bash
# Step 1 — Expo prebuild (generates the Android native project)
cd apps/imperium
npx expo prebuild --platform android --clean

# Step 2 — Gradle build via Android Studio's CLI
cd android
./gradlew assembleRelease    # On Mac/Linux
gradlew.bat assembleRelease  # On Windows

# Output location:
# apps/imperium/android/app/build/outputs/apk/release/app-release.apk
```

Same process for Tending:
```bash
cd apps/tending
npx expo prebuild --platform android --clean
cd android
gradlew.bat assembleRelease
# Output: apps/tending/android/app/build/outputs/apk/release/app-release.apk
```

### EAS as fallback (if Gradle fails)

If Gradle build fails due to signing or environment issues:
```bash
npm install -g eas-cli
eas login    # Use Expo account credentials
cd apps/imperium
eas build --platform android --profile preview --local
# --local flag builds on this machine, not Expo servers
```

### APK signing for release

For sideloaded APKs (installed via QR/direct download), debug signing works fine.
The app does not need Google Play signing for direct APK distribution.

Cursor generates a debug keystore automatically via Gradle.
No manual keystore creation needed for Phase 1 testing.

---

## SETUP.EXE BUILD — FULL SEQUENCE WITH CACHE AND SPACE MANAGEMENT

Cursor executes this entire sequence without stopping.

### Phase A — Space Verification and Cache Clearing

```bash
# Check available disk space (Windows PowerShell)
powershell -Command "(Get-PSDrive C).Free / 1GB"
# If output is less than 5.0 — run the cleanup below before continuing

# Cleanup sequence (run all regardless of space — prevents stale build errors)
cd C:\SovereignWorks\desktop

# 1. Clear npm cache globally
npm cache clean --force

# 2. Clear electron-builder cache
powershell -Command "Remove-Item -Recurse -Force '$env:APPDATA\electron-builder' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force '$env:LOCALAPPDATA\electron-builder' -ErrorAction SilentlyContinue"

# 3. Clear electron download cache
powershell -Command "Remove-Item -Recurse -Force '$env:LOCALAPPDATA\electron\Cache' -ErrorAction SilentlyContinue"

# 4. Clear the local desktop build artifacts
powershell -Command "Remove-Item -Recurse -Force 'dist' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force 'build' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force 'node_modules' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Force 'package-lock.json' -ErrorAction SilentlyContinue"

# 5. Clear Windows temp files (recovers 1-3GB typically)
powershell -Command "Remove-Item -Recurse -Force '$env:TEMP\*' -ErrorAction SilentlyContinue"

# 6. Empty Recycle Bin
powershell -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"

# 7. Recheck space after cleanup
powershell -Command "(Get-PSDrive C).Free / 1GB"
# Must be 5.0 or higher before continuing
```

### Phase B — Fresh Install

```bash
# Fresh dependency install
npm install

# Verify electron-builder is available
npx electron-builder --version
```

### Phase C — Build the setup.exe

```bash
npm run build:win
# This runs: electron-builder --win --x64
# Expected duration: 8-15 minutes
# Expected output size: 80-120MB
# Output path: C:\SovereignWorks\desktop\dist\SovereignWorks-Setup-1.0.0.exe
```

### Phase D — Verify the output

```bash
# Confirm the file exists and is a reasonable size
powershell -Command "(Get-Item 'dist\SovereignWorks-Setup-1.0.0.exe').Length / 1MB"
# Must output a number between 70 and 150
```

If the file is under 10MB: the build failed silently — re-run Phase C.
If the file is over 200MB: something is bundled incorrectly — check electron-builder config.

### electron-builder config in desktop/package.json

```json
{
  "name": "sovereign-works-desktop",
  "version": "1.0.0",
  "description": "Sovereign Works Household Operating System",
  "main": "src/main.js",
  "scripts": {
    "start": "electron .",
    "build:win": "electron-builder --win --x64",
    "build:mac": "electron-builder --mac --universal",
    "build:linux": "electron-builder --linux"
  },
  "build": {
    "appId": "com.sovereignworks.desktop",
    "productName": "Sovereign Works",
    "copyright": "Sovereign Works",
    "directories": {
      "output": "dist",
      "buildResources": "assets"
    },
    "win": {
      "target": [{ "target": "nsis", "arch": ["x64"] }],
      "icon": "assets/icon.ico",
      "requestedExecutionLevel": "asInvoker"
    },
    "nsis": {
      "oneClick": false,
      "perMachine": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "Sovereign Works",
      "installerIcon": "assets/icon.ico",
      "uninstallerIcon": "assets/icon.ico",
      "license": "assets/license.txt"
    },
    "files": [
      "src/**/*",
      "assets/**/*",
      "node_modules/**/*",
      "package.json"
    ],
    "extraResources": [],
    "asar": true
  },
  "dependencies": {
    "electron": "^28.0.0",
    "firebase": "^10.12.0",
    "qrcode": "^1.5.3"
  },
  "devDependencies": {
    "electron-builder": "^24.13.0"
  }
}
```

---


---

## GRADLE CACHE CLEARING — REQUIRED BEFORE EVERY APK BUILD

Gradle caches grow to 5-15GB and contain stale artifacts from all prior builds.
Cursor clears these before every APK build. This prevents "wrong version" errors
and frees space for the current build.

### Full Gradle Cache Clear (Windows)

```bash
# 1. Stop any running Gradle daemons
cd apps/imperium/android
gradlew.bat --stop
cd ../../tending/android
gradlew.bat --stop

# 2. Delete the global Gradle cache (all versions, all projects)
powershell -Command "Remove-Item -Recurse -Force '$env:USERPROFILE\.gradle\caches' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force '$env:USERPROFILE\.gradle\daemon' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force '$env:USERPROFILE\.gradle\wrapper\dists' -ErrorAction SilentlyContinue"

# 3. Delete the local Android build folders (both apps)
powershell -Command "Remove-Item -Recurse -Force 'C:\SovereignWorks\apps\imperium\android\app\build' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force 'C:\SovereignWorks\apps\imperium\android\build' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force 'C:\SovereignWorks\apps\tending\android\app\build' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force 'C:\SovereignWorks\apps\tending\android\build' -ErrorAction SilentlyContinue"

# 4. Delete the Expo prebuild output (forces a clean regeneration)
powershell -Command "Remove-Item -Recurse -Force 'C:\SovereignWorks\apps\imperium\android' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force 'C:\SovereignWorks\apps\tending\android' -ErrorAction SilentlyContinue"

# 5. Delete the Android Studio local caches
powershell -Command "Remove-Item -Recurse -Force '$env:LOCALAPPDATA\Google\AndroidStudio*\caches' -ErrorAction SilentlyContinue"

# 6. Check space after clearing
powershell -Command "(Get-PSDrive C).Free / 1GB"
# Must show 5.0 or higher before continuing to build
```

### Previous Cursor Project Iterations — Full Purge

Cursor writes files to its working directory across sessions. Old iterations
accumulate and consume gigabytes. Run this before starting any build session.

```bash
# Find and delete Cursor's hidden working directories
# These are located in: %APPDATA%\Cursor and %LOCALAPPDATA%\Cursor

# 1. Clear Cursor's file cache (safe — does not affect your project files)
powershell -Command "Remove-Item -Recurse -Force '$env:APPDATA\Cursor\Cache' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force '$env:APPDATA\Cursor\CachedData' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force '$env:APPDATA\Cursor\CachedExtensions' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force '$env:APPDATA\Cursor\Code Cache' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force '$env:APPDATA\Cursor\GPUCache' -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force '$env:LOCALAPPDATA\Cursor\app-*' -ErrorAction SilentlyContinue"

# 2. Clear Cursor's agent workspace scratch files
powershell -Command "Remove-Item -Recurse -Force '$env:APPDATA\Cursor\User\workspaceStorage' -ErrorAction SilentlyContinue"

# 3. Clear any prior npm installs from failed Cursor sessions
# (safe — node_modules will be rebuilt on next npm install)
powershell -Command "Get-ChildItem 'C:\SovereignWorks' -Recurse -Directory -Filter 'node_modules' | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue"

# 4. Clear any leftover .expo directories from prior prebuild attempts
powershell -Command "Get-ChildItem 'C:\SovereignWorks' -Recurse -Directory -Filter '.expo' | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue"

# 5. Check final free space
powershell -Command "(Get-PSDrive C).Free / 1GB"
```

### Minimum Space Requirements

| Build step | Space needed |
|-----------|-------------|
| Gradle dependency download (first time) | ~2 GB |
| Imperium APK build output | ~500 MB |
| Tending APK build output | ~500 MB |
| electron-builder + setup.exe | ~1.5 GB |
| llama.rn model (optional, downloads to phone) | 0 MB on PC |
| **Total minimum free before starting** | **5 GB** |

If under 5GB after cleanup: delete the Downloads folder contents and empty
the Recycle Bin before proceeding.

### Build Order to Minimize Space Usage

1. Clear all caches (above)
2. Verify 5GB+ free
3. Build Imperium APK → upload to GitHub → delete local APK file
4. Clear Gradle build folders again
5. Build Tending APK → upload to GitHub → delete local APK file
6. Clear electron-builder cache
7. Build setup.exe
8. Done

Building APKs one at a time and deleting each before building the next
saves ~1GB of working space.

## WHEN CURSOR GETS STUCK — RECOVERY PROMPTS

**Cursor paused and is waiting:**
```
Continue. YOLO mode is enabled. Do not ask for confirmation. 
Check 21_BUILD_SEQUENCE.md for the next unchecked item and build it.
```

**Build error — generic:**
```
There is a build error. Read the full error message. Identify the cause.
Fix it. Continue building. Do not stop and do not ask for permission.
```

**npm install fails:**
```bash
npm cache clean --force
npm install --legacy-peer-deps
```

**Gradle build fails — permission denied:**
```bash
# Windows: run terminal as Administrator
# Then retry:
cd apps/imperium/android
gradlew.bat assembleRelease
```

**Gradle fails — SDK not found:**
```bash
# Verify ANDROID_HOME is set
echo %ANDROID_HOME%
# If blank, set it:
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
# Restart the terminal and retry
```

**Gradle fails — out of memory:**
```bash
# In apps/imperium/android/gradle.properties, add:
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError
```

**EAS login required:**
```
Run: eas login
Enter the Expo account email and password.
Then retry the EAS build command.
```

**electron-builder fails — NSIS not found:**
```bash
# electron-builder auto-downloads NSIS on first run
# If it fails, manually install NSIS from nsis.sourceforge.io
# Then retry: npm run build:win
```

**setup.exe too small (under 10MB) — silent failure:**
```bash
# Clean and rebuild
npm cache clean --force
powershell -Command "Remove-Item -Recurse -Force 'dist'"
powershell -Command "Remove-Item -Recurse -Force 'node_modules'"
npm install
npm run build:win
```

---

## DO NOT STOP FOR THESE

Cursor continues without pausing for:
- TypeScript errors that do not block compilation
- ESLint/prettier warnings
- Missing optional peer dependencies
- Groq API rate limit — implement retry logic and continue
- Firebase initialization delay — implement retry and continue
- A single failing unit test — log it and move on
- "Module not found" — install the module and retry
- "Port already in use" — kill the port (`npx kill-port 8081`) and retry

Cursor pauses ONLY for:
- A fundamental spec conflict where two files require incompatible architecture
- A missing credential that is truly required and cannot have a placeholder
- An APK build that produces a file confirmed as non-installable

---

## COMPLETION CRITERIA

Phase 1 is complete when all of these are true:

```
□ C:\SovereignWorks\desktop\dist\SovereignWorks-Setup-1.0.0.exe
  exists, is 70-150MB, and installs cleanly on Windows

□ apps/imperium/android/app/build/outputs/apk/release/app-release.apk
  OR Expo EAS Imperium APK — hosted and downloadable via URL

□ apps/tending/android/app/build/outputs/apk/release/app-release.apk
  OR Expo EAS Tending APK — hosted and downloadable via URL

□ Desktop app opens → creates household → generates QR codes → QR codes are scannable

□ Imperium APK installs on Garrin's Android phone

□ Tending APK installs on Holli's Android phone

□ All 60+ checkboxes in 16_PHASE_DEFINITIONS.md verified
```

When complete: confirm and request Phase 2 spec files.

