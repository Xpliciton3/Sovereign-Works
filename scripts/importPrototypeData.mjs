/**
 * Extracts WEEK_PLAN and RECIPES from specs/sovereign_v9.jsx into shared data modules.
 * Run: node scripts/importPrototypeData.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const oneDriveV9 = 'C:/Users/holli/OneDrive/Desktop/SOVEREIGN_WORKS_PHASE1/sovereign_v9.jsx';
const localV9 = path.join(root, 'specs/sovereign_v9.jsx');
const v9Path = fs.existsSync(oneDriveV9) ? oneDriveV9 : localV9;
const src = fs.readFileSync(v9Path, 'utf8');
console.log('Source:', v9Path);

const weekMatch = src.match(/const WEEK_PLAN = (\[[\s\S]*?\]);/);
const recipesMatch = src.match(/const RECIPES = (\{[\s\S]*?\n\});/);

if (!weekMatch) throw new Error('WEEK_PLAN not found');
if (!recipesMatch) throw new Error('RECIPES not found');

function jsToTs(objLiteral) {
  return (
    objLiteral
      .replace(/\bn:/g, 'name:')
      .replace(/(\s)amt:/g, '$1amt:')
      // keep amt as amt for ingredients
  );
}

const weekPlanTs = `// Auto-imported from specs/sovereign_v9.jsx — do not edit by hand. Re-run scripts/importPrototypeData.mjs
import type { WeekPlanEntry } from '../types/layer2';

export const WEEK_PLAN: WeekPlanEntry[] = ${weekMatch[1]} as WeekPlanEntry[];
`;

const recipesBody = recipesMatch[1]
  .replace(/\{n:/g, '{name:')
  .replace(/,n:/g, ',name:');

const recipesTs = `// Auto-imported from specs/sovereign_v9.jsx — do not edit by hand. Re-run scripts/importPrototypeData.mjs
import type { RecipeRecord } from '../types/layer2';

export const RECIPES: Record<string, RecipeRecord> = ${recipesBody} as Record<string, RecipeRecord>;
`;

const dataDir = path.join(root, 'packages/shared/src/data');
fs.mkdirSync(dataDir, { recursive: true });
fs.writeFileSync(path.join(dataDir, 'weekPlan.ts'), weekPlanTs);
fs.writeFileSync(path.join(dataDir, 'recipes.ts'), recipesTs);
console.log('Wrote weekPlan.ts and recipes.ts');
