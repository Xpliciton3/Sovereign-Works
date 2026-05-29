import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { useHouseholdContext } from '../context/HouseholdContext';
import { SvgIcon } from '../ui/SvgIcon';
import { MoodModal } from './MoodModal';
import { VelnarGuideScreen } from './VelnarGuideScreen';
import { VocalCoachScreen } from './VocalCoachScreen';

type MindTab = 'mood' | 'language' | 'coach';

type Props = {
  profile: Profile;
  colors: ThemeColors;
};

export function Layer2MindScreen({ profile, colors }: Props) {
  const hh = useHouseholdContext();
  const [tab, setTab] = useState<MindTab>('mood');
  const [showMood, setShowMood] = useState(false);
  const mindColor = profile === 'imperium' ? '#9060f0' : '#9878b0';
  const imperium = profile === 'imperium';

  const tabs: { key: MindTab; label: string }[] = imperium
    ? [
        { key: 'mood', label: 'Mood' },
        { key: 'language', label: "Vel'nar" },
        { key: 'coach', label: 'Coach' },
      ]
    : [{ key: 'mood', label: 'Mood' }];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <SvgIcon name="brain" size={20} color={mindColor} />
        <Text style={{ color: mindColor, fontSize: 14, letterSpacing: 2 }}>MIND</Text>
      </View>
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {tabs.map(({ key, label }) => (
          <Pressable key={key} onPress={() => setTab(key)} style={styles.tab}>
            <Text style={{ color: tab === key ? mindColor : colors.textMuted, fontSize: 10, letterSpacing: 0.5 }}>
              {label.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>
      {tab === 'mood' && (
        <ScrollView contentContainerStyle={styles.pad}>
          <Text style={{ color: colors.textMuted, fontSize: 12, lineHeight: 18, marginBottom: 12 }}>
            Journal privately. Groq translates and syncs automatically — your partner reads it on their Partner tab.
          </Text>
          <Pressable onPress={() => setShowMood(true)} style={[styles.btn, { borderColor: mindColor }]}>
            <Text style={{ color: mindColor, fontSize: 11, letterSpacing: 1 }}>OPEN MOOD TRACKER</Text>
          </Pressable>
        </ScrollView>
      )}
      {tab === 'language' && imperium && <VelnarGuideScreen colors={colors} />}
      {tab === 'coach' && imperium && <VocalCoachScreen colors={colors} />}
      <MoodModal
        visible={showMood}
        onClose={() => setShowMood(false)}
        profile={profile}
        colors={colors}
        householdId={hh.householdId}
        initialTab="log"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 48 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 8 },
  tabs: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  pad: { padding: 16, paddingBottom: 40 },
  btn: { borderWidth: 1, borderRadius: 6, padding: 12, alignItems: 'center' },
});
