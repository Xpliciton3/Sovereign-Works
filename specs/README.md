# SOVEREIGN WORKS — PHASE 1 BUILD PACKAGE
# Give this entire specs/ folder to Cursor. Read files in the order below.
# Do not modify content files (RECIPE_CARDS, MASTER_IMPERIUM, MASTER_TENDING).

---

## THE HOUSEHOLD — LOCKED, NEVER CHANGES

| Person | Profile | Type | Shift | Phone |
|--------|---------|------|-------|-------|
| Garrin | imperium | INTJ — The Uncrowned | Law enforcement 2-2-3 rotating | Android |
| Holli | tending | ESFJ — The Unspent | Nurse — 12hr days or nights, rotating | Android |

**No children. No other household members.**
**Holli: GBP maintenance phase. Affects Nourish tab only.**
**No assumed shift schedules. Both users set their own from scratch.**

---

## MANDATORY READ ORDER (all 23 files, in full, before any code)

| # | File | Purpose |
|---|------|---------|
| 1 | 00_IGNITION.md | Rules, people, what to build |
| 2 | 01_TECH_STACK.md | Stack, colors, folder structure, Groq |
| 3 | 02_FIREBASE_SCHEMA.md | Complete Firebase schema |
| 4 | 03_PROFILES.md | Profile objects, navigation, privacy |
| 5 | 04_DESKTOP_ONBOARDING.md | Electron app and QR flow |
| 6 | 05_SHIFT_SLEEP_SCHEDULER.md | Shift scheduler + sleep optimizer |
| 7 | 06_CALENDAR_PLANNER.md | Calendar + Today view |
| 8 | 07_ALARM_SYSTEM.md | Full alarm spec — LOUD, full-screen |
| 9 | 08_MOOD_SYSTEM.md | Mood tracker + bidirectional translator |
| 10 | 09_DAILY_QUOTE.md | Daily quote, Groq generation, offline fallback |
| 11 | 10_HYDRATION.md | Hydration tracker |
| 12 | 11_NOURISH.md | Full Nourish tab — no placeholders |
| 13 | 12_SETTINGS.md | Settings screens |
| 14 | 13_WIDGET.md | Home screen widget |
| 15 | 14_ONBOARDING_TOUR.md | Guided tour + OTA update pipeline |
| 16 | 15_VISUAL_DESIGN.md | Look, feel, icons, category colors |
| 17 | 16_PHASE_DEFINITIONS.md | Phase checklists and test criteria |
| 18 | 17_HOOKS_AND_EXPANSION.md | Hook architecture for future phases |
| 19 | 18_TAB_MANIFEST.md | Tab colors and build order |
| 20 | 19_PHONE_SETUP_TUTORIAL.md | Post-install setup flow, permissions |
| 21 | 20_CURSOR_BUILD_INSTRUCTIONS.md | Cursor setup, YOLO mode, Android Studio, setup.exe |
| 22 | 21_BUILD_SEQUENCE.md | Ordered task list with checkboxes |
| 23 | 22_UPDATE_PIPELINE.md | GitHub setup, OTA updates, how to add phases |
| 23 | RECIPE_CARDS_v3_1.md | 45 recipes — reference only, do not modify |
| 24 | MASTER_IMPERIUM.md | Canon content — reference only |
| 25 | MASTER_TENDING.md | Canon content — reference only |
| 26 | SOVEREIGN_WORKS_MASTER_FEATURE_DOC_v2.md | Full system overview — reference |

---

## CANONICAL DECLARATIONS (verbatim — do not alter)

**Garrin morning declaration:** "Power from within cannot be revoked."
*Instruction: Stand. Both feet on the floor. Speak this aloud before anything else.*

**Holli morning declaration:** "The keeper of what matters is never powerless."
*Instruction: Twenty minutes of quiet first. The rest waits.*

**Garrin axiom (end of home screen):** Uncrowned. Unbowed. Unbroken. Unfinished.

**Holli closing declaration:** What I tend, I keep. What I keep, endures. Felt. Faithful. Full. Unspent.

---

## BUILD TOOLS REQUIRED

- Cursor v3.1+ with YOLO mode enabled
- Android Studio (latest stable) with SDK Platform 33 and 34
- Node.js 18 LTS or higher
- Java 17 LTS (Temurin — free from adoptium.net)
- Git for Windows (provides Git Bash)
- ANDROID_HOME environment variable set

---

## ESTIMATED BUILD TIME

| Mode | Time |
|------|------|
| Cursor running uninterrupted (YOLO mode) | 38–52 hours total agent time |
| Working in 8-hour daily sessions | 5–7 days |
| With interruptions and manual fixes | 8–12 days |

These are real estimates based on the task complexity in 21_BUILD_SEQUENCE.md.
The alarm system, mood translator, Nourish tab, and setup.exe are the most time-intensive.

---

## PHASE 1 DONE WHEN

```
□ setup.exe installs on Windows and opens the desktop app
□ Desktop app generates QR codes for both APKs
□ Imperium APK installs on Garrin's Android phone
□ Tending APK installs on Holli's Android phone
□ The alarm fires at max volume on both phones
□ The Are You Awake screen locks both phones
□ All 60+ items in 16_PHASE_DEFINITIONS.md Phase 1 checklist confirmed
```

Then: request Phase 2 files.

