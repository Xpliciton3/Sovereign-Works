# HOOK ARCHITECTURE & EXPANSION GUIDE
# How to add new features without breaking what exists

---

## PHILOSOPHY

Every Phase 1 component is built with hooks that future phases plug into.
Nothing in Phase 1 is a dead end. Every tab, every system, every data structure
has a defined extension point. When Cursor receives a new instruction file,
it reads these hooks and knows exactly where to attach.

---

## HOOK LOCATIONS — BY SYSTEM

### Navigation Hooks

```typescript
// packages/shared/navigation/tabConfig.ts
// This file controls what tabs exist and whether they're locked.
// Phase 2+ unlocks tabs by changing 'locked' to false.

export const TAB_CONFIG = {
  imperium: [
    { key: 'planner',   label: 'Planner',   icon: 'calendar',    locked: false },
    { key: 'nourish',   label: 'Nourish',   icon: 'leaf',        locked: false },
    { key: 'warrior',   label: 'Warrior',   icon: 'sword',       locked: true,
      unlocksIn: 'phase2', lockMessage: 'The Forge opens at Day 7.' },
    { key: 'doctrine',  label: 'Doctrine',  icon: 'book',        locked: true,
      unlocksIn: 'phase3', lockMessage: 'Doctrine opens at Day 14.' },
    { key: 'household', label: 'Household', icon: 'home',        locked: true,
      unlocksIn: 'phase4', lockMessage: 'Household opens at Day 30.' },
    { key: 'language',  label: "Vel'nar",   icon: 'language',    locked: true,
      unlocksIn: 'phase5', lockMessage: "Vel'nar opens at Gate 4." },
    { key: 'book',      label: 'The Book',  icon: 'scroll',      locked: true,
      unlocksIn: 'phase5', lockMessage: 'The Book opens at Gate 4.' },
    { key: 'more',      label: 'More',      icon: 'menu',        locked: false },
  ],
  tending: [
    { key: 'planner',     label: 'Planner',       icon: 'calendar',  locked: false },
    { key: 'nourish',     label: 'Nourish',       icon: 'leaf',      locked: false },
    { key: 'keep',        label: 'Keep Yourself', icon: 'heart',     locked: true,
      unlocksIn: 'phase2', lockMessage: 'This opens when your foundation is set.' },
    { key: 'doctrine',    label: 'Doctrine',      icon: 'book',      locked: true,
      unlocksIn: 'phase3', lockMessage: 'Doctrine opens when practice is stable.' },
    { key: 'household',   label: 'Household',     icon: 'home',      locked: true,
      unlocksIn: 'phase4' },
    { key: 'book',        label: 'The Book',      icon: 'scroll',    locked: true,
      unlocksIn: 'phase5' },
    { key: 'more',        label: 'More',          icon: 'menu',      locked: false },
  ],
};
```

**Phase 2 expansion:** Change `locked: true` → `locked: false` for warrior/keep tabs.
**Phase 3 expansion:** Unlock doctrine tab.
That is the only navigation change needed per phase.

---

### Planner Hook Points

```typescript
// packages/shared/planner/plannerSections.ts
// The Today view is composed of sections. Phase 2+ adds new section types here.

export type PlannerSectionType =
  | 'declaration'       // Phase 1 — morning declaration
  | 'quote'             // Phase 1 — daily quote
  | 'sleep_window'      // Phase 1 — sleep optimizer output
  | 'meal'              // Phase 1 — breakfast, lunch, dinner
  | 'hydration'         // Phase 1 — hydration tracker row
  | 'alarm_anchor'      // Phase 1 — midday alarm label
  | 'mood_prompt'       // Phase 1 — evening mood entry
  // Phase 2 adds:
  | 'warrior_session'   // placeholder defined in Phase 1, renders nothing until Phase 2
  | 'keeper_session'    // same
  // Phase 3 adds:
  | 'doctrine_prompt'   // placeholder
  | 'evening_review'    // placeholder
  // Phase 4 adds:
  | 'couple_activity'   // placeholder
  // Phase 5 adds:
  | 'rite_milestone';   // placeholder

// In Phase 1, warrior_session and keeper_session sections render null.
// When Phase 2 ships, they render actual warrior content.
// No structural change to the planner needed.
```

---

### Firebase Namespace Hooks

```typescript
// The Firebase schema is pre-namespaced for all phases.
// Phase 1 writes to these paths. Future phases add new paths.

households/{id}/
  calendar/         ← Phase 1
  shifts/           ← Phase 1
  mood/             ← Phase 1
  grocery/          ← Phase 1
  mealPlan/         ← Phase 1
  hydration/        ← Phase 1
  warrior/          ← Phase 2 (namespace exists in rules, unused in Phase 1)
  keeper/           ← Phase 2
  doctrine/         ← Phase 3
  household/        ← Phase 4
  holydDays/        ← Phase 4
  rite/             ← Phase 5
```

**CURSOR PHASE 1 INSTRUCTION:** Create the Firebase security rules file to include
all namespaces now. The rules file does not need to be rebuilt in Phase 2.

---

### Settings Hook Points

```typescript
// packages/shared/settings/settingsSections.ts
// Settings screen is section-based. Phase 2+ adds new sections.

export const SETTINGS_SECTIONS = {
  phase1: [
    'schedule',          // work schedule
    'sleep',             // sleep preferences
    'alarms',            // alarm management
    'profile',           // name, tradition, hydration target
    'household',         // household name, connection status
    'app',               // version, tour reset, clear data
  ],
  phase2: [
    ...phase1,
    'warrior',           // discipline selection, stage, equipment list
  ],
  phase3: [
    ...phase2,
    'doctrine',          // canon preferences, shadow work schedule
  ],
};
```

---

### Tour Hook Points

```typescript
// packages/shared/tour/tourVersions.ts — already defined in 14_ONBOARDING_TOUR.md
// Adding Phase 2 tour:
// 1. Add v2 entry to TOUR_VERSIONS
// 2. Create screen files in packages/shared/tour/screens/v2/
// 3. Done — no other changes needed
```

---

## HOW TO ADD A NEW PHASE — INSTRUCTIONS FOR CURSOR

When you receive a new instruction file (e.g., `PHASE2_WARRIOR.md`):

### Step 1 — Read
Read the new instruction file completely before writing any code.

### Step 2 — Unlock the tab
In `packages/shared/navigation/tabConfig.ts`:
```typescript
// Change this:
{ key: 'warrior', locked: true, unlocksIn: 'phase2' }
// To this:
{ key: 'warrior', locked: false }
```

### Step 3 — Activate planner sections
In `packages/shared/planner/plannerSections.ts`:
Enable the section types that were placeholders. They now have real renderers.

### Step 4 — Build the new feature
Build the new tab/feature per the instruction file.
All shared utilities (Firebase, colors, typography, alarm system) already exist.
Import from `packages/shared/` — do not duplicate.

### Step 5 — Add tour screens
In `packages/shared/tour/tourVersions.ts`, add the new version entry.
Create screens in `packages/shared/tour/screens/v{N}/`.

### Step 6 — Update app.json version
Bump the version: `1.0.0` → `2.0.0` for major phases, `1.0.1` for patches.

### Step 7 — Test checklist
The instruction file for each phase includes a test checklist (see 16_PHASE_DEFINITIONS.md).
Run through the checklist before declaring the phase complete.

### Step 8 — Build APK
```bash
cd apps/imperium && eas build --platform android --profile production
cd apps/tending && eas build --platform android --profile production
```

---

## HOW TO PUSH AN OTA UPDATE (no new APK needed)

For JS-only changes (bug fixes, content updates, quote bank refresh):

```bash
# Imperium
cd apps/imperium
eas update --branch production --message "Fix: alarm snooze timer"

# Tending
cd apps/tending
eas update --branch production --message "Fix: alarm snooze timer"
```

Users see the update banner on next app open. One tap applies it.
No APK reinstall required.

---

## CONTENT UPDATE PIPELINE

When adding or changing content (recipes, doctrine text, quotes):

1. Update the content file (RECIPE_CARDS_v3_1.md or MASTER_IMPERIUM.md etc.)
2. Run the content import script:
   ```bash
   node scripts/importContent.js
   ```
   This converts the markdown content files into the JSON format the app uses.
3. Push as OTA update (no APK needed for content-only changes)

---

## SHARED PACKAGE STRUCTURE — WHAT ALREADY EXISTS IN PHASE 1

When building Phase 2+, these are available to import. Do not rebuild them.

```
packages/shared/
  firebase/
    household.ts       ← get/set household data
    calendar.ts        ← read/write calendar events
    mood.ts            ← read/write translated mood entries
    grocery.ts         ← read/write grocery list
    shifts.ts          ← read/write shift schedules
  alarm/
    alarmEngine.ts     ← schedule, cancel, manage alarms
    areYouAwake.ts     ← are-you-awake flow controller
    defaultAlarms.ts   ← per-profile default alarm configs
  scheduler/
    shiftGenerator.ts  ← generate shift days from config
    sleepOptimizer.ts  ← calculate sleep windows
    overrides.ts       ← handle manual day overrides
  mood/
    moodTranslator.ts  ← Groq translation call + preview
    moodStorage.ts     ← local SQLite read/write
    partnerView.ts     ← partner mood display logic
  quotes/
    quoteEngine.ts     ← daily quote rotation
    quoteGenerator.ts  ← Groq generation call
    fallbackQuotes.ts  ← offline fallback banks
  hydration/
    hydrationTracker.ts
  nourish/
    recipeData.ts      ← all 45 recipes as typed objects
    mealPlan.ts        ← weekly plan logic
    groceryBuilder.ts  ← generate grocery list from meal plan
  tour/
    tourEngine.ts      ← which tour to show, mark complete
    tourVersions.ts    ← version registry
  navigation/
    tabConfig.ts       ← tab definitions and lock states
  planner/
    plannerSections.ts ← section type registry
  settings/
    settingsSections.ts
  types/
    index.ts           ← all TypeScript interfaces
  colors/
    imperium.ts
    tending.ts
  typography/
    index.ts
```

---

## PHASE 1 COMPLETION SIGNAL

Phase 1 is complete when:
1. Both APKs install from QR codes scanned from the desktop app
2. Every item on the Phase 1 checklist in 16_PHASE_DEFINITIONS.md is checked
3. Garrin has tested the Imperium APK on his actual Android phone
4. The alarm wakes him up and the Are You Awake screen locks the phone

When all four are true: Phase 1 is done. Request Phase 2 files.

