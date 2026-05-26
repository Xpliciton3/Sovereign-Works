import { Layer2NourishScreen } from '@sovereign/shared';
import { useSovereignTheme } from '@/components/SovereignScreen';
import { PROFILE } from '@/constants/profile';

export default function NourishScreen() {
  const colors = useSovereignTheme();
  return <Layer2NourishScreen profile={PROFILE} colors={colors} />;
}
