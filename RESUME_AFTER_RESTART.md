# Resume After Restart — Sovereign Works

**Paused:** 2026-05-25  
**Project:** `C:\SovereignWorks`  
**Open this folder in Cursor after reboot.**

---

## What is done

| Item | Status |
|------|--------|
| Firebase DB + rules + Anonymous Auth | Done |
| `.env` in `apps/imperium` and `apps/tending` | Done |
| Imperium release APK | **Done** → `dist\sovereign-imperium-v1.0.0.apk` (~91 MB) |
| Tending app code (separate from Imperium) | Verified vs Phase 1 specs |
| Git repo + first commit | Done (`master`, remote `origin` → github.com/xpliciton3/Imperium) |
| GitHub push / Release | **Not done** |

## What is not done

| Item | Status |
|------|--------|
| Tending release APK | **Done** → `dist\sovereign-tending-v1.0.0.apk` (~39 MB, `com.sovereignworks.tending`) |
| Git push to GitHub | Not pushed |
| GitHub Release v1.0.0 with both APKs | Ready — run steps in `GITHUB_RELEASE_INSTRUCTIONS.md` |

---

## After restart — do this first

1. **Open Cursor** → `File → Open Folder` → `C:\SovereignWorks`
2. **Restart terminal** so `git` is on PATH (Git is at `C:\Program Files\Git\bin\git.exe`)
3. Tell Cursor:

```
Read RESUME_AFTER_RESTART.md and continue from "Next build step".
Build only Tending APK (do not copy Imperium). Then copy to dist\sovereign-tending-v1.0.0.apk.
Follow GITHUB_RELEASE_INSTRUCTIONS.md for push and release when both APKs exist.
```

---

## Next build step (Tending only)

Close other heavy apps first. Imperium is already built — **do not rebuild unless fixing a bug.**

```powershell
cd C:\SovereignWorks\apps\tending\android
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:GRADLE_USER_HOME = "C:\gcache"
$env:GRADLE_OPTS = "-Xmx2048m -XX:MaxMetaspaceSize=384m"

# If android folder missing, run from apps\tending first:
# npx expo prebuild --platform android

.\gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a
```

If OOM again, try one arch only:

```powershell
.\gradlew.bat assembleRelease -PreactNativeArchitectures=armeabi-v7a
```

On success:

```powershell
New-Item -ItemType Directory -Force -Path C:\SovereignWorks\dist | Out-Null
Copy-Item "C:\SovereignWorks\apps\tending\android\app\build\outputs\apk\release\app-release.apk" `
  "C:\SovereignWorks\dist\sovereign-tending-v1.0.0.apk"
```

---

## Git + GitHub (after both APKs in `dist\`)

See full steps in **`GITHUB_RELEASE_INSTRUCTIONS.md`**.

Quick version:

```powershell
cd C:\SovereignWorks
git config user.email "you@example.com"   # if commit failed with "Author identity unknown"
git config user.name "Your Name"
git push -u origin master

gh release create v1.0.0 `
  dist/sovereign-imperium-v1.0.0.apk `
  dist/sovereign-tending-v1.0.0.apk `
  --title "Sovereign Works v1.0.0" `
  --notes "Phase 1 APKs: Imperium + Tending"
```

Download URLs (after release):

- https://github.com/xpliciton3/Imperium/releases/download/v1.0.0/sovereign-imperium-v1.0.0.apk
- https://github.com/xpliciton3/Imperium/releases/download/v1.0.0/sovereign-tending-v1.0.0.apk

---

## Specs reference

Original instructions: `C:\Users\holli\OneDrive\Desktop\SOVEREIGN_WORKS_PHASE1`  
Copied into project: `C:\SovereignWorks\specs\`  
Build progress tracker: `specs\21_BUILD_SEQUENCE.md`

---

## Important reminders

- **Tending ≠ Imperium** — separate apps, separate APKs, different onboarding/tabs/colors.
- **Never** rename Imperium APK as Tending.
- `.env` files are local only (gitignored).
