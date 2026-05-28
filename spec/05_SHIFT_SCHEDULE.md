# 05 — SHIFT SCHEDULE

## GARRIN'S PATTERN: 2-2-3 ROTATING

The 2-2-3 pattern cycles across 4 weeks:
- Week A: work Mon/Tue, off Wed/Thu, work Fri/Sat/Sun
- Week B: off Mon/Tue, work Wed/Thu, off Fri/Sat/Sun
- Week C: work Mon/Tue, off Wed/Thu, work Fri/Sat/Sun
- Week D: off Mon/Tue, work Wed/Thu, off Fri/Sat/Sun

Two shift types alternate (set by user in Settings):
- Day shift: 6:00 AM – 6:00 PM
- Night shift: 6:00 PM – 6:00 AM

User sets the start date of the pattern in Settings → Schedule.
App calculates all future work days from that anchor date.

## SLEEP WINDOW CALCULATION
```typescript
function calculateSleepWindow(shiftStart: string, shiftEnd: string, isWorkDay: boolean): SleepWindow {
  if (!isWorkDay) {
    return { windDown: "9:30 PM", sleep: "10:30 PM", wake: "6:30 AM", note: "Rest day" };
  }
  const startH = parseInt(shiftStart.split(':')[0]);
  const endH   = parseInt(shiftEnd.split(':')[0]);
  const isNight = startH >= 17;

  if (isNight) {
    const sleepH = (endH + 1) % 24;
    const wakeH  = (endH + 8) % 24;
    return {
      windDown: fmt24(sleepH),
      sleep:    fmt24(sleepH),
      wake:     fmt24(wakeH),
      note:     "Night shift — darken the room"
    };
  }
  const wakeH  = startH - 1;
  const sleepH = startH - 9;
  return {
    windDown: fmt24(sleepH + 1),
    sleep:    fmt24(sleepH),
    wake:     fmt24(wakeH),
    note:     "Pre-shift — full 8 hours"
  };
}
```

## COMMUTE
~45 minutes each direction. Built into sleep window calculation:
wake time = shiftStart - 1 hour (includes commute buffer).

## OVERTIME
+1h, +2h, +4h, or custom input.
Single-day exception. Next day returns to original schedule.
OT stored as overtimeH on ShiftSchedule interface.
OT date stored as overtimeDate.
