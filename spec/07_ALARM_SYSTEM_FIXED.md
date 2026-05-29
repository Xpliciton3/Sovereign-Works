# 07 — ALARM SYSTEM SPEC (FIXED)
# Resolves: C-06 (sleep/wind-down alarms must not fire mid-shift)

## ALARM LABELS (Cursor imports verbatim — do not rewrite)

```typescript
export const ALARM_LABELS = {
  imperium: {
    wake:      'Rise. The work does not wait.',
    winddown:  'Wind down. The Uncrowned rests with intention.',
    sleep:     'Sleep now. The architecture holds.',
    hydration: 'Drink. The body is the instrument.',
    batchcook: (dinnerName: string) => `Tomorrow is a prep day. Start ${dinnerName} tonight if marinating.`,
  },
  tending: {
    wake:      'Rise. The Keeper tends from fullness, not exhaustion.',
    winddown:  'Wind down. The reservoir refills in sleep.',
    sleep:     'Sleep now. You have held enough for today.',
    hydration: 'Drink. The warmth requires fuel.',
    batchcook: (dinnerName: string) => `Tomorrow is a prep day. Start ${dinnerName} tonight if marinating.`,
  },
};
```

## ARE YOU AWAKE SCREEN COPY

```typescript
export const AWAKE_SCREEN = {
  imperium: {
    question: 'Are you actually awake?',
    confirm:  "Yes — I'm up",
    snooze:   'No — 9 more minutes',
    countdown: (sec: number) => `Auto-snooze in ${sec}`,
  },
  tending: {
    question: 'Are you actually awake?',
    confirm:  "Yes — I'm up",
    snooze:   'No — 9 more minutes',
    countdown: (sec: number) => `Auto-snooze in ${sec}`,
  },
};
```

## ALARM TYPES AND TIMING

| Type | Trigger | Repeating | Days |
|------|---------|-----------|------|
| wake | sleepWindow.wake (Groq output when available; static fallback) | Yes | Work days only |
| winddown | sleepWindow.sleep - 60min | Yes | See SHIFT SUPPRESSION RULE below |
| sleep | sleepWindow.sleep | Yes | See SHIFT SUPPRESSION RULE below |
| hydration | Every 60/90/120 min, 7AM–9PM | Yes | Every day |
| batchcook | 7:00 PM night before batch day | No (per batch) | Specific dates |
| overtime | wake + OT hours | No (single day) | Next work day |
| custom | User-set | User-set | User-set |

---

## SHIFT SUPPRESSION RULE (C-06 FIX)
# This is a NEW rule. It does not exist in the original 07_ALARM_SYSTEM.md.
# It fixes sleep alarms firing during active work shift.

Wind-down and sleep alarms MUST NOT fire if the current time falls within
the practitioner's active shift window.

```typescript
function isAlarmSuppressed(
  alarmType: 'winddown' | 'sleep',
  alarmFireTime: Date,
  schedule: ShiftSchedule
): boolean {
  if (!schedule.isWorkDay) return false;  // off day — no suppression

  const shiftStart = parseTimeToDate(schedule.shiftStart, alarmFireTime); // e.g. 06:00
  const shiftEnd   = parseTimeToDate(schedule.shiftEnd,   alarmFireTime); // e.g. 18:00

  // Handle night shift: shiftEnd is next calendar day
  // Night shift: shiftStart = 18:00, shiftEnd = 06:00 (next day)
  if (shiftEnd <= shiftStart) {
    // Overnight shift — suppress if after shiftStart OR before shiftEnd
    return alarmFireTime >= shiftStart || alarmFireTime <= shiftEnd;
  }

  // Day shift — suppress if between shiftStart and shiftEnd
  return alarmFireTime >= shiftStart && alarmFireTime <= shiftEnd;
}
```

**Practical effect:**
- Night shift (18:00–06:00): wind-down would normally fire ~17:00. Suppressed.
  Sleep alarm would fire ~18:00. Suppressed. Both fire the NEXT morning after shift ends.
- Day shift (06:00–18:00): wind-down fires ~21:00. Not suppressed (after shift end). ✓
- Off day: no suppression. Wind-down and sleep fire normally. ✓

**Implementation:**
When scheduling wind-down and sleep alarms, run `isAlarmSuppressed()`.
If suppressed, reschedule to the Groq-generated `sleepWindowStart` for that day
(from `planner_schedule` table). If Groq unavailable, use static fallback from `useSchedule()`.

---

## SLEEP WINDOW SOURCE — PRIORITY ORDER (C-18 resolution)

1. **Groq output** (preferred): read `sleepWindowStart` and `sleepWindowEnd` from
   `planner_schedule` table for today's date. This is the most accurate.
2. **Static fallback** (when Groq unavailable): use `useSchedule().sleepWindow.sleep`
   calculated by `calcSleepWindow()` in FIX_03.

Always prefer Groq output when available. Static fallback is never removed — it ensures
alarms work even when the device is offline or the API is rate-limited.

---

## HYDRATION REMINDER STOPS

Stop firing hydration alarms when:
- totalOz >= goalOz for the day (read from SQLite hydration_log)
- Time is 9:00 PM or later
- App is backgrounded AND phone is in Do Not Disturb

Resume next calendar day at 7:00 AM.

## BATCH COOK REMINDER

```typescript
// Fires at 7:00 PM the evening BEFORE any day with batch:true in WEEK_PLAN
// Message contains tonight's dinner name from the NEXT day's dinner slot
// User-toggleable in Planner → Alarms → Batch Cook Reminder
// Default: ON

async function scheduleBatchCookReminders(weekPlan: WeekPlan[], tradition: Tradition) {
  const batchDays = weekPlan.flatMap(w => w.days.filter(d => d.batch));
  for (const day of batchDays) {
    const reminderDate = /* day before batch day at 7 PM */;
    const dinnerName = day.meals.d;
    const label = ALARM_LABELS[tradition].batchcook(dinnerName);
    await scheduleAlarm({ label, alarmType: 'batchcook', /* date/time */ });
  }
}
```
