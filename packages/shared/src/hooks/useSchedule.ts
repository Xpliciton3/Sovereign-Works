import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SleepWindow } from '../utils/sleepWindow';
import {
  calcSleepWindowFromShift,
  formatShiftLabel,
  getDayStatus,
  type ScheduleType,
  type ShiftKind,
} from '../utils/scheduleEngine';

/** @deprecated use shiftKind — kept for planner/alarm callers */
export type ShiftType = 'day' | 'night';

export interface ShiftSchedule {
  isWorkDay: boolean;
  shiftType: ShiftType;
  shiftKind: ShiftKind;
  scheduleType: ScheduleType;
  shiftStart: string;
  shiftEnd: string;
  shiftLabel: string;
  sleepWindow: SleepWindow;
  overtimeHours: number;
  overtimeDate: string | null;
  anchorDate: string;
  customPatternDays: string;
}

const STORAGE_KEY = 'schedule_v3';
const DEFAULT_ANCHOR = '2024-01-01';

type Persisted = {
  scheduleType: ScheduleType;
  shiftKind: ShiftKind;
  shiftStart: string;
  shiftEnd: string;
  anchorDate: string;
  customPatternDays: string;
  overtimeHours: number;
  overtimeDate: string | null;
};

const DEFAULTS: Persisted = {
  scheduleType: '223',
  shiftKind: 'overnight',
  shiftStart: '18:00',
  shiftEnd: '06:00',
  anchorDate: DEFAULT_ANCHOR,
  customPatternDays: '',
  overtimeHours: 0,
  overtimeDate: null,
};

function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function shiftTypeFromKind(kind: ShiftKind): ShiftType {
  return kind === 'overnight' ? 'night' : 'day';
}

function kindFromShiftType(t: ShiftType): ShiftKind {
  return t === 'night' ? 'overnight' : 'days';
}

export function useSchedule() {
  const [state, setState] = useState<Persisted>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(async (raw) => {
      if (raw) {
        try {
          setState({ ...DEFAULTS, ...(JSON.parse(raw) as Persisted) });
          setLoaded(true);
          return;
        } catch {
          // migrate v2
        }
      }
      const legacy = await AsyncStorage.getItem('schedule_v2');
      if (legacy) {
        try {
          const v2 = JSON.parse(legacy) as {
            shiftType?: ShiftType;
            anchorDate?: string;
            overtimeHours?: number;
            overtimeDate?: string | null;
          };
          setState({
            ...DEFAULTS,
            shiftKind: kindFromShiftType(v2.shiftType ?? 'night'),
            shiftStart: v2.shiftType === 'day' ? '06:00' : '18:00',
            shiftEnd: v2.shiftType === 'day' ? '18:00' : '06:00',
            anchorDate: v2.anchorDate ?? DEFAULT_ANCHOR,
            overtimeHours: v2.overtimeHours ?? 0,
            overtimeDate: v2.overtimeDate ?? null,
          });
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
  const { isWork } = getDayStatus(state.anchorDate, state.scheduleType, state.customPatternDays, today);
  const isWorkDay = state.scheduleType === 'manual' ? true : isWork;
  const otActive = state.overtimeHours > 0 && state.overtimeDate === todayIso;
  const otH = otActive ? state.overtimeHours : 0;
  const sleepWindow = calcSleepWindowFromShift(
    state.shiftKind,
    state.shiftStart,
    state.shiftEnd,
    isWorkDay,
    otH
  );
  const shiftLabel = formatShiftLabel(isWorkDay, state.shiftKind, state.shiftStart, state.shiftEnd);
  const shiftType = shiftTypeFromKind(state.shiftKind);

  const setShiftType = useCallback(
    async (t: ShiftType) => {
      const kind = kindFromShiftType(t);
      await save({
        ...state,
        shiftKind: kind,
        shiftStart: t === 'day' ? '06:00' : '18:00',
        shiftEnd: t === 'day' ? '18:00' : '06:00',
      });
    },
    [save, state]
  );

  const setScheduleType = useCallback(
    async (scheduleType: ScheduleType) => {
      await save({ ...state, scheduleType });
    },
    [save, state]
  );

  const setShiftTimes = useCallback(
    async (shiftStart: string, shiftEnd: string) => {
      await save({ ...state, shiftStart, shiftEnd });
    },
    [save, state]
  );

  const setAnchorDate = useCallback(
    async (anchorDate: string) => {
      await save({ ...state, anchorDate });
    },
    [save, state]
  );

  const setCustomPattern = useCallback(
    async (customPatternDays: string) => {
      await save({ ...state, customPatternDays, scheduleType: 'custom' });
    },
    [save, state]
  );

  const setOvertime = useCallback(
    async (hours: number) => {
      await save({ ...state, overtimeHours: hours, overtimeDate: todayIso });
    },
    [save, state, todayIso]
  );

  const cancelOvertime = useCallback(async () => {
    await save({ ...state, overtimeHours: 0, overtimeDate: null });
  }, [save, state]);

  const schedule: ShiftSchedule = {
    isWorkDay,
    shiftType,
    shiftKind: state.shiftKind,
    scheduleType: state.scheduleType,
    shiftStart: state.shiftStart,
    shiftEnd: state.shiftEnd,
    shiftLabel,
    sleepWindow,
    overtimeHours: otH,
    overtimeDate: state.overtimeDate,
    anchorDate: state.anchorDate,
    customPatternDays: state.customPatternDays,
  };

  return {
    ...schedule,
    loaded,
    setShiftType,
    setScheduleType,
    setShiftTimes,
    setAnchorDate,
    setCustomPattern,
    setOvertime,
    cancelOvertime,
  };
}
