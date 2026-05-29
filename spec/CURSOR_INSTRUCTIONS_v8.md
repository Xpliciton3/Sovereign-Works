# CURSOR INSTRUCTIONS v8
# REPLACES all previous CURSOR_INSTRUCTIONS.md and HOW_TO_USE_THIS_ZIP.md
# Read this file completely before any Cursor session.
# 18 contradictions in v7 are resolved. This file is authoritative.

---

# HOW TO USE THIS ZIP

Unzip into your repo under /spec/ (flat — no subfolders).
At the start of every Cursor session, include:
"All specification files are in /spec/ in this repository."

---

# PERMANENT RULES — IN EVERY SESSION, NO EXCEPTIONS

1. Deity names are immutable:
   Varkon=Te  Sereth=Ti  Aureliane=Fe  Nemeir=Fi
   Draven=Se  Thalor=Si  Caelis=Ne    Vaelith=Ni
   Never change these. Never invent new ones.

2. The ESFJ (Tending) has NO constructed language.
   No Nen'thara tab. No vocal coach. No language curriculum.
   Remove any that exist. The ESFJ has no constructed language.

3. Raw mood notes NEVER leave the device.
   What syncs: dotScore (1–5) + Groq translation. Nothing else.

4. Gastric bypass alternatives on EVERY recipe card. Both apps. Never optional.

5. Holy days in the EXISTING calendar. Never a separate calendar.

6. Import all doctrine, ceremony, and holy book content verbatim.
   Never summarize MASTER_IMPERIUM.md, MASTER_TENDING.md, HOLY_BOOK.md,
   CEREMONIES_AND_OBSERVANCES.md, WARRIORS_PRACTICE.md, or TENDING_PRACTICE.md.

7. Every file delivered must be complete. No addenda. No patches.

8. sovereign_v9.jsx is the visual prototype. Every screen must match it.
   Have it open in a browser at all times.

---

# RESOLVED CONTRADICTIONS — READ BEFORE CODING

The following were wrong in v7. These are the correct answers:

**MOOD ENTRY SCORE:**
  Raw entry = 1–10 (slider — see sovereign_v9.jsx)
  Dot score = Math.ceil(rawScore / 2) — range 1–5 — shown to partner
  "1–5 score input" anywhere referring to the ENTRY screen is WRONG.

**GBP TOGGLE:**
  Both apps. Garrin (Imperium) had gastric bypass. Not Tending-only.

**TAB STRUCTURE:**
  5 primary tabs: Home | Planner | Mind | Body | Soul
  No More tab. No Nourish as primary tab.
  Apply PATCH_FIX04.md before Layer 3.

**WARRIOR/PRACTICE LOCATION:**
  Secondary tab inside Body primary tab. Not a Home hub tile.

**SETTINGS:**
  Schedule → Planner → Schedule sub-tab (not Settings).
  Alarms → Planner → Alarms sub-tab (not Settings).
  Settings has navigation links to both.

**SLEEP ALARMS:**
  Wind-down and sleep alarms are suppressed during active shift hours.
  See 07_ALARM_SYSTEM_FIXED.md for isAlarmSuppressed() implementation.

**TRANSLATION SYNC:**
  Groq translation syncs to Firebase. LAYER4 was wrong to omit it.
  Firebase mood path: { dotScore, translation, updatedAt }

**DIETARY FIREBASE PATH:**
  See 02_FIREBASE_SCHEMA_FIXED.md for dietary sync schema.
  Previously undefined — now defined.

**SLEEP WINDOW SOURCE:**
  FIX_03 = static fallback.
  FIX_09 = Groq output = authoritative when available.
  Both must exist. Neither is removed.

Full detail on all 18 contradictions: see CONTRADICTION_AUDIT.md.

---

# FIXED FILES IN THIS ZIP
# Use these INSTEAD of the original files they replace:

| Fixed file | Replaces | Fixes |
|------------|----------|-------|
| 02_FIREBASE_SCHEMA_FIXED.md | 02_FIREBASE_SCHEMA.md | C-09, C-11, C-15 |
| 07_ALARM_SYSTEM_FIXED.md | 07_ALARM_SYSTEM.md | C-06, C-18 |
| 12_SETTINGS_FIXED.md | 12_SETTINGS.md | C-02, C-05, C-08, C-10, C-12 |
| PATCH_FIX03.md | annotates FIX_03 | C-18 |
| PATCH_FIX04.md | annotates FIX_04_05_06 | C-03, C-04, C-13 |
| PATCH_FIX09.md | annotates FIX_09 | C-06, C-18 |
| PATCH_LAYER2.md | annotates LAYER2 | C-01, C-07, C-17 |
| PATCH_LAYER4.md | annotates LAYER4 | C-11, C-17 |
| CONTRADICTION_AUDIT.md | — | all 18 documented |

---

# PROMPT 0 — BEFORE ANYTHING ELSE (one time only)

```
All specification files are in /spec/.

Read /spec/FIX_11_TOOL_INSTALL_AND_L2_BASELINE.md completely.

Execute Part A — the complete tool installation manifest.
Install every tool listed. Do not skip items.
Do not write any application code this session.
Only install tools and verify installations.
Create and run the verify-install.js script from Part A.
Show me the output.
```

---

# PROMPT 1 — LAYER 2 BASELINE CHECK

```
All specification files are in /spec/.

Read /spec/FIX_11_TOOL_INSTALL_AND_L2_BASELINE.md Part C.
Go through the Layer 2 completion checklist (L2.01–L2.24).
For each item: confirm complete or tell me what is missing.
Do not assume — verify each one.
If anything is incomplete, complete it before continuing.
Show me the checklist with checkmarks when done.
```

---

# PROMPT 2 — APPLY ALL FIXES (before Layer 3)

```
All specification files are in /spec/.

BEFORE WRITING ANY CODE, read these files completely in this order:
  /spec/CONTRADICTION_AUDIT.md          ← read first — 18 resolved contradictions
  /spec/PATCH_FIX04.md                  ← tab structure final answer
  /spec/DEITY_FUNCTION_CANON.md
  /spec/FIX_01_ICONS_AND_VISUAL_MATCH.md
  /spec/FIX_02_MOOD_GROQ_TRANSLATION.md
  /spec/PATCH_FIX03.md
  /spec/FIX_03_WORK_SCHEDULER.md
  /spec/FIX_04_05_06_STRUCTURE.md
  /spec/FIX_07_PLANNER_HOME_IMPROVEMENTS.md
  /spec/PATCH_FIX09.md
  /spec/FIX_09_GROQ_SHIFT_PLANNER.md
  /spec/FIX_10_RECIPE_ALTERNATIVES.md
  /spec/12_SETTINGS_FIXED.md            ← USE THIS, not 12_SETTINGS.md
  /spec/07_ALARM_SYSTEM_FIXED.md        ← USE THIS, not 07_ALARM_SYSTEM.md
  /spec/02_FIREBASE_SCHEMA_FIXED.md     ← USE THIS, not 02_FIREBASE_SCHEMA.md
  /spec/PATCH_LAYER4.md

Apply fixes in this order:
  1. PATCH_FIX04 — 5-tab structure migration (do this first)
  2. FIX_01 — icons and visual matching
  3. FIX_04_05_06 REVISED section — delete old tab files, create Mind/Body/Soul tabs
  4. FIX_03 — shift strip and 2-2-3 scheduler
  5. FIX_07 — planner home improvements
  6. FIX_02 — mood Groq translation (translation syncs to Firebase per 02_FIREBASE_SCHEMA_FIXED)
  7. FIX_09 — Groq shift-aware planner + alarm suppression (PATCH_FIX09)
  8. FIX_10 — dietary alternatives (nut-free, gastric bypass BOTH apps, aversions)
  9. 12_SETTINGS_FIXED — dietary profile, schedule link, alarms link, GBP info card

CRITICAL RULES:
  - Mood raw entry is 1–10 (not 1–5). Dot score is Math.ceil(score/2).
  - GBP toggle is in BOTH apps — not Tending-only.
  - Groq translation syncs to Firebase. Raw note does NOT.
  - Wind-down and sleep alarms are suppressed during active shift hours (07_ALARM_SYSTEM_FIXED).
  - Tab structure is: Home | Planner | Mind | Body | Soul (5 tabs).

After applying all fixes, rebuild both APKs and show me the output.
```

---

# PROMPT 3 — DIETARY ALTERNATIVES VERIFICATION

```
All specification files are in /spec/.

Read /spec/FIX_10_RECIPE_ALTERNATIVES.md completely.
Read /spec/12_SETTINGS_FIXED.md Dietary Profile section.

Without writing new code, show me:

1. Settings → Dietary Profile screen in BOTH apps (GBP is in both — not Tending-only).
   Must include: nut-free, GBP, all 5 aversions, custom field + Update button.
   When GBP is ON: the permanent info card must be visible below the toggle.

2. One recipe card with GBP active:
   - Portion oz displayed
   - "Eat [protein] first" instruction
   - "Do not drink 30 minutes before or after eating." as a visible BANNER (not toast)
   - Protein grams shown

3. One recipe card with nut-free active:
   - Strikethrough original nut ingredient
   - Substitute shown inline

4. One recipe card with cilantro aversion active:
   - Cilantro replaced by flat-leaf parsley

If any of 1–4 are missing, fix them before continuing.
```

---

# PROMPT 4 — SHIFT SCHEDULER VERIFICATION

```
All specification files are in /spec/.

Read /spec/FIX_03_WORK_SCHEDULER.md completely.
Read /spec/PATCH_FIX03.md.
Read /spec/FIX_09_GROQ_SHIFT_PLANNER.md completely.
Read /spec/PATCH_FIX09.md.
Read /spec/07_ALARM_SYSTEM_FIXED.md completely.

Verify the following and fix anything broken:

1. Settings navigates to Planner → Schedule for shift configuration (not Settings panel).

2. In Planner → Schedule:
   - Shift type toggle (Day / Night) saves and persists.
   - Anchor date picker saves and persists.
   - Live preview shows correct work/off for today.

3. Home tab shift strip shows correct label, wake/sleep times, OT button.

4. Groq generates today's schedule on first app open. Cached in planner_schedule table.

5. NIGHT SHIFT TEST: Set shift type to Night, anchor to a work night.
   Confirm that the Morning Declaration alarm fires at ~15:30, NOT 07:00.

6. Wind-down and sleep alarms are NOT firing during active shift hours.
   Test: night shift (18:00–06:00). A 17:00 wind-down should be suppressed.

7. Off day: planner items distributed across 10-hour window from wake time.

8. Offline fallback: disconnect network, open app. Planner should show
   static schedule — not blank.

Show me the night shift schedule output from Groq and confirm Declaration time.
```

---

# PROMPT 5 — MOOD TRACKER COMPLETE BUILD

```
All specification files are in /spec/.

Read /spec/08_MOOD_SYSTEM.md completely.
Read /spec/FIX_02_MOOD_GROQ_TRANSLATION.md completely.
Read /spec/PATCH_LAYER2.md for score range clarification.
Read /spec/02_FIREBASE_SCHEMA_FIXED.md for Firebase mood path.

The mood tracker must have ALL of the following. Check each and fix what is missing:

1. ENTRY SCREEN
   - Score: 1–10 slider or numbered tap row (NOT 1–5 — see PATCH_LAYER2)
   - sovereign_v9.jsx shows the correct input — match it exactly
   - Optional text note — multiline, max 500 chars
   - Below the slider: bracket translation updates in real time as score changes
   - Below bracket: dot preview (5 circles, filled = Math.ceil(score/2))
   - Submit saves to SQLite: rawScore, note, dotScore, timestamp
   - Brief confirmation animation after save

2. GROQ TRANSLATION
   - After save: if note non-empty, call Groq (FIX_02 system prompts — use verbatim)
   - Translates note into PARTNER's tradition voice
   - Show translation preview — practitioner sees it before it sends
   - [Send to Partner] button → syncs { dotScore, translation, updatedAt } to Firebase
   - [Keep Private] button → stays local only
   - Raw note NEVER written to Firebase. Ever.
   - Firebase path: households/{id}/mood/{uid}/{dateKey}/ (see 02_FIREBASE_SCHEMA_FIXED)

3. HISTORY VIEW
   - Scrollable list, newest first
   - Score shown as colored dot (1=deep red, 5=warm gold)
   - Date label on each entry
   - Tap to expand and see original note (not translated)
   - Swipe to delete with confirmation

4. TREND CHARTS
   - 7-day and 30-day line charts of mood scores
   - Both accessible from mood screen

5. PARTNER VIEW (in Partner tab or Household section)
   - Shows partner's Groq translation for today (not dot score only)
   - Tradition-appropriate label + translation text
   - Read-only — no edit, no delete

6. PRIVACY LINE at top of mood screen:
   "Your notes are private. Only your score and a translated reflection are shared."

Show me the entry screen and one sample translation preview.
```

---

# PROMPT 6 — HOLY DAYS CALENDAR

```
All specification files are in /spec/.

Read /spec/FIX_12_HOLY_DAYS_CALENDAR.md completely.
Read /spec/DEITY_FUNCTION_CANON.md completely.

Build the holy days system. Key rules:

RULE 1 — NO SEPARATE CALENDAR.
Holy days are EVENTS in the existing Planner calendar. Not a new tab or screen.

RULE 2 — SOUL TAB has a Holy Days section listing all 8 holy days.

RULE 3 — EVERY HOLY DAY PAGE HAS:
  a. Date and placement meaning
  b. Personal observance (type-specific: INTJ for Imperium, ESFJ for Tending)
  c. Household observance (same for both traditions)
  d. Deity, function, and Beebe position in this tradition

RULE 4 — TWO TABS on holy day page: [Personal] and [Household]

RULE 5 — Calendar: deity symbol in day cell, tap for bottom sheet.
  3-day advance + day-of notification (both ON by default).

Import observance content verbatim from FIX_12. Do not summarize.
Show me the December 21 holy day page in both Imperium and Tending.
```

---

# PROMPT 7 — DEITY NAMES AUDIT

```
All specification files are in /spec/.

Read /spec/DEITY_FUNCTION_CANON.md completely.

Audit every shadow work card, doctrine screen, holy day page,
and planner shadow prompt in both apps.

Every screen showing a cognitive function MUST ALSO show the deity name.
Every screen showing a deity MUST ALSO show the function code.
They travel together. Always. No exceptions.

TENDING — verify and fix:
  "1 — Hero — Aureliane (Fe)"
  "4 — Inferior — Sereth (Ti)"
  "6 — Critical Parent — Thalor shadow (Si)"

IMPERIUM — verify and fix:
  "1 — Hero — Vaelith (Ni)"
  "4 — Inferior — Draven (Se)"

Show me one shadow work card from each app after the fix.
```

---

# PROMPT 8 — SAMSUNG GALAXY WATCH (TENDING ONLY)

```
All specification files are in /spec/.

Read /spec/FIX_08_SAMSUNG_GALAXY_WATCH.md completely before writing any code.

Build the Wear OS companion for the TENDING app ONLY.
Imperium uses Garmin Vivoactive 4. Do not add watch features to the Imperium.

Follow build sequence W.01–W.15 from FIX_08 in order.

Key requirements:
- Target: Wear OS 3+, Samsung Galaxy Watch 4 / 5 / 6 / 7
- Three tiles: Planner, Hydration, Mood
- MOOD TILE: 1–5 crown scroll (this is the DOT SCORE — watch has no text field)
  The watch sends a dot score directly. Phone stores it as dotScore.
  No Groq translation from watch mood entry (no text note).
- Two complications: planner done count, shift status
- Palette: background #120a0e, accent #f5c8d8, text #f5e8ec
- Zero Nen'thara references anywhere in the watch build

Build APK: ./gradlew :apps:tending-wear:assembleDebug
Show me the build output.
```

---

# FINAL CHECKLIST BEFORE SHIPPING

```
[ ] Both APKs install and run on test devices
[ ] Night shift: Declaration fires at ~15:30, NOT 07:00
[ ] Night shift: wind-down/sleep alarms suppressed during shift hours
[ ] Gastric bypass alternative visible on every recipe card — BOTH apps
[ ] GBP info card visible in Settings Dietary Profile when toggle is ON — BOTH apps
[ ] Nut-free substitution renders correctly in recipe card
[ ] Mood raw entry is 1–10 (not 1–5) — sovereign_v9.jsx matches
[ ] Mood translation SYNCS to Firebase (dotScore + translation)
[ ] Mood raw note never appears in Firebase
[ ] Mood translation preview shows before any sync — practitioner approves
[ ] Tab structure: Home | Planner | Mind | Body | Soul (5 tabs)
[ ] No More tab. No Nourish as primary tab.
[ ] Settings has navigation links to Planner → Schedule and Planner → Alarms
[ ] No duplicate alarm UI in Settings
[ ] Firebase dietary path deployed and syncing (02_FIREBASE_SCHEMA_FIXED)
[ ] Grocery clear confirmation warns about partner impact
[ ] Holy days on existing calendar — no separate calendar
[ ] Holy day pages have Personal and Household tabs
[ ] ESFJ app has no Nen'thara tab, no language coach
[ ] Shadow work cards show deity name + function code together
[ ] Galaxy Watch tiles sync correctly (Tending only)
[ ] Garmin Vivoactive 4 syncs correctly (Imperium only)
[ ] All 8 holy days in Soul tab with days-until-next
```
