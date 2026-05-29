import { StyleSheet, Text, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { HolyDaysScreen } from './HolyDaysScreen';
import { SvgIcon } from '../ui/SvgIcon';

type Props = {
  profile: Profile;
  colors: ThemeColors;
};

export function Layer2SoulScreen({ profile, colors }: Props) {
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <SvgIcon name="star" size={20} color={colors.accent} />
        <Text style={{ color: colors.accent, fontSize: 14, letterSpacing: 2 }}>SOUL</Text>
      </View>
      <HolyDaysScreen profile={profile} colors={colors} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 48 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 8 },
});
