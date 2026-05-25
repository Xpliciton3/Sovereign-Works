# GUIDED TOUR — FIRST OPEN + UPDATE PIPELINE

---

## FIRST OPEN FLOW

On first launch after APK install, the app runs a guided tour before showing anything else.
The tour is skippable at any point. Skipping saves state — it does not restart on next open.

### Tour Trigger Logic

```typescript
const shouldShowTour = async (tourKey: string): Promise<boolean> => {
  const completed = await AsyncStorage.getItem(tourKey);
  return completed === null; // null = never seen
};

// Tour keys:
// 'tour_v1_complete'     → Phase 1 initial tour
// 'tour_v2_complete'     → Phase 2 new-features tour
// 'tour_v3_complete'     → Phase 3 new-features tour
// (new key per app version that adds features)
```

If `tour_v1_complete` is null → show full tour.
If `tour_v1_complete` exists but `tour_v2_complete` is null → show new-features-only tour.

---

## PHASE 1 GUIDED TOUR — IMPERIUM

11 screens. Swipe right to advance. "Skip Tour" top-right on every screen.
Progress dots at bottom show position.

---

**Screen 1 — Welcome**
```
[Full screen — black, gold text]

THE IMPERIUM

You are The Uncrowned.

This app is your operating system.
Not a habit tracker. Not a wellness app.
An architecture for a specific kind of mind.

Let us show you what it does.

                              [Next →]
[Skip Tour]
```

---

**Screen 2 — The Planner**
```
[Annotated screenshot of the Today view with callout arrows]

YOUR DAILY PLANNER

Everything runs from here.

→ Your shift status (top)
→ Morning declaration (swipe to dismiss)
→ Today's quote
→ Your sleep window
→ Meals from your plan
→ Alarms with times
→ Hydration tracker

One screen. The whole day.

                              [Next →]
[Skip Tour]
```

---

**Screen 3 — Work Schedule (no assumptions)**
```
[Icon of a calendar with a shift pattern]

YOUR WORK SCHEDULE

The planner builds around your shifts.
Before it can do that, it needs to know your schedule.

We don't assume anything.

Next, we'll take you straight to schedule setup.
It takes about 2 minutes.

                    [Set Up Schedule →]
[Skip Tour — I'll do this later]
```

"Set Up Schedule →" → navigates to Settings → Work Schedule (not the full settings page, directly to the schedule sub-screen). After saving, returns to the tour at Screen 4.

"Skip Tour — I'll do this later" → marks Screen 3 skipped, continues tour. A persistent nudge card appears on the planner: "Your shift schedule isn't set. [Set it now →]" until dismissed.

---

**Screen 4 — Sleep Optimizer**
```
[Illustration of a sleep arc with shift blocks]

YOUR SLEEP IS PROTECTED

Once your schedule is set, the planner
calculates your optimal sleep window automatically.

Night shift ending at 6AM?
It moves your sleep window to day hours
and tells you when to be in bed.

Switching from nights to days?
It walks you through the transition.

                              [Next →]
[Skip Tour]
```

---

**Screen 5 — Alarms**
```
[Full-screen alarm mockup]

THE ALARM IS LOUD

It will wake you.

Volume buttons don't stop it.
Only these three buttons do:

  SNOOZE — comes back in 9 minutes
  DISMISS — stops it, but we'll check back
  I'M UP — confirms you're awake, opens the day

You can configure snooze time, max snoozes,
and the check-back delay in Settings.

                              [Next →]
[Skip Tour]
```

---

**Screen 6 — Nourish & Dietary Setup**
```
[Simple icon layout — no screenshot]

YOUR MEAL PLAN

30 days of meals. One household. Both of you.

Before we show you the plan, we need to know
what fits your household. This takes 20 seconds.

─────────────────────────────────────────────

HARD FILTERS — removes non-matching meals:
Nut Allergy          [toggle: OFF]
GERD                 [toggle: OFF]
Gluten-Free          [toggle: OFF]
Dairy-Free           [toggle: OFF]

PRIORITY FILTERS — surfaces best matches first:
GBP (Gastric Bypass) [toggle: ON]   ← pre-set if detected in profile
MTHFR                [toggle: ON]   ← pre-set if detected in profile

Prefer On-Duty meals on work days   [toggle: ON]

─────────────────────────────────────────────

These can be changed anytime in
Settings → Dietary Settings.

                              [Save & Continue →]
[Skip — I'll set this later]
```

**Pre-set logic:**
- GBP defaults to OFF. User turns it on if applicable.
- MTHFR defaults to OFF. User turns it on if applicable.
- Nut Allergy defaults to OFF. User turns it on if they have a nut allergy.
- All other filters default to OFF.
- The app does not pre-assume any conditions. The user declares them during setup.

- "Skip" saves defaults and continues. Settings remain accessible later.

The meal plan shown after this screen already filters to eligible recipes.
The user sees a working plan immediately — no blank state, no configuration loop.

---

**Screen 7 — Hydration**
```
[Hydration tracker mockup with progress bar]

HYDRATION

100 oz. Every day.

One tap to log. Progress bar on the planner.
Reminders adjust automatically around your shift.

                              [Next →]
[Skip Tour]
```

---

**Screen 8 — Mood & Partner**
```
[Split screen: mood entry / partner view]

YOU AND HOLLI

Your mood log is private.
Your raw words never leave this phone.

When you choose to share:
→ Your entry is translated into her language
→ She sees a tone, not a score
→ You see hers the same way

Two different minds. One household.

                              [Next →]
[Skip Tour]
```

---

**Screen 9 — Daily Quote**
```
[Quote card mockup]

EVERY DAY, ONE LINE

A quote built for your mind.
Same one all day. Changes at midnight.

Generated for the Uncrowned.
Stored on your phone — works offline.

                              [Next →]
[Skip Tour]
```

---

**Screen 10 — What's Coming**
```
[Lock icons with labels]

THE FORGE OPENS SLOWLY

This app grows with you. Each phase
unlocks after the previous one is stable.

🔒 Warrior Practice    — Phase 2
🔒 Doctrine            — Phase 3
🔒 Household           — Phase 4
🔒 Language            — Phase 5
🔒 The Book            — Phase 5

Build the foundation first.
Everything else is waiting.

                              [Next →]
[Skip Tour]
```

---

**Screen 11 — Begin**
```
[Full screen — black, gold Uncrowned Seal centered]

UNCROWNED.
UNBOWED.
UNBROKEN.
UNFINISHED.

                    [Begin →]
```

"Begin →" → marks `tour_v1_complete` in AsyncStorage. Opens the Planner tab.

---

## PHASE 1 GUIDED TOUR — TENDING

Same 11-screen structure. Different voice, different visuals.

Screen 1: "THE TENDING / You are The Unspent. / This app tends what matters. / Including you."
Screen 3: Same schedule setup flow, warm voice: "Before the planner can work around your life, it needs to know your schedule. / We don't guess. / Let's set it together."
Screen 8: Mood intro in ESFJ voice: "Garrin sees yours translated into his language. / He sees what he needs to know — not more."
Screen 8: Mood intro in ESFJ voice: "Garrin sees yours translated into his language. / He sees what he needs to know — not more."

**Screen 8b (Tending only) — Replenishment Session:**
```
[Simple calendar icon with a protected block]

YOUR REPLENISHMENT SESSION

Once per week. Two hours. Yours.

Not daily — that is not realistic.
Weekly. One protected window, scheduled now
so it repeats automatically.

Day:  ○ Mon  ○ Tue  ○ Wed  ○ Thu  ○ Fri  ● Sat  ○ Sun
Start time:  [9:00 AM]
Duration:    ● 2 hours  ○ 90 min  ○ Custom

[Schedule It — Repeats Weekly →]
[I'll do this later]
```

This screen only appears in the Tending app.
"Schedule It" creates a recurring calendar event immediately.
The event shows as protected time on the shared calendar.
Garrin's app shows the window as unavailable — no label, just blocked.

Screen 11: "FELT. FAITHFUL. FULL. UNSPENT." with Heart of Flame sigil centered.

---

## UPDATE PIPELINE — OTA UPDATES + TUTORIAL RESET

### Over-The-Air Update System

Uses Expo Updates (EAS Update) — free tier. Pushes JS bundle updates without a new APK install.

```typescript
// In app root — App.tsx
import * as Updates from 'expo-updates';

async function checkForUpdate() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      // Show update available banner (not a blocking modal)
      showUpdateBanner();
    }
  } catch (e) {
    // No network — silent fail, never block the app
  }
}

// Update banner (non-intrusive)
function UpdateBanner() {
  return (
    <TouchableOpacity onPress={() => Updates.reloadAsync()}>
      <View style={styles.updateBanner}>
        <Text>New version available — tap to update</Text>
      </View>
    </TouchableOpacity>
  );
}
```

### Version-Gated Tutorial System

Each app update that adds user-facing features gets a new tour version.
The tour key tracks which version of the tour the user has seen.

```typescript
// packages/shared/tour/tourVersions.ts

export const TOUR_VERSIONS = {
  v1: {
    key: 'tour_v1_complete',
    appVersion: '1.0.0',
    screens: 'full',                  // full tour
    description: 'Phase 1 base app',
  },
  v2: {
    key: 'tour_v2_complete',
    appVersion: '2.0.0',
    screens: 'new_features_only',     // only new screens
    description: 'Phase 2 — Warrior / Keep Yourself',
    newFeatures: [
      { tab: 'warrior', label: 'Warrior Practice', screen: 'warrior_intro' },
    ],
  },
  v3: {
    key: 'tour_v3_complete',
    appVersion: '3.0.0',
    screens: 'new_features_only',
    description: 'Phase 3 — Doctrine',
    newFeatures: [
      { tab: 'doctrine', label: 'Doctrine', screen: 'doctrine_intro' },
    ],
  },
};

// On app launch:
async function determineTourToShow(): Promise<TourVersion | null> {
  for (const version of Object.values(TOUR_VERSIONS).reverse()) {
    const seen = await AsyncStorage.getItem(version.key);
    if (!seen) return version; // show the oldest unseen tour first
  }
  return null; // all tours seen
}
```

### New-Features Tour Format (Phase 2+)

When a new version drops after an existing user has completed Phase 1 tour:

```
WHAT'S NEW IN 2.0

[Feature card 1 — Warrior Practice]
  The Forge is open.
  Your warrior disciplines are ready.
  Seven days of foundation before the disciplines unlock.
  [Show Me →]

[Feature card 2 — ...]

[Got It — Let's Go]
```

Maximum 3 cards per update tour. Brief. Celebratory. Not instructional.
Instruction lives in the feature itself.

### Manual Tutorial Reset (in Settings)

```
─── APP ──────────────────────────────────────
Restart App Tour      [Restart →]
```

Clears all `tour_vX_complete` keys. Restarts the full Phase 1 tour on next open.
Useful for: new household member learning the app, re-onboarding after long absence.

---

## HOW CURSOR ADDS A NEW TOUR (instructions for future phases)

When adding Phase 2:
1. Add a new entry to `TOUR_VERSIONS` in `tourVersions.ts`
2. Create the new-features screens in `packages/shared/tour/screens/v2/`
3. The version gate handles the rest automatically
4. Existing users see only the new-feature cards
5. New users see the full Phase 1 tour, then the Phase 2 tour immediately after

