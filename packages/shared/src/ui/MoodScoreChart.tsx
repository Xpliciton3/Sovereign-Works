import { StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '../colors';
import type { PartnerMoodDay } from '../hooks/useMood';

type Props = {
  scores: number[];
  colors: ThemeColors;
  barColor: string;
  labels?: string[];
  maxHeight?: number;
};

export function MoodScoreChart({ scores, colors, barColor, labels, maxHeight = 72 }: Props) {
  if (scores.length === 0) {
    return (
      <Text style={{ color: colors.textDisabled, fontSize: 11 }}>No history yet.</Text>
    );
  }

  return (
    <View style={[styles.row, { height: maxHeight + 20 }]}>
      {scores.map((s, i) => (
        <View key={`${i}-${s}`} style={styles.col}>
          <View
            style={[
              styles.bar,
              {
                height: Math.max(4, (s / 10) * maxHeight),
                backgroundColor: s >= 4 ? barColor : colors.surfaceElevated,
              },
            ]}
          />
          <Text style={{ color: colors.textDisabled, fontSize: 8 }}>
            {labels?.[i] ?? String(i + 1)}
          </Text>
        </View>
      ))}
    </View>
  );
}

type PartnerProps = {
  days: PartnerMoodDay[];
  colors: ThemeColors;
  barColor: string;
};

export function PartnerMoodHistoryChart({ days, colors, barColor }: PartnerProps) {
  const labels = days.map((d) => {
    const parts = d.date.split('-');
    return `${parseInt(parts[1], 10)}/${parseInt(parts[2], 10)}`;
  });
  return (
    <MoodScoreChart
      scores={days.map((d) => d.dotScore)}
      labels={labels}
      colors={colors}
      barColor={barColor}
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingVertical: 8 },
  col: { flex: 1, alignItems: 'center', gap: 4 },
  bar: { width: 14, borderRadius: 2, minHeight: 4 },
});
