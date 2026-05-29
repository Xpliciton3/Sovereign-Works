import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { getProfileConfig } from '../profiles';
import { getTodayQuote } from '../data/quotes';
import { useHydration } from '../hooks/useHydration';
import { useSchedule } from '../hooks/useSchedule';
import { useShiftPlanner } from '../hooks/useShiftPlanner';
import { usePlanner } from '../hooks/usePlanner';
import { useHouseholdContext } from '../context/HouseholdContext';
import { SvgIcon } from '../ui/SvgIcon';
import { SyncStatusDot } from '../ui/SyncStatusDot';
import { PartnerCard } from './PartnerCard';
import { MoodModal } from './MoodModal';

type Props = {
  profile: Profile;
  colors: ThemeColors;
  partnerApkUrl: string;
  onOpenHolyDays?: () => void;
};

export function Layer2HomeScreen({ profile, colors, partnerApkUrl, onOpenHolyDays }: Props) {
  const pc = getProfileConfig(profile);
  const quote = getTodayQuote(profile);
  const hh = useHouseholdContext();
  const { loggedOz, targetOz, percent, addOz, removeOz, resetToday } = useHydration(profile);
  const {
    sleepWindow,
    overtimeHours,
    shiftLabel,
    setOvertime,
    cancelOvertime,
    shiftType,
    isWorkDay,
  } = useSchedule();
  const { schedule } = useShiftPlanner(profile, shiftType, isWorkDay, sleepWindow.wake);
  const { partnerDoneCount, partnerTotalCount } = usePlanner(profile, hh.householdId);
  const [showMood, setShowMood] = useState(false);
  const [hub, setHub] = useState<'mind' | 'body' | 'soul' | null>(null);
  const imp = profile === 'imperium';

  return (
    <>
      <ScrollView style={[styles.root, { backgroundColor: colors.background }]} contentContainerStyle={styles.pad}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.accent }]}>{pc.displayName}</Text>
          <SyncStatusDot status={hh.syncStatus} colors={colors} onRetry={() => void hh.retrySync()} />
        </View>
        <Text style={[styles.person, { color: colors.textMuted }]}>{pc.personName} · {pc.practitionerTitle}</Text>

        <PartnerCard
          profile={profile}
          colors={colors}
          householdId={hh.householdId}
          partnerJoined={hh.partnerJoined}
          partnerName={hh.partnerName}
          partnerDoneCount={partnerDoneCount}
          partnerTotalCount={partnerTotalCount}
          syncStatus={hh.syncStatus}
          joinCodeFormatted={hh.joinCodeFormatted}
          partnerApkUrl={partnerApkUrl}
          onRetrySync={() => void hh.retrySync()}
        />

        <View style={[styles.shiftRow, { borderColor: colors.border }]}>
          <Text style={[styles.shift, { color: '#44aa44' }]}>{shiftLabel}</Text>
        </View>
        <Text style={[styles.sleepLine, { color: colors.textMuted }]}>
          WAKE {sleepWindow.wake} · SLEEP {sleepWindow.sleep}
          {schedule ? ` · Active ${schedule.activeWindowStart}–${schedule.activeWindowEnd}` : ''}
        </Text>
        <View style={styles.quickRow}>
          {[1, 2, 4].map((h) => (
            <Pressable key={h} onPress={() => setOvertime(h)} style={[styles.quickBtn, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textMuted, fontSize: 10 }}>OT +{h}h</Text>
            </Pressable>
          ))}
          {overtimeHours > 0 && (
            <Pressable onPress={cancelOvertime} style={[styles.quickBtn, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textMuted, fontSize: 10 }}>Cancel OT</Text>
            </Pressable>
          )}
        </View>

        <View style={[styles.quoteCard, { borderLeftColor: colors.accent, borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={[styles.quote, { color: colors.text }]}>{quote}</Text>
        </View>

        <View style={styles.hubRow}>
          {(
            [
              ['mind', 'Mind', '#9060f0', 'brain' as const],
              ['body', 'Body', '#18c48a', 'drop' as const],
              ['soul', 'Soul', colors.accent, 'star' as const],
            ] as const
          ).map(([key, label, col, icon]) => (
            <Pressable
              key={key}
              onPress={() => setHub(hub === key ? null : key)}
              style={[styles.hubTile, { borderColor: hub === key ? col : colors.border, backgroundColor: colors.surface }]}
            >
              <SvgIcon name={icon} size={18} color={col} />
              <Text style={{ color: col, fontSize: 12, letterSpacing: 1 }}>{label}</Text>
            </Pressable>
          ))}
        </View>

        {hub === 'mind' && (
          <View style={[styles.hubPanel, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <Pressable onPress={() => setShowMood(true)} style={[styles.hubAction, { borderColor: '#9060f055' }]}>
              <SvgIcon name="brain" size={16} color="#9060f0" />
              <Text style={{ color: '#9060f0', fontSize: 11, letterSpacing: 1 }}>MOOD TRACKER</Text>
            </Pressable>
          </View>
        )}

        {hub === 'body' && (
          <View style={[styles.hubPanel, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <Text style={[styles.hydTitle, { color: '#18c48a' }]}>Hydration</Text>
            <Text style={{ color: colors.text, fontSize: 22 }}>{loggedOz} / {targetOz} oz</Text>
            <View style={[styles.hydBar, { backgroundColor: colors.surfaceElevated }]}>
              <View style={[styles.hydFill, { width: `${percent}%`, backgroundColor: '#18c48a' }]} />
            </View>
            <View style={styles.hydBtns}>
              {[8, 16, 24].map((oz) => (
                <Pressable key={`p${oz}`} onPress={() => addOz(oz)} style={[styles.hydBtn, { borderColor: '#18c48a55' }]}>
                  <Text style={{ color: '#18c48a', fontSize: 12 }}>+{oz}</Text>
                </Pressable>
              ))}
              <Pressable onPress={() => removeOz(8)} style={[styles.hydBtn, { borderColor: '#18c48a55' }]}>
                <Text style={{ color: '#18c48a', fontSize: 12 }}>−8</Text>
              </Pressable>
            </View>
            <Pressable onPress={() => resetToday()} style={{ marginTop: 8 }}>
              <Text style={{ color: colors.textMuted, fontSize: 11 }}>Reset Today</Text>
            </Pressable>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 12 }}>
              {imp ? "Warrior's Practice" : "Keeper's Practice"} — Layer 5+
            </Text>
          </View>
        )}

        {hub === 'soul' && (
          <View style={[styles.hubPanel, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <Pressable onPress={onOpenHolyDays} style={[styles.hubAction, { borderColor: `${colors.accent}55` }]}>
              <SvgIcon name="star" size={16} color={colors.accent} />
              <Text style={{ color: colors.accent, fontSize: 11, letterSpacing: 1 }}>HOLY DAYS</Text>
            </Pressable>
          </View>
        )}

        <Text style={[styles.axiom, { color: colors.accent }]}>{pc.axiom}</Text>
      </ScrollView>

      {showMood && (
        <MoodModal
          visible={showMood}
          onClose={() => setShowMood(false)}
          profile={profile}
          colors={colors}
          householdId={hh.householdId}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  pad: { padding: 16, paddingTop: 48, paddingBottom: 40 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 20, letterSpacing: 2, textTransform: 'uppercase' },
  person: { fontSize: 12, marginBottom: 12 },
  shiftRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: 12 },
  shift: { fontSize: 11, letterSpacing: 1, flex: 1 },
  sleepLine: { fontSize: 10, marginBottom: 8 },
  quickRow: { flexDirection: 'row', gap: 6, marginBottom: 10, flexWrap: 'wrap' },
  quickBtn: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6 },
  quoteCard: { borderLeftWidth: 3, borderWidth: 1, borderRadius: 8, padding: 16, marginBottom: 16 },
  quote: { fontSize: 16, fontStyle: 'italic', lineHeight: 24 },
  hubRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  hubTile: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 12, alignItems: 'center', gap: 6 },
  hubPanel: { borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 12 },
  hubAction: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 6, padding: 10 },
  hydTitle: { fontSize: 10, letterSpacing: 1, marginBottom: 8 },
  hydBar: { height: 6, borderRadius: 3, marginVertical: 10, overflow: 'hidden' },
  hydFill: { height: '100%' },
  hydBtns: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  hydBtn: { flex: 1, minWidth: 56, padding: 10, borderWidth: 1, borderRadius: 6, alignItems: 'center' },
  axiom: { fontSize: 13, letterSpacing: 1, lineHeight: 20, textAlign: 'center' },
});
