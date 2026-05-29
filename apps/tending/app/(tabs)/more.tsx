import { Layer2MoreScreen } from '@sovereign/shared';
import { useSovereignTheme } from '@/components/SovereignScreen';
import { PROFILE, IMPERIUM_APK_URL } from '@/constants/profile';

export default function MoreScreen() {
  const colors = useSovereignTheme();
  return <Layer2MoreScreen profile={PROFILE} colors={colors} partnerApkUrl={IMPERIUM_APK_URL} />;
}
