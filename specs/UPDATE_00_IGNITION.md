## CRITICAL — READ BEFORE ANYTHING ELSE

### THE PROTOTYPE SWITCHER IS FOR DEMONSTRATION ONLY

The file `sovereign_v7.jsx` has a profile toggle at the top (Garrin / Holli).
This exists only so you can see both profiles in one file during review.

**The actual build is TWO SEPARATE APKs.**
- `apps/imperium/` — Garrin's app. Profile is INTJ / Imperium. Hardcoded. No switcher.
- `apps/tending/` — Holli's app. Profile is ESFJ / Tending. Hardcoded. No switcher.

There is no profile switcher in either APK. A user installs one app.
They see one tradition. That is the whole point.

The prototype shows you what each profile looks like. Build them as two separate apps.
Code shared between them lives in `packages/shared/`.

---

### CURSOR WRITES ZERO CONTENT

Every word of content is already written. Cursor reads it. Cursor does not write it.

| File | What it contains | Cursor's job |
|------|-----------------|--------------|
| `RECIPE_CARDS_v3_1.md` | All 45 recipes, complete, with ingredients, instructions, tags, nutrition | Import and parse into TypeScript objects. Touch nothing. |
| `MASTER_IMPERIUM.md` | All Imperium doctrine, declarations, quotes, axioms, litanies, shadow work | Read and display. Do not rewrite or summarize. |
| `MASTER_TENDING.md` | All Tending doctrine, declarations, quotes, axioms, litanies, shadow work | Read and display. Do not rewrite or summarize. |
| `sovereign_v7.jsx` | Visual and behavioral reference for both apps | Match exactly. No invention. |

**If Cursor is tempted to write a quote, a declaration, a doctrine line, a recipe step, or any other content — stop. That content already exists in the files above. Find it there.**

The morning declarations are:
- Garrin: **"Power from within cannot be revoked."**
- Holli: **"The keeper of what matters is never powerless."**

These are not approximations. These are exact. Cursor uses them verbatim.

---

# SOVEREIGN WORKS — PHASE 1
# Read every file in the specs/ folder before writing any code.
# The prototype file sovereign_v7.jsx is the visual and behavioral contract.

---

## PROTOTYPE REFERENCE — READ THIS FIRST

The file `sovereign_v7.jsx` is the complete visual and behavioral reference.
Run it. Look at every screen. Every interaction. Every expanded state.

**Build rule:** Match the prototype exactly.
- Prototype wins on: visuals, colors, layout, interaction behavior, expansion animations, what is shown where
- Spec files win on: Firebase schema, data architecture, TypeScript interfaces, business logic

If you are ever unsure what something should look like — open the prototype and look.
Do not invent UI that is not in the prototype. Do not simplify screens. Do not add screens.
Build what is shown.

---

## FIREBASE PROJECT — CONFIRMED

**Project ID:** `sovereign-works-v4`
**Console:** https://console.firebase.google.com/project/sovereign-works-v4/overview
**Realtime Database URL:** `https://sovereign-works-v4-default-rtdb.firebaseio.com/`
**Auth:** Anonymous auth (no email/password — household code is the only credential)

Firebase config object — retrieve from:
Console → Project Settings → Your apps → Add web app → copy firebaseConfig

Do not hardcode any API keys. Store the firebaseConfig in `packages/shared/firebase/config.ts`
and load it at runtime. The config object is not secret but must not be committed to a public repo.

---

## THE HOUSEHOLD

| Person | Profile | Type | Shift | Phone |
|--------|---------|------|-------|-------|
| Garrin | imperium | INTJ — The Uncrowned | Law enforcement 2-2-3 rotating | Android |
| Holli | tending | ESFJ — The Unspent | Nurse — 12hr days or nights rotating | Android |

No children. No other members.
Holli: GBP maintenance phase. Affects Nourish tab only.
No assumed shift schedules. Both users set their own from scratch.

---

## CANONICAL DECLARATIONS — VERBATIM, DO NOT ALTER

**Garrin morning declaration:** "Power from within cannot be revoked."
Instruction shown in app: "Stand. Both feet on the floor. Speak this aloud before anything else."

**Holli morning declaration:** "The keeper of what matters is never powerless."
Instruction shown in app: "Twenty minutes of quiet first. The rest waits."

**Garrin axiom:** Uncrowned. Unbowed. Unbroken. Unfinished.
**Holli axiom:** Felt. Faithful. Full. Unspent.

---

## APK DELIVERY — NO PLAY STORE, NO SETUP.EXE

Both APKs are distributed as direct downloads. No Play Store. No Electron installer.

1. Build Imperium APK with Expo EAS or Android Studio Gradle
2. Build Tending APK with Expo EAS or Android Studio Gradle
3. Upload both APKs to GitHub Releases on repo: `xpliciton3/Imperium`
4. Users download APK directly from the GitHub Releases URL
5. Android prompts "Install from unknown sources" — user enables once and installs

There is no desktop app. There is no setup.exe. There is no QR code flow.
APK download URLs are shared directly (text message, email, etc.).

---

## HOUSEHOLD JOIN — 6-DIGIT CODE IN APP

No desktop required. No QR codes. No external tools.

**Flow:**
1. Garrin installs and opens the Imperium APK first
2. App shows: "Create Household" screen — enter a household name (e.g. "Bane")
3. App creates the Firebase household record and generates a 6-digit join code
4. App displays: "YOUR HOUSEHOLD CODE: 847-291" — large, readable, copyable
5. Garrin reads or texts the code to Holli
6. Holli installs and opens the Tending APK
7. App shows: "Join a Household" — enter the 6-digit code
8. Both phones now connected to the same Firebase household record
9. All shared data (calendar, mood translations, grocery list, shift schedules) syncs between both phones

The 6-digit code is stored in Firebase under `households/{householdId}/joinCode`.
It expires after 48 hours and can be regenerated from Settings if needed.

---

## PHASE 1 BUILD LIST

Build these — nothing else:
- Household join flow (6-digit code — see above)
- Shared Firebase backend (sovereign-works-v4)
- Shift work scheduler — all schedule types, no pre-populated defaults
- Sleep optimizer built from shift data
- Shared calendar with private/shared events
- Today planner — expandable checklist (see prototype)
- LOUD alarm system — max volume, full-screen lock, snooze, dismiss, are-you-awake
- Daily quote system — Groq-generated bank, offline fallback
- Mood tracker + bidirectional translator (Groq)
- Hydration tracker
- Nourish tab — 45 recipes from RECIPE_CARDS_v3_1.md, meal plan, grocery list with Add to Cart
- Dietary settings (NF/GERD/GF/DF hard filters; GBP/MTHFR priority filters)
- Settings screen
- Home screen widget (two sizes)
- Mind/Body/Soul hub on home screen
- Overtime tracker
- Prep flags on dinner cards

Do NOT build: Warrior, Keep Yourself, Doctrine, Household tab, Holy Days, Language, Rite, Book.
Those tabs are visible with lock icons but contain no content.

---

## RULES

1. Every screen matches sovereign_v7.jsx exactly.
2. Offline-first: SQLite is the source of truth. Firebase is the sync layer.
3. Alarm fires at maximum volume. Volume buttons do not stop it.
4. No assumed schedules. User sets their own from scratch.
5. Raw mood data never leaves the device. Only approved translations go to Firebase.
6. GBP notes render only in the Tending app. Absent from Imperium app entirely.
7. All 45 recipes come from RECIPE_CARDS_v3_1.md. Cursor does not write recipe content.
8. Dietary filters control which recipes appear in the meal plan rotation.
9. Morning declarations are verbatim — do not paraphrase, do not improve.
10. Do not create any content not already in the spec files or prototype.

---

## DEFAULT ALARMS (pre-loaded, adjustable in Settings)

| App | Time | Label |
|-----|------|-------|
| Imperium | 5:30 AM | The system begins now |
| Imperium | 12:00 PM | Midday anchor |
| Imperium | 6:00 PM | Evening review opens |
| Imperium | 9:30 PM | Wind down. No new decisions. |
| Tending | 6:30 AM | Your day begins with you |
| Tending | 12:00 PM | Midday check in |
| Tending | 6:00 PM | Evening tends itself |
| Tending | 9:00 PM | Rest is coming |

