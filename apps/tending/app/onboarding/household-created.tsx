import { useEffect, useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import {
  householdShareMessage,
  watchHousehold,
  type HouseholdConfig,
} from '@sovereign/shared';
import { SovereignScreen, useSovereignTheme } from '@/components/SovereignScreen';
import { PrimaryButton } from '@/components/LockScreen';
import { IMPERIUM_APK_URL } from '@/constants/profile';
import { setOnboardingComplete } from '@/lib/storage';

export default function HouseholdCreatedScreen() {
  const colors = useSovereignTheme();
  const params = useLocalSearchParams<{
    householdName: string;
    joinCode: string;
    householdId: string;
  }>();
  const [partnerJoined, setPartnerJoined] = useState(false);

  useEffect(() => {
    if (!params.householdId) return;

    const unsubscribe = watchHousehold(params.householdId, (household: HouseholdConfig | null) => {
      if (household?.members?.imperium) {
        setPartnerJoined(true);
      }
    });

    return unsubscribe;
  }, [params.householdId]);

  async function copyCode() {
    if (params.joinCode) {
      await Clipboard.setStringAsync(params.joinCode);
    }
  }

  async function shareCode() {
    if (!params.joinCode) return;
    await Share.share({
      message: householdShareMessage(params.joinCode, IMPERIUM_APK_URL),
    });
  }

  async function continueSolo() {
    await setOnboardingComplete();
    router.replace('/(tabs)/planner');
  }

  const householdTitle = params.householdName?.toUpperCase() ?? 'HOUSEHOLD';

  return (
    <SovereignScreen style={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]}>THE {householdTitle} HOUSEHOLD</Text>
      <Text style={[styles.body, { color: colors.textMuted }]}>Your household is ready.</Text>
      <Text style={[styles.body, { color: colors.textMuted }]}>
        Share this code with Garrin so he can join:
      </Text>
      <Text style={[styles.code, { color: colors.accent }]}>{params.joinCode}</Text>
      <View style={styles.row}>
        <PrimaryButton label="Copy Code" onPress={copyCode} />
      </View>
      <View style={styles.row}>
        <PrimaryButton label="Share via Text" onPress={shareCode} />
      </View>
      <View style={[styles.divider, { borderColor: colors.border }]} />
      <Text style={[styles.waiting, { color: colors.textMuted }]}>
        {partnerJoined ? 'Garrin has joined.' : 'Waiting for Garrin to join...'}
      </Text>
      <PrimaryButton label="Skip for now — continue solo" onPress={continueSolo} />
    </SovereignScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center',
    gap: 12,
  },
  heading: {
    fontSize: 18,
    letterSpacing: 3,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  code: {
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 6,
    marginVertical: 16,
  },
  row: {
    width: '100%',
  },
  divider: {
    borderTopWidth: 1,
    marginVertical: 16,
  },
  waiting: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
});
