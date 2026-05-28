import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_VERSION, APP_VERSION_KEY } from '../constants/appVersion';
import { clearAllTourKeys } from '../tour/tourVersions';

/** Resets guided tour when APP_VERSION changes (Layer 3 install bump). */
export function useAppVersionTourReset(): void {
  useEffect(() => {
    AsyncStorage.getItem(APP_VERSION_KEY).then(async (stored) => {
      if (stored !== APP_VERSION) {
        await clearAllTourKeys((k) => AsyncStorage.removeItem(k));
        await AsyncStorage.setItem(APP_VERSION_KEY, APP_VERSION);
      }
    });
  }, []);
}
