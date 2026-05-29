import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onValue, ref } from 'firebase/database';
import type { Profile } from '../types';
import { getFirebaseDb, isFirebaseConfigured } from '../firebase/config';
import { writeShared } from '../firebase/sync';
import { getTodayPlanDay } from '../utils/todayPlan';
import type { SleepWindow } from '../utils/sleepWindow';
import type { ShiftType } from './useSchedule';
import type { DailySchedule } from '../ai/groqShiftPlanner';
import { isPlannerTimeLate } from '../utils/plannerTime';
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
  isLate?: boolean;
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
  sleepWindow: SleepWindow | null,
  shiftType: ShiftType = 'day',
  isWorkDay = true,
  schedule?: DailySchedule | null
): PlannerItem[] {
  const day = getTodayPlanDay();
  const imp = profile === 'imperium';
  const timeFromSchedule = (id: string, fallback: string): string => {
    const hit = schedule?.scheduledItems.find((i) => i.id === id);
    return hit?.time ?? fallback;
  };
  const baseTimes = shiftType === 'night'
    ? { decl: '3:30 PM', b: '4:00 PM', hyd: '3:35 PM', l: '8:30 PM', mid: '5:30 PM', d: '4:30 AM', inv: '6:30 AM' }
    : { decl: 'Before all else', b: '8:00 AM', hyd: '9:00 AM', l: '12:30 PM', mid: '2:00 PM', d: '6:00 PM', inv: '9:00 PM' };
  const offTimes = { decl: '7:00 AM', b: '7:30 AM', hyd: '8:00 AM', l: '12:00 PM', mid: '3:00 PM', d: '7:00 PM', inv: '9:30 PM' };
  const raw = isWorkDay ? baseTimes : offTimes;
  const t = {
    decl: timeFromSchedule('decl', raw.decl),
    b: timeFromSchedule('b', raw.b),
    hyd: timeFromSchedule('hyd', raw.hyd),
    l: timeFromSchedule('l', raw.l),
    mid: timeFromSchedule('mid', raw.mid),
    d: timeFromSchedule('d', raw.d),
    inv: timeFromSchedule('inv', raw.inv),
  };
  const items: PlannerItem[] = imp
    ? [
        {
          id: 'decl',
          label: 'Morning Declaration',
          sub: IMPERIUM_DECLARATION_INSTRUCTION,
          time: t.decl,
          color: colors.gold,
          expandText: IMPERIUM_DECLARATION,
        },
        {
          id: 'b',
          label: `Breakfast — ${day.meals.b}`,
          time: t.b,
          color: colors.cNour,
          mealName: day.meals.b,
        },
        {
          id: 'hyd',
          label: 'First 24 oz of water — before coffee',
          time: t.hyd,
          color: colors.cBody,
          expandText:
            'Log water before coffee. Target is your daily hydration goal on the Home tab.',
        },
        {
          id: 'l',
          label: `Lunch — ${day.meals.l}`,
          time: t.l,
          color: colors.cNour,
          mealName: day.meals.l,
        },
        {
          id: 'mid',
          label: 'Midday Anchor — 12 minutes, timer, no screen',
          time: t.mid,
          color: colors.cMind,
          expandText: IMPERIUM_MIDDAY_ANCHOR,
        },
        {
          id: 'd',
          label: `Dinner — ${day.meals.d}`,
          time: t.d,
          color: colors.cNour,
          mealName: day.meals.d,
        },
        {
          id: 'inv',
          label: 'Evening Inventory — three questions in writing',
          time: t.inv,
          color: colors.cMind,
          expandText: IMPERIUM_EVENING_INVENTORY.map((q, i) => `${i + 1}. ${q}`).join('\n'),
        },
      ]
    : [
        {
          id: 'quiet',
          label: 'Morning Quiet — twenty minutes before anything',
          time: t.decl,
          color: colors.cMind,
          expandText: TENDING_MORNING_QUIET,
        },
        {
          id: 'decl',
          label: 'Morning Declaration — speak the Axiom aloud',
          sub: TENDING_DECLARATION_INSTRUCTION,
          time: shiftType === 'night' ? '3:40 PM' : 'When ready',
          color: colors.gold,
          expandText: TENDING_DECLARATION,
        },
        {
          id: 'b',
          label: `Breakfast — ${day.meals.b}`,
          time: t.b,
          color: colors.cNour,
          mealName: day.meals.b,
        },
        {
          id: 'l',
          label: `Lunch — ${day.meals.l}`,
          time: t.l,
          color: colors.cNour,
          mealName: day.meals.l,
        },
        {
          id: 'd',
          label: `Dinner — ${day.meals.d}`,
          time: t.d,
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
          time: t.inv,
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
  return items.map((it) => ({
    ...it,
    isLate: isPlannerTimeLate(it.time),
  }));
}

function plannerItemPath(householdId: string, member: Profile, day: string, itemId: string): string {
  return `households/${householdId}/planner/${member}/${day}/${itemId}`;
}

function countDone(data: Record<string, { done?: boolean }> | null): number {
  if (!data) return 0;
  return Object.values(data).filter((v) => v?.done).length;
}

export function usePlanner(profile: Profile, householdId: string | null = null) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [partnerDoneCount, setPartnerDoneCount] = useState(0);
  const [partnerTotalCount, setPartnerTotalCount] = useState(0);
  const partnerProfile: Profile = profile === 'imperium' ? 'tending' : 'imperium';

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

  useEffect(() => {
    if (!householdId || !isFirebaseConfigured()) return;
    const day = todayKey();
    const db = getFirebaseDb();
    const ownRef = ref(db, `households/${householdId}/planner/${profile}/${day}`);
    const partnerRef = ref(db, `households/${householdId}/planner/${partnerProfile}/${day}`);

    const unsubOwn = onValue(ownRef, (snap) => {
      const data = snap.val() as Record<string, { done?: boolean }> | null;
      if (!data) return;
      setDone((prev) => {
        const merged = { ...prev };
        Object.entries(data).forEach(([id, val]) => {
          if (typeof val?.done === 'boolean') merged[id] = val.done;
        });
        return merged;
      });
    });

    const unsubPartner = onValue(partnerRef, (snap) => {
      const data = snap.val() as Record<string, { done?: boolean }> | null;
      setPartnerDoneCount(countDone(data));
      setPartnerTotalCount(data ? Object.keys(data).length : 0);
    });

    return () => {
      unsubOwn();
      unsubPartner();
    };
  }, [householdId, partnerProfile, profile]);

  const toggleDone = useCallback(
    async (id: string) => {
      setDone((prev) => {
        const nextVal = !prev[id];
        const next = { ...prev, [id]: nextVal };
        void AsyncStorage.setItem(doneKey(profile), JSON.stringify(next));
        if (householdId && isFirebaseConfigured()) {
          void writeShared(plannerItemPath(householdId, profile, todayKey(), id), {
            done: nextVal,
            completedAt: Date.now(),
          });
        }
        return next;
      });
    },
    [householdId, profile]
  );

  return { done, toggleDone, partnerDoneCount, partnerTotalCount };
}
