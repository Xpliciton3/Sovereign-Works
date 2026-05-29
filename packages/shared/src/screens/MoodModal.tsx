import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { useMood } from '../hooks/useMood';
import { getProfileConfig } from '../profiles';
import { MoodScoreChart, PartnerMoodHistoryChart } from '../ui/MoodScoreChart';

type MoodTab = 'log' | 'partner' | 'history';

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: Profile;
  colors: ThemeColors;
  householdId: string | null;
  initialTab?: MoodTab;
};

export function MoodModal({ visible, onClose, profile, colors, householdId, initialTab = 'log' }: Props) {
  const [tab, setTab] = useState<MoodTab>(initialTab);
  const mood = useMood(profile, householdId);
  const pc = getProfileConfig(profile);
  const mindColor = profile === 'imperium' ? '#9060f0' : '#9878b0';
  const partnerDotColor = profile === 'imperium' ? '#c47878' : '#c9a84c';

  useEffect(() => {
    if (visible) setTab(initialTab);
  }, [visible, initialTab]);

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
                  {k === 'partner' ? pc.partnerName.toUpperCase() : k.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>
          <ScrollView style={styles.body}>
            {tab === 'log' && (
              <>
                <Text style={[styles.privacy, { color: colors.textMuted }]}>
                  Journal privately. On save, Groq translates your note and syncs it automatically — no share
                  button. Your partner reads it under the {pc.partnerName} tab. Raw notes never leave this device.
                </Text>
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
                      <Text style={{ color: mood.score === n ? '#000' : colors.textMuted, fontSize: 9 }}>{n}</Text>
                    </Pressable>
                  ))}
                </View>
                <View style={[styles.scoreBar, { backgroundColor: colors.surfaceElevated }]}>
                  <View
                    style={{
                      width: `${mood.score * 10}%`,
                      height: '100%',
                      backgroundColor:
                        mood.score <= 3 ? '#9a4040' : mood.score <= 6 ? colors.textMuted : '#18c48a',
                      borderRadius: 3,
                    }}
                  />
                </View>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginVertical: 10, fontStyle: 'italic' }}>
                  {mood.bracket}
                </Text>
                <TextInput
                  value={mood.note}
                  onChangeText={mood.setNote}
                  placeholder="What's happening? (private — never shared raw)"
                  placeholderTextColor={colors.textDisabled}
                  multiline
                  style={[styles.note, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
                />
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
                {mood.saveError ? (
                  <Text style={{ color: '#c04040', fontSize: 12, marginBottom: 8 }}>{mood.saveError}</Text>
                ) : null}
                <Pressable
                  onPress={async () => {
                    const ok = await mood.saveEntry();
                    if (ok) onClose();
                  }}
                  style={[styles.submit, { backgroundColor: mindColor }]}
                  disabled={mood.isTranslating}
                >
                  {mood.isTranslating ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={{ color: '#fff', fontSize: 12, letterSpacing: 1 }}>SAVE & SYNC</Text>
                  )}
                </Pressable>
              </>
            )}
            {tab === 'partner' && (
              <View style={{ paddingVertical: 8 }}>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 12 }}>
                  {pc.partnerName}&apos;s mood — synced live from their journal
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>
                  TODAY
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
                          mood.partnerDot !== null && d <= mood.partnerDot ? partnerDotColor : colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    />
                  ))}
                </View>
                {mood.partnerDot === null && !mood.partnerTranslatedText ? (
                  <Text style={{ color: colors.textDisabled, fontSize: 12, marginTop: 12 }}>
                    No entry yet today.
                  </Text>
                ) : mood.partnerTranslatedText ? (
                  <Text style={{ color: colors.text, fontSize: 13, lineHeight: 20, marginTop: 8 }}>
                    {mood.partnerTranslatedText}
                  </Text>
                ) : (
                  <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 8 }}>
                    Score logged — no journal text today.
                  </Text>
                )}
                <Text style={{ color: colors.textMuted, fontSize: 10, letterSpacing: 1, marginTop: 20, marginBottom: 6 }}>
                  LAST 14 DAYS
                </Text>
                <PartnerMoodHistoryChart
                  days={mood.partnerHistory}
                  colors={colors}
                  barColor={partnerDotColor}
                />
                {mood.partnerHistory.length > 0 && (
                  <View style={{ marginTop: 12, gap: 10 }}>
                    {[...mood.partnerHistory].reverse().slice(0, 7).map((day) => (
                      <View
                        key={day.date}
                        style={[styles.dayRow, { borderColor: colors.border, backgroundColor: colors.surface }]}
                      >
                        <Text style={{ color: colors.textMuted, fontSize: 10 }}>{day.date}</Text>
                        <View style={styles.miniDots}>
                          {[1, 2, 3, 4, 5].map((d) => (
                            <View
                              key={d}
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: d <= day.dotScore ? partnerDotColor : colors.surfaceElevated,
                              }}
                            />
                          ))}
                        </View>
                        {day.translation ? (
                          <Text style={{ color: colors.text, fontSize: 12, lineHeight: 18, marginTop: 4 }}>
                            {day.translation}
                          </Text>
                        ) : null}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
            {tab === 'history' && (
              <View style={{ paddingVertical: 8 }}>
                <Text style={{ color: colors.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 8 }}>
                  YOUR LAST 7 ENTRIES (THIS DEVICE)
                </Text>
                <MoodScoreChart
                  scores={mood.history}
                  labels={['M', 'T', 'W', 'T', 'F', 'S', 'S'].slice(0, mood.history.length)}
                  colors={colors}
                  barColor="#18c48a"
                />
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
  privacy: { fontSize: 12, lineHeight: 18, marginBottom: 12 },
  scoreRow: { flexDirection: 'row', gap: 2, marginBottom: 8 },
  scoreBtn: { flex: 1, minWidth: 24, height: 30, borderWidth: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  scoreBar: { height: 5, borderRadius: 3, marginBottom: 8, overflow: 'hidden' },
  note: { borderWidth: 1, borderRadius: 6, padding: 10, height: 80, textAlignVertical: 'top', marginBottom: 12 },
  dots: { flexDirection: 'row', gap: 6, marginVertical: 12 },
  submit: { padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 8, minHeight: 48, justifyContent: 'center' },
  dayRow: { borderWidth: 1, borderRadius: 8, padding: 10 },
  miniDots: { flexDirection: 'row', gap: 4, marginTop: 4 },
});
