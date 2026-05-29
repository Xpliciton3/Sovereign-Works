import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { MoodModal } from './MoodModal';
import { useHouseholdContext } from '../context/HouseholdContext';
import { SvgIcon } from '../ui/SvgIcon';

type Props = {
  profile: Profile;
  colors: ThemeColors;
};

export function Layer2MindScreen({ profile, colors }: Props) {
  const hh = useHouseholdContext();
  const [showMood, setShowMood] = useState(true);
  const mindColor = profile === 'imperium' ? '#9060f0' : '#9878b0';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <SvgIcon name="brain" size={20} color={mindColor} />
        <Text style={{ color: mindColor, fontSize: 14, letterSpacing: 2 }}>MIND</Text>
      </View>
      <ScrollView contentContainerStyle={styles.pad}>
        <Text style={{ color: colors.textMuted, fontSize: 12, lineHeight: 18, marginBottom: 12 }}>
          Mood journal, partner readings, and your history. Saves translate and sync automatically.
        </Text>
        <Pressable
          onPress={() => setShowMood(true)}
          style={[styles.btn, { borderColor: mindColor }]}
        >
          <Text style={{ color: mindColor, fontSize: 11, letterSpacing: 1 }}>OPEN MOOD TRACKER</Text>
        </Pressable>
      </ScrollView>
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
  pad: { padding: 16, paddingBottom: 40 },
  btn: { borderWidth: 1, borderRadius: 6, padding: 12, alignItems: 'center' },
});
