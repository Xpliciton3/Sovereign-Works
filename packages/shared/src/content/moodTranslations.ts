import type { Profile } from '../types';

/** Partner-facing translation from score bracket — from sovereign_v9.jsx */
export function getMoodTranslation(score: number, viewer: Profile): string {
  const imp = viewer === 'imperium';
  if (score <= 2) {
    return imp
      ? "He's carrying something heavy today. No demands tonight. Just be near."
      : "She's in a hard place today. No processing. Presence only.";
  }
  if (score <= 4) {
    return imp
      ? "He's running low today. A quiet evening without expectations is what helps."
      : "She's depleted today. Keep things low-key. Check in gently.";
  }
  if (score <= 6) {
    return imp
      ? "He's managing today. Moderate load. A calm evening is welcome."
      : "She's holding steady. Present. A check-in is welcome.";
  }
  if (score <= 8) {
    return imp
      ? "He's solid today. Good capacity. Connection and conversation are welcome."
      : "She's doing well. She'd welcome real time together.";
  }
  return imp
    ? "He's resourced and clear today. Full engagement is welcome."
    : "She's fully present and open today. This is a good day to connect.";
}

/** Raw entry 1–10 → partner dot 1–5 (CONTRADICTION_AUDIT C-01). */
export function scoreToDot(rawScore: number): number {
  return Math.max(1, Math.min(5, Math.ceil(rawScore / 2)));
}

export function scoreBracketLabel(rawScore: number): string {
  if (rawScore <= 2) return 'Depleted. Heavy. Not okay.';
  if (rawScore <= 4) return 'Hard day. Running low.';
  if (rawScore <= 6) return 'Managing. Present. Holding.';
  if (rawScore <= 8) return 'Solid. Good capacity.';
  return 'Exceptional. Resourced and clear.';
}
