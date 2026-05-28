# LAYER 8 PRIME PROMPT — SOVEREIGN WORKS
# Electron Desktop App
# Do not begin until all L7.01–L7.10 checkboxes are confirmed.

## WHAT LAYER 8 BUILDS

Electron desktop application. Not a web view of the phone app.
A full desktop interface sharing the same Firebase backend and content.

Layer 8 scope:
- Electron app scaffold (Windows, macOS)
- Household surname entry on first launch
- QR code generation delivering the APK download link
- APK build and setup.exe installer generation
- First-run guided tour of the desktop app
- Watch setup via USB (files and instructions)
- Daily planner as primary desktop widget
- Larger-screen layouts for The Book, practice screens, doctrine
- Sync with phone via Firebase (same household)

## HOUSEHOLD SURNAME FEATURE

On first launch of the desktop app:
1. Ask for household surname ("The [Surname] Household")
2. Display as home screen header
3. Generate QR code encoding APK download URL
4. APK URL: GitHub Releases link to latest APK build

## APK DELIVERY FLOW

1. Garrin opens desktop app
2. Enters household surname
3. Desktop app shows QR code
4. Holli scans QR on her phone → opens APK download
5. Installs directly from file manager

## BUILD OUTPUTS

```bash
# Electron
npm run build:electron  # produces .exe installer (Windows)
npm run build:electron:mac  # produces .dmg (macOS)

# APK (triggered from desktop build script)
cd apps/tending && npx eas build --platform android --profile preview --local
# Output APK posted to GitHub Releases
```

## FIRST-RUN TOUR

6-step guided overlay:
1. Household — explain household sync
2. Daily Planner — the primary hub
3. The Book — where to find doctrine
4. Practice — warrior/keeper practice logs
5. Household Sync — explain Firebase connection
6. Watch Setup — prompt USB watch setup

Cursor does not write tour copy. Import from MASTER docs or // TODO.

## WATCH SETUP VIA USB

Desktop app provides:
- Step-by-step USB connection instructions
- Files to transfer (Connect IQ app package)
- Configuration guide (see LAYER9_PRIME_PROMPT.md for watch spec)

## BUILD SEQUENCE L8

```
L8.01  Electron scaffold — main process, renderer
L8.02  Household surname entry + QR code generation
L8.03  APK build script + GitHub Releases upload
L8.04  setup.exe installer build (electron-builder)
L8.05  First-run guided tour overlay
L8.06  Daily planner — desktop layout
L8.07  The Book — full-width desktop reading view
L8.08  Practice screens — desktop layout
L8.09  Watch setup via USB flow
L8.10  Firebase sync (shares household with phone)
L8.11  Mark all L8 checkboxes in 21_BUILD_SEQUENCE.md as [x]
```
