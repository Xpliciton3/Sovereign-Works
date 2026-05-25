export const TYPOGRAPHY = {
  imperium: {
    displayFont: 'Cormorant',
    bodyFont: 'Inter',
    monoFont: 'JetBrainsMono',
    displaySize: { xl: 32, lg: 24, md: 20, sm: 16 },
    bodySize: { lg: 16, md: 14, sm: 12 },
    letterSpacing: { display: 2, body: 0.3, caps: 4 },
    lineHeight: { display: 1.2, body: 1.6 },
  },
  tending: {
    displayFont: 'Cormorant',
    bodyFont: 'Inter',
    monoFont: 'JetBrainsMono',
    displaySize: { xl: 30, lg: 22, md: 20, sm: 16 },
    bodySize: { lg: 16, md: 14, sm: 12 },
    letterSpacing: { display: 1, body: 0.2, caps: 3 },
    lineHeight: { display: 1.3, body: 1.7 },
  },
} as const;

export type ProfileTypography = typeof TYPOGRAPHY.imperium;

export function getTypography(profile: 'imperium' | 'tending'): ProfileTypography {
  return TYPOGRAPHY[profile];
}
