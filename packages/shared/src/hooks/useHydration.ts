import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Profile } from '../types';
import { getProfileConfig } from '../profiles';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function storageKey(profile: Profile): string {
  return `hydration_${profile}_${todayKey()}`;
}

export function useHydration(profile: Profile) {
  const targetOz = getProfileConfig(profile).hydrationTargetOz;
  const [loggedOz, setLoggedOz] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(storageKey(profile)).then((raw) => {
      if (raw) setLoggedOz(parseFloat(raw) || 0);
    });
  }, [profile]);

  const persist = useCallback(
    async (oz: number) => {
      setLoggedOz(oz);
      await AsyncStorage.setItem(storageKey(profile), String(oz));
    },
    [profile]
  );

  const addOz = useCallback(
    async (amount: number) => {
      const next = Math.min(targetOz * 1.5, loggedOz + amount);
      await persist(next);
      return next;
    },
    [loggedOz, persist, targetOz]
  );

  const percent = Math.min(100, Math.round((loggedOz / targetOz) * 100));

  return { loggedOz, targetOz, percent, addOz, setLoggedOz: persist };
}
