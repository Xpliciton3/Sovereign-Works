import type { Profile } from '../types';

/** Verbatim from spec/07_ALARM_SYSTEM.md */
export const ALARM_LABELS = {
  imperium: {
    wake: 'Rise. The work does not wait.',
    winddown: 'Wind down. The Uncrowned rests with intention.',
    sleep: 'Sleep now. The architecture holds.',
    hydration: 'Drink. The body is the instrument.',
    batchcook: (dinnerName: string) =>
      `Tomorrow is a prep day. Start ${dinnerName} tonight if marinating.`,
  },
  tending: {
    wake: 'Rise. The Keeper tends from fullness, not exhaustion.',
    winddown: 'Wind down. The reservoir refills in sleep.',
    sleep: 'Sleep now. You have held enough for today.',
    hydration: 'Drink. The warmth requires fuel.',
    batchcook: (dinnerName: string) =>
      `Tomorrow is a prep day. Start ${dinnerName} tonight if marinating.`,
  },
} as const;

export const AWAKE_SCREEN = {
  imperium: {
    question: 'Are you actually awake?',
    confirm: "Yes — I'm up",
    snooze: 'No — 9 more minutes',
    countdown: (sec: number) => `Auto-snooze in ${sec}`,
  },
  tending: {
    question: 'Are you actually awake?',
    confirm: "Yes — I'm up",
    snooze: 'No — 9 more minutes',
    countdown: (sec: number) => `Auto-snooze in ${sec}`,
  },
} as const;

export function labelsFor(profile: Profile) {
  return ALARM_LABELS[profile];
}

export function awakeCopyFor(profile: Profile) {
  return AWAKE_SCREEN[profile];
}
