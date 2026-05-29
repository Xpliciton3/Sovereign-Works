import type { SleepWindow } from './sleepWindow';

export type ScheduleType = 'manual' | '223' | '410' | '312' | '247' | '4210' | 'swing' | 'custom';
export type ShiftKind = 'days' | 'overnight' | 'swing';

export const ROTATION_PATTERNS: Record<ScheduleType, boolean[] | null> = {
  manual: null,
  '223': [
    true, true, false, false, true, true, true,
    false, false, true, true, false, false, false,
  ],
  '410': [true, true, true, true, false, false, false],
  '312': [true, true, true, false, true, true, false],
  '247': [
    true, true, false, false, true, true, true,
    false, false, true, true, false, false, false,
  ],
  '4210': [true, true, true, true, false, false, true],
  swing: null,
  custom: null,
};

export function parseCustomPattern(input: string): boolean[] {
  const parts = input
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n) && n > 0);
  if (parts.length < 2) return [];
  const result: boolean[] = [];
  parts.forEach((count, idx) => {
    const isWork = idx % 2 === 0;
    for (let i = 0; i < count; i += 1) result.push(isWork);
  });
  return result;
}

export function getDayStatus(
  anchorDate: string,
  scheduleType: ScheduleType,
  customPatternDays: string,
  checkDate: Date = new Date()
): { isWork: boolean; positionInCycle: number; cycleLength: number } {
  if (scheduleType === 'manual') {
    return { isWork: false, positionInCycle: 0, cycleLength: 7 };
  }
  const anchor = new Date(`${anchorDate}T00:00:00`);
  const today = new Date(checkDate);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - anchor.getTime()) / 86400000);
  if (diffDays < 0) {
    return { isWork: false, positionInCycle: 0, cycleLength: 14 };
  }
  let pattern: boolean[] | null = ROTATION_PATTERNS[scheduleType] ?? null;
  if (scheduleType === 'custom' && customPatternDays) {
    pattern = parseCustomPattern(customPatternDays);
  }
  if (!pattern || pattern.length === 0) {
    return { isWork: false, positionInCycle: diffDays, cycleLength: 1 };
  }
  const cycleLength = pattern.length;
  const pos = ((diffDays % cycleLength) + cycleLength) % cycleLength;
  return { isWork: pattern[pos], positionInCycle: pos, cycleLength };
}

function fmtTime12(totalMins: number): string {
  const normalized = ((totalMins % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function toMins24(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function calcSleepWindowFromShift(
  shiftKind: ShiftKind,
  shiftStart: string,
  shiftEnd: string,
  isWorkDay: boolean,
  overtimeH = 0
): SleepWindow {
  if (!isWorkDay) {
    return {
      wake: '6:30 AM',
      windDown: '9:30 PM',
      sleep: '10:30 PM',
      note: 'Rest day — maintain anchor within 60 min.',
    };
  }
  const startM = toMins24(shiftStart);
  const endM = toMins24(shiftEnd);
  const isOvernight = endM < startM || shiftKind === 'overnight';
  const ot = overtimeH * 60;

  if (isOvernight) {
    const sleepAt = endM + 45 + ot;
    const riseAt = sleepAt + 450;
    const windDownAt = sleepAt - 30;
    return {
      wake: fmtTime12(riseAt),
      windDown: fmtTime12(windDownAt),
      sleep: fmtTime12(sleepAt),
      note: 'Night shift — blackout room. Sleep immediately post-shift.',
    };
  }

  const wakeAt = startM - 60 + ot;
  const sleepAt2 = wakeAt - 480;
  const windDown2 = wakeAt - 510;
  return {
    wake: fmtTime12(wakeAt),
    windDown: fmtTime12(windDown2),
    sleep: fmtTime12(sleepAt2),
    note: 'Rise time anchors the rhythm. Keep within 30 min on days off.',
  };
}

export function formatShiftLabel(
  isWorkDay: boolean,
  shiftKind: ShiftKind,
  shiftStart: string,
  shiftEnd: string
): string {
  if (!isWorkDay) return 'OFF TODAY';
  const fmt = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'P' : 'A';
    const h12 = h % 12 || 12;
    return `${h12}${ampm}`;
  };
  const kind = shiftKind === 'overnight' ? 'NIGHT' : shiftKind === 'swing' ? 'SWING' : 'DAY';
  return `${kind} SHIFT ${fmt(shiftStart)}–${fmt(shiftEnd)}`;
}
