import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '../colors';

type Props = { colors: ThemeColors };

export function Layer2MoreScreen({ colors }: Props) {
  return (
    <ScrollView style={[styles.root, { backgroundColor: colors.background }]} contentContainerStyle={styles.pad}>
      <Text style={[styles.title, { color: colors.text }]}>More</Text>
      <Text style={[styles.body, { color: colors.textMuted }]}>
        Layer 2 stub — Settings, schedule setup, and alarms expand in later layers.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  pad: { padding: 24, paddingTop: 48 },
  title: { fontSize: 22, letterSpacing: 2, marginBottom: 12 },
  body: { fontSize: 14, lineHeight: 22 },
});
