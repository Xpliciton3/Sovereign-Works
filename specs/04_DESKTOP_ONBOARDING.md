# DESKTOP APP — ELECTRON — ONBOARDING FLOW

---

## PURPOSE

Garrin's computer runs the Electron desktop app. This app:
1. Generates the household (creates Firebase household ID)
2. Creates QR codes for each APK download
3. Serves as the household admin panel in Phase 1

---

## FIRST RUN FLOW

### Screen 1 — Welcome
```
THE SOVEREIGN WORKS

A household operating system.
Two traditions. One household.

[BEGIN SETUP]
```

### Screen 2 — Household Name
```
WHAT IS YOUR HOUSEHOLD NAME?

This is used to connect both phones to the same system.
It does not appear publicly anywhere.

[Text input: e.g. "Bane"]

[Continue →]
```

### Screen 3 — Household Created
```
THE BANE HOUSEHOLD

Your household ID has been created.
Firebase is connected.

Now download the apps to your phones.

─────────────────────────────────────

GARRIN'S APP — THE IMPERIUM
[Large QR code]
Scan with Android camera to download

─────────────────────────────────────

HOLLI'S APP — THE TENDING
[Large QR code]
Scan with Android camera to download

─────────────────────────────────────

Both apps will automatically connect to this household
when installed. No login required.

[I'll come back to this] [Open Admin Panel →]
```

### Screen 4 — Admin Panel (post-setup)
```
SOVEREIGN WORKS ADMIN

Household: The Bane Household

─── SHIFT SCHEDULES ───────────────────
Garrin: Not set  [Set Up Schedule →]

Holli: Not set  [Set Up Schedule →]

Neither schedule is pre-populated. Both users set their own
schedule independently from their phone app after joining.

─── HOUSEHOLD STATUS ──────────────────
Firebase: Connected ✓
Imperium app: Installed ✓
Tending app: Installed ✓

─── DOWNLOAD LINKS ────────────────────
[Regenerate Imperium QR]
[Regenerate Tending QR]

─── SYSTEM ────────────────────────────
[Export grocery list to CSV]
[View shared calendar]
```

---

## QR CODE CONTENT

The QR code encodes a deep link URL:
```
sovereignworks://join?household={householdId}&profile=imperium&downloadUrl={apkUrl}
```

When the phone camera scans this:
1. Phone opens the URL
2. App detects it is not installed → opens download page
3. APK downloads and installs
4. On first launch: app reads `householdId` and `profile` from the URL
5. App connects to Firebase household automatically
6. No typing. No login. No account creation.

---

## APK HOSTING

Host both APKs on GitHub Releases or Firebase Hosting (both free).
The QR code points to the hosted APK download URL.

Build commands:
```bash
# Build Imperium APK
cd apps/imperium
eas build --platform android --profile production

# Build Tending APK
cd apps/tending
eas build --platform android --profile production
```

---

## ELECTRON SETUP

```json
// desktop/package.json
{
  "name": "sovereign-works-desktop",
  "version": "1.0.0",
  "main": "src/main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  },
  "dependencies": {
    "electron": "^28.0.0",
    "firebase": "^10.0.0",
    "qrcode": "^1.5.0"
  }
}
```

The desktop app is intentionally minimal in Phase 1. It does three things:
1. Creates the household in Firebase
2. Shows QR codes for APK download
3. Shows shift schedule admin

