// Layer 1 data verification — run with: node verify-l1-data.js
const fs = require('fs');
const src = fs.readFileSync('sovereign_v9.jsx', 'utf8');

// Extract WEEK_PLAN block roughly
const wpMatch = src.match(/const WEEK_PLAN = \[([\s\S]*?)\];\s*\n\/\/ ── RECIPE/);
if (!wpMatch) { console.error('WEEK_PLAN not found'); process.exit(1); }

// Evaluate WEEK_PLAN safely by extracting and using Function
const weekPlanStr = 'const WEEK_PLAN = [' + wpMatch[1] + ']; return WEEK_PLAN;';
const WEEK_PLAN = new Function(weekPlanStr)();

let meals = 0;
let missingRecipe = 0;
let peanutHits = [];

const recMatch = src.match(/const RECIPES = \{([\s\S]*?)\};\s*\n\/\/ ── CEREMONY/);
const RECIPES = new Function('return {' + recMatch[1] + '}')();

for (const wk of WEEK_PLAN) {
  for (const day of wk.days) {
    for (const slot of ['b','l','d']) {
      meals++;
      const name = day.meals[slot];
      const tags = day.tags[slot];
      if (!tags.includes('NF')) peanutHits.push(`${day.day} ${slot}: ${name}`);
      if (!RECIPES[name]) missingRecipe++;
    }
  }
}

const allText = JSON.stringify(WEEK_PLAN) + JSON.stringify(RECIPES);
const hasPeanut = /peanut/i.test(allText);

console.log('Meals:', meals, meals === 84 ? 'OK' : 'FAIL');
console.log('Missing RECIPES:', missingRecipe, missingRecipe === 0 ? 'OK' : 'FAIL');
console.log('Non-NF tagged meals:', peanutHits.length);
console.log('Peanut string in data:', hasPeanut ? 'FOUND' : 'none');
