# 07 — ALARM SYSTEM SPEC

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
| wake | sleepWindow.wake | Yes | Work days only |
| winddown | sleepWindow.sleep - 60min | Yes | Every day |
| sleep | sleepWindow.sleep | Yes | Every day |
| hydration | Every 60/90/120 min, 7AM–9PM | Yes | Every day |
| batchcook | 7:00 PM night before batch day | No (per batch) | Specific dates |
| overtime | wake + OT hours | No (single day) | Next work day |
| custom | User-set | User-set | User-set |

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
// User-toggleable in Settings → Notifications → Batch Cook Reminder
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

## SNOOZE CONFIGURATION

Default: 9 minutes
User-configurable in alarm settings: 5 / 9 / 15 minutes
Stored per alarm config (snoozeMinutes field)
Max snooze count before forced wake: not capped by default (user preference)

## OVERTIME ALARM ADJUSTMENT

When OT is active for tomorrow:
- Tomorrow's wake alarm moves by +overtimeH hours
- Wind-down and sleep alarms also move by +overtimeH
- Original alarms restored the day after
- OT exception stored as single-day override in SQLite (not modifying schedule)
- Cancel OT → alarm reverts immediately

## ALARM SCREEN DESIGN

Reference sovereign_v9.jsx AlarmActivity visual.

- Full screen, dark background (tradition color)
- Sigil centered, 80px
- Alarm label in Cormorant Garamond, 22px, centered
- Current time in large display font, 48px
- Two buttons: SNOOZE (gold border only) | AWAKE (gold filled)
- After AWAKE tap → Are You Awake screen
- Are You Awake screen: 30-second countdown timer visible
- Auto-snooze fires at countdown zero
- Snooze count displayed in small text below buttons after first snooze

## PERMISSIONS

Request in this order on first launch after Layer 3 install:

1. SCHEDULE_EXACT_ALARM — open system settings if not granted
   Display text: "Exact alarms are required for the wake alarm to fire at the correct time. Android restricts this permission — you must grant it manually."

2. SYSTEM_ALERT_WINDOW — open system settings if not granted
   Display text: "Draw over other apps is required for the alarm to appear over the lock screen."

3. POST_NOTIFICATIONS — runtime dialog

After all three: show "Alarm system is active." confirmation.
Block alarm scheduling until all three are granted.
