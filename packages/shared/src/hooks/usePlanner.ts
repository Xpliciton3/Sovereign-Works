import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Profile } from '../types';
import { getTodayPlanDay } from '../utils/todayPlan';
import type { SleepWindow } from '../utils/sleepWindow';
import {
  IMPERIUM_DECLARATION,
  IMPERIUM_DECLARATION_INSTRUCTION,
  IMPERIUM_EVENING_INVENTORY,
  IMPERIUM_MIDDAY_ANCHOR,
} from '../data/imperium-content';
import {
  TENDING_DECLARATION,
  TENDING_DECLARATION_INSTRUCTION,
  TENDING_EVENING_INVENTORY,
  TENDING_MORNING_QUIET,
  TENDING_REPLENISHMENT,
} from '../data/tending-content';

export interface PlannerItem {
  id: string;
  label: string;
  sub?: string;
  time: string;
  color: string;
  expandText?: string;
  mealName?: string;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function doneKey(profile: Profile): string {
  return `planner_done_${profile}_${todayKey()}`;
}

export function buildPlannerItems(
  profile: Profile,
  colors: { gold: string; cNour: string; cMind: string; cBody: string; cSoul: string },
  sleepWindow: SleepWindow | null
): PlannerItem[] {
  const day = getTodayPlanDay();
  const imp = profile === 'imperium';
  const items: PlannerItem[] = imp
    ? [
        {
          id: 'decl',
          label: 'Morning Declaration',
          sub: IMPERIUM_DECLARATION_INSTRUCTION,
          time: 'Before all else',
          color: colors.gold,
          expandText: IMPERIUM_DECLARATION,
        },
        {
          id: 'b',
          label: `Breakfast — ${day.meals.b}`,
          time: '8:00 AM',
          color: colors.cNour,
          mealName: day.meals.b,
        },
        {
          id: 'hyd',
          label: 'First 24 oz of water — before coffee',
          time: '9:00 AM',
          color: colors.cBody,
          expandText:
            'Log water before coffee. Target is your daily hydration goal on the Home tab.',
        },
        {
          id: 'l',
          label: `Lunch — ${day.meals.l}`,
          time: '12:30 PM',
          color: colors.cNour,
          mealName: day.meals.l,
        },
        {
          id: 'mid',
          label: 'Midday Anchor — 12 minutes, timer, no screen',
          time: '2:00 PM',
          color: colors.cMind,
          expandText: IMPERIUM_MIDDAY_ANCHOR,
        },
        {
          id: 'd',
          label: `Dinner — ${day.meals.d}`,
          time: '6:00 PM',
          color: colors.cNour,
          mealName: day.meals.d,
        },
        {
          id: 'inv',
          label: 'Evening Inventory — three questions in writing',
          time: '9:00 PM',
          color: colors.cMind,
          expandText: IMPERIUM_EVENING_INVENTORY.map((q, i) => `${i + 1}. ${q}`).join('\n'),
        },
      ]
    : [
        {
          id: 'quiet',
          label: 'Morning Quiet — twenty minutes before anything',
          time: 'Before all else',
          color: colors.cMind,
          expandText: TENDING_MORNING_QUIET,
        },
        {
          id: 'decl',
          label: 'Morning Declaration — speak the Axiom aloud',
          sub: TENDING_DECLARATION_INSTRUCTION,
          time: 'When ready',
          color: colors.gold,
          expandText: TENDING_DECLARATION,
        },
        {
          id: 'b',
          label: `Breakfast — ${day.meals.b}`,
          time: '8:00 AM',
          color: colors.cNour,
          mealName: day.meals.b,
        },
        {
          id: 'l',
          label: `Lunch — ${day.meals.l}`,
          time: '12:30 PM',
          color: colors.cNour,
          mealName: day.meals.l,
        },
        {
          id: 'd',
          label: `Dinner — ${day.meals.d}`,
          time: '6:00 PM',
          color: colors.cNour,
          mealName: day.meals.d,
        },
        {
          id: 'yours',
          label: 'Replenishment Session — two hours, once this week',
          time: 'This week',
          color: colors.cSoul,
          expandText: TENDING_REPLENISHMENT,
        },
        {
          id: 'inv',
          label: 'Evening Inventory — two questions in writing',
          time: 'Before sleep',
          color: colors.cMind,
          expandText: TENDING_EVENING_INVENTORY.map((q, i) => `${i + 1}. ${q}`).join('\n'),
        },
      ];

  if (sleepWindow) {
    items.push({
      id: 'bed',
      label: `Bedtime — wind down ${sleepWindow.windDown}, sleep by ${sleepWindow.sleep}`,
      sub: `Wake: ${sleepWindow.wake} · ${sleepWindow.note}`,
      time: sleepWindow.windDown,
      color: '#4a6a9a',
      expandText: sleepWindow.note,
    });
  }
  return items;
}

export function usePlanner(profile: Profile) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    AsyncStorage.getItem(doneKey(profile)).then((raw) => {
      if (raw) {
        try {
          setDone(JSON.parse(raw) as Record<string, boolean>);
        } catch {
          setDone({});
        }
      }
    });
  }, [profile]);

  const toggleDone = useCallback(
    async (id: string) => {
      setDone((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        AsyncStorage.setItem(doneKey(profile), JSON.stringify(next));
        return next;
      });
    },
    [profile]
  );

  return { done, toggleDone };
}
