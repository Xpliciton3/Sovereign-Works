import { NativeModules, Platform } from 'react-native';
import type { SovereignAlarm } from './types';

type SovereignAlarmNative = {
  rescheduleAlarms?: (json: string) => Promise<void>;
  requestExactAlarmPermission?: () => Promise<void>;
  requestOverlayPermission?: () => Promise<void>;
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
