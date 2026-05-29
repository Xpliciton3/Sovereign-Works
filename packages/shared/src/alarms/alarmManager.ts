import type { SovereignAlarm } from './types';
import { logAlarmScheduled } from './alarmLog';
import { getDatabase } from '../sqlite/db';
import { rescheduleNativeAlarms } from './nativeBridge';

export async function saveAlarmConfigsToDb(alarms: SovereignAlarm[]): Promise<void> {
  const db = await getDatabase();
  const now = Date.now();
  for (const a of alarms) {
    await db.runAsync(
      `INSERT OR REPLACE INTO alarm_configs (id, hour, minute, label, repeats, enabled, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      a.id,
      a.hour,
      a.minute,
      a.label,
      JSON.stringify(a.days),
      a.enabled ? 1 : 0,
      now
    );
  }
}

export async function scheduleAlarm(alarm: SovereignAlarm, existing: SovereignAlarm[]): Promise<void> {
  const merged = existing.some((a) => a.id === alarm.id)
    ? existing.map((a) => (a.id === alarm.id ? alarm : a))
    : [...existing, alarm];
  await rescheduleAllAlarms(merged);
}

export async function cancelAlarm(id: string, allAlarms: SovereignAlarm[]): Promise<void> {
  const next = allAlarms.filter((a) => a.id !== id);
  await rescheduleAllAlarms(next);
}

export async function rescheduleAllAlarms(allAlarms: SovereignAlarm[]): Promise<void> {
  await saveAlarmConfigsToDb(allAlarms);
  const enabled = allAlarms.filter((a) => a.enabled);
  await rescheduleNativeAlarms(enabled);
  const now = Date.now();
  for (const a of enabled) {
    const scheduled = new Date();
    scheduled.setHours(a.hour, a.minute, 0, 0);
    if (scheduled.getTime() <= now) scheduled.setDate(scheduled.getDate() + 1);
    await logAlarmScheduled(a.id, a.alarmType, scheduled.getTime());
  }
}
