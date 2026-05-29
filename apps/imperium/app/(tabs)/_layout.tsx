import { Tabs } from 'expo-router';
import { TAB_CONFIG, getThemeColors, SvgIcon, type IconName } from '@sovereign/shared';
import { useColorScheme } from '@/components/useColorScheme';
import { PROFILE } from '@/constants/profile';

const ICON_MAP: Record<string, IconName> = {
  home: 'home',
  plan: 'plan',
  brain: 'brain',
  drop: 'drop',
  star: 'star',
  leaf: 'leaf',
  more: 'more',
};

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
        <Tabs.Screen
          key={tab.key}
          name={tab.key}
          options={{
            title: tab.label,
            tabBarIcon: ({ color, focused }) => (
              <SvgIcon
                name={ICON_MAP[tab.icon] ?? 'home'}
                size={20}
                color={color}
                strokeWidth={focused ? 2 : 1.5}
              />
            ),
          }}
        />
      ))}
      <Tabs.Screen name="nourish" options={{ href: null }} />
      <Tabs.Screen name="more" options={{ href: null }} />
      <Tabs.Screen name="warrior" options={{ href: null }} />
      <Tabs.Screen name="doctrine" options={{ href: null }} />
    </Tabs>
  );
}
