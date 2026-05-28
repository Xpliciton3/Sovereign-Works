# FIX 09 — GROQ-POWERED SHIFT-AWARE PLANNER SCHEDULING
# The planner must adapt to shift type — not just label the shift,
# but reorder and retime every item based on when the practitioner
# is actually awake, at peak function, and moving through their day.
# Groq generates the adjusted schedule. SQLite holds the result.
# This applies to both Imperium and Tending apps.

---

## THE PROBLEM

A 6pm–6am night shift practitioner does not have a "morning."
Their day begins at approximately 3–4pm.
The current planner ignores this and fires morning declarations at 7am
to a person who worked until 6am and is trying to sleep.

The shift-aware planner solves this once, using Groq, cached in SQLite.

---

## SHIFT TYPES (from 05_SHIFT_SCHEDULE.md)

```typescript
type ShiftType = 'day' | 'night' | 'swing' | 'off' | 'overtime_day' | 'overtime_night';

const SHIFT_WINDOWS = {
  day:   { start: '06:00', end: '18:00', wakeTarget: '04:30', sleepTarget: '22:00' },
  night: { start: '18:00', end: '06:00', wakeTarget: '15:30', sleepTarget: '07:00' },
  swing: { start: '14:00', end: '00:00', wakeTarget: '11:00', sleepTarget: '02:00' },
  off:   { start: null,    end: null,    wakeTarget: '07:00', sleepTarget: '22:30' },
};
```

---

## GROQ INTEGRATION — SHIFT-AWARE PLANNER PROMPT

Called once per day, at app foreground, if planner_schedule table has no entry for today.

```typescript
// packages/shared/src/ai/groqShiftPlanner.ts

interface ShiftPlannerInput {
  tradition: 'imperium' | 'tending';
  shiftType: ShiftType;
  shiftStart: string | null;  // HH:MM
  shiftEnd: string | null;    // HH:MM
  wakeTime: string;           // HH:MM actual or target
  plannerItems: PlannerItemId[];
  mealPlanToday: { b: string; l: string; d: string };
  practiceScheduled: boolean;
  date: string;               // YYYY-MM-DD
}

const SYSTEM_PROMPT = `You are a shift-aware daily planner for a law enforcement officer.
Your job is to return a JSON schedule for today's planner items, optimized for 
cognitive function, physical wellbeing, and the practitioner's shift pattern.

RULES:
- Night shift: all morning items shift to pre-shift window (3–5pm). 
  Sleep window begins 1 hour after shift end. No morning items before sleep.
- Day shift: standard morning anchoring (5–7am pre-shift window).
- Off day: flexible pacing — space items across 10-hour window starting at wake.
- Overtime: extend day by OT hours before beginning wind-down sequence.
- Meals must be timed relative to wake and shift: 
  Meal 1 within 45 min of wake. Meal 2 midpoint of active window. Meal 3 2hr before sleep.
- Practice session placed in the 3-hour window of highest physical readiness 
  (for day shift: mid-morning; for night shift: 2-3 hours pre-shift).
- Hydration reminders: every 2 hours during active window.
- Declaration always first in active window, Inventory always last before sleep.
- Return ONLY valid JSON, no prose, no markdown.`;

async function generateShiftPlan(input: ShiftPlannerInput): Promise<DailySchedule> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getGroqApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 800,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: JSON.stringify(input) },
      ],
    }),
  });
  const data = await response.json();
  const raw = data.choices[0].message.content;
  return JSON.parse(raw) as DailySchedule;
}
```

---

## EXPECTED GROQ RESPONSE STRUCTURE

```json
{
  "date": "2026-05-28",
  "shiftType": "night",
  "activeWindowStart": "15:30",
  "activeWindowEnd": "07:00",
  "sleepWindowStart": "07:30",
  "sleepWindowEnd": "15:00",
  "scheduledItems": [
    { "id": "decl",  "label": "Morning Declaration",   "time": "15:30", "alarm": true  },
    { "id": "hyd",   "label": "Hydration — First 24oz","time": "15:35", "alarm": false },
    { "id": "b",     "label": "Meal 1",                "time": "16:00", "alarm": true  },
    { "id": "quiet", "label": "Morning Quiet",         "time": "16:30", "alarm": false },
    { "id": "mid",   "label": "Practice",              "time": "17:30", "alarm": true  },
    { "id": "l",     "label": "Meal 2",                "time": "20:30", "alarm": true  },
    { "id": "d",     "label": "Meal 3",                "time": "04:30", "alarm": true  },
    { "id": "inv",   "label": "Evening Inventory",     "time": "06:30", "alarm": false },
    { "id": "bed",   "label": "Sleep Window Opens",    "time": "07:30", "alarm": true  }
  ],
  "hydrationReminders": ["15:35", "17:30", "19:30", "21:30", "23:30", "02:00", "04:30"],
  "groqNote": "Night shift schedule. Active window 15:30–07:00. Sleep 07:30–15:00."
}
```

---

## SQLite STORAGE

```typescript
// New table: planner_schedule
CREATE TABLE IF NOT EXISTS planner_schedule (
  date TEXT PRIMARY KEY,
  shift_type TEXT NOT NULL,
  schedule_json TEXT NOT NULL,   -- full DailySchedule JSON
  generated_at INTEGER NOT NULL, -- unix timestamp
  source TEXT DEFAULT 'groq'     -- 'groq' | 'fallback'
);
```

If Groq is unavailable (no API key, offline, rate limit), fallback to static templates per shift type — stored in the app, never call Groq. The fallback must cover all four shift types.

---

## PLANNER UI CHANGES

**Home tab shift strip:** Shows Groq-generated active window times, not just "DAY SHIFT / OFF TODAY."

```
DAY SHIFT  ·  06:00–18:00  ·  Active window: 04:30–22:00
```

```
NIGHT SHIFT  ·  18:00–06:00  ·  Active window: 15:30–07:00  ·  Sleep 07:30
```

**Planner Today sub-tab:** Items displayed with their Groq-generated times. Items past their scheduled time show as "late" indicator (amber dot), not failed.

**Alarm integration (Layer 3):** When alarm is true on a scheduled item, the alarm system schedules that alarm at the Groq-generated time, not a fixed default.

---

## BUILD SEQUENCE

```
G.01  Create packages/shared/src/ai/groqShiftPlanner.ts
G.02  Create planner_schedule SQLite table (migration)
G.03  Wire generateShiftPlan() to app foreground event
G.04  Implement static fallback templates (4 shift types × 2 traditions)
G.05  Update Planner Today sub-tab to read from planner_schedule
G.06  Update home shift strip to show active window from planner_schedule
G.07  Wire alarm creation to items with alarm: true from schedule JSON
G.08  Test: night shift schedule places Declaration at ~15:30
G.09  Test: off-day schedule spaces items across 10-hour window
G.10  Test: offline fallback fires correctly when Groq unavailable
```

---

## VERIFICATION

Shift planner is complete when:
1. Night shift day: Declaration alarm fires at ~15:30, not 07:00
2. Off day: items distributed across 10-hour window from wake time
3. Day shift: standard 04:30–22:00 pattern matches prior behavior
4. Meal times correctly offset from wake, not hardcoded
5. Practice placed in physical readiness window per shift type
6. Offline fallback fires with static template — no blank planner
7. Groq-generated schedule cached in SQLite — not re-called on each open
