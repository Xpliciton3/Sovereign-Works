**THE IMPERIUM APP**

Full Feature Specification — The Sovereign Operating System for the Uncrowned

The Imperium  ·  The Uncrowned Order

**Uncrowned. Unbowed. Unbroken. Unfinished.**

# **Core Philosophy**

The app is not a reference library. It is not a tracker. It is a guided operating system for the Uncrowned day — it tells you what comes next, walks you through it, and logs that it happened. Every section connects to every other section through the doctrine thread. Nothing is orphaned. Nothing requires the user to already know where things live.

The single governing question for every design decision: does this help the Uncrowned act, or does it make them navigate? If it makes them navigate, simplify it until the action is obvious.

# **Architecture: Pre-Rite / Post-Rite Split**

The entire app operates in one of two modes. This is not cosmetic — the two modes have meaningfully different feature sets and different emotional register.

## **Pre-Rite Mode**

The onboarding corridor. The user has not yet formally entered The Imperium. This mode exists because the Rite of the Uncrowned is not supposed to be taken on day one. The app supports the period of preparation before it.

**Pre-Rite Mode surfaces:**

- Doctrine familiarization tools (read-first, no pressure)

- Tap-to-define glossary active across every screen from day one

- Vel'nar Tutor Stages 1–2 only; advancement-locked content visible but not accessible

- Beginner warrior and posture foundations (Stage 1 only)

- Routine scaffolding — habit-level completion, not formal tracked streaks

- Meal plan browsing and grocery planning (full access)

- Readiness Engine tracking progress toward Rite eligibility

- Full text of the Rite itself — readable, never activatable until Ready status confirmed

Pre-Rite Mode does not include: formal warrior stage progression logs, blade practice scoring, formal planner streaks, or any tracking that implies the formal practice has already begun.

## **Post-Rite Mode (Full Mode)**

Unlocked permanently after the Rite Completion Record is created. All sections open. Formal tracking begins. The Rite date becomes the anchor for all timeline features. Mode cannot be reversed.

# **Rite Completion Record**

When the user performs the Rite of the Uncrowned and records it in the app, the following is permanently written to local storage:

- Date (calendar date)

- Exact time (timestamp to the minute)

- Optional notes — private, freeform; what the moment was like

- Optional vow or reflection — not prompted unless the user opens it

- Optional location or witness note — purely optional

- Mode transition flag — the app switches permanently to Post-Rite mode

**This record is then referenced by:**

- Anniversary tracking — the Rite date is marked annually with a notification and optional re-reading prompt

- Days since Rite — displayed in the Progress section

- Timeline graphs — all warrior and blade progression anchored to Rite date as Day 0

- Calendar view — Rite date permanently marked and highlighted

The record cannot be deleted without a deliberate multi-step confirmation process. It is the most protected data point in the app.

# **Readiness Engine**

The app tracks readiness toward the Rite across nine categories. It does not just score them — it narrates where you actually are.

## **Nine Readiness Categories**

- Doctrine Comprehension — has the user read each of the six Canon pieces and the shadow chapter?

- Oath Familiarity — can they navigate the Oath, its short form, Vel'nar form, and line-by-line meaning?

- Litany Familiarity — can they navigate the Litany and have they used the Emergency version at least once?

- Glossary Knowledge — have enough tap-to-define interactions occurred across key terms to register familiarity?

- Vel'nar Basics — have they completed Vel'nar Tutor Stages 1–2?

- Movement / Posture Basics — have they logged at least one session in Warrior Practice Stage 1 for at least two disciplines?

- Routine Consistency — have they completed the daily flow at least 7 times total?

- Meal and Grocery Prep — have they reviewed the meal plan and used the grocery builder at least once?

- Rite Understanding — have they read the full text of the Rite at least once?

## **Readiness Output — Three Tiers**

**Not Ready:  **Lists which categories are untouched or critically underdeveloped. Names the specific actions that would move each category forward. No timeline pressure.

**Nearly Ready:  **Lists what is solid and what is weak. Presents a specific, short path to the final step. Encourages without crowding.

**Ready:  **Confirms all nine categories meet threshold. Surfaces the Rite activation button. Presents a brief preparatory prompt. The app never pressures — it informs.

# **Today — Guided Day Spine**

The Today section is the app's front door in Post-Rite mode. It presents the full day as a sequence of discrete steps, each of which the user enters, completes, logs, and exits before the next appears as the primary focus.

| **Step** | **Content** | **Features** |
| --- | --- | --- |
| Wake / Opening | Grounding breath, seiza or standing stillness | Timer (3–5 min), instructions, completion log |
| Morning Practice | Iaido, Kyudo, or Systema per current stage | Full practice guide, stage reference, timer, notes |
| Tea | Optional — cue for intentional pause | No timer. One-tap complete. |
| Breakfast | Day's breakfast from the 30-day plan | Recipe, timer if cooking, grocery note if missing items |
| Doctrine / Oath | Single Canon passage or the Oath | Full text, short form option, audio when available |
| Midday Practice | Systema breath work or review session | Timer, instruction, notes |
| Lunch | Day's lunch from the 30-day plan | Recipe, instructions, timer support |
| Warrior / Blade | Primary training session per current stage | Full warrior guide OR blade session entry |
| Evening Practice | Kyudo expansion, Iaido review, or mobility | Timer, instruction, notes |
| Litany / Close | Evening recitation and closing | Full Litany, short form, completion log, daily notes |

Each step also includes: opening instructions, full text or guide, timers (pre-set, adjustable), one-tap completion logging with optional note, skip/defer without breaking the day's record, and a subtle progression indicator for consecutive-day completion.

In Pre-Rite mode the Today spine is simplified: it presents a preparation routine (reading, movement, meal, vocabulary) without formal warrior stages or blade tracking.

# **Tappable Terms — Tooltips and Glossary Hyperlinks**

Every technical term in the app is interactive. No prior knowledge is assumed at any point. The system operates on two levels:

## **Level 1 — Inline Tooltip**

Every flagged term is visually marked in the text (underlined or in a distinct teal accent colour). A single tap anywhere on the term opens a tooltip panel that rises from the bottom of the screen — it does not navigate away, it does not interrupt the page, it overlays lightly and dismisses with a tap anywhere outside it.

**The tooltip contains:**

- The term — displayed prominently at the top

- Pronunciation guide — for Vel'nar terms and Japanese martial arts terms

- Audio play button — one tap to hear the canonical pronunciation

- Plain-English definition — 2 to 4 sentences; no jargon

- Body note — for physical terms: where it lives in the body, what it feels like

- Purpose in the practice — one sentence on why this term matters

- See Full Entry button — takes the user to the complete Glossary entry without losing their place in the original page (back navigation returns them exactly where they were)

## **Level 2 — Full Glossary Entry**

Accessed via the See Full Entry button in the tooltip, or by navigating directly to the Glossary section. The full entry contains everything the tooltip holds, plus:

- Common beginner mistakes associated with this term

- Safety or modification notes if the term is physical

- Related terms — tappable, each opens its own tooltip

- Which sections of the app this term appears in

- Doctrine connection — if the term has a Canon anchor

## **Term Behaviour by Category**

| **Term Category** | **Primary Behaviour** | **Secondary Behaviour** |
| --- | --- | --- |
| Vel'nar words | Tap → tooltip with pronunciation + meaning | Hold → full Glossary entry |
| Martial arts terms | Tap → tooltip with plain-English definition | Hold → full Glossary entry with body explanation |
| Jungian / Beebe terms | Tap → tooltip with function name + signature | Hold → full Glossary entry |
| Doctrine terms | Tap → tooltip with Canon connection | Hold → full Glossary entry |
| Physical training terms | Tap → tooltip with technique cue | Hold → full Glossary entry with safety note |

## **Technical Implementation Notes**

Terms are flagged at the content layer, not the rendering layer. This means the flagging is done when doctrine and practice content is written into the app — every instance of a term in every section is marked. The tooltip system is a single shared component called by any page with a flagged term.

- Visual marker: underline with gold (#B8962E) accent — distinct from standard links

- Tooltip animation: slide up from bottom, 200ms ease — does not cover more than 40% of screen

- Dismiss: tap outside, swipe down, or tap the X corner

- No tooltip stacking — opening a second tooltip closes the first

- Glossary link in tooltip preserves scroll position on return

- All tooltip text is offline-accessible (part of static app bundle)

# **Doctrine**

Doctrine is not buried. It is a first-class section reachable from the main nav, from the daily planner, from warrior practice pages, from holy days, from Vel'nar, and from the Emergency Litany shortcut on every screen.

## **Doctrine Section Contents**

- Oath — Quick form / Full form / Vel'nar form / Line-by-line meaning / When to use it

- Litany — Quick form / Full form / Emergency form / Usage guidance / Related stabilizing actions

- Core Doctrine — all six Canon pieces, individually accessible, bookmarkable, with user notes

- Holy Days — full module (see Holy Days section)

- Function and God Framework — Beebe's 8 functions in Imperium voice with Vel'nar names

- Warrior Principles — the doctrine-physical connection as a standalone doctrine piece

- Shadow Chapter — accessible with a threshold note; not hidden, not featured

- Bookmarks — user can bookmark any doctrine passage for quick return

- Recent Sections — last three doctrine pages accessed, surfaced at the top

## **Emergency Doctrine Panel**

A persistent floating button on every screen opens the Emergency Doctrine panel with one tap. It contains: Emergency Litany, short-form Oath, the Axiom, and one grounding breath cue. No navigation. No loading. One tap from anywhere in the app.

# **Vel****'****nar Tutor**

The Vel'nar Tutor is the highest-priority feature in the app. It is a complete self-teaching system for the language of The Imperium. Every layer is required; none is optional.

### **Layer 1 — Pronunciation Reference**

- Every root and word has a canonical pronunciation guide — phonetic in plain English

- Audio: canonical recordings or phonology-configured TTS (not generic TTS)

- Tap any Vel'nar word anywhere in the app to hear it pronounced

### **Layer 2 — Sound Library**

- Every consonant with place and manner of articulation

- Every vowel and diacritic with canonical audio

- Stress patterns and minimal pairs for commonly confused sounds

### **Layer 3 — Root Library**

- All 24 roots organized by the six Root Houses (Sovereignty, Witness, Endurance, Threshold, Sanctum, Rupture)

- Each root: base form, meaning, all 6 derivational forms, example compounds, usage notes, tap-to-hear

### **Layer 4 — Grammar Library**

- All 6 derivational markers with examples; Compound Law (space / hyphen / apostrophe)

- Speech registers (Rite / Witness / Verdict / Household) with example phrases per register

### **Layer 5 — Lesson Progression**

- Stage 1: Consonants and basic pronunciation

- Stage 2: Vowels, diacritics, threshold marker

- Stage 3: Root Houses and core vocabulary

- Stage 4: Grammar and derivation

- Stage 5: Register and extended composition

- Each stage unlocks only after the previous stage's test is passed

### **Layer 6 — Testing and Quizzes**

- Quiz types: pronunciation ID, meaning matching, root-to-derived form, register selection, composition prompts

- Mastery confirmed when test standard is met across two separate sessions — not just once

- Failed tests re-present only the specific material that was missed

### **Layer 7 — Score Tracking**

- Progress dashboard: current stage, test scores by stage, date of each advancement

- Locked stages visually indicated; no skipping permitted

# **Holy Days**

Each holy day is a distinct observance with its own emotional atmosphere, function connection, and feel. The app explicitly prevents them from feeling like the same audit ritual.

- Title and Vel'nar Name

- Associated Function / God (e.g., Son-nar / Ni, Vel-vek / Te)

- Date and symbolic reason for its calendar placement

- Emotional Atmosphere — what this day is supposed to feel like

- Preparation — what to do the day before or morning of

- Full Rite — complete observance ritual with timers and full text

- Distinct Observance Feel — explicit note on how this day differs from the others

- Four Lawful Ways to Keep the Day — full / partial / travel / minimal versions

- Related Doctrine and Related Practices

- Log and Notes — did you observe it? Optional reflection prompt

# **Practices — Warrior Practice Library**

Each discipline is organized as a true self-teaching library: beginner to advanced, with stage-based content that adjusts to the user's declared stage.

- Quick Version — the session in under 5 minutes of reading

- Full Instruction — complete technique guide per current stage

- Stage Selector — user sets current stage; all content adjusts

- Terms Used on This Page — every technical term is tappable from the first line

- Beginner / Intermediate / Advanced layers per discipline

- Common Mistakes — named, specific, with corrections

- Safety Notes — non-negotiable, prominently placed above the instruction

- Timers — preset for the stage's standard session length, adjustable

- Session Log — date, stage, duration, notes, one fault, one success

- Vel'nar term in the practice header — doctrine context, not decoration

# **Blade Practice Module**

- Reference Manual — grip, guard, draw, edge alignment, cut, chamber, pivot, recovery, noto. All terms tappable.

- Walkback Formats — structured slow-execution correction sessions per fault category

- Scoring and Distances — throwing: distances, rotation counts, target size standards, per-session scoring

- Session Logs — date, discipline, stage, throwing score, corrections applied

- Progress Graphs — throwing accuracy over time; session consistency; stage timeline

- Timers — for individual kata, full sessions, and walkback sets

- After-Action Review — post-session prompt: What was clean? What requires correction? What was the internal state?

# **Meals**

Meals are part of the operating system, not a recipe book. Each meal entry integrates with the planner, the grocery system, and the physical architecture doctrine.

- Recipe — full ingredient list with quantities scaled to one serving

- Instructions — step-by-step with embedded timers per cooking step

- Ingredient List — every item tappable to add to Store List or Online List instantly

- Term Definitions — cooking terms tap-to-define

- Prep Notes — what can be prepared ahead; what to substitute

- Doctrine Connection — one line connecting the meal to its nutritional architecture principle

- Grocery Integration — button to add all ingredients to the weekly grocery build

# **Dual Grocery System**

## **Store List**

- Quantity, category grouping (Proteins / Produce / Pantry / Dairy / Specialty)

- Mark as bought — one tap, strikes through; sort by category for store navigation

- Edit or remove individual items

## **Online List**

- Mark as ordered; source note if known (from meal plan sourcing data)

- Optional note field; optional link field

- The app flags 'source not confirmed' when no sourcing data exists — never fabricates availability

## **Weekly Grocery Builder**

- User selects a week of meals or accepts the plan default

- App rolls up all ingredients across all meals for the week

- Pantry check prompt — user marks what they already have

- Remaining items auto-populate to Store List or Online List per user preference

- Summary view: total unique ingredients organized by category

# **Litany and Oath Pages**

## **Litany**

- Quick Form — readable in under 30 seconds

- Full Form — complete version with full text

- Emergency / Break-Glass Version — stripped to its most stabilizing lines; large text, minimal chrome, no visible navigation

- Usage Guidance — when to use which form; morning / evening / threshold / crisis contexts

- Line-by-Line Meaning — each line with its doctrine connection

- Related Stabilizing Actions — breath pattern, posture cue, physical grounding action to accompany recitation

- Usage Log — optional logging of Litany uses by context

## **Oath**

- Quick Form / Full Form / Vel'nar Form with phonetic guide and tap-to-hear on each phrase

- Line-by-Line Meaning — each line in doctrine language, not paraphrase

- When to Use It — specific named circumstances: pressure, compromise, social compliance pull

- Related Practices — which warrior discipline connects to each line

# **Calendar and Alarms**

- Calendar View — monthly grid: holy days, logged warrior sessions, planned meals, planner completion days

- Today View — the Today spine accessible from the calendar date tap

- Routine Schedule — default daily flow time slots, user-adjustable

- Holy Day Reminders — 3-day advance and day-of notification

- Practice Reminders — user-set recurring alarms for morning practice, warrior session, Litany close

- Meal Reminders — optional, for meal timing

- Rite Anniversary — permanent annual notification on the Rite date

# **Progress Tracking**

Post-Rite mode only. Tracks across six dimensions. All graphs anchored to Rite date as Day 0.

- Rite Timeline — days since Rite, months since Rite, anniversary countdown

- Warrior Progress — sessions per discipline, current stage, stage advancement dates, 90-day test readiness

- Blade Practice Progress — session count, throwing accuracy trend, stage advancement

- Planner Consistency — days with complete daily flow, weekly completion percentage, streaks

- Vel'nar Progress — current stage, test scores by stage, advancement dates

- Meal and Grocery Adherence — days plan followed, grocery list completion rate

# **UI / UX Rules — Non-Negotiable**

- Phone-first. Every screen designed for a 6-inch vertical screen operated by thumb and stylus.

- Direct. The primary action on every screen is immediately visible and one tap.

- One tap to explanation. Any term, any instruction, any step — one tap reveals the tooltip.

- One tap to doctrine. Emergency doctrine panel reachable from anywhere.

- One tap to Emergency Litany. Persistent shortcut on every screen.

- No assumption of prior knowledge. The app explains itself from the first screen.

- Guided, not cluttered. Today presents one step at a time, not the whole day as a list.

- The app says: here is what to do next. Not: here are pages, navigate them yourself.

- Terms are marked visually with gold underline so users know they are tappable.

- Tooltip does not navigate away. It overlays and dismisses cleanly.

# **PWA / Install Layer**

- manifest.json with The Uncrowned Seal as the app icon

- Theme color: black (#0D0D0D) with gold accent (#B8962E)

- Standalone display mode — no browser chrome when installed

- Install-from-browser prompt on first visit if not already installed

- Offline capability for all static content: doctrine, Vel'nar library, meal plans, warrior guides

- Local persistence for all user data: Rite record, stage settings, logs, progress, grocery lists

# **Feature Priority Stack**

| **Priority** | **Feature** | **Phase** |
| --- | --- | --- |
| 1 | Vel'nar Tutor — full 7-layer system, audio-first, test-gated | Phase 1 |
| 2 | Daily Guided Spine (Today section end-to-end) | Phase 1 |
| 3 | Pre-Rite / Post-Rite architecture, mode split | Phase 1 |
| 4 | Rite Completion Record — permanent anchor | Phase 1 |
| 5 | Readiness Engine — 9 categories, narrative output | Phase 1 |
| 6 | Doctrine access + Emergency panel (one-tap from anywhere) | Phase 1 |
| 7 | Tappable Terms — tooltips and glossary hyperlinks | Phase 1 |
| 8 | Holy Days module — full per-day pages | Phase 2 |
| 9 | Warrior Practice library — stage-based, beginner-to-expert | Phase 2 |
| 10 | Blade Practice module — scoring, logs, graphs | Phase 2 |
| 11 | Dual Grocery System — store and online lists + weekly builder | Phase 2 |
| 12 | Progress Tracking — 6 dimensions with graphs | Phase 2 |
| 13 | Calendar and Alarms | Phase 2 |

**Uncrowned. Unbowed. Unbroken. Unfinished.**