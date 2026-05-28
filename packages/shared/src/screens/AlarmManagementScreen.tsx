import { useEffect } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { useAlarms } from '../alarms/useAlarms';
import { useSchedule } from '../hooks/useSchedule';
import { formatClock12 } from '../alarms/timeParse';
import { requestExactAlarmPermission } from '../alarms/nativeBridge';

type Props = {
  profile: Profile;
  colors: ThemeColors;
};

export function AlarmManagementScreen({ profile, colors }: Props) {
  const { sleepWindow, isWorkDay } = useSchedule();
  const { alarms, syncFromSleepWindow, toggleAlarm, removeAlarm } = useAlarms(profile);

  useEffect(() => {
    if (sleepWindow) {
      void syncFromSleepWindow(sleepWindow, isWorkDay);
    }
  }, [sleepWindow, isWorkDay, syncFromSleepWindow]);

  return (
    <ScrollView style={[styles.root, { backgroundColor: colors.background }]} contentContainerStyle={styles.pad}>
      <Text style={[styles.title, { color: colors.accent }]}>Alarms</Text>
      <Text style={[styles.note, { color: colors.textMuted }]}>
        Layer 3 native full-screen alarms. Grant exact-alarm permission for wake times to fire on lock screen.
      </Text>
      {Platform.OS === 'android' && (
        <Pressable
          onPress={async () => {
            await requestExactAlarmPermission();
            await Linking.openSettings();
          }}
          style={[styles.permBtn, { borderColor: colors.accent }]}
        >
          <Text style={{ color: colors.accent, fontSize: 11, letterSpacing: 1 }}>GRANT EXACT ALARM PERMISSION</Text>
        </Pressable>
      )}
      {alarms.map((alarm) => (
        <View key={alarm.id} style={[styles.row, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <View style={styles.rowBody}>
            <Text style={{ color: colors.text, fontSize: 13 }}>{alarm.label}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 11 }}>
              {formatClock12(alarm.hour, alarm.minute)} · {alarm.alarmType.toUpperCase()}
            </Text>
          </View>
          <Pressable onPress={() => toggleAlarm(alarm.id)} style={styles.toggle}>
            <Text style={{ color: alarm.enabled ? colors.accent : colors.textDisabled, fontSize: 11 }}>
              {alarm.enabled ? 'ON' : 'OFF'}
            </Text>
          </Pressable>
          <Pressable onPress={() => removeAlarm(alarm.id)}>
            <Text style={{ color: colors.textDisabled, fontSize: 11 }}>DEL</Text>
          </Pressable>
        </View>
      ))}
      {alarms.length === 0 && (
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>No alarms scheduled yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  pad: { padding: 16, paddingTop: 8, paddingBottom: 32 },
  title: { fontSize: 16, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  note: { fontSize: 12, lineHeight: 18, marginBottom: 12 },
  permBtn: { borderWidth: 1, borderRadius: 6, padding: 10, alignItems: 'center', marginBottom: 14 },
  row: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowBody: { flex: 1, gap: 4 },
  toggle: { paddingHorizontal: 8 },
});
