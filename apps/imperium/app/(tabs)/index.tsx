import { useRouter } from 'expo-router';
import { Layer2HomeScreen } from '@sovereign/shared';
import { useSovereignTheme } from '@/components/SovereignScreen';
import { PROFILE, TENDING_APK_URL } from '@/constants/profile';

export default function HomeScreen() {
  const colors = useSovereignTheme();
  const router = useRouter();
  return (
    <Layer2HomeScreen
      profile={PROFILE}
      colors={colors}
      partnerApkUrl={TENDING_APK_URL}
      onOpenHolyDays={() => router.push('/soul')}
      onOpenSettings={() => router.push('/more')}
    />
  );
}
