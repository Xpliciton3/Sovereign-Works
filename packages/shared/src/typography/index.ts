import {
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import {
  JosefinSans_300Light,
  JosefinSans_400Regular,
  JosefinSans_600SemiBold,
} from '@expo-google-fonts/josefin-sans';
import { useFonts } from 'expo-font';

export const FONT_FAMILIES = {
  display: 'CormorantGaramond_400Regular',
  displayI: 'CormorantGaramond_400Regular_Italic',
  displayB: 'CormorantGaramond_600SemiBold',
  ui: 'JosefinSans_400Regular',
  uiLight: 'JosefinSans_300Light',
  uiSemi: 'JosefinSans_600SemiBold',
} as const;

export function useSovereignFonts(extraFonts?: Record<string, number>) {
  return useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_600SemiBold,
    JosefinSans_300Light,
    JosefinSans_400Regular,
    JosefinSans_600SemiBold,
    ...extraFonts,
  });
}
