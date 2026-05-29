import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { Layer2NourishScreen } from './Layer2NourishScreen';
import { PracticeScreen } from './PracticeScreen';

type BodyTab = 'nourish' | 'practice' | 'hydration';

type Props = {
  profile: Profile;
  colors: ThemeColors;
};

export function Layer2BodyScreen({ profile, colors }: Props) {
  const [tab, setTab] = useState<BodyTab>('nourish');
  const bodyColor = '#18c48a';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        {(
          [
            ['nourish', 'Nourish'],
            ['practice', profile === 'imperium' ? "Warrior's" : "Keeper's"],
            ['hydration', 'Hydration'],
          ] as const
        ).map(([key, label]) => (
          <Pressable key={key} onPress={() => setTab(key)} style={styles.tab}>
            <Text style={{ color: tab === key ? bodyColor : colors.textMuted, fontSize: 10, letterSpacing: 0.5 }}>
              {label.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>
      {tab === 'nourish' && <Layer2NourishScreen profile={profile} colors={colors} />}
      {tab === 'practice' && <PracticeScreen profile={profile} colors={colors} />}
      {tab === 'hydration' && (
        <View style={styles.stub}>
          <Text style={{ color: colors.textMuted, fontSize: 12, textAlign: 'center' }}>
            Hydration tracker lives on Home → Body hub until full Body tab build.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 48 },
  tabs: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  stub: { flex: 1, justifyContent: 'center', padding: 24 },
});
