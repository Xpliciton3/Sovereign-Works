# HYDRATION TRACKER

---

## TARGETS
- Garrin / Imperium: 100 oz/day
- Holli / Tending: 96 oz/day

Both targets are adjustable in Settings.

---

## UI — ON THE DAILY PLANNER

```
─── HYDRATION ───────────────────────────────

  64 / 100 oz     ████████████░░░░░░    64%

  [+ 8oz]  [+ 16oz]  [+ Custom]

─────────────────────────────────────────────
```

Quick-log buttons: +8oz (one glass), +16oz (large glass/bottle).
"+ Custom" opens a number input.

---

## UI — FULL HYDRATION SCREEN (tap the hydration row)

```
HYDRATION

TODAY: WEDNESDAY JAN 14

  ┌─────────────────────────────┐
  │     64 oz         ████░     │
  │     of 100 oz               │
  └─────────────────────────────┘

  [+ 8oz]   [+ 12oz]   [+ 16oz]   [+ Custom]

  Goal by end of day: 36 oz remaining
  Next recommended: 8 oz now

  ─── LOG ──────────────────────────────────
  9:02 AM    8 oz      water
  10:15 AM   8 oz      water
  12:00 PM   16 oz     water
  2:30 PM    8 oz      tea
  4:00 PM    24 oz     water

  [Edit entry]   [Delete entry]

  ─── HISTORY ──────────────────────────────
  [Last 7 days as a simple bar chart]
  Mon: 80oz   Tue: 72oz   Wed: 64oz (ongoing)
  Thu: 90oz   Fri: 100oz  Sat: 68oz  Sun: 95oz
```

---

## HYDRATION REMINDERS

Optional. Enabled in Settings.

```typescript
// If enabled: fires every X minutes during waking hours if under target
const HYDRATION_REMINDER = {
  intervalMinutes: 60,        // remind every hour
  startHour: 7,               // first reminder at 7 AM
  endHour: 21,                // last reminder at 9 PM
  message: 'Time to hydrate.',  // Imperium voice
  // Tending: 'How about some water?'
  suppressedIfOnTarget: true, // don't remind if already on pace
};
```

---

## DATA STORAGE

Hydration is synced to Firebase for household awareness (Holli can see if Garrin is staying hydrated, and vice versa). Daily totals sync — not individual entries.

```typescript
// Firebase: households/{id}/hydration/imperium/YYYY-MM-DD
// Only syncs: { targetOz, loggedOz, lastUpdated }
// Individual entries stay on device (expo-sqlite)
```

---

## SHIFT ADJUSTMENT

On night shift days, the hydration tracker adjusts the reminder schedule:

```typescript
function getHydrationReminderSchedule(shiftDay: ShiftDay): HydrationSchedule {
  if (shiftDay.isNightShift && shiftDay.status === 'on') {
    // Night shift: push reminders to overnight hours
    return { startHour: 18, endHour: 6, intervalMinutes: 60 };
  }
  return { startHour: 7, endHour: 21, intervalMinutes: 60 };
}
```

