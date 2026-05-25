import { StyleSheet, Text, View } from 'react-native';
import { useSovereignTheme } from '@/components/SovereignScreen';

interface SigilMarkProps {
  size?: number;
}

export function SigilMark({ size = 72 }: SigilMarkProps) {
  const colors = useSovereignTheme();

  return (
    <View
      style={[
        styles.sigil,
        {
          width: size,
          height: size,
          borderColor: colors.accent,
        },
      ]}
    >
      <Text style={[styles.glyph, { color: colors.accent, fontSize: size * 0.45 }]}>
        I
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sigil: {
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    fontWeight: '700',
    letterSpacing: 2,
  },
});
