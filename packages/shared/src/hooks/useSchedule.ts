import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateSleepWindow, type SleepWindow } from '../utils/sleepWindow';

export interface ScheduleState {
  shiftStart: string;
  shiftEnd: string;
  workDays: Record<string, boolean>;
  overtimeHours: number;
}

const DEFAULT_SCHED: ScheduleState = {
  shiftStart: '19:00',
  shiftEnd: '07:00',
  workDays: { Mon: true, Tue: true, Wed: false, Thu: false, Fri: true, Sat: true, Sun: true },
  overtimeHours: 0,
};

export function useSchedule() {
  const [sched, setSched] = useState<ScheduleState | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('schedule_config').then((raw) => {
      if (raw) {
        try {
          setSched(JSON.parse(raw) as ScheduleState);
        } catch {
          setSched(null);
        }
      }
      setLoaded(true);
    });
  }, []);

  const saveSchedule = useCallback(async (next: ScheduleState) => {
    setSched(next);
    await AsyncStorage.setItem('schedule_config', JSON.stringify(next));
  }, []);

  const setOvertime = useCallback(
    async (hours: number) => {
      if (!sched) return;
      const next = { ...sched, overtimeHours: hours };
      await saveSchedule(next);
    },
    [sched, saveSchedule]
  );

  const todayShort = new Date().toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
  const isWorkDay = sched ? Boolean(sched.workDays[todayShort]) : false;
  const sleepWindow: SleepWindow | null = sched
    ? calculateSleepWindow(sched.shiftStart, sched.shiftEnd, isWorkDay)
    : null;

  return {
    sched: sched ?? DEFAULT_SCHED,
    loaded,
    isWorkDay,
    sleepWindow,
    saveSchedule,
    setOvertime,
    overtimeHours: sched?.overtimeHours ?? 0,
    hasSchedule: sched !== null,
  };
}
