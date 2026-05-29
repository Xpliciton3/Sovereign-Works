import { Layer2BodyScreen } from '@sovereign/shared';
import { useSovereignTheme } from '@/components/SovereignScreen';
import { PROFILE } from '@/constants/profile';

export default function BodyScreen() {
  const colors = useSovereignTheme();
  return <Layer2BodyScreen profile={PROFILE} colors={colors} />;
}
