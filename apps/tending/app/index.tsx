import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { getStoredHouseholdId, isOnboardingComplete } from '@/lib/storage';

export default function Index() {
  const [target, setTarget] = useState<'loading' | 'onboarding' | 'tabs'>('loading');

  useEffect(() => {
    async function resolveRoute() {
      const householdId = await getStoredHouseholdId();
      const complete = await isOnboardingComplete();
      if (householdId && complete) {
        setTarget('tabs');
      } else {
        setTarget('onboarding');
      }
    }
    resolveRoute();
  }, []);

  if (target === 'loading') {
    return null;
  }

  if (target === 'tabs') {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onboarding/welcome" />;
}
