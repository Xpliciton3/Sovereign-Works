# FIX 10 — RECIPE DIETARY ALTERNATIVES
# CRITICAL CORRECTION: The current build has NO alternatives for nut allergy,
# gastric bypass, or food aversions. Every recipe card must carry alternatives.
# This is not optional. A practitioner with a nut allergy cannot use the app
# as built. Fix this in the recipe data and in the Nourish tab UI.

---

## THE THREE REQUIRED ALTERNATIVE TRACKS

### Track 1 — NUT FREE (Nut Allergy / Tree Nut Allergy)

**The problem:** Recipes use almond butter, cashews, pine nuts, almonds, walnuts,
pecans, and nut-based sauces. A person with a nut allergy cannot eat these.

**Substitution rules — apply globally across all recipe cards:**

| Original ingredient | Nut-free substitute |
|---------------------|---------------------|
| Almond butter | Sunflower seed butter (SunButter) — same ratio |
| Cashew cream / cashews | Sunflower seeds soaked + blended, or omit |
| Walnuts (in salads/oatmeal) | Pumpkin seeds (pepitas) — same volume |
| Pine nuts | Hemp seeds or omit |
| Almonds (sliced/whole) | Pumpkin seeds or sunflower seeds |
| Almond milk | Oat milk or rice milk |
| Nut-based sauces (e.g., satay, mole with nuts) | Seed-based version or tahini |
| Pesto with pine nuts | Pesto with hemp seeds or sunflower seeds |

**Note for Cursor:** Do not guess. Each recipe that contains a nut ingredient
needs an explicit nut_free_sub field populated in the recipe data object.
Where substitution changes cooking method, note it in the sub.

---

### Track 2 — GASTRIC BYPASS SAFE

**The problem:** Post-gastric-bypass practitioners have specific physiological
constraints that make many standard recipes inappropriate without modification.
Ignoring this is not a minor oversight — it can cause dumping syndrome or pain.

**Gastric bypass constraints (apply to ALL recipes):**

1. **Portion size:** Maximum 4–6oz per meal. Large portions are not possible.
   Recipe cards must show per-100g macros, not just per-serving.
   
2. **Protein first:** Every gastric bypass version leads with the protein component.
   The practitioner eats protein before any carb or fat. Recipe sequencing notes must
   reflect this: "Eat the [protein component] first."

3. **No dumping foods:** Remove or flag these components:
   - High-sugar items (concentrated sweeteners, dried fruit in large amounts)
   - Fried foods
   - High-fat in single portions (cream sauces, large cheese amounts)
   - Carbonated beverages (never in ingredient lists)
   - Raw fibrous vegetables in large amounts (carrots, celery, raw broccoli)

4. **No fluid with meals:** The gastric bypass note must specify:
   "Do not drink 30 minutes before or 30 minutes after eating."

5. **Texture adjustment:** Some gastric bypass practitioners are in a soft-food phase.
   Flag any hard or chewy components (raw apple, raw carrot, tough meat) with a note:
   "If in soft-food phase: [specific texture modification]"

6. **Protein target:** Minimum 20g protein per meal. Show this prominently.

**Implementation — recipe data structure addition:**

```typescript
interface Recipe {
  // ... existing fields ...
  alternatives: {
    nut_free?: {
      subs: { ingredient: string; replace_with: string }[];
      note?: string;
    };
    gastric_bypass?: {
      portion_oz: number;                    // max 4-6
      protein_first: string;                 // which component to eat first
      remove_or_modify: string[];            // what to remove/change
      no_fluid_note: string;                 // always: "No fluid 30 min before/after"
      protein_g: number;                     // must be ≥ 20g for this portion
      soft_food_mod?: string;                // if in soft-food phase
    };
    aversion_notes?: string[];               // see Track 3
  };
}
```

---

### Track 3 — FOOD AVERSIONS

**The problem:** Common strong aversions are not preferences — they are physiological
or psychological responses that make eating impossible. The app must not force
someone to see recipes that contain foods they cannot eat.

**The five most common aversions to accommodate:**

| Aversion | Flag in recipe | Alternative instruction |
|----------|---------------|------------------------|
| Strong fish / seafood smell | `aversion_fish: true` | Swap salmon for chicken thighs at same weight; adjust cook time |
| Raw onion (cooked is often tolerated) | `aversion_raw_onion: true` | Use only caramelized or roasted onion; note in recipe |
| Cilantro (genetic aversion in ~14% of population) | `aversion_cilantro: true` | Substitute flat-leaf parsley at same volume |
| Strong cheese (blue cheese, strong aged varieties) | `aversion_strong_cheese: true` | Substitute mild mozzarella or omit |
| Cooked mushrooms (texture aversion) | `aversion_mushrooms: true` | Substitute zucchini or eggplant for texture; adjust cook time |

**Implementation — Settings screen addition:**

```typescript
// packages/shared/src/types/index.ts — add to UserProfile
dietaryProfile: {
  nutFree: boolean;
  gastricBypass: boolean;
  avoidFish: boolean;
  avoidRawOnion: boolean;
  avoidCilantro: boolean;
  avoidStrongCheese: boolean;
  avoidMushrooms: boolean;
  customAvoidances: string[];  // free-text, parsed by Groq
};
```

**Nourish tab filter behavior:**
- If nutFree: show nut-free version of recipe automatically
- If gastricBypass: show portion-adjusted version, protein-first note, no-fluid reminder
- If any aversion active: swap that ingredient before rendering the recipe card
- If customAvoidances populated: Groq parses once on first run, stores aversion flags

---

## NOURISH TAB UI CHANGES

**Settings → Dietary Profile** (new sub-section in 12_SETTINGS.md):

```
Dietary Profile
  [ ] Nut-free
  [ ] Post-gastric bypass
  [ ] Avoid strong fish/seafood
  [ ] Avoid raw onion
  [ ] Avoid cilantro
  [ ] Avoid cooked mushrooms
  [ ] Avoid strong cheese
  
Custom avoid: [text field]
"Groq will adjust your meal plan for these. Tap Update to apply."
[Update Meal Plan] button — calls Groq with customAvoidances, stores parsed flags
```

**Recipe card display changes:**
- Active dietary flags show as colored chips below recipe title
- Substituted ingredients shown inline: ~~almond butter~~ → sunflower seed butter
- Gastric bypass card shows: protein-first instruction, portion oz, no-fluid reminder
- Aversion-swapped ingredients shown inline with swap indicator

---

## RECIPE DATA CORRECTIONS REQUIRED

Cursor must audit every recipe in RECIPE_CARDS_v3_1.md and add alternatives.

For each recipe containing nut ingredients:
→ Add `nut_free.subs[]` with specific substitutions

For every recipe:
→ Add `gastric_bypass.portion_oz`, `gastric_bypass.protein_first`,
   `gastric_bypass.protein_g`, and `gastric_bypass.no_fluid_note`

For recipes containing fish, onion, cilantro, mushrooms, or strong cheese:
→ Add corresponding `aversion_*` boolean flag

**Do not write new recipes.** Annotate the existing ones.
Source: RECIPE_CARDS_v3_1.md — read it fully before annotating.

---

## BUILD SEQUENCE

```
D.01  Add dietaryProfile to UserProfile type
D.02  Add dietary settings sub-section to Settings screen
D.03  Implement Groq customAvoidances parser
D.04  Add alternatives fields to Recipe type
D.05  Annotate all recipes in recipes.ts with nut_free alternatives
D.06  Annotate all recipes with gastric_bypass fields
D.07  Flag fish / onion / cilantro / mushroom / cheese aversion recipes
D.08  Update recipe card component to show active dietary version
D.09  Test: nut-free setting → almond butter shows as sunflower seed butter
D.10  Test: gastric bypass → portion note, protein-first, no-fluid reminder visible
D.11  Test: cilantro aversion → cilantro shows as parsley in recipe card
D.12  Test: custom aversion field → Groq parses and stores flags correctly
```
