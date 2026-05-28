import type { RecipeRecord } from '../types/layer2';

const NUT_PATTERNS: Array<[RegExp, string]> = [
  [/almond butter/i, 'sunflower seed butter (SunButter)'],
  [/cashew/i, 'sunflower seeds (soaked + blended)'],
  [/walnut/i, 'pumpkin seeds (pepitas)'],
  [/pine nut/i, 'hemp seeds'],
  [/almond milk/i, 'oat milk'],
  [/almond/i, 'sunflower seeds'],
  [/pecan/i, 'pumpkin seeds'],
];

function detectAversions(ingNames: string[]): NonNullable<RecipeRecord['alternatives']>['aversion_flags'] {
  const joined = ingNames.join(' ');
  return {
    fish: /(salmon|tuna|cod|fish|seafood|shrimp|teriyaki)/i.test(joined),
    raw_onion: /raw onion|thin sliced.*onion/i.test(joined),
    cilantro: /cilantro/i.test(joined),
    strong_cheese: /(blue cheese|gorgonzola|aged cheddar|parmesan)/i.test(joined),
    mushrooms: /mushroom/i.test(joined),
  };
}

function findProteinFirst(ing: RecipeRecord['ing']): string {
  const protein = ing.find((i) => i.unit === 'protein');
  return protein?.name ?? ing[0]?.name ?? 'protein component';
}

/** Annotates recipes with FIX_10 alternatives when missing from static data */
export function enrichRecipe(recipe: RecipeRecord): RecipeRecord {
  if (recipe.alternatives?.nut_free && recipe.alternatives?.gastric_bypass) {
    return recipe;
  }
  const ingNames = recipe.ing.map((i) => i.name);
  const nutSubs: Array<{ ingredient: string; replace_with: string }> = [];
  for (const ing of recipe.ing) {
    for (const [pattern, replacement] of NUT_PATTERNS) {
      if (pattern.test(ing.name)) {
        nutSubs.push({ ingredient: ing.name, replace_with: replacement });
        break;
      }
    }
  }
  const proteinG = recipe.macros?.p ?? 20;
  return {
    ...recipe,
    alternatives: {
      ...recipe.alternatives,
      nut_free: nutSubs.length
        ? { subs: nutSubs, note: nutSubs.length ? 'Substitutions applied for nut allergy.' : undefined }
        : recipe.alternatives?.nut_free,
      gastric_bypass: recipe.alternatives?.gastric_bypass ?? {
        portion_oz: 5,
        protein_first: findProteinFirst(recipe.ing),
        remove_or_modify: ['Reduce portion to 4-6 oz', 'Avoid fried components', 'Limit high-sugar add-ins'],
        no_fluid_note: 'Do not drink 30 minutes before or 30 minutes after eating.',
        protein_g: Math.max(20, Math.round(proteinG * 0.6)),
        soft_food_mod: 'If in soft-food phase: blend or chop hard components finely.',
      },
      aversion_flags: recipe.alternatives?.aversion_flags ?? detectAversions(ingNames),
    },
  };
}

export function getEnrichedRecipe(name: string, recipes: Record<string, RecipeRecord>): RecipeRecord | undefined {
  const base = recipes[name];
  if (!base) return undefined;
  return enrichRecipe(base);
}
