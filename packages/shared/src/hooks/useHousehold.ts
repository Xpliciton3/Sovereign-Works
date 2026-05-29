import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirebaseAuth } from '../firebase/config';
import {
  createHousehold,
  getHousehold,
  initAuth,
  joinHouseholdByCode,
  regenerateJoinCode,
  watchHousehold,
} from '../firebase/household';
import { subscribeSyncStatus, runSyncDrain, type SyncStatus } from '../firebase/sync';
import type { HouseholdConfig, Profile } from '../types';
import { getProfileConfig } from '../profiles';

const HOUSEHOLD_KEY = 'householdId';

export function useHousehold(profile: Profile) {
  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [household, setHousehold] = useState<HouseholdConfig | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');
  const [uid, setUid] = useState<string>('');
  const [loaded, setLoaded] = useState(false);

  const partnerProfile: Profile = profile === 'imperium' ? 'tending' : 'imperium';
  const pc = getProfileConfig(profile);

  useEffect(() => {
    void (async () => {
      await initAuth();
      setUid(getFirebaseAuth().currentUser?.uid ?? profile);
      const stored = await AsyncStorage.getItem(HOUSEHOLD_KEY);
      setHouseholdId(stored);
      setLoaded(true);
    })();
  }, [profile]);

  useEffect(() => {
    if (!householdId) {
      setHousehold(null);
      return;
    }
    return watchHousehold(householdId, setHousehold);
  }, [householdId]);

  useEffect(() => subscribeSyncStatus(setSyncStatus), []);

  const partnerJoined = Boolean(household?.members[partnerProfile]);
  const joinCodeFormatted = household?.joinCode
    ? `${household.joinCode.slice(0, 3)}-${household.joinCode.slice(3)}`
    : null;

  const persistHouseholdId = useCallback(async (id: string) => {
    await AsyncStorage.setItem(HOUSEHOLD_KEY, id);
    setHouseholdId(id);
  }, []);

  const createNewHousehold = useCallback(
    async (householdName: string) => {
      const member = { profile, personName: pc.personName };
      const result = await createHousehold(householdName, member);
      await persistHouseholdId(result.householdId);
      return result;
    },
    [pc.personName, persistHouseholdId, profile]
  );

  const joinByCode = useCallback(
    async (code: string) => {
      const result = await joinHouseholdByCode(code, { profile, personName: pc.personName });
      await persistHouseholdId(result.householdId);
      return result;
    },
    [pc.personName, persistHouseholdId, profile]
  );

  const refreshJoinCode = useCallback(async () => {
    if (!householdId) throw new Error('NO_HOUSEHOLD');
    return regenerateJoinCode(householdId);
  }, [householdId]);

  const reloadHousehold = useCallback(async () => {
    if (!householdId) return null;
    const data = await getHousehold(householdId);
    setHousehold(data);
    return data;
  }, [householdId]);

  const retrySync = useCallback(async () => {
    await runSyncDrain();
  }, []);

  return useMemo(
    () => ({
      householdId,
      household,
      loaded,
      uid,
      profile,
      partnerProfile,
      partnerJoined,
      partnerName: pc.partnerName,
      joinCodeFormatted,
      syncStatus,
      createNewHousehold,
      joinByCode,
      refreshJoinCode,
      reloadHousehold,
      retrySync,
      persistHouseholdId,
    }),
    [
      householdId,
      household,
      loaded,
      uid,
      profile,
      partnerProfile,
      partnerJoined,
      pc.partnerName,
      joinCodeFormatted,
      syncStatus,
      createNewHousehold,
      joinByCode,
      refreshJoinCode,
      reloadHousehold,
      retrySync,
      persistHouseholdId,
    ]
  );
}

export type HouseholdContextValue = ReturnType<typeof useHousehold>;
