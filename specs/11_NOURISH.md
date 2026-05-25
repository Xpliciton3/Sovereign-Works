# NOURISH TAB — COMPLETE SPECIFICATION
# No placeholders. Full implementation. Every item explicitly defined.

---

## TAB COLOR: Forge Green #6B8B3A (Imperium) / Harvest Sage #7A8B6B (Tending)

---

## SUB-NAVIGATION (top of tab, persistent)

```
[PLAN]  [RECIPES]  [GROCERY]  [SUPPLEMENTS]
```

---

## RECIPE DATA — ALREADY WRITTEN. CURSOR IMPORTS ONLY.

All 45 recipes are fully written in `RECIPE_CARDS_v3_1.md` in this folder.
Cursor does not write recipe content. Cursor reads the file and converts it
to typed TypeScript data structures. Every recipe must be imported exactly
as written. Do not summarize, shorten, or rewrite any recipe content.

### Complete Recipe ID List

**Breakfasts (10):** B-01 B-02 B-03 B-04 B-05 B-06 B-07 B-08 B-09 B-10
**Lunches (12):** L-01 L-02 L-03 L-04 L-05 L-06 L-07 L-08 L-09 L-10 L-11 L-12
**Dinners (14):** D-01 D-02 D-03 D-04 D-05 D-06 D-07 D-08 D-09 D-10 D-11 D-12 D-13 D-14
**Snacks (8):** S-01 S-02 S-03 S-04 S-05 S-06 S-07 S-08
**Pantry staple (1):** P-01 (Homemade Oat-Seed Granola)

### Recipe TypeScript Interface

```typescript
interface Ingredient {
  name: string;
  amount: string;           // e.g. "2 cups", "3 tbsp", "1 pinch"
  groceryCategory: GroceryCategory;
  isOptional: boolean;
}

interface Recipe {
  id: string;               // e.g. "B-01"
  title: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pantry';
  tags: string[];           // all tags from the card: NF, GF, GBP, GBP★, BATCH, ON-DUTY etc.
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  baseServes: number;       // default serving count
  scaleOptions: number[];   // [0.5, 1, 1.5, 2, 3]
  whyThisWorks: string;     // the "WHY THIS WORKS" paragraph
  ingredients: Ingredient[];
  method: string[];         // array of step strings (split by paragraph)
  nutritionPerAdult: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG: number;
  };
  gbpNote: string | null;   // null if no GBP note exists; full text if it does
  mthfrNote: string | null;
  batchNote: string | null; // storage, reheating, batch instructions if present
  isOnDuty: boolean;        // true if tagged ON-DUTY (≤20 min active)
  isBatch: boolean;         // true if tagged BATCH
}
```

### GroceryCategory Enum

```typescript
type GroceryCategory =
  | 'PRODUCE'
  | 'PROTEINS'
  | 'DAIRY'
  | 'PANTRY_OILS'
  | 'PANTRY_GRAINS'
  | 'PANTRY_CANNED'
  | 'PANTRY_BAKING'
  | 'HERBS_FRESH'
  | 'HERBS_DRIED'
  | 'FROZEN'
  | 'BEVERAGES'
  | 'WELLNESS'
  | 'HOUSEHOLD';
```

Every ingredient in every recipe must have its `groceryCategory` assigned during the import.
Every ingredient carries a `groceryCategory` field. When the user taps "+ Add", the item sorts into the correct category automatically.

---

## THE MEAL PLAN — ONE PLAN, FILTERED BY HOUSEHOLD DIETARY SETTINGS

There is ONE pool of 45 written recipes. The meal plan rotation pulls from
that pool and filters it based on the household's dietary settings.

The plan is not built twice. It is not profile-specific. The filtering is.

**How it works:**
1. Household opens Settings → Nourish → Dietary Settings
2. They mark which conditions apply to anyone in the household
3. The rotation only serves recipes that carry the required tags
4. Swapping a meal shows only recipes that pass the active filters
5. Both apps read the same filtered pool — one source of truth

**The dietary filters and their tag matches:**

| Setting | Filters TO (only these recipes appear) |
|---------|----------------------------------------|
| Nut Allergy — one or both people | Only recipes tagged `NF` |
| GBP — Holli (maintenance) | Prioritizes `GBP★` and `GBP` tagged recipes; others still available but appear lower in swap lists |
| MTHFR — one or both people | Prioritizes `MTHFR★` then `MTHFR` tagged recipes; surfaces high-folate options first |
| GERD — one or both people | Only recipes tagged `GERD` |
| Gluten-Free | Only recipes tagged `GF` or `GF*` (with noted swap) |
| Dairy-Free | Only recipes tagged `DF` or `DF*` |
| On-Duty nights (shift setting) | When shift is on-duty: prioritizes `ON-DUTY` tagged recipes (≤20 min active) |

**Multiple conditions stack.** If Nut Allergy AND GERD are both active,
only recipes tagged both `NF` AND `GERD` appear in the rotation.

**GBP and MTHFR are priority filters, not hard filters.**
They surface the best-match recipes first in the swap list rather than
removing everything else. A `GBP★` recipe is the first swap option shown;
a recipe without a GBP tag is still accessible but appears lower.

**Nut Allergy and GERD are hard filters.**
If active, any recipe without the required tag is completely excluded
from the rotation. It does not appear in the swap list.

```typescript
interface HouseholdDietarySettings {
  nutAllergy: boolean;        // hard filter — NF tag required
  gbpActive: boolean;         // priority filter — GBP★ and GBP surfaced first
  mthfrActive: boolean;       // priority filter — MTHFR★ and MTHFR surfaced first
  gerdActive: boolean;        // hard filter — GERD tag required
  glutenFree: boolean;        // hard filter — GF or GF* required
  dairyFree: boolean;         // hard filter — DF or DF* required
}

function getEligibleRecipes(
  recipes: Recipe[],
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  settings: HouseholdDietarySettings
): Recipe[] {
  return recipes
    .filter(r => r.category === category)
    // Hard filters — exclude entirely if tag missing
    .filter(r => !settings.nutAllergy || r.tags.includes('NF'))
    .filter(r => !settings.gerdActive || r.tags.includes('GERD'))
    .filter(r => !settings.glutenFree || r.tags.includes('GF') || r.tags.includes('GF*'))
    .filter(r => !settings.dairyFree || r.tags.includes('DF') || r.tags.includes('DF*'))
    // Sort: priority filters surface best matches first
    .sort((a, b) => {
      const scoreA = recipePriorityScore(a, settings);
      const scoreB = recipePriorityScore(b, settings);
      return scoreB - scoreA;
    });
}

function recipePriorityScore(recipe: Recipe, settings: HouseholdDietarySettings): number {
  let score = 0;
  if (settings.gbpActive) {
    if (recipe.tags.includes('GBP★')) score += 3;
    else if (recipe.tags.includes('GBP') || recipe.tags.includes('GBP*')) score += 2;
  }
  if (settings.mthfrActive) {
    if (recipe.tags.includes('MTHFR★')) score += 3;
    else if (recipe.tags.includes('MTHFR')) score += 2;
  }
  if (recipe.tags.includes('ON-DUTY')) score += 1;
  if (recipe.tags.includes('BATCH')) score += 1;
  return score;
}
```

Default plan loaded on first open. User can swap any meal at any time.
Swap sheet shows only eligible recipes for the active dietary settings.
Shows Breakfast + Lunch + Dinner per day. Snacks are optional and not pre-assigned.

```typescript
export const THIRTY_DAY_PLAN: Record<number, { breakfast: string; lunch: string; dinner: string }> = {
  1:  { breakfast: 'B-04', lunch: 'L-01', dinner: 'D-01' },
  2:  { breakfast: 'B-05', lunch: 'L-07', dinner: 'D-02' },
  3:  { breakfast: 'B-02', lunch: 'L-03', dinner: 'D-03' },
  4:  { breakfast: 'B-04', lunch: 'L-08', dinner: 'D-12' },
  5:  { breakfast: 'B-03', lunch: 'L-02', dinner: 'D-04' },
  6:  { breakfast: 'B-09', lunch: 'L-05', dinner: 'D-05' },
  7:  { breakfast: 'B-01', lunch: 'L-06', dinner: 'D-14' },
  8:  { breakfast: 'B-05', lunch: 'L-07', dinner: 'D-06' },
  9:  { breakfast: 'B-04', lunch: 'L-04', dinner: 'D-01' },
  10: { breakfast: 'B-06', lunch: 'L-09', dinner: 'D-07' },
  11: { breakfast: 'B-02', lunch: 'L-08', dinner: 'D-08' },
  12: { breakfast: 'B-05', lunch: 'L-11', dinner: 'D-03' },
  13: { breakfast: 'B-03', lunch: 'L-01', dinner: 'D-09' },
  14: { breakfast: 'B-07', lunch: 'L-02', dinner: 'D-10' },
  15: { breakfast: 'B-04', lunch: 'L-12', dinner: 'D-11' },
  16: { breakfast: 'B-05', lunch: 'L-05', dinner: 'D-12' },
  17: { breakfast: 'B-09', lunch: 'L-03', dinner: 'D-04' },
  18: { breakfast: 'B-06', lunch: 'L-08', dinner: 'D-13' },
  19: { breakfast: 'B-04', lunch: 'L-07', dinner: 'D-02' },
  20: { breakfast: 'B-02', lunch: 'L-10', dinner: 'D-05' },
  21: { breakfast: 'B-08', lunch: 'L-06', dinner: 'D-14' },
  22: { breakfast: 'B-05', lunch: 'L-01', dinner: 'D-06' },
  23: { breakfast: 'B-03', lunch: 'L-04', dinner: 'D-01' },
  24: { breakfast: 'B-04', lunch: 'L-09', dinner: 'D-07' },
  25: { breakfast: 'B-01', lunch: 'L-11', dinner: 'D-08' },
  26: { breakfast: 'B-07', lunch: 'L-02', dinner: 'D-09' },
  27: { breakfast: 'B-05', lunch: 'L-08', dinner: 'D-03' },
  28: { breakfast: 'B-09', lunch: 'L-05', dinner: 'D-10' },
  29: { breakfast: 'B-04', lunch: 'L-12', dinner: 'D-11' },
  30: { breakfast: 'B-06', lunch: 'L-07', dinner: 'D-13' },
};
```

After Day 30, the plan cycles back to Day 1.

---

## PLAN SUB-TAB

Shows a 7-day week view. User can navigate forward/back by week.

```
WEEK OF JAN 13 – 19
[← Prev Week]                          [Next Week →]

MON 13           TUE 14           WED 15
────────         ────────         ────────
B: Steel Cut     B: Egg Muffins   B: Sheet Pan
   Oats                              Eggs
L: Turkey &      L: Chicken       L: Lentil
   Avocado Wrap     Salad Wraps      Soup
D: Sheet Pan     D: Ground        D: Herb
   Chicken          Turkey           Roasted
                    Stir-Fry         Chicken

THU 16           FRI 17           SAT 18           SUN 19
────────         ────────         ────────         ────────
B: Overnight     B: Greek         B: Veggie        B: Steel Cut
   Oats             Yogurt           Frittata         Oats
                    Parfait
L: Grain         L: Big Green     L: Ground        L: Black Bean
   Bowl             Salad            Turkey           & Sweet
                                     Chili            Potato Bowl
D: Overnight     D: Baked         D: Stuffed       D: Slow Cooker
   Chicken          Lemon Herb       Bell Peppers     Pulled
   Thighs           Chicken                           Chicken
```

- Tap any meal name → opens full recipe card
- Tap the slot itself (e.g. "B:") → opens Swap Recipe sheet
- On-Duty indicator (⚡) on meals tagged ON-DUTY — appears on the day when the user is on shift

### Swap Recipe Sheet

```
SWAP BREAKFAST — MON JAN 13
Currently: Steel Cut Oats with Berries

Show only:  [All]  [On-Duty Only]  [Batch Only]

○ B-02 Sheet Pan Eggs with Roasted Vegetables
○ B-03 Greek Yogurt Parfait with Granola
○ B-04 Overnight Oats          ⚡ On-Duty
○ B-05 Egg Muffin Cups         ⚡ On-Duty
○ B-06 Avocado Toast with Eggs
○ B-07 Turkey Sausage Hash
○ B-08 High-Protein Smoothie Bowl   ⚡ On-Duty
○ B-09 Veggie Frittata
○ B-10 Banana Oat Pancakes

[Cancel]                      [Swap →]
```

Swap writes to local SQLite (device only). Shared meal plan base in Firebase.
User swaps override the base plan and are stored per-device.

---

## RECIPE CARD VIEW

Display every field from the Recipe interface. No placeholder text anywhere.

```
┌─────────────────────────────────────────────────┐
│  B-04 | OVERNIGHT OATS                          │
│  NF  GF  VEG  MTHFR  BATCH  ⚡ ON-DUTY          │  ← tag pills
│                                                 │
│  Prep: 5 min (night before) | Morning: 0 min   │
│  Per jar = 1 adult                              │
│                                                 │
│  Serves:  [×0.5]  [×1●]  [×1.5]  [×2]  [×3]   │  ← scale selector
│                                                 │
│  WHY THIS WORKS ─────────────────────────────── │
│  Overnight oats done right aren't just          │
│  convenient — they're genuinely delicious. The  │
│  oats absorb the yogurt overnight into a creamy  │
│  texture. Chia seeds add omega-3s and body.       │
│                                                 │
│  INGREDIENTS ────────────────────────────────── │
│  Rolled oats (not instant)    ½ cup    [+ Add]  │
│  Milk or oat milk             ½ cup    [+ Add]  │
│  Plain Greek yogurt           ¼ cup    [+ Add]  │
│  Chia seeds                   1 tbsp   [+ Add]  │
│  Honey or maple syrup         1 tbsp   [+ Add]  │
│  Vanilla extract              ½ tsp    [+ Add]  │
│  Salt                         1 pinch  [+ Add]  │
│  Fresh fruit (add morning of) ½ cup    [+ Add]  │
│                                                 │
│  [+ Add All Ingredients to Grocery List]        │
│                                                 │
│  METHOD ─────────────────────────────────────── │
│  Step 1: The night before, add the oats, milk,  │
│  yogurt, chia seeds, honey, vanilla, and salt   │
│  to a jar or container with a lid. Stir well — │
│  chia seeds must be evenly distributed.           │
│                                                 │
│  [Step 1 of 4]  [◀ Prev]  [Next ▶]             │
│                                                 │
│  NUTRITION (per adult jar) ─────────────────── │
│  420 cal | 18g P | 62g C | 10g F | 9g fiber    │
│                                                 │
│  BATCH NOTE ──────────────────────────────────  │
│  8 jars on Sunday = Mon–Thu breakfast for 2    │
│  adults. No thought required in the morning.   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**GBP Note — Holli's app only:**
```
│  GBP NOTE ────────────────────────────────────  │
│  ¼ jar. Eat slowly with a spoon. High protein  │
│  per small volume. Soft, easy texture.         │
│                                                 │
```

This block is completely absent from Garrin's app. It does not render. Not hidden, not grayed — not rendered at all.

**Serving Scale:** When user changes scale, all ingredient amounts update instantly. Scale applies to numbers only — text instructions reference "your scaled amount" for the changed quantities.

**Step-by-step method:** Steps are paragraphs from the method section. Each is one screen of text max. [Prev] / [Next] navigate between steps. Step 1 shows on load.

**[+ Add] button** on each ingredient: adds that single ingredient to the grocery list in its correct category. Confirm toast: "Added to grocery list."

**[+ Add All Ingredients to Grocery List]:** Adds every ingredient at once. Duplicates against existing list items are merged (quantity added, not duplicated). Confirm toast: "All ingredients added."

---

## RECIPES SUB-TAB

Browse all 45 recipes. Filter by category and tags.

```
ALL RECIPES

[Breakfast]  [Lunch]  [Dinner]  [Snacks]  [All]

Filter:  [⚡ On-Duty]  [🔄 Batch]  [GBP★]  [MTHFR★]

B-01  Steel Cut Oats with Berries
      NF · GF · BATCH · 45 min total
      ──────────────────────────────────────────
B-02  Sheet Pan Eggs with Roasted Vegetables
      NF · GF · MTHFR★ · GBP★ · 30 min total
      ──────────────────────────────────────────
B-03  Greek Yogurt Parfait with Granola
      NF · GF · ON-DUTY · GBP★ · MTHFR · 5 min total
      ──────────────────────────────────────────────────
B-04  Overnight Oats
      NF · GF · BATCH · ON-DUTY · MTHFR · GBP · 5 min (night before)
      ──────────────────────────────────────────────────
B-05  Egg Muffin Cups
      NF · GF · BATCH · ON-DUTY · GBP★ · 35 min total
      ──────────────────────────────────────────────────
B-06  Avocado Toast with Eggs
      NF · MTHFR★ · GBP★ · 15 min total
      ──────────────────────────────────────────────────
B-07  Turkey Sausage Hash
      NF · GF · DF · GERD · GBP★ · 25 min total
      ──────────────────────────────────────────────────
B-08  High-Protein Smoothie Bowl
      NF · GF · DF · ON-DUTY · MTHFR★ · 10 min total
      ──────────────────────────────────────────────────
B-09  Veggie Frittata
      NF · GF · DF · BATCH · MTHFR★ · GBP★ · 40 min total
      ──────────────────────────────────────────────────
B-10  Banana Oat Pancakes
      NF · GF · VEG · GBP · 20 min total
      ──────────────────────────────────────────────────
L-01  Turkey & Avocado Wrap
      NF · DF · MTHFR★ · GBP* · ON-DUTY · 10 min total
      ──────────────────────────────────────────────────
L-02  Big Green Salad with Chicken
      NF · GF · DF · MTHFR★ · GBP★ · ON-DUTY · 15 min total
      ──────────────────────────────────────────────────
L-03  Lentil Soup
      NF · GF · DF · VEG · MTHFR★ · BATCH · 40 min total
      ──────────────────────────────────────────────────
L-04  Grain Bowl with Roasted Chicken
      NF · GF · DF · MTHFR · GBP · 20 min total
      ──────────────────────────────────────────────────
L-05  Chicken Salad Lettuce Wraps
      NF · GF · DF · GERD · GBP★ · ON-DUTY · 10 min total
      ──────────────────────────────────────────────────
L-06  Black Bean & Sweet Potato Bowl
      NF · GF · DF · VEG · MTHFR★ · BATCH · 30 min total
      ──────────────────────────────────────────────────
L-07  Ground Turkey Stir-Fry
      NF · GF · DF · MTHFR · 25 min total
      ──────────────────────────────────────────────────
L-08  Overnight Chicken Salad
      NF · GF · DF · GERD · GBP★ · BATCH · ON-DUTY · 10 min total
      ──────────────────────────────────────────────────
L-09  Tuna & Avocado Salad
      NF · GF · DF · MTHFR★ · GBP★ · ON-DUTY · 10 min total
      ──────────────────────────────────────────────────
L-10  Turkey Meatball Bowl
      NF · GF · DF · MTHFR · GBP★ · BATCH · 40 min total
      ──────────────────────────────────────────────────
L-11  Egg Salad Lettuce Cups
      NF · GF · DF · GERD · GBP★ · ON-DUTY · 10 min total
      ──────────────────────────────────────────────────
L-12  Sheet Pan Shrimp & Vegetables
      NF · GF · DF · MTHFR · ON-DUTY · 20 min total
      ──────────────────────────────────────────────────
D-01  Sheet Pan Chicken with Vegetables
      NF · GF · DF · MTHFR · GERD · GBP* · BATCH · ON-DUTY · 45 min total
      ──────────────────────────────────────────────────
D-02  Ground Turkey Stir-Fry
      NF · GF · DF · MTHFR · 30 min total
      ──────────────────────────────────────────────────
D-03  Herb Roasted Chicken Thighs
      NF · GF · DF · GERD · GBP★ · BATCH · 50 min total
      ──────────────────────────────────────────────────
D-04  Baked Lemon Herb Chicken
      NF · GF · DF · GERD · GBP★ · 40 min total
      ──────────────────────────────────────────────────
D-05  Honey Garlic Salmon
      NF · GF · DF · MTHFR★ · GBP★ · 20 min total
      ──────────────────────────────────────────────────
D-06  Turkey Meatballs & Zucchini Noodles
      NF · GF · DF · MTHFR · GBP★ · BATCH · 45 min total
      ──────────────────────────────────────────────────
D-07  Stuffed Bell Peppers
      NF · GF · DF · MTHFR · BATCH · 55 min total
      ──────────────────────────────────────────────────
D-08  Slow Cooker Pulled Chicken
      NF · GF · DF · GERD · GBP★ · BATCH · ON-DUTY · 20 min active
      ──────────────────────────────────────────────────
D-09  Pork Tenderloin with Roasted Vegetables
      NF · GF · DF · GERD · GBP★ · 45 min total
      ──────────────────────────────────────────────────
D-10  Overnight Chicken Thighs
      NF · GF · DF · GERD · GBP★ · BATCH · 10 min active
      ──────────────────────────────────────────────────
D-11  Ground Beef & Vegetable Skillet
      GF · DF · MTHFR · GERD · GBP · 25 min total
      ──────────────────────────────────────────────────
D-12  Honey Garlic Chicken Thighs
      NF · GF · DF · GBP · 35 min total
      ──────────────────────────────────────────────────
D-13  Turkey Taco Bowls
      NF · GF · DF · MTHFR · BATCH · 30 min total
      ──────────────────────────────────────────────────
D-14  Baked Cod with Vegetables
      NF · GF · DF · MTHFR★ · GERD · GBP★ · 30 min total
      ──────────────────────────────────────────────────
S-01  Hard-Boiled Eggs
      NF · GF · DF · GBP★ · BATCH · ON-DUTY · 12 min total
      ──────────────────────────────────────────────────
S-02  Apple with Almond Butter
      GF · VEG · MTHFR · 2 min total
      ──────────────────────────────────────────────────
S-03  Cottage Cheese & Fruit
      NF · GF · GBP★ · ON-DUTY · 2 min total
      ──────────────────────────────────────────────────
S-04  Protein Smoothie
      GF · DF · MTHFR · ON-DUTY · 5 min total
      ──────────────────────────────────────────────────
S-05  Greek Yogurt with Honey
      NF · GF · GBP★ · MTHFR · ON-DUTY · 2 min total
      ──────────────────────────────────────────────────
S-06  Veggies & Hummus
      NF · GF · DF · VEG · MTHFR · ON-DUTY · 5 min total
      ──────────────────────────────────────────────────
S-07  Turkey Roll-Ups
      NF · GF · DF · GBP★ · ON-DUTY · 5 min total
      ──────────────────────────────────────────────────
S-08  Overnight Protein Balls
      GF · VEG · BATCH · 20 min total
      ──────────────────────────────────────────────────
P-01  Homemade Oat-Seed Granola
      NF · GF · VEG · BATCH · 35 min total
```

Tap any recipe → full inline expansion with ingredients, [+ Cart] per item, step-by-step method.

---

## GROCERY SUB-TAB — FULLY FUNCTIONAL

### Auto-Generation

**How items are added:** User opens a recipe and taps "+ Add" per ingredient or "+ Add All" for the full recipe.

```typescript
// Grocery list is built by user action (+ Add / + Add All on recipe cards).
// Items added by user action only. See addIngredientToGrocery() in 11_NOURISH.md.
```

### Grocery List UI

```
GROCERY LIST

Generated: Mon Jan 13, 9:15 AM         [Regenerate]
34 items · 12 checked

[+ Add Item Manually]        [Share List]      [Clear Checked]

──── PRODUCE  (8 items) ─────────────────── ● green dot ────
☐  Baby spinach                    2 bags
☑  Avocado                         3
☐  Cherry tomatoes                 1 pint
☐  Mixed berries                   16 oz
☐  Broccoli florets                2 cups
☐  Red bell pepper                 3
☐  Sweet potato                    2 large
☐  Banana                          4

──── PROTEINS  (6 items) ──────────────────── ● red dot ────
☐  Chicken thighs                  3 lbs
☑  Ground turkey (93% lean)        2 lbs
☐  Turkey sausage links            1 lb
☐  Large eggs                      2 dozen
☐  Pork tenderloin                 1.5 lbs
☑  Deli turkey, sliced             ½ lb

──── DAIRY & EGGS  (4 items) ────────────── ● blue dot ────
☐  Plain full-fat Greek yogurt     32 oz
☐  Whole milk                      ½ gallon
☐  Oat milk                        1 quart
☐  Cottage cheese                  16 oz

──── PANTRY — OILS & CONDIMENTS  (5 items) ── ● amber ────
☐  Olive oil (extra virgin)        [in stock — skip?]
☐  Low-sodium tamari               1 bottle
☐  Dijon mustard                   [in stock — skip?]
☐  Honey                           1 jar
☐  Rice vinegar                    [in stock — skip?]

──── PANTRY — GRAINS & LEGUMES  (4 items) ── ● warm brown ────
☐  Rolled oats                     2 lbs
☐  Brown rice                       2 lbs
☐  Dried lentils                    1 lb
☐  Canned chickpeas                 2 cans

──── HERBS & SPICES  (6 items) ─────── ● olive ────
☐  Garlic powder                    1 jar
☐  Smoked paprika                   1 jar
☐  Italian seasoning                1 jar
☐  Onion powder                     1 jar
☐  Cumin                            1 jar
☐  Black pepper                     1 jar

──── BEVERAGES & TEAS  (0 items) ──────────────────
  (Add from wellness teas section below)

──── WELLNESS & SUPPLEMENTS  (0 items) ────────────
  (Add from supplements section)
```

**Category color dots** use the colors defined in `18_TAB_MANIFEST.md` grocery section.
Each category header has its accent dot + category name + item count.

**[in stock — skip?]** — appears for pantry staples that are on the Household Basics list. Never auto-added. User manually checks if they need to restock.

**Tap a checked item** → unchecks it.
**Tap an unchecked item** → checks it. Checked items move to the bottom of their category.
**Long-press any item** → Edit / Delete options.

### Manual Add Item Sheet

```
ADD ITEM

Name        [                              ]
Category    [Dropdown — all 13 categories  ]
Amount      [               ]

[Cancel]            [Add to List]
```

Validates: name is required. Category is required. Amount is optional.
Added items appear in their correct category immediately.

### Share List

Tap [Share List] → formats the full unchecked list as plain text, grouped by category:

```
GROCERY LIST — Week of Jan 13

PRODUCE
□ Baby spinach — 2 bags
□ Broccoli florets — 2 cups

PROTEINS
□ Chicken thighs — 3 lbs
□ Ground turkey — 2 lbs
□ Deli turkey, sliced — ½ lb
□ Large eggs — 2 dozen
```

Opens system share sheet (Web Share API). User sends via Messages, WhatsApp, email, etc.

### Regenerate

"Regenerate" button at top of grocery list.
Shows confirmation: "This will rebuild the list from this week's plan. Manually added items will be kept. Checked items will be cleared. Continue?"
[Cancel] / [Regenerate]

On confirm: clears all checked items from the list.

### Firebase Sync

The grocery list syncs to Firebase so both people can check items off simultaneously.

```typescript
// Firebase path: households/{id}/grocery/currentList/{itemId}
// Real-time listener: both apps update when either checks an item
// Conflict resolution: last-write-wins on checked status
```

---

## SUPPLEMENTS SUB-TAB

Read-only. Informational display. No alarms here — supplement timing reminders are in Settings → Alarms.

### Garrin's Supplements

```
SUPPLEMENTS — GARRIN

Morning
────────────────────────────────────────────
Creatine monohydrate          5g daily
Omega-3 (EPA + DHA)           2g daily
Vitamin D3 + K2               per label
Methylfolate                  per label
                              ⚠ NOT folic acid — MTHFR protocol
Lion's Mane mushroom          per label
Ashwagandha (KSM-66)          per label
Zinc                          15–25mg
B-complex (methylated)        per label
                              ⚠ All B vitamins in methylated forms

Evening
────────────────────────────────────────────
Magnesium glycinate           per label

────────────────────────────────────────────
⚠ MTHFR PROTOCOL: Always use methylated forms.
  Never use folic acid. Never use cyanocobalamin.
```

### Holli's Supplements

```
SUPPLEMENTS — HOLLI

Morning
────────────────────────────────────────────
Methylfolate                  per label
                              ⚠ NOT folic acid — MTHFR protocol
Vitamin D3 + K2               per label
Omega-3 (EPA + DHA)           per label
B-complex (methylated)        per label
                              ⚠ All B vitamins in methylated forms

Evening
────────────────────────────────────────────
Magnesium glycinate           per label

────────────────────────────────────────────
⚠ MTHFR PROTOCOL: Always use methylated forms.
  Never use folic acid. Never use cyanocobalamin.
```

No GBP supplement list. GBP is maintenance phase and does not require a separate supplement protocol. The note at the bottom of Holli's list does NOT mention GBP.

---

## TRADITION TEAS — VERBATIM FROM SOURCE FILES

---

### IMPERIUM — THE UNCROWNED'S TEA PROTOCOL (from index.html renderTeas())

"Tea in The Imperium is not an accessory. It is part of the operational architecture.
Each window has a function. Each has a preparation method."

Displayed in Nourish → Tea Protocol tab. Each tea shows: What · Why · Preparation · Where to find.

---

**1. During the Fast (Morning)**
What: Black coffee, plain water, or peppermint tea
Why: No calories. Peppermint suppresses appetite and supports focus without breaking the fast.
Preparation: Boil water. Pour over 1 peppermint tea bag or 1 tbsp loose dried peppermint leaves. Steep 5 minutes. Remove bag or strain. Drink plain. No honey during the fast window.
Where: Any grocery store.

---

**2. Break-Fast Tea (Noon — Ceremonial)**
What: Matcha green tea
Why: L-theanine + caffeine together produce clean, sustained focus without the anxiety spike of coffee alone. Anti-inflammatory. L-theanine crosses the blood-brain barrier and modulates caffeine's stimulant effect, creating alertness without jitter. Ceremonial-grade for rite use — grocery-grade for daily practice.
Preparation:
- Daily matcha: Heat water to 175°F (just before boiling — boiling water makes matcha bitter). Sift 1 tsp matcha powder into a bowl or mug. Add 2 oz of the hot water and whisk in a brisk W or M motion until frothy and no clumps remain. Add remaining 4–6 oz water or milk. Optional: small drizzle of honey.
- Ceremonial matcha (for the Rite): Use a bamboo whisk (chasen) and ceramic bowl. Sift 2g matcha, 1 oz water at 165°F, whisk until thick foam forms. Drink in three deliberate sips.
Where: Grocery store (daily) / Amazon / Ippodo Tea (ceremonial)

---

**3. Afternoon**
What: Green tea or black tea
Why: Second caffeine window. Supports gut motility and provides antioxidant load. Do not take after 3pm if sleep is disrupted.
Preparation:
- Green tea: Water at 170–180°F (not boiling). Steep 1–2 minutes only. Over-steeping makes it bitter.
- Black tea: Boiling water is fine. Steep 3–4 minutes. Can add a small splash of milk.
Where: Any grocery store.

---

**4. Evening**
What: Ashwagandha, chamomile, or reishi blend
Why: Cortisol management. The INTJ system runs chronically hot. This is the structural cool-down valve. Not optional. Ashwagandha: adaptogen that reduces cortisol and supports adrenal recovery. Chamomile: mild nervine, muscle relaxant, sleep support. Reishi: adaptogen with immune-modulating properties. Choose based on availability — any of the three works.
Preparation:
- Ashwagandha tea: Steep 1 bag or 1 tsp ashwagandha powder in 8 oz hot water 5–7 minutes. Add honey and optionally a pinch of cinnamon — it improves flavor significantly. The taste is earthy. That is correct.
- Chamomile: Steep 1–2 bags in boiling water 5 minutes. Blend with a small amount of honey. Mild and pleasant.
- Reishi: Follow package directions. Usually simmered 10–20 min if whole or powdered, or steeped 5 min if prepared blend. Earthy and slightly bitter.
Where: Ashwagandha: Whole Foods, Sprouts, Amazon · Chamomile: any grocery · Reishi: Amazon, iHerb

---

**5. Post-Practice**
What: Lion's Mane mushroom tea
Why: BDNF (brain-derived neurotrophic factor) upregulation. Supports neurogenesis and cognitive recovery after high-demand physical and mental practice. The post-practice window is when Lion's Mane is most bioavailable.
Preparation:
- From powder: Add 1 tsp Lion's Mane powder to 8 oz hot water. Stir thoroughly. Add honey to taste — it has a mild seafood-like flavor that honey improves.
- From prepared blend: Follow package instructions. Four Sigmatic and Host Defense are reliable brands.
Where: Amazon, iHerb — Four Sigmatic, Host Defense, or similar. Order in advance — not typically available in standard grocery stores.

---

**6. Rite Preparation Tea** *(Stage Six of The Rite of the Uncrowned — Phase 5 only)*
What: Frankincense tears + raw honey
Why: Served exclusively during Stage Six of the Rite of the Uncrowned. Frankincense (Boswellia) contains boswellic acids with anti-inflammatory and mildly psychoactive properties. The taste is unlike anything else in the tradition. That is intentional — it marks the moment as distinct from ordinary experience.
Preparation (exact method): Bring 12 oz water to just below boiling. Add 3–4 food-grade frankincense tears directly to the water. Reduce heat to low. Steep 15 minutes — do not boil. The water will become cloudy and slightly golden. Strain through a fine mesh strainer into a cup. Add 1–2 tsp raw honey while still hot. Stir until dissolved. One cup only. Serve warm, not hot. Drink slowly during Stage Six.
Where: Food-grade frankincense tears: Amazon, health food stores (search "food-grade frankincense tears" or "Boswellia sacra edible" — ensure labeled food-grade or edible, not all frankincense resin is safe to consume) · Raw honey: any grocery store.

---

### TENDING — THE UNSPENT'S TEA PROTOCOL

Parallel structure to the Imperium protocol. Same logic: each window has a function.
Voice is warm and relational, not operational. Each tea is framed as care rather than architecture.

---

**1. Morning (before the day begins)**
What: Morning Grounding Tea — chamomile, lemon balm, optional lavender, raw honey
Why: Warmth and settling before the day begins. Gentle, not stimulating. The first twenty minutes are not a performance window — they are a return-to-self window. This tea does not need to accelerate anything.
Preparation: Steep generous chamomile and lemon balm in hot water 5–7 minutes. Add a small amount of lavender if available. Add raw honey to taste. Drink sitting, not standing. Warm the hands on the cup before the first sip.
Where: Any grocery store (chamomile, lemon balm) · Whole Foods, Sprouts, Amazon (lavender tea) · Any grocery for raw honey.

---

**2. Mid-Morning (when the giving has already started)**
What: Nettle leaf tea or red raspberry leaf
Why: Natural folate and iron — direct MTHFR support. Nettle leaf is one of the highest plant sources of bioavailable folate. This is a protocol tea for the MTHFR household, not just a wellness choice.
Preparation: Steep 1–2 tsp loose leaf (or 1 bag) in 8 oz just-boiled water for 5–7 minutes. Strain. Add honey if needed — nettle is grassy and mild. Raspberry leaf is pleasantly earthy.
Where: Whole Foods, Sprouts, Amazon, any health food store.

---

**3. Afternoon (the second half of the day)**
What: Tulsi (Holy Basil) tea or Schisandra berry
Why: Adaptogen support. The ESFJ system gives outward continuously — the afternoon is when the depletion becomes measurable. Tulsi lowers cortisol and supports adrenal recovery without sedating. Schisandra builds stress resilience over time. Either works.
Preparation: Steep 1 bag or 1 tsp loose leaf tulsi in 8 oz hot water 5–7 minutes. Honey optional. Schisandra: 1 tsp dried berries simmered 10 minutes, strained. Slightly sour — honey balances it.
Where: Tulsi: Whole Foods, Sprouts, Amazon (Organic India brand widely available) · Schisandra: Amazon, iHerb.

---

**4. Evening (when the house quiets)**
What: Chamomile, passionflower, or lemon balm — any or all combined
Why: The Fe-dominant system processes emotions throughout the day, often on behalf of others. Evening tea is the structural signal to stop processing. Not optional. These are the same teas the Imperium uses for cortisol — the mechanism is identical, the frame is different.
Preparation: Steep 1–2 bags or 1–2 tsp loose leaf in boiling water 5–7 minutes. Add honey. Drink slowly. No phone. This is the container, not the content.
Where: Any grocery store.

---

**5. Replenishment Tea (once per week — The Replenishment Session)**
What: Whatever tea you actually want. No protocol. No function. Just pleasure.
Why: The Replenishment Session is once per week — not nightly. Two hours, once a week, that belong entirely to her. Six kids, full-time job, school: it will not happen every day and it is not supposed to. It is a weekly practice. This tea belongs to that window. Whatever she likes.
Preparation: Whatever she likes. However she likes it. No method required.

---

**6. Keeper's Preparation Tea** *(Stage Six of The Rite of the Unspent — Phase 5 only)*
What: A warm, intentionally prepared tea of your choosing — made before the Rite begins, drunk after the fast.
Why: The Keeper's tea is not prescribed in blend the way the Uncrowned's is. It is prescribed in attention. It must be made by hand, deliberately, before the Rite begins. It is the first warm thing after the fast, and the last thing before re-entry.
Preparation: Choose a tea that has meaning to you — chamomile if rest is what the Rite was about, nettle if restoration, tulsi if return. Brew it carefully. Pour it into a cup you have chosen for this moment. Set it aside until Stage Six. Then drink it slowly, in silence, before the first meal.
Where: Whatever you already have. This is the only tea in the protocol where the sourcing is irrelevant — the attention is the medicine.

---

## WELLNESS TEAS

Displayed within the Grocery sub-tab as a collapsible section at the bottom. Items added individually by tapping + Add.

```
─── WELLNESS TEAS ──────────────────────────────────
Tap any tea to add to grocery list.

CORTISOL SUPPORT — Morning/Afternoon
  Holy basil / Tulsi        Adaptogen, daily safe        [+ Add]
  Ashwagandha (KSM-66)      Cortisol regulation          [+ Add]
  Rhodiola                  Morning only — stimulating   [+ Add]
  Schisandra berry          Stress resilience             [+ Add]
  Green tea                 L-theanine, calm focus        [+ Add]
  Matcha (ceremonial)       L-theanine + caffeine         [+ Add]
  Licorice root             Limit 1 cup/day              [+ Add]
  Passionflower             Anxiety modulation            [+ Add]

SLEEP & WIND-DOWN — Evening
  Chamomile                 GABA modulation, 1-2 cups   [+ Add]
  Lemon balm                GABA, relaxation             [+ Add]
  Passionflower (evening)   Sleep onset                  [+ Add]
  Lavender                  Anxiolytic                   [+ Add]
  Tart cherry               Natural melatonin precursor  [+ Add]
  Rooibos                   Caffeine-free, anytime       [+ Add]
  Valerian root             Not for daily long-term use  [+ Add]
  Magnolia bark             Cortisol before sleep        [+ Add]

GUT HEALTH & MTHFR SUPPORT
  Ginger                    Digestion, anti-inflammatory [+ Add]
  Nettle leaf               Natural folate + iron ★ MTHFR[+ Add]
  Dandelion root            Liver + methylation support  [+ Add]
  Red raspberry leaf        Magnesium + iron             [+ Add]
  Fennel seed               Digestion, bloating          [+ Add]
  Peppermint                Digestion — GERD caution ⚠   [+ Add]
```

Tapping [+ Add] on any tea adds it to the Grocery list under BEVERAGES category.

---

## HOUSEHOLD BASICS — PANTRY STAPLES

Collapsible section at bottom of Grocery sub-tab, below wellness teas.

```
─── HOUSEHOLD BASICS (replenish as needed) ─────────
These are always-on-hand items. Tap to add to list.

Butter (unsalted)              Primary cooking fat        [+ Add]
Butter (salted)                Table use                  [+ Add]
Whole milk                     Household                  [+ Add]
Oat milk                       Dairy alternative          [+ Add]
Olive oil (extra virgin)       Primary cooking oil        [+ Add]
Vegetable or canola oil        High-heat, stir-fry        [+ Add]
Sesame oil                     Flavor finish only         [+ Add]
White wine vinegar             Poaching eggs              [+ Add]
Apple cider vinegar            General use                [+ Add]
Rice vinegar                   Asian dishes               [+ Add]
Red wine vinegar               Dressings                  [+ Add]
Dijon mustard                  Dressings, marinades       [+ Add]
Regular mayo / olive oil mayo  Chicken salad              [+ Add]
Low-sodium tamari              GF soy sauce               [+ Add]
Oyster sauce                   Stir-fry                   [+ Add]
Hot sauce                      Condiment                  [+ Add]
Honey                          Cooking and sweetener      [+ Add]
Maple syrup                    Alternative sweetener      [+ Add]
Vanilla extract                Baking, oats               [+ Add]
Baking powder                  Pancakes                   [+ Add]
Cornstarch                     Sauce thickener            [+ Add]
Cooking spray                  Muffin tins                [+ Add]
Parchment paper                Sheet pan cooking          [+ Add]
Aluminum foil                  Roasting                   [+ Add]
Ziplock bags (assorted)        Marinating, freezing       [+ Add]
Paper towels                   Drying chicken — critical  [+ Add]
```

---

## GBP NOTE DISPLAY LOGIC

```typescript
function shouldShowGbpNote(profile: Profile, recipe: Recipe): boolean {
  return profile === 'tending' && recipe.gbpNote !== null;
}

function getGbpNoteText(recipe: Recipe): string {
  // Return the exact gbpNote string from the recipe object.
  // Never generate or modify GBP notes — use only what is in the recipe card.
  return recipe.gbpNote!;
}
```

**Maintenance phase language:** GBP notes in the recipe cards use maintenance-appropriate language. They do NOT say "early post-op," "pureed stage," or "soft foods only" unless the recipe card itself says so. Use the text exactly as it appears in RECIPE_CARDS_v3_1.md.

---

## NOURISH → PLANNER INTEGRATION

When a meal slot is tapped on the planner's Today view, it opens the recipe card for that meal directly. No extra navigation. Planner → recipe card is one tap.

Meal times on the planner use the following defaults (user-adjustable in Settings):
- Breakfast: 8:00 AM
- Lunch: 12:30 PM
- Dinner: 6:00 PM

On shift days (on-duty), the planner prefers ON-DUTY tagged meals. If the assigned meal for that day is not ON-DUTY tagged, a small ⚡ indicator appears next to the meal name on the planner with a swap suggestion.

