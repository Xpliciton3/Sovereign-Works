import { StyleSheet, Text, View } from 'react-native';
import { SovereignScreen, useSovereignTheme } from '@/components/SovereignScreen';

export default function DoctrineScreen() {
  const colors = useSovereignTheme();

  return (
    <SovereignScreen style={styles.screen}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Doctrine</Text>
        <Text style={[styles.message, { color: colors.textMuted }]}>
          This section is available and ready for the Layer 3 content import.
        </Text>
      </View>
    </SovereignScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
});
