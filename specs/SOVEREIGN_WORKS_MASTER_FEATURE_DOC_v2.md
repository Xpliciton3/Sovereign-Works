# SOVEREIGN WORKS — MASTER FEATURE & MATERIALS DOCUMENT
### Version 2.0 — Corrected & Authoritative
### Two users only: Garrin (INTJ) + Holli (ESFJ)

---

## HOUSEHOLD — LOCKED IN

| Person | Type | Tradition | App |
|--------|------|-----------|-----|
| **Garrin** | INTJ | The Uncrowned | Imperium |
| **Holli** | ESFJ | The Unspent | Tending |

**No children. No other household members. No children. No other household members.**

**Gastric bypass (Holli):** Affects the meal plan ONLY — portion sizes, food prep notes,
and soft-food flags on recipe cards. It does not create medical alarms, does not
affect the supplement tab, does not appear anywhere outside of the Nourish tab.

---

## PART ONE: APP ARCHITECTURE

### The Layering Rule

```
SHARED BASE — Firebase — both phones read this
│
│  Recipes · Grocery list · Shared calendar events
│  Household meal plan · Wellness teas · Pantry staples
│  Mood translations (approved previews only)
│  Holy Days · Couple activities · Shift schedule
│
└── PROFILE LAYER — device only — private
        │
        ├── IMPERIUM (Garrin/INTJ)
        │     Warrior practice logs · Shadow work entries
        │     Evening review · Doctrine prompts
        │     Vel'nar language progress · Rite records
        │     Assessment results · Private journal
        │
        └── TENDING (Holli/ESFJ)
              Keeper's Practice logs · Shadow work entries
              Evening tends itself · Doctrine prompts
              Rite records · Assessment results
              Private journal · Mood raw entries
```

### Planner Privacy Rule — Non-Negotiable

```
GARRIN'S PLANNER shows:
  → His warrior practice sessions
  → His shadow work prompts
  → His doctrine check-ins and rites
  → His alarms
  → SHARED events only: meals, couple activities,
    holy days, concord events, repair walks

HOLLI'S PLANNER shows:
  → Her keeper's practice sessions
  → Her shadow work prompts
  → Her doctrine check-ins and rites
  → Her alarms
  → SAME shared events

Neither planner shows the other person's private
practice unless they explicitly share an event.
Warrior practice = Garrin's only.
Keeper's practice = Holli's only.
```

---

## PART TWO: BUILD ORDER

This is a lifestyle change. The app introduces practices gradually — one layer at a time — so neither person is overwhelmed. Every new element builds on what already exists.

```
PHASE 1 — FOUNDATION (install this, live with it for 1 week)
  Calendar / Daily Planner with alarms
  Nourish tab: meal plan + grocery list
  Basic hydration tracker

PHASE 2 — PRACTICE (adds after planner is stable)
  Warrior tab (Garrin) — foundation 7 days before disciplines open
  Keeper's Practice tab (Holli) — same foundation gate
  Shadow work: one position introduced per week, not all at once

PHASE 3 — DOCTRINE (adds after practice is stable)
  Doctrine tab — canon text available Day 1 of Phase 3
  Evening review (Garrin) / Evening tends itself (Holli)
  Daily quote card

PHASE 4 — HOUSEHOLD & RELATIONSHIP (adds after doctrine is stable)
  Household tab fully operational
  Couple activities schedulable
  Mood translation live
  Concord ceremony unlocks at Gate 3

PHASE 5 — DEPTH
  Language tabs (Vel'nar for Garrin)
  The Book tab
  Holy Days full observance system
  Full gated progression
```

---

## PART THREE: PHASE 1 — WHAT THE CALENDAR NEEDS TO WORK

### Must be operational on Day 1

**Firebase household connection**
- Household UUID generated on desktop app
- QR code scanned to join from phone
- Both phones reading from the same Firebase instance in real time
- Shift status (on-duty / off-duty) visible on planner header — Garrin's shift, visible on Holli's planner as a status indicator only, not as a detailed event

**Calendar / Daily Planner**
- Time-blocked daily view
- Event creation: title, time, duration, optional note
- Alarm attached to any event — fires on locked screen
- Recurring events: daily, weekly, custom
- Shared events: either phone creates, both see it
- Private events: device only, other phone never sees it
- Holy Day markers: appear automatically on calendar dates
- Meal plan slots: Nourish feeds into planner (breakfast / lunch / dinner)
- Morning declaration on open (type-specific)
- Daily quote card (Groq-generated, type-specific)

**Default alarms (fire Day 1 — no setup required)**

| App | Time | Alarm |
|-----|------|-------|
| Imperium | 5:30 AM | Morning — the system begins now |
| Imperium | 12:00 PM | Midday anchor |
| Imperium | 6:00 PM | Evening review opens |
| Imperium | 9:30 PM | Wind down — no new decisions |
| Tending | 6:30 AM | Morning — your day begins with you |
| Tending | 12:00 PM | Midday check in |
| Tending | 6:00 PM | Evening tends itself |
| Tending | 9:00 PM | Rest coming |

**Morning declarations**
- Garrin: "Power from within cannot be revoked."
- Holli: "The keeper of what matters is never powerless."

**What also rides on the planner from Day 1 (no extra build needed)**
- Hydration tracker: one-tap log, daily target (Garrin 100oz, Holli 96oz)
- Meal slots visible as anchors — ties Nourish to the day's structure
- Mood check-in: one tap, feeds household tab when ready

---

## PART FOUR: NOURISH TAB — COMPLETE SCOPE

### What GBP affects in the Nourish tab ONLY

Every recipe card has a GBP note at the bottom. That note covers:
- Portion size reduction for Holli
- Which texture modifications are needed
- Which components to eat first (protein always first)
- What to skip in early stages vs. maintenance stage
- Which recipes are GBP★ (optimal) vs. GBP* (compatible with modification)

GBP does NOT appear in: alarms, supplement tab, household tab, doctrine, warrior/keeper practice, or anywhere outside Nourish.

### Grocery categories

```
PRODUCE
PROTEINS
DAIRY & EGGS
PANTRY — OILS, VINEGARS & CONDIMENTS
PANTRY — GRAINS & LEGUMES
PANTRY — CANNED GOODS
PANTRY — BAKING & DRY GOODS
HERBS & SPICES (fresh)
HERBS & SPICES (dried)
FROZEN
BEVERAGES & TEAS
WELLNESS & SUPPLEMENTS
HOUSEHOLD BASICS
```

### Household basics (always on list — replenish as needed)

| Item | Notes |
|------|-------|
| Butter (unsalted) | Primary cooking fat |
| Butter (salted) | Table use |
| Whole milk | Household |
| Oat milk | Dairy alternative |
| Olive oil (extra virgin) | Primary cooking oil |
| Vegetable or canola oil | High-heat cooking, stir-fry |
| Sesame oil | Flavor finish only |
| White wine vinegar | Poaching eggs |
| Apple cider vinegar | General use |
| Rice vinegar | Asian dishes |
| Red wine vinegar | Dressings |
| Dijon mustard | Dressings, marinades, wraps |
| Regular mayo or olive oil mayo | Chicken salad |
| Low-sodium tamari | Asian cooking — GF version of soy sauce |
| Oyster sauce | Stir-fry |
| Hot sauce | Condiment |
| Honey | Cooking and sweetener |
| Maple syrup | Alternative sweetener |
| Vanilla extract | Baking, oats |
| Baking powder | Pancakes |
| Cornstarch | Sauce thickener |
| Cooking spray | Muffin tins |
| Parchment paper | Sheet pan cooking |
| Aluminum foil | Roasting |
| Ziplock bags (various) | Marinating, freezing |
| Paper towels | Drying chicken skin — critical step |

### Herbs & spices — full database
*(Auto-adds to grocery list when any recipe containing it is selected)*

**Dried spices**

| Spice | Recipes it appears in |
|-------|-----------------------|
| Smoked paprika | Hash, sheet pan chicken, chili, stir-fry, roasted chicken |
| Regular paprika | Chicken marinade, hash |
| Garlic powder | Nearly every savory recipe |
| Onion powder | Sheet pan chicken |
| Cumin | Chili, lentil soup, tacos, bowls, teriyaki |
| Coriander | Lentil soup, chickpea soup |
| Turmeric | Lentil soup, chickpea soup |
| Chili powder | Chili, stuffed peppers, tacos |
| Cayenne | Chili — Garrin only; omit from Holli's portion |
| Italian seasoning | Frittata, egg muffins, meatballs |
| Dried oregano | Chicken, stuffed peppers |
| Dried thyme | Roasted chicken, root vegetables, pork |
| Dried rosemary | Roasted chicken, pork tenderloin |
| Cinnamon | Oats, pancakes, overnight oats |
| Ginger powder | Honey garlic glaze |
| Red pepper flakes | Avocado toast, optional finish |
| Black pepper | Everything |
| Fine salt | Everything |
| Flaky salt (Maldon or kosher) | Finishing avocado toast, proteins |
| Everything Bagel seasoning | Rice cakes, avocado toast — check NF label |

**Fresh herbs (produce section)**

| Herb | Recipes it appears in |
|------|-----------------------|
| Fresh ginger root | All stir-fry and noodle dishes — buy a knob, freeze |
| Fresh garlic | Every recipe calling for "garlic cloves" |
| Fresh parsley | Meatballs, lemon herb chicken — natural folate source |
| Fresh basil | Meatball/marinara dishes |
| Fresh cilantro | Tacos, mango salsa, noodle bowls |
| Fresh rosemary sprigs | Roasted chicken (D-03, D-04), pork (D-06) |
| Fresh thyme sprigs | Herb roasted chicken (D-03) |
| Fresh dill | Cottage cheese snack (S-03) |
| Green onions / scallions | Stir-fry, grain bowls, fried rice — garnish |
| Fresh mint | Teas, optional garnish |

### Teas & wellness beverages
*(Listed in Nourish tab — addable to grocery list)*

**Cortisol support — morning and afternoon**

| Tea | Purpose |
|-----|---------|
| Holy basil / Tulsi | Adaptogen — stress and cortisol; daily safe, mild flavor |
| Ashwagandha (KSM-66) | Adaptogen — cortisol regulation; Garrin's primary |
| Rhodiola | Adaptogen — fatigue and cortisol; morning only, can be stimulating |
| Schisandra berry | Adaptogen — stress resilience |
| Green tea | L-theanine — calm focus; caffeinated, morning/midday only |
| Matcha (ceremonial) | L-theanine + caffeine — sustained focus; Garrin pre-cognitive work |
| Licorice root | Cortisol metabolism support; limit 1 cup/day |
| Passionflower | Anxiety and cortisol modulation; morning or midday |

**Sleep and wind-down — evening**

| Tea | Purpose |
|-----|---------|
| Chamomile | Classic sleep support, GABA modulation; 1–2 cups 1 hr before bed |
| Lemon balm | GABA and relaxation, reduces cortisol; daily safe, gentle |
| Passionflower (evening) | Sleep onset; strong when combined with chamomile |
| Lavender | Anxiolytic, sleep preparation; pairs with chamomile |
| Tart cherry | Natural melatonin precursor; 1 cup 1 hr before bed |
| Rooibos | Caffeine-free, antioxidant, gentle; any time including evening |
| Valerian root | Stronger sleep support; not for daily long-term use |
| Magnolia bark | Cortisol reduction before sleep; health food stores |

**Gut health and MTHFR support**

| Tea | Purpose |
|-----|---------|
| Ginger | Digestion, anti-inflammatory; safe daily |
| Nettle leaf | Natural folate + iron — high MTHFR value; daily safe |
| Dandelion root | Liver and methylation support; bitter, blend with honey |
| Red raspberry leaf | Magnesium + iron; pleasant flavor |
| Fennel seed | Digestion, bloating |
| Peppermint | Digestion, IBS support; GERD caution — relaxes esophageal sphincter |

**Hydration**

| Item | Notes |
|------|-------|
| Electrolyte powder (unflavored, NF) | LMNT or Redmond Re-Lyte — check NF |
| Coconut water (plain, no added sugar) | Natural electrolytes |

### Supplements
*(Listed in Nourish tab — separate section from grocery list)*

**Garrin — MTHFR + performance**

| Supplement | Notes |
|-----------|-------|
| Creatine monohydrate | 5g/day — cognitive and physical performance |
| Omega-3 (EPA + DHA) | 2g/day — Ni cognitive support |
| Magnesium glycinate | Evening — sleep, nervous system |
| Vitamin D3 + K2 | Morning |
| Methylfolate | NOT folic acid — MTHFR protocol |
| Lion's Mane mushroom | Morning — nerve growth factor, Ni support |
| Ashwagandha (KSM-66) | Morning or midday — cortisol regulation |
| Zinc | 15–25mg |
| B-complex (methylated) | Morning — all B vitamins in methylated forms |

**Holli — MTHFR (no GBP-specific supplement list — GBP is meal plan only)**

| Supplement | Notes |
|-----------|-------|
| Methylfolate | NOT folic acid — MTHFR protocol |
| Magnesium glycinate | Evening |
| Vitamin D3 + K2 | Morning |
| Omega-3 (EPA + DHA) | General health |
| B-complex (methylated) | Morning |

---

## PART FIVE: ALL KNOWN FEATURES — BOTH APPS

### Shared features (same Firebase data, different voice and register)

**Calendar & Planner**
- Daily time-blocked view
- Shared events (both phones)
- Private events (device only — other phone never sees them)
- Recurring events
- Alarms on any event — fires on locked screen
- Shift schedule display (Garrin's shift visible as status on Holli's planner)
- Holy Day markers — automatic on calendar dates
- Meal plan slots from Nourish
- Morning declaration on open
- Daily quote card (Groq-generated, type-specific)
- Practice session blocks (scheduled from Warrior / Keeper tab)
- Activity blocks (scheduled from Activities or Household tab)

**Nourish Tab**
- Full recipe card database (v3.1 — 45 cards)
- Recipe view: ingredients, method, GBP note (Holli), MTHFR note
- Serving scale (×0.5 to ×3)
- Meal plan: 3 meals + optional snacks per day
- Swap recipe function
- Dietary settings: food aversions, MTHFR protocol
- Grocery list: built by user tapping "+ Add" or "+ Add All" on recipe cards — no auto-generation
- Grocery list: categorized by section, check-off as you shop, share/export
- Manual item addition to grocery list
- Any herb/spice in a selected recipe auto-adds to grocery list
- Pantry staples list (household basics — replenish section)
- Wellness teas (cortisol, sleep, gut health — full database)
- Supplements (Garrin and Holli separately)
- Hydration tracker: daily target + log
- Household portion modifier: 2 adults

**Household Tab — All relationship content lives here**
- Mood journal (raw — stays on device, never goes to Firebase)
- Mood translation: Groq converts ESFJ↔INTJ register before syncing
- Partner mood display: translated, shown as dot score — never raw text or number
- *The Uncrowned Guide to the Unspent* — full text, Holli's field manual for Garrin
- *The Unspent Guide to the Uncrowned* — full text, Garrin's field manual for Holli
- Relationship repair section (full content from source docs):
  - Depletion recognition (INTJ signals + ESFJ signals — both visible in both apps)
  - Repair mechanics — what to do when one person is depleted
  - The Concord Protocol — formal repair sequence
  - Communication guides per situation type
- Couple activities (all schedulable — adds to BOTH planners simultaneously):
  - The Sharpening (weekly check-in, 20 min)
  - The Parallel Practice (same space, individual work)
  - The Shared Meal (cook together, no phones, 90 min)
  - The Holy Day Practice (all observances together)
  - The Repair Walk (post-conflict reset, 20–30 min, no processing during)
  - The Forge Day (quarterly — full day sovereign practice, one space)
  - The Concord Walk
- Concord of Houses ceremony:
  - Visible from Day 1 as "In Preparation"
  - Schedulable at Gate 3 (both practitioners)
  - Preparation timeline assigned by planner counting back from ceremony date
  - Sovereign Gift + Witness Gift preparation questions
  - Ceremony screen activates on scheduled date
  - Annual renewal (Day of the Woven Vow — November 11)
- Concord record: permanent log of ceremony date and renewal dates

**Holy Days Tab**
- Sacred calendar — all holy days with dates
- Countdown to next holy day
- Holy day detail: emotional atmosphere, four observance modes, symbolic anchors
- Type-specific register (Garrin sees INTJ observance, Holli sees ESFJ observance)
- Observance log
- Both apps get notification: day before + morning of

**The Book Tab**
- 8 movements of the canon text — available Day 1 of Phase 3
- Full reading view (typography differs per profile)
- Progress tracking
- Daily passage — rotates through current movement, feeds planner
- Unlocks: movements open progressively with gating

---

### Imperium-specific features (Garrin only)

**Warrior Tab**
- Foundation gate (Days 1–7): 5 elements, checked daily before disciplines open
  - Stance & Posture
  - Breath Control
  - Hip Mobility
  - Basic Ukemi
  - Shoulder Mobility
- Discipline selection (choose 1–3, add more as you progress)
- 5 disciplines — full self-teaching instructions, stage ladders, session logging:
  1. **Iaido** — sword drawing; line, precision, governed action
  2. **Kyudo** — Japanese archery; stillness, breath, release without grasping
  3. **Systema** — threshold survival; movement from non-readiness, hold escapes, breath under pressure
  4. **Throwing Daggers** — kinesthetic precision, Se integration; Kyudo alternative when unavailable
  5. **Physical Architecture** — 6 foundational movements, nasal breathing, progressive load
- Session log: discipline, stage, duration, focus quality (1–5), notes, correction to carry forward
- Progress charts: session frequency, stage progression, lift progression
- Free-range activities with Imperium focus directives
- Equipment list with purchase links per discipline

**Doctrine Tab (Imperium)**
- 6 Imperium canon pieces — The Uncrowned canon (INTJ voice):
  Oath · Creed · Litany · Covenant · Manifesto · Axiom
- Full text, readable Day 1 of Phase 3 — no gating on reading
- Shadow work: 8 INTJ Beebe positions — one introduced per week by planner
- Evening review: structured self-assessment — stays on device
- Daily doctrine prompt

**Vel'nar Language Tab**
- Full Vel'nar language guide
- Vocal coach (Groq-powered)
- IPA notation for all phonemes
- Vel-keth law: spoken once, never replayed — enforced in UI
- Stage ladder for progression
- Gate 1: first 3 lessons; Gate 2: full access

---

### Tending-specific features (Holli only)

**Keep Yourself Tab**
- Foundation assessment (Day 1 — 2 questions before pillars open)
- 5 pillars — full session instructions in ESFJ voice:
  1. **Foundation Flow** — floor-based movement, spinal articulation, breath integration; daily 20 min
  2. **Strength** — private program, no class, no instructor; 6 foundational movements; 3x/week
  3. **Breathwork** — daily 10 min minimum; nervous system reset for Fe depletion
  4. **Outdoor Walk** — solo, no headphones, 20–30 min; Ti development, no social field
  5. **Precision Skill** — user chooses one: daggers, archery, calligraphy, knitting/embroidery, instrument
- Session log: pillar, stage, duration, focus quality (1–5), notes
- Reflection question per pillar (e.g., "Were you present for it, or did you perform it?")
- Progress charts (rose #c47878 accent)
- Free-range activities with Tending focus directives

**Doctrine Tab (Tending)**
- 6 Tending canon pieces — The Unspent canon (ESFJ voice)
- Full text, readable Day 1 of Phase 3
- Shadow work: 8 ESFJ Beebe positions — one introduced per week by planner
- Morning Grounding Declaration on planner
- Evening tends itself: gentle close-of-day check-in
- Daily quote card (ESFJ register)

---

### Technical features

**Firebase sync**
- Real-time household sync — works regardless of location
- Shared data: meal plan, grocery list, mood translations (approved), shift status, holy days, couple activities, concord record
- Private data: journals, shadow work, practice logs, assessment results, rite records — device only, never Firebase

**Notifications & alarms**
- Background audio fires on locked screen — requires native app, not PWA
- Push notifications for couple activity reminders, holy days
- Holy Day: 1-week early notice + day-before + morning-of
- Practice session reminders: 15 min before scheduled block

**Home screen widget**
- Planner widget: next 3–4 items from day
- Grocery widget: current list with check-off
- Shift badge (on-duty / off-duty)
- Tap to open at correct tab

**Gated progression**
- Gate 1: Days 1–7 Foundation — planner + nourish only
- Gate 2: Day 7 Foundation complete — Warrior / Keep Yourself tab unlocks
- Gate 3: Day 14 — Doctrine tab + Household tab fully unlock; Concord schedulable
- Gate 4: Day 30 — Language tab + full Book access
- Locked content: always visible with lock icon and unlock requirement, never hidden

---

## PART SIX: ALL MATERIALS & ACTIONS — BY PRIORITY ORDER

Priority order = what must exist first → what supports daily life → what builds over time.

---

### TIER 1 — INFRASTRUCTURE (must work before anything else)

| # | Item | App |
|---|------|-----|
| 1 | Firebase household connection | Both |
| 2 | Daily planner with alarms | Both |
| 3 | Shift schedule sync | Both |
| 4 | Nourish tab — meal plan Day 1 | Both |
| 5 | Grocery list (user-driven via + Add on recipe cards) | Both |
| 6 | Hydration tracker | Both |

---

### TIER 2 — DAILY NON-NEGOTIABLES (what happens every day)

| # | Item | Who | Notes |
|---|------|-----|-------|
| 1 | Morning declaration | Both | Auto-displays on planner open |
| 2 | Daily quote card | Both | Groq-generated, type-specific |
| 3 | Meals logged / checked | Both | 3x daily via Nourish |
| 4 | Hydration logged | Both | Ongoing tap-to-log |
| 5 | Mood check-in | Both | One tap — feeds Household tab |
| 6 | Evening review | Garrin | 5–10 min, stays on device |
| 7 | Evening tends itself | Holli | Gentle close-of-day, stays on device |

---

### TIER 3 — PHYSICAL PRACTICE (builds after foundation gate clears — Day 7)

**Garrin — Warrior Practice disciplines (introduced in this order)**

| # | Discipline | Frequency | What it develops |
|---|-----------|-----------|-----------------|
| 1 | Foundation (Days 1–7) | Daily | Posture, breath, hip, ukemi, shoulder |
| 2 | Physical Architecture | 3x/week | Structural capacity for all martial work |
| 3 | Iaido | 3–5x/week | Ni precision, Te governed action |
| 4 | Kyudo | 2–3x/week | Ni stillness, Se release |
| 5 | Throwing Daggers | 2–3x/week | Se integration, Te calibration |
| 6 | Systema | 2x/week | Se threshold, breath under pressure |

**Holli — Keeper's Practice pillars (introduced in this order)**

| # | Pillar | Frequency | What it develops |
|---|--------|-----------|-----------------|
| 1 | Foundation Flow | Daily, 20 min | Body awareness without relational field |
| 2 | Breathwork | Daily, 10 min | Fe nervous system reset |
| 3 | Strength | 3x/week | Ti private standard, not for anyone else |
| 4 | Outdoor Walk | 3–5x/week | Ti + Ne, honest feedback, no social managing |
| 5 | Precision Skill | 2–3x/week | Ti — immediate feedback that cannot be socially managed |

---

### TIER 4 — SHADOW WORK (one position per week — never all at once)

Shadow work is the most psychologically significant practice. One position per week. Integration requires time. The planner introduces each one — the practitioner does not choose the order.

**Garrin — INTJ 8 Beebe positions**

| Week | Position | Function | Role | Core practice |
|------|----------|----------|------|---------------|
| 1 | 1 | Ni | Hero | The pattern you trust — learn to verify, not just trust |
| 2 | 2 | Te | Parent | The execution standard — when does Te become tyranny |
| 3 | 3 | Fi | Child | What you actually value beneath the system |
| 4 | 4 | Se | Inferior | The body, now, real — not the abstract idea of it |
| 5 | 5 | Ne | Opposing | Possibilities dismissed too quickly |
| 6 | 6 | Ti | Critical Parent | The internal critic — audit it like data |
| 7 | 7 | Fe | Trickster | The relational function you can manipulate without noticing |
| 8 | 8 | Si | Daemon | Accumulated pattern record — what you never forget |

**Key INTJ shadow activities:**
- Se (Inferior): Warrior disciplines 1–4 — presence demanded by the practice
- Fi (Child): Journal what you actually want, not what is logical
- Ne (Opposing): Write multiple contradictory possibilities and sit with them
- Fe (Trickster): One conversation where you listen without building your response
- Ti Critical Parent: Document one week of self-criticism, then audit it like data
- Daemon Si: One past decision revisited — what would you change

**Holli — ESFJ 8 Beebe positions**

| Week | Position | Function | Role | Core practice |
|------|----------|----------|------|---------------|
| 1 | 1 | Fe | Hero | Relational function — when does care become control |
| 2 | 2 | Si | Parent | Body of memory, routine, what feels safe |
| 3 | 3 | Ne | Child | Generative imagination — possibilities beyond the known |
| 4 | 4 | Ti | Inferior | Private logical structure — decisions from your own analysis |
| 5 | 5 | Fi | Opposing | What you want, independent of what others need |
| 6 | 6 | Se | Critical Parent | Sensory present — are you actually here |
| 7 | 7 | Ni | Trickster | The unconscious pattern — sensed but suppressed |
| 8 | 8 | Te | Daemon | Structural clarity that surfaces when something is wrong |

**Key ESFJ shadow activities (from ESFJ_Shadow_Work.docx):**
- Fi Opposing (highest priority): The Want List — 20 min, no relational filter, write only what you want
- Fi: One Day, Your Decisions Only — half day, every choice from your own preferences
- Ti Inferior: Precision skill (Keeper's Pillar 5) — honest feedback, cannot be socially managed
- Ti: One structural problem named per week in clear analytical language
- Se Critical Parent: Outdoor walk without phone — be in the body
- Ne Child: One creative project, no audience, no declared finish
- Te Daemon: One sentence per week — what isn't working and what needs to change
- Ni Trickster: Write one thing you sense but haven't said — examine whether it's true

---

### TIER 5 — RITES (one per tradition — significant milestones)

Every doctrine has a rite. Rites are not daily practice — they are threshold events that mark genuine change. They are not performed on a schedule; they are performed when the practitioner is ready and the gate is cleared.

**Garrin — The Rite of the Uncrowned**
- Available at Gate 3
- Preparation materials in Doctrine tab from Day 1 of Phase 3
- Marks completion of foundation and beginning of full practice
- Planner assigns preparation over 2 weeks before

**Holli — The Rite of the Unspent**
- Available at Gate 3
- Preparation materials in Doctrine tab from Day 1 of Phase 3
- Same preparation structure as Imperium, ESFJ voice and register

**The Concord of Houses (both together)**
- The union rite — performed together
- Available when BOTH are at Gate 3
- Schedulable from Household tab
- Three gifts: Sovereign Gift (from own tradition) + Witness Gift (for partner) + Concord Ritual (braided cord)
- Preparation: 6–8 weeks; planner assigns questions backward from ceremony date
- Annual renewal: Day of the Woven Vow — November 11

---

### TIER 6 — RELATIONSHIP MATERIALS (Household tab — all in one place)

Everything relationship-related lives in the Household tab. Nothing split across tabs.

**The two guides (full text — both visible to both)**
- *The Uncrowned Guide to the Unspent* — Garrin's field manual for understanding Holli (ESFJ)
- *The Unspent Guide to the Uncrowned* — Holli's field manual for understanding Garrin (INTJ)

**Relationship repair section**
- Depletion recognition: INTJ signals + ESFJ signals — what each looks like from the outside
- Repair mechanics: what to do when one person is depleted
- The Concord Protocol: formal repair sequence step by step
- Communication guides: what to say, what not to say, per situation type
- The Repair Walk: reset protocol before verbal processing

**Couple activities (schedulable — both planners simultaneously)**
- The Weekly Sharpening — 20 min check-in
- The Parallel Practice — same space, individual sovereign work
- The Shared Meal — cook together, eat together, no phones
- The Holy Day Practice — both observing the same day in their own register
- The Repair Walk — post-conflict nervous system reset
- The Forge Day — quarterly, full day sovereign practice in shared space
- The Concord Walk — joint walking practice

**Mood system**
- Garrin logs: private raw entry → Groq translates to ESFJ register → preview → approve → Firebase
- Holli sees: translated entry as dot score (never raw number, never raw text)
- Same in reverse
- Both can see: depletion signal range, "good capacity" range — no raw content ever crosses

---

### TIER 7 — DOCTRINE & CANON (Phase 3 — readable Day 1 of that phase)

**Garrin — Imperium canon (6 pieces)**

| Piece | Name |
|-------|------|
| 1 | The Oath |
| 2 | The Creed |
| 3 | The Litany |
| 4 | The Covenant |
| 5 | The Manifesto |
| 6 | The Axiom |

**Holli — Tending canon (6 pieces, ESFJ voice)**

| Piece | Name |
|-------|------|
| 1 | The Keeper's Foundation |
| 2 | The Law of the Tended Household |
| 3 | The Keeper's Practice Doctrine |
| 4 | The Shadow Work of the Keeper |
| 5 | The Unspent Rites |
| 6 | The Evening That Tends Itself |

---

### TIER 8 — HOLY DAYS (automatic on calendar — observance is the practice)

| Holy Day | Season | Focus |
|----------|--------|-------|
| The Day of First Naming | New Year | Identity declaration |
| The Audit of the Unspent | Spring | What has been done with what was given |
| The Shadow Rite | Summer | Confronting the 5th–8th function |
| The Embodiment Day | Late Summer | Full Se/Fi/Si engagement |
| The Concord of Houses | Fall | Household covenant |
| The Day of the Woven Vow | November 11 | Annual renewal |
| The Day of Lawful Return | Winter | What the year produced; what the vow requires |

Each holy day: 4 observance modes, emotional atmosphere, symbolic anchors. Both apps show the day; each person sees their own tradition's register for it.

---

### TIER 9 — LANGUAGE (Phase 5 — Gate 4)

| App | Language | Access |
|-----|----------|--------|
| Imperium | Vel'nar | Gate 1: first 3 lessons; Gate 2: full access |
| Tending | No language tab | Removed — Nen'thara vocal coach not built |

---

### TIER 10 — THE BOOK (Phase 5 — 8 movements)

Same content in both apps. Typography differs:
- Imperium: cool tones, upright letterforms, Cormorant 18px, line-height 2.0
- Tending: warm tones (#120a0e background, #f5e8ec text), Cormorant italic throughout

Daily passage feeds the planner. Progress tracked. No content gated — all readable once The Book tab unlocks.

---

## PART SEVEN: LIFESTYLE INTEGRATION PRINCIPLES

This is a lifestyle change. The app is a container, not a demand. These principles govern how everything is introduced:

**One thing at a time.** The planner introduces shadow work one position per week. It does not hand both people 8 shadow positions on Day 1. The warrior practice has a 7-day foundation gate before disciplines open. The doctrine tab doesn't exist until Phase 3.

**The practice fits the day.** The app suggests; the practitioner decides. A warrior session missed is not a failure — it is information. The planner adjusts forward, not backward.

**Private practice is private.** Garrin's warrior sessions, shadow work, and evening review are not visible to Holli unless he explicitly shares an event. Her keeper's practice and shadow work are not visible to him. The household tab shows connection, not surveillance.

**Shared things are genuinely shared.** Meals, couple activities, holy days, concord preparation — these appear on both planners because both people are in them. That's the whole list. Everything else is private.

**The rites are thresholds, not checkboxes.** No rite is performed on a schedule. They happen when the work is genuinely done and the person is genuinely ready. The app holds the preparation and paces the questions. The timing belongs to the practitioner.

**Gradual is not slow.** Phase 1 is one week. Phase 2 begins in week 2. Phase 3 begins in week 3. By week 5 the full system is accessible. The pacing is designed so neither person is overwhelmed — not so the app stays small.

---

## PART EIGHT: OPEN QUESTIONS

| # | Question | Affects |
|---|----------|---------|
| 1 | What is Garrin's shift schedule pattern? | On-duty/off-duty display on both planners |
| 2 | Which precision skill does Holli choose for Keeper's Pillar 5? | Equipment list |
| 3 | Are both phones iOS or Android or mixed? | Widget and notification implementation |
| 4 | Should the supplement log fire a notification or be a planner alarm? | Compliance mechanism |
| 5 | Is Holli in early post-op GBP stage or maintenance stage? | Portion sizing in recipe cards |

---

*SOVEREIGN WORKS MASTER FEATURE & MATERIALS DOCUMENT v2.0*
*Two users: Garrin (INTJ/Uncrowned/Imperium) and Holli (ESFJ/Unspent/Tending)*
*GBP affects Nourish tab only. Holli is in maintenance phase.*
*Planner privacy enforced. Household tab = all relationship content.*
*Rites included. Lifestyle pacing built into build order.*
