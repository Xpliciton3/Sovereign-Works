const { useState, useEffect } = React;

const APP_VERSION = "v9.1"; // bump this string on every update to force tutorial reset

const FONT = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Josefin+Sans:wght@100;200;300;400;600&display=swap";
const COR = "'Cormorant Garamond',Georgia,serif";
const JOS = "'Josefin Sans',sans-serif";

const TH = {
  IMP:{bg:"#000",s1:"#0d0d0d",s2:"#111",s3:"#161616",b1:"#1c1c1c",b2:"#282828",
    gold:"#c9a84c",goldDim:"#4a4030",glow:"rgba(201,168,76,0.10)",
    teal:"#18c48a",tealBg:"#061e16",tealBdr:"#0d5c4a",
    text:"#f5f0e8",t2:"#a8a090",t3:"#555045",
    shiftCol:"#44aa44",partnerCol:"#c47878",partnerInit:"H",partnerName:"Holli",
    name:"THE IMPERIUM",person:"Garrin",sub:"Uncrowned Operating System",epithet:"Uncrowned",
    decl:"Power from within cannot be revoked.",
    declSub:"Stand. Both feet on the floor. Speak this aloud.",
    axiom:"UNCROWNED. UNBOWED.\nUNBROKEN. UNFINISHED.",
    quote:"Plans collapse. Architecture endures.",
    shiftSelf:"OFF DUTY",shiftPartner:"NIGHT — 7P–7A",
    hydT:100,
    cPlan:"#c9a84c",cNour:"#e05828",cMind:"#9060f0",cBody:"#18c48a",cSoul:"#c9a84c",cMore:"#5888b0",cWork:"#e05828",
  },
  TEND:{bg:"#080504",s1:"#100c0a",s2:"#171008",s3:"#1e1510",b1:"#231810",b2:"#2e2016",
    gold:"#c47878",goldDim:"#4a2828",glow:"rgba(196,120,120,0.10)",
    teal:"#c47878",tealBg:"#2a100e",tealBdr:"#4a1e2a",
    text:"#f5e8e0",t2:"#c4a898",t3:"#806858",
    shiftCol:"#6080c4",partnerCol:"#c9a84c",partnerInit:"G",partnerName:"Garrin",
    name:"THE TENDING",person:"Holli",sub:"Unspent Operating System",epithet:"Unspent",
    decl:"The keeper of what matters is never powerless.",
    declSub:"Twenty minutes of quiet first. The rest waits.",
    axiom:"FELT. FAITHFUL.\nFULL. UNSPENT.",
    quote:"What you tend, you keep. What you keep, endures.",
    shiftSelf:"NIGHT — 7P–7A",shiftPartner:"OFF DUTY",
    hydT:96,
    cPlan:"#c47878",cNour:"#c06048",cMind:"#9878b0",cBody:"#c48054",cSoul:"#c47878",cMore:"#8090a8",cWork:"#c48054",
  }
};

// ── MEAL PLAN — 4 weeks, unique meals every day, same for both people ──
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

// ── RECIPE DATABASE — sourced from RECIPE_CARDS_v3_1.md ──
const RECIPES = {
  // ── BREAKFASTS ──
  "Steel cut oats with berries": {
    macros:{cal:390, p:14, c:70, f:8, fiber:8},
    ing:[
      {n:"Steel cut oats",         amt:"1½ cups",   unit:"grains"},
      {n:"Water",                  amt:"3¾ cups",   unit:"pantry"},
      {n:"Milk or oat milk",       amt:"¾ cup",     unit:"dairy"},
      {n:"Mixed berries",          amt:"1½ cups",   unit:"produce"},
      {n:"Honey or maple syrup",   amt:"3 tbsp",    unit:"pantry"},
      {n:"Butter or olive oil",    amt:"1 tsp",     unit:"dairy"},
      {n:"Salt",                   amt:"½ tsp",     unit:"spice"},
    ],
    steps:[
      "Warm a medium saucepan over medium heat and add the butter or olive oil.",
      "Add the dry oats and stir for 2–3 minutes until they smell toasty and slightly nutty.",
      "Pour in the water and salt and bring to a boil.",
      "Reduce heat to medium-low and cook uncovered for 20–25 minutes, stirring every 5 minutes.",
      "Stir in the milk for the final 5 minutes to make them extra creamy.",
      "Serve topped with berries and a drizzle of honey.",
    ],
  },
  "Sheet pan eggs with roasted veg": {
    macros:{cal:320, p:22, c:18, f:18, fiber:5},
    ing:[
      {n:"Large eggs",             amt:"5",         unit:"protein"},
      {n:"Cherry tomatoes, halved",amt:"1 cup",     unit:"produce"},
      {n:"Broccoli florets",       amt:"1 cup",     unit:"produce"},
      {n:"Red bell pepper, sliced",amt:"1",         unit:"produce"},
      {n:"Red onion, thin sliced", amt:"½",         unit:"produce"},
      {n:"Olive oil",              amt:"2 tbsp",    unit:"pantry"},
      {n:"Smoked paprika",         amt:"½ tsp",     unit:"spice"},
      {n:"Garlic powder",          amt:"½ tsp",     unit:"spice"},
      {n:"Salt and black pepper",  amt:"to taste",  unit:"spice"},
    ],
    steps:[
      "Preheat oven to 425°F and line a large sheet pan with parchment or foil.",
      "Toss all vegetables with olive oil, smoked paprika, garlic powder, salt, and pepper.",
      "Spread in a single layer and roast for 12 minutes.",
      "Make 5 small wells in the vegetables and crack one egg into each.",
      "Return to oven for 6–8 minutes — 6 min for runny yolks, 8 for fully set.",
      "Serve straight from the pan.",
    ],
  },
  "Overnight oats": {
    macros:{cal:380, p:16, c:58, f:9, fiber:7},
    ing:[
      {n:"Rolled oats",            amt:"½ cup",     unit:"grains"},
      {n:"Milk or oat milk",       amt:"½ cup",     unit:"dairy"},
      {n:"Plain Greek yogurt",     amt:"¼ cup",     unit:"dairy"},
      {n:"Chia seeds",             amt:"1 tbsp",    unit:"pantry"},
      {n:"Honey or maple syrup",   amt:"1 tbsp",    unit:"pantry"},
      {n:"Vanilla extract",        amt:"½ tsp",     unit:"pantry"},
      {n:"Fresh fruit (morning of)",amt:"½ cup",    unit:"produce"},
    ],
    steps:[
      "The night before: combine oats, milk, yogurt, chia seeds, honey, and vanilla in a jar.",
      "Stir well so chia seeds are evenly distributed. Seal and refrigerate.",
      "In the morning: stir — it will have thickened. Add fresh fruit.",
      "Eat cold or microwave 90 seconds. Add a splash of milk if too thick.",
    ],
  },
  "Avocado toast with fried egg": {
    macros:{cal:410, p:18, c:38, f:22, fiber:8},
    ing:[
      {n:"Whole grain or sourdough bread",amt:"2 slices",unit:"grains"},
      {n:"Ripe avocado",           amt:"1",         unit:"produce"},
      {n:"Eggs",                   amt:"2",         unit:"protein"},
      {n:"Olive oil",              amt:"1 tsp",     unit:"pantry"},
      {n:"Lemon, juiced",          amt:"½",         unit:"produce"},
      {n:"Salt, pepper, red pepper flakes",amt:"to taste",unit:"spice"},
    ],
    steps:[
      "Toast bread until golden and firm.",
      "Mash avocado with lemon juice, salt, and pepper until mostly smooth.",
      "Heat olive oil in a non-stick pan over medium. Crack in eggs and cook covered 2–3 min for runny yolks.",
      "Spread avocado on toast, top with egg, season again.",
    ],
  },
  "High-protein smoothie bowl": {
    macros:{cal:420, p:32, c:52, f:8, fiber:6},
    ing:[
      {n:"Frozen banana",          amt:"1",         unit:"produce"},
      {n:"Frozen mixed berries",   amt:"1 cup",     unit:"produce"},
      {n:"Greek yogurt",           amt:"½ cup",     unit:"dairy"},
      {n:"Milk or oat milk",       amt:"¼ cup",     unit:"dairy"},
      {n:"Protein powder (NF)",    amt:"1 scoop",   unit:"pantry"},
      {n:"Toppings: granola, seeds, fresh fruit",amt:"to taste",unit:"grains"},
    ],
    steps:[
      "Blend frozen banana, frozen berries, Greek yogurt, milk, and protein powder until thick and smooth.",
      "Pour into a bowl — it should be thicker than a regular smoothie.",
      "Top with granola, seeds, and fresh fruit. Eat immediately before it melts.",
    ],
  },
  "Greek yogurt parfait with granola": {
    macros:{cal:390, p:23, c:45, f:10, fiber:5},
    ing:[
      {n:"Plain full-fat Greek yogurt",amt:"¾ cup",unit:"dairy"},
      {n:"Homemade oat-seed granola",amt:"¼ cup",  unit:"grains"},
      {n:"Mixed berries",          amt:"¾ cup",    unit:"produce"},
      {n:"Honey",                  amt:"1–2 tsp",  unit:"pantry"},
    ],
    steps:[
      "Spoon yogurt into a bowl.",
      "Top with granola, berries, and a drizzle of honey.",
      "Serve immediately — granola softens quickly once it touches yogurt.",
    ],
  },
  "Veggie frittata": {
    macros:{cal:280, p:22, c:10, f:18, fiber:3},
    ing:[
      {n:"Large eggs",             amt:"6",         unit:"protein"},
      {n:"Milk",                   amt:"¼ cup",     unit:"dairy"},
      {n:"Mixed vegetables (zucchini, bell pepper, onion, spinach)",amt:"1½ cups",unit:"produce"},
      {n:"Olive oil",              amt:"1 tbsp",    unit:"pantry"},
      {n:"Garlic",                 amt:"2 cloves",  unit:"produce"},
      {n:"Salt, pepper, Italian seasoning",amt:"to taste",unit:"spice"},
    ],
    steps:[
      "Preheat oven to 375°F.",
      "Whisk eggs, milk, salt, and pepper together in a bowl.",
      "Heat olive oil in an oven-safe skillet over medium. Sauté vegetables and garlic for 4–5 minutes until soft.",
      "Pour egg mixture over vegetables. Cook undisturbed for 2 minutes until edges set.",
      "Transfer to oven and bake 12–15 minutes until the center is just set.",
      "Cool slightly, slice, and serve from the pan.",
    ],
  },
  "Egg muffin cups": {
    macros:{cal:260, p:24, c:8,  f:14, fiber:2},
    ing:[
      {n:"Large eggs",             amt:"8",         unit:"protein"},
      {n:"Milk or oat milk",       amt:"¼ cup",     unit:"dairy"},
      {n:"Baby spinach, chopped",  amt:"1 cup",     unit:"produce"},
      {n:"Cherry tomatoes, halved",amt:"½ cup",     unit:"produce"},
      {n:"Red bell pepper, diced", amt:"½ cup",     unit:"produce"},
      {n:"Cooked turkey sausage, crumbled",amt:"½ cup",unit:"protein"},
      {n:"Garlic powder, Italian seasoning",amt:"½ tsp each",unit:"spice"},
      {n:"Salt and pepper",        amt:"to taste",  unit:"spice"},
    ],
    steps:[
      "Preheat oven to 375°F. Spray a 12-cup muffin tin very generously.",
      "Whisk eggs, milk, garlic powder, Italian seasoning, salt, and pepper.",
      "Divide vegetables and sausage evenly among the 12 cups.",
      "Pour egg mixture over the fillings, filling each cup ¾ full.",
      "Bake 18–22 minutes until tops are set and just golden.",
      "Cool 5 minutes, run a knife around each to release. Refrigerate up to 5 days.",
    ],
  },
  "Turkey sausage and sweet potato hash": {
    macros:{cal:360, p:26, c:32, f:12, fiber:5},
    ing:[
      {n:"Turkey sausage links, sliced",amt:"3",   unit:"protein"},
      {n:"Sweet potatoes, small dice",amt:"2 medium",unit:"produce"},
      {n:"Bell pepper, diced",      amt:"1",        unit:"produce"},
      {n:"Onion, diced",            amt:"½",        unit:"produce"},
      {n:"Garlic",                  amt:"2 cloves", unit:"produce"},
      {n:"Olive oil",               amt:"2 tbsp",   unit:"pantry"},
      {n:"Smoked paprika",          amt:"½ tsp",    unit:"spice"},
      {n:"Salt and pepper",         amt:"to taste", unit:"spice"},
    ],
    steps:[
      "Heat olive oil in a large skillet over medium-high.",
      "Add sweet potatoes in a single layer. Cook undisturbed 4 minutes, then stir. Cook 4 more minutes until golden.",
      "Add onion and bell pepper and cook 3 minutes until softened.",
      "Add sausage and garlic and cook 3–4 minutes until sausage is browned.",
      "Season with smoked paprika, salt, and pepper. Serve hot.",
    ],
  },
  "Banana oat pancakes": {
    macros:{cal:340, p:14, c:54, f:8,  fiber:5},
    ing:[
      {n:"Ripe bananas",           amt:"2",         unit:"produce"},
      {n:"Rolled oats",            amt:"1 cup",     unit:"grains"},
      {n:"Eggs",                   amt:"2",         unit:"protein"},
      {n:"Milk",                   amt:"¼ cup",     unit:"dairy"},
      {n:"Baking powder",          amt:"1 tsp",     unit:"pantry"},
      {n:"Cinnamon",               amt:"½ tsp",     unit:"spice"},
      {n:"Salt",                   amt:"1 pinch",   unit:"spice"},
    ],
    steps:[
      "Mash bananas thoroughly in a bowl until smooth.",
      "Blend oats in a blender until they resemble flour. Add to banana.",
      "Stir in eggs, milk, baking powder, cinnamon, and salt until combined.",
      "Heat a non-stick pan over medium-low with a little oil or butter.",
      "Pour ¼ cup batter per pancake. Cook 2–3 minutes until bubbles form, then flip and cook 1–2 minutes.",
      "Serve with honey or maple syrup and fresh fruit.",
    ],
  },
  // ── LUNCHES ──
  "Lentil soup": {
    macros:{cal:320, p:18, c:52, f:5,  fiber:14},
    ing:[
      {n:"Red lentils",            amt:"1 cup",     unit:"grains"},
      {n:"Onion, diced",           amt:"1",         unit:"produce"},
      {n:"Carrots, diced",         amt:"2",         unit:"produce"},
      {n:"Garlic",                 amt:"3 cloves",  unit:"produce"},
      {n:"Cumin",                  amt:"1 tsp",     unit:"spice"},
      {n:"Olive oil",              amt:"2 tbsp",    unit:"pantry"},
      {n:"Broth (chicken or veg)", amt:"3 cups",    unit:"pantry"},
      {n:"Salt and pepper",        amt:"to taste",  unit:"spice"},
    ],
    steps:[
      "Heat olive oil in a large pot over medium. Cook onion and carrots 5–7 min until softened.",
      "Add garlic and cumin. Stir 30 seconds until fragrant.",
      "Rinse lentils and add with broth. Bring to a boil.",
      "Reduce to medium-low and simmer 20–25 minutes until lentils are completely soft.",
      "Season with salt and pepper. Add water if too thick. Serve with crusty bread.",
    ],
  },
  "Turkey and avocado wrap": {
    macros:{cal:440, p:34, c:36, f:18, fiber:6},
    ing:[
      {n:"Deli turkey breast, sliced",amt:"4 oz",  unit:"protein"},
      {n:"Large flour tortilla",   amt:"1",         unit:"grains"},
      {n:"Ripe avocado",           amt:"½",         unit:"produce"},
      {n:"Romaine lettuce",        amt:"2 leaves",  unit:"produce"},
      {n:"Tomato, sliced",         amt:"½",         unit:"produce"},
      {n:"Dijon mustard or hummus",amt:"1 tbsp",    unit:"pantry"},
      {n:"Salt and pepper",        amt:"to taste",  unit:"spice"},
    ],
    steps:[
      "Lay tortilla flat. Spread mustard or hummus across the center.",
      "Layer turkey, sliced avocado, lettuce, and tomato. Season with salt and pepper.",
      "Fold the sides in and roll firmly. Cut in half. Eat immediately.",
    ],
  },
  "Big green salad with chicken": {
    macros:{cal:490, p:42, c:18, f:28, fiber:8},
    ing:[
      {n:"Mixed greens or romaine",amt:"3 cups",   unit:"produce"},
      {n:"Cooked chicken breast or thigh",amt:"1", unit:"protein"},
      {n:"Cherry tomatoes, halved",amt:"½ cup",    unit:"produce"},
      {n:"Cucumber, sliced",       amt:"½",         unit:"produce"},
      {n:"Red onion, thin sliced", amt:"¼",         unit:"produce"},
      {n:"Olive oil",              amt:"2 tbsp",    unit:"pantry"},
      {n:"Lemon juice or red wine vinegar",amt:"1 tbsp",unit:"pantry"},
      {n:"Salt and pepper",        amt:"to taste",  unit:"spice"},
    ],
    steps:[
      "Slice or shred the cooked chicken.",
      "Combine greens, tomatoes, cucumber, and onion in a large bowl.",
      "Top with chicken. Drizzle with olive oil and lemon juice. Season and toss.",
      "Eat immediately.",
    ],
  },
  "Teriyaki chicken bowl": {
    macros:{cal:540, p:40, c:56, f:14, fiber:5},
    ing:[
      {n:"Cooked chicken (thigh or breast)",amt:"1 cup, sliced",unit:"protein"},
      {n:"Cooked brown or white rice",amt:"1 cup", unit:"grains"},
      {n:"Broccoli florets, steamed",amt:"1 cup",  unit:"produce"},
      {n:"Low-sodium soy sauce or tamari",amt:"2 tbsp",unit:"pantry"},
      {n:"Honey",                   amt:"1 tbsp",  unit:"pantry"},
      {n:"Garlic powder",           amt:"½ tsp",   unit:"spice"},
      {n:"Sesame seeds",            amt:"1 tsp",   unit:"spice"},
    ],
    steps:[
      "Whisk soy sauce, honey, and garlic powder in a small pan. Simmer 2 minutes until slightly thick.",
      "Warm rice and broccoli.",
      "Arrange rice in a bowl, top with sliced chicken and broccoli.",
      "Drizzle teriyaki sauce over everything. Top with sesame seeds.",
    ],
  },
  "Ground turkey chili": {
    macros:{cal:420, p:38, c:32, f:10, fiber:10},
    ing:[
      {n:"Ground turkey, 93% lean", amt:"1 lb",    unit:"protein"},
      {n:"Canned kidney beans",     amt:"1 can",   unit:"grains"},
      {n:"Canned diced tomatoes",   amt:"1 can",   unit:"pantry"},
      {n:"Onion, diced",            amt:"1",        unit:"produce"},
      {n:"Garlic",                  amt:"3 cloves", unit:"produce"},
      {n:"Bell pepper, diced",      amt:"1",        unit:"produce"},
      {n:"Chili powder",            amt:"2 tsp",    unit:"spice"},
      {n:"Cumin",                   amt:"1 tsp",    unit:"spice"},
      {n:"Olive oil",               amt:"1 tbsp",   unit:"pantry"},
    ],
    steps:[
      "Heat olive oil in a large pot. Cook onion and bell pepper 5 minutes.",
      "Add turkey and cook 6–8 minutes, breaking apart, until fully browned.",
      "Add garlic, chili powder, and cumin. Stir 1 minute.",
      "Add diced tomatoes and drained beans. Stir and simmer 20 minutes.",
      "Season with salt. Serve with optional toppings (sour cream, cheese, green onion).",
    ],
  },
  "Black bean and sweet potato bowl": {
    macros:{cal:460, p:16, c:72, f:10, fiber:14},
    ing:[
      {n:"Canned black beans, drained",amt:"1 can",unit:"grains"},
      {n:"Sweet potato",            amt:"1 large", unit:"produce"},
      {n:"Cooked rice or quinoa",   amt:"1 cup",   unit:"grains"},
      {n:"Cumin, chili powder",     amt:"1 tsp each",unit:"spice"},
      {n:"Olive oil",               amt:"2 tbsp",  unit:"pantry"},
      {n:"Lime juice",              amt:"1 lime",  unit:"produce"},
      {n:"Salt and pepper",         amt:"to taste",unit:"spice"},
    ],
    steps:[
      "Preheat oven to 400°F. Cube sweet potato, toss with olive oil, cumin, chili powder, salt.",
      "Roast 20–25 minutes until caramelized.",
      "Warm black beans in a small saucepan with a pinch of cumin and salt.",
      "Assemble bowl: rice or quinoa, roasted sweet potato, black beans.",
      "Squeeze lime over the top. Add salsa or avocado if desired.",
    ],
  },
  "Chicken salad lettuce wraps": {
    macros:{cal:310, p:34, c:6,  f:16, fiber:2},
    ing:[
      {n:"Cooked chicken, shredded",amt:"1½ cups", unit:"protein"},
      {n:"Mayonnaise",              amt:"2 tbsp",  unit:"pantry"},
      {n:"Dijon mustard",           amt:"1 tsp",   unit:"pantry"},
      {n:"Celery, diced",           amt:"2 stalks",unit:"produce"},
      {n:"Red onion, minced",       amt:"2 tbsp",  unit:"produce"},
      {n:"Lemon juice",             amt:"1 tbsp",  unit:"produce"},
      {n:"Large romaine leaves",    amt:"6",        unit:"produce"},
      {n:"Salt and pepper",         amt:"to taste",unit:"spice"},
    ],
    steps:[
      "Combine chicken, mayonnaise, mustard, celery, red onion, and lemon juice.",
      "Season with salt and pepper. Stir well.",
      "Spoon chicken salad into romaine leaves.",
      "Eat as wraps. Refrigerate any leftover filling up to 3 days.",
    ],
  },
  "Batch prep grain bowl": {
    macros:{cal:480, p:36, c:48, f:12, fiber:6},
    ing:[
      {n:"Cooked brown rice or farro",amt:"1 cup", unit:"grains"},
      {n:"Roasted vegetables (batch cooked)",amt:"1 cup",unit:"produce"},
      {n:"Cooked protein (chicken or turkey)",amt:"½ cup",unit:"protein"},
      {n:"Olive oil",               amt:"1 tbsp",  unit:"pantry"},
      {n:"Lemon juice or vinegar",  amt:"1 tbsp",  unit:"pantry"},
      {n:"Salt, pepper, herbs",     amt:"to taste",unit:"spice"},
    ],
    steps:[
      "Pull batch-cooked components from the refrigerator.",
      "Warm rice, vegetables, and protein in the microwave 2 minutes or in a skillet.",
      "Assemble in a bowl. Drizzle with olive oil and lemon juice.",
      "Season with salt and pepper. Add any sauce you have on hand.",
    ],
  },
  "Chickpea and vegetable soup": {
    macros:{cal:280, p:12, c:38, f:8,  fiber:10},
    ing:[
      {n:"Canned chickpeas, drained",amt:"1 can",  unit:"grains"},
      {n:"Canned diced tomatoes",   amt:"1 can",   unit:"pantry"},
      {n:"Onion, diced",            amt:"1",        unit:"produce"},
      {n:"Carrots, diced",          amt:"2",        unit:"produce"},
      {n:"Celery, diced",           amt:"2 stalks", unit:"produce"},
      {n:"Garlic",                  amt:"3 cloves", unit:"produce"},
      {n:"Broth (chicken or veg)",  amt:"3 cups",   unit:"pantry"},
      {n:"Spinach or kale",         amt:"2 cups",   unit:"produce"},
      {n:"Cumin, Italian seasoning",amt:"1 tsp each",unit:"spice"},
      {n:"Olive oil",               amt:"2 tbsp",   unit:"pantry"},
    ],
    steps:[
      "Heat olive oil in a large pot. Cook onion, carrots, and celery 5–7 minutes.",
      "Add garlic and spices. Stir 30 seconds.",
      "Add chickpeas, tomatoes, and broth. Bring to a boil, then simmer 15 minutes.",
      "Stir in spinach or kale and cook 2 minutes until wilted.",
      "Season with salt and pepper. Serve with bread.",
    ],
  },
  "Egg fried rice": {
    macros:{cal:460, p:18, c:68, f:14, fiber:4},
    ing:[
      {n:"Cooked white rice (day-old best)",amt:"2 cups",unit:"grains"},
      {n:"Eggs",                    amt:"3",         unit:"protein"},
      {n:"Frozen peas and carrots", amt:"1 cup",     unit:"produce"},
      {n:"Green onions, sliced",    amt:"3",         unit:"produce"},
      {n:"Low-sodium soy sauce",    amt:"2 tbsp",    unit:"pantry"},
      {n:"Sesame oil",              amt:"1 tsp",     unit:"pantry"},
      {n:"Vegetable oil",           amt:"2 tbsp",    unit:"pantry"},
      {n:"Garlic",                  amt:"2 cloves",  unit:"produce"},
    ],
    steps:[
      "Heat vegetable oil in a wok or large skillet over high heat.",
      "Add rice and stir-fry 2–3 minutes, pressing it against the pan to get some crisp.",
      "Push rice to the side. Add eggs and scramble until just set, then mix into rice.",
      "Add frozen peas and carrots, garlic, and soy sauce. Toss everything 2–3 minutes.",
      "Drizzle sesame oil and top with green onions. Serve immediately.",
    ],
  },
  "Turkey meatball bowl": {
    macros:{cal:440, p:38, c:42, f:12, fiber:4},
    ing:[
      {n:"Cooked turkey meatballs (from batch)",amt:"4–5",unit:"protein"},
      {n:"Cooked pasta or zucchini noodles",amt:"1 cup",unit:"grains"},
      {n:"Marinara sauce (warmed)",  amt:"½ cup",   unit:"pantry"},
      {n:"Olive oil",                amt:"1 tsp",   unit:"pantry"},
    ],
    steps:[
      "Warm meatballs in marinara sauce in a saucepan over medium heat 5 minutes.",
      "Warm pasta or zucchini noodles.",
      "Serve meatballs and sauce over noodles.",
    ],
  },
  "Chicken stir-fry with rice noodles": {
    macros:{cal:470, p:38, c:50, f:12, fiber:6},
    ing:[
      {n:"Chicken breast or thigh, sliced thin",amt:"2",unit:"protein"},
      {n:"Rice noodles",             amt:"6 oz",    unit:"grains"},
      {n:"Broccoli florets",         amt:"1 cup",   unit:"produce"},
      {n:"Bell pepper, sliced",      amt:"1",        unit:"produce"},
      {n:"Snap peas",                amt:"1 cup",   unit:"produce"},
      {n:"Garlic",                   amt:"3 cloves",unit:"produce"},
      {n:"Low-sodium soy sauce",     amt:"3 tbsp",  unit:"pantry"},
      {n:"Sesame oil",               amt:"1 tsp",   unit:"pantry"},
      {n:"Vegetable oil",            amt:"2 tbsp",  unit:"pantry"},
      {n:"Ginger",                   amt:"1 tsp",   unit:"spice"},
    ],
    steps:[
      "Soak rice noodles in hot water 8–10 minutes per package. Drain.",
      "Whisk soy sauce, sesame oil, and ginger in a small bowl.",
      "Heat vegetable oil in a wok over high. Cook chicken 4–5 minutes until cooked. Remove.",
      "Add broccoli, bell pepper, snap peas, and garlic. Stir-fry 3–4 minutes.",
      "Return chicken. Add noodles and sauce. Toss everything 1–2 minutes. Serve hot.",
    ],
  },
  // ── DINNERS ──
  "Sheet pan chicken with vegetables": {
    macros:{cal:520, p:44, c:28, f:24, fiber:6},
    ing:[
      {n:"Bone-in skin-on chicken thighs",amt:"3", unit:"protein"},
      {n:"Broccoli florets",         amt:"2 cups",  unit:"produce"},
      {n:"Sweet potato, 1-inch cubes",amt:"1 large",unit:"produce"},
      {n:"Red bell pepper, sliced",  amt:"1",        unit:"produce"},
      {n:"Zucchini, half-moons",     amt:"1",        unit:"produce"},
      {n:"Olive oil",                amt:"3 tbsp",   unit:"pantry"},
      {n:"Garlic powder",            amt:"1 tsp",    unit:"spice"},
      {n:"Smoked paprika",           amt:"1 tsp",    unit:"spice"},
      {n:"Italian seasoning",        amt:"1 tsp",    unit:"spice"},
      {n:"Salt and black pepper",    amt:"to taste", unit:"spice"},
    ],
    steps:[
      "Preheat oven to 425°F and line a large sheet pan with foil or parchment.",
      "Toss all vegetables with 2 tbsp olive oil and all the seasonings until well coated.",
      "Spread on the sheet pan in a single layer — use two pans if crowded.",
      "Pat chicken thighs very dry. Coat with remaining olive oil and the same seasonings.",
      "Place chicken skin-side up on top of or alongside the vegetables.",
      "Roast 35–40 minutes, checking vegetables at 25 minutes. Pull them out if done early.",
      "Chicken is ready when skin is deeply golden and internal temp reads 165°F.",
      "Rest 5 minutes before serving.",
    ],
  },
  "Ground turkey stir-fry": {
    macros:{cal:480, p:42, c:36, f:14, fiber:6},
    ing:[
      {n:"Ground turkey, 93% lean", amt:"1.25 lbs", unit:"protein"},
      {n:"Broccoli florets",         amt:"3 cups",   unit:"produce"},
      {n:"Red bell pepper, sliced",  amt:"1",         unit:"produce"},
      {n:"Snap peas",                amt:"2 cups",   unit:"produce"},
      {n:"Garlic cloves, minced",    amt:"4",         unit:"produce"},
      {n:"Fresh ginger, grated",     amt:"1 tbsp",   unit:"spice"},
      {n:"Low-sodium tamari",        amt:"3 tbsp",   unit:"pantry"},
      {n:"Honey",                    amt:"1 tbsp",   unit:"pantry"},
      {n:"Rice vinegar",             amt:"1 tbsp",   unit:"pantry"},
      {n:"Sesame oil",               amt:"1 tsp",    unit:"pantry"},
      {n:"High-heat vegetable oil",  amt:"2 tbsp",   unit:"pantry"},
      {n:"Cooked brown rice",        amt:"2 cups",   unit:"grains"},
    ],
    steps:[
      "Whisk tamari, honey, rice vinegar, and sesame oil together. Set aside.",
      "Heat vegetable oil in a wok over high heat until shimmering.",
      "Add turkey. Cook without stirring 2 minutes for color, then break apart and cook 4–5 more minutes until browned.",
      "Push turkey to one side. Add broccoli and bell pepper. Stir-fry 3–4 minutes.",
      "Add snap peas and cook 1 minute. Add garlic and ginger, stir 30 seconds.",
      "Pour sauce over everything. Toss to coat, cook 1–2 minutes until sauce thickens.",
      "Serve over rice. Garnish with sesame seeds and green onions.",
    ],
  },
  "Herb roasted chicken with root veg": {
    macros:{cal:510, p:44, c:30, f:22, fiber:6},
    ing:[
      {n:"Chicken thighs (bone-in skin-on)",amt:"4",unit:"protein"},
      {n:"Carrots, large chunks",    amt:"3",         unit:"produce"},
      {n:"Parsnips or sweet potato", amt:"2",         unit:"produce"},
      {n:"Red onion, quartered",     amt:"1",         unit:"produce"},
      {n:"Garlic",                   amt:"4 cloves",  unit:"produce"},
      {n:"Olive oil",                amt:"3 tbsp",    unit:"pantry"},
      {n:"Dried thyme",              amt:"1 tsp",     unit:"spice"},
      {n:"Dried rosemary",           amt:"1 tsp",     unit:"spice"},
      {n:"Salt and black pepper",    amt:"to taste",  unit:"spice"},
    ],
    steps:[
      "Preheat oven to 425°F.",
      "Toss root vegetables with 2 tbsp olive oil, thyme, rosemary, salt, and pepper. Spread in a roasting pan.",
      "Pat chicken dry. Rub with remaining olive oil, thyme, rosemary, salt, and pepper.",
      "Place chicken skin-side up on top of the vegetables.",
      "Roast 40–45 minutes until chicken skin is deeply golden and internal temp reads 165°F.",
      "Rest 5 minutes. Serve chicken alongside the caramelized vegetables.",
    ],
  },
  "Baked lemon herb chicken thighs": {
    macros:{cal:420, p:40, c:4,  f:26, fiber:1},
    ing:[
      {n:"Chicken thighs (bone-in skin-on)",amt:"4",unit:"protein"},
      {n:"Lemon",                    amt:"1",         unit:"produce"},
      {n:"Garlic",                   amt:"4 cloves",  unit:"produce"},
      {n:"Olive oil",                amt:"2 tbsp",    unit:"pantry"},
      {n:"Dried oregano",            amt:"1 tsp",     unit:"spice"},
      {n:"Dried thyme",              amt:"½ tsp",     unit:"spice"},
      {n:"Salt and black pepper",    amt:"to taste",  unit:"spice"},
    ],
    steps:[
      "Preheat oven to 425°F.",
      "Whisk together olive oil, lemon juice, minced garlic, oregano, thyme, salt, and pepper.",
      "Coat chicken thighs thoroughly and place skin-side up in a baking dish.",
      "Let sit 10 minutes while the oven heats.",
      "Bake 35–40 minutes until skin is golden and internal temp reads 165°F.",
      "Rest 5 minutes. Serve with lemon wedges and your choice of sides.",
    ],
  },
  "Stuffed bell peppers": {
    macros:{cal:500, p:36, c:42, f:18, fiber:7},
    ing:[
      {n:"Bell peppers (any color)", amt:"4 large",  unit:"produce"},
      {n:"Ground beef or turkey",    amt:"1 lb",      unit:"protein"},
      {n:"Cooked white rice",        amt:"1 cup",     unit:"grains"},
      {n:"Tomato sauce",             amt:"1 cup",     unit:"pantry"},
      {n:"Onion, diced",             amt:"½",         unit:"produce"},
      {n:"Garlic",                   amt:"2 cloves",  unit:"produce"},
      {n:"Italian seasoning",        amt:"1 tsp",     unit:"spice"},
      {n:"Shredded cheese",          amt:"½ cup",     unit:"dairy"},
      {n:"Salt and pepper",          amt:"to taste",  unit:"spice"},
    ],
    steps:[
      "Preheat oven to 375°F. Cut tops off peppers and remove seeds.",
      "Brown ground meat with onion in a skillet, 6–8 minutes. Drain fat.",
      "Add garlic, Italian seasoning, cooked rice, and half the tomato sauce. Stir to combine.",
      "Season filling with salt and pepper.",
      "Spoon filling into each pepper. Place in a baking dish. Pour remaining tomato sauce around them.",
      "Cover with foil and bake 30 minutes. Remove foil, top with cheese, bake 10 more minutes.",
      "Rest 5 minutes before serving.",
    ],
  },
  "Pork tenderloin with root vegetables": {
    macros:{cal:460, p:38, c:38, f:14, fiber:6},
    ing:[
      {n:"Pork tenderloin",          amt:"1.25 lbs",  unit:"protein"},
      {n:"Carrots, large chunks",    amt:"3",          unit:"produce"},
      {n:"Sweet potatoes, cubed",    amt:"2",          unit:"produce"},
      {n:"Red onion, quartered",     amt:"1",          unit:"produce"},
      {n:"Olive oil",                amt:"3 tbsp",     unit:"pantry"},
      {n:"Garlic powder",            amt:"1 tsp",      unit:"spice"},
      {n:"Dried rosemary",           amt:"1 tsp",      unit:"spice"},
      {n:"Salt and black pepper",    amt:"to taste",   unit:"spice"},
      {n:"Dijon mustard (optional)", amt:"1 tbsp",     unit:"pantry"},
    ],
    steps:[
      "Preheat oven to 425°F.",
      "Toss vegetables with 2 tbsp olive oil, garlic powder, rosemary, salt, and pepper. Spread on a sheet pan.",
      "Rub pork with remaining olive oil and mustard if using. Season generously.",
      "Place pork on top of or alongside the vegetables.",
      "Roast 25–30 minutes until pork internal temp reads 145°F.",
      "Rest 5–10 minutes before slicing. This step is critical — slice too early and you lose all the juice.",
      "Serve sliced pork alongside caramelized vegetables.",
    ],
  },
  "Turkey meatballs with marinara": {
    macros:{cal:520, p:42, c:48, f:14, fiber:5},
    ing:[
      {n:"Ground turkey",            amt:"1 lb",      unit:"protein"},
      {n:"Breadcrumbs",              amt:"¼ cup",     unit:"grains"},
      {n:"Egg",                      amt:"1",          unit:"protein"},
      {n:"Garlic powder",            amt:"1 tsp",      unit:"spice"},
      {n:"Italian seasoning",        amt:"1 tsp",      unit:"spice"},
      {n:"Jarred marinara sauce",    amt:"1 large jar",unit:"pantry"},
      {n:"Pasta or zucchini noodles",amt:"8 oz",      unit:"grains"},
      {n:"Olive oil",                amt:"2 tbsp",     unit:"pantry"},
      {n:"Salt and pepper",          amt:"to taste",   unit:"spice"},
    ],
    steps:[
      "Preheat oven to 400°F. Line a sheet pan with parchment.",
      "Combine turkey, breadcrumbs, egg, garlic powder, Italian seasoning, salt, and pepper. Mix until just combined.",
      "Roll into 1½-inch balls. Place on sheet pan.",
      "Bake 18–20 minutes until cooked through and lightly browned.",
      "Meanwhile cook pasta in salted boiling water. Warm marinara in a saucepan.",
      "Add meatballs to the sauce and simmer 5 minutes.",
      "Serve over pasta or zucchini noodles.",
    ],
  },
  "Ground beef and broccoli bowl": {
    macros:{cal:540, p:44, c:36, f:22, fiber:5},
    ing:[
      {n:"Ground beef, 80/20",       amt:"1 lb",      unit:"protein"},
      {n:"Broccoli florets",         amt:"3 cups",    unit:"produce"},
      {n:"Garlic cloves, minced",    amt:"4",          unit:"produce"},
      {n:"Fresh ginger, grated",     amt:"1 tbsp",    unit:"spice"},
      {n:"Low-sodium soy sauce",     amt:"3 tbsp",    unit:"pantry"},
      {n:"Honey",                    amt:"1 tbsp",    unit:"pantry"},
      {n:"Sesame oil",               amt:"1 tsp",     unit:"pantry"},
      {n:"Vegetable oil",            amt:"1 tbsp",    unit:"pantry"},
      {n:"Cooked white rice",        amt:"2 cups",    unit:"grains"},
    ],
    steps:[
      "Whisk together soy sauce, honey, and sesame oil. Set aside.",
      "Steam or microwave broccoli until tender-crisp, about 4 minutes. Set aside.",
      "Cook ground beef in a large skillet over medium-high, breaking apart, until fully browned. Drain fat.",
      "Add garlic and ginger. Cook 1 minute.",
      "Add broccoli and sauce. Toss to coat. Cook 2 minutes.",
      "Serve over rice.",
    ],
  },
  "Ground turkey and veg noodle bowl": {
    macros:{cal:480, p:42, c:48, f:12, fiber:5},
    ing:[
      {n:"Ground turkey, 93% lean",  amt:"1 lb",      unit:"protein"},
      {n:"Rice noodles or pasta",    amt:"6 oz",      unit:"grains"},
      {n:"Mixed vegetables (carrot, zucchini, spinach)",amt:"2 cups",unit:"produce"},
      {n:"Garlic",                   amt:"3 cloves",   unit:"produce"},
      {n:"Low-sodium soy sauce",     amt:"2 tbsp",    unit:"pantry"},
      {n:"Olive or vegetable oil",   amt:"2 tbsp",    unit:"pantry"},
      {n:"Salt and pepper",          amt:"to taste",  unit:"spice"},
    ],
    steps:[
      "Cook noodles per package. Drain and toss with a little oil to prevent sticking.",
      "Brown ground turkey in a large skillet 6–8 minutes. Season with salt and pepper.",
      "Add garlic and vegetables. Cook 4–5 minutes until tender.",
      "Add noodles and soy sauce. Toss everything together over heat 1–2 minutes.",
      "Serve hot.",
    ],
  },
  "Pulled chicken tacos": {
    macros:{cal:460, p:38, c:44, f:10, fiber:6},
    ing:[
      {n:"Chicken thighs (boneless skinless)",amt:"1.5 lbs",unit:"protein"},
      {n:"Chicken broth",            amt:"½ cup",     unit:"pantry"},
      {n:"Garlic powder, cumin, smoked paprika",amt:"1 tsp each",unit:"spice"},
      {n:"Corn or flour tortillas",  amt:"8",          unit:"grains"},
      {n:"Toppings: shredded cabbage, salsa, lime, avocado",amt:"as desired",unit:"produce"},
      {n:"Salt and pepper",          amt:"to taste",   unit:"spice"},
    ],
    steps:[
      "Season chicken thighs with garlic powder, cumin, smoked paprika, salt, and pepper.",
      "Place in a pot or deep skillet. Add broth. Cover and simmer over medium-low 25–30 minutes until very tender.",
      "Shred chicken with two forks. Mix back into the cooking juices.",
      "Warm tortillas in a dry pan or directly over a flame.",
      "Fill each tortilla with pulled chicken and your toppings of choice.",
    ],
  },
  "Black bean tacos with mango salsa": {
    macros:{cal:420, p:14, c:68, f:10, fiber:14},
    ing:[
      {n:"Canned black beans, drained",amt:"2 cans", unit:"grains"},
      {n:"Corn or flour tortillas",  amt:"8",          unit:"grains"},
      {n:"Mango, diced",             amt:"1",           unit:"produce"},
      {n:"Red onion, finely diced",  amt:"¼",           unit:"produce"},
      {n:"Cilantro, chopped",        amt:"¼ cup",       unit:"produce"},
      {n:"Jalapeño (optional)",      amt:"½",           unit:"produce"},
      {n:"Lime",                     amt:"1",            unit:"produce"},
      {n:"Cumin, chili powder",      amt:"1 tsp each",  unit:"spice"},
      {n:"Shredded cabbage",         amt:"1 cup",       unit:"produce"},
    ],
    steps:[
      "Make mango salsa: combine diced mango, red onion, cilantro, jalapeño if using, and lime juice. Season with salt.",
      "Warm black beans in a saucepan with cumin, chili powder, and a pinch of salt.",
      "Warm tortillas in a dry pan.",
      "Fill each tortilla with seasoned black beans, shredded cabbage, and mango salsa.",
      "Squeeze extra lime over the top before eating.",
    ],
  },
  "Honey garlic chicken thighs": {
    macros:{cal:490, p:38, c:40, f:20, fiber:6},
    ing:[
      {n:"Chicken thighs (bone-in skin-on)",amt:"4",unit:"protein"},
      {n:"Garlic cloves, minced",    amt:"5",          unit:"produce"},
      {n:"Honey",                    amt:"3 tbsp",      unit:"pantry"},
      {n:"Low-sodium soy sauce",     amt:"2 tbsp",      unit:"pantry"},
      {n:"Olive oil",                amt:"1 tbsp",      unit:"pantry"},
      {n:"Salt and black pepper",    amt:"to taste",    unit:"spice"},
    ],
    steps:[
      "Preheat oven to 425°F.",
      "Whisk together honey, soy sauce, and minced garlic.",
      "Pat chicken dry. Season with salt and pepper.",
      "Heat olive oil in an oven-safe skillet over medium-high. Sear chicken skin-side down 5 minutes until golden.",
      "Flip. Pour honey garlic sauce over the chicken.",
      "Transfer to oven and bake 20–25 minutes until internal temp reads 165°F.",
      "Baste with pan juices once halfway through. Serve with rice and vegetables.",
    ],
  },
  "Lemon herb chicken with wilted greens": {
    macros:{cal:440, p:40, c:28, f:18, fiber:4},
    ing:[
      {n:"Chicken thighs (boneless skinless)",amt:"4",unit:"protein"},
      {n:"Kale or spinach",          amt:"4 cups",     unit:"produce"},
      {n:"Cooked white or brown rice",amt:"2 cups",   unit:"grains"},
      {n:"Lemon",                    amt:"1",            unit:"produce"},
      {n:"Garlic",                   amt:"3 cloves",    unit:"produce"},
      {n:"Olive oil",                amt:"2 tbsp",      unit:"pantry"},
      {n:"Dried thyme or oregano",   amt:"1 tsp",       unit:"spice"},
      {n:"Salt and black pepper",    amt:"to taste",    unit:"spice"},
    ],
    steps:[
      "Season chicken with lemon zest, thyme or oregano, salt, and pepper.",
      "Heat 1 tbsp olive oil in a skillet over medium-high. Cook chicken 5–6 minutes per side until golden and cooked through (165°F). Rest 3 minutes.",
      "In the same skillet, heat remaining olive oil over medium. Add garlic and cook 30 seconds.",
      "Add greens and a squeeze of lemon. Toss until just wilted, about 2 minutes.",
      "Slice chicken. Serve over rice with wilted greens alongside.",
    ],
  },
  "Slow cooker pulled chicken": {
    macros:{cal:490, p:42, c:48, f:14, fiber:7},
    ing:[
      {n:"Chicken thighs (boneless skinless)",amt:"2 lbs",unit:"protein"},
      {n:"Chicken broth",            amt:"½ cup",       unit:"pantry"},
      {n:"Garlic powder, onion powder",amt:"1 tsp each",unit:"spice"},
      {n:"Smoked paprika",           amt:"1 tsp",       unit:"spice"},
      {n:"Sweet potato, cubed and roasted",amt:"2 large",unit:"produce"},
      {n:"Salt and black pepper",    amt:"to taste",    unit:"spice"},
    ],
    steps:[
      "Season chicken with all spices. Place in slow cooker with broth.",
      "Cook on HIGH 3–4 hours or LOW 6–7 hours until very tender.",
      "Shred chicken with two forks. Mix back into juices.",
      "Roast sweet potatoes at 400°F with olive oil, salt, and pepper for 25 minutes.",
      "Serve pulled chicken over roasted sweet potato.",
    ],
  },
  // ── LEFTOVERS ──
  "Leftover sheet pan chicken":    {ing:[{n:"Leftover sheet pan chicken",amt:"1 serving",unit:"protein"}],steps:[]},
  "Leftover baked chicken":        {ing:[{n:"Leftover baked lemon herb chicken",amt:"1 serving",unit:"protein"}],steps:[]},
  "Leftover herb roasted chicken": {ing:[{n:"Leftover herb roasted chicken",amt:"1 serving",unit:"protein"}],steps:[]},
  "Leftover pork tenderloin":      {ing:[{n:"Leftover pork tenderloin",amt:"1 serving",unit:"protein"}],steps:[]},
  "Leftover pulled chicken":       {ing:[{n:"Leftover pulled chicken",amt:"1 serving",unit:"protein"}],steps:[]},
  "Leftover turkey stir-fry":      {ing:[{n:"Leftover ground turkey stir-fry",amt:"1 serving",unit:"protein"}],steps:[]},
  "Leftover Sunday batch":         {ing:[{n:"Leftover batch cook from Sunday",amt:"1 serving",unit:"protein"}],steps:[]},
  "Meal prep batch — double dinner":{ing:[{n:"Double all dinner quantities — portion and refrigerate",amt:"×2",unit:"pantry"}],steps:["Double the quantities of tonight's dinner recipe.","Eat one portion tonight.","Store the rest in airtight containers. Refrigerate up to 4 days.","Use for lunches throughout the week."]},
};

// ── CEREMONY & PRACTICE SUPPLIES — sourced from spec ──
const CEREMONY_SUPPLIES = {
  "The Rite of the Uncrowned": {
    items: [
      {n:"Frankincense resin tears (Boswellia serrata, food grade)",           amt:"small bag",    unit:"ceremony", where:"Mountain Rose Herbs (mountainroseherbs.com) or Amazon — specify Boswellia serrata, food grade"},
      {n:"Frankincense essential oil",                                          amt:"5–15ml bottle",unit:"ceremony", where:"Plant Therapy (planttherapy.com) — GC/MS tested, no MLM"},
      {n:"Cedarwood essential oil",                                             amt:"5–15ml bottle",unit:"ceremony", where:"Plant Therapy (planttherapy.com)"},
      {n:"Sandalwood essential oil",                                            amt:"2–5ml bottle", unit:"ceremony", where:"Eden's Garden (edensgarden.com) — sandalwood is expensive, small bottle is fine"},
      {n:"Charcoal discs (for resin burning)",                                 amt:"1 pack",       unit:"ceremony", where:"Amazon — search 'charcoal discs incense', any brand"},
      {n:"Heatproof vessel (brass or ceramic bowl)",                           amt:"1",            unit:"ceremony", where:"Amazon, any kitchen store, or thrift store — must hold heat"},
      {n:"Carrier oil (fractionated coconut or jojoba)",                       amt:"2 oz",         unit:"ceremony", where:"Any pharmacy, Walmart, or Mountain Rose Herbs"},
      {n:"Raw honey",                                                           amt:"small jar",    unit:"ceremony", where:"Any grocery store — local if available"},
      {n:"Candle (pillar or taper, unscented)",                                amt:"1",            unit:"ceremony", where:"Any grocery or home goods store — real wax, not LED"},
    ],
  },
  "Morning Clarity Tea (Imperium)": {
    prep:"Boil water to 175°F (not full boil). Whisk matcha powder in a small amount of hot water until smooth paste forms — no dry clumps. Add remaining water. Add Lion's Mane powder and whisk again. Add fresh rosemary sprig. Steep 2 minutes. Remove rosemary. Drink without sweetener. This is a focus drink, not a comfort drink.",
    items: [
      {n:"Matcha (ceremonial grade)",         amt:"30–50g tin",  unit:"ceremony", where:"Ippodo Tea (ippodotea.com) or Amazon — ceremonial grade only"},
      {n:"Lion's Mane mushroom powder",       amt:"100g bag",    unit:"ceremony", where:"Real Mushrooms (realmushrooms.com) — fruiting body only, not mycelium"},
      {n:"Fresh rosemary",                    amt:"1 bunch",     unit:"produce",  where:"Any grocery store produce section"},
    ],
  },
  "Rite Preparation Tea (Imperium)": {
    prep:"Boil water. Add a small piece of food-grade frankincense resin to the water — it will dissolve partially and release the scent. Do not drink the resin pieces. Steep 5 minutes. Strain carefully. Add a small amount of raw honey. Drink slowly before the rite begins. This is a threshold ritual, not a wellness drink.",
    items: [
      {n:"Frankincense resin tears (Boswellia serrata, food grade)", amt:"small bag",  unit:"ceremony", where:"Mountain Rose Herbs (mountainroseherbs.com)"},
      {n:"Raw honey",                                                 amt:"small jar",  unit:"ceremony", where:"Any grocery store — local if available"},
    ],
  },
  "The Rite of the Unspent": {
    items: [
      {n:"Rose essential oil",                       amt:"2–5ml bottle", unit:"ceremony", where:"Plant Therapy (planttherapy.com) — rose is expensive, 2ml is sufficient"},
      {n:"Frankincense essential oil",               amt:"5–15ml bottle",unit:"ceremony", where:"Plant Therapy (planttherapy.com)"},
      {n:"Carrier oil (fractionated coconut or jojoba)", amt:"2 oz",    unit:"ceremony", where:"Any pharmacy or Walmart"},
      {n:"Candle (pillar or taper, unscented)",      amt:"1",           unit:"ceremony", where:"Any grocery or home goods store — real wax, not LED"},
    ],
  },
  "Morning Grounding Tea (Tending)": {
    prep:"Steep chamomile, lemon balm, and a small amount of lavender together in hot water 5–7 minutes. Strain. Add honey to taste. Drink sitting, not standing. Warm your hands on the cup before the first sip.",
    items: [
      {n:"Chamomile (loose dried)",      amt:"2 oz bag", unit:"ceremony", where:"Mountain Rose Herbs (mountainroseherbs.com) or any grocery"},
      {n:"Lemon balm (loose dried)",     amt:"2 oz bag", unit:"ceremony", where:"Mountain Rose Herbs (mountainroseherbs.com)"},
      {n:"Lavender (culinary grade, dried)", amt:"1 oz bag", unit:"ceremony", where:"Mountain Rose Herbs or Whole Foods — must be culinary grade"},
      {n:"Raw honey",                    amt:"small jar",unit:"ceremony", where:"Any grocery store"},
    ],
  },
  "Replenishment Tea (Tending)": {
    prep:"Combine rose petals, hibiscus, and raspberry leaf. Steep in hot water 7–10 minutes. Strain. Add honey. Drink slowly during your replenishment session. This is not a functional blend — it is beautiful and it tastes good. That is reason enough.",
    items: [
      {n:"Dried rose petals (culinary grade)", amt:"1 oz bag", unit:"ceremony", where:"Mountain Rose Herbs (mountainroseherbs.com)"},
      {n:"Dried hibiscus",                     amt:"1 oz bag", unit:"ceremony", where:"Mountain Rose Herbs or any Latin grocery"},
      {n:"Raspberry leaf (dried)",             amt:"1 oz bag", unit:"ceremony", where:"Mountain Rose Herbs (mountainroseherbs.com)"},
      {n:"Raw honey",                          amt:"small jar",unit:"ceremony", where:"Any grocery store"},
    ],
  },
  "Keeper's Preparation Tea (Tending)": {
    prep:"Gently crack the cardamom pods. Combine with rose petals. Steep in very hot water 10 minutes — not boiling, just off boil. Strain carefully. Add raw honey only after straining. Sip slowly. This should taste warm and specific — not generic herbal tea. Serve during Stage 6 of the Rite only.",
    items: [
      {n:"Dried rose petals (culinary grade)", amt:"1 tbsp",   unit:"ceremony", where:"Mountain Rose Herbs (mountainroseherbs.com)"},
      {n:"Green cardamom pods",               amt:"small bag", unit:"ceremony", where:"Any grocery with a spice section or Indian grocery"},
      {n:"Raw honey",                         amt:"small jar", unit:"ceremony", where:"Any grocery store"},
    ],
  },
  "Tea Protocol — Fasting Window": {
    prep:"Boil water. Pour over 1 peppermint tea bag or 1 tbsp loose dried peppermint. Steep 5 minutes. Remove bag or strain. Drink plain — no honey during the fast window.",
    items: [
      {n:"Peppermint tea bags or dried peppermint leaves", amt:"1 box or 1 oz", unit:"ceremony", where:"Any grocery store — Traditional Medicinals or Bigelow are fine"},
    ],
  },
  "Tea Protocol — Afternoon": {
    prep:"Green tea: water at 170–180°F, not boiling. Steep 1–2 minutes only — over-steeping makes it bitter. Black tea: boiling water, steep 3–4 minutes. Small splash of milk optional.",
    items: [
      {n:"Green tea bags (or loose leaf)", amt:"1 box", unit:"ceremony", where:"Any grocery store — Bigelow Green Tea or Harney & Sons"},
      {n:"Black tea bags",                 amt:"1 box", unit:"ceremony", where:"Any grocery store — any brand"},
    ],
  },
  "Tea Protocol — Evening Wind-Down": {
    prep:"Ashwagandha: steep 1 bag or 1 tsp powder 5–7 minutes. Add honey and a pinch of cinnamon — it improves the earthy flavor significantly. Chamomile: steep 1–2 bags in boiling water 5 minutes. Any of the three works — choose based on availability.",
    items: [
      {n:"Ashwagandha root powder or tea bags", amt:"1 bag or 2 oz", unit:"ceremony", where:"Whole Foods, Sprouts, Amazon — KSM-66 or Sensoril extract preferred"},
      {n:"Chamomile tea bags or dried chamomile", amt:"1 box or 2 oz", unit:"ceremony", where:"Any grocery store — Traditional Medicinals or Mountain Rose Herbs"},
      {n:"Reishi mushroom powder or prepared tea blend", amt:"1 bag", unit:"ceremony", where:"Amazon, iHerb — Real Mushrooms or Host Defense. Order ahead, not in standard grocery."},
      {n:"Raw honey",      amt:"small jar", unit:"ceremony", where:"Any grocery store"},
      {n:"Cinnamon (ground)", amt:"small jar", unit:"spice",   where:"Any grocery store"},
    ],
  },
  "Tea Protocol — Post-Practice (Lion's Mane)": {
    prep:"Add 1 tsp Lion's Mane powder to 8 oz hot water. Stir thoroughly. Add honey to taste — it has a mild seafood-like flavor that honey cuts well. Drink in the post-practice window when BDNF uptake is highest.",
    items: [
      {n:"Lion's Mane mushroom powder", amt:"100g bag",  unit:"ceremony", where:"Real Mushrooms (realmushrooms.com) — fruiting body only, not mycelium. Amazon also carries it. Order ahead."},
      {n:"Raw honey",                   amt:"small jar", unit:"ceremony", where:"Any grocery store"},
    ],
  },
  "After Being Drained Protocol (Tending)": {
    items: [
      {n:"Lavender essential oil",                       amt:"5–15ml bottle", unit:"ceremony", where:"Plant Therapy (planttherapy.com) — GC/MS tested. Also at Whole Foods, Sprouts, or any health store."},
      {n:"Carrier oil (fractionated coconut or jojoba)", amt:"2 oz",          unit:"ceremony", where:"Any pharmacy, Walmart, or Mountain Rose Herbs — already in cart if Rite supplies were ordered"},
      {n:"Diffuser (ultrasonic, any brand)",             amt:"1",             unit:"ceremony", where:"Amazon — any ultrasonic diffuser under $25 works. URPOWER and InnoGear are reliable. One-time purchase."},
    ],
  },
  "Weekly Solitude Rite (both)": {
    items: [
      {n:"Candle (pillar or taper, unscented)", amt:"1",         unit:"ceremony", where:"Any grocery or home goods store"},
      {n:"Physical paper and pen",              amt:"as needed", unit:"ceremony", where:"Any office supply or drug store — paper must be burnable if burning is performed"},
    ],
  },
};

// Planner item → ceremony supply key map
const PLANNER_CEREMONY_MAP = {
  decl:  null,  // tradition-specific — resolved at render from imp flag
  quiet: "Morning Grounding Tea (Tending)",
  mid:   "Morning Clarity Tea (Imperium)",
  inv:   "Weekly Solitude Rite (both)",
  yours: "Replenishment Tea (Tending)",
};

function Svg({path,size=20,color="currentColor",sw=1.5}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {path.split("|").map((d,i)=><path key={i} d={d}/>)}
  </svg>;
}
const IC = {
  home:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z|M9 22V12h6v10",
  plan:"M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2|M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2|M9 12l2 2 4-4",
  leaf:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z|M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
  more:"M3 6h18|M3 12h18|M3 18h18",
  check:"M20 6L9 17l-5-5",
  lock:"M5 11V7a7 7 0 0 1 14 0v4|M3 11h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  back:"M15 18l-6-6 6-6",
  brain:"M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.16|M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.16",
  heart:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  drop:"M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z",
  bell:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9|M13.73 21a2 2 0 0 1-3.46 0",
  x:"M18 6L6 18|M6 6l12 12",
};

function SigilImp() {
  return <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
    <line x1="4" y1="7" x2="32" y2="29" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="4" y1="7" x2="7" y2="4" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round"/>
    <circle cx="4.5" cy="6" r="1.6" stroke="#c9a84c" strokeWidth="1" fill="none"/>
    <line x1="32" y1="7" x2="4" y2="29" stroke="#c9a84c" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="32" y1="7" x2="29" y2="4" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round"/>
    <circle cx="31.5" cy="6" r="1.6" stroke="#c9a84c" strokeWidth="1" fill="none"/>
    <path d="M18 3C15 7 13 12 13.5 17C14 21 16 23 18 25C20 23 22 21 22.5 17C23 12 21 7 18 3Z" fill="rgba(201,168,76,0.07)" stroke="#c9a84c" strokeWidth="0.9"/>
    <line x1="18" y1="5" x2="18" y2="25" stroke="#c9a84c" strokeWidth="0.5" strokeDasharray="1.5 1.2"/>
    <path d="M16 26.5L18 33L20 26.5" fill="none" stroke="#c9a84c" strokeWidth="0.9" strokeLinecap="round"/>
    <rect x="16.5" y="24.5" width="3" height="2" rx="0.8" fill="#0d5c4a" stroke="#18c48a" strokeWidth="0.5"/>
  </svg>;
}
function SigilTend() {
  return <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
    <path d="M18 31C18 31 5 21.5 5 13.5C5 9.2 8.2 6 12.5 6C15.1 6 17.2 7.5 18 9.2C18.8 7.5 20.9 6 23.5 6C27.8 6 31 9.2 31 13.5C31 21.5 18 31 18 31Z" fill="rgba(196,120,120,0.07)" stroke="#c47878" strokeWidth="1.1"/>
    <path d="M18 28C16 23 13.5 20 13.5 15.5C13.5 13.5 15 12 16.5 12.5C16.5 12.5 18 16 18 19C18 16 19.5 12.5 19.5 12.5C21 12 22.5 13.5 22.5 15.5C22.5 20 20 23 18 28Z" fill="rgba(196,120,120,0.15)" stroke="#c47878" strokeWidth="0.7" strokeLinecap="round"/>
  </svg>;
}

function Toggle({on,col,onChange}) {
  return <button onClick={onChange} style={{width:40,height:22,borderRadius:11,background:on?col:"#2a2a2a",border:"none",cursor:"pointer",position:"relative",flexShrink:0,transition:"background 0.2s"}}>
    <div style={{width:16,height:16,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?21:3,transition:"left 0.2s"}}/>
  </button>;
}

function Checkbox({checked,col,onChange}) {
  return <button onClick={onChange} style={{width:22,height:22,border:`1.5px solid ${checked?col:col+"55"}`,borderRadius:4,background:checked?"rgba(0,0,0,0.3)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all 0.15s"}}>
    {checked && <Svg path={IC.check} size={12} color={col} sw={2.5}/>}
  </button>;
}

// ── MAIN APP ─────────────────────────────────────────────────────
function App() {
  const [prof,setProf]   = useState("IMP");
  const [nav,setNav]     = useState("home");
  const [hub,setHub]     = useState(null);
  const [planTab,setPlanTab] = useState("today");
  const [nourTab,setNourTab] = useState("plan");
  const [moodTab,setMoodTab] = useState("log");
  const [expHome,setExpHome] = useState(null);
  const [done,setDone]   = useState({});
  const [cart,setCart]   = useState({});
  const [hyd,setHyd]     = useState({IMP:64,TEND:72});
  const [toast,setToast] = useState(null);
  const [moodScore,setMoodScore] = useState(6);
  const [moodNote,setMoodNote]   = useState("");
  const [showMood,setShowMood]   = useState(false);
  const [showAlarm,setShowAlarm] = useState(false);
  const [alPhase,setAlPhase]     = useState("ring");
  const [alSecs,setAlSecs]       = useState(300);
  const [showOT,setShowOT]       = useState(false);
  const [otVal,setOtVal]         = useState(null);
  const [sched,setSched]         = useState("rotating_nights");
  const [workDays,setWorkDays]   = useState({Mon:false,Tue:false,Wed:true,Thu:true,Fri:false,Sat:true,Sun:true});
  const [shiftStart,setShiftStart] = useState("18:00");
  const [shiftEnd,setShiftEnd]     = useState("06:00");
  const [calOff,setCalOff]       = useState(0);
  const [selDay,setSelDay]       = useState(null);
  const [events,setEvents]       = useState({"2025-01-16":[{l:"Work — 6PM–6AM",t:"18:00",type:"work"}],"2025-01-20":[{l:"Doctor appt",t:"10:30",type:"personal"}]});
  const [evLabel,setEvLabel]     = useState("");
  const [evTime,setEvTime]       = useState("09:00");
  const [evDate,setEvDate]       = useState("2025-01-14");
  const [expWeek,setExpWeek]     = useState(null);

  // ── TOUR STATE — version-aware, resets on every app update ────
  const [seenVersion,setSeenVersion] = useState(()=>
    typeof window!=="undefined" ? (window.__sovereignTourVersion||null) : null
  );
  const [tourDone,setTourDone] = useState(false);
  const [tourStep,setTourStep] = useState(0);
  // Reset tutorial whenever APP_VERSION changes
  useEffect(()=>{
    if(seenVersion !== APP_VERSION){
      setTourDone(false);
      setTourStep(0);
      if(typeof window!=="undefined") window.__sovereignTourVersion = APP_VERSION;
      setSeenVersion(APP_VERSION);
    }
  },[]);
  const [tourDiet,setTourDiet]   = useState({nutAllergy:false,gbp:false,mthfr:false,gerd:false,gf:false,df:false});
  const [tourSched,setTourSched] = useState(null);
  const [tourDay,setTourDay]     = useState("Sat");
  const [tourTime,setTourTime]   = useState("09:00");
  const [expDay,setExpDay]       = useState(null);

  // ── DIETARY SETTINGS — these filter the meal plan rotation ──
  const [diet,setDiet] = useState({
    nutAllergy: true,   // Holli is allergic to nuts — NF is a HARD FILTER
    gbp:        true,   // GBP on — adds guidance notes, surfaces GBP meals first in swaps
    mthfr:      true,   // MTHFR on — surfaces MTHFR★ meals first in swaps
    gerd:       false,
    glutenFree: false,
    dairyFree:  false,
  });

  const T   = TH[prof];
  const imp = prof === "IMP";
  const hydCur = hyd[prof];
  const hydPct = Math.min(100, Math.round((hydCur/T.hydT)*100));

  // ── Dietary filter: hard filters remove meals, priority filters sort ──
  function mealPassesFilter(tags) {
    if (!tags) return true;
    if (diet.nutAllergy && !tags.includes("NF")) return false;
    if (diet.gerd && !tags.includes("GERD")) return false;
    if (diet.glutenFree && !tags.includes("GF")) return false;
    if (diet.dairyFree && !tags.includes("DF")) return false;
    return true;
  }
  function anyMealBlocked(day) {
    return Object.entries(day.meals).some(([slot,_]) => {
      const tags = day.tags[slot];
      return !mealPassesFilter(tags);
    });
  }

  // ── Sleep window from schedule ──
  function sleepWin() {
    if (!sched) return null;
    const ot = otVal || 0;
    const h = parseInt(shiftEnd.split(":")[0]);
    const today = new Date().toLocaleDateString("en-US",{weekday:"short"}).slice(0,3);
    const working = workDays[today];
    if (!working) return {wd:"9:30 PM",sl:"10:30 PM",wk:"6:30 AM",note:"Rest day"};
    const isNight = parseInt(shiftStart.split(":")[0]) >= 17;
    if (isNight) {
      const s = (h+1+ot)%24;
      const w = (h+8+ot)%24;
      const f = x => `${x===0?12:x>12?x-12:x}:00 ${x<12||x===0?"AM":"PM"}`;
      return {wd:f(s),sl:f(s),wk:f(w),note:ot?"Night shift — overtime adjusts sleep window":"Night shift — darken the room"};
    }
    const wk = parseInt(shiftStart.split(":")[0])-1+ot;
    const sl = wk-8;
    const f = x=>{const n=(x+24)%24;return `${n===0?12:n>12?n-12:n}:00 ${n<12||n===0?"AM":"PM"}`;};
    return {wd:f(sl+1),sl:f(sl),wk:f(wk),note:ot?"Pre-shift — overtime adjusts sleep window":"Pre-shift — full 8 hours"};
  }
  const sw = sleepWin();

  // ── Planner items ──
  // Pull today's meals from WEEK_PLAN — navigate nested {week, days[]} structure
  const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0 … Sun=6
  const todayPlan = (WEEK_PLAN[0].days && WEEK_PLAN[0].days[todayIdx]) || WEEK_PLAN[0].days[0];
  const todayB = todayPlan ? todayPlan.meals.b : "Breakfast";
  const todayL = todayPlan ? todayPlan.meals.l : "Lunch";
  const todayD = todayPlan ? todayPlan.meals.d : "Dinner";

  const ITEMS = imp ? [
    {id:"decl",label:"Morning Declaration",sub:"Stand. Both feet. Speak the Axiom aloud.",time:"Before all else",col:T.gold},
    {id:"b",label:`Breakfast — ${todayB}`,time:"8:00 AM",col:T.cNour},
    {id:"hyd",label:"First 24 oz of water — before coffee",time:"9:00 AM",col:T.cBody},
    {id:"l",label:`Lunch — ${todayL}`,time:"12:30 PM",col:T.cNour},
    {id:"mid",label:"Midday Anchor — 12 minutes, timer, no screen",time:"2:00 PM",col:T.cMind},
    {id:"d",label:`Dinner — ${todayD}`,time:"6:00 PM",col:T.cNour},
    {id:"inv",label:"Evening Inventory — three questions in writing",time:"9:00 PM",col:T.cMind},
  ] : [
    {id:"quiet",label:"Morning Quiet — twenty minutes before anything",time:"Before all else",col:T.cMind},
    {id:"decl",label:"Morning Declaration — speak the Axiom aloud",time:"When ready",col:T.gold},
    {id:"b",label:`Breakfast — ${todayB}`,time:"8:00 AM",col:T.cNour},
    {id:"l",label:`Lunch — ${todayL}`,time:"12:30 PM",col:T.cNour},
    {id:"d",label:`Dinner — ${todayD}`,time:"6:00 PM",col:T.cNour},
    {id:"yours",label:"Replenishment Session — two hours, once this week",time:"This week",col:T.cSoul},
    {id:"inv",label:"Evening Inventory — two questions in writing",time:"Before sleep",col:T.cMind},
  ];
  if (sw) ITEMS.push({id:"bed",label:`Bedtime — wind down ${sw.wd}, sleep by ${sw.sl}`,sub:`Wake: ${sw.wk} · ${sw.note}`,time:sw.wd,col:"#4a6a9a"});
  const done_count = ITEMS.filter(it=>done[it.id]).length;

  // Hydration history / plan history for charts
  const hydHist = [68,72,80,64,90,100,hydCur];
  const planHist = [5,7,7,4,6,7,done_count];
  const moodHist = [7,4,8,3,6,9,moodScore];
  const days7 = ["M","T","W","T","F","S","S"];

  function showT(m){setToast(m);setTimeout(()=>setToast(null),2000);}

  function addIngredient(ing) {
    const k = ing.n.toLowerCase().trim();
    setCart(prev => {
      if (prev[k]) {
        return {...prev, [k]: {...prev[k], count: prev[k].count + 1}};
      }
      return {...prev, [k]: {name:ing.n, amt:ing.amt, unit:ing.unit||"pantry", where:ing.where||null, count:1, checked:false}};
    });
    showT("+ " + ing.n);
  }

  function addCeremonySupplies(ceremonyKey) {
    const entry = CEREMONY_SUPPLIES[ceremonyKey];
    if (!entry) return;
    entry.items.forEach(item => addIngredient({...item}));
    showT("Ceremony supplies added");
  }

  function addAllIngredients(mealName) {
    const rec = RECIPES[mealName];
    if (!rec) { showT("No recipe data"); return; }
    rec.ing.forEach(ing => addIngredient(ing));
    showT("All ingredients added");
  }

  function removeCartItem(k) {
    setCart(prev => { const n={...prev}; delete n[k]; return n; });
  }
  function goNav(k){setNav(k);setHub(null);setShowMood(false);setShowOT(false);}

  // Calendar helpers
  function buildCal(){
    const now=new Date(2025,calOff,1);
    const y=now.getFullYear(),m=now.getMonth();
    const first=new Date(y,m,1).getDay();
    const days=new Date(y,m+1,0).getDate();
    const name=["January","February","March","April","May","June","July","August","September","October","November","December"][m];
    return {y,m,first,days,name};
  }
  const cal=buildCal();

  useEffect(()=>{
    if(alPhase!=="awake")return;
    if(alSecs<=0){setAlPhase("ring");setAlSecs(300);return;}
    const t=setInterval(()=>setAlSecs(s=>s-1),1000);
    return()=>clearInterval(t);
  },[alPhase,alSecs]);

  const NAV=[
    {k:"home",ic:IC.home,l:"Home",col:T.gold},
    {k:"planner",ic:IC.plan,l:"Planner",col:T.cPlan},
    {k:"nourish",ic:IC.leaf,l:"Nourish",col:T.cNour},
    {k:"more",ic:IC.more,l:"More",col:T.cMore},
  ];

  // ── GUIDED TOUR ──────────────────────────────────────────────
  const IMP_STEPS = [
    {
      key:"welcome",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",textAlign:"center"}}>
          {imp?<SigilImp/>:<SigilTend/>}
          <div style={{fontFamily:COR,fontSize:28,color:T.gold,letterSpacing:"0.16em",textTransform:"uppercase",marginTop:20,marginBottom:10}}>{T.name}</div>
          <div style={{fontFamily:COR,fontSize:18,color:T.text,letterSpacing:"0.1em",marginBottom:20}}>You are {T.epithet}.</div>
          <div style={{fontSize:13,color:T.t2,lineHeight:1.8}}>
            {imp?"This app is your operating system. Not a habit tracker. Not a wellness app. An architecture for a specific kind of mind."
               :"This app tends what matters. Including you. Built around the way you already give — and what you need in return."}
          </div>
        </div>
      )
    },
    {
      key:"planner",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:16}}>📋</div>
          <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:14}}>Your Daily Planner</div>
          <div style={{fontSize:13,color:T.t2,lineHeight:1.9,textAlign:"left"}}>
            {["Your shift status","Morning declaration","Today's quote","Sleep window","Meals from your plan","Hydration tracker"].map((item,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:6}}>
                <span style={{color:T.gold}}>→</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div style={{fontSize:12,color:T.t3,marginTop:12,fontStyle:"italic"}}>One screen. The whole day.</div>
        </div>
      )
    },
    {
      key:"schedule",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 20px"}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:40,marginBottom:12}}>🗓</div>
            <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:10}}>Your Work Schedule</div>
            <div style={{fontSize:13,color:T.t2,lineHeight:1.8}}>The planner builds your sleep window from your shifts. Set it once — it handles the rest. We don't assume anything.</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {[["rotating_223","2-2-3 Rotating — law enforcement"],["rotating_nights","Rotating 12hr Nights"],["rotating_days","Rotating 12hr Days"],["rotating_mixed","Mixed Days & Nights"],["fixed_days","Fixed Days"],["variable","Mark each day manually"]].map(([k,l])=>(
              <button key={k} onClick={()=>setTourSched(k)} style={{padding:"9px 12px",background:tourSched===k?`rgba(${imp?"201,168,76":"196,120,120"},0.1)`:T.s2,border:`1px solid ${tourSched===k?T.gold:T.b1}`,borderRadius:5,color:tourSched===k?T.gold:T.t2,fontSize:12,textAlign:"left",cursor:"pointer"}}>{l}</button>
            ))}
          </div>
        </div>
      )
    },
    {
      key:"alarm",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:16}}>🔔</div>
          <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:14}}>The Alarm Is Loud</div>
          <div style={{fontSize:14,color:T.text,fontStyle:"italic",marginBottom:20}}>It will wake you.</div>
          <div style={{fontSize:13,color:T.t2,lineHeight:1.9,textAlign:"left"}}>
            {[["Volume buttons","don't stop it"],["SNOOZE","comes back in 9 minutes"],["DISMISS","stops it, but we check back"],["I'M UP","confirms awake, opens your day"]].map(([label,desc],i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                <span style={{color:T.gold,minWidth:80,fontWeight:700,fontSize:12}}>{label}</span>
                <span style={{color:T.t3,fontSize:12}}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      key:"dietary",
      render:()=>(
        <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8}}>Dietary Settings</div>
            <div style={{fontSize:12,color:T.t3,lineHeight:1.6}}>This filters the meal plan. Hard filters remove meals. Priority filters sort them.</div>
          </div>
          <div style={{fontSize:9,color:"#c07040",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>HARD FILTERS — removes meals</div>
          {[["nutAllergy","Nut Allergy","#c07040"],["gerd","GERD","#c07040"],["gf","Gluten-Free","#c07040"],["df","Dairy-Free","#c07040"]].map(([k,l,col])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.b1}`}}>
              <span style={{fontSize:13,color:T.t2}}>{l}</span>
              <Toggle on={tourDiet[k]} col={col} onChange={()=>setTourDiet(p=>({...p,[k]:!p[k]}))}/>
            </div>
          ))}
          <div style={{fontSize:9,color:T.teal,letterSpacing:"0.12em",textTransform:"uppercase",margin:"12px 0 8px"}}>PRIORITY — surfaces best matches first</div>
          {[["gbp","GBP (Gastric Bypass)",T.teal],["mthfr","MTHFR",T.teal]].map(([k,l,col])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.b1}`}}>
              <span style={{fontSize:13,color:T.t2}}>{l}</span>
              <Toggle on={tourDiet[k]} col={col} onChange={()=>setTourDiet(p=>({...p,[k]:!p[k]}))}/>
            </div>
          ))}
          <div style={{fontSize:10,color:T.t3,marginTop:12,lineHeight:1.6}}>Changeable anytime in Nourish → Dietary Settings</div>
        </div>
      )
    },
    ...(imp?[]:[{
      key:"replenishment",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 20px"}}>
          <div style={{textAlign:"center",marginBottom:18}}>
            <div style={{fontSize:36,marginBottom:12}}>🌿</div>
            <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:10}}>Your Replenishment Session</div>
            <div style={{fontSize:13,color:T.t2,lineHeight:1.8}}>Once per week. Two hours. Yours. Schedule it now so it repeats automatically and shows as protected time.</div>
          </div>
          <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Day of week</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:14}}>
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
              <button key={d} onClick={()=>setTourDay(d)} style={{flex:1,padding:"8px 4px",background:tourDay===d?`rgba(196,120,120,0.1)`:T.s2,border:`1px solid ${tourDay===d?T.gold:T.b1}`,borderRadius:4,color:tourDay===d?T.gold:T.t3,fontSize:10,cursor:"pointer",textAlign:"center"}}>{d}</button>
            ))}
          </div>
          <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Start time</div>
          <input type="time" value={tourTime} onChange={e=>setTourTime(e.target.value)} style={{width:"100%",background:T.s2,border:`1px solid ${T.b1}`,borderRadius:5,padding:"10px",color:T.text,fontSize:16,fontFamily:COR,outline:"none",marginBottom:14}}/>
          <div style={{background:`rgba(${imp?"201,168,76":"196,120,120"},0.06)`,border:`1px solid ${T.gold}33`,borderRadius:6,padding:"9px 12px",fontSize:11,color:T.t2,lineHeight:1.6,marginBottom:4}}>
            Creates a recurring calendar event every {tourDay} at {tourTime.split(":")[0]>12?parseInt(tourTime.split(":")[0])-12:tourTime.split(":")[0]}:{tourTime.split(":")[1]} {tourTime.split(":")[0]>=12?"PM":"AM"} · Protected on shared calendar · Garrin sees it blocked
          </div>
        </div>
      )
    }]),
    {
      key:"mood",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:16}}>💬</div>
          <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:14}}>
            {imp?"You and Holli":"You and Garrin"}
          </div>
          <div style={{fontSize:13,color:T.t2,lineHeight:1.9}}>
            {["Your mood log is private.","Your raw words never leave this phone.","When you choose to share:"].map((line,i)=><div key={i}>{line}</div>)}
          </div>
          <div style={{marginTop:16,fontSize:13,color:T.t2,textAlign:"left",lineHeight:1.9}}>
            {[
              imp?"Your entry is translated into her language":"Your entry is translated into his language",
              imp?"She sees a tone, not a number":"He sees a tone, not a number",
              "You see theirs the same way",
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:6}}>
                <span style={{color:T.gold}}>→</span><span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      key:"locked",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",textAlign:"center"}}>
          <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:20}}>The Forge Opens Slowly</div>
          <div style={{fontSize:13,color:T.t2,lineHeight:1.8,marginBottom:20}}>This app grows with you. Each phase unlocks after the previous one is stable. Not paywalled — staged.</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}>
            {[
              {label:imp?"Warrior Practice":"Keep Yourself",phase:"Phase 2",day:"Day 7"},
              {label:"Doctrine",phase:"Phase 3",day:"Day 14"},
              {label:"Holy Days & Household",phase:"Phase 4",day:"Day 30"},
              {label:imp?"Vel'nar & The Book":"The Book & The Rite",phase:"Phase 5",day:"Day 30"},
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:T.s1,border:`1px solid ${T.b1}`,borderRadius:7,padding:"10px 14px"}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{color:T.t3,fontSize:16}}>🔒</span>
                  <span style={{fontSize:13,color:T.t3}}>{item.label}</span>
                </div>
                <span style={{fontSize:9,color:T.gold,letterSpacing:"0.06em"}}>{item.day}</span>
              </div>
            ))}
          </div>
          <div style={{fontSize:12,color:T.t3,marginTop:16,fontStyle:"italic"}}>Build the foundation first. Everything else is waiting.</div>
        </div>
      )
    },
    {
      key:"invite",
      render:()=>{
        const hhCode = imp ? "IMP-284" : "TEND-751";
        const ghLink = "https://xpliciton3.github.io/Imperium";
        const fullMsg = `Join my household on ${imp?"The Imperium":"The Tending"}:\nDownload: ${ghLink}\nHousehold code: ${hhCode}`;
        return (
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>🏠</div>
            <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:10}}>Invite Your Household</div>
            <div style={{fontSize:12,color:T.t2,lineHeight:1.8,marginBottom:18}}>
              {imp
                ?"The Imperium syncs with your partner. Your planner. Their planner. One household. Send Holli the link and code."
                :"The Tending was built for someone who gives a lot. Let your household show up for you too. Send Garrin the link and code."}
            </div>
            <div style={{background:T.s2,border:`1px solid ${T.b2}`,borderRadius:8,padding:"14px 18px",width:"100%",marginBottom:14}}>
              <div style={{fontSize:8,color:T.t3,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:6}}>Household Code</div>
              <div style={{fontFamily:COR,fontSize:30,color:T.gold,letterSpacing:"0.24em",marginBottom:10}}>{hhCode}</div>
              <div style={{fontSize:8,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>Download Link</div>
              <div style={{fontSize:11,color:T.t2,wordBreak:"break-all",lineHeight:1.5}}>{ghLink}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}>
              <button onClick={()=>{
                if(navigator.share){navigator.share({title:`Join ${imp?"The Imperium":"The Tending"}`,text:fullMsg,url:ghLink}).catch(()=>{});}
                else if(navigator.clipboard){navigator.clipboard.writeText(fullMsg);alert("Copied — paste it to your partner.");}
              }} style={{width:"100%",padding:"11px 0",background:T.gold,border:"none",color:"#000",fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",cursor:"pointer",borderRadius:5,fontWeight:700}}>Share Link + Code</button>
              <button onClick={()=>{if(navigator.clipboard){navigator.clipboard.writeText(fullMsg);alert("Copied to clipboard.");}}}
                style={{width:"100%",padding:"9px 0",background:"transparent",border:`1px solid ${T.b2}`,color:T.t2,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",borderRadius:5}}>Copy to Clipboard</button>
              <button onClick={()=>setTourStep(s=>s+1)}
                style={{background:"transparent",border:"none",color:T.t3,fontSize:10,cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase"}}>Set up later →</button>
            </div>
          </div>
        );
      }
    },
    {
      key:"groq",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 22px"}}>
          <div style={{textAlign:"center",marginBottom:18}}>
            <div style={{fontSize:34,marginBottom:10}}>🤖</div>
            <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:10}}>Groq API Key</div>
            <div style={{fontSize:12,color:T.t2,lineHeight:1.8}}>The AI features — mood translation, daily quotes, smart planning — run on Groq. Free. No credit card required. 14,400 requests per day.</div>
          </div>
          <div style={{background:T.s2,border:`1px solid ${T.b2}`,borderRadius:8,padding:"14px 16px",marginBottom:14}}>
            <div style={{fontSize:8,color:T.t3,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:10}}>How to get your free key</div>
            {[
              "Go to console.groq.com",
              "Sign up — email only, no payment",
              'Click "API Keys" in the left sidebar',
              'Click "Create API Key"',
              "Copy the key — it starts with gsk_",
              "Paste it in Settings → API Keys after setup",
            ].map((step,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"5px 0",borderBottom:`1px solid ${T.b1}22`}}>
                <span style={{color:T.gold,fontSize:10,fontWeight:"bold",minWidth:16,flexShrink:0}}>{i+1}.</span>
                <span style={{fontSize:12,color:T.t2}}>{step}</span>
              </div>
            ))}
          </div>
          <div style={{background:`rgba(${imp?"201,168,76":"196,120,120"},0.06)`,border:`1px solid ${T.gold}33`,borderRadius:6,padding:"10px 14px"}}>
            <div style={{fontSize:10,color:T.t3,lineHeight:1.7}}>Without a Groq key the app still works — quotes use the built-in fallback bank and mood uses preset translations. You can add the key any time in Settings.</div>
          </div>
        </div>
      )
    },
    {
      key:"firebase",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 22px"}}>
          <div style={{textAlign:"center",marginBottom:18}}>
            <div style={{fontSize:34,marginBottom:10}}>🔥</div>
            <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:10}}>Firebase Sync</div>
            <div style={{fontSize:12,color:T.t2,lineHeight:1.8}}>Firebase keeps your household in sync — mood, grocery cart, planner. Free Spark plan. No credit card.</div>
          </div>
          <div style={{background:T.s2,border:`1px solid ${T.b2}`,borderRadius:8,padding:"14px 16px",marginBottom:14}}>
            <div style={{fontSize:8,color:T.t3,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:10}}>One-time setup (5 minutes)</div>
            {[
              "Go to console.firebase.google.com",
              "Sign in with Google → Add Project",
              'Name it "SovereignWorks" → Continue',
              "Build → Realtime Database → Create database",
              'Choose "Start in test mode" → Enable',
              "Project Settings → Your apps → Web app (</>)",
              "Copy the firebaseConfig object",
              "Paste it in Settings → Firebase Config",
            ].map((step,i)=>(
              <div key={i} style={{display:"flex",gap:10,padding:"5px 0",borderBottom:`1px solid ${T.b1}22`}}>
                <span style={{color:T.gold,fontSize:10,fontWeight:"bold",minWidth:16,flexShrink:0}}>{i+1}.</span>
                <span style={{fontSize:12,color:T.t2,lineHeight:1.5}}>{step}</span>
              </div>
            ))}
          </div>
          <div style={{background:`rgba(${imp?"201,168,76":"196,120,120"},0.06)`,border:`1px solid ${T.gold}33`,borderRadius:6,padding:"10px 14px"}}>
            <div style={{fontSize:10,color:T.t3,lineHeight:1.7}}>Without Firebase the app works fully — everything saves locally. Firebase only adds the household sync layer. You can set it up any time in Settings.</div>
          </div>
        </div>
      )
    },
    {
      key:"notifications",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 22px"}}>
          <div style={{textAlign:"center",marginBottom:18}}>
            <div style={{fontSize:34,marginBottom:10}}>🔔</div>
            <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:10}}>Notifications & Alarms</div>
            <div style={{fontSize:12,color:T.t2,lineHeight:1.8}}>The app will ask for notification permission. This powers the alarm system, hydration reminders, and batch cook alerts.</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%",marginBottom:16}}>
            {[
              {icon:"⏰",label:"Alarms",desc:"Full-screen over lock screen. Native Android."},
              {icon:"💧",label:"Hydration reminders",desc:"Configurable intervals. Off duty and on duty differ."},
              {icon:"🍳",label:"Batch cook alerts",desc:"Night before a prep day: what to start tonight."},
              {icon:"🌙",label:"Sleep window",desc:"Wind-down notification at your scheduled bedtime."},
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",background:T.s2,border:`1px solid ${T.b1}`,borderRadius:7,padding:"10px 14px"}}>
                <span style={{fontSize:20,flexShrink:0}}>{item.icon}</span>
                <div>
                  <div style={{fontSize:12,color:T.text,marginBottom:2}}>{item.label}</div>
                  <div style={{fontSize:10,color:T.t3,lineHeight:1.5}}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,color:T.t3,textAlign:"center",fontStyle:"italic"}}>When Android asks for permission — allow it. The app cannot function as an alarm without it.</div>
        </div>
      )
    },
    {
      key:"settings_tour",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 22px"}}>
          <div style={{textAlign:"center",marginBottom:18}}>
            <div style={{fontSize:34,marginBottom:10}}>⚙️</div>
            <div style={{fontFamily:COR,fontSize:22,color:T.gold,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:10}}>Settings Overview</div>
            <div style={{fontSize:12,color:T.t2,lineHeight:1.8}}>Everything you just set up lives here. You can return any time.</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6,width:"100%"}}>
            {[
              {label:"API Keys",desc:"Groq key for AI features",icon:"🔑"},
              {label:"Firebase Config",desc:"Paste your firebaseConfig object here",icon:"🔥"},
              {label:"Household",desc:"Your code, partner's code, sync status",icon:"🏠"},
              {label:"Work Schedule",desc:"Shift type, start/end times, overtime rules",icon:"📅"},
              {label:"Dietary Filters",desc:"Nut allergy, GERD, gluten-free, dairy-free",icon:"🥗"},
              {label:"Hydration Targets",desc:"Daily oz goal by shift type",icon:"💧"},
              {label:"Notifications",desc:"Which alerts fire and when",icon:"🔔"},
              {label:"Reset Tutorial",desc:"Re-runs this setup from the beginning",icon:"🔄"},
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"center",background:T.s2,border:`1px solid ${T.b1}`,borderRadius:6,padding:"8px 12px"}}>
                <span style={{fontSize:16,flexShrink:0}}>{item.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,color:T.text}}>{item.label}</div>
                  <div style={{fontSize:10,color:T.t3}}>{item.desc}</div>
                </div>
                <span style={{fontSize:10,color:T.gold}}>→</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      key:"begin",
      render:()=>(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",textAlign:"center"}}>
          {imp?<SigilImp/>:<SigilTend/>}
          <div style={{fontFamily:COR,fontSize:18,color:T.gold,letterSpacing:"0.18em",textTransform:"uppercase",lineHeight:1.9,marginTop:24,whiteSpace:"pre-line"}}>{T.axiom}</div>
        </div>
      )
    },
  ];

  if (!tourDone) {
    const steps = IMP_STEPS;
    const step = steps[tourStep] || steps[steps.length-1];
    const isLast = tourStep >= steps.length - 1;
    return (
      <div style={{minHeight:"100vh",background:"#050505",display:"flex",flexDirection:"column",alignItems:"center",padding:"14px 12px 48px",fontFamily:JOS}}>
        <style>{`@import url('${FONT}');*{box-sizing:border-box}::-webkit-scrollbar{display:none}button{font-family:${JOS}}`}</style>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {["IMP","TEND"].map(p=>{const col=TH[p].gold;return <button key={p} onClick={()=>{setProf(p);setTourStep(0);}} style={{padding:"7px 18px",background:prof===p?`rgba(${p==="IMP"?"201,168,76":"196,120,120"},0.1)`:"transparent",border:`1px solid ${prof===p?col:"#2a2a2a"}`,color:prof===p?col:"#444",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",cursor:"pointer",borderRadius:4}}>{TH[p].person}</button>;})}
        </div>
        <div style={{width:370,height:740,background:T.bg,borderRadius:46,border:"9px solid #181818",boxShadow:"0 0 0 1.5px #2a2a2a,0 40px 80px rgba(0,0,0,0.9)",display:"flex",flexDirection:"column",overflow:"hidden",color:T.text}}>
          {/* Tour header */}
          <div style={{height:52,background:imp?"#000":T.s1,borderBottom:`1px solid ${T.b1}`,display:"flex",alignItems:"center",padding:"0 16px",justifyContent:"space-between",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {imp?<SigilImp/>:<SigilTend/>}
              <span style={{fontSize:9,color:T.t3,letterSpacing:"0.14em",textTransform:"uppercase"}}>Setup</span>
            </div>
            <button onClick={()=>{setSched(tourSched||"rotating_nights");setTourDone(true);}} style={{background:"transparent",border:"none",color:T.t3,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer"}}>Skip Tour</button>
          </div>

          {/* Tour content */}
          <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
            {step.render()}
          </div>

          {/* Progress dots + nav */}
          <div style={{padding:"12px 20px 20px",background:imp?"#000":T.s1,borderTop:`1px solid ${T.b1}`,flexShrink:0}}>
            <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:14}}>
              {steps.map((_,i)=><div key={i} style={{width:i===tourStep?18:6,height:6,borderRadius:3,background:i===tourStep?T.gold:T.b2,transition:"all 0.2s"}}/>)}
            </div>
            <div style={{display:"flex",gap:10}}>
              {tourStep>0&&<button onClick={()=>setTourStep(s=>s-1)} style={{flex:1,padding:"12px 0",background:"transparent",border:`1px solid ${T.b1}`,color:T.t3,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",borderRadius:5}}>← Back</button>}
              <button onClick={()=>{if(isLast){setSched(tourSched||"rotating_nights");setTourDone(true);}else{setTourStep(s=>s+1);}}} style={{flex:2,padding:"12px 0",background:isLast?T.teal:T.gold,border:"none",color:isLast?imp?"#000":"#fff":"#000",fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",cursor:"pointer",borderRadius:5,fontWeight:700}}>
                {isLast?`Begin >`:`Next →`}
              </button>
            </div>
          </div>
        </div>
        <div style={{marginTop:12,fontFamily:JOS,fontSize:8.5,color:"#333",letterSpacing:"0.2em",textTransform:"uppercase",textAlign:"center"}}>
          First-open guided tour · Profile toggle switches tradition
        </div>
      </div>
    );
  }

  // ── ALARM SCREEN ─────────────────────────────────────────────

  if(showAlarm) return (
    <div style={{minHeight:"100vh",background:"#050505",display:"flex",flexDirection:"column",alignItems:"center",padding:"14px 12px 48px",fontFamily:JOS}}>
      <style>{`@import url('${FONT}');*{box-sizing:border-box}button{font-family:${JOS}}`}</style>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {["IMP","TEND"].map(p=><button key={p} onClick={()=>setProf(p)} style={{padding:"6px 14px",background:prof===p?`rgba(${p==="IMP"?"201,168,76":"196,120,120"},0.1)`:"transparent",border:`1px solid ${prof===p?TH[p].gold:"#2a2a2a"}`,color:prof===p?TH[p].gold:"#444",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",cursor:"pointer",borderRadius:4}}>{TH[p].person}</button>)}
      </div>
      <div style={{width:370,height:740,background:alPhase==="ring"?"#000":T.bg,borderRadius:46,border:"9px solid #181818",boxShadow:"0 0 0 1.5px #2a2a2a,0 40px 80px rgba(0,0,0,0.9)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",padding:"40px 28px"}}>
        <button onClick={()=>{setShowAlarm(false);setAlPhase("ring");setAlSecs(300);}} style={{position:"absolute",top:20,right:20,background:"transparent",border:"none",color:"#444",cursor:"pointer",fontSize:22,lineHeight:1}}>x</button>
        {alPhase==="ring"?(<>
          <div style={{fontFamily:COR,fontSize:74,fontWeight:300,color:"#fff",lineHeight:1,marginBottom:6,letterSpacing:"-2px"}}>5:30</div>
          <div style={{fontSize:9,color:"#444",letterSpacing:"0.22em",textTransform:"uppercase",marginBottom:6}}>Wednesday, January 14</div>
          <div style={{fontSize:11,color:T.gold,letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:52}}>{imp?"The system begins now":"Your day begins with you"}</div>
          <div style={{width:"82%",display:"flex",flexDirection:"column",gap:12}}>
            <button style={{width:"100%",padding:"16px 0",background:"transparent",border:`1px solid ${T.gold}`,color:T.gold,fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",cursor:"pointer",borderRadius:5}}>SNOOZE (9 min)</button>
            <button onClick={()=>setAlPhase("awake")} style={{width:"100%",padding:"16px 0",background:"transparent",border:"1px solid #262626",color:"#555",fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",cursor:"pointer",borderRadius:5}}>DISMISS</button>
            <button onClick={()=>{setShowAlarm(false);setAlPhase("ring");}} style={{background:"transparent",border:"none",color:T.text,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",padding:"10px 0"}}>I'M UP</button>
          </div>
        </>):(<>
          <div style={{fontSize:9,color:"#444",letterSpacing:"0.22em",textTransform:"uppercase",marginBottom:18}}>Are you awake?</div>
          <div style={{fontFamily:COR,fontSize:40,color:T.text,lineHeight:1,marginBottom:8,textAlign:"center"}}>{imp?"Still here?":"Still with us?"}</div>
          <div style={{fontSize:12,color:T.t3,textAlign:"center",lineHeight:1.7,marginBottom:32}}>You dismissed your alarm.<br/>Locks in {String(Math.floor(alSecs/60)).padStart(2,"0")}:{String(alSecs%60).padStart(2,"0")}</div>
          <div style={{width:"78%",height:3,background:T.b2,borderRadius:2,marginBottom:8,overflow:"hidden"}}>
            <div style={{width:`${(alSecs/300)*100}%`,height:"100%",background:T.teal,transition:"width 1s linear"}}/>
          </div>
          <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:28}}>Haptic pulse every 60 seconds</div>
          <div style={{fontFamily:"monospace",fontSize:28,color:T.teal,marginBottom:36}}>{String(Math.floor(alSecs/60)).padStart(2,"0")}:{String(alSecs%60).padStart(2,"0")}</div>
          <button onClick={()=>{setShowAlarm(false);setAlPhase("ring");}} style={{width:"78%",padding:"17px 0",background:T.teal,border:"none",color:imp?"#000":"#fff",fontSize:12,letterSpacing:"0.16em",textTransform:"uppercase",cursor:"pointer",borderRadius:5,fontWeight:700}}>
            {"I'M AWAKE"}{imp?"":" ♡"}
          </button>
        </>)}
      </div>
    </div>
  );

  // ── MAIN PHONE ────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",background:"#050505",display:"flex",flexDirection:"column",alignItems:"center",padding:"14px 12px 48px",fontFamily:JOS}}>
      <style>{`@import url('${FONT}');*{box-sizing:border-box}::-webkit-scrollbar{display:none}button{font-family:${JOS}}`}</style>

      {/* Profile toggle */}
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {["IMP","TEND"].map(p=>{
          const col=TH[p].gold;
          return <button key={p} onClick={()=>{setProf(p);setNav("home");setHub(null);setDone({});setPlanTab("today");}} style={{padding:"7px 18px",background:prof===p?`rgba(${p==="IMP"?"201,168,76":"196,120,120"},0.1)`:"transparent",border:`1px solid ${prof===p?col:"#2a2a2a"}`,color:prof===p?col:"#444",fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",cursor:"pointer",borderRadius:4}}>{TH[p].person} / {p==="IMP"?"Imperium":"Tending"}</button>;
        })}
      </div>

      {/* Phone */}
      <div style={{width:370,height:740,background:T.bg,borderRadius:46,border:"9px solid #181818",boxShadow:"0 0 0 1.5px #2a2a2a,0 40px 80px rgba(0,0,0,0.9)",display:"flex",flexDirection:"column",overflow:"hidden",color:T.text,position:"relative"}}>

        {/* HEADER */}
        <div style={{height:52,background:imp?"#000":T.s1,borderBottom:`1px solid ${T.b1}`,display:"flex",alignItems:"center",padding:"0 13px",gap:9,flexShrink:0}}>
          {imp?<SigilImp/>:<SigilTend/>}
          <div>
            <div style={{fontSize:10,fontWeight:200,color:T.text,letterSpacing:"0.28em",textTransform:"uppercase"}}>{T.name}</div>
            <div style={{fontSize:7,color:T.t3,letterSpacing:"0.2em",textTransform:"uppercase"}}>{T.sub}</div>
          </div>
          <div style={{marginLeft:"auto"}}>
            <div style={{fontSize:7,padding:"2px 8px",border:`1px solid ${T.goldDim}`,borderRadius:3,color:T.gold,background:T.glow,letterSpacing:"0.18em",textTransform:"uppercase"}}>PRE-RITE</div>
          </div>
        </div>

        {/* MOOD MODAL */}
        {showMood&&(
          <div style={{position:"absolute",inset:0,zIndex:50,background:"rgba(0,0,0,0.93)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{background:imp?"#000":T.s1,borderBottom:`1px solid ${T.b1}`,padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
              <div style={{fontFamily:COR,fontSize:20,color:T.text,letterSpacing:"0.12em",textTransform:"uppercase"}}>Mood Journal</div>
              <button onClick={()=>setShowMood(false)} style={{background:"transparent",border:"none",color:T.t3,cursor:"pointer",fontSize:22,lineHeight:1}}>x</button>
            </div>
            <div style={{background:imp?"#000":T.s1,borderBottom:`1px solid ${T.b1}`,display:"flex",flexShrink:0}}>
              {[["log","My Log"],["partner",T.partnerName],["history","History"]].map(([k,l])=>(
                <button key={k} onClick={()=>setMoodTab(k)} style={{flex:1,padding:"9px 4px",background:"none",border:"none",borderBottom:`2px solid ${moodTab===k?T.cMind:"transparent"}`,color:moodTab===k?T.cMind:T.t3,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer"}}>{l}</button>
              ))}
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
              {moodTab==="log"&&(<>
                <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Private — raw entry never leaves this device</div>
                <div style={{display:"flex",gap:2,marginBottom:8,justifyContent:"space-between"}}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n=>(
                    <button key={n} onClick={()=>setMoodScore(n)} style={{flex:1,height:30,borderRadius:4,background:moodScore===n?T.teal:T.s3,border:`1px solid ${moodScore===n?T.teal:T.b1}`,color:moodScore===n?imp?"#000":"#fff":T.t3,fontSize:10,cursor:"pointer"}}>{n}</button>
                  ))}
                </div>
                <div style={{height:5,background:T.s3,borderRadius:3,marginBottom:8,overflow:"hidden"}}>
                  <div style={{width:`${moodScore*10}%`,height:"100%",background:moodScore<=3?"#9a4040":moodScore<=6?T.t2:T.teal,borderRadius:3,transition:"width 0.3s"}}/>
                </div>
                <div style={{background:T.s2,borderRadius:6,padding:"8px 12px",marginBottom:10,fontSize:12,color:T.t2,textAlign:"center",fontStyle:"italic"}}>
                  {moodScore<=2?"Depleted. Heavy. Not okay.":moodScore<=4?"Hard day. Running low.":moodScore<=6?"Managing. Present. Holding.":moodScore<=8?"Solid. Good capacity.":"Exceptional. Resourced and clear."}
                </div>
                <textarea value={moodNote} onChange={e=>setMoodNote(e.target.value)} placeholder="What's happening? (private — never shared raw)" style={{width:"100%",background:T.s3,border:`1px solid ${T.b1}`,borderRadius:6,padding:"10px",color:T.text,fontSize:13,resize:"none",height:72,fontFamily:JOS,outline:"none",marginBottom:10}}/>
                <div style={{background:T.s1,border:`1px solid ${T.cMind}55`,borderRadius:8,padding:"10px 12px",marginBottom:12}}>
                  <div style={{fontSize:8.5,color:T.cMind,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>Auto-Translation — what {T.partnerName} will see</div>
                  <div style={{fontSize:13,color:T.text,lineHeight:1.7,fontStyle:"italic",marginBottom:6}}>
                    {moodScore<=2?(imp?"He's carrying something heavy today. No demands tonight. Just be near.":"She's in a hard place today. No processing. Presence only.")
                    :moodScore<=4?(imp?"He's running low today. A quiet evening without expectations is what helps.":"She's depleted today. Keep things low-key. Check in gently.")
                    :moodScore<=6?(imp?"He's managing today. Moderate load. A calm evening is welcome.":"She's holding steady. Present. A check-in is welcome.")
                    :moodScore<=8?(imp?"He's solid today. Good capacity. Connection and conversation are welcome.":"She's doing well. She'd welcome real time together.")
                    :(imp?"He's exceptional today. Clear, resourced. Great night for connection.":"She's at full capacity. Wonderful day. She'd love to connect.")}
                  </div>
                  <div style={{display:"flex",gap:4}}>
                    {[1,2,3,4,5].map(d=><div key={d} style={{width:10,height:10,borderRadius:"50%",background:d<=Math.round(moodScore/2)?T.teal:T.s3,border:`1px solid ${T.b2}`}}/>)}
                  </div>
                  <div style={{fontSize:8.5,color:T.t3,marginTop:5}}>Dot score only · {imp?"INTJ→ESFJ":"ESFJ→INTJ"} · Raw number not shared</div>
                </div>
                <button onClick={()=>{showT("Shared with "+T.partnerName);setShowMood(false);setMoodNote("");}} style={{width:"100%",padding:"11px 0",background:T.teal,border:"none",color:imp?"#000":"#fff",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",borderRadius:5,fontWeight:700}}>Share Translation with {T.partnerName} →</button>
                <div style={{fontSize:8.5,color:T.t3,marginTop:6,textAlign:"center"}}>Translation is automatic · Raw entry stays on this device</div>
              </>)}
              {moodTab==="partner"&&(<>
                <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Translated into your register · shared by {T.partnerName}</div>
                <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"14px",marginBottom:10}}>
                  <div style={{fontSize:8.5,color:T.t3,marginBottom:8}}>Today's State</div>
                  <div style={{display:"flex",gap:5,marginBottom:10}}>
                    {[1,2,3,4,5].map(d=><div key={d} style={{width:14,height:14,borderRadius:"50%",background:d<=4?T.teal:T.s3,border:`1px solid ${T.b2}`}}/>)}
                  </div>
                  <div style={{fontFamily:COR,fontSize:15,color:T.text,fontStyle:"italic",lineHeight:1.75,marginBottom:10}}>{imp?"She's steady today. The shift was manageable. She'd welcome a quiet evening in. Keep it low-key.":"He's solid today. Good day. Real conversation is welcome tonight."}</div>
                  <div style={{background:T.s2,borderLeft:`3px solid ${T.teal}`,borderRadius:"0 5px 5px 0",padding:"9px 12px"}}>
                    <div style={{fontSize:8.5,color:T.teal,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>What this means tonight</div>
                    <div style={{fontSize:12,color:T.t2,lineHeight:1.7}}>{imp?"She's resourced. Low-demand evening is still the right call. Check in gently.":"He's in a good place. This is a good night for real connection."}</div>
                  </div>
                </div>
                <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"12px",marginBottom:8}}>
                  <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>{T.partnerName} — Last 7 Days</div>
                  <div style={{display:"flex",gap:4,alignItems:"flex-end",height:48,marginBottom:6}}>
                    {[5,7,6,8,4,7,7].map((s,i)=>(
                      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                        <div style={{width:"100%",background:s>=7?T.teal:s>=5?T.t2:"#9a4040",borderRadius:"3px 3px 0 0",height:`${Math.round(s/10*48)}px`,opacity:i===6?1:0.6}}/>
                        <span style={{fontSize:7,color:T.t3}}>{days7[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>)}
              {moodTab==="history"&&(<>
                <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>Your entries — private · device only</div>
                <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"12px",marginBottom:10}}>
                  <div style={{fontSize:8.5,color:T.cMind,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Your Mood — Last 7 Days</div>
                  <div style={{display:"flex",gap:3,alignItems:"flex-end",height:52,marginBottom:6}}>
                    {moodHist.map((s,i)=>(
                      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                        <div style={{width:"100%",background:s>=7?T.teal:s>=5?T.t2:"#9a4040",borderRadius:"3px 3px 0 0",height:`${Math.round(s/10*52)}px`,opacity:i===6?1:0.65,transition:"height 0.4s"}}/>
                        <span style={{fontSize:7,color:T.t3}}>{days7[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:7,padding:"9px 12px",marginBottom:5,display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:moodScore>=7?T.tealBg:T.s3,border:`1px solid ${moodScore>=7?T.teal:T.b2}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontFamily:COR,fontSize:14,color:moodScore>=7?T.teal:T.t2}}>{moodScore}</span>
                  </div>
                  <div><div style={{fontSize:8.5,color:T.t3,marginBottom:1}}>Today</div><div style={{fontSize:12,color:T.t2}}>{moodScore<=4?"Hard day":moodScore<=6?"Managing":"Solid"}</div></div>
                </div>
              </>)}
            </div>
          </div>
        )}

        {/* OT MODAL */}
        {showOT&&(
          <div style={{position:"absolute",inset:0,zIndex:50,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:T.s2,border:`1px solid ${T.b2}`,borderRadius:12,padding:22,width:"100%"}}>
              <div style={{fontFamily:COR,fontSize:22,color:T.text,marginBottom:4,letterSpacing:"0.14em",textTransform:"uppercase"}}>Working Late?</div>
              <div style={{fontSize:12,color:T.t3,marginBottom:18,lineHeight:1.5}}>Tonight's alarms and sleep window adjust. Tomorrow unchanged.</div>
              {otVal?(<>
                <div style={{background:T.s3,border:`1px solid ${T.teal}`,borderRadius:8,padding:"14px",textAlign:"center",marginBottom:14}}>
                  <div style={{fontSize:12,color:T.teal,marginBottom:3}}>Overtime active</div>
                  <div style={{fontFamily:COR,fontSize:32,color:T.text}}>+{otVal} hours</div>
                </div>
                <button onClick={()=>{setOtVal(null);setShowOT(false);}} style={{width:"100%",padding:"11px 0",background:"transparent",border:`1px solid ${T.b1}`,color:T.t3,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",borderRadius:5}}>Cancel Overtime</button>
              </>):(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  {[1,2,4,"Custom"].map(h=><button key={h} onClick={()=>{setOtVal(typeof h==="number"?h:2);setShowOT(false);}} style={{padding:"16px 0",background:T.s3,border:`1px solid ${T.b1}`,color:T.text,fontFamily:COR,fontSize:typeof h==="number"?26:14,cursor:"pointer",borderRadius:6,textAlign:"center"}}>{h==="Custom"?"Custom":"+"+h+"h"}</button>)}
                </div>
              )}
              {!otVal&&<button onClick={()=>setShowOT(false)} style={{width:"100%",padding:"10px 0",background:"transparent",border:`1px solid ${T.b1}`,color:T.t3,fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",cursor:"pointer",borderRadius:5}}>Cancel</button>}
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div style={{flex:1,overflowY:"auto",background:T.bg}}>

          {/* ══ HOME ══════════════════════════════════════════ */}
          {nav==="home"&&!hub&&(
            <div style={{padding:"14px"}}>
              <div style={{fontFamily:COR,fontSize:26,color:T.text,letterSpacing:"0.12em",textTransform:"uppercase"}}>Home</div>
              <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>Wednesday, January 14</div>

              {/* Shift strip */}
              <div style={{background:imp?"#000":T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"9px 13px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>{goNav("planner");setPlanTab("schedule");}}>
                <div style={{display:"flex",gap:14}}>
                  <span style={{fontSize:9,color:T.shiftCol,display:"flex",alignItems:"center",gap:4}}><span style={{width:5,height:5,borderRadius:"50%",background:T.shiftCol,display:"inline-block"}}/>{T.person[0]}: {T.shiftSelf}</span>
                  <span style={{fontSize:9,color:T.partnerCol,display:"flex",alignItems:"center",gap:4}}><span style={{width:5,height:5,borderRadius:"50%",background:T.partnerCol,display:"inline-block"}}/>{T.partnerInit}: {T.shiftPartner}</span>
                </div>
                {otVal&&<span onClick={(e)=>{e.stopPropagation();setShowOT(true);}} style={{fontSize:9,color:"#c07040",cursor:"pointer"}}>OT +{otVal}h</span>}
                <button onClick={(e)=>{e.stopPropagation();setShowOT(true);}} style={{padding:"2px 7px",background:"transparent",border:`1px solid ${T.b2}`,borderRadius:3,color:T.t3,fontSize:8,cursor:"pointer",letterSpacing:"0.04em",textTransform:"uppercase",flexShrink:0}}>OT</button>
                <span style={{fontSize:9,color:T.t3}}>Schedule ›</span>
              </div>

              {/* Quote */}
              <div style={{background:T.s1,borderLeft:`3px solid ${T.gold}`,borderRadius:"0 8px 8px 0",padding:"10px 13px",marginBottom:10}}>
                <div style={{fontSize:8.5,color:T.goldDim,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:4}}>Today's Quote</div>
                <div style={{fontFamily:COR,fontSize:14,color:T.t2,fontStyle:"italic",lineHeight:1.7}}>"{T.quote}"</div>
              </div>

              {/* Charts strip */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"10px 10px 7px"}}>
                  <div style={{fontSize:7.5,color:"#4a8bb8",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:7}}>Hydration / 7d</div>
                  <div style={{display:"flex",gap:2,alignItems:"flex-end",height:28}}>
                    {hydHist.map((v,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                      <div style={{width:"100%",background:v>=T.hydT?"#18c48a":"#4a8bb8",borderRadius:"2px 2px 0 0",height:`${Math.round((v/T.hydT)*28)}px`,opacity:i===6?1:0.5}}/>
                      <span style={{fontSize:6,color:T.t3}}>{days7[i]}</span>
                    </div>)}
                  </div>
                </div>
                <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"10px 10px 7px"}}>
                  <div style={{fontSize:7.5,color:T.cPlan,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:7}}>Completion / 7d</div>
                  <div style={{display:"flex",gap:2,alignItems:"flex-end",height:28}}>
                    {planHist.map((v,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                      <div style={{width:"100%",background:v>=6?T.teal:v>=4?T.cPlan:"#6a4a4a",borderRadius:"2px 2px 0 0",height:`${Math.round((v/7)*28)}px`,opacity:i===6?1:0.5}}/>
                      <span style={{fontSize:6,color:T.t3}}>{days7[i]}</span>
                    </div>)}
                  </div>
                </div>
              </div>

              {/* Partner mood card */}
              <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"11px 13px",marginBottom:12,display:"flex",gap:12,alignItems:"center",cursor:"pointer"}} onClick={()=>{setShowMood(true);setMoodTab("partner");}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:`rgba(${imp?"196,120,120":"201,168,76"},0.1)`,border:`1px solid ${T.partnerCol}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontFamily:COR,fontSize:15,color:T.partnerCol}}>{T.partnerInit}</span>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:8.5,color:T.t3,marginBottom:2}}>{T.partnerName} today</div>
                  <div style={{fontSize:12,color:T.t2,fontStyle:"italic"}}>{imp?"She's steady. Shift manageable. Low-key evening preferred.":"He's solid. Good day. Connection welcome tonight."}</div>
                </div>
                <div style={{display:"flex",gap:3}}>{[1,2,3,4,5].map(d=><div key={d} style={{width:6,height:6,borderRadius:"50%",background:d<=4?T.teal:T.b2}}/>)}</div>
              </div>

              {/* Mind/Body/Soul */}
              <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:10}}>Your Practice</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                {[{k:"mind",ic:IC.brain,l:"Mind",c:T.cMind,d:"Mood · Doctrine"},{k:"body",ic:IC.heart,l:"Body",c:T.cBody,d:"Practice · Hydration"},{k:"soul",ic:IC.star,l:"Soul",c:T.cSoul,d:"Holy Days · Rite"}].map(h=>(
                  <button key={h.k} onClick={()=>setHub(h.k)} style={{background:T.s1,border:`1px solid ${h.c}44`,borderRadius:10,padding:"13px 6px",cursor:"pointer",textAlign:"center"}}>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:5}}><Svg path={h.ic} size={20} color={h.c}/></div>
                    <div style={{fontFamily:COR,fontSize:13,color:h.c,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:1}}>{h.l}</div>
                    <div style={{fontSize:7.5,color:T.t3,lineHeight:1.4}}>{h.d}</div>
                  </button>
                ))}
              </div>

              {/* Axiom */}
              <div style={{background:T.glow,border:`1px solid ${T.b1}`,borderRadius:8,padding:"13px",textAlign:"center"}}>
                <div style={{fontFamily:COR,fontSize:15,color:T.text,letterSpacing:"0.14em",textTransform:"uppercase",lineHeight:1.7,whiteSpace:"pre-line"}}>{T.axiom}</div>
              </div>
            </div>
          )}

          {/* ══ HUB SCREENS ══ */}
          {nav==="home"&&hub&&(
            <div style={{padding:"14px"}}>
              <button onClick={()=>setHub(null)} style={{display:"flex",alignItems:"center",gap:5,background:"transparent",border:"none",color:T.t3,cursor:"pointer",fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14,padding:0}}>
                <Svg path={IC.back} size={13} color={T.t3}/> Home
              </button>
              {hub==="mind"&&(<>
                <div style={{fontFamily:COR,fontSize:22,color:T.cMind,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:12}}>Mind</div>
                <button onClick={()=>setShowMood(true)} style={{width:"100%",background:T.s1,border:`1px solid ${T.cMind}44`,borderRadius:8,padding:"13px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",marginBottom:7,textAlign:"left"}}>
                  <div><div style={{fontSize:14,color:T.text,marginBottom:2}}>Mood Tracker</div><div style={{fontSize:10,color:T.t3}}>Log · auto-translate · share with {T.partnerName}</div></div>
                  <span style={{color:T.cMind,fontSize:16}}>›</span>
                </button>
                {[{l:"Daily Quote",s:"Today's line",open:true},{l:"Evening Inventory",s:"Questions in writing",open:true},{l:"Doctrine",s:"Canon · Oath · Litany",open:false,msg:"Opens at Day 14"},{l:"Shadow Work",s:"Eight positions",open:false,msg:"Opens at Day 14"}].map((it,i)=>(
                  <div key={i} style={{background:T.s1,border:`1px solid ${it.open?T.cMind+"33":T.b1}`,borderRadius:8,padding:"13px 14px",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center",opacity:it.open?1:0.6}}>
                    <div><div style={{fontSize:14,color:it.open?T.text:T.t3,marginBottom:2}}>{it.l}</div><div style={{fontSize:10,color:T.t3}}>{it.s}{it.msg&&<span style={{color:T.cMind}}> · {it.msg}</span>}</div></div>
                    {it.open?<span style={{color:T.cMind,fontSize:16}}>›</span>:<Svg path={IC.lock} size={13} color={T.t3+"66"}/>}
                  </div>
                ))}
              </>)}
              {hub==="body"&&(<>
                <div style={{fontFamily:COR,fontSize:22,color:T.cBody,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:12}}>Body</div>
                <div style={{background:T.s1,border:`1px solid #4a8bb844`,borderRadius:8,padding:"13px 14px",marginBottom:7}}>
                  <div style={{fontSize:8.5,color:"#4a8bb8",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Hydration</div>
                  <div style={{fontFamily:COR,fontSize:22,color:T.text,marginBottom:6}}>{hydCur} / {T.hydT} oz</div>
                  <div style={{background:T.s3,borderRadius:4,height:5,marginBottom:8,overflow:"hidden"}}><div style={{width:`${hydPct}%`,height:"100%",background:"#4a8bb8",transition:"width 0.3s"}}/></div>
                  <div style={{display:"flex",gap:6}}>
                    {[8,16].map(oz=><button key={oz} onClick={()=>setHyd(h=>({...h,[prof]:Math.min(h[prof]+oz,T.hydT)}))} style={{flex:1,padding:"7px 0",background:T.s3,border:`1px solid ${T.b1}`,color:"#4a8bb8",fontSize:11,cursor:"pointer",borderRadius:4}}>+{oz}oz</button>)}
                  </div>
                </div>
                {[{l:imp?"Warrior Practice":"Keep Yourself",s:imp?"Iaido · Kyudo · Systema":"Foundation · Breathwork",open:false,msg:"Opens at Day 7"},{l:"Supplement Stack",s:"MTHFR protocol",open:true},{l:imp?"Physical Threshold":"Your Two Hours",s:imp?"Weekly Se integration":"Non-negotiable rest",open:true}].map((it,i)=>(
                  <div key={i} style={{background:T.s1,border:`1px solid ${it.open?T.cBody+"33":T.b1}`,borderRadius:8,padding:"13px 14px",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center",opacity:it.open?1:0.6}}>
                    <div><div style={{fontSize:14,color:it.open?T.text:T.t3,marginBottom:2}}>{it.l}</div><div style={{fontSize:10,color:T.t3}}>{it.s}{it.msg&&<span style={{color:T.cBody}}> · {it.msg}</span>}</div></div>
                    {it.open?<span style={{color:T.cBody,fontSize:16}}>›</span>:<Svg path={IC.lock} size={13} color={T.t3+"66"}/>}
                  </div>
                ))}
              </>)}
              {hub==="soul"&&(<>
                <div style={{fontFamily:COR,fontSize:22,color:T.cSoul,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:12}}>Soul</div>
                {[{l:"Holy Days",s:"Ten observances · Calendar",msg:"Opens at Day 30"},{l:imp?"Vel'nar":"Household",s:imp?"The sovereign language":"Partner · Activities",msg:"Opens at Day 30"},{l:"The Book",s:"Eight Who Carry the Fire",msg:"Opens at Gate 4"},{l:"Rite Progress",s:"Readiness tracking",msg:"Opens at Day 30"}].map((it,i)=>(
                  <div key={i} style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"13px 14px",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center",opacity:0.6}}>
                    <div><div style={{fontSize:14,color:T.t3,marginBottom:2}}>{it.l}</div><div style={{fontSize:10,color:T.t3}}>{it.s} · <span style={{color:T.cSoul}}>{it.msg}</span></div></div>
                    <Svg path={IC.lock} size={13} color={T.t3+"66"}/>
                  </div>
                ))}
              </>)}
            </div>
          )}

          {/* ══ PLANNER ══════════════════════════════════════ */}
          {nav==="planner"&&(
            <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
              <div style={{background:imp?"#000":T.s1,borderBottom:`1px solid ${T.b1}`,display:"flex",flexShrink:0}}>
                {[["today","Today"],["calendar","Calendar"],["schedule","Schedule"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setPlanTab(k)} style={{flex:1,padding:"10px 4px",background:"none",border:"none",borderBottom:`2px solid ${planTab===k?T.cPlan:"transparent"}`,color:planTab===k?T.cPlan:T.t3,fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",fontFamily:JOS}}>{l}</button>
                ))}
              </div>

              {planTab==="today"&&(
                <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontFamily:COR,fontSize:24,color:T.cPlan,letterSpacing:"0.12em",textTransform:"uppercase"}}>Planner</div>
                      <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase"}}>Wednesday, January 14</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:COR,fontSize:20,color:T.text}}>{done_count}/{ITEMS.length}</div>
                      <div style={{fontSize:8.5,color:T.t3}}>complete</div>
                    </div>
                  </div>
                  <div style={{background:T.s3,borderRadius:4,height:4,marginBottom:12,overflow:"hidden"}}>
                    <div style={{width:`${(done_count/ITEMS.length)*100}%`,height:"100%",background:T.cPlan,transition:"width 0.3s"}}/>
                  </div>
                  {sw&&(
                    <div style={{background:T.s1,borderLeft:`3px solid #4a6a9a`,borderRadius:"0 8px 8px 0",padding:"9px 13px",marginBottom:10}}>
                      <div style={{fontSize:8.5,color:"#4a6a9a",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:4}}>Tonight's Sleep Window</div>
                      <div style={{display:"flex",gap:16}}>
                        <span style={{fontSize:12,color:T.text}}>Wind down {sw.wd}</span>
                        <span style={{fontSize:12,color:T.text}}>Sleep {sw.sl}</span>
                        <span style={{fontSize:12,color:T.text}}>Wake {sw.wk}</span>
                      </div>
                    </div>
                  )}
                  <div style={{background:T.s1,borderLeft:`3px solid ${T.gold}`,borderRadius:"0 8px 8px 0",padding:"10px 13px",marginBottom:10}}>
                    <div style={{fontFamily:COR,fontSize:14,color:T.text,fontStyle:"italic",lineHeight:1.5,marginBottom:3}}>{T.decl}</div>
                    <div style={{fontSize:9,color:T.t3}}>{T.declSub}</div>
                  </div>
                  {ITEMS.map(item=>{
                    const isDone=!!done[item.id];
                    const isOpen=expHome===item.id;
                    return (
                      <div key={item.id} style={{background:T.s1,border:`1px solid ${isOpen?item.col+"66":T.b1}`,borderRadius:8,marginBottom:6,overflow:"hidden",opacity:isDone&&!isOpen?0.52:1,transition:"all 0.2s"}}>
                        <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px"}}>
                          <Checkbox checked={isDone} col={item.col} onChange={()=>setDone(p=>({...p,[item.id]:!p[item.id]}))}/>
                          <div style={{flex:1,cursor:"pointer"}} onClick={()=>setExpHome(isOpen?null:item.id)}>
                            <div style={{fontSize:8,color:T.t3,marginBottom:1}}>{item.time}</div>
                            <div style={{fontSize:13,color:isDone&&!isOpen?T.t3:T.text,textDecoration:isDone&&!isOpen?"line-through":"none",lineHeight:1.3}}>{item.label}</div>
                            {item.sub&&!isOpen&&<div style={{fontSize:9,color:item.col+"99",marginTop:1}}>{item.sub}</div>}
                          </div>
                          <span style={{width:5,height:5,borderRadius:"50%",background:item.col,flexShrink:0}}/>
                          {item.id==="bed"&&sw&&(
                            <button onClick={(e)=>{e.stopPropagation();setShowAlarm(true);setAlPhase("ring");}} style={{padding:"3px 9px",background:"transparent",border:`1px solid #4a6a9a`,borderRadius:3,color:"#5a80b0",fontSize:8,cursor:"pointer",letterSpacing:"0.04em",textTransform:"uppercase",flexShrink:0,marginRight:4}}>Set Alarm</button>
                          )}
                          <button onClick={()=>setExpHome(isOpen?null:item.id)} style={{background:"transparent",border:`1px solid ${T.b2}`,borderRadius:4,padding:"3px 7px",color:isOpen?item.col:T.t3,fontSize:8.5,cursor:"pointer"}}>{isOpen?"▲":"▼"}</button>
                        </div>
                        {isOpen&&(
                          <div style={{borderTop:`1px solid ${T.b1}`,padding:"12px 13px"}}>
                            <div style={{background:`rgba(${imp?"201,168,76":"196,120,120"},0.06)`,border:`1px solid ${item.col}44`,borderRadius:6,padding:"6px 10px",marginBottom:10,display:"flex",justifyContent:"space-between"}}>
                              <span style={{fontSize:9,color:item.col,letterSpacing:"0.18em",textTransform:"uppercase"}}>{item.id==="decl"?"DECLARATION":item.id==="quiet"?"MORNING QUIET":item.id==="hyd"?"HYDRATION":item.id==="mid"?"MIDDAY ANCHOR":item.id==="inv"?"INVENTORY":item.id==="yours"?"YOUR TIME":item.id==="bed"?"BEDTIME":"MEAL"}</span>
                            </div>
                            <p style={{fontSize:12,color:T.t2,lineHeight:1.7,margin:"0 0 10px"}}>
                              {item.id==="decl"&&(imp?"Stand. Both feet flat on the floor. Spine vertical. One full breath in through the nose — hold three counts — release. Then speak this aloud, with full voice: Power from within cannot be revoked. Uncrowned. Unbowed. Unbroken. Unfinished. Pause. Let it land. Do not rush. This is the frame for the entire day.":"Before the phone. Before conversation. Find twenty minutes that are yours alone. Sit down. If you have tea, make it. When you are ready — not before — stand. Breathe in fully, hold three counts, release. Then speak aloud: The keeper of what matters is never powerless. Felt. Faithful. Full. Unspent. Sit back down. Stay with it one more minute before the day begins.")}
                              {item.id==="quiet"&&"Before anything else asks something of you. Twenty minutes — not fifteen. Sit upright, feet on the floor. No screens. No planning. Let thoughts pass without chasing them. When the twenty minutes ends, you declare. Not before."}
                              {item.id==="hyd"&&"Drink 24 oz of water before 9:00 AM. Not coffee. Not tea. Water. Your body has been without it for 7–9 hours. Room temperature is absorbed faster than cold. Fill the bottle the night before and place it where you will see it first thing. Drink it before you look at your phone."}
                              {item.id==="mid"&&"Stop completely. Set a 12-minute timer. Step away from the screen. Breathe: 4 counts in through the nose, hold 4, 6 counts out through the mouth. Repeat for 3 minutes, then sit in silence for the remaining 9. When the timer ends, drink 8 oz of water before returning to work."}
                              {item.id==="inv"&&(imp?"Three questions in writing. Every night. What did I build today? What tried to take the wheel — and did it succeed? What do I know now that I did not know this morning? Two to three sentences per question. Brevity is the discipline.":"Two questions in writing. Every night. What did I keep today? What came from fullness — and what came from depletion? Two sentences each. Read it. Put it away. Do not solve anything tonight.")}
                              {item.id==="yours"&&(<>
                              <p style={{fontSize:12,color:T.t2,lineHeight:1.7,margin:"0 0 10px"}}>Once per week. Two hours that belong entirely to you. Not daily — that is not realistic. Weekly. The same window each week, protected on the calendar so it repeats automatically.</p>
                              <p style={{fontSize:12,color:T.t2,lineHeight:1.7,margin:"0 0 10px"}}>What counts: reading, a bath, a walk alone, creating, watching something that costs no relational energy. What does not count: household tasks, messages, planning. The week it does not happen is not a failure. Find it the next week.</p>
                              <div style={{background:"rgba(196,120,120,0.06)",border:"1px solid rgba(196,120,120,0.25)",borderRadius:6,padding:"9px 11px",marginBottom:10}}>
                                <div style={{fontSize:8.5,color:T.cSoul,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:5}}>Schedule it — repeats weekly</div>
                                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                                  {["Sat","Sun","Mon","Tue","Wed","Thu","Fri"].map(d=>(
                                    <button key={d} style={{padding:"5px 9px",background:d==="Sat"?`rgba(196,120,120,0.15)`:"transparent",border:`1px solid ${d==="Sat"?T.cSoul:T.b1}`,borderRadius:4,color:d==="Sat"?T.cSoul:T.t3,fontSize:10,cursor:"pointer"}}>{d}</button>
                                  ))}
                                </div>
                                <div style={{display:"flex",gap:8,marginBottom:8}}>
                                  <div style={{flex:1}}><div style={{fontSize:8,color:T.t3,marginBottom:2}}>Start</div><input type="time" defaultValue="09:00" style={{width:"100%",background:T.s3,border:`1px solid ${T.b1}`,borderRadius:4,padding:"6px",color:T.text,fontSize:12,outline:"none"}}/></div>
                                  <div style={{flex:1}}><div style={{fontSize:8,color:T.t3,marginBottom:2}}>Duration</div>
                                    <select style={{width:"100%",background:T.s3,border:`1px solid ${T.b1}`,borderRadius:4,padding:"6px",color:T.text,fontSize:12,outline:"none"}}>
                                      <option>90 minutes</option>
                                      <option selected>2 hours</option>
                                      <option>Custom</option>
                                    </select>
                                  </div>
                                </div>
                                <button onClick={()=>showT("Replenishment Session saved — repeats weekly")} style={{width:"100%",padding:"8px 0",background:T.tealBg,border:`1px solid ${T.teal}`,borderRadius:4,color:T.teal,fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer"}}>Save — Add to Calendar Weekly</button>
                              </div>
                            </>)}
                              {item.id==="bed"&&`Wind down at ${sw&&sw.wd}. Sleep by ${sw&&sw.sl}. Wake at ${sw&&sw.wk}. ${sw&&sw.note}.`}
                            </p>
                            {(item.id==="b"||item.id==="l"||item.id==="d")&&(()=>{
                              const mealName=item.label.includes(" — ")?item.label.split(" — ")[1]:item.label;
                              const rec=RECIPES[mealName];
                              return rec?(
                                <div>
                                  {/* ── Ingredients ── */}
                                  <div style={{fontSize:7.5,color:T.cNour,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>Ingredients</div>
                                  {rec.ing.map((ing,idx)=>(
                                    <div key={idx} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${T.b1}33`}}>
                                      <div style={{flex:1}}>
                                        <span style={{fontSize:12,color:T.text}}>{ing.n}</span>
                                        <span style={{fontSize:9.5,color:T.t2,marginLeft:6}}>{ing.amt}</span>
                                      </div>
                                      <button onClick={(e)=>{e.stopPropagation();addIngredient(ing);}} style={{padding:"3px 8px",background:"transparent",border:`1px solid ${T.cNour}55`,borderRadius:3,color:T.cNour,fontSize:8,cursor:"pointer",flexShrink:0,marginLeft:6}}>+ Cart</button>
                                    </div>
                                  ))}
                                  <button onClick={(e)=>{e.stopPropagation();addAllIngredients(mealName);}} style={{marginTop:8,marginBottom:14,width:"100%",padding:"5px 0",background:`rgba(${imp?"224,88,40":"192,96,72"},0.07)`,border:`1px solid ${T.cNour}33`,borderRadius:4,color:T.cNour,fontSize:8,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase"}}>+ Add All to Cart</button>
                                  {/* ── Cooking steps ── */}
                                  {/* Macro strip */}
                                  {rec.macros&&(
                                    <div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap"}}>
                                      {[
                                        {label:"CAL", val:rec.macros.cal},
                                        {label:"PRO", val:rec.macros.p+"g"},
                                        {label:"CARB",val:rec.macros.c+"g"},
                                        {label:"FAT", val:rec.macros.f+"g"},
                                        {label:"FIBER",val:rec.macros.fiber+"g"},
                                      ].map(m=>(
                                        <div key={m.label} style={{flex:1,minWidth:46,background:T.s1,border:`1px solid ${T.b2}`,borderRadius:4,padding:"4px 0",textAlign:"center"}}>
                                          <div style={{fontSize:7,color:T.t3,letterSpacing:"0.1em"}}>{m.label}</div>
                                          <div style={{fontSize:11,color:T.text,fontWeight:600}}>{m.val}</div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {rec.steps&&rec.steps.length>0&&(
                                    <>
                                      <div style={{fontSize:7.5,color:T.cNour,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>How to Make It</div>
                                      {rec.steps.map((step,i)=>(
                                        <div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:`1px solid ${T.b1}22`}}>
                                          <span style={{fontSize:10,color:T.cNour,fontWeight:"bold",flexShrink:0,minWidth:16}}>{i+1}.</span>
                                          <span style={{fontSize:12,color:T.t2,lineHeight:1.6}}>{step}</span>
                                        </div>
                                      ))}
                                    </>
                                  )}
                                </div>
                              ):(
                                <div style={{fontSize:11,color:T.t3,fontStyle:"italic",marginBottom:10}}>Leftover — no prep needed</div>
                              );
                            })()}
                            {PLANNER_CEREMONY_MAP[item.id]&&(
                              <button onClick={()=>addCeremonySupplies(PLANNER_CEREMONY_MAP[item.id])} style={{marginBottom:10,width:"100%",padding:"7px 0",background:"rgba(122,90,138,0.08)",border:"1px solid rgba(122,90,138,0.35)",borderRadius:4,color:"#7a5a8a",fontSize:8,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase"}}>+ Add Ceremony Supplies to Cart</button>
                            )}
                            <button onClick={()=>{setDone(p=>({...p,[item.id]:true}));setExpHome(null);}} style={{marginTop:12,width:"100%",padding:"9px 0",background:T.tealBg,border:`1px solid ${T.teal}`,color:T.teal,fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",borderRadius:5}}>Complete</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {done_count===ITEMS.length&&<div style={{background:T.tealBg,border:`1px solid ${T.teal}`,borderRadius:8,padding:"12px",textAlign:"center",marginTop:4}}><div style={{fontFamily:COR,fontSize:18,color:T.teal,letterSpacing:"0.12em",textTransform:"uppercase"}}>{imp?"Day Complete.":"You tended everything today."}</div></div>}
                </div>
              )}

              {planTab==="calendar"&&(
                <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                    <button onClick={()=>setCalOff(o=>o-1)} style={{fontFamily:JOS,fontSize:16,padding:"6px 14px",border:`1px solid ${T.b2}`,borderRadius:5,background:"none",color:T.t2,cursor:"pointer"}}>‹</button>
                    <div style={{fontFamily:JOS,fontSize:11,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:T.cPlan}}>{cal.name} {cal.y}</div>
                    <button onClick={()=>setCalOff(o=>o+1)} style={{fontFamily:JOS,fontSize:16,padding:"6px 14px",border:`1px solid ${T.b2}`,borderRadius:5,background:"none",color:T.t2,cursor:"pointer"}}>›</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
                    {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} style={{fontSize:8.5,color:T.t3,textAlign:"center",padding:"3px 0"}}>{d}</div>)}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:14}}>
                    {Array(cal.first).fill(null).map((_,i)=><div key={"e"+i}/>)}
                    {Array(cal.days).fill(null).map((_,i)=>{
                      const d=i+1;
                      const dk=`${cal.y}-${String(cal.m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                      const isToday=d===14&&cal.m===0;
                      const dow=new Date(cal.y,cal.m,d).getDay();
                      const dowN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][dow];
                      const isWork=sched&&workDays[dowN.slice(0,3)];
                      const evts=events[dk]||[];
                      const isSel=selDay===dk;
                      return <div key={d} onClick={()=>setSelDay(isSel?null:dk)} style={{minHeight:42,border:`1px solid ${isToday?"rgba(201,168,76,0.5)":isSel?T.cPlan+"66":T.b1}`,borderRadius:5,background:isToday?"rgba(201,168,76,0.06)":isSel?`rgba(${imp?"201,168,76":"196,120,120"},0.06)`:"#0a0a0a",padding:4,cursor:"pointer"}}>
                        <div style={{fontSize:10,fontWeight:isToday?700:400,color:isToday?T.gold:T.t3,textAlign:"right",marginBottom:2}}>{d}</div>
                        {isWork&&<div style={{width:"100%",height:2,background:imp?"rgba(88,136,176,0.5)":"rgba(196,120,120,0.5)",borderRadius:1,marginBottom:2}}/>}
                        {evts.length>0&&<div style={{fontSize:7.5,color:T.cPlan,textAlign:"center"}}>{evts.length} evt</div>}
                      </div>;
                    })}
                  </div>
                  {selDay&&(
                    <div style={{background:T.s1,border:`1px solid ${T.cPlan}44`,borderRadius:8,padding:"12px 13px",marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <div style={{fontFamily:COR,fontSize:17,color:T.text}}>{new Date(selDay+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
                        <button onClick={()=>setSelDay(null)} style={{background:"transparent",border:"none",color:T.t3,cursor:"pointer",fontSize:16,lineHeight:1}}>x</button>
                      </div>
                      {(events[selDay]||[]).map((ev,i)=>(
                        <div key={i} style={{display:"flex",gap:8,alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${T.b1}`}}>
                          <span style={{fontSize:9,color:T.t3,minWidth:38}}>{ev.t}</span>
                          <span style={{flex:1,fontSize:13,color:T.t2}}>{ev.l}</span>
                          <span style={{fontSize:8,padding:"1px 5px",border:`1px solid ${T.b2}`,borderRadius:2,color:T.t3}}>{ev.type}</span>
                        </div>
                      ))}
                      {(events[selDay]||[]).length===0&&<div style={{fontSize:11,color:T.t3,fontStyle:"italic"}}>No events. Add below.</div>}
                    </div>
                  )}
                  <div style={{background:T.s2,border:`1px dashed ${T.b2}`,borderRadius:8,padding:"12px 13px"}}>
                    <div style={{fontSize:9,color:T.cPlan,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:10}}>+ Add Event</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 70px",gap:6,marginBottom:6}}>
                      <input value={evLabel} onChange={e=>setEvLabel(e.target.value)} placeholder="Event name..." style={{background:"#000",border:`1px solid ${T.b2}`,borderRadius:4,padding:"8px",color:T.text,fontSize:13,outline:"none",fontFamily:JOS}}/>
                      <input type="time" value={evTime} onChange={e=>setEvTime(e.target.value)} style={{background:"#000",border:`1px solid ${T.b2}`,borderRadius:4,padding:"8px 4px",color:T.text,fontSize:12,outline:"none"}}/>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:6}}>
                      <input type="date" value={evDate} onChange={e=>setEvDate(e.target.value)} style={{width:"100%",background:"#000",border:`1px solid ${T.b2}`,borderRadius:4,padding:"8px",color:T.text,fontSize:12,outline:"none"}}/>
                      <button onClick={()=>{if(!evLabel.trim())return;setEvents(p=>{const k=evDate;const cur=p[k]||[];return {...p,[k]:[...cur,{l:evLabel,t:evTime,type:"personal"}]};});setEvLabel("");showT("Event added");}} style={{padding:"8px 12px",border:`1px solid ${T.cPlan}66`,borderRadius:4,background:`rgba(${imp?"201,168,76":"196,120,120"},0.08)`,color:T.cPlan,cursor:"pointer",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase"}}>Add</button>
                    </div>
                  </div>
                </div>
              )}

              {planTab==="schedule"&&(
                <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
                  <div style={{fontFamily:COR,fontSize:22,color:T.cWork,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:14}}>Work Schedule</div>
                  {sw&&<div style={{background:T.s1,border:`1px solid ${T.teal}`,borderRadius:8,padding:"11px 13px",marginBottom:12}}>
                    <div style={{fontSize:8.5,color:T.teal,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>Tonight's Sleep Window</div>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      {[["Wind down",sw.wd],["Sleep",sw.sl],["Wake",sw.wk]].map(([l,v])=>(
                        <div key={l}><div style={{fontSize:8.5,color:T.t3,marginBottom:1}}>{l}</div><div style={{fontFamily:COR,fontSize:17,color:T.text}}>{v}</div></div>
                      ))}
                    </div>
                    <div style={{fontSize:9,color:T.t3,fontStyle:"italic"}}>{sw.note}</div>
                  </div>}
                  <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"13px",marginBottom:8}}>
                    <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>Schedule Type</div>
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      {[["rotating_223","2-2-3 Rotating (law enforcement)"],["rotating_nights","12hr Nights"],["rotating_days","12hr Days"],["rotating_mixed","Mixed Days & Nights"],["fixed_days","Fixed Days"],["variable","Mark each day manually"]].map(([k,l])=>(
                        <button key={k} onClick={()=>setSched(k)} style={{padding:"9px 11px",background:sched===k?`rgba(${imp?"24,196,138":"196,120,120"},0.08)`:T.s2,border:`1px solid ${sched===k?T.teal:T.b1}`,borderRadius:5,color:sched===k?T.teal:T.t2,fontSize:11,textAlign:"left",cursor:"pointer"}}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"13px",marginBottom:8}}>
                    <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>Work Days — tap to toggle</div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
                      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
                        <button key={d} onClick={()=>setWorkDays(p=>({...p,[d]:!p[d]}))} style={{padding:"7px 10px",background:workDays[d]?`rgba(${imp?"24,196,138":"196,120,120"},0.1)`:T.s2,border:`1px solid ${workDays[d]?T.teal:T.b1}`,borderRadius:4,color:workDays[d]?T.teal:T.t3,fontSize:11,cursor:"pointer"}}>{d}</button>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <div style={{flex:1}}><div style={{fontSize:8.5,color:T.t3,marginBottom:3}}>Start</div><input type="time" value={shiftStart} onChange={e=>setShiftStart(e.target.value)} style={{width:"100%",background:T.s2,border:`1px solid ${T.b1}`,borderRadius:5,padding:"8px",color:T.text,fontSize:13,fontFamily:COR,outline:"none"}}/></div>
                      <div style={{color:T.t3,paddingTop:16}}>→</div>
                      <div style={{flex:1}}><div style={{fontSize:8.5,color:T.t3,marginBottom:3}}>End</div><input type="time" value={shiftEnd} onChange={e=>setShiftEnd(e.target.value)} style={{width:"100%",background:T.s2,border:`1px solid ${T.b1}`,borderRadius:5,padding:"8px",color:T.text,fontSize:13,fontFamily:COR,outline:"none"}}/></div>
                    </div>
                  </div>
                  <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"11px 13px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setShowOT(true)}>
                    <div><div style={{fontSize:14,color:T.text}}>Working Late?</div><div style={{fontSize:10,color:T.t3}}>Push tonight's alarms and sleep window</div></div>
                    <span style={{color:"#c07040",fontSize:11}}>{otVal?`+${otVal}h active`:"+Overtime"}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ NOURISH ══════════════════════════════════════ */}
          {nav==="nourish"&&(
            <div style={{padding:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{fontFamily:COR,fontSize:26,color:T.cNour,letterSpacing:"0.12em",textTransform:"uppercase"}}>Nourish</div>
                  <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase"}}>One plan · Both people · Settings filter the rotation</div>
                </div>
              </div>

              {/* DIETARY SETTINGS — PROMINENT AT TOP */}
              <div style={{background:T.s1,border:`2px solid ${diet.nutAllergy?"#c07040":T.b1}`,borderRadius:8,padding:"12px 13px",marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontSize:9,color:diet.nutAllergy?"#c07040":T.t3,letterSpacing:"0.14em",textTransform:"uppercase",fontWeight:700}}>Dietary Settings — Filters Meal Rotation</div>
                  <button onClick={()=>setNourTab(nourTab==="settings"?"plan":"settings")} style={{fontSize:9,color:T.cNour,background:"transparent",border:`1px solid ${T.cNour}44`,padding:"3px 8px",borderRadius:3,cursor:"pointer",letterSpacing:"0.08em"}}>{nourTab==="settings"?"Done":"Edit"}</button>
                </div>

                {nourTab==="settings"?(
                  <div>
                    <div style={{fontSize:8.5,color:"#c07040",marginBottom:10,fontWeight:700}}>HARD FILTERS — removes meals that do not match. Meals without the required tag are excluded from the rotation entirely.</div>
                    {[
                      {k:"nutAllergy",l:"Nut Allergy",sub:"HARD FILTER — only NF-tagged meals appear",warning:true},
                      {k:"gerd",l:"GERD",sub:"HARD FILTER — only GERD-safe meals appear",warning:false},
                      {k:"glutenFree",l:"Gluten-Free",sub:"HARD FILTER — only GF-tagged meals appear",warning:false},
                      {k:"dairyFree",l:"Dairy-Free",sub:"HARD FILTER — only DF-tagged meals appear",warning:false},
                    ].map(setting=>(
                      <div key={setting.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.b1}`}}>
                        <div>
                          <div style={{fontSize:13,color:diet[setting.k]?"#c07040":T.t2,marginBottom:2}}>{setting.l} {diet[setting.k]&&setting.warning&&<span style={{fontSize:9,color:"#c07040"}}>⚠ Active</span>}</div>
                          <div style={{fontSize:9,color:T.t3}}>{setting.sub}</div>
                        </div>
                        <Toggle on={diet[setting.k]} col="#c07040" onChange={()=>setDiet(p=>({...p,[setting.k]:!p[setting.k]}))}/>
                      </div>
                    ))}
                    <div style={{fontSize:8.5,color:T.t3,marginTop:10,marginBottom:6}}>PRIORITY FILTERS — surfaces best matches first in swap lists. Does not remove meals.</div>
                    {[
                      {k:"gbp",l:"GBP — Gastric Bypass",sub:"Surfaces GBP★ meals first · adds portion guidance on recipe cards"},
                      {k:"mthfr",l:"MTHFR",sub:"Surfaces MTHFR★ high-folate meals first in swap lists"},
                    ].map(setting=>(
                      <div key={setting.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.b1}`}}>
                        <div>
                          <div style={{fontSize:13,color:diet[setting.k]?T.teal:T.t2,marginBottom:2}}>{setting.l}</div>
                          <div style={{fontSize:9,color:T.t3}}>{setting.sub}</div>
                        </div>
                        <Toggle on={diet[setting.k]} col={T.teal} onChange={()=>setDiet(p=>({...p,[setting.k]:!p[setting.k]}))}/>
                      </div>
                    ))}
                  </div>
                ):(
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {diet.nutAllergy&&<span style={{fontSize:8.5,padding:"2px 7px",background:"rgba(192,112,40,0.1)",border:"1px solid rgba(192,112,40,0.4)",borderRadius:3,color:"#c07040"}}>⚠ NUT ALLERGY ON</span>}
                    {diet.gbp&&<span style={{fontSize:8.5,padding:"2px 7px",background:"rgba(24,196,138,0.08)",border:`1px solid ${T.teal}44`,borderRadius:3,color:T.teal}}>GBP</span>}
                    {diet.mthfr&&<span style={{fontSize:8.5,padding:"2px 7px",background:"rgba(24,196,138,0.08)",border:`1px solid ${T.teal}44`,borderRadius:3,color:T.teal}}>MTHFR</span>}
                    {diet.gerd&&<span style={{fontSize:8.5,padding:"2px 7px",background:"rgba(192,112,40,0.1)",border:"1px solid rgba(192,112,40,0.4)",borderRadius:3,color:"#c07040"}}>GERD</span>}
                    {diet.glutenFree&&<span style={{fontSize:8.5,padding:"2px 7px",background:"rgba(192,112,40,0.1)",border:"1px solid rgba(192,112,40,0.4)",borderRadius:3,color:"#c07040"}}>GF</span>}
                    {diet.dairyFree&&<span style={{fontSize:8.5,padding:"2px 7px",background:"rgba(192,112,40,0.1)",border:"1px solid rgba(192,112,40,0.4)",borderRadius:3,color:"#c07040"}}>DF</span>}
                    {!diet.nutAllergy&&!diet.gbp&&!diet.mthfr&&!diet.gerd&&!diet.glutenFree&&!diet.dairyFree&&<span style={{fontSize:9,color:T.t3}}>No filters active</span>}
                  </div>
                )}
              </div>

              {nourTab!=="settings"&&(
                <>
                  <div style={{display:"flex",gap:5,marginBottom:12}}>
                    {[["plan","4-Week Plan"],["cart","Grocery Cart"]].map(([k,l])=>(
                      <button key={k} onClick={()=>setNourTab(k)} style={{flex:1,padding:"7px 0",background:nourTab===k?`rgba(${imp?"224,88,40":"192,96,72"},0.1)`:T.s2,border:`1px solid ${nourTab===k?T.cNour:T.b1}`,color:nourTab===k?T.cNour:T.t3,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",borderRadius:4}}>{l}</button>
                    ))}
                  </div>

                  {nourTab==="plan"&&(
                    <>
                      {diet.nutAllergy&&<div style={{background:"rgba(192,112,40,0.08)",border:"1px solid rgba(192,112,40,0.3)",borderRadius:6,padding:"8px 12px",marginBottom:10,fontSize:10,color:"#c07040"}}>⚠ Nut Allergy filter ON — only NF-tagged meals shown. Meals without NF tag are flagged.</div>}
                      {WEEK_PLAN.map((wk,wi)=>(
                        <div key={wi} style={{background:T.s1,border:`1px solid ${expWeek===wi?T.cNour:T.b1}`,borderRadius:8,marginBottom:8,overflow:"hidden"}}>
                          <div onClick={()=>setExpWeek(expWeek===wi?null:wi)} style={{padding:"11px 13px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",borderBottom:expWeek===wi?`1px solid ${T.b1}`:"none"}}>
                            <div>
                              <div style={{fontSize:8.5,color:T.cNour,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:2}}>Week {wi+1}</div>
                              <div style={{fontSize:14,color:T.text}}>{wk.week}</div>
                              <div style={{fontSize:9,color:T.t3,marginTop:2}}>7 days · 21 meals</div>
                            </div>
                            <span style={{color:expWeek===wi?T.cNour:T.t3,fontSize:16}}>{expWeek===wi?"▲":"▼"}</span>
                          </div>
                          {expWeek===wi&&(
                            <div style={{padding:"8px 13px",borderBottom:`1px solid ${T.b1}`,background:T.s2}}>
                              <button onClick={()=>{
                                let count=0;
                                wk.days.forEach(d=>{
                                  ["b","l","d"].forEach(slot=>{
                                    const mn=d.meals[slot];
                                    const tgs=d.tags[slot];
                                    if(mealPassesFilter(tgs)&&RECIPES[mn]){
                                      RECIPES[mn].ing.forEach(ig=>addIngredient(ig));
                                      count++;
                                    }
                                  });
                                });
                                showT("Week "+(wi+1)+" — ingredients added");
                              }} style={{width:"100%",padding:"7px 0",background:`rgba(${imp?"224,88,40":"192,96,72"},0.08)`,border:`1px solid ${T.cNour}44`,borderRadius:4,color:T.cNour,fontSize:8.5,cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:JOS}}>
                                + Add All Week {wi+1} Ingredients to Cart
                              </button>
                            </div>
                          )}
                          {expWeek===wi&&wk.days.map((day,di)=>{
                            const dayKey=`${wi}-${di}`;
                            const isDayOpen=expDay===dayKey;
                            const hasBlocked=anyMealBlocked(day);
                            return (
                              <div key={di} style={{borderTop:`1px solid ${T.b1}`}}>
                                <div onClick={()=>setExpDay(isDayOpen?null:dayKey)} style={{padding:"9px 13px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",background:isDayOpen?T.s2:"transparent"}}>
                                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                                    <span style={{width:6,height:6,borderRadius:"50%",background:hasBlocked?"#c07040":day.batch?T.teal:T.b2,flexShrink:0}}/>
                                    <span style={{fontSize:13,color:T.text}}>{day.day}</span>
                                    {day.batch&&<span style={{fontSize:8,color:T.teal,letterSpacing:"0.06em"}}>BATCH</span>}
                                    {hasBlocked&&<span style={{fontSize:8,color:"#c07040"}}>⚠ filter conflict</span>}
                                  </div>
                                  <span style={{color:isDayOpen?T.cNour:T.t3,fontSize:12}}>{isDayOpen?"▲":"▼"}</span>
                                </div>
                                {isDayOpen&&(
                                  <div style={{padding:"8px 13px 12px"}}>
                                    {["b","l","d"].map(slot=>{
                                      const mealName=day.meals[slot];
                                      const tags=day.tags[slot];
                                      const blocked=!mealPassesFilter(tags);
                                      const rec=RECIPES[mealName];
                                      return (
                                        <div key={slot} style={{background:blocked?"rgba(192,112,40,0.06)":T.s3,border:`1px solid ${blocked?"rgba(192,112,40,0.3)":T.b1}`,borderRadius:6,marginBottom:6,overflow:"hidden"}}>
                                          {/* Meal header */}
                                          <div style={{padding:"9px 11px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                                            <div style={{flex:1}}>
                                              <div style={{fontSize:8,color:blocked?"#c07040":T.cNour,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>{slot==="b"?"Breakfast":slot==="l"?"Lunch":"Dinner"}</div>
                                              <div style={{fontSize:13,color:blocked?T.t3:T.text,textDecoration:blocked?"line-through":"none"}}>{mealName}</div>
                                              {blocked&&<div style={{fontSize:9,color:"#c07040",marginTop:2}}>Not NF-tagged — swap needed</div>}
                                            </div>
                                            <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"flex-end",maxWidth:80}}>
                                              {tags.map(t=><span key={t} style={{fontSize:7,padding:"1px 4px",border:`1px solid ${t==="NF"?"#5a9a5a":T.b2}`,borderRadius:2,color:t==="NF"?"#5a9a5a":T.t3}}>{t}</span>)}
                                            </div>
                                          </div>
                                          {/* Ingredient list */}
                                          {!blocked&&rec&&(
                                            <div style={{borderTop:`1px solid ${T.b1}`,padding:"8px 11px 10px"}}>
                                              {/* Macro strip */}
                                              {rec.macros&&(
                                                <div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap"}}>
                                                  {[
                                                    {label:"CAL", val:rec.macros.cal, unit:""},
                                                    {label:"PRO", val:rec.macros.p+"g", unit:""},
                                                    {label:"CARB",val:rec.macros.c+"g", unit:""},
                                                    {label:"FAT", val:rec.macros.f+"g", unit:""},
                                                    {label:"FIBER",val:rec.macros.fiber+"g",unit:""},
                                                  ].map(m=>(
                                                    <div key={m.label} style={{flex:1,minWidth:46,background:T.s1,border:`1px solid ${T.b2}`,borderRadius:4,padding:"4px 0",textAlign:"center"}}>
                                                      <div style={{fontSize:7,color:T.t3,letterSpacing:"0.1em"}}>{m.label}</div>
                                                      <div style={{fontSize:11,color:T.text,fontWeight:600}}>{m.val}</div>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                              <div style={{fontSize:7.5,color:T.cNour,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>Ingredients</div>
                                              {rec.ing.map((ing,idx)=>(
                                                <div key={idx} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${T.b1}33`}}>
                                                  <div style={{flex:1}}>
                                                    <span style={{fontSize:12,color:T.text}}>{ing.n}</span>
                                                    <span style={{fontSize:9.5,color:T.t2,marginLeft:6}}>{ing.amt}</span>
                                                  </div>
                                                  <button onClick={(e)=>{e.stopPropagation();addIngredient(ing);}} style={{padding:"3px 8px",background:"transparent",border:`1px solid ${T.cNour}55`,borderRadius:3,color:T.cNour,fontSize:8,cursor:"pointer",letterSpacing:"0.04em",flexShrink:0,marginLeft:6}}>+ Cart</button>
                                                </div>
                                              ))}
                                              <button onClick={(e)=>{e.stopPropagation();addAllIngredients(mealName);}} style={{marginTop:8,width:"100%",padding:"5px 0",background:`rgba(${imp?"224,88,40":"192,96,72"},0.07)`,border:`1px solid ${T.cNour}33`,borderRadius:4,color:T.cNour,fontSize:8,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase"}}>+ Add All to Cart</button>
                                              {/* ── Cooking steps ── */}
                                              {rec.steps&&rec.steps.length>0&&(
                                                <>
                                                  <div style={{fontSize:7.5,color:T.cNour,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:12,marginBottom:6}}>How to Make It</div>
                                                  {rec.steps.map((step,i)=>(
                                                    <div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:`1px solid ${T.b1}22`}}>
                                                      <span style={{fontSize:10,color:T.cNour,fontWeight:"bold",flexShrink:0,minWidth:16}}>{i+1}.</span>
                                                      <span style={{fontSize:12,color:T.t2,lineHeight:1.6}}>{step}</span>
                                                    </div>
                                                  ))}
                                                </>
                                              )}
                                            </div>
                                          )}
                                          {!blocked&&!rec&&(
                                            <div style={{borderTop:`1px solid ${T.b1}`,padding:"8px 11px"}}>
                                              <div style={{fontSize:10,color:T.t3,fontStyle:"italic"}}>Leftover — no ingredient list needed</div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </>
                  )}

                  {nourTab==="cart"&&(
                    <>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div style={{fontSize:8.5,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase"}}>{Object.keys(cart).length} items · {Object.values(cart).filter(v=>v.checked).length} checked</div>
                        {Object.values(cart).some(v=>v.checked)&&(
                          <button onClick={()=>setCart(prev=>{const n={};Object.entries(prev).forEach(([k,v])=>{if(!v.checked)n[k]=v;});return n;})} style={{padding:"3px 8px",background:"transparent",border:`1px solid ${T.b1}`,borderRadius:3,color:T.t3,fontSize:8,cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase"}}>Clear Checked</button>
                        )}
                      </div>
                      {Object.keys(cart).length===0?(
                        <div style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"24px",textAlign:"center"}}>
                          <div style={{fontSize:13,color:T.cNour,marginBottom:6}}>Open the 4-Week Plan</div>
                          <div style={{fontSize:11,color:T.t3}}>Each ingredient has its own + Cart button</div>
                        </div>
                      ):(
                        <>
                          {["produce","protein","dairy","grains","pantry","spice","beverage","ceremony"].map(cat=>{
                            const items=Object.entries(cart).filter(([,v])=>v.unit===cat&&!v.checked);
                            if(items.length===0)return null;
                            const catLabel={produce:"Produce",protein:"Proteins",dairy:"Dairy & Eggs",grains:"Grains & Legumes",pantry:"Pantry",spice:"Herbs & Spices",beverage:"Beverages",ceremony:"Ceremony & Practice"}[cat];
                            const catColor={produce:"#5a9a5a",protein:"#c04040",dairy:"#4a80c0",grains:"#a07840",pantry:"#c0a040",spice:"#808040",beverage:"#4a8088",ceremony:"#7a5a8a"}[cat];
                            return (
                              <div key={cat} style={{marginBottom:12}}>
                                <div style={{fontSize:8,color:catColor,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:5,display:"flex",alignItems:"center",gap:5}}>
                                  <span style={{width:6,height:6,borderRadius:"50%",background:catColor,flexShrink:0,display:"inline-block"}}/>
                                  {catLabel} ({items.length})
                                </div>
                                {items.map(([k,v])=>(
                                  <div key={k} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${T.b1}`}}>
                                    <div onClick={()=>setCart(p=>({...p,[k]:{...p[k],checked:true}}))} style={{width:18,height:18,border:`1px solid ${T.b2}`,borderRadius:3,background:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}}/>
                                    <div style={{flex:1}}>
                                      <span style={{fontSize:12,color:T.t2}}>{v.name}</span>
                                      {v.where&&<div style={{fontSize:9,color:T.t3,lineHeight:1.4,marginTop:2}}>{v.where}</div>}
                                    </div>
                                    <span style={{fontSize:9.5,color:T.t3,marginRight:2}}>{v.count>1?`×${v.count}`:v.amt}</span>
                                    <button onClick={()=>removeCartItem(k)} style={{background:"transparent",border:"none",color:T.t3,fontSize:15,cursor:"pointer",padding:"0 2px",lineHeight:1,flexShrink:0}}>×</button>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                          {Object.entries(cart).filter(([,v])=>v.checked).length>0&&(
                            <div style={{marginTop:6,opacity:0.45}}>
                              <div style={{fontSize:8,color:T.t3,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>In basket</div>
                              {Object.entries(cart).filter(([,v])=>v.checked).map(([k,v])=>(
                                <div key={k} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`1px solid ${T.b1}`}}>
                                  <div onClick={()=>setCart(p=>({...p,[k]:{...p[k],checked:false}}))} style={{width:18,height:18,border:`1px solid ${T.teal}`,borderRadius:3,background:T.tealBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}}>
                                    <Svg path={IC.check} size={10} color={T.teal} sw={2.5}/>
                                  </div>
                                  <span style={{flex:1,fontSize:12,color:T.t3,textDecoration:"line-through"}}>{v.name}</span>
                                  <button onClick={()=>removeCartItem(k)} style={{background:"transparent",border:"none",color:T.t3,fontSize:15,cursor:"pointer",padding:"0 2px",lineHeight:1}}>×</button>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ MORE ════════════════════════════════════════ */}
          {nav==="more"&&(
            <div style={{padding:"14px",overflowY:"auto"}}>
              <div style={{fontFamily:COR,fontSize:26,color:T.cMore,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:14}}>More</div>
              <div style={{fontFamily:JOS,fontSize:9,color:T.t3,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8}}>Progress</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
                {[["3","DAY STREAK",T.gold],["42%","READINESS",T.teal],["7","DAYS",T.cMind]].map(([v,l,c])=>(
                  <div key={l} style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"10px 8px",textAlign:"center"}}>
                    <div style={{fontFamily:COR,fontSize:26,color:c,fontWeight:600,lineHeight:1}}>{v}</div>
                    <div style={{fontSize:7,color:T.t3,letterSpacing:"0.08em",marginTop:3,lineHeight:1.2}}>{l}</div>
                  </div>
                ))}
              </div>
              {[[moodHist,"Mood","0.1em",T.cMind],[hydHist,"Hydration (oz)","0.1em","#4a8bb8"],[planHist,"Completion","0.1em",T.cPlan]].map(([data,label,ls,col])=>(
                <div key={label} style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"11px",marginBottom:8}}>
                  <div style={{fontSize:8.5,color:col,letterSpacing:ls,textTransform:"uppercase",marginBottom:8}}>{label} — Last 7 Days</div>
                  <div style={{display:"flex",gap:3,alignItems:"flex-end",height:44,marginBottom:5}}>
                    {data.map((v,i)=>{
                      const maxV = label==="Hydration (oz)" ? T.hydT : 10;
                      const pct = Math.round((v/maxV)*44);
                      const bg = label==="Mood" ? (v>=7?T.teal:v>=5?T.t2:"#9a4040") : label==="Hydration (oz)" ? (v>=T.hydT?"#18c48a":"#4a8bb8") : (v>=6?T.teal:v>=4?T.cPlan:"#6a4a4a");
                      return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                        <div style={{width:"100%",background:bg,borderRadius:"2px 2px 0 0",height:`${pct}px`,opacity:i===6?1:0.6,transition:"height 0.4s"}}/>
                        <span style={{fontSize:6.5,color:T.t3}}>{days7[i]}</span>
                      </div>;
                    })}
                  </div>
                </div>
              ))}
              <div style={{fontFamily:JOS,fontSize:9,color:T.t3,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8,marginTop:4}}>System</div>
              {[
                {l:"Mood Journal",s:"Log · auto-translate · share",action:()=>setShowMood(true)},
                {l:`${T.partnerName}'s Mood`,s:"Translated · partner feed",action:()=>{setShowMood(true);setMoodTab("partner");}},
                {l:"Dietary Settings",s:`NF: ${diet.nutAllergy?"ON ⚠":"off"} · GBP: ${diet.gbp?"on":"off"} · MTHFR: ${diet.mthfr?"on":"off"}`,action:()=>setNourTab("settings")},
                {l:"Alarms",s:"Manage · snooze · are-you-awake",action:()=>setShowAlarm(true)},
                {l:"Settings",s:"Profile · household · targets · reset tutorial"},
              ].map((it,i)=>(
                <div key={i} onClick={it.action?()=>{it.action();if(it.l==="Dietary Settings")goNav("nourish");}:undefined} style={{background:T.s1,border:`1px solid ${T.b1}`,borderRadius:8,padding:"11px 13px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:it.action?"pointer":"default"}}>
                  <div><div style={{fontSize:14,color:T.text,marginBottom:2}}>{it.l}</div><div style={{fontSize:10,color:T.t3}}>{it.s}</div></div>
                  <span style={{color:T.t3,fontSize:16}}>›</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NAV */}
        <div style={{height:60,background:imp?"#000":T.s1,borderTop:`1px solid ${T.b1}`,display:"flex",alignItems:"stretch",flexShrink:0}}>
          {NAV.map(tab=>{
            const active=nav===tab.k;
            return <button key={tab.k} onClick={()=>goNav(tab.k)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2.5,background:"none",border:"none",borderTop:`2px solid ${active?tab.col:"transparent"}`,color:active?tab.col:T.t3+"66",cursor:"pointer",fontSize:7,letterSpacing:"0.08em",textTransform:"uppercase",padding:"6px 1px 3px",transition:"all 0.15s",minWidth:0}}>
              <Svg path={tab.ic} size={17} color={active?tab.col:T.t3+"55"}/>
              <span>{tab.l}</span>
            </button>;
          })}
        </div>
      </div>

      {toast&&<div style={{position:"fixed",bottom:52,left:"50%",transform:"translateX(-50%)",background:TH[prof].s2,border:`1px solid ${TH[prof].b2}`,borderRadius:4,padding:"7px 14px",fontFamily:JOS,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:TH[prof].text,zIndex:999,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,0.5)"}}>{toast}</div>}
      <div style={{marginTop:14,fontFamily:JOS,fontSize:8.5,color:"#333",letterSpacing:"0.2em",textTransform:"uppercase",textAlign:"center"}}>
        Home: Mind · Body · Soul · Planner: Today / Calendar / Schedule · Nourish: dietary settings at top
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
