import { WEEK_PLAN } from '../data/weekPlan';
import type { Profile } from '../types';
import type { SleepWindow } from '../utils/sleepWindow';
import { labelsFor } from './alarmLabels';
import { parseClock12 } from './timeParse';
import type { SovereignAlarm } from './types';

const HYDRATION_START = 7;
const HYDRATION_END = 21;

function parseTime24(time: string): { hour: number; minute: number } | null {
  const m = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return { hour: parseInt(m[1], 10), minute: parseInt(m[2], 10) };
}

export function buildHydrationAlarms(
  profile: Profile,
  goalMet: boolean,
  onDuty: boolean
): SovereignAlarm[] {
  if (goalMet) return [];
  const labels = labelsFor(profile);
  const interval = onDuty ? 60 : 90;
  const alarms: SovereignAlarm[] = [];
  let minutes = HYDRATION_START * 60;
  const end = HYDRATION_END * 60;
  let slot = 0;
  while (minutes < end && slot < 12) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    alarms.push({
      id: `${profile}-hydration-${slot}`,
      label: labels.hydration,
      hour,
      minute,
      days: [1, 2, 3, 4, 5, 6, 7],
      vibrate: false,
      snoozeMinutes: 9,
      alarmType: 'hydration',
      enabled: true,
    });
    minutes += interval;
    slot += 1;
  }
  return alarms;
}

export function buildHydrationFromTimes(
  profile: Profile,
  times: string[],
  goalMet: boolean
): SovereignAlarm[] {
  if (goalMet || times.length === 0) return [];
  const labels = labelsFor(profile);
  const alarms: SovereignAlarm[] = [];
  for (let i = 0; i < times.length; i += 1) {
    const parsed = parseTime24(times[i]);
    if (!parsed) continue;
    if (parsed.hour < HYDRATION_START || parsed.hour >= HYDRATION_END) continue;
    alarms.push({
      id: `${profile}-hydration-${i}`,
      label: labels.hydration,
      hour: parsed.hour,
      minute: parsed.minute,
      days: [1, 2, 3, 4, 5, 6, 7],
      vibrate: false,
      snoozeMinutes: 9,
      alarmType: 'hydration',
      enabled: true,
    });
  }
  return alarms;
}

export function buildBatchCookAlarms(profile: Profile, batchCookEnabled = true): SovereignAlarm[] {
  if (!batchCookEnabled) return [];
  const labels = labelsFor(profile);
  const alarms: SovereignAlarm[] = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let w = 0; w < WEEK_PLAN.length; w += 1) {
    for (let d = 0; d < WEEK_PLAN[w].days.length; d += 1) {
      const day = WEEK_PLAN[w].days[d];
      if (!day.batch) continue;
      const dayIndex = dayNames.indexOf(day.day);
      if (dayIndex < 0) continue;
      const dinnerName = day.meals.d;
      alarms.push({
        id: `${profile}-batch-w${w}-d${d}`,
        label: labels.batchcook(dinnerName),
        hour: 19,
        minute: 0,
        days: [dayIndex + 1],
        vibrate: true,
        snoozeMinutes: 9,
        alarmType: 'batchcook',
        enabled: true,
      });
    }
  }
  return alarms;
}

export function buildOvertimeWakeAlarm(
  profile: Profile,
  sleepWindow: SleepWindow,
  overtimeHours: number,
  isWorkDay: boolean
): SovereignAlarm | null {
  if (overtimeHours <= 0 || !isWorkDay) return null;
  const labels = labelsFor(profile);
  const wake = parseClock12(sleepWindow.wake);
  const totalMin = wake.hour * 60 + wake.minute + overtimeHours * 60;
  const hour = Math.floor((totalMin / 60) % 24);
  const minute = totalMin % 60;
  return {
    id: `${profile}-overtime-wake`,
    label: labels.wake,
    hour,
    minute,
    days: [1, 2, 3, 4, 5, 6, 7],
    vibrate: true,
    snoozeMinutes: 9,
    alarmType: 'overtime',
    enabled: true,
  };
}
