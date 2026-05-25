import type { PlannerSectionType } from '../types';

export const PLANNER_SECTIONS: PlannerSectionType[] = [
  'declaration',
  'quote',
  'sleep_window',
  'meal',
  'hydration',
  'alarm_anchor',
  'mood_prompt',
  'warrior_session',
  'keeper_session',
  'doctrine_prompt',
  'evening_review',
  'couple_activity',
  'rite_milestone',
];

export const PHASE1_SECTIONS: PlannerSectionType[] = [
  'declaration',
  'quote',
  'sleep_window',
  'meal',
  'hydration',
  'alarm_anchor',
  'mood_prompt',
];

export function isPhase1Section(section: PlannerSectionType): boolean {
  return PHASE1_SECTIONS.includes(section);
}
