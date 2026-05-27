import { router } from 'expo-router';

/** Paths relative to `app/onboarding/` stack */
export const ONBOARDING = {
  welcome: './welcome',
  createHousehold: './create-household',
  joinHousehold: './join-household',
} as const;

/** Root-level paths (from app index / after leaving onboarding) */
export const ROOT = {
  tabs: '/(tabs)',
  tabsPlanner: '/(tabs)/planner',
  onboardingWelcome: '/onboarding/welcome',
} as const;

/** Open main app planner tab — leaves onboarding stack */
export function goToPlannerTab(): void {
  if (router.canDismiss()) {
    router.dismissAll();
  }
  router.replace(ROOT.tabsPlanner);
}
