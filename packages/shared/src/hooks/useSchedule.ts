import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SleepWindow } from '../utils/sleepWindow';

export type ShiftType = 'day' | 'night';

export interface ShiftSchedule {
  isWorkDay: boolean;
  shiftType: ShiftType;
  shiftStart: string;
  shiftEnd: string;
  shiftLabel: string;
  sleepWindow: SleepWindow;
  overtimeHours: number;
  overtimeDate: string | null;
  anchorDate: string;
}

const STORAGE_KEY = 'schedule_v2';
const DEFAULT_ANCHOR = '2024-01-01';
const PATTERN_14 = [
  true, true, false, false, true, true, true,
  false, false, true, true, false, false, false,
];

type Persisted = {
  shiftType: ShiftType;
  anchorDate: string;
  overtimeHours: number;
  overtimeDate: string | null;
};

const DEFAULTS: Persisted = {
  shiftType: 'night',
  anchorDate: DEFAULT_ANCHOR,
  overtimeHours: 0,
  overtimeDate: null,
};

function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isWorkDayForDate(anchorDate: string, check: Date): boolean {
  const anchor = new Date(anchorDate);
  if (Number.isNaN(anchor.getTime())) return true;
  const monday = new Date(anchor);
  const dow = monday.getDay();
  monday.setDate(monday.getDate() - (dow === 0 ? 6 : dow - 1));
  monday.setHours(0, 0, 0, 0);

  const target = new Date(check);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - monday.getTime()) / 86400000);
  const idx = ((diffDays % 14) + 14) % 14;
  return PATTERN_14[idx];
}

function addHours12(time: string, hours: number): string {
  const [raw, ampm] = time.split(' ');
  const [h, m] = raw.split(':').map(Number);
  let total = (h % 12) + (ampm === 'PM' ? 12 : 0) + hours;
  total = ((total % 24) + 24) % 24;
  const nextAmpm = total >= 12 ? 'PM' : 'AM';
  const hour12 = total % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${nextAmpm}`;
}

function calcSleepWindow(shiftType: ShiftType, isWorkDay: boolean): SleepWindow {
  if (!isWorkDay) return { windDown: '9:30 PM', sleep: '10:30 PM', wake: '6:30 AM', note: 'Rest day' };
  if (shiftType === 'day') {
    return { windDown: '9:00 PM', sleep: '9:30 PM', wake: '5:00 AM', note: 'Pre-shift — full 8 hours' };
  }
  return { windDown: '6:30 AM', sleep: '7:00 AM', wake: '3:00 PM', note: 'Night shift — darken the room' };
}

export function useSchedule() {
  const [state, setState] = useState<Persisted>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setState({ ...DEFAULTS, ...(JSON.parse(raw) as Persisted) });
        } catch {
          setState(DEFAULTS);
        }
      }
      setLoaded(true);
    });
  }, []);

  const save = useCallback(async (next: Persisted) => {
    setState(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const today = useMemo(() => new Date(), []);
  const todayIso = toIso(today);
  const isWorkDay = isWorkDayForDate(state.anchorDate, today);
  const shiftStart = state.shiftType === 'day' ? '06:00' : '18:00';
  const shiftEnd = state.shiftType === 'day' ? '18:00' : '06:00';
  const otActive = state.overtimeHours > 0 && state.overtimeDate === todayIso;
  const baseSleep = calcSleepWindow(state.shiftType, isWorkDay);
  const shiftHours = otActive ? state.overtimeHours : 0;
  const sleepWindow = {
    ...baseSleep,
    wake: shiftHours ? addHours12(baseSleep.wake, shiftHours) : baseSleep.wake,
    sleep: shiftHours ? addHours12(baseSleep.sleep, shiftHours) : baseSleep.sleep,
    windDown: shiftHours ? addHours12(baseSleep.windDown, shiftHours) : baseSleep.windDown,
  };
  const shiftLabel = !isWorkDay
    ? 'OFF TODAY'
    : `${state.shiftType === 'day' ? 'DAY' : 'NIGHT'} SHIFT · Active ${state.shiftType === 'day' ? '04:30–22:00' : '15:30–07:00'}`;

  const setShiftType = useCallback(async (shiftType: ShiftType) => {
    await save({ ...state, shiftType });
  }, [save, state]);

  const setAnchorDate = useCallback(async (anchorDate: string) => {
    await save({ ...state, anchorDate });
  }, [save, state]);

  const setOvertime = useCallback(async (hours: number) => {
    await save({ ...state, overtimeHours: hours, overtimeDate: todayIso });
  }, [save, state, todayIso]);

  const cancelOvertime = useCallback(async () => {
    await save({ ...state, overtimeHours: 0, overtimeDate: null });
  }, [save, state]);

  const schedule: ShiftSchedule = {
    isWorkDay,
    shiftType: state.shiftType,
    shiftStart,
    shiftEnd,
    shiftLabel,
    sleepWindow,
    overtimeHours: otActive ? state.overtimeHours : 0,
    overtimeDate: state.overtimeDate,
    anchorDate: state.anchorDate,
  };

  return {
    ...schedule,
    loaded,
    setShiftType,
    setAnchorDate,
    setOvertime,
    cancelOvertime,
  };
}
