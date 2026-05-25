import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  householdId: 'householdId',
  profile: 'profile',
  onboardingComplete: 'onboardingComplete',
  tourComplete: 'tour_v1_complete',
} as const;

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
