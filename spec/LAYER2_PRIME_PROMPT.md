# LAYER 2 PRIME PROMPT — SOVEREIGN WORKS
# Cursor Agent Mode · YOLO Mode required
# Read this file completely before writing a single line of code.

# ══════════════════════════════════════════════════════════════════
# PROTOTYPE LAW — NON-NEGOTIABLE
# sovereign_v9.jsx is the visual and behavioral contract for EVERY
# screen you build. Keep it open in a browser the entire time you
# are building Layer 2. If a screen you build does not match the
# prototype, the screen is wrong — not the prototype.
# ══════════════════════════════════════════════════════════════════

# ══════════════════════════════════════════════════════════════════
# APK REQUIREMENT — MANDATORY FINAL STEP
# After ALL L2 verification checks pass, you MUST build both APKs
# before reporting Layer 2 complete. Garrin installs them on the
# test phone between layers. No APK = Layer 2 is not done.
# ══════════════════════════════════════════════════════════════════

---

## WHAT YOU HAVE

Two files:
- `sovereign_v9.jsx` — the working browser prototype. This is your behavioral
  and visual contract. Every screen you build in React Native must match it.
  Do not invent UI that does not exist in this file.
- `SOVEREIGN_CURSOR_PACKAGE.zip` — unzip this. All spec files are inside
  `SOVEREIGN_WORKS_PHASE1/`. Read them as directed below.

---

## WHAT YOU ARE BUILDING — LAYER 2 ONLY

Layer 2 is the Daily Hub. It is the screen Garrin and Holli open every single
day. Everything else is additive. Layer 2 must be solid before anything else
is touched.

Layer 2 scope:
- Home tab (declaration, shift strip, quote, charts, partner mood card,
  Mind/Body/Soul hub tiles, axiom)
- Planner tab → Today sub-tab only (checklist, sleep window strip, progress bar,
  item expansion, bedtime Set Alarm button)
- Nourish tab → Plan sub-tab + Grocery sub-tab (4-week meal plan, dietary
  filters, per-ingredient cart with quantity merging, Add All Week button)
- Mood modal (log, partner view, history)
- Overtime modal
- Hydration tracker (inline in Body hub)

Layer 2 does NOT include:
- Alarm native implementation (Layer 3)
- Calendar sub-tab (Layer 6)
- Schedule sub-tab (Layer 6)
- Charts tab (Layer 7)
- More tab (Layer 7)
- Electron desktop app (separate layer)
- Garmin watch app (separate layer)

---

## READ ORDER — DO THIS BEFORE ANY CODE

The zip is already extracted. Read files in this exact order:

1. `SOVEREIGN_WORKS_PHASE1/UPDATE_00_IGNITION.md`
2. `SOVEREIGN_WORKS_PHASE1/UPDATE_04_HOUSEHOLD_JOIN.md`
3. `SOVEREIGN_WORKS_PHASE1/01_TECH_STACK.md`
4. `SOVEREIGN_WORKS_PHASE1/02_FIREBASE_SCHEMA.md`
5. `SOVEREIGN_WORKS_PHASE1/03_PROFILES.md`
6. `SOVEREIGN_WORKS_PHASE1/08_MOOD_SYSTEM.md`
7. `SOVEREIGN_WORKS_PHASE1/09_DAILY_QUOTE.md`
8. `SOVEREIGN_WORKS_PHASE1/10_HYDRATION.md`
9. `SOVEREIGN_WORKS_PHASE1/11_NOURISH.md`
10. `SOVEREIGN_WORKS_PHASE1/12_SETTINGS.md`
11. `SOVEREIGN_WORKS_PHASE1/15_VISUAL_DESIGN.md`
12. `SOVEREIGN_WORKS_PHASE1/17_HOOKS_AND_EXPANSION.md`
13. `SOVEREIGN_WORKS_PHASE1/18_TAB_MANIFEST.md`
14. `SOVEREIGN_WORKS_PHASE1/21_BUILD_SEQUENCE.md`
15. `SOVEREIGN_WORKS_PHASE1/RECIPE_CARDS_v3_1.md` — READ ONLY. Import as data.
16. `SOVEREIGN_WORKS_PHASE1/MASTER_IMPERIUM.md`   — READ ONLY. Import as data.
17. `SOVEREIGN_WORKS_PHASE1/MASTER_TENDING.md`    — READ ONLY. Import as data.

Then open `sovereign_v9.jsx` and read it completely.

---

## CONTENT RULE — NON-NEGOTIABLE

Cursor does not write:
- Doctrine text
- Axioms, declarations, litanies, or vows
- Recipe names, ingredients, or instructions
- Quote text of any kind
- Language vocabulary or grammar
- Ceremony steps or rite language
- Shadow work prompts
- Any descriptive copy inside the apps

Cursor only writes code. All content comes from the spec files listed above.
When a spec file contains text to display, Cursor imports it verbatim.
When a spec file does not contain required text, Cursor leaves a clearly
labeled placeholder: `// TODO: content from [filename]`.

This rule exists because all content in this system is original authored
material belonging to the creator. Cursor generating it produces wrong output
that must be rebuilt from scratch.

---

## PROJECT SETUP

```bash
mkdir C:\SovereignWorks
cd C:\SovereignWorks
git init
git remote add origin https://github.com/xpliciton3/Imperium.git
```

The package is already extracted to `C:\SovereignWorks\SOVEREIGN_WORKS_PHASE1\`.
Copy `sovereign_v9.jsx` into `C:\SovereignWorks\SOVEREIGN_WORKS_PHASE1\`.

Folder structure to create:

```
sovereign-works/
├── apps/
│   ├── imperium/
│   │   ├── app/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx          ← entry, routes to onboarding or home
│   │   │   ├── home.tsx
│   │   │   ├── planner.tsx
│   │   │   ├── nourish.tsx
│   │   │   └── more.tsx           ← stub only for Layer 2
│   │   ├── components/
│   │   ├── constants/
│   │   └── assets/
│   └── tending/
│       ├── app/
│       │   ├── _layout.tsx
│       │   ├── index.tsx
│       │   ├── home.tsx
│       │   ├── planner.tsx
│       │   ├── nourish.tsx
│       │   └── more.tsx           ← stub only for Layer 2
│       ├── components/
│       ├── constants/
│       └── assets/
├── packages/
│   └── shared/
│       ├── firebase/
│       │   ├── config.ts
│       │   └── hooks.ts
│       ├── data/
│       │   ├── recipes.ts         ← imported from RECIPE_CARDS_v3_1.md
│       │   ├── quotes.ts          ← fallback bank (see below)
│       │   ├── imperium-content.ts ← content from MASTER_IMPERIUM.md
│       │   └── tending-content.ts  ← content from MASTER_TENDING.md
│       ├── hooks/
│       │   ├── useCart.ts
│       │   ├── useHydration.ts
│       │   ├── useMood.ts
│       │   ├── useSchedule.ts
│       │   └── usePlanner.ts
│       └── types/
│           └── index.ts           ← all interfaces from 17_HOOKS_AND_EXPANSION.md
└── SOVEREIGN_WORKS_PHASE1/                         ← read-only spec files, do not modify
```

---

## TECH STACK — EXACT VERSIONS

```bash
npx create-expo-app@latest apps/imperium --template blank-typescript
npx create-expo-app@latest apps/tending  --template blank-typescript
```

Required packages (install in both apps and shared where needed):

```bash
npx expo install expo-router expo-sqlite expo-secure-store
npx expo install expo-notifications expo-task-manager expo-av expo-haptics
npx expo install expo-barcode-scanner react-native-qrcode-svg
npx expo install @react-native-async-storage/async-storage
npx expo install firebase
npm install react-native-widget-extension
```

Firebase: Realtime Database (NOT Firestore). Spark free plan.
Groq API: free tier, llama-3.3-70b-versatile, 14,400 req/day.
No paid services. No credit card required for any dependency.

---

## EMBEDDED LOCAL AI MODELS — SPEC FOR LAYER 5+

Do not build these in Layer 2. Scaffold the folder only. Build when Layer 4
is verified complete.

```
packages/shared/ai/
├── whisper/
│   └── README.md     ← placeholder: "Whisper Tiny ~75MB, bundled offline"
├── phoneme/
│   └── README.md     ← placeholder: "TFLite phoneme classifier ~50MB"
└── index.ts          ← placeholder: exports to be wired in Layer 5
```

The three local models required eventually:
- **Whisper Tiny** (~75MB) — offline speech-to-text for voice input
  Source: https://huggingface.co/ggerganov/whisper.cpp
  Integration: react-native-whisper or llama.rn (evaluate at Layer 5)
- **TFLite phoneme classifier** (~50MB) — vocal coach for constructed languages
  Required for: Vel'nar, Aevaran, Varkon-Keth, Aurelai, Serethi, Nemeiran,
  Caelvari (7 languages). IPA-driven. No pre-recorded audio exists.
  All pronunciation is generated from IPA via TTS, not recordings.
  Integration: react-native-fast-tflite at Layer 5
- **Quote fallback bank** — static JSON, bundled, no model required.
  30 quotes per tradition. Content from MASTER_IMPERIUM.md and MASTER_TENDING.md.
  Cursor imports verbatim. Cursor does not write quotes.

For Layer 2, Groq handles mood translation and quote generation online.
Local models are Layer 5. Do not block Layer 2 on them.

---

## SQLITE SCHEMA — CREATE ON FIRST LAUNCH

```sql
CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY,
  path TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  synced INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS grocery (
  item_key TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  amt TEXT,
  unit TEXT,
  count INTEGER DEFAULT 1,
  checked INTEGER DEFAULT 0,
  category TEXT,
  added_at INTEGER
);

CREATE TABLE IF NOT EXISTS hydration_log (
  id TEXT PRIMARY KEY,
  profile TEXT NOT NULL,
  oz INTEGER NOT NULL,
  logged_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS mood_entries (
  id TEXT PRIMARY KEY,
  score INTEGER NOT NULL,
  note TEXT,
  translation TEXT,
  logged_at INTEGER NOT NULL,
  synced INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS planner_state (
  date TEXT NOT NULL,
  item_id TEXT NOT NULL,
  done INTEGER DEFAULT 0,
  PRIMARY KEY (date, item_id)
);

CREATE TABLE IF NOT EXISTS alarm_configs (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  hour INTEGER NOT NULL,
  minute INTEGER NOT NULL,
  enabled INTEGER DEFAULT 1,
  days TEXT,
  vibrate INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS quote_bank (
  id TEXT PRIMARY KEY,
  profile TEXT NOT NULL,
  text TEXT NOT NULL,
  month TEXT NOT NULL,
  used INTEGER DEFAULT 0
);
```

---

## FIREBASE SYNC ARCHITECTURE

```typescript
// writeShared(path, data) — SQLite first, Firebase queued
// drainSyncQueue() — fires on app foreground + network-restored
// Firebase path: households/{householdId}/...

// Paths used in Layer 2:
// households/{id}/grocery/currentList/{itemKey}
// households/{id}/mood/partner/{date}
// households/{id}/hydration/{profile}/{date}
// households/{id}/planner/{profile}/{date}/{itemId}
```

See `02_FIREBASE_SCHEMA.md` for full security rules. Deploy rules before
testing sync.

---

## GROCERY CART — EXACT BEHAVIOR

This is the most-used feature in Layer 2. Get it exactly right.

```typescript
interface CartItem {
  name: string;
  amt: string;        // base amount from recipe
  unit: GroceryCategory;
  count: number;      // how many times this ingredient was added
  checked: boolean;
}

type GroceryCategory =
  | 'produce' | 'protein' | 'dairy' | 'grains'
  | 'pantry'  | 'spice'   | 'beverage';

// CATEGORY SORT ORDER (always in this order, never alphabetical):
const CATEGORY_ORDER: GroceryCategory[] = [
  'produce', 'protein', 'dairy', 'grains', 'pantry', 'spice', 'beverage'
];

// Category colors (dots and headers):
const CATEGORY_COLORS = {
  produce:  '#5a9a5a',
  protein:  '#c04040',
  dairy:    '#4a80c0',
  grains:   '#a07840',
  pantry:   '#c0a040',
  spice:    '#808040',
  beverage: '#4a8088',
};

function addIngredient(ing: Ingredient): void {
  const key = ing.name.toLowerCase().trim();
  // If already in cart → increment count only. Do NOT add second row.
  // If not in cart → add with count: 1
  // After add → writeShared to Firebase grocery path
}

function addAllIngredients(mealName: string): void {
  // Loop all ingredients for the meal
  // Call addIngredient() on each
  // Toast: "All ingredients added"
}

// Display: when count > 1, show "×2" or "×3" next to the amount
// Remove button: × on every item, removes entirely regardless of count
// Checked items: move to bottom of their category, strike-through, opacity 0.45
// Clear Checked button: appears only when ≥1 item is checked
```

---

## RECIPE DATA — IMPORT ONLY

Recipes come from `RECIPE_CARDS_v3_1.md`. Cursor imports them as typed
objects. Cursor does not write, edit, or invent recipe content.

```typescript
// packages/shared/data/recipes.ts
// Import each recipe from RECIPE_CARDS_v3_1.md verbatim.
// Structure per recipe:

interface Recipe {
  id: string;           // B-01, L-03, D-07, etc.
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  tags: string[];       // NF, GF, DF, GERD, MTHFR, ON-DUTY, BATCH, etc.
  baseServes: string;   // "2 adults" — already corrected in source file
  ingredients: Ingredient[];
  steps: string[];      // step-by-step method, one sentence per step — imported verbatim from RECIPE_CARDS_v3_1.md METHOD section
  nutrition: NutritionInfo;
  gbpNote?: string;     // Tending app only — absent from Imperium entirely
}

interface Ingredient {
  name: string;
  amt: string;
  unit: GroceryCategory;
}
```

NUT ALLERGY SAFETY — CRITICAL:
The `NF` tag is a hard filter. If `diet.nutAllergy === true`, any meal
without the `NF` tag must be blocked entirely — not shown, not tappable.
No meal tagged `NF` may contain peanuts, tree nuts, or peanut butter.
Sunflower seed butter is NF-safe. This was a confirmed bug in earlier
prototype versions. The recipe database in RECIPE_CARDS_v3_1.md is clean.
Trust the source file. Do not add ingredients not in the source file.

---

## DIETARY FILTER LOGIC

```typescript
interface DietarySettings {
  nutAllergy: boolean;   // hard filter — removes meals missing NF tag
  gerd: boolean;         // hard filter — removes meals missing GERD tag
  glutenFree: boolean;   // hard filter — removes meals missing GF tag
  dairyFree: boolean;    // hard filter — removes meals missing DF tag
  mthfr: boolean;        // priority sort only — does not remove meals
  gbp: boolean;          // Tending app only — priority sort + notes visible
  onDutyFirst: boolean;  // ON-DUTY meals surface first on shift days
}

function mealPassesFilter(tags: string[], diet: DietarySettings): boolean {
  if (diet.nutAllergy  && !tags.includes('NF'))   return false;
  if (diet.gerd        && !tags.includes('GERD'))  return false;
  if (diet.glutenFree  && !tags.includes('GF'))    return false;
  if (diet.dairyFree   && !tags.includes('DF'))    return false;
  return true;
}
```

When a dietary setting change causes a scheduled meal to fail the filter,
surface a swap prompt on that day — do not silently remove the meal.

---

## MEAL PLAN WEEK STRUCTURE

The 4-week plan lives in `packages/shared/data/weekPlan.ts`.
Import the WEEK_PLAN from `sovereign_v9.jsx` (the updated prototype).
The prototype has the corrected week plan with sunflower seed butter.
Do not invent meals not in the prototype or recipe database.

Each day has:
```typescript
interface PlanDay {
  day: string;      // "Monday", "Tuesday", etc.
  batch?: boolean;  // true = batch cook day, show BATCH badge + teal dot
  meals: {
    b: string;      // breakfast meal name
    l: string;      // lunch meal name
    d: string;      // dinner meal name
  };
  tags: {
    b: string[];
    l: string[];
    d: string[];
  };
}
```

---

## DAILY QUOTE SYSTEM

```typescript
// Online path (Groq):
// - Generate 30 quotes per tradition per month
// - Store in quote_bank SQLite table
// - Rotate daily, mark used = 1
// - Regenerate when used count reaches 28

// Offline fallback (hardcoded):
// - 30 quotes per tradition in packages/shared/data/quotes.ts
// - Content imported verbatim from MASTER_IMPERIUM.md and MASTER_TENDING.md
// - Cursor does NOT write quote text
// - If quote text is not in the master docs, leave placeholder:
//   "// TODO: quote from MASTER_IMPERIUM.md"

// Quote display: home tab, below shift strip, above charts
// Imperium style: left-border gold, italic, Cormorant font
// Tending style: left-border rose, italic, Cormorant font
```

---

## MOOD SYSTEM

```typescript
// Score: 1–10 integer
// Raw note: device-only, never leaves phone, never written to Firebase
// Translation: auto-generated from score bracket (no Groq for this — use
//   the hardcoded bracket strings from sovereign_v9.jsx)
// What syncs to Firebase: dot score (Math.round(score/2), 1–5) only
// Firebase path: households/{id}/mood/partner/{date}

// Groq mood translation (future enhancement, not Layer 2):
//   Layer 2 uses hardcoded bracket translations from the prototype
//   Groq nuanced translation is Layer 5

// Partner feed: reads Firebase mood path for partner's profile
//   Renders in partner's register (INTJ→ESFJ or ESFJ→INTJ)
//   Dot score displayed as 5 circles, filled count = dot score
```

---

## SLEEP WINDOW CALCULATION

```typescript
function calculateSleepWindow(shiftStart: string, shiftEnd: string, isWorkDay: boolean) {
  if (!isWorkDay) {
    return { windDown: "9:30 PM", sleep: "10:30 PM", wake: "6:30 AM", note: "Rest day" };
  }
  const startHour = parseInt(shiftStart.split(':')[0]);
  const endHour   = parseInt(shiftEnd.split(':')[0]);
  const isNight   = startHour >= 17;

  if (isNight) {
    const sleepHour = (endHour + 1) % 24;
    const wakeHour  = (endHour + 8) % 24;
    return { windDown: fmt24(sleepHour), sleep: fmt24(sleepHour), wake: fmt24(wakeHour), note: "Night shift — darken the room" };
  }
  const wakeHour  = startHour - 1;
  const sleepHour = startHour - 9;
  return { windDown: fmt24(sleepHour + 1), sleep: fmt24(sleepHour), wake: fmt24(wakeHour), note: "Pre-shift — full 8 hours" };
}
```

Bedtime planner row: when schedule is set, show a `Set Alarm` tappable button
inline on the row (right side, before the expand chevron). Opens alarm setup.
Layer 2 alarm setup is a stub modal — native alarm fires in Layer 3.

---

## OVERTIME MODAL

Four options: +1h / +2h / +4h / Custom.
Adjusts tonight's sleep window and alarm times only.
Tomorrow unchanged. Single-day SQLite exception — does not modify schedule.
OT badge shows in shift strip on home tab when active: "OT +2h"
Cancel overtime: shown inside OT modal when OT is active.

---

## VISUAL DESIGN RULES

Read `15_VISUAL_DESIGN.md` for full design system. Non-negotiables:

- Imperium: dark background `#0D0D0D`, gold accent `#B8962E`, Cormorant Garamond for display text, JosefinSans for UI
- Tending: dark background `#120A0E`, rose accent `#C47878`, same fonts
- No white backgrounds. No light mode in Layer 2.
- All tab bars at bottom. No hamburger menus.
- Sigils: INTJ (quill over crossed swords) and ESFJ (heart of flame) — render as SVG paths per `15_VISUAL_DESIGN.md`
- Status bar: dark content. No default Expo status bar styling.

---

## PLANNER TODAY TAB — ITEM TYPES

Each planner item is a collapsible row. Tap the row or the chevron to expand.
Checkbox on the left. Color dot on the right. Time label below item name.

When expanded, each item type has specific content:

| ID | Label source | Expanded content source |
|----|-------------|------------------------|
| `decl` | "Morning Declaration" | Full spoken declaration text from MASTER_IMPERIUM.md or MASTER_TENDING.md |
| `quiet` | "Morning Quiet" (Tending only) | Instructions from MASTER_TENDING.md |
| `hyd` | "First 24 oz of water" | Hydration instructions from 10_HYDRATION.md |
| `mid` | "Midday Anchor" (Imperium only) | Instructions from MASTER_IMPERIUM.md |
| `inv` | "Evening Inventory" | Questions from MASTER_IMPERIUM.md / MASTER_TENDING.md |
| `yours` | "Replenishment Session" (Tending) | Instructions from MASTER_TENDING.md |
| `b` / `l` / `d` | Meal name from week plan | Ingredient list with + Cart per item, + Add All, then numbered cooking steps from recipe card |
| `bed` | Bedtime window | Sleep window times + Set Alarm button |

Cursor does not write the expanded content text. It imports from the master docs.
If text is not locatable, it leaves `// TODO: content from [filename]`.

---

## BUILD SEQUENCE FOR LAYER 2

Complete in this order. Do not move to the next item until the current one
renders without errors.

```
L2.01  Project scaffold — both apps + shared package
L2.02  TypeScript interfaces (from 17_HOOKS_AND_EXPANSION.md)
L2.03  Color constants (from 15_VISUAL_DESIGN.md)
L2.04  Firebase config + writeShared() + drainSyncQueue()
L2.05  SQLite schema created on first launch
L2.06  Recipe data imported from RECIPE_CARDS_v3_1.md → recipes.ts
L2.07  Quote fallback bank imported from MASTER docs → quotes.ts
L2.08  Content strings imported from MASTER_IMPERIUM.md → imperium-content.ts
L2.09  Content strings imported from MASTER_TENDING.md → tending-content.ts
L2.10  useCart hook — addIngredient, addAllIngredients, removeCartItem, quantity merging
L2.11  useHydration hook — log oz, daily total, Firebase sync
L2.12  useMood hook — score, note, translation, Firebase sync (dot score only)
L2.13  useSchedule hook — shift type, sleep window, overtime
L2.14  usePlanner hook — items list, done state, date-keyed SQLite persistence
L2.15  Bottom tab navigator — Home / Planner / Nourish / More(stub)
L2.16  Home tab — full layout matching sovereign_v9.jsx
L2.17  Planner tab — Today sub-tab only
         Meal items (b/l/d): expand to show ingredients + + Cart buttons + cooking steps
L2.18  Nourish tab — Plan sub-tab with dietary filter + week expansion
         Each meal card: ingredients with + Cart buttons, + Add All, numbered cooking steps
L2.19  Nourish tab — Grocery sub-tab with category grouping + quantity display
L2.20  Mood modal — log, partner, history tabs
L2.21  Overtime modal
L2.22  Body hub — hydration inline
L2.23  Mind hub + Soul hub — locked state (stub, content behind day gates)
L2.24  Local AI model folder scaffold (whisper/, phoneme/) — placeholders only
L2.25  Verify: both Imperium and Tending apps run, all Layer 2 screens render
L2.26  Verify: add ingredient to cart → shows in grocery grouped by category
L2.27  Verify: add same ingredient twice → count shows ×2, no duplicate row
L2.28  Verify: dietary filter ON → blocked meals show warning, not removed silently
L2.29  Verify: mood score logged → partner feed updates on partner's phone
L2.30  Mark all L2 checkboxes in 21_BUILD_SEQUENCE.md as [x]
```

---

## WHAT CURSOR WRITES

| File type | Cursor writes? |
|-----------|---------------|
| `.ts` / `.tsx` component files | ✓ Yes |
| Hook files | ✓ Yes |
| Firebase config | ✓ Yes |
| SQLite schema | ✓ Yes |
| Package.json / build config | ✓ Yes |
| AndroidManifest.xml | ✓ Yes (Layer 3 — not Layer 2) |
| Doctrine text | ✗ Never |
| Recipe text / ingredients | ✗ Never — import from RECIPE_CARDS_v3_1.md |
| Quote text | ✗ Never — import from MASTER docs |
| Declaration / axiom / vow text | ✗ Never — import from MASTER docs |
| Language vocabulary | ✗ Never |
| Ceremony steps | ✗ Never |
| Shadow work prompts | ✗ Never |

---

## VERIFICATION BEFORE HANDING BACK

Before Layer 2 is considered complete:

1. Both apps (`imperium` and `tending`) launch without errors on Android emulator
2. All Layer 2 screens render matching `sovereign_v9.jsx` layout
3. Add ingredient → appears in grocery cart under correct category
4. Add same ingredient twice → `×2` shown, one row only
5. Add All Week → all eligible meals' ingredients added
6. Nut allergy ON → zero peanut butter, zero tree nuts in visible meals
7. Mood score submitted → dot score appears on partner phone's feed
8. Planner items persist across app close (SQLite, date-keyed)
9. Hydration oz persists across app close (SQLite)
10. No hardcoded content written by Cursor — all text from spec files or `// TODO:`

---

## SESSION CONTINUITY

Token limits will interrupt the build. When resuming:

1. Open `21_BUILD_SEQUENCE.md`
2. Find the first unchecked `[ ]` item
3. Resume there — do not restart from the beginning

This is the only session continuity mechanism. Keep this file updated.


---

## ══ MANDATORY FINAL STEP — BUILD BOTH APKS AND STOP ══
## This is the last thing Cursor does in Layer 2.
## Do not begin Layer 3 until Garrin confirms both APKs install and work.

### Step 1 — Verify all 30 checks pass
All L2.01–L2.30 must be [x] before building. Do not build a broken APK.

### Step 2 — Build Imperium APK
```bash
cd C:\SovereignWorks\apps\imperium
npx eas build --platform android --profile preview --local
```
If EAS fails, fallback:
```bash
npx expo run:android --variant release
```

### Step 3 — Build Tending APK
```bash
cd C:\SovereignWorks\apps\tending
npx eas build --platform android --profile preview --local
```
Same fallback if needed.

### Step 4 — Push to GitHub
```bash
cd C:\SovereignWorks
git add -A
git commit -m "Layer 2 complete — Imperium and Tending APKs built"
git push origin main
```

### Step 5 — Report to Garrin and STOP
Tell Garrin:
- "Layer 2 complete."
- "Imperium APK: [filename and location]"
- "Tending APK: [filename and location]"
- "Copy both to your phone via USB. Install each one. Test both apps."
- "Tell me when you're ready to start Layer 3."

Do NOT open LAYER3_PRIME_PROMPT.md. Do NOT begin Layer 3.
Wait for Garrin's confirmation before doing anything else.

---

## LAYER 3 BEGINS WHEN

- Both APKs install on the test phone without crashing
- All Layer 2 screens render on the physical device
- Cart, hydration, mood, and planner persist across app close
- Dietary filter blocks nut-containing meals correctly on device

Layer 3 is the native Android alarm system:
- `AndroidManifest.xml` — SCHEDULE_EXACT_ALARM, USE_EXACT_ALARM,
  VIBRATE, WAKE_LOCK, RECEIVE_BOOT_COMPLETED, SYSTEM_ALERT_WINDOW
- Boot receiver (alarms survive phone restart)
- Full-screen intent (alarm fires over lock screen)
- Are You Awake check (fires if alarm dismissed without confirmation)
- Snooze (9 min default, user-configurable)
- Bedtime Set Alarm button wired to real native alarm

Layer 3 spec is in `SOVEREIGN_WORKS_PHASE1/07_ALARM_SYSTEM.md`.
Do not begin Layer 3 until told to.

