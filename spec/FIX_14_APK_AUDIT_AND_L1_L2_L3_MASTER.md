# FIX 14 — APK v1.0.10 AUDIT vs SPEC + LAYERS 1/2/3 MASTER CHECKLIST
# THIS IS THE SINGLE SOURCE OF TRUTH FOR WHAT IS BROKEN AND WHAT TO FIX.
# Read this FIRST before any Layer 1, 2, or 3 work.
# All items here must be resolved before Layer 4 begins.

---

## APK v1.0.10 AUDIT FINDINGS

Source: binary analysis of sovereign-imperium-v1_0_10.apk bundle strings.
Every finding below is confirmed from the bundle — not assumed.

---

### CONFIRMED BROKEN — HIGH PRIORITY

**B01 — Icons do not render**
- Root cause: icon name strings ("home", "brain", etc.) are passed to a
  component expecting SVG path data. No SVG path resolver exists.
- Fix: FIX_01_ICONS_AND_VISUAL_MATCH.md — implement IC constant and SvgIcon component
- Evidence: tab bar shows blank buttons; hub tiles show no icons

**B02 — Mind hub content is a stub**
- Bundle contains literal string: "Mind hub content is in active build."
- Soul hub is also a stub
- Body hub has hydration but nothing else
- Fix: implement hub tile expansion per sovereign_v9.jsx prototype

**B03 — Work scheduler hardcoded**
- Bundle contains literal strings "6:00 AM" and "6:00 PM" as shift times
- No rotation pattern engine; manual grid only
- No anchor date logic; pattern stays fixed regardless of current date
- Fix: FIX_03_WORK_SCHEDULER.md (this version)

**B04 — Overtime button absent on home screen**
- OT sheet does not render in the shift strip area
- Fix: FIX_03 — OT bottom sheet wired to shift strip

**B05 — Sleep window not computed from shift**
- Sleep recommendations ignore whether shift is day or overnight
- Fix: FIX_03 — calcSleepWindow() with shiftKind parameter

**B06 — No rotation pattern engine**
- Only manual per-day grid; 2-2-3, 4×10, Pitman absent
- Fix: FIX_03 — getDayStatus() with all patterns

---

### CONFIRMED BROKEN — MEDIUM PRIORITY

**B07 — Grocery cart remove button broken**
- removeFromCart() missing; × button does not work
- Fix: add removeFromCart() to grocery screen

**B08 — Hydration subtract button missing**
- Only addOz buttons; no remove or reset for the day
- Fix: add −8oz and Reset Today buttons to hydration tracker

**B09 — Mood tracker placement wrong**
- Mood entry UI appears outside the Mind hub
- Fix: FIX_08_MOOD_SYSTEM — mood lives ONLY in Mind hub / mood modal

**B10 — Dietary profile settings absent**
- No nut-free, no gastric bypass, no aversion toggles
- Fix: FIX_10_RECIPE_ALTERNATIVES.md

**B11 — Alarm system is JS notifications only**
- No AlarmReceiver.kt, no full-screen intent, no SCHEDULE_EXACT_ALARM
- Fix: LAYER3_PRIME_PROMPT.md

**B12 — Groq shift-aware planner absent**
- Static planner items only; no shift-aware scheduling
- Fix: FIX_09_GROQ_SHIFT_PLANNER.md

---

### CONFIRMED WORKING (DO NOT BREAK)

**W01 — Firebase realtime database wiring** — sync_queue present and operational
**W02 — Recipe data** — all 30-day meals present with full ingredients
**W03 — Hydration add buttons** — +8, +12, +16, +24 oz work correctly
**W04 — Mood logging** — score entry and Groq translation to partner note work
**W05 — Grocery list add-to-cart** — addToCart() works; amounts embedded in names
**W06 — Holy day observance data** — content strings present in bundle
**W07 — Dietary aversion strings** — "Avoid cilantro", "Avoid raw onion", etc.
       present in bundle (settings screen exists but toggles may not filter recipes)
**W08 — Batch cook alarms** — buildBatchCookAlarms() function found in bundle
**W09 — Sleep alarm functions** — buildSleepAlarm(), buildHydrationAlarms() present
**W10 — Groq mood translation** — generatePartnerNote() present and wired

---

## LAYER 1 VERIFICATION CHECKLIST

Layer 1 = prototype verification (sovereign_v9.jsx). Complete before any
React Native code is modified.

```
[ ] L1.01  Open sovereign_v9.jsx in a browser (index.html in /spec/)
[ ] L1.02  Home tab renders without errors
[ ] L1.03  All hub tiles (Mind, Body, Soul) expand on tap
[ ] L1.04  Shift strip shows shift label and sleep window
[ ] L1.05  Shift strip OT button opens OT sheet
[ ] L1.06  Daily quote renders in Cormorant Garamond
[ ] L1.07  Partner card shows 5 mood dots
[ ] L1.08  Planner tab renders Today items in correct order
[ ] L1.09  Planner items expand to show recipe/instructions on tap
[ ] L1.10  Nourish → Plan shows 4-week plan, collapsible
[ ] L1.11  Nourish → Grocery shows categories with amounts and × remove buttons
[ ] L1.12  Cart items show with × buttons that remove them
[ ] L1.13  Mood modal opens from partner card dots
[ ] L1.14  Hydration ring/bar fills with logged oz
[ ] L1.15  Nav tab icons render from IC paths (not blank)
[ ] L1.16  Colors match: Imperium gold (#c9a84c), Imperium teal (#18c48a)
[ ] L1.17  Fonts: Cormorant Garamond for display, Josefin Sans for labels
[ ] L1.18  Sigils render: quill-over-swords (Imperium), heart-of-flame (Tending)
[ ] L1.19  Settings accessible from More tab
[ ] L1.20  Service worker version: imp-v23 or higher
```

---

## LAYER 2 COMPLETION CHECKLIST

Layer 2 = React Native app baseline. All items must be [x] before
any FIX files are applied.

```
[ ] L2.01  Monorepo scaffold: apps/imperium, apps/tending, packages/shared
[ ] L2.02  TypeScript interfaces from 17_HOOKS_AND_EXPANSION.md
[ ] L2.03  T object (color tokens) from sovereign_v9.jsx — exact match
[ ] L2.04  Firebase config + writeShared() + drainSyncQueue()
[ ] L2.05  SQLite schema: all tables from 02_FIREBASE_SCHEMA.md
[ ] L2.06  Recipe data: recipes.ts with ALL recipes from RECIPE_CARDS_v3_1.md
[ ] L2.07  Quote fallback bank: 30 per tradition in quotes.ts
[ ] L2.08  Imperium content: imperium-content.ts (from MASTER_IMPERIUM.md)
[ ] L2.09  Tending content: tending-content.ts (from MASTER_TENDING.md)
[ ] L2.10  useCart hook
[ ] L2.11  useHydration hook
[ ] L2.12  useMood hook
[ ] L2.13  useSchedule hook (see FIX_03 for revised implementation)
[ ] L2.14  usePlanner hook
[ ] L2.15  Bottom tab navigator — 4 tabs (Home, Planner, Nourish, More)
[ ] L2.16  Home tab — matches sovereign_v9.jsx
[ ] L2.17  Planner tab → Today sub-tab
[ ] L2.18  Nourish tab → Plan sub-tab
[ ] L2.19  Nourish tab → Grocery sub-tab with removeFromCart()
[ ] L2.20  Mood modal with Log / Partner / History tabs
[ ] L2.21  Overtime bottom sheet (not a full modal — see FIX_03)
[ ] L2.22  Body hub: hydration tracker with −oz and Reset Today
[ ] L2.23  Mind hub: expandable with brain icon, mood entry shortcut
[ ] L2.24  Soul hub: expandable with star icon, holy days shortcut
[ ] L2.25  packages/shared/ai/ folder scaffold for Groq integration
[ ] L2.26  Dietary profile settings sub-section in Settings
[ ] L2.27  FIX_01 applied: all icons render from IC constant
[ ] L2.28  FIX_03 applied: shift scheduler fully operational
[ ] L2.29  FIX_04_05_06 applied: 4 tabs only, practice in Body hub
[ ] L2.30  FIX_07 applied: planner improvements and home tab depth
[ ] L2.31  FIX_09 applied: Groq shift-aware planner
[ ] L2.32  FIX_10 applied: dietary alternatives on all recipe cards
[ ] L2.33  FIX_12 applied: holy days as calendar events (not separate cal)
[ ] L2.34  Both APKs build and install on test device
```

---

## LAYER 3 VERIFICATION CHECKLIST

Layer 3 = Native Android alarm system. All items must be [x] before
Layer 4 (Firebase household sync) begins.

Reference: LAYER3_PRIME_PROMPT.md for implementation details.

```
MANIFEST PERMISSIONS
[ ] L3.01  SCHEDULE_EXACT_ALARM added to AndroidManifest.xml
[ ] L3.02  USE_EXACT_ALARM added
[ ] L3.03  WAKE_LOCK added
[ ] L3.04  RECEIVE_BOOT_COMPLETED added
[ ] L3.05  SYSTEM_ALERT_WINDOW added
[ ] L3.06  USE_FULL_SCREEN_INTENT added
[ ] L3.07  POST_NOTIFICATIONS added
[ ] L3.08  FOREGROUND_SERVICE added
[ ] L3.09  AlarmReceiver declared in manifest with BOOT_COMPLETED intent
[ ] L3.10  AlarmActivity declared with showWhenLocked + turnScreenOn

ALARM ENGINE
[ ] L3.11  AlarmReceiver.kt: on BOOT_COMPLETED, reads SQLite and reschedules all
[ ] L3.12  AlarmActivity: full-screen over lock screen, sigil + label + time + buttons
[ ] L3.13  Are You Awake screen: 30-second countdown auto-snooze
[ ] L3.14  Snooze: default 9 min, user-configurable 5/9/15 min
[ ] L3.15  alarm_log SQLite table created and populated on each fire/dismiss
[ ] L3.16  scheduleAlarm() wrapper works: id, label, hour, minute, days, type
[ ] L3.17  cancelAlarm() wrapper works: cancels by alarm id

ALARM TYPES
[ ] L3.18  Wake alarm auto-scheduled from sleepWindow.wake on schedule change
[ ] L3.19  Wind-down alarm scheduled 60 min before sleepWindow.sleep
[ ] L3.20  Batch cook reminder reads WEEK_PLAN, schedules 7 PM night before batch days
[ ] L3.21  Hydration reminders: interval-based, stops when daily goal met
[ ] L3.22  OT adjustment: wake alarm moves +OT hours for OT day only, reverts after

PERMISSIONS FLOW
[ ] L3.23  First launch after Layer 3: request SCHEDULE_EXACT_ALARM with explanation
[ ] L3.24  First launch: request SYSTEM_ALERT_WINDOW with explanation
[ ] L3.25  First launch: request POST_NOTIFICATIONS with runtime dialog
[ ] L3.26  "Alarm system is active." confirmation shown after all three granted
[ ] L3.27  Alarm scheduling blocked until permissions granted

PLANNER WIRE
[ ] L3.28  Planner bedtime row "Set Alarm" button opens alarm management screen
[ ] L3.29  Alarm management screen lists all active alarms by type
[ ] L3.30  Toggle on/off per alarm row
[ ] L3.31  Swipe-to-delete on alarm rows
[ ] L3.32  Add alarm button works

VERIFICATION TESTS
[ ] L3.33  Phone restart → alarms still fire at correct times (boot receiver works)
[ ] L3.34  OT set → wake alarm moves by OT hours → cancel OT → alarm reverts
[ ] L3.35  Are You Awake: no interaction for 30 seconds → auto-snooze fires
[ ] L3.36  Hydration alarm: fires at interval → stops after daily goal logged as met
[ ] L3.37  Batch cook reminder: fires with correct dinner name from WEEK_PLAN
[ ] L3.38  Night shift schedule: Declaration in planner renders at ~15:30 not 07:00
[ ] L3.39  Alarm labels match 07_ALARM_SYSTEM.md verbatim (no paraphrase)

FINAL BUILD
[ ] L3.40  All L3 checks above confirmed [x]
[ ] L3.41  Imperium APK rebuilt with alarm permissions
[ ] L3.42  Tending APK rebuilt with alarm permissions
[ ] L3.43  Both APKs installed on test device
[ ] L3.44  Push to GitHub: "Layer 3 complete — alarm system built"
[ ] L3.45  STOP — do not open LAYER4_PRIME_PROMPT.md until Garrin confirms
```

---

## FIX APPLICATION ORDER (BEFORE LAYER 3)

Apply in this exact order. Rebuild both APKs after ALL fixes are applied.
Do not rebuild after each individual fix — rebuild once after all are done.

```
1.  FIX_01_ICONS_AND_VISUAL_MATCH.md      — icons + visual audit
2.  FIX_04_05_06_STRUCTURE.md             — 4 tabs only; practice in Body hub
3.  FIX_03_WORK_SCHEDULER.md              — full rotation scheduler (this version)
4.  FIX_07_PLANNER_HOME_IMPROVEMENTS.md   — planner depth + home improvements
5.  FIX_02_MOOD_GROQ_TRANSLATION.md       — mood Groq translation
6.  FIX_09_GROQ_SHIFT_PLANNER.md          — Groq shift-aware planner
7.  FIX_10_RECIPE_ALTERNATIVES.md         — dietary alternatives
8.  FIX_12_HOLY_DAYS_CALENDAR.md          — holy days in existing calendar
9.  FIX_13_FIRST_RUN_TOUR.md              — desktop first-run tour (Layer 8)
```

FIX_08 (Samsung Galaxy Watch) applies during Layer 5 only.
FIX_13 (First-run tour) is Layer 8 — do not apply until Electron build.

---

## PERMANENT RULES — NEVER VIOLATE

These apply to every file written in every layer:

```
RULE 1  Deity names: Varkon=Te, Sereth=Ti, Aureliane=Fe, Nemeir=Fi,
        Draven=Se, Thalor=Si, Caelis=Ne, Vaelith=Ni. IMMUTABLE.

RULE 2  Tending (ESFJ) has NO language tab, NO Nen'thara, NO vocal coach.
        Remove any that exist. Zero language content in the Tending app.

RULE 3  Raw mood notes NEVER leave the device.
        Only the Groq-translated version syncs to Firebase.

RULE 4  Gastric bypass alternatives on EVERY recipe card.
        Not optional. Not a setting to enable. Always shown.

RULE 5  Holy days in the EXISTING calendar only.
        Never a separate calendar tab or section.

RULE 6  Import all doctrine, ceremony, and holy book content verbatim.
        Never summarize MASTER_TENDING.md, MASTER_IMPERIUM.md,
        HOLY_BOOK.md, or CEREMONIES_AND_OBSERVANCES.md.

RULE 7  Every file delivered is complete.
        No addenda. No patches. No "see also."
        If something needs updating, deliver the complete file.

RULE 8  sovereign_v9.jsx is the visual contract.
        Every screen must match it. Open it in a browser during development.
```

---

## BEFORE LAYER 4 — CONFIRM ALL OF THIS

Before opening LAYER4_PRIME_PROMPT.md, Garrin must confirm:

```
[ ] Layer 3 APKs installed on both phones (Garrin's and Holli's)
[ ] Wake alarm fires over lock screen on Garrin's phone
[ ] Shift strip shows correct pattern (not hardcoded times)
[ ] OT bottom sheet opens from shift strip, sets badge correctly
[ ] Mind/Body/Soul hub tiles show brain/heart/star icons
[ ] Grocery cart × button removes items
[ ] Hydration −oz and Reset buttons work
[ ] Dietary profile settings save and filter recipe cards
[ ] Both apps stable — no crashes on any tab
```

Layer 4 is Firebase household sync. Real-time sync between both phones.
Do not proceed until Garrin sends confirmation.
