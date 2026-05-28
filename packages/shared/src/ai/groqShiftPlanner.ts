import type { Profile } from '../types';

export type ShiftType = 'day' | 'night' | 'swing' | 'off' | 'overtime_day' | 'overtime_night';

export interface ShiftPlannerInput {
  tradition: Profile;
  shiftType: ShiftType;
  shiftStart: string | null;
  shiftEnd: string | null;
  wakeTime: string;
  plannerItems: string[];
  mealPlanToday: { b: string; l: string; d: string };
  practiceScheduled: boolean;
  date: string;
}

export interface DailySchedule {
  date: string;
  shiftType: ShiftType;
  activeWindowStart: string;
  activeWindowEnd: string;
  sleepWindowStart: string;
  sleepWindowEnd: string;
  scheduledItems: Array<{ id: string; label: string; time: string; alarm: boolean }>;
  hydrationReminders: string[];
  groqNote: string;
}

const FALLBACKS: Record<ShiftType, DailySchedule> = {
  day: {
    date: '', shiftType: 'day', activeWindowStart: '04:30', activeWindowEnd: '22:00',
    sleepWindowStart: '21:30', sleepWindowEnd: '05:00',
    scheduledItems: [
      { id: 'decl', label: 'Morning Declaration', time: '05:00', alarm: true },
      { id: 'b', label: 'Meal 1', time: '05:30', alarm: true },
      { id: 'mid', label: 'Practice', time: '10:30', alarm: true },
      { id: 'l', label: 'Meal 2', time: '12:30', alarm: true },
      { id: 'd', label: 'Meal 3', time: '19:30', alarm: true },
      { id: 'inv', label: 'Evening Inventory', time: '21:00', alarm: false },
    ],
    hydrationReminders: ['05:30', '07:30', '09:30', '11:30', '13:30', '15:30', '17:30', '19:30'],
    groqNote: 'Fallback day schedule.',
  },
  night: {
    date: '', shiftType: 'night', activeWindowStart: '15:30', activeWindowEnd: '07:00',
    sleepWindowStart: '07:30', sleepWindowEnd: '15:00',
    scheduledItems: [
      { id: 'decl', label: 'Morning Declaration', time: '15:30', alarm: true },
      { id: 'b', label: 'Meal 1', time: '16:00', alarm: true },
      { id: 'mid', label: 'Practice', time: '17:30', alarm: true },
      { id: 'l', label: 'Meal 2', time: '20:30', alarm: true },
      { id: 'd', label: 'Meal 3', time: '04:30', alarm: true },
      { id: 'inv', label: 'Evening Inventory', time: '06:30', alarm: false },
    ],
    hydrationReminders: ['15:35', '17:30', '19:30', '21:30', '23:30', '02:00', '04:30'],
    groqNote: 'Fallback night schedule.',
  },
  swing: {
    date: '', shiftType: 'swing', activeWindowStart: '11:00', activeWindowEnd: '02:00',
    sleepWindowStart: '02:30', sleepWindowEnd: '10:00',
    scheduledItems: [], hydrationReminders: [], groqNote: 'Fallback swing schedule.',
  },
  off: {
    date: '', shiftType: 'off', activeWindowStart: '07:00', activeWindowEnd: '22:30',
    sleepWindowStart: '22:30', sleepWindowEnd: '07:00',
    scheduledItems: [], hydrationReminders: [], groqNote: 'Fallback off-day schedule.',
  },
  overtime_day: {
    date: '', shiftType: 'overtime_day', activeWindowStart: '04:30', activeWindowEnd: '00:00',
    sleepWindowStart: '00:30', sleepWindowEnd: '07:30', scheduledItems: [], hydrationReminders: [], groqNote: 'Fallback OT day schedule.',
  },
  overtime_night: {
    date: '', shiftType: 'overtime_night', activeWindowStart: '15:30', activeWindowEnd: '09:00',
    sleepWindowStart: '09:30', sleepWindowEnd: '16:30', scheduledItems: [], hydrationReminders: [], groqNote: 'Fallback OT night schedule.',
  },
};

export async function generateShiftPlan(input: ShiftPlannerInput): Promise<DailySchedule> {
  const key = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  const fallback = { ...FALLBACKS[input.shiftType], date: input.date };
  if (!key) return fallback;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Return only valid JSON for a shift-aware daily schedule.' },
          { role: 'user', content: JSON.stringify(input) },
        ],
        max_tokens: 800,
      }),
    });
    if (!response.ok) return fallback;
    const json = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = json.choices?.[0]?.message?.content;
    if (!content) return fallback;
    return JSON.parse(content) as DailySchedule;
  } catch {
    return fallback;
  }
}
