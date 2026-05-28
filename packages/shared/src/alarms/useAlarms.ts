import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Profile } from '../types';
import type { SleepWindow } from '../utils/sleepWindow';
import { labelsFor } from './alarmLabels';
import { parseClock12, subtractMinutes } from './timeParse';
import type { SovereignAlarm } from './types';
import { rescheduleNativeAlarms } from './nativeBridge';

function storageKey(profile: Profile): string {
  return `sovereign_alarms_${profile}`;
}

export function buildSleepAlarms(
  profile: Profile,
  sleepWindow: SleepWindow,
  isWorkDay: boolean
): SovereignAlarm[] {
  const labels = labelsFor(profile);
  const wake = parseClock12(sleepWindow.wake);
  const sleep = parseClock12(sleepWindow.sleep);
  const wind = subtractMinutes(sleepWindow.sleep, 60);
  const alarms: SovereignAlarm[] = [
    {
      id: `${profile}-winddown`,
      label: labels.winddown,
      hour: wind.hour,
      minute: wind.minute,
      days: [1, 2, 3, 4, 5, 6, 7],
      vibrate: true,
      snoozeMinutes: 9,
      alarmType: 'winddown',
      enabled: true,
    },
    {
      id: `${profile}-sleep`,
      label: labels.sleep,
      hour: sleep.hour,
      minute: sleep.minute,
      days: [1, 2, 3, 4, 5, 6, 7],
      vibrate: true,
      snoozeMinutes: 9,
      alarmType: 'sleep',
      enabled: true,
    },
  ];
  if (isWorkDay) {
    alarms.unshift({
      id: `${profile}-wake`,
      label: labels.wake,
      hour: wake.hour,
      minute: wake.minute,
      days: [2, 3, 4, 5, 6],
      vibrate: true,
      snoozeMinutes: 9,
      alarmType: 'wake',
      enabled: true,
    });
  }
  return alarms;
}

export function useAlarms(profile: Profile) {
  const [alarms, setAlarms] = useState<SovereignAlarm[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(storageKey(profile)).then((raw) => {
      if (raw) {
        try {
          setAlarms(JSON.parse(raw) as SovereignAlarm[]);
        } catch {
          setAlarms([]);
        }
      }
      setLoaded(true);
    });
  }, [profile]);

  const persist = useCallback(
    async (next: SovereignAlarm[]) => {
      setAlarms(next);
      await AsyncStorage.setItem(storageKey(profile), JSON.stringify(next));
      await rescheduleNativeAlarms(next);
    },
    [profile]
  );

  const syncFromSleepWindow = useCallback(
    async (sleepWindow: SleepWindow, isWorkDay: boolean) => {
      const built = buildSleepAlarms(profile, sleepWindow, isWorkDay);
      const merged = [...built];
      for (const existing of alarms) {
        if (existing.alarmType === 'custom' || existing.alarmType === 'hydration') {
          merged.push(existing);
        }
      }
      await persist(merged);
      return merged;
    },
    [alarms, persist, profile]
  );

  const toggleAlarm = useCallback(
    async (id: string) => {
      const next = alarms.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a));
      await persist(next);
    },
    [alarms, persist]
  );

  const removeAlarm = useCallback(
    async (id: string) => {
      await persist(alarms.filter((a) => a.id !== id));
    },
    [alarms, persist]
  );

  return {
    alarms,
    loaded,
    syncFromSleepWindow,
    toggleAlarm,
    removeAlarm,
    persist,
  };
}
