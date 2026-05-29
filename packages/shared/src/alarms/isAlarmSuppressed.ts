import { parseClock12 } from './timeParse';

function minutesOfDay(hour: number, minute: number): number {
  return hour * 60 + minute;
}

function clockToMinutes(clock: string): number {
  const p = parseClock12(clock);
  return minutesOfDay(p.hour, p.minute);
}

/** Wind-down / sleep must not fire during active shift (07_ALARM_SYSTEM_FIXED). */
export function isAlarmSuppressed(
  fireHour: number,
  fireMinute: number,
  isWorkDay: boolean,
  activeWindowStart: string | null | undefined,
  activeWindowEnd: string | null | undefined
): boolean {
  if (!isWorkDay || !activeWindowStart || !activeWindowEnd) return false;

  const fire = minutesOfDay(fireHour, fireMinute);
  const start = clockToMinutes(activeWindowStart);
  let end = clockToMinutes(activeWindowEnd);

  if (end <= start) {
    return fire >= start || fire <= end;
  }
  return fire >= start && fire <= end;
}
