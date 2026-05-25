import type { AlarmConfig, ProfileConfig } from '../types';

export const IMPERIUM_PROFILE: ProfileConfig = {
  id: 'imperium',
  displayName: 'The Imperium',
  personName: 'Garrin',
  practitionerTitle: 'The Uncrowned',
  motto: 'Uncrowned. Unbowed. Unbroken. Unfinished.',
  axiom: 'Uncrowned. Unbowed. Unbroken. Unfinished.',
  morningDeclaration: 'Power from within cannot be revoked.',
  morningDeclarationInstruction:
    'Stand. Both feet on the floor. Speak this aloud before anything else.',
  hydrationTargetOz: 100,
  shiftType: 'law_enforcement',
  defaultAlarms: [
    { hour: 5, minute: 30, label: 'The system begins now', repeats: 'daily', enabled: true },
    { hour: 12, minute: 0, label: 'Midday anchor', repeats: 'daily', enabled: true },
    { hour: 18, minute: 0, label: 'Evening review opens', repeats: 'daily', enabled: true },
    { hour: 21, minute: 30, label: 'Wind down. No new decisions.', repeats: 'daily', enabled: true },
  ],
  quoteRegister: 'intj',
  partnerProfile: 'tending',
  partnerName: 'Holli',
};

export const TENDING_PROFILE: ProfileConfig = {
  id: 'tending',
  displayName: 'The Tending',
  personName: 'Holli',
  practitionerTitle: 'The Unspent',
  motto: 'Felt. Faithful. Full. Unspent.',
  axiom: 'Felt. Faithful. Full. Unspent.',
  morningDeclaration: 'The keeper of what matters is never powerless.',
  morningDeclarationInstruction: 'Twenty minutes of quiet first. The rest waits.',
  hydrationTargetOz: 96,
  shiftType: 'nursing',
  defaultAlarms: [
    { hour: 6, minute: 30, label: 'Your day begins with you', repeats: 'daily', enabled: true },
    { hour: 12, minute: 0, label: 'Midday check in', repeats: 'daily', enabled: true },
    { hour: 18, minute: 0, label: 'Evening tends itself', repeats: 'daily', enabled: true },
    { hour: 21, minute: 0, label: 'Rest is coming', repeats: 'daily', enabled: true },
  ],
  quoteRegister: 'esfj',
  partnerProfile: 'imperium',
  partnerName: 'Garrin',
};

export function getProfileConfig(profile: 'imperium' | 'tending'): ProfileConfig {
  return profile === 'imperium' ? IMPERIUM_PROFILE : TENDING_PROFILE;
}

export function getDefaultAlarms(profile: 'imperium' | 'tending'): AlarmConfig[] {
  return getProfileConfig(profile).defaultAlarms.map((alarm, index) => ({
    ...alarm,
    id: `${profile}-default-${index}`,
  }));
}
