# LAYER 1 PRIME PROMPT — SOVEREIGN WORKS
# Browser Prototype: Verification & Visual Contract
# Cursor Agent Mode · YOLO Mode required
# Complete all L1 checks before opening LAYER2_PRIME_PROMPT.md

# ══════════════════════════════════════════════════════════════════
# sovereign_v9.jsx IS THE LAW.
# Every screen built in Layers 2-9 must visually match this file.
# Keep it running in a browser for every layer. When in doubt:
# look at the prototype. If your screen looks different, fix yours.
# ══════════════════════════════════════════════════════════════════

---

## WHAT LAYER 1 IS

Layer 1 is NOT a build layer. No React Native. No Firebase. No native modules.

Layer 1 is the browser prototype — `sovereign_v9.jsx` — a single self-contained
React file that runs in the browser via Expo Web or a plain Vite/CDN dev server.
It is the complete visual and behavioral specification for everything that
follows. Every screen you build in Layer 2 must match it exactly.

Your job in Layer 1:
1. Get the prototype running in a browser
2. Run every verification check in the L1 checklist below
3. Fix any broken item before proceeding
4. Sign off on the visual contract

Do not begin Layer 2 until all L1 checks pass.

---

## WHAT IS IN sovereign_v9.jsx

`sovereign_v9.jsx` is a single-file React prototype (~2,500 lines).
It contains everything in one file: all data, all UI, all logic.
It is not modular. Do not refactor it. It is a spec artifact, not production code.

Contents:
- `TH` — theme tokens for both traditions (Imperium / Tending)
- `WEEK_PLAN` — 4-week meal plan (28 days × 3 meals = 84 entries, all NF-safe)
- `RECIPES` — full recipe database with ingredients, macros, and step-by-step methods
- `CEREMONY_SUPPLIES` — ceremony and tea protocol supply lists with where-to-find text
- `PLANNER_CEREMONY_MAP` — maps planner item IDs to ceremony supply keys
- `addCeremonySupplies()` — adds ceremony supplies to cart
- `IC` — SVG icon path constants
- The main `App` component — all tabs, modals, and state in one function

The prototype handles both traditions in one file via the `imp` boolean flag
(true = Imperium/INTJ, false = Tending/ESFJ). Toggle between them with the
profile selector in the tour screen.

---

## HOW TO RUN THE PROTOTYPE

### Option A — Expo Web (preferred)

```bash
mkdir C:\SovereignProto
cd C:\SovereignProto
npx create-expo-app@latest . --template blank-typescript
# Replace App.tsx with sovereign_v9.jsx (rename to App.jsx or configure entry)
npx expo start --web
```

### Option B — Vite

```bash
mkdir C:\SovereignProto
cd C:\SovereignProto
npm create vite@latest . -- --template react
# Replace src/App.jsx with sovereign_v9.jsx content
npm install && npm run dev
```

### Option C — CDN (fastest, no install)

Create `index.html` in any folder:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sovereign Works Prototype</title>
</head>
<body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel" src="sovereign_v9.jsx"></script>
</body>
</html>
```

Open `index.html` in a browser. The prototype runs entirely in-memory — no
server, no build step.

---

## CONTENT RULE — NON-NEGOTIABLE

Cursor does not write:
- Doctrine text of any kind
- Axioms, declarations, litanies, vows
- Recipe names, ingredients, or cooking steps
- Quote text
- Language vocabulary or grammar
- Ceremony steps or rite language
- Shadow work prompts
- Any descriptive copy inside the apps

All content in this prototype was authored by Garrin. Cursor reads it.
Cursor does not generate it. If text appears incorrect, Cursor flags it
with `// CONTENT CHECK: [description]` and does not replace it.

---

## LAYER 1 VERIFICATION CHECKLIST

Complete every check. Mark `[x]` when passing. Do not proceed to Layer 2
until all are `[x]`.

### STARTUP
- [ ] L1.01 — Prototype launches in browser without console errors
- [ ] L1.02 — Profile selector shows Imperium (INTJ) and Tending (ESFJ)
- [ ] L1.03 — Selecting Imperium shows dark background #0D0D0D, gold accent
- [ ] L1.04 — Selecting Tending shows dark background #120A0E, rose accent
- [ ] L1.05 — Bottom tab bar shows: Home / Planner / Nourish / More

### HOME TAB
- [ ] L1.06 — Shift strip renders (shows shift type, times, work/off status)
- [ ] L1.07 — Quote renders below shift strip
- [ ] L1.08 — Partner mood card renders (dot score display, 5 circles)
- [ ] L1.09 — Mind / Body / Soul hub tiles render
- [ ] L1.10 — Body hub expands to show hydration tracker

### PLANNER TAB — TODAY
- [ ] L1.11 — Today's planner items render as collapsible rows
- [ ] L1.12 — Tapping a planner row expands it
- [ ] L1.13 — Breakfast row expanded → shows ingredient list with + Cart buttons
- [ ] L1.14 — Breakfast row expanded → shows numbered cooking steps
- [ ] L1.15 — Breakfast row expanded → shows macro strip (CAL / PRO / CARB / FAT / FIBER)
- [ ] L1.16 — Lunch row and Dinner row: same as L1.13–L1.15
- [ ] L1.17 — Declaration row expanded → shows declaration text (or TODO placeholder)
- [ ] L1.18 — Bedtime row shows "Set Alarm" button inline (right side of row)
- [ ] L1.19 — Checking a planner item marks it done (checkbox fills)

### NOURISH TAB — PLAN SUB-TAB
- [ ] L1.20 — 4-week plan renders, all 4 weeks collapsible
- [ ] L1.21 — Expanding a week shows 7 days
- [ ] L1.22 — "Add All Week" button appears at top of each expanded week
- [ ] L1.23 — Expanding a day shows 3 meal slots (Breakfast / Lunch / Dinner)
- [ ] L1.24 — Each meal slot shows ingredient list with per-ingredient + Cart buttons
- [ ] L1.25 — Each meal slot shows numbered cooking steps
- [ ] L1.26 — Each meal slot shows macro strip above ingredient list
- [ ] L1.27 — "+ Add All to Cart" button appears at bottom of each meal's ingredient list
- [ ] L1.28 — No meal in the plan contains peanut butter or peanuts
- [ ] L1.29 — All 84 meal entries (28 days × 3) have NF tag or RECIPE data

### NOURISH TAB — GROCERY SUB-TAB
- [ ] L1.30 — Empty state shows correct instruction (tap a meal, use + Cart buttons)
- [ ] L1.31 — Tapping "+ Cart" on an ingredient adds it to grocery list
- [ ] L1.32 — Item appears under correct category (Produce / Protein / Dairy / etc.)
- [ ] L1.33 — Adding same ingredient twice → count shows ×2, one row only (no duplicate)
- [ ] L1.34 — × button removes item from cart
- [ ] L1.35 — Checking an item moves it to "In Basket" section (strike-through, dim)
- [ ] L1.36 — "Clear Checked" button appears when ≥1 item is checked
- [ ] L1.37 — "Ceremony & Practice" category appears for ceremony items (#7a5a8a purple)
- [ ] L1.38 — Ceremony items show where-to-find text below the item name

### DIETARY FILTERS
- [ ] L1.39 — Nut Allergy filter ON → any meal without NF tag shows warning/block indicator
- [ ] L1.40 — No NF-tagged meal contains peanuts or tree nuts (visual inspection of WEEK_PLAN data)
- [ ] L1.41 — GERD filter, GF filter, DF filter each function independently

### ADD ALL THIS WEEK
- [ ] L1.42 — Tapping "Add All Week N Ingredients to Cart" adds all eligible meals
- [ ] L1.43 — Only meals passing the current dietary filter are added
- [ ] L1.44 — Duplicate ingredients consolidate (count increments, no new row)

### CEREMONY SUPPLIES
- [ ] L1.45 — CEREMONY_SUPPLIES constant is present and populates correctly
- [ ] L1.46 — addCeremonySupplies() function exists and adds items to cart
- [ ] L1.47 — Ceremony items route to 'ceremony' unit category in cart
- [ ] L1.48 — Where-to-find text is present on all ceremony items

### MOOD MODAL
- [ ] L1.49 — Mood modal opens from home tab
- [ ] L1.50 — Score 1–10 can be entered
- [ ] L1.51 — Bracket translation text renders below score
- [ ] L1.52 — Partner mood card updates with dot score

### ALARMS (STUB)
- [ ] L1.53 — "Set Alarm" button on bedtime planner row opens alarm modal
- [ ] L1.54 — Alarm modal shows wind-down and sleep times from schedule
- [ ] L1.55 — Alarm modal is a stub — no native alarm fires in Layer 1

### OVERTIME
- [ ] L1.56 — Overtime modal accessible from shift strip
- [ ] L1.57 — Selecting +1h / +2h / +4h updates the displayed sleep window
- [ ] L1.58 — OT badge appears in shift strip when overtime is active

### HYDRATION
- [ ] L1.59 — Hydration tracker renders in Body hub
- [ ] L1.60 — Tapping + increments oz total
- [ ] L1.61 — Daily goal fill indicator updates correctly

### GENERAL
- [ ] L1.62 — No console errors in browser dev tools
- [ ] L1.63 — Prototype runs without crashes for 5 minutes of normal use
- [ ] L1.64 — All TODO placeholders are logged — do not fill them with invented content

---

## CONTENT INVENTORY — WHAT IS IN THE PROTOTYPE

The following data is fully populated in `sovereign_v9.jsx`:

| Data | Status |
|------|--------|
| WEEK_PLAN (4 weeks, 84 meals) | ✓ Complete |
| RECIPES (ingredients, macros, steps for all 84 meals) | ✓ Complete |
| CEREMONY_SUPPLIES (both traditions, all tea protocols) | ✓ Complete |
| PLANNER_CEREMONY_MAP | ✓ Complete |
| Theme tokens (Imperium + Tending) | ✓ Complete |
| SVG icons | ✓ Complete |
| Dietary filter logic | ✓ Complete |
| Cart logic (addIngredient, addAllIngredients, removeCartItem) | ✓ Complete |
| Sleep window calculation | ✓ Complete |

The following content is in spec files (NOT in the prototype) and must be
imported by Cursor from the spec files during Layer 2:

| Content | Source file |
|---------|-------------|
| Morning Declaration text | MASTER_IMPERIUM.md / MASTER_TENDING.md |
| Evening Inventory questions | MASTER_IMPERIUM.md / MASTER_TENDING.md |
| Midday Anchor instructions (Imperium) | MASTER_IMPERIUM.md |
| Morning Quiet instructions (Tending) | MASTER_TENDING.md |
| Replenishment Session instructions (Tending) | MASTER_TENDING.md |
| Daily quotes (30 per tradition) | MASTER_IMPERIUM.md / MASTER_TENDING.md |
| Axioms | MASTER_IMPERIUM.md / MASTER_TENDING.md |
| Alarm labels and confirmation text | 07_ALARM_SYSTEM.md |
| Are You Awake copy | 07_ALARM_SYSTEM.md |
| Partnership Rite text | MASTER docs |

Cursor imports these verbatim. Cursor does not write them.
If a piece of content is not locatable in the spec files, Cursor writes:
`// TODO: content from [filename]`

---

## WHAT LAYER 1 PRODUCES

At the end of Layer 1 you have:
1. The prototype running correctly in a browser
2. All L1 verification checks marked `[x]`
3. A clear mental model of every screen and interaction before writing a line of
   React Native code

The prototype is the contract. If something looks different in Layer 2,
Layer 2 is wrong — not the prototype.

---

## WHAT LAYER 1 DOES NOT PRODUCE

Layer 1 produces NO APK. There is nothing to install on a phone after Layer 1.
Layer 1 is browser-only prototype verification. The first APK comes after Layer 2.

When Layer 1 is complete, Cursor reports back and waits. Garrin gives the
command to start Layer 2. Layer 2 ends with both APKs built and ready to install.

## LAYER 2 BEGINS WHEN

- All L1.01–L1.64 checks are `[x]`
- Prototype runs without console errors
- You have opened and read `sovereign_v9.jsx` completely
- You understand the visual layout of all 5 tabs and all modals

Then stop. Report back with:
1. "Layer 1 complete — all 64 checks passed." (or list what needed fixing)
2. Wait for Garrin to say "start Layer 2."

Do NOT open LAYER2_PRIME_PROMPT.md until Garrin says so.

**Keep `sovereign_v9.jsx` running in a browser the entire time you build Layer 2.**
It is the visual contract. Match it exactly. Screen by screen. Tab by tab. Modal by modal.

---

## WHAT CURSOR WRITES IN LAYER 1

| Task | Cursor writes? |
|------|---------------|
| Running the prototype in a browser | ✓ Yes — setup commands only |
| Fixing broken JavaScript in prototype | ✓ Yes — bugs only, not content |
| Filling TODO content placeholders | ✗ Never |
| Generating recipe text, quote text, doctrine | ✗ Never |
| Changing visual design | ✗ Never without instruction |
