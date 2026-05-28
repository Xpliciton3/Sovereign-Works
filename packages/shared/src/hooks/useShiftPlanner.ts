import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Profile } from '../types';
import { getTodayPlanDay } from '../utils/todayPlan';
import type { SleepWindow } from '../utils/sleepWindow';
import type { ShiftType } from '../hooks/useSchedule';
import { generateShiftPlan, type DailySchedule } from '../ai/groqShiftPlanner';

const KEY_PREFIX = 'planner_schedule_';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useShiftPlanner(profile: Profile, shiftType: ShiftType, isWorkDay: boolean, wakeTime: string) {
  const [schedule, setSchedule] = useState<DailySchedule | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const date = todayIso();
    const key = KEY_PREFIX + date;
    AsyncStorage.getItem(key).then(async (raw) => {
      if (raw) {
        try {
          setSchedule(JSON.parse(raw) as DailySchedule);
          setLoaded(true);
          return;
        } catch {
          // regenerate
        }
      }
      const day = getTodayPlanDay();
      const shift = !isWorkDay ? 'off' : shiftType;
      const generated = await generateShiftPlan({
        tradition: profile,
        shiftType: shift,
        shiftStart: shift === 'day' ? '06:00' : shift === 'night' ? '18:00' : null,
        shiftEnd: shift === 'day' ? '18:00' : shift === 'night' ? '06:00' : null,
        wakeTime,
        plannerItems: ['decl', 'b', 'hyd', 'l', 'mid', 'd', 'inv', 'bed'],
        mealPlanToday: day.meals,
        practiceScheduled: isWorkDay,
        date,
      });
      setSchedule(generated);
      await AsyncStorage.setItem(key, JSON.stringify(generated));
      setLoaded(true);
    });
  }, [profile, shiftType, isWorkDay, wakeTime]);

  const refresh = useCallback(async () => {
    const date = todayIso();
    await AsyncStorage.removeItem(KEY_PREFIX + date);
    setLoaded(false);
  }, []);

  return { schedule, loaded, refresh };
}
