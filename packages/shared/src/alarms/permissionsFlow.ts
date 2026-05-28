import { PermissionsAndroid, Platform } from 'react-native';
import { canScheduleExactAlarms, canDrawOverlays } from './nativeBridge';

export interface PermissionStatus {
  exactAlarm: boolean;
  overlay: boolean;
  notifications: boolean;
  allGranted: boolean;
}

export async function checkAlarmPermissions(): Promise<PermissionStatus> {
  if (Platform.OS !== 'android') {
    return { exactAlarm: true, overlay: true, notifications: true, allGranted: true };
  }
  const exactAlarm = await canScheduleExactAlarms();
  const overlay = await canDrawOverlays();
  let notifications = Platform.Version < 33;
  if (Platform.Version >= 33) {
    notifications = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }
  return {
    exactAlarm,
    overlay,
    notifications,
    allGranted: exactAlarm && overlay && notifications,
  };
}

export const PERMISSION_COPY = {
  exactAlarm:
    'Exact alarms are required for the wake alarm to fire at the correct time. Android restricts this permission — you must grant it manually.',
  overlay: 'Draw over other apps is required for the alarm to appear over the lock screen.',
  notifications: 'Notifications are required for alarm alerts when the app is backgrounded.',
  active: 'Alarm system is active.',
} as const;
