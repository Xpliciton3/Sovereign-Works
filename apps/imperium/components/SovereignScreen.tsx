import { StyleSheet, View, type ViewProps } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import { getThemeColors } from '@sovereign/shared';
import { PROFILE } from '@/constants/profile';

export function SovereignScreen({ style, ...props }: ViewProps) {
  const scheme = useColorScheme() ?? 'dark';
  const colors = getThemeColors(PROFILE, scheme);

  return (
    <View
      style={[styles.screen, { backgroundColor: colors.background }, style]}
      {...props}
    />
  );
}

export function useSovereignTheme() {
  const scheme = useColorScheme() ?? 'dark';
  return getThemeColors(PROFILE, scheme);
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
