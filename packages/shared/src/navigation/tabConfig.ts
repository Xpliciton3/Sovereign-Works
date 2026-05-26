import type { TabConfigItem } from '../types';

/** Layer 2 Daily Hub — Home, Planner, Nourish, More (stub). Phase 2+ tabs stay in repo but hidden here. */
export const TAB_CONFIG: Record<'imperium' | 'tending', TabConfigItem[]> = {
  imperium: [
    { key: 'index', label: 'Home', icon: 'home', locked: false },
    { key: 'planner', label: 'Planner', icon: 'calendar', locked: false },
    { key: 'nourish', label: 'Nourish', icon: 'leaf', locked: false },
    { key: 'more', label: 'More', icon: 'menu', locked: false },
  ],
  tending: [
    { key: 'index', label: 'Home', icon: 'home', locked: false },
    { key: 'planner', label: 'Planner', icon: 'calendar', locked: false },
    { key: 'nourish', label: 'Nourish', icon: 'leaf', locked: false },
    { key: 'more', label: 'More', icon: 'menu', locked: false },
  ],
};

/** Phase 2+ tabs — unlock by swapping TAB_CONFIG or merging when instructed. */
export const TAB_CONFIG_FULL: Record<'imperium' | 'tending', TabConfigItem[]> = {
  imperium: [
    { key: 'index', label: 'Home', icon: 'home', locked: false },
    { key: 'planner', label: 'Planner', icon: 'calendar', locked: false },
    { key: 'nourish', label: 'Nourish', icon: 'leaf', locked: false },
    {
      key: 'warrior',
      label: 'Warrior',
      icon: 'sword',
      locked: true,
      unlocksIn: 'phase2',
      lockMessage: 'The Forge opens at Day 7.',
    },
    {
      key: 'doctrine',
      label: 'Doctrine',
      icon: 'book',
      locked: true,
      unlocksIn: 'phase3',
      lockMessage: 'Doctrine opens at Day 14.',
    },
    { key: 'more', label: 'More', icon: 'menu', locked: false },
  ],
  tending: [
    { key: 'index', label: 'Home', icon: 'home', locked: false },
    { key: 'planner', label: 'Planner', icon: 'calendar', locked: false },
    { key: 'nourish', label: 'Nourish', icon: 'leaf', locked: false },
    {
      key: 'keep',
      label: 'Keep Yourself',
      icon: 'heart',
      locked: true,
      unlocksIn: 'phase2',
      lockMessage: 'This opens when your foundation is set.',
    },
    {
      key: 'doctrine',
      label: 'Doctrine',
      icon: 'book',
      locked: true,
      unlocksIn: 'phase3',
      lockMessage: 'Doctrine opens when practice is stable.',
    },
    { key: 'more', label: 'More', icon: 'menu', locked: false },
  ],
};
