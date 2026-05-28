# LAYER 3 PRIME PROMPT — SOVEREIGN WORKS
# Native Android Alarm System
# Read LAYER2_PRIME_PROMPT_v2.md first if Layer 2 is not yet complete.
# Do not begin Layer 3 until all L2.01–L2.30 checkboxes are confirmed.

# ══════════════════════════════════════════════════════════════════
# PROTOTYPE LAW — NON-NEGOTIABLE
# sovereign_v9.jsx is the visual and behavioral contract for every
# screen. Have it open in a browser at all times during this build.
# Every screen must match it. If it doesn't, the screen is wrong.
# ══════════════════════════════════════════════════════════════════

# ══════════════════════════════════════════════════════════════════
# APK REQUIREMENT — MANDATORY FINAL STEP
# After ALL Layer 3 verification checks pass, build both APKs
# and push to GitHub before reporting Layer 3 complete.
# Garrin installs and tests on device before Layer 4 begins.
# ══════════════════════════════════════════════════════════════════

---

## WHAT LAYER 3 BUILDS

The native Android alarm system. This is NOT a JavaScript notification.
This is a full-screen alarm that fires over the lock screen, survives phone
restarts, and requires the user to confirm they are awake before it dismisses.

Layer 3 scope:
- AndroidManifest.xml permissions and receivers
- Boot receiver (alarms survive restart)
- Exact alarm scheduling (AlarmManager)
- Full-screen intent (fires over lock screen)
- Are You Awake confirmation screen
- Snooze (9 min default, configurable 5/9/15 min)
- Bedtime alarm wired to the "Set Alarm" button in the Planner
- Morning wake alarm wired to the sleep window calculation
- Batch cook reminder (7 PM evening before a batch day)
- Hydration reminder alarms (configurable intervals)
- Alarm management screen (view, edit, delete all active alarms)
- Overtime alarm adjustment (single-day exception, does not modify schedule)

Layer 3 does NOT include:
- iOS anything — Android only
- Push notifications from server — all alarms are device-local
- Watch alarms — that is a separate layer
- Calendar event alarms — Layer 6

---

## READ ORDER

These files are already in SOVEREIGN_WORKS_PHASE1/:

1. `07_ALARM_SYSTEM.md`         ← primary spec for this layer
2. `01_TECH_STACK.md`           ← Android-specific dependencies
3. `05_SHIFT_SCHEDULE.md`       ← shift types that drive alarm timing
4. `15_VISUAL_DESIGN.md`        ← alarm screen visual spec
5. `sovereign_v9.jsx`           ← prototype: alarm modal and Set Alarm button

Read all five before writing any code.

---

## CONTENT RULE — UNCHANGED FROM LAYER 2

Cursor does not write alarm label text, declaration text, or any copy.
Alarm labels come from the spec files. If a label is not in the spec,
use a placeholder: `// TODO: label from 07_ALARM_SYSTEM.md`

---

## ANDROID MANIFEST PERMISSIONS

Add ALL of these to `AndroidManifest.xml`. Missing any one will break alarms:

```xml
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
<uses-permission android:name="android.permission.USE_EXACT_ALARM" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

<receiver
  android:name=".AlarmReceiver"
  android:exported="true"
  android:enabled="true">
  <intent-filter>
    <action android:name="android.intent.action.BOOT_COMPLETED" />
    <action android:name="android.intent.action.LOCKED_BOOT_COMPLETED" />
  </intent-filter>
</receiver>

<activity
  android:name=".AlarmActivity"
  android:launchMode="singleInstance"
  android:showWhenLocked="true"
  android:turnScreenOn="true"
  android:excludeFromRecents="true" />
```

---

## EXACT ALARM SCHEDULING

Use `expo-alarm-manager` or `react-native-alarm-notification`. If neither
is available in Expo managed workflow, eject to bare workflow for this layer.

```typescript
import { scheduleAlarm, cancelAlarm } from './alarmManager';

interface AlarmConfig {
  id: string;               // uuid — stable across reschedules
  label: string;            // display label on full-screen alert
  hour: number;             // 0–23
  minute: number;           // 0–59
  days: number[];           // 1=Sun 2=Mon 3=Tue 4=Wed 5=Thu 6=Fri 7=Sat
                            // empty array = one-time alarm
  vibrate: boolean;
  snoozeMinutes: number;    // default 9
  alarmType: AlarmType;
  enabled: boolean;
}

type AlarmType =
  | 'wake'           // morning wake alarm — from sleep window
  | 'winddown'       // bedtime wind-down — 60 min before sleep
  | 'sleep'          // sleep by alarm — from sleep window
  | 'hydration'      // hydration reminder
  | 'batchcook'      // batch cook reminder — evening before prep day
  | 'overtime'       // single-day overtime adjustment
  | 'custom';        // user-created
```

---

## BOOT RECEIVER

Alarms must survive phone restart. On `BOOT_COMPLETED`:

```typescript
// AlarmReceiver.kt or via expo module bridge:
// 1. Query SQLite alarm_configs table for all enabled alarms
// 2. Reschedule each one using AlarmManager.setExactAndAllowWhileIdle
// 3. Log: "Boot complete — rescheduled N alarms"
```

---

## FULL-SCREEN INTENT

When an alarm fires, the phone must wake from sleep and show the alarm screen.

```typescript
// Full-screen intent requirements:
// - Notification channel importance: NotificationManager.IMPORTANCE_HIGH
// - fullScreenIntent set on the notification builder
// - Activity flags: FLAG_SHOW_WHEN_LOCKED | FLAG_TURN_SCREEN_ON | FLAG_KEEP_SCREEN_ON
// - AlarmActivity shown over lock screen without unlocking
```

The alarm screen (AlarmActivity) design from `sovereign_v9.jsx`:
- Dark background (tradition color)
- Sigil centered
- Alarm label in Cormorant Garamond
- Current time large
- Two buttons: SNOOZE (gold border) and AWAKE (filled gold)
- Snooze fires again in `snoozeMinutes`
- AWAKE dismisses and logs the wake time to SQLite

---

## ARE YOU AWAKE CHECK

After the user taps AWAKE, show a 30-second confirmation screen:

```
"Are you actually awake?"

[Yes — I'm up]   [No — snooze 9 more minutes]
```

If the user does not interact within 30 seconds → auto-snooze.
This prevents the phone being dismissed in sleep without waking.

---

## ALARM TYPES AND TRIGGER LOGIC

### Wake alarm
- Fires at `sleepWindow.wake` time from `useSchedule` hook
- Only fires on scheduled work days
- Days array pulled from shift schedule
- Label: pulled from `07_ALARM_SYSTEM.md`

### Wind-down alarm
- Fires 60 minutes before `sleepWindow.sleep`
- Every day (work and rest days)
- Lower vibration intensity than wake alarm

### Batch cook reminder
- Fires at 7:00 PM on the evening BEFORE any day tagged `batch:true` in WEEK_PLAN
- Message includes tonight's dinner name: "Tomorrow is a prep day. Start [dinner] tonight if marinating."
- User-toggleable in Settings → Notifications

### Hydration reminders
- Interval: user-configurable (every 60, 90, or 120 minutes)
- Active hours: 7 AM – 9 PM only (never overnight)
- On duty: more frequent (default 60 min)
- Off duty: less frequent (default 90 min)
- Stops firing once daily hydration goal is met (reads from SQLite hydration_log)

### Overtime adjustment
- When overtime is active (set via OT modal), shift tomorrow's wake alarm by OT duration
- Example: +2h OT → wake alarm moves 2 hours later for that day only
- Original schedule resumes the day after
- OT badge shows in shift strip: "OT +2h"
- Cancel OT restores original alarm time immediately

---

## ALARM MANAGEMENT SCREEN

Accessible from: More tab → Alarms, or tapping the alarm icon in the shift strip.

Display:
- List of all active alarms grouped by type
- Each row: label, time, days, on/off toggle
- Swipe left to delete
- Tap to edit (time, snooze duration, days, vibrate on/off)
- "Add alarm" button at top right
- Separate section for one-time alarms vs repeating alarms

---

## BEDTIME SET ALARM — WIRE FROM PLANNER

The planner Today tab has a `Set Alarm` button on the bedtime row (wired in Layer 2).

That button must now open the alarm management screen pre-filled with:
- Wake time = `sleepWindow.wake`
- Wind-down time = `sleepWindow.windDown`
- Sleep time = `sleepWindow.sleep`
- Days = current work schedule days

If alarms are already set for those times, show them as already configured
rather than creating duplicates.

---

## SQLITE — ALARM LOG TABLE

```sql
CREATE TABLE IF NOT EXISTS alarm_log (
  id TEXT PRIMARY KEY,
  alarm_id TEXT NOT NULL,
  alarm_type TEXT NOT NULL,
  scheduled_time INTEGER NOT NULL,
  fired_at INTEGER,
  dismissed_at INTEGER,
  dismissed_type TEXT,  -- 'awake' | 'snooze' | 'auto_snooze' | 'missed'
  snooze_count INTEGER DEFAULT 0
);
```

Log every alarm fire, every dismissal, and every snooze. This feeds the
sleep quality data for the Charts tab in Layer 7.

---

## PERMISSIONS REQUEST FLOW

On first launch after Layer 3 is installed:

1. Check `SCHEDULE_EXACT_ALARM` — if not granted, open system settings screen
   with explanation: "Exact alarms are required for the wake alarm to fire
   at the correct time. Android restricts this permission — you must grant it
   manually."
2. Check `SYSTEM_ALERT_WINDOW` (draw over other apps) — same flow
3. Check `POST_NOTIFICATIONS` — standard runtime request dialog
4. After all three granted → show confirmation: "Alarm system is active."

Do not proceed to alarm scheduling until all three are granted.

---

## BUILD SEQUENCE FOR LAYER 3

Complete in this order:

```
L3.01  Eject to bare workflow if needed for AlarmManager access
L3.02  Install alarm native module (expo-alarm-manager or equivalent)
L3.03  AndroidManifest.xml — all permissions and receivers added
L3.04  AlarmManager wrapper — scheduleAlarm(), cancelAlarm(), rescheduleAll()
L3.05  AlarmReceiver.kt — boot receiver, reschedules all enabled alarms on restart
L3.06  AlarmActivity — full-screen intent, shows over lock screen
L3.07  Are You Awake screen — 30-second auto-snooze countdown
L3.08  Snooze logic — fires again in snoozeMinutes, increments snooze_count
L3.09  alarm_log SQLite table created
L3.10  Wake alarm auto-scheduled from sleepWindow.wake on schedule change
L3.11  Wind-down alarm auto-scheduled from sleepWindow.windDown
L3.12  Batch cook reminder — reads WEEK_PLAN, fires night before batch days
L3.13  Hydration reminders — interval-based, stops when daily goal met
L3.14  Overtime alarm adjustment — single-day exception logic
L3.15  Alarm management screen — list, toggle, edit, delete, add
L3.16  Planner Set Alarm button wired to alarm management screen
L3.17  Permissions request flow on first launch
L3.18  APP_VERSION bumped → tutorial reset fires on next launch
        (users see the notifications tutorial step again)
L3.19  Verify: phone restarts → alarms still fire at correct times
L3.20  Verify: overtime set → wake alarm moves, cancels back correctly
L3.21  Verify: Are You Awake — auto-snooze fires if no tap in 30 seconds
L3.22  Verify: hydration alarms stop when daily goal is logged as met
L3.23  Verify: batch cook reminder fires with correct dinner name
L3.24  Update all L3 checkboxes in 21_BUILD_SEQUENCE.md as [x]
```

---

## ══ MANDATORY — BUILD APKS BEFORE REPORTING LAYER 3 DONE ══
## AFTER LAYER 3 IS COMPLETE

## ══ MANDATORY — BUILD APKS BEFORE REPORTING LAYER 3 DONE ══

### Step 1 — All L3 checks must be [x] first

### Step 2 — Build Imperium APK
```bash
cd C:\SovereignWorks\apps\imperium
npx eas build --platform android --profile preview --local
```

### Step 3 — Build Tending APK
```bash
cd C:\SovereignWorks\apps\tending
npx eas build --platform android --profile preview --local
```

### Step 4 — Push to GitHub
```bash
cd C:\SovereignWorks
git add -A
git commit -m "Layer 3 complete — both APKs rebuilt"
git push origin main
```

### Step 5 — Report and STOP
Tell Garrin:
- "Layer 3 complete."
- "Imperium APK: [filename and location]"
- "Tending APK: [filename and location]"
- "Install both on your phone. Uninstall the Layer 2 versions first."
- "Test both apps. Tell me when you're ready for Layer 4."

Do NOT open LAYER4_PRIME_PROMPT.md until Garrin confirms.


Layer 4 is Firebase household sync — mood, grocery cart, planner state
syncing in real time between Garrin's phone and Holli's phone.
Do not begin Layer 4 until told to.

---

## WHAT CURSOR WRITES IN LAYER 3

| File | Cursor writes? |
|------|---------------|
| AndroidManifest.xml additions | ✓ Yes |
| AlarmReceiver.kt / .java | ✓ Yes |
| AlarmActivity.kt / .java | ✓ Yes |
| alarmManager.ts wrapper | ✓ Yes |
| Alarm management screen .tsx | ✓ Yes |
| SQLite alarm_log table | ✓ Yes |
| Alarm label text | ✗ Never — from 07_ALARM_SYSTEM.md |
| Are You Awake copy | ✗ Never — from 07_ALARM_SYSTEM.md |
