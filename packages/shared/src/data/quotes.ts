// Imported verbatim from SOVEREIGN_WORKS_PHASE1/09_DAILY_QUOTE.md

export const IMPERIUM_FALLBACK_QUOTES = [
  'Power from within cannot be revoked.',
  'The amateur waits for inspiration. The professional gets to work.',
  'Plans collapse. Architecture endures.',
  'Every weapon raised against me has only ever sharpened me.',
  'I do not kneel. I endure. I outlast. I build.',
  'My enemies plan in seasons. I plan in decades.',
  'Precision is not coldness. It is care with a sharp edge.',
  'The work is not done. Unfinished.',
  'Do not wait for the world to confirm what you have already decided.',
  'Built in the dark. Visible when it is complete.',
];

export const TENDING_FALLBACK_QUOTES = [
  'The keeper of what matters is never powerless.',
  'Felt. Faithful. Full. Unspent.',
  'You give from fullness. Say so when the cup is empty.',
  'What you tend, you keep. What you keep, endures.',
  'You are not used up by what you give. You remain.',
  'The most important thing you tend today might be yourself.',
  'Warmth freely given is a gift. Warmth maintained past depletion is a debt.',
  'You are not meant to be spent.',
  'Your care is not weakness. It is intelligence.',
  'Rest is not retreat. Rest is the practice.',
];

export function getTodayQuote(profile: 'imperium' | 'tending'): string {
  const bank = profile === 'imperium' ? IMPERIUM_FALLBACK_QUOTES : TENDING_FALLBACK_QUOTES;
  const dayNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return bank[dayNumber % bank.length];
}
