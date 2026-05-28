import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import {
  HOLY_DAYS,
  daysUntilHolyDay,
  getPersonalObservance,
  getUpcomingHolyDays,
  type HolyDay,
} from '../data/holyDays';

type Props = {
  profile: Profile;
  colors: ThemeColors;
};

export function HolyDaysScreen({ profile, colors }: Props) {
  const [selected, setSelected] = useState<HolyDay | null>(null);
  const [tab, setTab] = useState<'personal' | 'household'>('personal');
  const upcoming = getUpcomingHolyDays();

  if (selected) {
    return (
      <ScrollView style={[styles.root, { backgroundColor: colors.background }]} contentContainerStyle={styles.pad}>
        <Pressable onPress={() => setSelected(null)}>
          <Text style={{ color: colors.textMuted, fontSize: 11, marginBottom: 12 }}>← ALL HOLY DAYS</Text>
        </Pressable>
        <Text style={[styles.detailTitle, { color: colors.accent }]}>{selected.title}</Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>
          {selected.deity} · {selected.function} · {selected.date.replace('-', '/')}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 8, fontStyle: 'italic' }}>
          {selected.placement_meaning}
        </Text>
        <View style={styles.tabRow}>
          {(['personal', 'household'] as const).map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} style={styles.tabBtn}>
              <Text style={{ color: tab === t ? colors.accent : colors.textMuted, fontSize: 10, letterSpacing: 1 }}>
                {t.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={{ color: colors.text, fontSize: 13, lineHeight: 21 }}>
          {tab === 'personal' ? getPersonalObservance(selected, profile) : selected.household}
        </Text>
        <Text style={{ color: colors.textDisabled, fontSize: 11, marginTop: 16 }}>{selected.log_prompt}</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.root, { backgroundColor: colors.background }]} contentContainerStyle={styles.pad}>
      <Text style={[styles.title, { color: colors.accent }]}>Holy Days</Text>
      <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 16 }}>
        Eight observances on the calendar. Tap for personal and household rites.
      </Text>
      {upcoming.map((day) => (
        <Pressable
          key={day.id}
          onPress={() => {
            setSelected(day);
            setTab('personal');
          }}
          style={[styles.row, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <Text style={{ color: colors.accent, fontSize: 16 }}>{day.calendarSymbol}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 13 }}>{day.name}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>
              {day.deity} · {day.functionCode} · in {daysUntilHolyDay(day.date)} days
            </Text>
          </View>
        </Pressable>
      ))}
      <Text style={{ color: colors.textDisabled, fontSize: 10, marginTop: 12 }}>
        {HOLY_DAYS.length} holy days · calendar integration Layer 6
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  pad: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 16, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  detailTitle: { fontSize: 18, marginBottom: 4 },
  tabRow: { flexDirection: 'row', gap: 16, marginVertical: 14 },
  tabBtn: { paddingVertical: 4 },
});
