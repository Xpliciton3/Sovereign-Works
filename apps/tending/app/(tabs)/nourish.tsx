import { StyleSheet, Text } from 'react-native';
import { SovereignScreen, useSovereignTheme } from '@/components/SovereignScreen';

export default function NourishScreen() {
  const colors = useSovereignTheme();

  return (
    <SovereignScreen style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Nourish</Text>
      <Text style={[styles.body, { color: colors.textMuted }]}>
        45 recipes from RECIPE_CARDS_v3_1.md will import here.
      </Text>
    </SovereignScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 48,
    gap: 12,
  },
  title: {
    fontSize: 24,
    letterSpacing: 2,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
});
