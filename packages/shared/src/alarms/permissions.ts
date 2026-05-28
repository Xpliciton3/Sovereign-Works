import { Linking, PermissionsAndroid, Platform } from 'react-native';
import { requestExactAlarmPermission, requestOverlayPermission } from './nativeBridge';

export async function requestAlarmPermissions(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await requestExactAlarmPermission();
  await requestOverlayPermission();
  if (Platform.Version >= 33) {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }
}

export async function openAppSettings(): Promise<void> {
  await Linking.openSettings();
}
