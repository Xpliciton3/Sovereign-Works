import { createContext, useContext, type ReactNode } from 'react';
import { useHousehold, type HouseholdContextValue } from '../hooks/useHousehold';
import type { Profile } from '../types';

const HouseholdContext = createContext<HouseholdContextValue | null>(null);

type Props = {
  profile: Profile;
  children: ReactNode;
};

export function HouseholdProvider({ profile, children }: Props) {
  const value = useHousehold(profile);
  return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>;
}

export function useHouseholdContext(): HouseholdContextValue {
  const ctx = useContext(HouseholdContext);
  if (!ctx) {
    throw new Error('useHouseholdContext must be used within HouseholdProvider');
  }
  return ctx;
}
