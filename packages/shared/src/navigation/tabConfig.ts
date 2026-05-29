import type { TabConfigItem } from '../types';

/** v8.2 — Home | Planner | Mind | Body | Soul (PATCH_FIX04). */
export const TAB_CONFIG: Record<'imperium' | 'tending', TabConfigItem[]> = {
  imperium: [
    { key: 'index', label: 'Home', icon: 'home', locked: false },
    { key: 'planner', label: 'Planner', icon: 'plan', locked: false },
    { key: 'mind', label: 'Mind', icon: 'brain', locked: false },
    { key: 'body', label: 'Body', icon: 'drop', locked: false },
    { key: 'soul', label: 'Soul', icon: 'star', locked: false },
  ],
  tending: [
    { key: 'index', label: 'Home', icon: 'home', locked: false },
    { key: 'planner', label: 'Planner', icon: 'plan', locked: false },
    { key: 'mind', label: 'Mind', icon: 'brain', locked: false },
    { key: 'body', label: 'Body', icon: 'drop', locked: false },
    { key: 'soul', label: 'Soul', icon: 'star', locked: false },
  ],
};

/** Phase 2+ tabs — unlock by swapping TAB_CONFIG or merging when instructed. */
export const TAB_CONFIG_FULL: Record<'imperium' | 'tending', TabConfigItem[]> = {
  imperium: [
    { key: 'index', label: 'Home', icon: 'home', locked: false },
    { key: 'planner', label: 'Planner', icon: 'calendar', locked: false },
    { key: 'nourish', label: 'Nourish', icon: 'leaf', locked: false },
    { key: 'warrior', label: 'Warrior', icon: 'sword', locked: false },
    { key: 'doctrine', label: 'Doctrine', icon: 'book', locked: false },
    { key: 'more', label: 'More', icon: 'menu', locked: false },
  ],
  tending: [
    { key: 'index', label: 'Home', icon: 'home', locked: false },
    { key: 'planner', label: 'Planner', icon: 'calendar', locked: false },
    { key: 'nourish', label: 'Nourish', icon: 'leaf', locked: false },
    { key: 'keep', label: 'Keep Yourself', icon: 'heart', locked: false },
    { key: 'doctrine', label: 'Doctrine', icon: 'book', locked: false },
    { key: 'more', label: 'More', icon: 'menu', locked: false },
  ],
};
