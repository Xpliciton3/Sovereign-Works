# CONTRADICTION AUDIT — SOVEREIGN WORKS v7
# 18 contradictions found across spec files.
# This file documents each one and the authoritative resolution.
# Every fixed file in this zip applies these resolutions.
# Do NOT override these resolutions in any Cursor session.

---

## C-01 — MOOD ENTRY SCORE: 1–10 vs 1–5

**Conflict:**
- `08_MOOD_SYSTEM.md` → "Slider or number input: 1–10"
- `CURSOR_INSTRUCTIONS.md` Prompt 5 → "1–5 score input (tap dots or slider)"
- `HOW_TO_USE_THIS_ZIP.md` Prompt 5 → "1–5 dot selector or slider"
- `sovereign_v9.jsx` → `setMoodScore` range is 1–10 (prototype is correct)

**Resolution:**
RAW ENTRY IS 1–10. DOT SCORE IS 1–5.
These are two different things. Do not confuse them.
- The mood modal slider/tap input = 1–10 (private, never leaves device)
- The dot score displayed to partner = Math.ceil(rawScore / 2), range 1–5
- `CURSOR_INSTRUCTIONS.md` and `HOW_TO_USE_THIS_ZIP.md` Prompt 5 are wrong.
- `08_MOOD_SYSTEM.md` and `sovereign_v9.jsx` are correct.
- **Fixed in: `CURSOR_INSTRUCTIONS_FIXED.md`, `HOW_TO_USE_FIXED.md`**

---

## C-02 — GBP TOGGLE: TENDING ONLY vs BOTH APPS

**Conflict:**
- `12_SETTINGS.md` → "GBP/Bariatric toggle — Tending app only"
- `FIX_10_RECIPE_ALTERNATIVES.md` → `dietaryProfile` is in `packages/shared` — both apps
- Garrin (Imperium user) had gastric bypass surgery

**Resolution:**
GBP toggle is in BOTH apps.
`packages/shared` is shared. Garrin's dietary restrictions apply to the Imperium.
The Tending app note was incorrect.
- **Fixed in: `12_SETTINGS_FIXED.md`**

---

## C-03 — TAB COUNT: 4 vs 5 (internal to FIX_04_05_06)

**Conflict within the same file:**
- `FIX_04_05_06.md` opening → "spec is exactly 4 tabs: Home, Planner, Nourish, More"
- `FIX_04_05_06.md` REVISED section → "5 primary tabs: Home, Planner, Mind, Body, Soul"
- The `_layout.tsx` code block at the bottom shows 4 tabs again

**Resolution:**
THE 5-TAB REVISED ARCHITECTURE IS CORRECT.
`Home | Planner | Mind | Body | Soul`
The 4-tab mention at the top of FIX_04 describes what Cursor built wrongly, not what to build.
The REVISED section at the bottom is the target.
- **Fixed in: `FIX_04_05_06_FIXED.md`**

---

## C-04 — WARRIOR/PRACTICE LOCATION: HOME HUB vs BODY TAB

**Conflict within FIX_04_05_06:**
- Early section → Practice entry point is in the Body hub tile on the Home tab
- REVISED section → Practice is a secondary tab inside the Body primary tab

**Resolution:**
Practice is a secondary tab inside the Body primary tab.
The REVISED architecture supersedes the earlier description.
Body tab secondary tabs: `Nourish | [Warrior's Practice / Keeper's Practice] | Hydration | Sleep`
Practice tile on Home tab is removed in the REVISED architecture.
- **Fixed in: `FIX_04_05_06_FIXED.md`**

---

## C-05 — SETTINGS SCHEDULE LOCATION: MORE TAB vs PLANNER TAB

**Conflict:**
- `12_SETTINGS.md` → Schedule section lives in More tab → Settings
- `FIX_07.md` → "Schedule is the primary location in Planner → Schedule sub-tab.
  Settings → Schedule can link here instead."

**Resolution:**
Schedule lives in Planner → Schedule sub-tab (FIX_07 is authoritative).
Settings → Schedule becomes a link/shortcut that opens Planner → Schedule.
Do NOT build a duplicate settings panel for schedule in the More/Settings area.
- **Fixed in: `12_SETTINGS_FIXED.md`**

---

## C-06 — SLEEP ALARMS FIRING DURING ACTIVE SHIFT

**Conflict:**
- `07_ALARM_SYSTEM.md` → wake alarm: "Work days only"; wind-down and sleep: "Every day"
- `FIX_09.md` → Groq schedule places sleep window 1hr after shift ends (correct for night shift)
- No file explicitly suppresses wind-down/sleep alarms mid-shift

**Problem:**
A night shift worker finishing at 6 AM receives a wind-down alarm the prior evening
at ~9 PM while they should be starting their shift. The "Every day" rule is wrong.

**Resolution:**
Wind-down and sleep alarms must not fire during an active shift window.
Add this rule to `07_ALARM_SYSTEM.md`:
```
Suppress wind-down and sleep alarms if current time falls within shift hours.
Shift hours = shiftStart to shiftEnd (inclusive).
Example: Night shift 18:00–06:00 → suppress wind-down at ~17:00 and sleep at ~18:00.
Use the Groq-generated sleepWindowStart from planner_schedule as the alarm target time.
```
- **Fixed in: `07_ALARM_SYSTEM_FIXED.md`**

---

## C-07 — DOT SCORE FORMULA: ceil vs round

**Conflict:**
- `08_MOOD_SYSTEM.md` → `Math.ceil(rawScore / 2)`
- `LAYER2_PRIME_PROMPT.md` → `Math.round(score/2)`
- `LAYER4_PRIME_PROMPT.md` → `Math.ceil(score / 2)`

**Impact:**
`Math.round(5/2) = 3` but `Math.ceil(5/2) = 3` — same result here.
`Math.round(1/2) = 1` but `Math.ceil(1/2) = 1` — same.
`Math.round(3/2) = 2` but `Math.ceil(3/2) = 2` — same.
Actually ceil and round produce the same results for integers 1–10.
Minor issue — but use `Math.ceil` everywhere for consistency.

**Resolution:**
Use `Math.ceil(rawScore / 2)` in all files. LAYER2 is incorrect; update all instances.
- **Fixed in: `LAYER2_PRIME_PROMPT_FIXED.md`**

---

## C-08 — GROCERY CLEAR: NO PARTNER WARNING

**Conflict:**
- `12_SETTINGS.md` → "Clear grocery list (confirmation required)" — no mention of shared impact
- `LAYER4_PRIME_PROMPT.md` → grocery is a shared Firebase list, both phones see it

**Resolution:**
The confirmation dialog for Clear Grocery List must state:
"This will clear the grocery list for both you and your partner. This cannot be undone."
- **Fixed in: `12_SETTINGS_FIXED.md`**

---

## C-09 — DIETARY SETTINGS FIREBASE PATH: UNDEFINED

**Conflict:**
- `12_SETTINGS.md` → "Dietary settings sync to Firebase so partner's app can show warnings"
- `02_FIREBASE_SCHEMA.md` → no dietary path exists in the schema
- `FIX_10.md` → `dietaryProfile` stored in SQLite via `UserProfile`

**Resolution:**
Add dietary sync path to Firebase schema:
```
households/
  {householdId}/
    dietary/
      {uid}/
        nutFree: boolean
        gastricBypass: boolean
        avoidFish: boolean
        avoidRawOnion: boolean
        avoidCilantro: boolean
        avoidStrongCheese: boolean
        avoidMushrooms: boolean
        updatedAt: timestamp
```
Custom avoidances stay local (Groq-parsed flags sync; raw text does not).
- **Fixed in: `02_FIREBASE_SCHEMA_FIXED.md`**

---

## C-10 — GBP DIRECTIONS MISSING FROM SETTINGS TOGGLE

**Conflict:**
- `12_SETTINGS.md` → lists GBP toggle with no user guidance
- `FIX_10.md` → requires no-fluid-30-min banner, protein-first instruction, portion notes

**Resolution:**
When the GBP toggle is turned ON, a permanent info card must appear below it:
```
Post-Gastric Bypass mode is active.
• Do not drink 30 minutes before or after eating.
• All recipes will show protein-first instructions.
• Portion sizes adjusted to 4–6oz per meal.
• High-sugar, fried, and raw fibrous items flagged.
```
This card is always visible when toggle is ON. It is not a one-time toast.
- **Fixed in: `12_SETTINGS_FIXED.md`**

---

## C-11 — TRANSLATION SYNC TO FIREBASE: NEVER vs YES

**Conflict:**
- `LAYER4_PRIME_PROMPT.md` line 79 → "dotScore: 1–5 ← ONLY this syncs. Raw note stays on device."
- `LAYER4_PRIME_PROMPT.md` Firebase write block → `{ dotScore, updatedAt }` — no translation field
- `FIX_02_MOOD_GROQ_TRANSLATION.md` line 162 → "save the translated text to SQLite + Firebase"
- `FIX_02_MOOD_GROQ_TRANSLATION.md` Firebase write → `{ dotScore, translation, updatedAt }`

**Resolution:**
FIX_02 is authoritative. The Groq-translated text DOES sync to Firebase.
The raw note does NOT.
Firebase path for mood:
```
households/{id}/mood/{uid}/{dateKey}/
  dotScore: number        ← syncs
  translation: string     ← syncs (Groq output only, never raw note)
  updatedAt: timestamp    ← syncs
```
LAYER4 Firebase write block is wrong. Fixed version uses FIX_02 structure.
- **Fixed in: `LAYER4_PRIME_PROMPT_FIXED.md`**

---

## C-12 — ALARM CONFIGURATION LOCATION: SETTINGS vs PLANNER

**Conflict:**
- `12_SETTINGS.md` Notifications section → alarm toggles in Settings
- `FIX_07.md` → "All alarm configuration lives in Planner → Alarms tab. Not buried in Settings."

**Resolution:**
Planner → Alarms tab is the PRIMARY location for all alarm configuration (FIX_07 is authoritative).
Settings → Notifications section is REMOVED. Replace with:
```
Notifications → "Configure alarms and reminders in Planner → Alarms"
               [Go to Alarms →] (navigates to Planner Alarms tab)
```
Do not build a duplicate alarm UI in Settings.
- **Fixed in: `12_SETTINGS_FIXED.md`**

---

## C-13 — NOURISH: PRIMARY TAB vs SECONDARY TAB

**Same file, two answers in FIX_04_05_06:**
- FIX_04 opening → Nourish is one of 4 primary tabs
- FIX_04 REVISED → Nourish is a secondary tab inside the Body primary tab; `nourish.tsx` as primary tab is deleted

**Resolution:**
REVISED architecture wins. Nourish is a secondary tab inside Body.
Primary tabs: `Home | Planner | Mind | Body | Soul`
Body secondary tabs: `Nourish | [Practice] | Hydration | Sleep`
- **Fixed in: `FIX_04_05_06_FIXED.md`**

---

## C-14 — GBP SCOPE: TENDING ONLY (DUPLICATE of C-02, different file)

Already resolved in C-02. GBP is in BOTH apps.
`FIX_04_05_06_FIXED.md` and `12_SETTINGS_FIXED.md` reflect this.

---

## C-15 — DIETARY FIREBASE PATH UNDEFINED (see C-09)

Already resolved in C-09. Path added to `02_FIREBASE_SCHEMA_FIXED.md`.

---

## C-16 — WATCH MOOD INPUT: 1–5 ON WATCH IS CORRECT

**Non-contradiction — clarification only:**
Galaxy Watch mood tile uses 1–5 crown scroll. This is the DOT SCORE, not the raw score.
Watch has no text field, so there is no raw note. Watch entry submits a dot score directly.
On the phone app, the dot score is reverse-mapped to raw: `dotScore × 2` for storage.
This is correct behavior. No conflict. Documented for Cursor clarity.

---

## C-17 — LAYER2 BUILDS OLD TAB STRUCTURE

**Conflict:**
- `LAYER2_PRIME_PROMPT.md` builds `Home | Planner | Nourish | More` (4 tabs, old)
- `FIX_04_05_06.md` REVISED replaces this with `Home | Planner | Mind | Body | Soul` (5 tabs)
- LAYER4 assumes the tab structure but doesn't say which

**Resolution:**
LAYER2 was the correct starting point at the time. FIX_04 is the migration.
FIX_04_05_06 must be applied BEFORE Layer 3.
LAYER3 and LAYER4 assume the 5-tab REVISED structure from FIX_04.
- Note in LAYER3 and LAYER4 added: "Tab structure must match FIX_04_05_06 REVISED before this layer begins."
- **Fixed in: `LAYER3_PRIME_PROMPT_FIXED.md`, `LAYER4_PRIME_PROMPT_FIXED.md`**

---

## C-18 — SLEEP WINDOW SOURCE: STATIC (FIX_03) vs GROQ (FIX_09)

**Conflict:**
- `FIX_03_WORK_SCHEDULER.md` → `useSchedule()` calculates sleep window statically
- `FIX_09_GROQ_SHIFT_PLANNER.md` → Groq generates the full daily schedule including sleep window

**Resolution:**
FIX_09 Groq output supersedes FIX_03 static calculation after FIX_09 is applied.
Build order:
1. FIX_03 → static sleep window (used until FIX_09 is complete)
2. FIX_09 → Groq generates sleep window dynamically, stored in `planner_schedule` table

After FIX_09 is applied:
- Planner bedtime row reads from `planner_schedule.schedule_json` (Groq output)
- `useSchedule()` static `sleepWindow` becomes the FALLBACK only (Groq offline / first run)
- Home tab shift strip reads Groq-generated active window when available; falls back to static

This means both files are correct — FIX_03 is the foundation, FIX_09 replaces the output.
- **Fixed in: `FIX_03_WORK_SCHEDULER_FIXED.md`** (fallback note added), **`FIX_09_GROQ_SHIFT_PLANNER_FIXED.md`** (supersedes note added)

---

## RESOLUTION PRIORITY ORDER

When two files conflict, use this hierarchy:
1. `FIX_*` files supersede `LAYER*` files for the feature they address
2. REVISED sections supersede opening sections within the same file
3. `sovereign_v9.jsx` is the visual and behavioral prototype — it supersedes all text specs for UI appearance
4. `08_MOOD_SYSTEM.md` is authoritative for mood data rules
5. `MASTER_IMPERIUM.md` and `MASTER_TENDING.md` are authoritative for all content

---

*End of Contradiction Audit — 18 contradictions, all resolved.*
