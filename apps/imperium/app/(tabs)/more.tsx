import { Layer2MoreScreen } from '@sovereign/shared';
import { useSovereignTheme } from '@/components/SovereignScreen';

export default function MoreScreen() {
  const colors = useSovereignTheme();
  return <Layer2MoreScreen colors={colors} />;
}
