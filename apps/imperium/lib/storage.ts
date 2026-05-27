import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  householdId: 'householdId',
  profile: 'profile',
  onboardingComplete: 'onboardingComplete',
  tourComplete: 'tour_v1_complete',
  householdCreatedPending: 'householdCreatedPending',
} as const;

export type HouseholdCreatedPending = {
  householdName: string;
  joinCode: string;
  householdId: string;
};

export async function getStoredHouseholdId(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEYS.householdId);
}

export async function setStoredHouseholdId(id: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.householdId, id);
}

export async function isOnboardingComplete(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.onboardingComplete);
  return value === 'true';
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.onboardingComplete, 'true');
}

export async function setHouseholdCreatedPending(data: HouseholdCreatedPending): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.householdCreatedPending, JSON.stringify(data));
}

export async function getHouseholdCreatedPending(): Promise<HouseholdCreatedPending | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.householdCreatedPending);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as HouseholdCreatedPending;
  } catch {
    return null;
  }
}

export async function clearHouseholdCreatedPending(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.householdCreatedPending);
}
