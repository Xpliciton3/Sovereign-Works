import { useEffect, useState } from 'react';
import { Layer2HomeScreen } from '@sovereign/shared';
import { useSovereignTheme } from '@/components/SovereignScreen';
import { getStoredHouseholdId } from '@/lib/storage';
import { PROFILE } from '@/constants/profile';

export default function HomeScreen() {
  const colors = useSovereignTheme();
  const [householdId, setHouseholdId] = useState<string | null>(null);

  useEffect(() => {
    getStoredHouseholdId().then(setHouseholdId);
  }, []);

  return <Layer2HomeScreen profile={PROFILE} colors={colors} householdId={householdId} />;
}
