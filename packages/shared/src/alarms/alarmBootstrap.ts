import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Platform } from 'react-native';
import { flushNativeAlarmLog } from './nativeBridge';
import { checkAlarmPermissions, PERMISSION_COPY } from './permissionsFlow';
import { requestAlarmPermissions } from './permissions';

const PERMS_DONE_KEY = 'l3_alarm_permissions_complete';

export async function areLayer3PermissionsComplete(): Promise<boolean> {
  const v = await AsyncStorage.getItem(PERMS_DONE_KEY);
  if (v === '1') return true;
  const s = await checkAlarmPermissions();
  if (s.allGranted) {
    await AsyncStorage.setItem(PERMS_DONE_KEY, '1');
    return true;
  }
  return false;
}

export async function markLayer3PermissionsComplete(): Promise<void> {
  await AsyncStorage.setItem(PERMS_DONE_KEY, '1');
}

export async function runLayer3PermissionFlow(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  const existing = await areLayer3PermissionsComplete();
  if (existing) return true;
  await requestAlarmPermissions();
  const s = await checkAlarmPermissions();
  if (s.allGranted) {
    await markLayer3PermissionsComplete();
    return true;
  }
  return false;
}

export function subscribeAlarmLogFlush(): () => void {
  const sub = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void flushNativeAlarmLog();
    }
  });
  void flushNativeAlarmLog();
  return () => sub.remove();
}

export { PERMISSION_COPY };
