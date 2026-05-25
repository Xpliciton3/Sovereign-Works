export type Profile = 'imperium' | 'tending';

export type AlarmRepeat = 'daily' | 'weekdays' | 'once';

export interface AlarmConfig {
  id?: string;
  hour: number;
  minute: number;
  label: string;
  repeats: AlarmRepeat;
  enabled?: boolean;
}

export interface AreYouAwakeConfig {
  enabled: boolean;
  delayMinutes: 1 | 2 | 5 | 10;
  maxSnoozes: number;
  snoozeDurationMinutes: number;
}

export interface ProfileConfig {
  id: Profile;
  displayName: string;
  personName: string;
  practitionerTitle: string;
  motto: string;
  axiom: string;
  morningDeclaration: string;
  morningDeclarationInstruction: string;
  hydrationTargetOz: number;
  shiftType: 'law_enforcement' | 'nursing';
  defaultAlarms: AlarmConfig[];
  quoteRegister: 'intj' | 'esfj';
  partnerProfile: Profile;
  partnerName: string;
}

export interface HouseholdMember {
  profile: Profile;
  personName: string;
  deviceToken?: string;
  joinedAt: number;
}

export interface HouseholdConfig {
  householdId: string;
  householdName: string;
  createdAt: number;
  joinCode: string;
  joinCodeExpiry: number;
  members: Partial<Record<Profile, HouseholdMember>>;
}

export type ScheduleType =
  | 'rotating_223'
  | 'rotating_3112'
  | 'custom'
  | 'standard'
  | 'variable';

export interface ShiftOverride {
  status: 'on' | 'off' | 'modified';
  startHour?: number;
  note?: string;
}

export interface ShiftConfig {
  scheduleType: ScheduleType;
  shiftLength: number;
  shiftStartHour: number;
  isNightShift?: boolean;
  cycleStartDate: string;
  patternDays: number[];
  overrides: Record<string, ShiftOverride>;
}

export type CalendarEventType =
  | 'personal'
  | 'shared'
  | 'appointment'
  | 'couple'
  | 'holyDay'
  | 'rite';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  type: CalendarEventType;
  notes?: string;
  addedBy: Profile;
  visibility: 'shared' | Profile;
  createdAt: number;
  alarmMinutesBefore: number;
}

export interface MoodTranslatedEntry {
  translatedText: string;
  dotScore: number;
  approved: boolean;
  timestamp: number;
}

export interface MoodRawEntry {
  id: string;
  date: string;
  rawScore: number;
  category: string;
  rawText: string;
  timestamp: number;
}

export type GroceryCategory =
  | 'PRODUCE'
  | 'PROTEINS'
  | 'DAIRY'
  | 'PANTRY_OILS'
  | 'PANTRY_GRAINS'
  | 'PANTRY_CANNED'
  | 'PANTRY_BAKING'
  | 'HERBS_FRESH'
  | 'HERBS_DRIED'
  | 'FROZEN'
  | 'BEVERAGES'
  | 'WELLNESS'
  | 'HOUSEHOLD';

export interface GroceryItem {
  id: string;
  name: string;
  category: GroceryCategory;
  quantity: string;
  unit: string;
  checked: boolean;
  addedBy: Profile;
  recipeSource?: string;
  addedAt: number;
  updatedAt: number;
}

export interface HouseholdDietarySettings {
  nutAllergy: boolean;
  gbp: boolean;
  mthfr: boolean;
  gerd: boolean;
  gf: boolean;
  df: boolean;
}

export interface HydrationDayRecord {
  targetOz: number;
  loggedOz: number;
  entries: Array<{ oz: number; timestamp: number; type: 'water' | 'tea' | 'other' }>;
}

export interface SyncQueueItem {
  id: string;
  path: string;
  data: string;
  updatedAt: number;
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
  category: GroceryCategory;
}

export interface Recipe {
  id: string;
  name: string;
  tags: string[];
  baseServes: string;
  prepTime: string;
  cookTime: string;
  ingredients: RecipeIngredient[];
  method: string[];
  nutrition?: string;
  gbpNote?: string;
  prepNote?: string;
  batchNote?: string;
}

export type PlannerSectionType =
  | 'declaration'
  | 'quote'
  | 'sleep_window'
  | 'meal'
  | 'hydration'
  | 'alarm_anchor'
  | 'mood_prompt'
  | 'warrior_session'
  | 'keeper_session'
  | 'doctrine_prompt'
  | 'evening_review'
  | 'couple_activity'
  | 'rite_milestone';

export interface TabConfigItem {
  key: string;
  label: string;
  icon: string;
  locked: boolean;
  unlocksIn?: string;
  lockMessage?: string;
}
