/** Layer 2 Daily Hub types — aligned with sovereign_v9.jsx and LAYER2_PRIME_PROMPT_v2.md */

export type GroceryCategoryL2 =
  | 'produce'
  | 'protein'
  | 'dairy'
  | 'grains'
  | 'pantry'
  | 'spice'
  | 'beverage';

export const CATEGORY_ORDER: GroceryCategoryL2[] = [
  'produce',
  'protein',
  'dairy',
  'grains',
  'pantry',
  'spice',
  'beverage',
];

export const CATEGORY_COLORS: Record<GroceryCategoryL2, string> = {
  produce: '#5a9a5a',
  protein: '#c04040',
  dairy: '#4a80c0',
  grains: '#a07840',
  pantry: '#c0a040',
  spice: '#808040',
  beverage: '#4a8088',
};

export const CATEGORY_LABELS: Record<GroceryCategoryL2, string> = {
  produce: 'Produce',
  protein: 'Proteins',
  dairy: 'Dairy & Eggs',
  grains: 'Grains & Legumes',
  pantry: 'Pantry',
  spice: 'Herbs & Spices',
  beverage: 'Beverages',
};

export interface IngredientL2 {
  name: string;
  amt: string;
  unit: GroceryCategoryL2;
}

export interface NutritionMacros {
  cal: number;
  p: number;
  c: number;
  f: number;
  fiber: number;
}

export interface RecipeRecord {
  ing: IngredientL2[];
  steps: string[];
  macros?: NutritionMacros;
}

export interface PlanDayMeals {
  b: string;
  l: string;
  d: string;
}

export interface PlanDayTags {
  b: string[];
  l: string[];
  d: string[];
}

export interface PlanDay {
  day: string;
  batch?: boolean;
  meals: PlanDayMeals;
  tags: PlanDayTags;
}

export interface WeekPlanEntry {
  week: string;
  days: PlanDay[];
}

export interface CartItemL2 {
  name: string;
  amt: string;
  unit: GroceryCategoryL2;
  count: number;
  checked: boolean;
}

export interface DietarySettingsL2 {
  nutAllergy: boolean;
  gerd: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  mthfr: boolean;
  gbp: boolean;
  onDutyFirst: boolean;
}

export function mealPassesFilterL2(tags: string[], diet: DietarySettingsL2): boolean {
  if (diet.nutAllergy && !tags.includes('NF')) return false;
  if (diet.gerd && !tags.includes('GERD')) return false;
  if (diet.glutenFree && !tags.includes('GF')) return false;
  if (diet.dairyFree && !tags.includes('DF')) return false;
  return true;
}
