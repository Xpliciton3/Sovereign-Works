import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { useDietary } from '../hooks/useDietary';
import { useAlarms } from '../alarms/useAlarms';
import { HolyDaysScreen } from './HolyDaysScreen';

type Props = {
  profile: Profile;
  colors: ThemeColors;
};

const SECTIONS = [
  { id: 'dietary', label: 'Dietary Profile' },
  { id: 'alarms', label: 'Notifications & Alarms' },
  { id: 'holydays', label: 'Holy Days' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'household', label: 'Household' },
] as const;

export function Layer2MoreScreen({ profile, colors }: Props) {
  const [section, setSection] = useState<(typeof SECTIONS)[number]['id'] | null>(null);
  const { diet, updateDiet } = useDietary();
  const { notif, saveNotifSettings } = useAlarms(profile);

  if (section === 'holydays') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Pressable onPress={() => setSection(null)} style={{ padding: 16, paddingTop: 48 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11 }}>← SETTINGS</Text>
        </Pressable>
        <HolyDaysScreen profile={profile} colors={colors} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.root, { backgroundColor: colors.background }]} contentContainerStyle={styles.pad}>
      <Text style={[styles.title, { color: colors.accent }]}>Settings</Text>
      {SECTIONS.map(({ id, label }) => (
        <Pressable
          key={id}
          onPress={() => setSection(section === id ? null : id)}
          style={[styles.row, { borderColor: section === id ? colors.accent : colors.border, backgroundColor: colors.surface }]}
        >
          <Text style={{ color: colors.text, fontSize: 13 }}>{label}</Text>
        </Pressable>
      ))}

      {section === 'dietary' && (
        <View style={[styles.panel, { borderColor: colors.border }]}>
          {(
            [
              ['nutFree', 'Nut-free'],
              ['gastricBypass', 'Post-gastric bypass'],
              ['avoidFish', 'Avoid strong fish/seafood'],
              ['avoidRawOnion', 'Avoid raw onion'],
              ['avoidCilantro', 'Avoid cilantro'],
              ['avoidMushrooms', 'Avoid cooked mushrooms'],
              ['avoidStrongCheese', 'Avoid strong cheese'],
            ] as const
          ).map(([key, label]) => (
            <View key={key} style={styles.switchRow}>
              <Text style={{ color: colors.text, fontSize: 12, flex: 1 }}>{label}</Text>
              <Switch
                value={diet[key]}
                onValueChange={(v) => updateDiet({ [key]: v })}
                trackColor={{ true: colors.accent, false: colors.border }}
              />
            </View>
          ))}
        </View>
      )}

      {section === 'alarms' && (
        <View style={[styles.panel, { borderColor: colors.border }]}>
          <View style={styles.switchRow}>
            <Text style={{ color: colors.text, fontSize: 12, flex: 1 }}>Batch cook reminder (7 PM)</Text>
            <Switch
              value={notif.batchCook}
              onValueChange={(v) => saveNotifSettings({ ...notif, batchCook: v })}
              trackColor={{ true: colors.accent, false: colors.border }}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={{ color: colors.text, fontSize: 12, flex: 1 }}>Hydration reminders</Text>
            <Switch
              value={notif.hydration}
              onValueChange={(v) => saveNotifSettings({ ...notif, hydration: v })}
              trackColor={{ true: colors.accent, false: colors.border }}
            />
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 8 }}>
            Open Planner → Alarms to grant permissions and view scheduled alarms.
          </Text>
        </View>
      )}

      {section === 'schedule' && (
        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 8 }}>
          Shift pattern controls are on Planner → Schedule.
        </Text>
      )}

      {section === 'household' && (
        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 8 }}>
          Household sync expands in Layer 4.
        </Text>
      )}

      <Text style={{ color: colors.textDisabled, fontSize: 10, marginTop: 20 }}>
        v1.0.10 · Layer 3 complete
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  pad: { padding: 16, paddingTop: 48, paddingBottom: 40 },
  title: { fontSize: 16, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  row: { borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 8 },
  panel: { borderWidth: 1, borderRadius: 8, padding: 14, marginTop: 4, marginBottom: 8 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
});
