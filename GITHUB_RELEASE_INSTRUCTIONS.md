# GitHub Release Instructions — Sovereign Works v1.0.0

Target repository: **https://github.com/xpliciton3/Imperium**

Release assets (upload both APKs):

| File | Source after build |
|------|-------------------|
| `sovereign-imperium-v1.0.0.apk` | `apps/imperium/android/app/build/outputs/apk/release/app-release.apk` |
| `sovereign-tending-v1.0.0.apk` | `apps/tending/android/app/build/outputs/apk/release/app-release.apk` |

Local copies for sideload testing: `C:\SovereignWorks\dist\` (gitignored).

---

## 1. One-time: Create the GitHub repository

If the repo does not exist yet:

1. Open https://github.com/new
2. Owner: **xpliciton3**
3. Repository name: **Imperium**
4. Visibility: **Private** (recommended) or Public
5. Do **not** add a README, .gitignore, or license (this project already has them)
6. Create repository

---

## 2. One-time: Install and authenticate GitHub CLI

```powershell
winget install GitHub.cli
```

Restart the terminal, then:

```powershell
gh auth login
```

Choose: GitHub.com → HTTPS → Login with browser → authorize.

Verify:

```powershell
gh auth status
```

---

## 3. One-time: Initialize git in the project (if not already done)

From **Git Bash** or PowerShell:

```powershell
cd C:\SovereignWorks
& "C:\Program Files\Git\bin\git.exe" init
& "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/xpliciton3/Imperium.git
```

If `origin` already exists, skip `remote add` or run:

```powershell
& "C:\Program Files\Git\bin\git.exe" remote set-url origin https://github.com/xpliciton3/Imperium.git
```

`.env` files and `dist/*.apk` are gitignored — keep Firebase keys local only.

---

## 4. Build both APKs (Windows)

**Requirements:** Node 18+, Java 17 (Temurin), Android SDK, 8GB+ RAM recommended for native compile.

Set environment (each new terminal):

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:GRADLE_USER_HOME = "C:\g"   # short path avoids Windows 260-char limit
```

### Imperium (Garrin — install first)

```powershell
cd C:\SovereignWorks\apps\imperium
npx expo prebuild --platform android --clean
cd android
.\gradlew.bat assembleRelease
Copy-Item .\app\build\outputs\apk\release\app-release.apk C:\SovereignWorks\dist\sovereign-imperium-v1.0.0.apk
```

### Tending (Holli — separate app, do not copy Imperium APK)

```powershell
cd C:\SovereignWorks\apps\tending
npx expo prebuild --platform android --clean
cd android
.\gradlew.bat assembleRelease
Copy-Item .\app\build\outputs\apk\release\app-release.apk C:\SovereignWorks\dist\sovereign-tending-v1.0.0.apk
```

**Low-RAM machines (3–4GB):** If Gradle or `clang++` fails with “not enough memory” or “paging file too small”, close other apps, increase Windows virtual memory, or build on a machine with more RAM. Optional: in `apps/tending/android/gradle.properties` temporarily set `org.gradle.parallel=false`, `org.gradle.workers.max=1`, and `reactNativeArchitectures=armeabi-v7a,arm64-v8a` only.

Verify package names:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\build-tools\34.0.0\aapt.exe" dump badging C:\SovereignWorks\dist\sovereign-imperium-v1.0.0.apk | findstr package
& "$env:LOCALAPPDATA\Android\Sdk\build-tools\34.0.0\aapt.exe" dump badging C:\SovereignWorks\dist\sovereign-tending-v1.0.0.apk | findstr package
```

Expected:

- `com.sovereignworks.imperium` — label **The Imperium**
- `com.sovereignworks.tending` — label **The Tending**

---

## 5. First push to GitHub

Stage and commit (excludes `.env`, `node_modules`, `android/`, APKs):

```powershell
cd C:\SovereignWorks
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" commit -m "Sovereign Works Phase 1 — Imperium and Tending apps v1.0.0"
& "C:\Program Files\Git\bin\git.exe" branch -M main
& "C:\Program Files\Git\bin\git.exe" push -u origin main
```

---

## 6. Create GitHub Release v1.0.0 with both APKs

```powershell
cd C:\SovereignWorks
gh release create v1.0.0 `
  C:\SovereignWorks\dist\sovereign-imperium-v1.0.0.apk `
  C:\SovereignWorks\dist\sovereign-tending-v1.0.0.apk `
  --title "Sovereign Works v1.0.0" `
  --notes "Phase 1 household join release. Install Imperium first (Garrin), then Tending (Holli). Join with 6-digit household code."
```

Download URLs (after release is published):

- Imperium: `https://github.com/xpliciton3/Imperium/releases/download/v1.0.0/sovereign-imperium-v1.0.0.apk`
- Tending: `https://github.com/xpliciton3/Imperium/releases/download/v1.0.0/sovereign-tending-v1.0.0.apk`

---

## 7. Message to paste in Cursor (push + release)

After builds succeed and both APKs are in `dist\`:

```
Push SovereignWorks to https://github.com/xpliciton3/Imperium on branch main.
Do not commit .env files.
Create GitHub release v1.0.0 attaching dist/sovereign-imperium-v1.0.0.apk and dist/sovereign-tending-v1.0.0.apk.
Use gh release create with title "Sovereign Works v1.0.0".
```

---

## Install order on phones

1. Garrin: install **sovereign-imperium-v1.0.0.apk** → Create Household → share code with Holli.
2. Holli: install **sovereign-tending-v1.0.0.apk** → Join Existing Household → enter code.

Enable “Install unknown apps” for the browser or file manager once per device.
