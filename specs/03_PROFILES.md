# PROFILE DEFINITIONS — IMPERIUM & TENDING

---

## PROFILE OBJECTS

```typescript
import { IMPERIUM_COLORS, TENDING_COLORS } from './colors';

export const IMPERIUM_PROFILE: ProfileConfig = {
  id: 'imperium',
  displayName: 'The Imperium',
  personName: 'Garrin',
  practitionerTitle: 'The Uncrowned',
  motto: 'Uncrowned. Unbowed. Unbroken. Unfinished.',
  axiom: 'Power from within cannot be revoked. Uncrowned. Unbowed. Unbroken. Unfinished.',
  morningDeclaration: 'Power from within cannot be revoked.',
  colors: IMPERIUM_COLORS,
  hydrationTargetOz: 100,
  shiftType: 'law_enforcement',
  defaultAlarms: [
    { hour: 5, minute: 30, label: 'The system begins now', repeats: 'daily' },
    { hour: 12, minute: 0, label: 'Midday anchor', repeats: 'daily' },
    { hour: 18, minute: 0, label: 'Evening review opens', repeats: 'daily' },
    { hour: 21, minute: 30, label: 'Wind down. No new decisions.', repeats: 'daily' },
  ],
  quoteRegister: 'intj',
  partnerProfile: 'tending',
  partnerName: 'Holli',
};

export const TENDING_PROFILE: ProfileConfig = {
  id: 'tending',
  displayName: 'The Tending',
  personName: 'Holli',
  practitionerTitle: 'The Unspent',
  motto: 'Felt. Faithful. Full. Unspent.',
  axiom: 'The keeper of what matters is never powerless.',
  morningDeclaration: 'The keeper of what matters is never powerless.',
  colors: TENDING_COLORS,
  hydrationTargetOz: 96,
  shiftType: 'nursing',
  defaultAlarms: [
    { hour: 6, minute: 30, label: 'Your day begins with you', repeats: 'daily' },
    { hour: 12, minute: 0, label: 'Midday check in', repeats: 'daily' },
    { hour: 18, minute: 0, label: 'Evening tends itself', repeats: 'daily' },
    { hour: 21, minute: 0, label: 'Rest is coming', repeats: 'daily' },
  ],
  quoteRegister: 'esfj',
  partnerProfile: 'imperium',
  partnerName: 'Garrin',
  // Dietary conditions are stored in HouseholdDietarySettings (Firebase + AsyncStorage)
  // not hardcoded per profile. Set during onboarding. Adjustable in Settings → Dietary Settings.
  // Initial defaults based on household: GBP: true, MTHFR: true, NutAllergy: false, etc.
  // See 12_SETTINGS.md → Dietary Settings for the full settings UI and logic.
};
```

---

## PLANNER PRIVACY RULES

```typescript
export const PLANNER_VISIBILITY = {
  // These event types appear in BOTH planners
  SHARED: ['meal', 'couple_activity', 'holy_day', 'concord', 'repair_walk', 'shared_appointment'],

  // These event types appear in Garrin's planner ONLY (stored locally)
  IMPERIUM_ONLY: ['warrior_session', 'shadow_work', 'doctrine_checkin', 'rite', 'private'],

  // These event types appear in Holli's planner ONLY (stored locally)
  TENDING_ONLY: ['keepers_session', 'shadow_work', 'doctrine_checkin', 'rite', 'private'],
};
```

**Shift status visibility:**
- Garrin's on-duty/off-duty status shows on Holli's planner as a header badge only (e.g. "G: On Duty")
- Holli's shift status shows on Garrin's planner the same way (e.g. "H: On Duty — Night")
- Neither person sees the other's private planner events

---

## PHASE 1 NAVIGATION STRUCTURE

### Imperium (Garrin)
```
Tab 1: Planner         ← TODAY, Calendar, Shift View
Tab 2: Nourish         ← Meals, Grocery, Hydration, Supplements
Tab 3: Warrior         ← LOCKED — lock icon, "Available at Gate 2 (Day 7)"
Tab 4: Doctrine        ← LOCKED — lock icon, "Available at Gate 3 (Day 14)"
Tab 5: More            ← Settings, Mood Journal, Partner View
```

### Tending (Holli)
```
Tab 1: Planner         ← TODAY, Calendar, Shift View
Tab 2: Nourish         ← Meals, Grocery, Hydration, Supplements
Tab 3: Keep Yourself   ← LOCKED — lock icon, "Available at Gate 2 (Day 7)"
Tab 4: Doctrine        ← LOCKED — lock icon, "Available at Gate 3 (Day 14)"
Tab 5: More            ← Settings, Mood Journal, Partner View
```

Locked tabs are VISIBLE. They navigate to a single screen that says:
- Lock icon (large, centered)
- Tab name
- "This opens when your foundation is set." (Imperium voice) or "This opens when you're ready." (Tending voice)
- Days remaining counter if Gate criteria is known
- NO other content

