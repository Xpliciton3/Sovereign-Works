import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { HolyDaysScreen } from './HolyDaysScreen';
import { HolyBookScreen } from './HolyBookScreen';
import { SvgIcon } from '../ui/SvgIcon';

type SoulTab = 'holydays' | 'book';

type Props = {
  profile: Profile;
  colors: ThemeColors;
};

export function Layer2SoulScreen({ profile, colors }: Props) {
  const [tab, setTab] = useState<SoulTab>('holydays');

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <SvgIcon name="star" size={20} color={colors.accent} />
        <Text style={{ color: colors.accent, fontSize: 14, letterSpacing: 2 }}>SOUL</Text>
      </View>
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {(
          [
            ['holydays', 'Holy Days'],
            ['book', 'The Book'],
          ] as const
        ).map(([key, label]) => (
          <Pressable key={key} onPress={() => setTab(key)} style={styles.tab}>
            <Text style={{ color: tab === key ? colors.accent : colors.textMuted, fontSize: 10, letterSpacing: 0.5 }}>
              {label.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>
      {tab === 'holydays' && <HolyDaysScreen profile={profile} colors={colors} />}
      {tab === 'book' && <HolyBookScreen colors={colors} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 48 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 8 },
  tabs: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10 },
});
