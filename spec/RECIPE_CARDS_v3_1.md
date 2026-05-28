# RECIPE CARDS v3.1 — THE SOVEREIGN WORKS
# Source: Extracted from sovereign_v9.jsx canonical data
# This file is READ ONLY for Cursor. Import as data. Do not modify.
# All recipe names, ingredients, steps, and macros are canonical.

## HOW TO USE THIS FILE

Each recipe entry follows this structure:
- NAME: The exact meal name as it appears in WEEK_PLAN
- TAGS: Dietary tags (NF=Nut-Free, GF=Gluten-Free, DF=Dairy-Free, VEG=Vegetarian)
- MACROS: Per-serving nutrition (cal, protein, carbs, fat, fiber)
- BASE SERVES: 2 adults (double for batch cook days)
- INGREDIENTS: Name, amount, category
- METHOD: Step-by-step cooking instructions (one action per step)

## NUT ALLERGY SAFETY — CRITICAL

All NF-tagged meals in this database are certified nut-free.
Sunflower seed butter is used wherever peanut butter appeared in earlier versions.
The tag NF means the meal contains zero peanuts, tree nuts, or nut derivatives.
Cursor must enforce: if diet.nutAllergy === true, only NF-tagged meals are shown.

## TAGS REFERENCE

| Tag | Meaning | Filter behavior |
|-----|---------|-----------------|
| NF | Nut-Free | Hard filter — removes non-NF when nutAllergy=true |
| GF | Gluten-Free | Hard filter — removes non-GF when glutenFree=true |
| DF | Dairy-Free | Hard filter — removes non-DF when dairyFree=true |
| VEG | Vegetarian | Hard filter — removes non-VEG when vegetarian=true |
| GERD | GERD-safe | Hard filter — removes non-GERD when gerd=true |
| BATCH | Batch cook | Makes 2 servings — double for full household |
| ON-DUTY | Shift work | Surfaces first on work days when onDutyFirst=true |

---

## RECIPE DATABASE — JAVASCRIPT CONSTANT FORMAT
## Cursor imports this verbatim as the RECIPES constant in recipes.ts



---

## 4-WEEK MEAL PLAN — WEEK_PLAN CONSTANT
## Cursor imports this verbatim as weekPlan.ts

const WEEK_PLAN = [
  // ── WEEK 1 ──
  {week:"Week 1 — Foundation",days:[
    {day:"Monday",    meals:{b:"Steel cut oats with berries",       l:"Lentil soup",                        d:"Sheet pan chicken with vegetables"},    tags:{b:["NF","GF","DF","VEG"],l:["NF","GF","DF","VEG"],d:["NF","GF","DF"]},          batch:true},
    {day:"Tuesday",   meals:{b:"Sheet pan eggs with roasted veg",   l:"Leftover sheet pan chicken",         d:"Ground turkey stir-fry"},               tags:{b:["NF","GF","DF"],       l:["NF","GF","DF"],           d:["NF","GF","DF"]},        batch:false},
    {day:"Wednesday", meals:{b:"Overnight oats",                    l:"Turkey and avocado wrap",             d:"Baked lemon herb chicken thighs"},      tags:{b:["NF","GF","VEG"],      l:["NF","DF"],                d:["NF","GF","DF"]},        batch:true},
    {day:"Thursday",  meals:{b:"Avocado toast with fried egg",       l:"Leftover baked chicken",             d:"Stuffed bell peppers"},                 tags:{b:["NF","GF","VEG"],      l:["NF","GF","DF"],           d:["NF","GF"]},             batch:false},
    {day:"Friday",    meals:{b:"High-protein smoothie bowl",         l:"Black bean and sweet potato bowl",   d:"Pork tenderloin with root vegetables"}, tags:{b:["NF","GF","DF"],       l:["NF","GF","DF","VEG"],     d:["NF","GF","DF"]},        batch:false},
    {day:"Saturday",  meals:{b:"Greek yogurt parfait with granola",  l:"Teriyaki chicken bowl",              d:"Ground beef and broccoli bowl"},        tags:{b:["NF","GF"],            l:["NF","GF","DF"],           d:["NF","GF","DF"]},        batch:false},
    {day:"Sunday",    meals:{b:"Veggie frittata",                    l:"Chickpea and vegetable soup",        d:"Meal prep batch — double dinner"},      tags:{b:["NF","GF","VEG"],      l:["NF","GF","DF","VEG"],     d:["NF"]},                  batch:true},
  ]},
  // ── WEEK 2 ──
  {week:"Week 2 — Building",days:[
    {day:"Monday",    meals:{b:"Overnight oats",                    l:"Leftover Sunday batch",              d:"Honey garlic chicken thighs"},          tags:{b:["NF","GF","VEG"],      l:["NF","GF","DF"],           d:["NF","GF","DF"]},        batch:true},
    {day:"Tuesday",   meals:{b:"Avocado toast with fried egg",       l:"Egg fried rice",                    d:"Turkey meatballs with marinara"},       tags:{b:["NF","GF","VEG"],      l:["NF","GF","DF"],           d:["NF"]},                  batch:false},
    {day:"Wednesday", meals:{b:"Steel cut oats with berries",        l:"Big green salad with chicken",       d:"Herb roasted chicken with root veg"},   tags:{b:["NF","GF","DF","VEG"], l:["NF","GF","DF"],           d:["NF","GF","DF"]},        batch:true},
    {day:"Thursday",  meals:{b:"Sheet pan eggs with roasted veg",    l:"Leftover herb roasted chicken",      d:"Black bean tacos with mango salsa"},    tags:{b:["NF","GF","DF"],       l:["NF","GF","DF"],           d:["NF","GF","DF","VEG"]},  batch:false},
    {day:"Friday",    meals:{b:"High-protein smoothie bowl",         l:"Ground turkey chili",               d:"Lemon herb chicken with wilted greens"}, tags:{b:["NF","GF","DF"],       l:["NF","GF","DF"],           d:["NF","GF","DF"]},        batch:false},
    {day:"Saturday",  meals:{b:"Greek yogurt parfait with granola",  l:"Chicken salad lettuce wraps",        d:"Pulled chicken tacos"},                 tags:{b:["NF","GF"],            l:["NF","GF","DF"],           d:["NF","GF","DF"]},        batch:false},
    {day:"Sunday",    meals:{b:"Veggie frittata",                    l:"Turkey meatball bowl",               d:"Meal prep batch — double dinner"},      tags:{b:["NF","GF","VEG"],      l:["NF","GF","DF"],           d:["NF"]},                  batch:true},
  ]},
  // ── WEEK 3 ──
  {week:"Week 3 — Depth",days:[
    {day:"Monday",    meals:{b:"Egg muffin cups",                    l:"Leftover Sunday batch",              d:"Ground turkey and veg noodle bowl"},    tags:{b:["NF","GF","DF"],       l:["NF","GF","DF"],           d:["NF","GF","DF"]},        batch:true},
    {day:"Tuesday",   meals:{b:"Turkey sausage and sweet potato hash",l:"Batch prep grain bowl",             d:"Slow cooker pulled chicken"},           tags:{b:["NF","GF","DF"],       l:["NF","GF","DF"],           d:["NF","GF","DF"]},        batch:false},
    {day:"Wednesday", meals:{b:"Banana oat pancakes",                l:"Leftover pulled chicken",            d:"Baked lemon herb chicken thighs"},      tags:{b:["NF","VEG"],           l:["NF","GF","DF"],           d:["NF","GF","DF"]},        batch:true},
    {day:"Thursday",  meals:{b:"Avocado toast with fried egg",        l:"Black bean and sweet potato bowl",  d:"Ground turkey stir-fry"},               tags:{b:["NF","GF","VEG"],      l:["NF","GF","DF","VEG"],     d:["NF","GF","DF"]},        batch:false},
    {day:"Friday",    meals:{b:"Overnight oats",                     l:"Leftover turkey stir-fry",           d:"Herb roasted chicken with root veg"},   tags:{b:["NF","GF","VEG"],      l:["NF","GF","DF"],           d:["NF","GF","DF"]},        batch:false},
    {day:"Saturday",  meals:{b:"Steel cut oats with berries",         l:"Chicken stir-fry with rice noodles",d:"Stuffed bell peppers"},                 tags:{b:["NF","GF","DF","VEG"], l:["NF","GF","DF"],           d:["NF","GF"]},             batch:false},
    {day:"Sunday",    meals:{b:"Veggie frittata",                    l:"Lentil soup",                        d:"Meal prep batch — double dinner"},      tags:{b:["NF","GF","VEG"],      l:["NF","GF","DF","VEG"],     d:["NF"]},                  batch:true},
  ]},
  // ── WEEK 4 ──
  {week:"Week 4 — Mastery",days:[
    {day:"Monday",    meals:{b:"Overnight oats",                     l:"Leftover Sunday batch",              d:"Ground beef and broccoli bowl"},        tags:{b:["NF","GF","VEG"],      l:["NF","GF","DF"],           d:["NF","GF","DF"]},        batch:true},
    {day:"Tuesday",   meals:{b:"Sheet pan eggs with roasted veg",    l:"Turkey and avocado wrap",            d:"Honey garlic chicken thighs"},          tags:{b:["NF","GF","DF"],       l:["NF","DF"],                d:["NF","GF","DF"]},        batch:false},
    {day:"Wednesday", meals:{b:"Greek yogurt parfait with granola",  l:"Teriyaki chicken bowl",              d:"Sheet pan chicken with vegetables"},    tags:{b:["NF","GF"],            l:["NF","GF","DF"],           d:["NF","GF","DF"]},        batch:true},
    {day:"Thursday",  meals:{b:"Avocado toast with fried egg",        l:"Leftover sheet pan chicken",        d:"Lemon herb chicken with wilted greens"}, tags:{b:["NF","GF","VEG"],      l:["NF","GF","DF"],           d:["NF","GF","DF"]},        batch:false},
    {day:"Friday",    meals:{b:"High-protein smoothie bowl",          l:"Chickpea and vegetable soup",       d:"Pulled chicken tacos"},                 tags:{b:["NF","GF","DF"],       l:["NF","GF","DF","VEG"],     d:["NF","GF","DF"]},        batch:false},
    {day:"Saturday",  meals:{b:"Steel cut oats with berries",         l:"Big green salad with chicken",      d:"Pork tenderloin with root vegetables"}, tags:{b:["NF","GF","DF","VEG"], l:["NF","GF","DF"],           d:["NF","GF","DF"]},        batch:false},
    {day:"Sunday",    meals:{b:"Egg muffin cups",                    l:"Ground turkey chili",               d:"Turkey meatballs with marinara"},       tags:{b:["NF","GF","DF"],       l:["NF","GF","DF"],           d:["NF"]},                  batch:false},
  ]},
];



---

## IMPORT INSTRUCTIONS FOR CURSOR

In packages/shared/data/recipes.ts:

```typescript
// Import the RECIPES constant verbatim from this file
// Do NOT modify ingredient names, amounts, steps, or macros
// Do NOT add ingredients not listed here
// Do NOT change NF tags on any recipe

export const RECIPES = { /* paste RECIPES constant here */ };
export const WEEK_PLAN = [ /* paste WEEK_PLAN constant here */ ];
```

In packages/shared/data/weekPlan.ts:
```typescript
// Import WEEK_PLAN verbatim
export const WEEK_PLAN = [ /* paste WEEK_PLAN constant here */ ];
```

Cursor does NOT generate recipe content. Cursor imports from this file only.
