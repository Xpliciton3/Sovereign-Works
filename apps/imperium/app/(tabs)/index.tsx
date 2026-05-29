import { Layer2HomeScreen } from '@sovereign/shared';
import { useSovereignTheme } from '@/components/SovereignScreen';
import { PROFILE, TENDING_APK_URL } from '@/constants/profile';

export default function HomeScreen() {
  const colors = useSovereignTheme();
  return <Layer2HomeScreen profile={PROFILE} colors={colors} partnerApkUrl={TENDING_APK_URL} />;
}
