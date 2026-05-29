# HOW TO USE THIS ZIP WITH CURSOR
# SOVEREIGN_EVERYTHING_v8 — Layers 1, 2, and 3 ready.
# Read this file first. Everything you need is here.

---

## WHAT IS NEW IN v8

This zip replaces v7. Key additions:

- **FIX_03_WORK_SCHEDULER.md** — Completely rewritten. Full rotation engine
  with 2-2-3, 4×10, 3-1-2, Pitman, 4-2-1, Custom, and Manual patterns.
  Swing shift support. Night shift sleep math. Hub tile icons (brain/heart/star).
  Verified against APK v1.0.10 audit findings.

- **FIX_14_APK_AUDIT_AND_L1_L2_L3_MASTER.md** — New. Complete audit of
  what is broken in the current APK, verified from binary analysis.
  Single master checklist for Layers 1, 2, and 3.

All other files are unchanged from v7 unless they conflict with the above.

---

## STEP 1 — WHERE TO PUT THE FILES

Unzip SOVEREIGN_EVERYTHING_v8.zip.
Drop every file into /spec/ in your project repository.
Flat structure — no subfolders.

---

## STEP 2 — SESSION PROMPTS IN ORDER

Use these prompts in order. One per session. Do not combine.

---

# PROMPT 0 — INSTALL ALL TOOLS
# Do this once on a fresh machine. Do not skip.

Read /spec/FIX_11_TOOL_INSTALL_AND_L2_BASELINE.md completely.
Execute Part A — the complete tool installation manifest.
Do not write any application code this session.
Create the verify-install.js script and run it.
Show me the output.

---

# PROMPT 1 — AUDIT THE APK AND CONFIRM LAYER 2 STATE

All specification files are in /spec/ in this repository.

Read /spec/FIX_14_APK_AUDIT_AND_L1_L2_L3_MASTER.md completely.

Part 1: Go through the CONFIRMED BROKEN findings (B01–B12).
For each one, tell me: is this broken in the current build? Confirm.

Part 2: Go through the Layer 2 completion checklist (L2.01–L2.34).
For each item: confirm it is complete or tell me what is missing.
Do not assume. Verify each one against the actual source files.

Do not write any code this session. Only audit and report.
Show me both checklists with your findings.

---

# PROMPT 2 — APPLY ALL PRE-LAYER-3 FIXES

All specification files are in /spec/ in this repository.

Read these files completely before writing any code:
  /spec/DEITY_FUNCTION_CANON.md
  /spec/FIX_01_ICONS_AND_VISUAL_MATCH.md
  /spec/FIX_02_MOOD_GROQ_TRANSLATION.md
  /spec/FIX_03_WORK_SCHEDULER.md          ← read the v8 version carefully
  /spec/FIX_04_05_06_STRUCTURE.md
  /spec/FIX_07_PLANNER_HOME_IMPROVEMENTS.md
  /spec/FIX_09_GROQ_SHIFT_PLANNER.md
  /spec/FIX_10_RECIPE_ALTERNATIVES.md
  /spec/FIX_12_HOLY_DAYS_CALENDAR.md
  /spec/FIX_14_APK_AUDIT_AND_L1_L2_L3_MASTER.md

Apply in this exact order:
  1. FIX_01 — icons and visual matching
  2. FIX_04_05_06 — tab structure corrections
  3. FIX_03 — work scheduler (IMPORTANT: this is the upgraded v8 version)
  4. FIX_07 — planner expansion + home improvements
  5. FIX_02 — mood Groq translation
  6. FIX_09 — Groq shift-aware planner
  7. FIX_10 — dietary alternatives
  8. FIX_12 — holy days in existing calendar

Also fix these from the APK audit (FIX_14):
  - B07: add removeFromCart() to grocery screen
  - B08: add −8oz and Reset Today to hydration tracker
  - B09: move mood entry to Mind hub only — remove from anywhere else
  - B02: implement Mind and Soul hub expansion (no stub text)

CRITICAL RULES for every file written this session:
  - Deity names are immutable: Varkon=Te, Sereth=Ti, Aureliane=Fe, Nemeir=Fi,
    Draven=Se, Thalor=Si, Caelis=Ne, Vaelith=Ni
  - Tending has NO language tab, NO Nen'thara, NO vocal coach
  - Raw mood notes never leave the device
  - Gastric bypass alternatives on EVERY recipe card
  - Holy days in the existing calendar only — never a separate calendar

After applying all fixes, rebuild both APKs.
Show me the build output and the FIX checklist status.

---

# PROMPT 3 — LAYER 3: ALARM SYSTEM

All specification files are in /spec/ in this repository.

Read these files completely before writing any code:
  /spec/LAYER3_PRIME_PROMPT.md
  /spec/07_ALARM_SYSTEM.md
  /spec/05_SHIFT_SCHEDULE.md
  /spec/15_VISUAL_DESIGN.md
  /spec/FIX_14_APK_AUDIT_AND_L1_L2_L3_MASTER.md  (Layer 3 checklist)

Implement Layer 3 per LAYER3_PRIME_PROMPT.md build sequence (L3.01–L3.45).

CRITICAL: Alarm label text comes from 07_ALARM_SYSTEM.md verbatim.
Do NOT write alarm label copy. Import it.

After ALL L3 verification checks pass:
  1. Build Imperium APK
  2. Build Tending APK
  3. Push to GitHub: "Layer 3 complete — alarm system built"
  4. Report to Garrin: APK filenames, install instructions
  5. STOP. Do not open LAYER4_PRIME_PROMPT.md until Garrin confirms.

---

# PROMPT 4 — HOLY DAYS CALENDAR

All specification files are in /spec/.
Read /spec/FIX_12_HOLY_DAYS_CALENDAR.md completely.

Build exactly as specified. Key rules:
- Holy days are EVENTS in the existing calendar. Not a new calendar.
- Every holy day page has: date meaning, personal observance, household observance, deity info.
- Two tabs: [Personal] and [Household]
- Calendar day cell shows deity symbol on holy days
- 3-day advance notification + day-of notification

Show me the holy day page for December 21 in both apps when done.

---

# PROMPT 5 — MOOD TRACKER COMPLETE

All specification files are in /spec/.
Read /spec/08_MOOD_SYSTEM.md and /spec/FIX_02_MOOD_GROQ_TRANSLATION.md completely.

Verify all mood tracker components per the checklist in 08_MOOD_SYSTEM.md.
Fix anything incomplete. Show me the entry screen and history view.

---

# PROMPT 6 — DEITY NAMES AUDIT

All specification files are in /spec/.
Read /spec/DEITY_FUNCTION_CANON.md completely.

Audit every doctrine screen, shadow work card, and holy day page in both apps.
Every screen that mentions a cognitive function must show the deity name.
Every screen that mentions a deity must show the function code.
Fix all missing pairs. Show one shadow work card from each app after fixing.

---

## PERMANENT RULES — EVERY SESSION

1. Deity names immutable: Varkon=Te Sereth=Ti Aureliane=Fe Nemeir=Fi
   Draven=Se Thalor=Si Caelis=Ne Vaelith=Ni
2. Tending: no language tab, no Nen'thara, no vocal coach
3. Raw mood notes never leave device
4. Gastric bypass alternatives on every recipe, always
5. Holy days in existing calendar only
6. Import all doctrine content verbatim — never summarize
7. Every delivered file is complete — no patches, no addenda
8. sovereign_v9.jsx is the visual contract — match it exactly

---

## FINAL CHECKLIST BEFORE LAYER 4

```
[ ] Both APKs (Layer 3) installed on Garrin's phone AND Holli's phone
[ ] Wake alarm fires over lock screen
[ ] Night shift: sleep window computed correctly (post-shift, not pre-shift)
[ ] Shift strip rotation pattern engine working (not hardcoded times)
[ ] OT bottom sheet works — badge shows after setting
[ ] Mind hub: brain icon, mood shortcut, no stub text
[ ] Body hub: heart icon, hydration tracker, −oz and Reset buttons, practice link
[ ] Soul hub: star icon, holy days shortcut, no stub text
[ ] Grocery cart × remove button works
[ ] Dietary profile settings save and filter recipes
[ ] Gastric bypass note on every recipe card
[ ] Holy days show in calendar grid — no separate calendar
[ ] Both apps stable — no crashes
[ ] Garrin has confirmed Layer 3 to proceed to Layer 4
```
