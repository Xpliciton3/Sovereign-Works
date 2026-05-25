import { StyleSheet, Text, View } from 'react-native';
import { SovereignScreen, useSovereignTheme } from '@/components/SovereignScreen';
import { profileConfig } from '@/constants/profile';

export default function PlannerScreen() {
  const colors = useSovereignTheme();

  return (
    <SovereignScreen style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.shift, { color: colors.textMuted }]}>SCHEDULE NOT SET</Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.accent }]}>
        <Text style={[styles.declaration, { color: colors.text }]}>
          {profileConfig.morningDeclaration}
        </Text>
      </View>
      <Text style={[styles.hint, { color: colors.textMuted }]}>
        Planner foundation loaded. Guided tour and full checklist coming next.
      </Text>
    </SovereignScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 48,
    gap: 16,
  },
  header: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  shift: {
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  card: {
    borderLeftWidth: 3,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
  declaration: {
    fontSize: 18,
    fontStyle: 'italic',
    lineHeight: 28,
  },
  hint: {
    fontSize: 13,
    lineHeight: 20,
  },
});
