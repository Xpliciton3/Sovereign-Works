import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import type { ThemeColors } from '../colors';

/** Layer 5 vocal coach scaffold — TTS + TFLite phoneme match ships in L5.02–L5.07. */
const SAMPLE_WORDS = [
  { word: 'VEL', hint: 'VEL — sovereign choosing (stress on VEL)' },
  { word: 'NAR', hint: 'NAR — held interior territory' },
  { word: "an im-vel", hint: 'Oath opening phrase — two breaths' },
];

type Props = {
  colors: ThemeColors;
};

export function VocalCoachScreen({ colors }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.pad}>
      <Text style={{ color: '#9060f0', fontSize: 14, letterSpacing: 2, marginBottom: 8 }}>VOCAL COACH</Text>
      <Text style={{ color: colors.textMuted, fontSize: 12, lineHeight: 18, marginBottom: 16 }}>
        Select a word to practice. Device TTS and microphone phoneme scoring arrive with Whisper/TFLite bundles
        (L5.02–L5.06). See packages/shared/src/ai/phoneme/README.md.
      </Text>
      {SAMPLE_WORDS.map(({ word, hint }) => (
        <Pressable
          key={word}
          onPress={() => setSelected(word)}
          style={[
            styles.card,
            {
              borderColor: selected === word ? '#9060f0' : colors.border,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Text style={{ color: colors.text, fontSize: 18, letterSpacing: 2 }}>{word}</Text>
          <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 6 }}>{hint}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16, paddingBottom: 40 },
  card: { borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 10 },
});
