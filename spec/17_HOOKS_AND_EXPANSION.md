# 17 — HOOKS AND EXPANSION — TYPESCRIPT INTERFACES

## ALL INTERFACES

```typescript
// packages/shared/types/index.ts
// Cursor creates this file verbatim from these definitions

export type Tradition = 'imperium' | 'tending';
export type GroceryCategory = 'produce' | 'protein' | 'dairy' | 'grains' | 'pantry' | 'spice' | 'beverage' | 'ceremony';
export type AlarmType = 'wake' | 'winddown' | 'sleep' | 'hydration' | 'batchcook' | 'overtime' | 'custom';
export type SyncStatus = 'connected' | 'offline' | 'syncing' | 'error';
export type MoodTab = 'log' | 'partner' | 'history';
export type NourishTab = 'plan' | 'grocery' | 'ceremony';
export type PlannerSubTab = 'today' | 'calendar' | 'schedule';
export type PlannerItemId = 'decl' | 'quiet' | 'hyd' | 'mid' | 'b' | 'l' | 'd' | 'inv' | 'yours' | 'bed';

export interface CartItem {
  name:    string;
  amt:     string;
  unit:    GroceryCategory;
  count:   number;      // increments on duplicate, never creates second row
  checked: boolean;
  addedBy?: string;     // uid of who added — for 'added by' dot in shared cart
  where?:  string;      // for ceremony items: where to buy
  updatedAt: number;
}

export interface Ingredient {
  name: string;
  amt:  string;
  unit: GroceryCategory;
  where?: string;       // ceremony items only
}

export interface NutritionInfo {
  cal:   number;
  p:     number;  // protein g
  c:     number;  // carbs g
  f:     number;  // fat g
  fiber: number;
}

export interface Recipe {
  id?:        string;   // B-01, L-03, D-07 — optional
  name:       string;
  category?:  'breakfast' | 'lunch' | 'dinner' | 'snack';
  tags:       string[];
  ing:        Ingredient[];
  steps:      string[];
  macros?:    NutritionInfo;
  gbpNote?:   string;   // Tending app only
}

export interface PlanDay {
  day:    string;
  batch?: boolean;
  meals:  { b: string; l: string; d: string; };
  tags:   { b: string[]; l: string[]; d: string[]; };
}

export interface WeekPlan {
  week:  string;
  days:  PlanDay[];
}

export interface DietarySettings {
  nutAllergy:  boolean;
  gerd:        boolean;
  glutenFree:  boolean;
  dairyFree:   boolean;
  mthfr:       boolean;
  gbp:         boolean;  // Tending only
  onDutyFirst: boolean;
}

export interface SleepWindow {
  windDown: string;  // "9:30 PM"
  sleep:    string;  // "10:30 PM"
  wake:     string;  // "6:30 AM"
  note:     string;
}

export interface AlarmConfig {
  id:           string;
  label:        string;
  hour:         number;
  minute:       number;
  days:         number[];  // 1=Sun...7=Sat; empty = one-time
  vibrate:      boolean;
  snoozeMinutes: number;   // default 9
  alarmType:    AlarmType;
  enabled:      boolean;
}

export interface MoodEntry {
  id:          string;
  score:       number;  // 1-10, raw — never leaves device
  note?:       string;  // raw note — never leaves device
  translation: string;  // bracket text from prototype
  dotScore:    number;  // Math.ceil(score/2), 1-5 — syncs to Firebase
  loggedAt:    number;
  synced:      boolean;
}

export interface HouseholdMember {
  uid:         string;
  displayName: string;
  tradition:   Tradition;
  joinedAt:    number;
}

export interface HouseholdMeta {
  householdId: string;   // "IMP-284751"
  createdAt:   number;
  memberA:     HouseholdMember;
  memberB?:    HouseholdMember;
}

export interface PlannerItem {
  id:       PlannerItemId;
  label:    string;
  time?:    string;
  category: string;      // "MEAL" | "PRACTICE" | "REST" | "HYDRATION"
  done:     boolean;
  color:    string;      // hex dot color
}

export interface ShiftSchedule {
  type:       '223' | 'custom';
  startDate:  string;  // ISO date of pattern start
  shiftHours: { start: string; end: string; };  // "06:00", "18:00"
  workDays:   Record<string, boolean>;  // Mon-Sun flags
  overtimeH:  number;  // 0 if no overtime active
  overtimeDate?: string; // ISO date OT applies to
}

export interface HydrationLog {
  id:        string;
  profile:   string;   // 'IMP' | 'TEND'
  oz:        number;
  loggedAt:  number;
}

export interface QuoteEntry {
  id:      string;
  profile: string;
  text:    string;
  month:   string;   // "2025-01"
  used:    boolean;
}
```

## HOOK CONTRACTS

```typescript
// useCart.ts
interface UseCartReturn {
  cart:               Record<string, CartItem>;
  addIngredient:      (ing: Ingredient) => void;
  addAllIngredients:  (mealName: string) => void;
  addCeremonySupplies:(ceremonyKey: string) => void;
  removeCartItem:     (key: string) => void;
  toggleChecked:      (key: string) => void;
  clearChecked:       () => void;
  itemCount:          number;
  checkedCount:       number;
}

// useHydration.ts
interface UseHydrationReturn {
  logOz:       (oz: number, profile: string) => void;
  totalOz:     number;
  goalOz:      number;        // 80 default, 96 on shift
  pct:         number;        // 0-1
  goalMet:     boolean;
}

// useMood.ts
interface UseMoodReturn {
  logMood:        (score: number, note?: string) => void;
  todayScore:     number | null;
  todayTranslation: string;
  partnerDotScore: number | null;
  history:        MoodEntry[];
  activeTab:      MoodTab;
  setActiveTab:   (tab: MoodTab) => void;
}

// useSchedule.ts
interface UseScheduleReturn {
  schedule:         ShiftSchedule;
  sleepWindow:      SleepWindow;
  isWorkDay:        boolean;
  setOvertime:      (hours: number) => void;
  cancelOvertime:   () => void;
  overtimeActive:   boolean;
  shiftLabel:       string;   // "Day Shift 6A–6P" | "Off"
}

// usePlanner.ts
interface UsePlannerReturn {
  items:      PlannerItem[];
  toggleDone: (id: string) => void;
  todayKey:   string;   // "2025-01-14"
  doneCount:  number;
  totalCount: number;
}

// useHousehold.ts
interface UseHouseholdReturn {
  householdId:  string | null;
  members:      HouseholdMeta | null;
  syncStatus:   SyncStatus;
  createHousehold: () => Promise<void>;
  joinHousehold:   (code: string) => Promise<void>;
  shareCode:       string | null;
}
```
