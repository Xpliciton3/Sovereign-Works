import { getDatabase } from '../sqlite/db';
import type { AlarmType } from './types';

export type DismissedType = 'awake' | 'snooze' | 'auto_snooze' | 'missed' | 'scheduled' | 'fired';

export interface AlarmLogEntry {
  id: string;
  alarm_id: string;
  alarm_type: string;
  scheduled_time: number;
  fired_at?: number;
  dismissed_at?: number;
  dismissed_type?: DismissedType;
  snooze_count?: number;
}

export async function appendAlarmLog(entry: Omit<AlarmLogEntry, 'id'>): Promise<void> {
  const database = await getDatabase();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await database.runAsync(
    `INSERT INTO alarm_log (id, alarm_id, alarm_type, scheduled_time, fired_at, dismissed_at, dismissed_type, snooze_count)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    entry.alarm_id,
    entry.alarm_type,
    entry.scheduled_time,
    entry.fired_at ?? null,
    entry.dismissed_at ?? null,
    entry.dismissed_type ?? null,
    entry.snooze_count ?? 0
  );
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

export async function logNativePendingEvents(
  events: Array<{ alarm_id: string; dismissed_type: string; dismissed_at: number }>
): Promise<void> {
  for (const e of events) {
    await appendAlarmLog({
      alarm_id: e.alarm_id,
      alarm_type: 'custom',
      scheduled_time: e.dismissed_at,
      fired_at: e.dismissed_type === 'fired' ? e.dismissed_at : undefined,
      dismissed_at: e.dismissed_type !== 'fired' ? e.dismissed_at : undefined,
      dismissed_type: e.dismissed_type as DismissedType,
    });
  }
}
