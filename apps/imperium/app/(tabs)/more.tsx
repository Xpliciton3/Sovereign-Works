import { StyleSheet, Text } from 'react-native';
import { SovereignScreen, useSovereignTheme } from '@/components/SovereignScreen';
import { profileConfig } from '@/constants/profile';

export default function MoreScreen() {
  const colors = useSovereignTheme();

  return (
    <SovereignScreen style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>More</Text>
      <Text style={[styles.line, { color: colors.textMuted }]}>
        {profileConfig.personName} · {profileConfig.practitionerTitle}
      </Text>
      <Text style={[styles.line, { color: colors.textMuted }]}>Settings, Mood, Partner View</Text>
    </SovereignScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 48,
    gap: 8,
  },
  title: {
    fontSize: 24,
    letterSpacing: 2,
  },
  line: {
    fontSize: 14,
  },
});
