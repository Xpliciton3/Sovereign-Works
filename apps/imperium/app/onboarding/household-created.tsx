import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { HouseholdCreatedPanel } from '@sovereign/shared';
import { SovereignScreen, useSovereignTheme } from '@/components/SovereignScreen';
import { PrimaryButton } from '@/components/LockScreen';
import { PROFILE, profileConfig, TENDING_APK_URL } from '@/constants/profile';
import { goToPlannerTab, ONBOARDING } from '@/lib/routes';
import {
  getHouseholdCreatedPending,
  setOnboardingComplete,
  type HouseholdCreatedPending,
} from '@/lib/storage';

/** Fallback route if deep-linked; create flow uses inline success on create-household */
export default function HouseholdCreatedScreen() {
  const colors = useSovereignTheme();
  const [payload, setPayload] = useState<HouseholdCreatedPending | null>(null);

  useEffect(() => {
    getHouseholdCreatedPending().then((data) => {
      if (data) setPayload(data);
      else router.replace(ONBOARDING.createHousehold);
    });
  }, []);

  async function continueSolo() {
    await setOnboardingComplete();
    goToPlannerTab();
  }

  if (!payload) {
    return null;
  }

  return (
    <SovereignScreen style={{ padding: 24, justifyContent: 'center' }}>
      <HouseholdCreatedPanel
        colors={colors}
        payload={payload}
        partnerProfile="tending"
        partnerDisplayName={profileConfig.partnerName}
        partnerApkUrl={TENDING_APK_URL}
        onContinueSolo={continueSolo}
        renderButton={({ label, onPress }) => <PrimaryButton label={label} onPress={onPress} />}
        renderScreen={(children) => <View style={{ gap: 12 }}>{children}</View>}
      />
    </SovereignScreen>
  );
}
