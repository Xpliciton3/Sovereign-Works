import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  HouseholdProvider,
  Layer3Boot,
  Layer4Boot,
  useAppVersionTourReset,
  useSovereignFonts,
  getThemeColors,
} from '@sovereign/shared';
import { PROFILE } from '@/constants/profile';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useAppVersionTourReset();
  const colors = getThemeColors(PROFILE, 'dark');
  const [loaded, error] = useSovereignFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const hide = () => SplashScreen.hideAsync().catch(() => {});
    if (loaded || error) {
      hide();
      return;
    }
    const timeout = setTimeout(hide, 2500);
    return () => clearTimeout(timeout);
  }, [loaded, error]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Layer3Boot colors={colors}>
          <Layer4Boot>
            <HouseholdProvider profile={PROFILE}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(tabs)" />
              </Stack>
            </HouseholdProvider>
          </Layer4Boot>
        </Layer3Boot>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
