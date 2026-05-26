import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { useMood } from '../hooks/useMood';
import { getProfileConfig } from '../profiles';

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: Profile;
  colors: ThemeColors;
  householdId: string | null;
};

export function MoodModal({ visible, onClose, profile, colors, householdId }: Props) {
  const [tab, setTab] = useState<'log' | 'partner' | 'history'>('log');
  const mood = useMood(profile, householdId);
  const pc = getProfileConfig(profile);
  const mindColor = profile === 'imperium' ? '#9060f0' : '#9878b0';

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <View style={styles.header}>
            <Text style={{ color: colors.text, fontSize: 16 }}>Mood</Text>
            <Pressable onPress={onClose}>
              <Text style={{ color: colors.textMuted, fontSize: 22 }}>×</Text>
            </Pressable>
          </View>
          <View style={styles.tabs}>
            {(['log', 'partner', 'history'] as const).map((k) => (
              <Pressable key={k} onPress={() => setTab(k)} style={styles.tab}>
                <Text style={{ color: tab === k ? mindColor : colors.textMuted, fontSize: 10, letterSpacing: 1 }}>
                  {k.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
          <ScrollView style={styles.body}>
            {tab === 'log' && (
              <>
                <View style={styles.scoreRow}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <Pressable
                      key={n}
                      onPress={() => mood.setScore(n)}
                      style={[
                        styles.scoreBtn,
                        {
                          backgroundColor: mood.score === n ? '#18c48a' : colors.surface,
                          borderColor: mood.score === n ? '#18c48a' : colors.border,
                        },
                      ]}
                    >
                      <Text style={{ color: mood.score === n ? '#000' : colors.textMuted, fontSize: 10 }}>{n}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginVertical: 10 }}>{mood.bracket}</Text>
                <TextInput
                  value={mood.note}
                  onChangeText={mood.setNote}
                  placeholder="What's happening? (private — never shared raw)"
                  placeholderTextColor={colors.textDisabled}
                  multiline
                  style={[styles.note, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                />
                <Text style={[styles.transHdr, { color: mindColor }]}>Partner sees:</Text>
                <Text style={{ color: colors.textMuted, fontSize: 13, lineHeight: 20 }}>{mood.translation}</Text>
                <View style={styles.dots}>
                  {[1, 2, 3, 4, 5].map((d) => (
                    <View
                      key={d}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: d <= mood.dotScore ? '#18c48a' : colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    />
                  ))}
                </View>
                <Pressable
                  onPress={async () => {
                    await mood.submitMood();
                    onClose();
                  }}
                  style={[styles.submit, { backgroundColor: mindColor }]}
                >
                  <Text style={{ color: '#fff', fontSize: 12, letterSpacing: 1 }}>SUBMIT TO PARTNER FEED</Text>
                </Pressable>
              </>
            )}
            {tab === 'partner' && (
              <View style={{ paddingVertical: 16 }}>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 12 }}>
                  {pc.partnerName}&apos;s mood today (dot score only)
                </Text>
                <View style={styles.dots}>
                  {[1, 2, 3, 4, 5].map((d) => (
                    <View
                      key={d}
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor:
                          mood.partnerDot !== null && d <= mood.partnerDot ? '#18c48a' : colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    />
                  ))}
                </View>
                {mood.partnerDot === null && (
                  <Text style={{ color: colors.textDisabled, fontSize: 12, marginTop: 12 }}>
                    No partner mood logged yet today.
                  </Text>
                )}
              </View>
            )}
            {tab === 'history' && (
              <View style={styles.histRow}>
                {mood.history.map((s, i) => (
                  <View key={i} style={{ alignItems: 'center', gap: 4 }}>
                    <View
                      style={{
                        width: 24,
                        height: (s / 10) * 60,
                        backgroundColor: s >= 7 ? '#18c48a' : colors.surfaceElevated,
                        borderRadius: 2,
                      }}
                    />
                    <Text style={{ color: colors.textDisabled, fontSize: 9 }}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { maxHeight: '85%', borderTopWidth: 1, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  tabs: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#333' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  body: { padding: 16 },
  scoreRow: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  scoreBtn: { flex: 1, minWidth: 28, height: 32, borderWidth: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  note: { borderWidth: 1, borderRadius: 6, padding: 10, height: 80, textAlignVertical: 'top', marginBottom: 12 },
  transHdr: { fontSize: 10, letterSpacing: 1, marginBottom: 6 },
  dots: { flexDirection: 'row', gap: 6, marginVertical: 12 },
  submit: { padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  histRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100, paddingVertical: 16 },
});
