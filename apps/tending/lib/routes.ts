import { router } from 'expo-router';

export const ONBOARDING = {
  welcome: './welcome',
  createHousehold: './create-household',
  joinHousehold: './join-household',
} as const;

export const ROOT = {
  tabs: '/(tabs)',
  tabsPlanner: '/(tabs)/planner',
  onboardingWelcome: '/onboarding/welcome',
} as const;

export function goToPlannerTab(): void {
  if (router.canDismiss()) {
    router.dismissAll();
  }
  router.replace(ROOT.tabsPlanner);
}
