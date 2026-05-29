import { Layer2SoulScreen } from '@sovereign/shared';
import { useSovereignTheme } from '@/components/SovereignScreen';
import { PROFILE } from '@/constants/profile';

export default function SoulScreen() {
  const colors = useSovereignTheme();
  return <Layer2SoulScreen profile={PROFILE} colors={colors} />;
}
