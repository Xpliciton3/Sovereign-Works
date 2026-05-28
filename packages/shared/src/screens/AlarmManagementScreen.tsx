import { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { useAlarms } from '../alarms/useAlarms';
import { useSchedule } from '../hooks/useSchedule';
import { useShiftPlanner } from '../hooks/useShiftPlanner';
import { useHydration } from '../hooks/useHydration';
import { formatClock12 } from '../alarms/timeParse';
import { requestAlarmPermissions, openAppSettings } from '../alarms/permissions';
import { checkAlarmPermissions, PERMISSION_COPY } from '../alarms/permissionsFlow';
import { AlarmPermissionsGate } from './AlarmPermissionsGate';

type Props = {
  profile: Profile;
  colors: ThemeColors;
};

export function AlarmManagementScreen({ profile, colors }: Props) {
  const { sleepWindow, isWorkDay, overtimeHours, shiftType } = useSchedule();
  const { schedule } = useShiftPlanner(profile, shiftType, isWorkDay, sleepWindow.wake);
  const { loggedOz, targetOz } = useHydration(profile);
  const { alarms, syncAllAlarms, toggleAlarm, removeAlarm } = useAlarms(profile);
  const [permsOk, setPermsOk] = useState(false);

  useEffect(() => {
    if (!sleepWindow) return;
    const goalMet = loggedOz >= targetOz;
    void syncAllAlarms(sleepWindow, isWorkDay, overtimeHours, goalMet, schedule);
  }, [sleepWindow, isWorkDay, overtimeHours, loggedOz, targetOz, schedule, syncAllAlarms]);

  useEffect(() => {
    void checkAlarmPermissions().then((s) => setPermsOk(s.allGranted));
  }, [alarms]);

  const grouped = {
    wake: alarms.filter((a) => a.alarmType === 'wake' || a.alarmType === 'overtime'),
    sleep: alarms.filter((a) => a.alarmType === 'winddown' || a.alarmType === 'sleep'),
    hydration: alarms.filter((a) => a.alarmType === 'hydration'),
    batch: alarms.filter((a) => a.alarmType === 'batchcook'),
    custom: alarms.filter((a) => a.alarmType === 'custom'),
  };

  return (
    <ScrollView style={[styles.root, { backgroundColor: colors.background }]} contentContainerStyle={styles.pad}>
      <Text style={[styles.title, { color: colors.accent }]}>Alarms</Text>
      <AlarmPermissionsGate colors={colors} onGranted={() => setPermsOk(true)} />
      {permsOk && (
        <Text style={{ color: colors.accent, fontSize: 12, marginBottom: 12 }}>{PERMISSION_COPY.active}</Text>
      )}
      <Text style={[styles.note, { color: colors.textMuted }]}>
        Wake, wind-down, and sleep sync from your shift schedule. Hydration and batch-cook follow the Groq planner and
        week plan.
      </Text>
      {Platform.OS === 'android' && (
        <>
          <Pressable
            onPress={() => requestAlarmPermissions()}
            style={[styles.permBtn, { borderColor: colors.accent }]}
          >
            <Text style={{ color: colors.accent, fontSize: 11, letterSpacing: 1 }}>ENABLE ALARM PERMISSIONS</Text>
          </Pressable>
          <Pressable onPress={() => openAppSettings()} style={[styles.permBtn, { borderColor: colors.border }]}>
            <Text style={{ color: colors.textMuted, fontSize: 11, letterSpacing: 1 }}>OPEN SYSTEM SETTINGS</Text>
          </Pressable>
        </>
      )}
      {(
        [
          ['Wake / OT', grouped.wake],
          ['Sleep window', grouped.sleep],
          ['Hydration', grouped.hydration],
          ['Batch cook', grouped.batch],
          ['Custom', grouped.custom],
        ] as const
      ).map(([label, list]) =>
        list.length === 0 ? null : (
          <View key={label} style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>
              {label.toUpperCase()}
            </Text>
            {list.map((alarm) => (
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
                {alarm.alarmType === 'custom' && (
                  <Pressable onPress={() => removeAlarm(alarm.id)}>
                    <Text style={{ color: colors.textDisabled, fontSize: 11 }}>DEL</Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        )
      )}
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
