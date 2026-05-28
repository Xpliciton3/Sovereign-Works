import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { getProfileConfig } from '../profiles';
import { getTodayQuote } from '../data/quotes';
import { useHydration } from '../hooks/useHydration';
import { useSchedule } from '../hooks/useSchedule';
import { MoodModal } from './MoodModal';

type Props = {
  profile: Profile;
  colors: ThemeColors;
  householdId: string | null;
};

export function Layer2HomeScreen({ profile, colors, householdId }: Props) {
  const pc = getProfileConfig(profile);
  const quote = getTodayQuote(profile);
  const { loggedOz, targetOz, percent, addOz } = useHydration(profile);
  const { sleepWindow, overtimeHours, shiftLabel, setOvertime, cancelOvertime } = useSchedule();
  const [showMood, setShowMood] = useState(false);
  const [hub, setHub] = useState<'mind' | 'body' | 'soul' | null>(null);

  return (
    <>
      <ScrollView style={[styles.root, { backgroundColor: colors.background }]} contentContainerStyle={styles.pad}>
        <Text style={[styles.title, { color: colors.accent }]}>{pc.displayName}</Text>
        <Text style={[styles.person, { color: colors.textMuted }]}>{pc.personName} · {pc.practitionerTitle}</Text>

        <View style={[styles.shiftRow, { borderColor: colors.border }]}>
          <Text style={[styles.shift, { color: '#44aa44' }]}>{shiftLabel}</Text>
          <Text style={[styles.shiftPartner, { color: '#c47878' }]}>
            Partner: {pc.partnerName}
          </Text>
        </View>
        <Text style={[styles.sleepLine, { color: colors.textMuted }]}>
          WAKE {sleepWindow.wake} · SLEEP {sleepWindow.sleep}
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
              ['mind', 'Mind', '#9060f0'],
              ['body', 'Body', '#18c48a'],
              ['soul', 'Soul', colors.accent],
            ] as const
          ).map(([key, label, col]) => (
            <Pressable
              key={key}
              onPress={() => setHub(hub === key ? null : key)}
              style={[styles.hubTile, { borderColor: colors.border, backgroundColor: colors.surface }]}
            >
              <Text style={{ color: col, fontSize: 12, letterSpacing: 1 }}>{label}</Text>
            </Pressable>
          ))}
        </View>

        {hub === 'body' && (
          <View style={[styles.hydCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <Text style={[styles.hydTitle, { color: '#18c48a' }]}>Hydration</Text>
            <Text style={{ color: colors.text, fontSize: 22 }}>{loggedOz} / {targetOz} oz</Text>
            <View style={[styles.hydBar, { backgroundColor: colors.surfaceElevated }]}>
              <View style={[styles.hydFill, { width: `${percent}%`, backgroundColor: '#18c48a' }]} />
            </View>
            <View style={styles.hydBtns}>
              {[8, 16, 24].map((oz) => (
                <Pressable
                  key={oz}
                  onPress={() => addOz(oz)}
                  style={[styles.hydBtn, { borderColor: '#18c48a55' }]}
                >
                  <Text style={{ color: '#18c48a', fontSize: 12 }}>+{oz}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {hub === 'mind' && (
          <Text style={[styles.locked, { color: colors.textMuted }]}>Mind hub content is in active build.</Text>
        )}
        {hub === 'soul' && (
          <Text style={[styles.locked, { color: colors.textMuted }]}>
            Holy Days, rites, and partnership — open More → Holy Days for observances.
          </Text>
        )}

        <Pressable onPress={() => setShowMood(true)} style={[styles.moodBtn, { borderColor: '#9060f055' }]}>
          <Text style={{ color: '#9060f0', fontSize: 11, letterSpacing: 1 }}>LOG MOOD</Text>
        </Pressable>

        <Text style={[styles.axiom, { color: colors.accent }]}>{pc.axiom}</Text>
      </ScrollView>

      {showMood && (
        <MoodModal
          visible={showMood}
          onClose={() => setShowMood(false)}
          profile={profile}
          colors={colors}
          householdId={householdId}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  pad: { padding: 16, paddingTop: 48, paddingBottom: 40 },
  title: { fontSize: 20, letterSpacing: 2, textTransform: 'uppercase' },
  person: { fontSize: 12, marginBottom: 12 },
  shiftRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: 12 },
  shift: { fontSize: 11, letterSpacing: 1 },
  shiftPartner: { fontSize: 11 },
  sleepLine: { fontSize: 10, marginBottom: 8 },
  quickRow: { flexDirection: 'row', gap: 6, marginBottom: 10, flexWrap: 'wrap' },
  quickBtn: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6 },
  quoteCard: { borderLeftWidth: 3, borderWidth: 1, borderRadius: 8, padding: 16, marginBottom: 16 },
  quote: { fontSize: 16, fontStyle: 'italic', lineHeight: 24 },
  hubRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  hubTile: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 12, alignItems: 'center', gap: 4 },
  hydCard: { borderWidth: 1, borderRadius: 8, padding: 16, marginBottom: 12 },
  hydTitle: { fontSize: 10, letterSpacing: 1, marginBottom: 8 },
  hydBar: { height: 6, borderRadius: 3, marginVertical: 10, overflow: 'hidden' },
  hydFill: { height: '100%' },
  hydBtns: { flexDirection: 'row', gap: 8 },
  hydBtn: { flex: 1, padding: 10, borderWidth: 1, borderRadius: 6, alignItems: 'center' },
  locked: { fontSize: 12, marginBottom: 12, fontStyle: 'italic' },
  moodBtn: { borderWidth: 1, borderRadius: 6, padding: 12, alignItems: 'center', marginBottom: 16 },
  axiom: { fontSize: 13, letterSpacing: 1, lineHeight: 20, textAlign: 'center' },
});
