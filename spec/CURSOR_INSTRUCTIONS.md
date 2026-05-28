# CURSOR INSTRUCTIONS
# What to tell Cursor — in order — to apply every fix and build correctly.
# These are copy-paste prompts, one per session or task.
# Read this file completely before starting any Cursor session.

---

# HOW TO USE THIS FILE

Each section below is a complete prompt you paste into Cursor.
Do not combine multiple sections into one session unless indicated.
Cursor has a context window — one task per session works better than ten.

---

---

# PROMPT 0 — BEFORE ANYTHING ELSE
# Run this FIRST, one time only, in a fresh Cursor session.
# This installs all tools the project requires.

```
Read FIX_11_TOOL_INSTALL_AND_L2_BASELINE.md completely.

Then execute Part A — the complete tool installation manifest — in full.
Install every tool listed. Do not skip items.
Do not write any application code during this session.
Only install tools, verify installations, and create the verify-install.js script
described at the end of Part A.

When done, run verify-install.js and show me the output.
```

---

---

# PROMPT 1 — DEITY CANON (Required in every doctrine/planner session)
# Include this as the FIRST paragraph of any session touching doctrine,
# shadow work, holy days, planner content, or the book tab.

```
Before writing any code this session, read DEITY_FUNCTION_CANON.md completely.

The eight deities and their locked function assignments are:
  Varkon = Te | Sereth = Ti | Aureliane = Fe | Nemeir = Fi
  Draven = Se | Thalor = Si | Caelis = Ne | Vaelith = Ni

For The Tending (ESFJ), the Beebe position map is:
  Position 1 Hero: Aureliane (Fe)
  Position 2 Good Parent: Thalor (Si)
  Position 3 Child: Caelis (Ne)
  Position 4 Inferior: Sereth (Ti)
  Position 5 Opposing Personality: Sereth shadow
  Position 6 Critical Parent / Witch: Thalor shadow
  Position 7 Trickster: Caelis shadow
  Position 8 Daemon: Aureliane shadow

For The Imperium (INTJ), the Beebe position map is:
  Position 1 Hero: Vaelith (Ni)
  Position 2 Good Parent: Varkon (Te)
  Position 3 Child: Nemeir (Fi)
  Position 4 Inferior: Draven (Se)

Every shadow work screen, planner shadow prompt, holy day screen, and
doctrine tab deity card must show BOTH the deity name AND the function.
Never show one without the other.
```

---

---

# PROMPT 2 — DIETARY ALTERNATIVES (FIX 10)
# Run this as its own session after Layer 2 APKs are verified.

```
Read FIX_10_RECIPE_ALTERNATIVES.md completely before writing any code.
Read RECIPE_CARDS_v3_1.md completely before writing any code.

This fix has three parts:

PART A — TYPE ADDITIONS
Add a `dietaryProfile` object to the UserProfile type in
packages/shared/src/types/index.ts with these fields:
  nutFree: boolean
  gastricBypass: boolean
  avoidFish: boolean
  avoidRawOnion: boolean
  avoidCilantro: boolean
  avoidStrongCheese: boolean
  avoidMushrooms: boolean
  customAvoidances: string[]

Add an `alternatives` object to the Recipe type with fields:
  nut_free (subs array + optional note)
  gastric_bypass (portion_oz, protein_first, protein_g, remove_or_modify array,
                  no_fluid_note, optional soft_food_mod)
  aversion_flags (fish, raw_onion, cilantro, strong_cheese, mushrooms — booleans)

PART B — RECIPE ANNOTATION
Go through every recipe in RECIPE_CARDS_v3_1.md.
For each recipe that contains nut ingredients: populate nut_free.subs[]
  using the substitution table in FIX_10_RECIPE_ALTERNATIVES.md.
For EVERY recipe without exception: populate gastric_bypass fields.
  portion_oz: 4 to 6 (choose appropriate for recipe type)
  protein_first: name which component to eat first
  protein_g: calculate the protein for the gastric bypass portion size
  no_fluid_note: always "Do not drink 30 minutes before or after eating."
  soft_food_mod: note if any component needs texture modification
For recipes with fish, raw onion, cilantro, mushrooms, or strong cheese:
  set the corresponding aversion flag to true.

PART C — SETTINGS SCREEN
Add a "Dietary Profile" sub-section to the Settings screen.
Checkboxes for all dietaryProfile fields.
A text field for customAvoidances with a [Update] button.
The Update button calls Groq with the custom text to parse it into flags.
Store parsed flags in SQLite, not just AsyncStorage.

PART D — RECIPE CARD COMPONENT
Update the recipe card component so that:
- If nutFree is set: substituted ingredients show inline (strikethrough original, 
  replacement shown)
- If gastricBypass is set: show portion note, protein-first instruction prominently,
  and the no-fluid reminder as a fixed banner at the top of the recipe card
- If any aversion flag is set: swap that ingredient before rendering

Do NOT write new recipes. Annotate the existing ones only.
Build and show me the updated Settings screen and one sample recipe card
with all three alternative tracks active.
```

---

---

# PROMPT 3 — GROQ SHIFT-AWARE PLANNER (FIX 09)
# Run this as its own session after FIX 10 is verified.

```
Read FIX_09_GROQ_SHIFT_PLANNER.md completely before writing any code.
Read 05_SHIFT_SCHEDULE.md completely before writing any code.

This fix replaces the static planner time slots with Groq-generated
shift-aware scheduling. Here is exactly what to build:

1. Create packages/shared/src/ai/groqShiftPlanner.ts
   with the ShiftPlannerInput interface, DailySchedule type,
   and generateShiftPlan() function exactly as specified in FIX_09.
   The Groq model is llama-3.3-70b-versatile.
   
2. Create a planner_schedule table in SQLite:
   date TEXT PRIMARY KEY
   shift_type TEXT NOT NULL
   schedule_json TEXT NOT NULL
   generated_at INTEGER NOT NULL
   source TEXT DEFAULT 'groq'

3. On app foreground: if no planner_schedule row for today,
   call generateShiftPlan() with today's shift data.
   Cache the result. Do not call Groq again until tomorrow.

4. Implement static fallback templates for all four shift types
   (day, night, swing, off) for BOTH traditions (Imperium and Tending).
   The fallback fires when Groq is unavailable — no blank planner ever.

5. Update the Planner Today sub-tab to read scheduled times
   from planner_schedule instead of hardcoded defaults.

6. Update the home tab shift strip to show the active window times
   from the Groq-generated schedule.

7. Wire the alarm system (07_ALARM_SYSTEM.md) so that items with
   alarm: true in the schedule JSON get alarms set at the
   Groq-generated time, not a fixed default.

Key behavior rules (Groq prompt enforces these — verify they work):
- Night shift: Declaration fires at ~15:30, NOT 07:00
- Night shift: Sleep window opens 1 hour after shift end (07:00 shift end → 07:30 sleep)
- Off day: items distributed across 10-hour window starting at wake time
- Meals: Meal 1 within 45 min of wake, Meal 2 at midpoint, Meal 3 two hours before sleep
- Practice: placed in physical readiness window (day shift: mid-morning;
  night shift: 2–3 hours pre-shift)
- Hydration reminders: every 2 hours during active window

Show me the night shift schedule output from Groq and confirm
Declaration is not firing at 07:00.
```

---

---

# PROMPT 4 — SAMSUNG GALAXY WATCH (FIX 08)
# Run during Layer 5 — same session as Garmin build.
# This is Tending app only. Do not add watch features to the Imperium.

```
Read FIX_08_SAMSUNG_GALAXY_WATCH.md completely before writing any code.

This builds a Wear OS 3+ companion for the Tending app only.
The Imperium uses Garmin. Do not cross-wire.

Build in this sequence:

W.01 — Create apps/tending-wear/ as a new Gradle module
W.02 — Add wearable dependency to apps/tending/android/app/build.gradle:
        implementation 'com.google.android.gms:play-services-wearable:18.1.0'
W.03 — Add Wear OS dependencies to apps/tending-wear/build.gradle:
        compose-material for wear, tiles, tiles-material, play-services-wearable
W.04 — Create WearSyncModule.kt — React Native native module bridge
        for calling sync from the phone app's JS layer
W.05 — Create SyncManager.kt using DataClient + MessageClient
W.06 — Build PlannerTile.kt — shows today's 8 checklist items,
        scrollable with crown, tap opens phone app
W.07 — Build HydrationTile.kt — +8oz tap, running total display
W.08 — Build MoodTile.kt — 1–5 crown scroll, crown press confirms and syncs
W.09 — Build PlannerComplication.kt — short text "X/8 DONE"
W.10 — Build ShiftComplication.kt — short text "DAY SHIFT" or "OFF TODAY"
W.11 — Wire morning sync: on app foreground + watch paired,
        push planner items + schedule + quote (max 80 chars) + hydration goal
W.12 — Wire evening sync: SyncReceiver catches DATA_CHANGED from watch,
        writes mood score + hydration oz + checked planner items to SQLite
W.13 — Apply Tending rose palette to all watch UI:
        background #120a0e, accent #f5c8d8, text #f5e8ec

All tiles use dark rose palette. No Vel'nar. No Imperium content.
The Tending app has no Language tab — confirm no language reference
appears anywhere in the watch build.

Build the wear APK:
  ./gradlew :apps:tending-wear:assembleDebug
Show me the build output.
```

---

---

# PROMPT 5 — MOOD TRACKER COMPLETENESS CHECK
# Run this as a review pass — not a build from scratch.
# The mood tracker may be incomplete. This fixes it.

```
Read 08_MOOD_SYSTEM.md completely.
Read FIX_02_MOOD_GROQ_TRANSLATION.md completely.

The mood tracker must have ALL of the following working.
Check each item and fix anything that is missing or broken:

1. ENTRY SCREEN
   - 1–5 score input (tap dots or slider — not a text field)
   - Optional text note field (multiline, max 500 chars)
   - Submit button saves to SQLite mood_entries table
   - Date + time auto-stamped on save
   - Confirmation animation after save (brief, not intrusive)

2. GROQ TRANSLATION (FIX 02)
   - After saving a text note: if note is non-empty, call Groq
   - Groq translates the note into the PARTNER's tradition voice
     (if practitioner is ESFJ, translate to INTJ register; vice versa)
   - Translated version previewed before syncing to Firebase
   - Practitioner sees preview and taps [Send to Partner] or [Keep Private]
   - Raw note NEVER leaves the device — only the translated version syncs
   - If no partner linked: skip translation, entry stays local only

3. HISTORY VIEW
   - Scrollable list of past entries, newest first
   - Score shown as colored dot (1=deep red → 5=warm gold)
   - Date label for each entry
   - Tap entry to expand and see full note (not translated version — original)
   - Swipe to delete with confirmation

4. CHART / TREND VIEW
   - 7-day mood score line chart
   - 30-day mood score line chart
   - Both charts accessible from the mood tab
   - Chart colors match tradition palette

5. PARTNER VIEW (Household tab)
   - Partner's translated mood entries show in the Household tab
   - Displayed in the practitioner's OWN tradition voice (already translated)
   - Never shows the raw original note
   - Partner's entries are read-only — no editing, no deletion

6. PRIVACY RULE (display in UI)
   - A single line at top of mood tab:
     "Your notes are private. Only your score and a translated reflection
      are shared with your partner."

Build or fix whatever is incomplete. Show me the entry screen and history view.
```

---

---

# PROMPT 6 — RECIPE ALTERNATIVES VERIFICATION
# Run after PROMPT 2 is complete to verify the build.

```
I need to verify the dietary alternatives build is complete.
Without writing new code, show me:

1. The Settings → Dietary Profile screen
   - All checkboxes are present (nut-free, gastric bypass, all 5 aversions,
     custom avoidances field, Update button)

2. One recipe card displayed with ONLY gastric bypass active:
   - Portion oz displayed
   - Protein-first instruction visible
   - No-fluid-30-min banner at top
   - Protein grams shown

3. One recipe card displayed with ONLY nut-free active:
   - An ingredient that was originally a nut is shown with the substitution
   - Strikethrough on original, replacement shown next to it

4. One recipe card displayed with cilantro aversion active:
   - Cilantro shows as flat-leaf parsley

5. The gastric bypass portion note in the recipe card UI must include:
   "Do not drink 30 minutes before or after eating."
   If this line is not visible, add it now.

If any of items 1–5 are not working correctly, fix them before moving on.
```

---

---

# PROMPT 7 — DEITY NAMES IN APP SCREENS (Doctrine + Shadow Work)
# Run this after Layer 3 doctrine screens are built.

```
Read DEITY_FUNCTION_CANON.md completely before making any changes.

The following screens need to be checked and updated to show
BOTH the deity name AND the function, paired together.

THE TENDING APP — check and update these screens:

1. Doctrine tab — Shadow Work section
   Each of the 8 Beebe position cards must show:
   "[Position Number] — [Beebe Role] — [Deity Name] ([Function])"
   Examples:
     "1 — Hero — Aureliane (Fe)"
     "4 — Inferior — Sereth (Ti)"
     "6 — Critical Parent — Thalor shadow (Si)"
   
2. Doctrine tab — Deity reference card (or section)
   All 8 deities listed with: name, function, domain, Beebe position for ESFJ
   
3. Planner tab — Weekly shadow prompt
   The prompt header must show: "[Deity Name] — [Function] — [Beebe Role]"
   Example: "This week: Sereth — Ti — The Question"
   
4. Holy day screens
   Each holy day must show the deity name that owns that day.
   See DEITY_FUNCTION_CANON.md for the full holy day calendar.

THE IMPERIUM APP — check and update these screens:

1. Same shadow work cards but with INTJ positions
   "1 — Hero — Vaelith (Ni)"
   "4 — Inferior — Draven (Se)"

2. Doctrine tab deity reference card — 8 deities, INTJ positions

3. Planner weekly shadow prompt with deity name

4. Holy day screens with deity name

RULE: If any screen shows only the function name (Fe, Ti, Si, etc.)
without the deity name, add the deity name now.
If any screen shows only the deity name without the function,
add the function now.
They travel together everywhere. Always.
```

---

---

# IMPORTANT NOTES FOR ALL CURSOR SESSIONS

**On Nen'thara:** The ESFJ (The Tending) does NOT have a constructed language.
There is NO Nen'thara tab, NO vocal coach, NO language curriculum in the Tending app.
If any Nen'thara language content appears in Tending app UI, remove it.
The ESFJ's cognitive architecture (Fe-Si dominant) is oriented outward and 
grounded in relational action and embodied practice — not interior symbolic vocabulary.
The Tending has a doctrine framework, not a language.

**On deity names:** Always Varkon=Te, Sereth=Ti, Aureliane=Fe, Nemeir=Fi,
Draven=Se, Thalor=Si, Caelis=Ne, Vaelith=Ni. Never change these. Ever.

**On content:** Never write doctrine, vow language, ceremony text, shadow work prose,
or holy book text. Import it verbatim from the spec files.
MASTER_TENDING.md and MASTER_IMPERIUM.md contain the complete content.
HOLY_BOOK.md contains the complete holy book — do not paraphrase or summarize it.
CEREMONIES_AND_OBSERVANCES.md contains all ceremony content verbatim.

**On the recipe cards:** Do not write new recipes. Annotate existing ones.
Source is RECIPE_CARDS_v3_1.md. The gastric bypass alternative is NOT optional —
it must be on every single recipe card in the database.

**On the mood tracker:** Raw notes never leave the device.
Only the Groq-translated version syncs to Firebase and to the partner.
The practitioner sees the translation before it sends. They approve or block it.

**On the Galaxy Watch:** Tending app only. Wear OS only. Samsung Galaxy Watch 4+.
The Imperium uses Garmin Vivoactive 4. These are separate build targets.
Do not mix them.

**On shift scheduling:** The planner must generate a Groq schedule at app foreground
each day. A night shift practitioner must never see a 07:00 Declaration alarm.
The static fallback fires when Groq is unavailable — never leave the planner blank.
