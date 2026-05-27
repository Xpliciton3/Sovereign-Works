import {
  ref,
  set,
  get,
  query,
  orderByChild,
  equalTo,
  update,
  onValue,
  type Unsubscribe,
} from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import { getFirebaseAuth, getFirebaseDb } from './config';
import type { HouseholdConfig, HouseholdMember, Profile } from '../types';

const JOIN_CODE_TTL_MS = 48 * 60 * 60 * 1000;

export async function initAuth(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
}

function generateJoinCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function generateHouseholdId(): string {
  return `hh_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function formatJoinCode(code: string): string {
  const digits = code.replace(/\D/g, '').slice(0, 6);
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3)}`;
}

export function normalizeJoinCode(code: string): string {
  return code.replace(/\D/g, '').slice(0, 6);
}

export async function createHousehold(
  householdName: string,
  member: Pick<HouseholdMember, 'profile' | 'personName' | 'deviceToken'>
): Promise<{ householdId: string; joinCode: string; joinCodeFormatted: string }> {
  await initAuth();
  const db = getFirebaseDb();
  const householdId = generateHouseholdId();
  const joinCode = generateJoinCode();
  const now = Date.now();

  const household: HouseholdConfig = {
    householdId,
    householdName,
    createdAt: now,
    joinCode,
    joinCodeExpiry: now + JOIN_CODE_TTL_MS,
    members: {
      [member.profile]: {
        ...member,
        joinedAt: now,
      },
    },
  };

  await set(ref(db, `households/${householdId}`), household);
  return { householdId, joinCode, joinCodeFormatted: formatJoinCode(joinCode) };
}

export async function joinHouseholdByCode(
  joinCodeInput: string,
  member: Pick<HouseholdMember, 'profile' | 'personName' | 'deviceToken'>
): Promise<{ householdId: string; householdName: string }> {
  await initAuth();
  const db = getFirebaseDb();
  const joinCode = normalizeJoinCode(joinCodeInput);

  const householdsRef = ref(db, 'households');
  const q = query(householdsRef, orderByChild('joinCode'), equalTo(joinCode));
  const snapshot = await get(q);

  if (!snapshot.exists()) {
    throw new Error('CODE_NOT_FOUND');
  }

  let householdId = '';
  let household: HouseholdConfig | null = null;

  snapshot.forEach((child) => {
    householdId = child.key ?? '';
    household = child.val() as HouseholdConfig;
  });

  if (!household || !householdId) {
    throw new Error('CODE_NOT_FOUND');
  }

  const householdData = household as HouseholdConfig;

  if (Date.now() > householdData.joinCodeExpiry) {
    throw new Error('CODE_EXPIRED');
  }

  if (householdData.members[member.profile]) {
    throw new Error('PROFILE_ALREADY_JOINED');
  }

  const now = Date.now();
  await update(ref(db, `households/${householdId}/members/${member.profile}`), {
    ...member,
    joinedAt: now,
  });

  return { householdId, householdName: householdData.householdName };
}

export async function regenerateJoinCode(householdId: string): Promise<{
  joinCode: string;
  joinCodeFormatted: string;
  joinCodeExpiry: number;
}> {
  await initAuth();
  const db = getFirebaseDb();
  const joinCode = generateJoinCode();
  const joinCodeExpiry = Date.now() + JOIN_CODE_TTL_MS;

  await update(ref(db, `households/${householdId}`), {
    joinCode,
    joinCodeExpiry,
  });

  return { joinCode, joinCodeFormatted: formatJoinCode(joinCode), joinCodeExpiry };
}

export async function getHousehold(householdId: string): Promise<HouseholdConfig | null> {
  await initAuth();
  const snapshot = await get(ref(getFirebaseDb(), `households/${householdId}`));
  return snapshot.exists() ? (snapshot.val() as HouseholdConfig) : null;
}

export function watchHousehold(
  householdId: string,
  callback: (household: HouseholdConfig | null) => void
): Unsubscribe {
  return onValue(ref(getFirebaseDb(), `households/${householdId}`), (snapshot) => {
    callback(snapshot.exists() ? (snapshot.val() as HouseholdConfig) : null);
  });
}

export async function firebaseSet(path: string, data: unknown): Promise<void> {
  await initAuth();
  await set(ref(getFirebaseDb(), path), data);
}

export function householdShareMessage(
  joinCodeFormatted: string,
  tendingApkUrl: string
): string {
  return `Download The Tending app at ${tendingApkUrl} and use code ${joinCodeFormatted} to join our household.`;
}

export function getMemberProfileLabel(profile: Profile): string {
  return profile === 'imperium' ? 'Garrin' : 'Holli';
}
