import { Layer2MoreScreen } from '@sovereign/shared';
import { useSovereignTheme } from '@/components/SovereignScreen';
import { PROFILE } from '@/constants/profile';

export default function MoreScreen() {
  const colors = useSovereignTheme();
  return <Layer2MoreScreen profile={PROFILE} colors={colors} />;
}
