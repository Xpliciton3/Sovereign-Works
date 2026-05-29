import { Layer2MindScreen } from '@sovereign/shared';
import { useSovereignTheme } from '@/components/SovereignScreen';
import { PROFILE } from '@/constants/profile';

export default function MindScreen() {
  const colors = useSovereignTheme();
  return <Layer2MindScreen profile={PROFILE} colors={colors} />;
}
