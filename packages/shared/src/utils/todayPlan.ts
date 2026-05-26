import { WEEK_PLAN } from '../data/weekPlan';
import type { PlanDay } from '../types/layer2';

/** Monday = 0 … Sunday = 6 */
export function getTodayPlanDay(weekIndex = 0): PlanDay {
  const todayIdx = (new Date().getDay() + 6) % 7;
  const week = WEEK_PLAN[weekIndex] ?? WEEK_PLAN[0];
  return week.days[todayIdx] ?? week.days[0];
}
