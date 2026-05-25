# UPDATE PIPELINE — HOW TO BUILD ON PHASE 1
# Read this after Phase 1 is complete and both APKs are installed.
# This is the system for pushing updates, adding phases, and not breaking what works.

---

## STEP 1 — CREATE THE GITHUB REPO (do this before handing to Cursor)

If the repo does not exist yet:

1. Go to github.com and sign in
2. Click the + icon → New repository
3. Name it: `SovereignWorks`
4. Set it to: Private (your household data structure is here)
5. Do NOT initialize with README — you will push the existing code
6. Click Create repository
7. Copy the URL shown — it will look like: `https://github.com/YOUR_USERNAME/SovereignWorks.git`

Then in terminal (or tell Cursor to do this):
```bash
cd C:\SovereignWorks
git init
git remote add origin https://github.com/YOUR_USERNAME/SovereignWorks.git
git branch -M main
git add .
git commit -m "Phase 1 initial build"
git push -u origin main
```

Cursor does this automatically if you include it in the Prime Prompt.
Add this line to the end of the Prime Prompt in 20_CURSOR_BUILD_INSTRUCTIONS.md:

```
After Phase 1 is verified complete, initialize a git repo in C:\SovereignWorks,
commit all files, and push to: https://github.com/YOUR_USERNAME/SovereignWorks.git
```

---

## HOW UPDATES WORK AFTER PHASE 1

### The two-track system

**Track 1 — OTA (Over The Air) — small updates, no reinstall needed**
- Changed text, fixed bugs, new quotes, UI tweaks, small feature additions
- Uses Expo Updates — the app checks for updates on launch
- User opens the app → update downloads in background → next open has the update
- No QR code. No new APK. Fully automatic.

**Track 2 — New APK — major changes, new permissions, new native features**
- New tabs (Phase 2, 3, etc.), alarm system changes, new Android permissions
- Requires a new APK build and reinstall
- Same process as Phase 1: build → upload to GitHub Releases → user downloads and installs
- The existing household connection and data carry over — no data loss on reinstall

---

## EXPO UPDATES SETUP (Cursor configures this in Phase 1)

Expo Updates is already in the Phase 1 build spec (14_ONBOARDING_TOUR.md).
After Phase 1 is complete, Cursor will have configured:

```json
// apps/imperium/app.json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/YOUR_PROJECT_ID",
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

To push an OTA update:
```bash
cd C:\SovereignWorks
npx expo publish --platform android
```

This pushes to both apps simultaneously if you run it from the monorepo root.
Users get the update the next time they open the app.

---

## ADDING PHASE 2 (Warrior + Keep Yourself)

When Phase 1 is solid and both of you have tested it for at least a week:

1. Start a new conversation with Claude
2. Say: "Phase 1 is complete. I need Phase 2 spec files. The build is in the SovereignWorks GitHub repo."
3. Claude produces the Phase 2 spec files
4. Copy them into `C:\SovereignWorks\specs\`
5. Open Cursor and paste this prompt:

```
Read all files in the specs/ folder.
Phase 1 is complete — do not rebuild it.
The existing code is in this repo.
Build Phase 2 additions only, as described in the new spec files.
Hook architecture is already in place — use it.
Push to GitHub when Phase 2 is complete.
YOLO mode enabled. Do not stop.
```

Cursor reads the hook architecture (17_HOOKS_AND_EXPANSION.md), finds the locked tab
placeholders, and fills them in without touching anything else.

---

## GIT WORKFLOW FOR ONGOING DEVELOPMENT

### Branch per phase (recommended)
```bash
# Start Phase 2
git checkout -b phase-2-warrior
# ... Cursor builds Phase 2 ...
git add .
git commit -m "Phase 2: Warrior Practice + Keep Yourself"
git push origin phase-2-warrior
# When tested and confirmed:
git checkout main
git merge phase-2-warrior
git push origin main
```

### What to commit
- All spec files from Claude
- All source code Cursor writes
- Do NOT commit: `node_modules/`, `.expo/`, `android/`, APK files, `.env` files

### .gitignore (Cursor creates this)
```
node_modules/
.expo/
android/
ios/
*.apk
*.aab
.env
.env.local
dist/
```

---

## PROTECTING FIREBASE CREDENTIALS

The Firebase config object (apiKey, projectId, etc.) should NOT be committed to GitHub.

Cursor stores it in an environment variable file:
```bash
# C:\SovereignWorks\.env (NOT committed)
FIREBASE_API_KEY=your_key_here
FIREBASE_PROJECT_ID=sovereign-works-v4
FIREBASE_DATABASE_URL=https://sovereign-works-v4-default-rtdb.firebaseio.com/
GROQ_API_KEY=your_groq_key_here
```

The app reads these via `expo-constants` or `react-native-dotenv`.
If the repo is private, the risk is low — but still good practice.

---

## APK VERSION MANAGEMENT

Every new APK build gets a version bump. Cursor handles this automatically.

```json
// app.json
{
  "expo": {
    "version": "1.0.0",        // shown to users
    "android": {
      "versionCode": 1         // increments with every APK build
    }
  }
}
```

Build sequence:
1. Bump `versionCode` by 1
2. Run `gradlew.bat assembleRelease`
3. Rename APK: `sovereign-imperium-v1.1.0.apk`
4. Upload to GitHub Releases (create a new Release for each APK version)
5. Share the new download URL via text/Signal — user downloads and installs over the existing app
6. All data and household connection carry over

---

## TELLING CURSOR WHICH PHASE TO BUILD

Always start a Cursor session by telling it exactly what exists and what to add.
Never ask it to rebuild from scratch after Phase 1.

Template for future Cursor sessions:
```
The SovereignWorks project is at: https://github.com/YOUR_USERNAME/SovereignWorks
Phase 1 is complete and both APKs are installed on both phones.

Do not modify any Phase 1 code unless fixing a confirmed bug.
Read the new spec files I have added to the specs/ folder.
Build [PHASE NAME] using the existing hook architecture.
Test that Phase 1 features still work after your additions.
Push to GitHub when done.
YOLO mode enabled.
```

---

## PHASE BUILD ORDER (for reference)

| Phase | Content | Estimated Cursor time |
|-------|---------|----------------------|
| Phase 1 | Core app, planner, alarm, mood, nourish, calendar | Complete |
| Phase 2 | Warrior Practice (Garrin) + Keep Yourself (Holli) | 15–20 hrs |
| Phase 3 | Doctrine tab — Six Pieces for both traditions | 10–15 hrs |
| Phase 4 | Household tab + Holy Days | 10–12 hrs |
| Phase 5 | Vel'nar language tutor (Garrin) + The Book + Rite | 20–25 hrs |

Each phase adds to the existing app without touching what works.
The locked tab hooks are already in place — Cursor just fills them in.

---

## IF SOMETHING BREAKS AFTER AN UPDATE

```bash
# Roll back to the last working commit
git log --oneline        # find the last good commit hash
git checkout abc1234     # replace with that hash
# rebuild and reinstall the APK from that point
```

Or if it was an OTA update that broke something:
```bash
# Roll back the OTA channel
npx expo publish --channel default --message "rollback"
# Users get the previous version on next app open
```

