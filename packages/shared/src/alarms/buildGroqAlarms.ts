import type { DailySchedule } from '../ai/groqShiftPlanner';
import type { Profile } from '../types';
import type { SovereignAlarm } from './types';

function parsePlannerTime(t: string): { hour: number; minute: number } | null {
  const raw = t.trim();
  if (/AM|PM/i.test(raw)) {
    const [time, ampm] = raw.split(' ');
    const [hRaw, mRaw] = time.split(':');
    let hour = Number(hRaw) % 12;
    if (ampm?.toUpperCase() === 'PM') hour += 12;
    return { hour, minute: Number(mRaw) || 0 };
  }
  const m = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return { hour: parseInt(m[1], 10), minute: parseInt(m[2], 10) };
}

export function buildGroqPlannerAlarms(
  profile: Profile,
  schedule: DailySchedule | null | undefined
): SovereignAlarm[] {
  if (!schedule?.scheduledItems?.length) return [];
  const out: SovereignAlarm[] = [];
  for (const item of schedule.scheduledItems) {
    if (!item.alarm) continue;
    const parsed = parsePlannerTime(item.time);
    if (!parsed) continue;
    out.push({
      id: `${profile}-groq-${item.id}`,
      label: item.label,
      hour: parsed.hour,
      minute: parsed.minute,
      days: [1, 2, 3, 4, 5, 6, 7],
      vibrate: true,
      snoozeMinutes: 9,
      alarmType: 'custom',
      enabled: true,
    });
  }
  return out;
}
