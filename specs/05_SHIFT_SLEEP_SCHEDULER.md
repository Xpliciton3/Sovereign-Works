# SHIFT WORK SCHEDULER + SLEEP OPTIMIZER

---

## SUPPORTED SCHEDULE TYPES — BOTH APPS

Both Garrin and Holli can use ANY of these schedule types.
The same settings UI is used in both apps. The profile just sets the default.

```typescript
export type ScheduleType =
  | 'rotating_223'      // 2 on, 2 off, 3 on (Garrin's default)
  | 'rotating_3112'     // 3 on, 1 off, 1 on, 2 off
  | 'rotating_48_96'    // 48hr on, 96hr off (fire service)
  | 'fixed_days'        // Standard Mon-Fri or custom days
  | 'fixed_nights'      // Fixed night shift on specific days
  | 'rotating_days'     // Rotating 12hr days (no overnight)
  | 'rotating_nights'   // Rotating 12hr nights (Holli's common pattern)
  | 'rotating_mixed'    // Mix of day and night 12hr shifts
  | 'variable';         // Manual entry — mark each day individually
```

---

## SETTINGS SCREEN — SHIFT SCHEDULER

```
YOUR WORK SCHEDULE

Schedule Type:
  [Dropdown — all types above]

Shift Length:
  [8 hours]  [10 hours]  [12 hours]  [Custom: ___]

Shift Start Time:
  [Time picker — 24hr display]

Night Shift:
  [Toggle — ON means shift crosses midnight]

Cycle Start Date:
  [Date picker — first day of current cycle]

─── PREVIEW ────────────────────────────────
[3-week calendar preview showing on/off days]
[Color: accent = on-duty, muted = off-duty]

[Save Schedule]
```

---

## SHIFT PATTERN GENERATION

```typescript
function generateShiftDays(config: ShiftConfig, daysAhead: number = 90): ShiftDay[] {
  const days: ShiftDay[] = [];
  const startDate = new Date(config.cycleStartDate);

  if (config.scheduleType === 'rotating_223') {
    // Pattern: 2 on, 2 off, 3 on (7-day cycle)
    const pattern = ['on', 'on', 'off', 'off', 'on', 'on', 'on'];
    for (let i = 0; i < daysAhead; i++) {
      const date = addDays(startDate, i);
      const patternIndex = i % 7;
      days.push({
        date: format(date, 'yyyy-MM-dd'),
        status: pattern[patternIndex] as 'on' | 'off',
        shiftStartHour: config.shiftStartHour,
        shiftEndHour: (config.shiftStartHour + config.shiftLength) % 24,
        isNightShift: config.isNightShift,
      });
    }
  }
  if (config.scheduleType === 'rotating_3112') {
    // 3 on, 1 off, 1 on, 2 off (7-day cycle)
    const pattern = ['on','on','on','off','on','off','off'];
    for (let i = 0; i < daysAhead; i++) {
      const date = addDays(startDate, i);
      days.push({ date:format(date,'yyyy-MM-dd'), status:pattern[i%7] as 'on'|'off',
        shiftStartHour:config.shiftStartHour,
        shiftEndHour:(config.shiftStartHour+config.shiftLength)%24,
        isNightShift:config.isNightShift });
    }
  }

  if (config.scheduleType === 'rotating_48_96') {
    // 2 days on, 4 days off (6-day cycle — fire service)
    const pattern = ['on','on','off','off','off','off'];
    for (let i = 0; i < daysAhead; i++) {
      const date = addDays(startDate, i);
      days.push({ date:format(date,'yyyy-MM-dd'), status:pattern[i%6] as 'on'|'off',
        shiftStartHour:config.shiftStartHour,
        shiftEndHour:(config.shiftStartHour+config.shiftLength)%24,
        isNightShift:config.isNightShift });
    }
  }

  if (config.scheduleType === 'fixed_days' || config.scheduleType === 'fixed_nights') {
    // Work on specific days of week. config.workDays = [1,2,3,4,5] for Mon-Fri
    for (let i = 0; i < daysAhead; i++) {
      const date = addDays(startDate, i);
      const dow = getDay(date); // 0=Sun 1=Mon ... 6=Sat
      days.push({ date:format(date,'yyyy-MM-dd'),
        status: config.workDays.includes(dow) ? 'on' : 'off',
        shiftStartHour:config.shiftStartHour,
        shiftEndHour:(config.shiftStartHour+config.shiftLength)%24,
        isNightShift: config.scheduleType === 'fixed_nights' });
    }
  }

  if (config.scheduleType === 'rotating_days') {
    // Same as rotating_223 but isNightShift always false
    const pattern = ['on','on','off','off','on','on','on'];
    for (let i = 0; i < daysAhead; i++) {
      const date = addDays(startDate, i);
      days.push({ date:format(date,'yyyy-MM-dd'), status:pattern[i%7] as 'on'|'off',
        shiftStartHour:config.shiftStartHour,
        shiftEndHour:(config.shiftStartHour+config.shiftLength)%24,
        isNightShift:false });
    }
  }

  if (config.scheduleType === 'rotating_nights') {
    // Same as rotating_223 but isNightShift always true
    const pattern = ['on','on','off','off','on','on','on'];
    for (let i = 0; i < daysAhead; i++) {
      const date = addDays(startDate, i);
      days.push({ date:format(date,'yyyy-MM-dd'), status:pattern[i%7] as 'on'|'off',
        shiftStartHour:config.shiftStartHour,
        shiftEndHour:(config.shiftStartHour+config.shiftLength)%24,
        isNightShift:true });
    }
  }

  if (config.scheduleType === 'rotating_mixed') {
    // Mixed day/night. config.mixedPattern = ['day','day','off','off','night','night','night']
    // Each entry is 'day', 'night', or 'off'
    const pattern = config.mixedPattern || ['day','day','off','off','night','night','night'];
    for (let i = 0; i < daysAhead; i++) {
      const date = addDays(startDate, i);
      const slot = pattern[i % pattern.length];
      days.push({ date:format(date,'yyyy-MM-dd'),
        status: slot === 'off' ? 'off' : 'on',
        shiftStartHour: slot === 'night' ? config.nightStartHour : config.shiftStartHour,
        shiftEndHour: slot === 'night'
          ? (config.nightStartHour+config.shiftLength)%24
          : (config.shiftStartHour+config.shiftLength)%24,
        isNightShift: slot === 'night' });
    }
  }

  if (config.scheduleType === 'variable') {
    // All days default to 'off'. User marks each on-duty day manually via override.
    for (let i = 0; i < daysAhead; i++) {
      const date = addDays(startDate, i);
      days.push({ date:format(date,'yyyy-MM-dd'), status:'off',
        shiftStartHour:config.shiftStartHour,
        shiftEndHour:(config.shiftStartHour+config.shiftLength)%24,
        isNightShift:config.isNightShift });
    }
  }

  // Apply overrides
  for (const override of config.overrides) {
    const day = days.find(d => d.date === override.date);
    if (day) {
      day.status = override.status;
      if (override.startHour !== undefined) day.shiftStartHour = override.startHour;
    }
  }

  return days;
}
```

---

## MANUAL OVERRIDE

Tap any day on the calendar → bottom sheet appears:

```
TUESDAY, JANUARY 14

Status: On Duty (from pattern)

─────────────────────────────────
[Change just this day]
[Change from here forward]
[Mark as off — override]
[Mark as on — override]
[Flip to night / flip to day]
─────────────────────────────────
[Cancel]
```

"Change from here forward" recalculates from new anchor date.
"Change just this day" stores an exception.

---

## SLEEP OPTIMIZER

Built from shift data. Calculates optimal sleep window automatically. Displays on planner. Generates sleep/wake alarms if enabled.

### Core Logic

```typescript
function calculateSleepWindow(
  shiftDay: ShiftDay,
  nextShiftDay: ShiftDay,
  prefs: SleepPrefs
): SleepWindow {

  const { shiftStartHour, shiftEndHour, isNightShift, status } = shiftDay;

  if (status === 'off') {
    // Off day: standard circadian recommendation
    return {
      sleepTime: '22:00',
      wakeTime: '06:00',
      targetHours: 8,
      type: 'recovery',
      note: 'Recovery day. Prioritize full sleep.',
    };
  }

  if (!isNightShift) {
    // Day shift: sleep before
    const wakeTime = shiftStartHour - 1.5;  // 90 min before shift
    const sleepTime = wakeTime - 7.5;        // 7.5hr sleep target
    return {
      sleepTime: formatHour(sleepTime),
      wakeTime: formatHour(wakeTime),
      targetHours: 7.5,
      type: 'pre_shift',
      note: `Wake by ${formatHour(wakeTime)} for ${formatHour(shiftStartHour)} shift start.`,
    };
  }

  if (isNightShift) {
    // Night shift: sleep after shift ends (day sleep)
    const shiftEnd = shiftEndHour;  // e.g. 6AM
    const sleepTime = shiftEnd + 1; // 1 hour after shift to wind down
    const wakeTime = sleepTime + 7; // 7hr day sleep
    return {
      sleepTime: formatHour(sleepTime),
      wakeTime: formatHour(wakeTime),
      targetHours: 7,
      type: 'post_night_shift',
      note: `Night shift sleep window. Darken the room. Do not skip this.`,
    };
  }
}
```

### Transition Day Handling (Night to Day or Day to Night)

When shift type changes between days:
```
⚠️  SCHEDULE TRANSITION
Tomorrow you switch from night shift to day shift.
Your sleep window needs to shift earlier.

Tonight: Sleep by 8:00 PM (unusual — this is the anchor)
Tomorrow wake: 5:30 AM

This protects your next shift. The earlier sleep is correct.
```

### Sleep Window Display on Planner

```
┌─────────────────────────────────────┐
│  SLEEP WINDOW                       │
│                                     │
│  Tonight:   Wind down by 9:00 PM   │
│  Sleep:     10:30 PM               │
│  Wake:      6:00 AM  (7.5 hrs)     │
│                                     │
│  Tomorrow: OFF — recovery day       │
└─────────────────────────────────────┘
```

### Sleep-Related Alarms (optional, enabled in Settings)

```typescript
const SLEEP_ALARMS = [
  { offsetMinutes: -60, label: 'Wind down begins. No screens after this.' },
  { offsetMinutes: -30, label: 'Last check of the night.' },
  { offsetMinutes: 0,   label: 'Sleep window open now.' },
  // Wake alarm generated from wakeTime
];
```

---

## PARTNER SHIFT STATUS DISPLAY

On the planner header (both apps):

```
┌───────────────────────────────────────────┐
│  WEDNESDAY, JAN 14                        │
│  G: OFF DUTY    H: NIGHT — 7P–7A         │
└───────────────────────────────────────────┘
```

"G:" = Garrin's status. "H:" = Holli's status.
This line is small, muted color, one line only.
Tap it → goes to shift calendar view.
---

## OVERTIME / CLOCK-OFF TRACKER

Law enforcement and nursing shifts frequently run long. This feature adjusts
the evening alarms and sleep window for a single night without rebuilding the schedule.

### "I'm Working Late" — One-Tap Overtime

Available from two places:
1. The planner shift status strip — tap it → overtime options appear
2. Settings → Work Schedule → Log Overtime

```
WORKING LATE?

How long past your end time?

  [+ 1 Hour]   [+ 2 Hours]   [+ 4 Hours]   [Custom]

This will:
  → Push your wind-down alarm by [X] hours (tonight only)
  → Adjust tonight's sleep window
  → Leave tomorrow's schedule unchanged

[Cancel]          [Confirm — I'm Working Late]
```

**What it does:**
- Reads the current shift's scheduled end time
- Adds the selected hours to that end time for tonight only
- Pushes all evening alarms forward by the same amount
- Recalculates the sleep window for tonight based on the new end time
- Stores the override as a single-day exception in SQLite (not Firebase)
- Tomorrow's schedule is completely unaffected

```typescript
interface OvertimeRecord {
  date: string;               // 'YYYY-MM-DD' — today only
  originalEndHour: number;    // the scheduled shift end
  actualEndHour: number;      // originalEnd + hoursAdded
  hoursAdded: number;         // 1 | 2 | 4 | custom
  alarmsAdjusted: string[];   // IDs of alarms that were pushed
  appliedAt: number;          // timestamp
}

function applyOvertime(hoursAdded: number, currentConfig: ShiftConfig): void {
  const tonight = format(new Date(), 'yyyy-MM-dd');
  const originalEnd = currentConfig.shiftStartHour + currentConfig.shiftLength;
  const newEnd = originalEnd + hoursAdded;

  // Push all evening alarms for tonight
  const eveningAlarmIds = getAlarmsAfterHour(originalEnd - 1);
  eveningAlarmIds.forEach(id => pushAlarmByHours(id, hoursAdded, tonight));

  // Recalculate sleep window for tonight
  const newSleepWindow = calculateSleepWindow(
    { ...todayShift, shiftEndHour: newEnd % 24 },
    tomorrowShift,
    sleepPrefs
  );
  updateTonightSleepWindow(newSleepWindow);

  // Store the override
  saveOvertimeRecord({ date: tonight, originalEndHour: originalEnd % 24,
    actualEndHour: newEnd % 24, hoursAdded, alarmsAdjusted: eveningAlarmIds,
    appliedAt: Date.now() });
}
```

### Clock-Off Confirmation

When the user's normal shift end time arrives while overtime is active,
a single non-intrusive notification fires:

```
Still on shift?
Your shift ended 2 hours ago.
Overtime is active until [new end time].
[Still Working]    [I'm Off Now]
```

"I'm Off Now" cancels the overtime immediately and resets alarms
to their normal scheduled times for the remaining evening.

### Overtime Log

Settings → Work Schedule → Overtime Log shows a simple history:

```
OVERTIME LOG

This Week:
Jan 14  +2 hrs (off at 8:00 AM)
Jan 12  +4 hrs (off at 10:00 AM)

This Month:
11 overtime shifts · 28 total hours over

[Export as CSV]  ← for union records, HR, etc.
```

