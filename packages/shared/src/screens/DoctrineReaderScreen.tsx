import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '../colors';
import { FONT_FAMILIES } from '../typography';

type Props = {
  title: string;
  subtitle?: string;
  body: string;
  colors: ThemeColors;
  accent?: string;
};

/** Scrollable verbatim doctrine / practice reader (Layer 5). */
export function DoctrineReaderScreen({ title, subtitle, body, colors, accent }: Props) {
  const accentColor = accent ?? colors.accent;
  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.pad}
    >
      <Text style={[styles.title, { color: accentColor, fontFamily: FONT_FAMILIES.displayI }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textMuted, fontFamily: FONT_FAMILIES.uiLight }]}>
          {subtitle}
        </Text>
      ) : null}
      <Text style={[styles.body, { color: colors.text, fontFamily: FONT_FAMILIES.uiLight }]}>{body}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  pad: { padding: 16, paddingBottom: 48 },
  title: { fontSize: 22, letterSpacing: 1, marginBottom: 8 },
  subtitle: { fontSize: 12, lineHeight: 18, marginBottom: 16, fontStyle: 'italic' },
  body: { fontSize: 14, lineHeight: 24 },
});
