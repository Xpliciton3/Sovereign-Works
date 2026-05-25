export const IMPERIUM_COLORS = {
  dark: {
    background: '#0D0D0D',
    surface: '#141414',
    surfaceElevated: '#1C1C1C',
    accent: '#B8962E',
    accentSoft: '#7A5C1E',
    text: '#F0EDE6',
    textMuted: '#888880',
    textDisabled: '#444440',
    border: '#2A2A2A',
    danger: '#8B2020',
    success: '#4A7A4A',
  },
  light: {
    background: '#F5F0E8',
    surface: '#FFFFFF',
    surfaceElevated: '#FAFAF7',
    accent: '#8B6B1A',
    accentSoft: '#C4A020',
    text: '#1A1208',
    textMuted: '#666050',
    textDisabled: '#BBB090',
    border: '#D4C8A8',
    danger: '#8B2020',
    success: '#4A7A4A',
  },
} as const;

export const TENDING_COLORS = {
  dark: {
    background: '#120A0E',
    surface: '#1C1016',
    surfaceElevated: '#241820',
    accent: '#C47878',
    accentSoft: '#8B4A4A',
    text: '#F5E8EC',
    textMuted: '#AA8888',
    textDisabled: '#5A3A3A',
    border: '#2E1820',
    danger: '#8B2040',
    success: '#4A6A4A',
  },
  light: {
    background: '#FFF5F0',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFAF8',
    accent: '#A85050',
    accentSoft: '#E8A0A0',
    text: '#200A10',
    textMuted: '#806060',
    textDisabled: '#C0A0A0',
    border: '#F0D0D0',
    danger: '#8B2040',
    success: '#4A6A4A',
  },
} as const;

export type ColorScheme = 'dark' | 'light';
export type ThemeColors = typeof IMPERIUM_COLORS.dark;

export function getThemeColors(
  profile: 'imperium' | 'tending',
  scheme: ColorScheme
): ThemeColors {
  const palette = profile === 'imperium' ? IMPERIUM_COLORS : TENDING_COLORS;
  return palette[scheme];
}
