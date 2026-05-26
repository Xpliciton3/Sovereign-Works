# ALARM SYSTEM — FULL SPECIFICATION
# THE ALARM IS LOUD. THIS IS NON-NEGOTIABLE.

---

## ALARM BEHAVIOR — REQUIREMENTS

### Volume & Vibration
- Maximum device volume when alarm fires — regardless of device ringer setting
- Simultaneous full-pattern vibration
- Volume buttons on the phone DO NOT silence the alarm during firing
- The only way to stop the sound is to interact with the alarm screen

### Full-Screen Takeover
- Full screen alarm UI on top of the lock screen
- Black background (Imperium) or deep red background (Tending)
- Time in large centered text
- Alarm label in tradition-colored text
- Three buttons: SNOOZE / DISMISS / I'M UP

### Sound
- Alarm tone bundled with the app — no network required
- Escalating volume: starts at 70% max, reaches 100% at 60 seconds
- Repeating loop until interaction

---

## ALARM SCREEN UI

```
┌─────────────────────────────────────────────┐
│                                             │
│                5:30 AM                      │
│           WEDNESDAY, JAN 14                 │
│                                             │
│     The system begins now                   │
│                                             │
│                                             │
│   ┌──────────────────────────────────────┐  │
│   │           SNOOZE (9 min)             │  │
│   └──────────────────────────────────────┘  │
│                                             │
│   ┌──────────────────────────────────────┐  │
│   │              DISMISS                 │  │
│   └──────────────────────────────────────┘  │
│                                             │
│                  I'M UP                     │
│                                             │
└─────────────────────────────────────────────┘
```

**SNOOZE:** Default 9 min (configurable: 5/9/10/15/20/custom). Fires again after duration. Max snoozes configurable (1/2/3/unlimited). After max snoozes: SNOOZE button disappears, only DISMISS and I'M UP remain.

**DISMISS:** Stops alarm. If "Are You Awake" check is enabled → schedules check-in per settings. Does NOT confirm awake.

**I'M UP:** Stops alarm. Cancels any scheduled check-in. Confirms awake. Opens daily planner.

---

## ARE YOU AWAKE CHECK-IN — FULL SPECIFICATION

### Toggleable
Setting: "Are You Awake Check" — ON / OFF toggle in Settings → Alarms.
Default: ON.
When OFF: DISMISS ends the alarm with no follow-up.

### Delay Options
After DISMISS, the check-in fires after a user-selected delay:

```
ARE YOU AWAKE DELAY:
  ○ 1 minute
  ○ 2 minutes
  ◉ 5 minutes  (default)
  ○ 10 minutes
```

### Check-In Screen — Full Screen Lock

When the check-in fires, it takes over the ENTIRE screen:

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│                                             │
│              ARE YOU AWAKE?                 │
│                                             │
│         You dismissed your alarm            │
│         5 minutes ago.                      │
│                                             │
│              ████████░░░░                   │
│          4:12 remaining                     │  ← 5-minute countdown
│                                             │
│                                             │
│   ┌──────────────────────────────────────┐  │
│   │              I'M AWAKE               │  │  ← ONLY button
│   └──────────────────────────────────────┘  │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

**Rules for this screen:**
- Back button does NOT dismiss it
- Home button does NOT dismiss it (screen returns immediately when phone is raised)
- Volume buttons do nothing
- The progress bar counts down 5 minutes in real time
- "I'M AWAKE" is the only interactive element
- No snooze option on this screen — that ship has sailed

### Haptic Pulse During Countdown

While the 5-minute countdown is running, the phone fires a haptic burst
every 60 seconds. This ensures a sleeping person feels the phone even
face-down without sound.

```typescript
// Schedule haptic pulses for the 5-minute countdown window
function scheduleAwakePulses() {
  const pulseIntervals = [60, 120, 180, 240]; // seconds after screen appears
  pulseIntervals.forEach(sec => {
    setTimeout(() => {
      // Short triple-tap pattern — distinct from alarm vibration
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning), 200);
      setTimeout(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning), 400);
    }, sec * 1000);
  });
}
// Call scheduleAwakePulses() immediately when the Are You Awake screen appears.
// Cancel all pending timeouts when I'M AWAKE is tapped.
```

The haptic pattern is three short taps spaced 200ms apart — different from
the alarm's sustained vibration, so the user can tell what it is even half-asleep.

### If Timer Expires Without Response

After 5 minutes with no "I'M AWAKE" tap: **full alarm restarts**.

Full restart means:
- Sound fires at max volume again
- Vibration pattern fires again
- Full alarm screen takeover (same as original alarm)
- Snooze counter resets to 0 (user gets their snoozes back)
- This cycle repeats indefinitely until I'M UP or I'M AWAKE is tapped

### If "I'M AWAKE" Is Tapped

- Screen clears immediately
- Opens daily planner
- Logs "confirmed awake" timestamp

---

## ARE YOU AWAKE — SETTINGS UI

```
ALARMS & REMINDERS

─── ARE YOU AWAKE CHECK ────────────────────────

  After Dismiss, Check If Awake:  [toggle: ON]

  (Only applies when toggle is ON)

  Check fires after:
    ○ 1 minute
    ○ 2 minutes
    ◉ 5 minutes
    ○ 10 minutes

  If no response, full alarm restarts after:
    5 minutes  (fixed — not configurable)

─────────────────────────────────────────────────
```

---

## ALARM MANAGEMENT SCREEN

```
MY ALARMS

DEFAULT ALARMS
─────────────────────────────────────────────────
5:30 AM    The system begins now
           Daily | Snooze: 9 min | [toggle: ON] [Edit]

12:00 PM   Midday anchor
           Daily | Snooze: 9 min | [toggle: ON] [Edit]

6:00 PM    Evening review opens
           Daily | Snooze: 9 min | [toggle: ON] [Edit]

9:30 PM    Wind down. No new decisions.
           Daily | Snooze: 9 min | [toggle: ON] [Edit]

─────────────────────────────────────────────────
SLEEP ALARMS (from optimizer)
  [toggle: ON/OFF for all sleep alarms]

─────────────────────────────────────────────────
[+ Add Custom Alarm]
```

### Edit Alarm Sheet

```
EDIT ALARM

Time:        [5] : [30] [AM/PM]
Label:       [The system begins now         ]

Repeats:
  ◉ Daily
  ○ Weekdays only
  ○ Weekends only
  ○ Custom days
  ○ Once

Snooze:      [5min]  [9min ●]  [10min]  [15min]  [Custom]
Max snoozes: [1]  [2]  [3 ●]  [Unlimited]

(Are You Awake settings apply globally — configure in Settings → Alarms)

[Delete Alarm]                    [Save Changes]
```

---

## ALARM TYPES

```typescript
export type AlarmType =
  | 'default'         // one of the 4 daily defaults
  | 'event'           // attached to a calendar event
  | 'sleep_wind_down' // from sleep optimizer
  | 'sleep_wake'      // from sleep optimizer
  | 'holy_day'        // auto-generated for holy days
  | 'meal_reminder'   // optional
  | 'custom';

export interface AlarmConfig {
  id: string;
  type: AlarmType;
  label: string;
  hour: number;
  minute: number;
  repeats: 'daily' | 'weekdays' | 'weekends' | 'custom_days' | 'once';
  customDays?: number[];
  snoozeMinutes: number;
  maxSnoozes: number;
  enabled: boolean;
  eventId?: string;
}

export interface AreYouAwakeConfig {
  enabled: boolean;
  delayMinutes: 1 | 2 | 5 | 10;
  screenTimeoutSeconds: 300;   // fixed at 5 minutes — not configurable
}
```

---

## ANDROID PERMISSIONS REQUIRED

```xml
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>
<uses-permission android:name="android.permission.USE_EXACT_ALARM"/>
<uses-permission android:name="android.permission.VIBRATE"/>
<uses-permission android:name="android.permission.WAKE_LOCK"/>
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
```

`SYSTEM_ALERT_WINDOW` is required for the full-screen takeover to work on locked screens.
Alarms must survive device restart — use `RECEIVE_BOOT_COMPLETED` to reschedule on boot.

---

## BATCH_COOK_REMINDER (Layer 3+)

`BATCH_COOK_REMINDER`: fires the evening before any day tagged `batch:true` in WEEK_PLAN.
Message: "Tomorrow — [Day]: [Dinner meal name]. Start protein tonight if marinating."
Timing: 7 PM the evening before. User-toggleable. Fires only if meal plan week is active.

