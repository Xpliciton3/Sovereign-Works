# HOW TO USE THIS ZIP WITH CURSOR
# Read this first. Everything you need is here.

---

## STEP 1 — WHERE TO PUT THE FILES

Unzip SOVEREIGN_EVERYTHING_v4.zip.
You will see approximately 49 .md files and 1 .jsx file.

In your project repository, there should be a folder called:
  /spec/

If that folder does not exist, create it at the root of your repo.

Drop every file from this zip directly into /spec/.
Do not create subfolders. All files go in the same folder.
Cursor reads them by filename — the flat structure is intentional.

Your folder should look like:
  /spec/MASTER_IMPERIUM.md
  /spec/MASTER_TENDING.md
  /spec/HOLY_BOOK.md
  /spec/CEREMONIES_AND_OBSERVANCES.md
  /spec/DEITY_FUNCTION_CANON.md
  /spec/CURSOR_INSTRUCTIONS.md
  /spec/LAYER1_PRIME_PROMPT.md
  /spec/LAYER2_PRIME_PROMPT.md
  ... and so on

---

## STEP 2 — TELL CURSOR WHERE THE SPEC LIVES

At the start of every Cursor session, include this line:
"All specification files are in /spec/ in this repository."

Cursor will find them by name from there.

---

## STEP 3 — USE THESE PROMPTS IN ORDER

Copy and paste each prompt below into Cursor.
One prompt per session.
Do not combine prompts unless the instructions say to.

---
---

# PROMPT 0 — INSTALL ALL TOOLS FIRST
# Do this once. Do not skip it.

Read /spec/FIX_11_TOOL_INSTALL_AND_L2_BASELINE.md completely.

Execute Part A of that file — the complete tool installation manifest.
Install every tool listed. Do not skip any item.
Do not write any application code this session.
Only install tools and verify the installations.
Create the verify-install.js script described at the end of Part A.
Run it and show me the output.

---

# PROMPT 1 — LAYER 2 BASELINE CHECK
# Run this after Prompt 0 is confirmed complete.

Read /spec/FIX_11_TOOL_INSTALL_AND_L2_BASELINE.md Part C.

Go through the Layer 2 completion checklist (items L2.01–L2.24).
For each item: confirm it is complete or tell me what is missing.
Do not assume things are done. Verify each one.

If anything from L2.01–L2.24 is incomplete, complete it before continuing.
Show me the checklist with checkmarks when done.

---

# PROMPT 2 — APPLY FIXES BEFORE LAYER 3
# Run this after Prompt 1 confirms Layer 2 is complete.
# This applies all pending fixes in the correct order.

All specification files are in /spec/ in this repository.

Read these files completely before writing any code:
  /spec/DEITY_FUNCTION_CANON.md
  /spec/FIX_01_ICONS_AND_VISUAL_MATCH.md
  /spec/FIX_02_MOOD_GROQ_TRANSLATION.md
  /spec/FIX_03_WORK_SCHEDULER.md
  /spec/FIX_04_05_06_STRUCTURE.md
  /spec/FIX_07_PLANNER_HOME_IMPROVEMENTS.md
  /spec/FIX_09_GROQ_SHIFT_PLANNER.md
  /spec/FIX_10_RECIPE_ALTERNATIVES.md

Apply them in this exact order:
  1. FIX_01 — icons and visual matching
  2. FIX_04_05_06 — tab structure corrections
  3. FIX_03 — shift strip and 2-2-3 pattern
  4. FIX_07 — planner home improvements
  5. FIX_02 — mood Groq translation
  6. FIX_09 — Groq shift-aware planner scheduling
  7. FIX_10 — dietary alternatives (nut-free, gastric bypass, food aversions)

After applying all fixes, rebuild both APKs and show me the build output.

CRITICAL RULES that apply to every file you write this session:
- Deity names are immutable: Varkon=Te, Sereth=Ti, Aureliane=Fe, Nemeir=Fi,
  Draven=Se, Thalor=Si, Caelis=Ne, Vaelith=Ni. Never change these.
- The Tending app has NO language tab, NO Nen'thara vocal coach, NO language content.
  Remove any Nen'thara UI that exists. The ESFJ has no constructed language.
- Raw mood notes NEVER leave the device. Only the Groq-translated version syncs.
- Gastric bypass alternatives are required on EVERY recipe card — not optional.

---

# PROMPT 3 — DIETARY ALTERNATIVES VERIFICATION
# Run after Prompt 2. Verify FIX_10 is complete.

All specification files are in /spec/.

Read /spec/FIX_10_RECIPE_ALTERNATIVES.md completely.

Without writing new code, show me:

1. The Settings → Dietary Profile screen with all options:
   - Nut-free checkbox
   - Post-gastric bypass checkbox
   - Avoid fish checkbox
   - Avoid raw onion checkbox
   - Avoid cilantro checkbox
   - Avoid cooked mushrooms checkbox
   - Avoid strong cheese checkbox
   - Custom avoidances text field + Update button

2. A recipe card with ONLY gastric bypass active. It must show:
   - Portion size (4–6oz)
   - "Eat [protein component] first" instruction
   - "Do not drink 30 minutes before or after eating." as a visible banner
   - Protein grams for the gastric bypass portion

3. A recipe card with ONLY nut-free active. It must show:
   - Strikethrough on the original nut ingredient
   - The substitute shown next to it

4. A recipe card with cilantro aversion active. It must show:
   - Cilantro replaced by flat-leaf parsley inline

If any of these four items are not working, fix them now before continuing.

---

# PROMPT 4 — HOLY DAYS: CALENDAR INTEGRATION
# Run this during Layer 3 or 4 when doctrine and calendar screens are being built.

All specification files are in /spec/.

Read these files completely before writing any code:
  /spec/FIX_12_HOLY_DAYS_CALENDAR.md
  /spec/DEITY_FUNCTION_CANON.md

Build the holy days system exactly as specified in FIX_12. Key rules:

RULE 1 — NO SEPARATE CALENDAR.
Holy days are EVENTS in the existing app calendar.
They appear as named events on the calendar grid alongside planner items and meals.
They are NOT a new tab. They are NOT a new screen.

RULE 2 — SOUL TAB HOLY DAYS LIST.
The Soul tab already has a "Holy Days" section. It stays there.
It shows a list of all 8 holy days with name, deity, function, date, and days-until-next.

RULE 3 — EVERY HOLY DAY PAGE HAS FOUR SECTIONS:
  a. The date and why this date was chosen (placement meaning)
  b. Personal observance — what THIS practitioner does alone
     (INTJ version for Imperium; ESFJ version for Tending)
  c. Household observance — what everyone does TOGETHER
     This section is the same for both traditions.
  d. The deity, their function, and their Beebe position in THIS tradition

RULE 4 — TWO TABS ON THE HOLY DAY PAGE:
  [Personal] tab — the practitioner's type-specific solo observance
  [Household] tab — the shared event that everyone does together

RULE 5 — CALENDAR DISPLAY:
  - Deity symbol in the day cell on the calendar grid
  - Tap the day: bottom sheet rises with name, deity/function, and tabs
  - 3-day advance notification + day-of notification (both on by default)

Build the HolyDay data type using the interface in FIX_12.
Import the complete observance content from FIX_12 verbatim — do not summarize.
Show me the holy day page for December 21 in both Imperium and Tending.

---

# PROMPT 5 — MOOD TRACKER COMPLETE BUILD
# Run this if the mood tracker is missing any of its required components.

All specification files are in /spec/.

Read /spec/08_MOOD_SYSTEM.md completely.
Read /spec/FIX_02_MOOD_GROQ_TRANSLATION.md completely.

The mood tracker must have ALL of the following. Check each and fix what is missing:

1. ENTRY SCREEN
   - Score: 1–5 dot selector or slider (NOT a text field)
   - Optional text note — multiline, max 500 chars
   - Submit saves to SQLite mood_entries table with timestamp
   - Brief confirmation animation after save

2. GROQ TRANSLATION
   - If text note is non-empty, call Groq after saving
   - Groq translates into the PARTNER's tradition voice
     (ESFJ practitioner → translates to INTJ register, and vice versa)
   - Show the translated version as a preview
   - Practitioner taps [Send to Partner] or [Keep Private]
   - Raw note NEVER written to Firebase. Only translated version syncs.
   - If no partner linked: skip translation, entry stays local

3. HISTORY VIEW
   - Scrollable list, newest first
   - Score shown as colored dot (1=deep red, 5=warm gold)
   - Date label on each entry
   - Tap to expand and see original note (not translated version)
   - Swipe to delete with confirmation dialog

4. TREND CHARTS
   - 7-day line chart of mood scores
   - 30-day line chart of mood scores
   - Both accessible from the mood screen

5. PARTNER VIEW (Household tab)
   - Partner's translated entries shown in practitioner's tradition voice
   - Read-only — no edit, no delete
   - Never shows raw original text

6. PRIVACY LINE at top of mood screen:
   "Your notes are private. Only your score and a translated reflection
    are shared with your partner."

Show me the entry screen and history view when done.

---

# PROMPT 6 — SAMSUNG GALAXY WATCH (TENDING ONLY)
# Run during Layer 5 — same session as Garmin build.

All specification files are in /spec/.

Read /spec/FIX_08_SAMSUNG_GALAXY_WATCH.md completely before writing any code.

Build the Wear OS companion for the TENDING app only.
The IMPERIUM uses Garmin Vivoactive 4. Do not add watch features to the Imperium.

Build sequence from FIX_08:
W.01 through W.15 in order.

Key requirements:
- Target: Wear OS 3+, Samsung Galaxy Watch 4 / 5 / 6 / 7
- Three tiles: Planner (8 items, scrollable), Hydration (+8oz tap), Mood (1–5 crown)
- Two complications: planner done count, shift status
- Morning sync: phone pushes planner + schedule + quote + hydration goal to watch
- Evening sync: watch pushes mood score + hydration oz + checked items back to phone
- Palette: background #120a0e, accent #f5c8d8, text #f5e8ec
- The Tending has NO language content — confirm zero Nen'thara references in the watch build

Build the wear APK: ./gradlew :apps:tending-wear:assembleDebug
Show me the build output.

---

# PROMPT 7 — DEITY NAMES AUDIT
# Run after doctrine and shadow work screens are built.

All specification files are in /spec/.

Read /spec/DEITY_FUNCTION_CANON.md completely.

Audit every doctrine screen, shadow work card, holy day page,
and planner shadow prompt in both apps.

Every screen that mentions a cognitive function must ALSO show the deity name.
Every screen that mentions a deity must ALSO show the function code.
They travel together. Always.

TENDING APP — fix these if incomplete:
- Shadow work cards: "1 — Hero — Aureliane (Fe)", "4 — Inferior — Sereth (Ti)", etc.
- Deity reference card: all 8 deities with function, domain, ESFJ Beebe position
- Weekly shadow prompt header: "[Deity] — [Function] — [Beebe Role]"
- Holy day pages: deity name + function + Beebe position shown

IMPERIUM APP — fix these if incomplete:
- Shadow work cards: "1 — Hero — Vaelith (Ni)", "4 — Inferior — Draven (Se)", etc.
- Deity reference card: all 8 deities with function, domain, INTJ Beebe position
- Weekly shadow prompt header: deity + function + role
- Holy day pages: deity name + function + Beebe position shown

Show me one shadow work card from each app after the fix.

---

# FINAL CHECKLIST BEFORE SHIPPING

Before calling the build done, verify:

[ ] Both APKs install and run on test devices
[ ] Night shift practitioner sees Declaration at ~15:30, not 07:00
[ ] Gastric bypass alternative visible on every recipe card
[ ] Nut-free substitution renders correctly
[ ] Mood note never appears in Firebase — only translated version
[ ] Mood translation preview shows before any sync
[ ] Holy days appear on calendar grid — no separate calendar created
[ ] Holy day pages have both Personal and Household tabs
[ ] ESFJ app has no Nen'thara tab, no language coach
[ ] All shadow work cards show deity name + function together
[ ] Galaxy Watch tiles sync correctly (Tending only)
[ ] Garmin Vivoactive 4 syncs correctly (Imperium only)
[ ] Dietary profile settings visible and functional
[ ] All 8 holy days listed in Soul tab with days-until-next

---

## PERMANENT RULES — IN EVERY SESSION

The following rules never change and override any other instruction:

1. Deity names are immutable: Varkon=Te Sereth=Ti Aureliane=Fe Nemeir=Fi
   Draven=Se Thalor=Si Caelis=Ne Vaelith=Ni

2. The ESFJ (Tending) has NO constructed language. No Nen'thara tab.
   No vocal coach. No language curriculum. Remove any that exist.

3. Raw mood notes never leave the device.

4. Gastric bypass alternatives on EVERY recipe. Never optional.

5. Holy days in the EXISTING calendar. Never a separate calendar.

6. Import all doctrine, ceremony, and holy book content verbatim from spec files.
   Never summarize or paraphrase content from MASTER_TENDING.md,
   MASTER_IMPERIUM.md, HOLY_BOOK.md, or CEREMONIES_AND_OBSERVANCES.md.

7. Every file delivered must be complete. No addenda. No patches.
   If something needs updating, deliver the complete file.
