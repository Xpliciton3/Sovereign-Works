import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Profile } from '../types';
import type { SleepWindow } from '../utils/sleepWindow';
import type { DailySchedule } from '../ai/groqShiftPlanner';
import { labelsFor } from './alarmLabels';
import { logAlarmScheduled } from './alarmLog';
import {
  buildBatchCookAlarms,
  buildHydrationFromTimes,
  buildOvertimeWakeAlarm,
} from './buildExtendedAlarms';
import { parseClock12, subtractMinutes } from './timeParse';
import type { SovereignAlarm } from './types';
import { rescheduleNativeAlarms } from './nativeBridge';
import { checkAlarmPermissions } from './permissionsFlow';

function storageKey(profile: Profile): string {
  return `sovereign_alarms_${profile}`;
}

const NOTIF_KEY = 'sovereign_notif_settings';

export type NotifSettings = {
  batchCook: boolean;
  hydration: boolean;
  hydrationIntervalMin: number;
};

const DEFAULT_NOTIF: NotifSettings = {
  batchCook: true,
  hydration: true,
  hydrationIntervalMin: 90,
};

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

async function logScheduledAlarms(alarms: SovereignAlarm[]): Promise<void> {
  const now = Date.now();
  for (const a of alarms) {
    if (!a.enabled) continue;
    const scheduled = new Date();
    scheduled.setHours(a.hour, a.minute, 0, 0);
    if (scheduled.getTime() <= now) scheduled.setDate(scheduled.getDate() + 1);
    await logAlarmScheduled(a.id, a.alarmType, scheduled.getTime());
  }
}

export function useAlarms(profile: Profile) {
  const [alarms, setAlarms] = useState<SovereignAlarm[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [notif, setNotif] = useState<NotifSettings>(DEFAULT_NOTIF);

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
    AsyncStorage.getItem(NOTIF_KEY).then((raw) => {
      if (raw) {
        try {
          setNotif({ ...DEFAULT_NOTIF, ...(JSON.parse(raw) as NotifSettings) });
        } catch {
          // keep defaults
        }
      }
    });
  }, [profile]);

  const persist = useCallback(
    async (next: SovereignAlarm[]) => {
      setAlarms(next);
      await AsyncStorage.setItem(storageKey(profile), JSON.stringify(next));
      const perms = await checkAlarmPermissions();
      if (perms.allGranted) {
        await rescheduleNativeAlarms(next);
        await logScheduledAlarms(next);
      }
    },
    [profile]
  );

  const saveNotifSettings = useCallback(async (next: NotifSettings) => {
    setNotif(next);
    await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(next));
  }, []);

  const syncAllAlarms = useCallback(
    async (
      sleepWindow: SleepWindow,
      isWorkDay: boolean,
      overtimeHours: number,
      hydrationGoalMet: boolean,
      shiftSchedule?: DailySchedule | null
    ) => {
      const built = buildSleepAlarms(profile, sleepWindow, isWorkDay);
      const custom = alarms.filter((a) => a.alarmType === 'custom');
      let extended: SovereignAlarm[] = [...built];

      if (overtimeHours > 0 && isWorkDay) {
        const ot = buildOvertimeWakeAlarm(profile, sleepWindow, overtimeHours, isWorkDay);
        if (ot) {
          extended = extended.filter((a) => a.alarmType !== 'wake');
          extended.unshift(ot);
        }
      }

      if (notif.batchCook) {
        extended.push(...buildBatchCookAlarms(profile, true));
      }

      if (notif.hydration && !hydrationGoalMet) {
        const times = shiftSchedule?.hydrationReminders ?? [];
        extended.push(...buildHydrationFromTimes(profile, times, false));
      }

      extended.push(...custom);
      await persist(extended);
      return extended;
    },
    [alarms, notif, persist, profile]
  );

  const syncFromSleepWindow = useCallback(
    async (sleepWindow: SleepWindow, isWorkDay: boolean) => {
      return syncAllAlarms(sleepWindow, isWorkDay, 0, false, null);
    },
    [syncAllAlarms]
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
    notif,
    syncFromSleepWindow,
    syncAllAlarms,
    saveNotifSettings,
    toggleAlarm,
    removeAlarm,
    persist,
  };
}
