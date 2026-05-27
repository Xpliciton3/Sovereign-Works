import { Tabs } from 'expo-router';
import { TAB_CONFIG, getThemeColors } from '@sovereign/shared';
import { useColorScheme } from '@/components/useColorScheme';
import { PROFILE } from '@/constants/profile';

export default function TabLayout() {
  const scheme = useColorScheme() ?? 'dark';
  const colors = getThemeColors(PROFILE, scheme);
  const tabs = TAB_CONFIG.imperium;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: true,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textDisabled,
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen key={tab.key} name={tab.key} options={{ title: tab.label }} />
      ))}
      <Tabs.Screen name="warrior" options={{ href: null }} />
      <Tabs.Screen name="doctrine" options={{ href: null }} />
    </Tabs>
  );
}
