import { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '../colors';
import { HOLY_BOOK } from '../content/layer5/HOLY_BOOK';
import { HOLY_BOOK_MOVEMENTS } from '../content/layer5/holyBookIndex';
import { FONT_FAMILIES } from '../typography';
import { DoctrineReaderScreen } from './DoctrineReaderScreen';

const INSTALL_KEY = 'sovereign_install_date';

type Movement = { id: string; title: string; unlockDay: number };

type Props = {
  colors: ThemeColors;
};

function daysSinceInstall(installMs: number): number {
  return Math.floor((Date.now() - installMs) / (24 * 60 * 60 * 1000)) + 1;
}

export function HolyBookScreen({ colors }: Props) {
  const movements = HOLY_BOOK_MOVEMENTS as readonly Movement[];
  const [installDate, setInstallDate] = useState<number>(Date.now());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(INSTALL_KEY).then((raw) => {
      if (raw) setInstallDate(parseInt(raw, 10));
      else AsyncStorage.setItem(INSTALL_KEY, String(Date.now()));
    });
  }, []);

  const day = daysSinceInstall(installDate);

  const movementBody = useMemo(() => {
    if (!selectedId) return '';
    const re = new RegExp(`# MOVEMENT ${selectedId} —[\\s\\S]*?(?=\\n# MOVEMENT |$)`);
    const match = HOLY_BOOK.match(re);
    return match ? match[0] : HOLY_BOOK;
  }, [selectedId]);

  if (selectedId) {
    const mov = movements.find((m) => m.id === selectedId);
    return (
      <View style={{ flex: 1 }}>
        <Pressable onPress={() => setSelectedId(null)} style={{ padding: 16, paddingTop: 8 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11 }}>← ALL MOVEMENTS</Text>
        </Pressable>
        <DoctrineReaderScreen
          title={mov ? `Movement ${mov.id}` : 'The Book'}
          subtitle={mov?.title}
          body={movementBody}
          colors={colors}
        />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.pad}>
      <Text style={[styles.title, { color: colors.accent, fontFamily: FONT_FAMILIES.displayI }]}>
        The Eight Who Carry the Fire
      </Text>
      <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 16, lineHeight: 18 }}>
        Day {day} of your practice. Movements unlock by day count (Gate Structure in the holy book).
      </Text>
      {movements.map((mov) => {
        const locked = day < mov.unlockDay;
        return (
          <Pressable
            key={mov.id}
            disabled={locked}
            onPress={() => setSelectedId(mov.id)}
            style={[styles.row, { borderColor: colors.border, opacity: locked ? 0.45 : 1 }]}
          >
            <Text style={{ color: colors.accent, fontSize: 14, letterSpacing: 1 }}>MOVEMENT {mov.id}</Text>
            <Text style={{ color: colors.text, fontSize: 13, marginTop: 4 }}>{mov.title}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 10, marginTop: 6 }}>
              {locked ? `Unlocks day ${mov.unlockDay}` : 'Tap to read'}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 20, marginBottom: 8 },
  row: { borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 10 },
});
