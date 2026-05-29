import { NativeModules, Platform } from 'react-native';
import type { SovereignAlarm } from './types';

type SovereignAlarmNative = {
  rescheduleAlarms?: (json: string) => Promise<void>;
  requestExactAlarmPermission?: () => Promise<void>;
  requestOverlayPermission?: () => Promise<void>;
  canScheduleExactAlarms?: () => Promise<boolean>;
  canDrawOverlays?: () => Promise<boolean>;
  getPendingAlarmLog?: () => Promise<string>;
  clearPendingAlarmLog?: () => Promise<void>;
};

const Native = NativeModules.SovereignAlarmModule as SovereignAlarmNative | undefined;

/** Calls native AlarmManager when the bare module is linked; no-op in Expo Go. */
export async function rescheduleNativeAlarms(alarms: SovereignAlarm[]): Promise<void> {
  if (Platform.OS !== 'android') return;
  if (!Native?.rescheduleAlarms) return;
  try {
    await Native.rescheduleAlarms(JSON.stringify(alarms.filter((a) => a.enabled)));
  } catch {
    // Native module not built yet — Layer 3 prebuild required.
  }
}

export async function requestExactAlarmPermission(): Promise<void> {
  if (Platform.OS !== 'android') return;
  if (!Native?.requestExactAlarmPermission) return;
  try {
    await Native.requestExactAlarmPermission();
  } catch {
    // fall through
  }
}

export async function requestOverlayPermission(): Promise<void> {
  if (Platform.OS !== 'android') return;
  if (!Native?.requestOverlayPermission) return;
  try {
    await Native.requestOverlayPermission();
  } catch {
    // fall through
  }
}

export async function canScheduleExactAlarms(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  if (!Native?.canScheduleExactAlarms) return true;
  try {
    return await Native.canScheduleExactAlarms();
  } catch {
    return false;
  }
}

export async function canDrawOverlays(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  if (!Native?.canDrawOverlays) return true;
  try {
    return await Native.canDrawOverlays();
  } catch {
    return false;
  }
}

export async function flushNativeAlarmLog(): Promise<void> {
  if (Platform.OS !== 'android' || !Native?.getPendingAlarmLog) return;
  try {
    const raw = await Native.getPendingAlarmLog();
    if (!raw || raw === '[]') return;
    const events = JSON.parse(raw) as Array<{
      alarm_id: string;
      dismissed_type: string;
      dismissed_at: number;
    }>;
    const { logNativePendingEvents } = await import('./alarmLog');
    await logNativePendingEvents(events);
    await Native.clearPendingAlarmLog?.();
  } catch {
    // native module optional
  }
}
