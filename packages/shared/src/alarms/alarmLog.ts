import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AlarmType } from './types';

export type DismissedType = 'awake' | 'snooze' | 'auto_snooze' | 'missed' | 'scheduled';

export interface AlarmLogEntry {
  id: string;
  alarm_id: string;
  alarm_type: AlarmType | string;
  scheduled_time: number;
  fired_at?: number;
  dismissed_at?: number;
  dismissed_type?: DismissedType;
  snooze_count?: number;
}

const LOG_KEY = 'sovereign_alarm_log';

export async function appendAlarmLog(entry: Omit<AlarmLogEntry, 'id'>): Promise<void> {
  const raw = await AsyncStorage.getItem(LOG_KEY);
  const list: AlarmLogEntry[] = raw ? (JSON.parse(raw) as AlarmLogEntry[]) : [];
  list.push({ ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` });
  if (list.length > 500) list.splice(0, list.length - 500);
  await AsyncStorage.setItem(LOG_KEY, JSON.stringify(list));
}

export async function logAlarmScheduled(
  alarmId: string,
  alarmType: AlarmType,
  scheduledTime: number
): Promise<void> {
  await appendAlarmLog({
    alarm_id: alarmId,
    alarm_type: alarmType,
    scheduled_time: scheduledTime,
    dismissed_type: 'scheduled',
  });
}

export async function getAlarmLog(): Promise<AlarmLogEntry[]> {
  const raw = await AsyncStorage.getItem(LOG_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AlarmLogEntry[];
  } catch {
    return [];
  }
}
