import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Profile } from '../types';
import { getTodayPlanDay } from '../utils/todayPlan';
import type { SleepWindow } from '../utils/sleepWindow';
import type { ShiftType } from '../hooks/useSchedule';
import { generateShiftPlan, type DailySchedule } from '../ai/groqShiftPlanner';
import { getDatabase } from '../sqlite/db';

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
          const cached = JSON.parse(raw) as DailySchedule;
          setSchedule(cached);
          setLoaded(true);
          try {
            const db = await getDatabase();
            await db.runAsync(
              `INSERT OR REPLACE INTO planner_schedule (date, shift_type, schedule_json, generated_at, source)
               VALUES (?, ?, ?, ?, ?)`,
              date,
              shiftType,
              raw,
              Date.now(),
              'cache'
            );
          } catch {
            // ignore
          }
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
      try {
        const db = await getDatabase();
        await db.runAsync(
          `INSERT OR REPLACE INTO planner_schedule (date, shift_type, schedule_json, generated_at, source)
           VALUES (?, ?, ?, ?, ?)`,
          date,
          shift,
          JSON.stringify(generated),
          Date.now(),
          process.env.EXPO_PUBLIC_GROQ_API_KEY ? 'groq' : 'fallback'
        );
      } catch {
        // SQLite optional until db init
      }
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
