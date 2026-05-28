# 10 — HYDRATION

## DAILY GOAL

Imperium (Garrin): 80 oz baseline, 96 oz on shift days.
Tending (Holli): 80 oz baseline, 96 oz on shift days.
(Shift days determined by useSchedule hook.)

## UI LOCATION

Body hub tile on Home tab, expanded inline.
Shows: progress ring or bar, oz logged today, goal oz, % complete.
+ buttons: +8 oz, +16 oz, +24 oz. Custom input optional.
Goal met state: ring fills, check mark, "Daily goal met."

## DATA

```typescript
// SQLite hydration_log table — date-keyed per profile
// Syncs total to Firebase: households/{id}/hydration/{uid}/{dateKey}/totalOz
// Local write first, Firebase queued via writeShared()

function logOz(oz: number, profile: string): void {
  // Append to hydration_log
  // Recalculate totalOz for today
  // writeShared to Firebase
  // If goalMet: stop hydration reminder alarms for today
}
```

## HYDRATION REMINDER INTEGRATION

Hydration reminders (from 07_ALARM_SYSTEM.md) stop firing once totalOz >= goalOz.
The hydration hook must expose goalMet boolean for the alarm system to read.
Interval configurable in Settings: 60 / 90 / 120 minutes.
Active hours: 7 AM – 9 PM only.

## PLANNER ITEM

Planner item id: 'hyd' — "First 24 oz of water"
Expanded content: instructions from MASTER docs (Cursor imports, does not write).
Checking this item fires addHydration(24) automatically.
