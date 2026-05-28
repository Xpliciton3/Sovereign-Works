import { Layer2PlannerScreen } from '@sovereign/shared';
import { useSovereignTheme } from '@/components/SovereignScreen';
import { PROFILE } from '@/constants/profile';

export default function PlannerScreen() {
  const colors = useSovereignTheme();

  return <Layer2PlannerScreen profile={PROFILE} colors={colors} />;
}
