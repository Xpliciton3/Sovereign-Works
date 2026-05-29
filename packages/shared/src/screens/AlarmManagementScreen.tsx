import { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { useAlarms, SNOOZE_OPTIONS } from '../alarms/useAlarms';
import { useSchedule } from '../hooks/useSchedule';
import { useShiftPlanner } from '../hooks/useShiftPlanner';
import { useHydration } from '../hooks/useHydration';
import { formatClock12 } from '../alarms/timeParse';
import { requestAlarmPermissions, openAppSettings } from '../alarms/permissions';
import { checkAlarmPermissions } from '../alarms/permissionsFlow';
import { FONT_FAMILIES } from '../typography';
import { AddAlarmModal } from './AddAlarmModal';

type Props = {
  profile: Profile;
  colors: ThemeColors;
};

export function AlarmManagementScreen({ profile, colors }: Props) {
  const { sleepWindow, isWorkDay, overtimeHours, shiftType } = useSchedule();
  const { schedule } = useShiftPlanner(profile, shiftType, isWorkDay, sleepWindow.wake);
  const { loggedOz, targetOz } = useHydration(profile);
  const {
    alarms,
    syncAllAlarms,
    toggleAlarm,
    removeAlarm,
    addCustomAlarm,
    snoozeMinutes,
    setDefaultSnooze,
  } = useAlarms(profile);
  const [permsOk, setPermsOk] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

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
      <Text style={[styles.title, { color: colors.accent, fontFamily: FONT_FAMILIES.uiSemi }]}>Alarms</Text>
      {permsOk && (
        <Text style={{ color: colors.accent, fontSize: 12, marginBottom: 8, fontFamily: FONT_FAMILIES.ui }}>
          Permissions active — alarms will fire on device.
        </Text>
      )}
      <Text style={[styles.note, { color: colors.textMuted, fontFamily: FONT_FAMILIES.uiLight }]}>
        Wake, wind-down, and sleep sync from your shift schedule. Hydration and batch-cook follow the Groq planner.
      </Text>

      <Text style={[styles.sectionLabel, { color: colors.textMuted, fontFamily: FONT_FAMILIES.ui }]}>DEFAULT SNOOZE</Text>
      <View style={styles.snoozeRow}>
        {SNOOZE_OPTIONS.map((m) => (
          <Pressable
            key={m}
            onPress={() => setDefaultSnooze(m)}
            style={[
              styles.snoozeChip,
              { borderColor: colors.border },
              snoozeMinutes === m && { borderColor: colors.accent, backgroundColor: colors.surface },
            ]}
          >
            <Text style={{ color: snoozeMinutes === m ? colors.accent : colors.textMuted, fontFamily: FONT_FAMILIES.ui }}>
              {m}m
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={() => setAddOpen(true)} style={[styles.addBtn, { borderColor: colors.accent }]}>
        <Text style={{ color: colors.accent, fontFamily: FONT_FAMILIES.uiSemi, fontSize: 11, letterSpacing: 1 }}>
          + ADD CUSTOM ALARM
        </Text>
      </Pressable>

      {Platform.OS === 'android' && (
        <>
          <Pressable
            onPress={() => requestAlarmPermissions()}
            style={[styles.permBtn, { borderColor: colors.accent }]}
          >
            <Text style={{ color: colors.accent, fontSize: 11, letterSpacing: 1, fontFamily: FONT_FAMILIES.ui }}>
              ENABLE ALARM PERMISSIONS
            </Text>
          </Pressable>
          <Pressable onPress={() => openAppSettings()} style={[styles.permBtn, { borderColor: colors.border }]}>
            <Text style={{ color: colors.textMuted, fontSize: 11, letterSpacing: 1, fontFamily: FONT_FAMILIES.ui }}>
              OPEN SYSTEM SETTINGS
            </Text>
          </Pressable>
        </>
      )}

      {(
        [
          ['Wake / OT', grouped.wake, false],
          ['Sleep window', grouped.sleep, false],
          ['Hydration', grouped.hydration, false],
          ['Batch cook', grouped.batch, false],
          ['Custom', grouped.custom, true],
        ] as const
      ).map(([label, list, canDelete]) =>
        list.length === 0 ? null : (
          <View key={label} style={{ marginBottom: 12 }}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted, fontFamily: FONT_FAMILIES.ui }]}>
              {label.toUpperCase()}
            </Text>
            {list.map((alarm) => (
              <Pressable
                key={alarm.id}
                onLongPress={canDelete ? () => removeAlarm(alarm.id) : undefined}
                style={[styles.row, { borderColor: colors.border, backgroundColor: colors.surface }]}
              >
                <View style={styles.rowBody}>
                  <Text style={{ color: colors.text, fontSize: 13, fontFamily: FONT_FAMILIES.display }}>{alarm.label}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 11, fontFamily: FONT_FAMILIES.uiLight }}>
                    {formatClock12(alarm.hour, alarm.minute)} · {alarm.alarmType.toUpperCase()} · snooze {alarm.snoozeMinutes}m
                  </Text>
                </View>
                <Pressable onPress={() => toggleAlarm(alarm.id)} style={styles.toggle}>
                  <Text style={{ color: alarm.enabled ? colors.accent : colors.textDisabled, fontSize: 11 }}>
                    {alarm.enabled ? 'ON' : 'OFF'}
                  </Text>
                </Pressable>
                {canDelete && (
                  <Pressable onPress={() => removeAlarm(alarm.id)}>
                    <Text style={{ color: colors.textDisabled, fontSize: 11 }}>DEL</Text>
                  </Pressable>
                )}
              </Pressable>
            ))}
            {canDelete && (
              <Text style={{ color: colors.textDisabled, fontSize: 10, fontFamily: FONT_FAMILIES.uiLight }}>
                Long-press or DEL to remove custom alarms.
              </Text>
            )}
          </View>
        )
      )}

      {alarms.length === 0 && (
        <Text style={{ color: colors.textMuted, fontSize: 12, fontFamily: FONT_FAMILIES.uiLight }}>
          No alarms scheduled yet.
        </Text>
      )}

      <AddAlarmModal
        visible={addOpen}
        colors={colors}
        onClose={() => setAddOpen(false)}
        onSave={(h, m, label) => void addCustomAlarm(h, m, label)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  pad: { padding: 16, paddingTop: 8, paddingBottom: 32 },
  title: { fontSize: 16, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  note: { fontSize: 12, lineHeight: 18, marginBottom: 12 },
  sectionLabel: { fontSize: 10, letterSpacing: 1, marginBottom: 6 },
  snoozeRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  snoozeChip: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 14, paddingVertical: 8 },
  addBtn: { borderWidth: 1, borderRadius: 6, padding: 12, alignItems: 'center', marginBottom: 12 },
  permBtn: { borderWidth: 1, borderRadius: 6, padding: 10, alignItems: 'center', marginBottom: 8 },
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
