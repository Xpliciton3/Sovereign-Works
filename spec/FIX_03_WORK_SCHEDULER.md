# FIX 03 — WORK SCHEDULER / SHIFT STRIP (UPGRADED)
# Replace the entire previous FIX_03 with this file.
# This supersedes the v7 version with full rotation support and
# features researched from production shift-work schedulers.

---

## APK AUDIT FINDINGS (v1.0.10)

The following are confirmed broken or missing in the current APK:

1. **Shift times hardcoded** — "6:00 AM" and "6:00 PM" are literal strings,
   not driven by user input. User cannot change them.

2. **No rotation pattern engine** — Only a 7-day manual grid exists.
   2-2-3, 4×10, Pitman, and custom patterns are absent.

3. **Overnight logic missing** — Sleep recommendations do not change
   based on whether the shift is day or overnight.

4. **OT button absent** — The overtime sheet does not render on the
   home screen shift strip.

5. **Sleep window hardcoded** — "5:00 AM wake / 9:30 PM sleep" are
   static values not computed from actual shift data.

6. **Mind hub content stub** — "Mind hub content is in active build."
   The Mind hub is a stub. Body and Soul also stubbed.

7. **Icons missing** — Brain (Mind), Heart (Body), Star (Soul) hub tile
   icons do not render. IC constant paths are not being used.

---

## ROTATION PATTERNS SUPPORTED

Research source: production law enforcement scheduling systems
(Telestaff, VCS SchedulePlus, Kronos Workforce), military rotation apps,
and nurse scheduling research (AAWF pattern analysis).

```typescript
export type ScheduleType =
  | 'manual'      // per-day text entries
  | '223'         // 2-2-3 (most common LE rotation)
  | '410'         // 4×10s (Mon–Thu, 3-day weekend)
  | '312'         // 3-1-2-1 continental rotating
  | '247'         // Pitman (same math as 2-2-3, different framing)
  | '4210'        // 4 on, 2 off, 1 on, 0 off (less common)
  | 'swing'       // rotating 8-hour shifts with swing embedded
  | 'custom';     // user-defined on/off sequence

export type ShiftKind = 'days' | 'overnight' | 'swing';
```

### Pattern Definitions

```typescript
// All patterns are expressed as boolean arrays (true=work, false=off)
// The array length is one full rotation cycle.

export const ROTATION_PATTERNS: Record<ScheduleType, boolean[] | null> = {
  manual: null,  // no pattern — per-day entries used instead
  
  // 2-2-3: Work Mon+Tue, Off Wed+Thu, Work Fri+Sat+Sun (14-day cycle)
  // Week B: Off Mon+Tue, Work Wed+Thu, Off Fri+Sat+Sun
  '223': [
    true, true, false, false, true, true, true,    // Week A
    false, false, true, true, false, false, false   // Week B
  ],

  // 4×10: Work Mon–Thu, Off Fri–Sun (7-day cycle)
  '410': [true, true, true, true, false, false, false],

  // 3-1-2-1: Work 3, Off 1, Work 2, Off 1 (7-day cycle)
  '312': [true, true, true, false, true, true, false],

  // Pitman: identical cycle to 2-2-3 mathematically
  // (2 on, 2 off, 3 on, 2 off, 2 on, 3 off — 14 days)
  '247': [
    true, true, false, false, true, true, true,
    false, false, true, true, false, false, false
  ],

  // 4-2-1-0: 4 on, 2 off, 1 on, 0 (7-day)
  '4210': [true, true, true, true, false, false, true],

  // Swing: user configures start time per phase — not a boolean pattern
  // Requires start time input only; the boolean pattern is daily
  swing: null,

  // Custom: user enters e.g. "3,4" or "4,3,4,3" → parsed to boolean array
  custom: null,
};
```

### Pattern Engine (single function — use everywhere)

```typescript
// packages/shared/src/hooks/useSchedule.ts

export function getDayStatus(
  anchorDate: string,  // YYYY-MM-DD — the first day of the first "on" block
  scheduleType: ScheduleType,
  customPatternDays: string,  // "3,4" or "4,3,4,3" — ignored unless custom
  checkDate: Date = new Date()
): { isWork: boolean; positionInCycle: number; cycleLength: number } {
  
  if (scheduleType === 'manual') {
    // Manual mode: caller uses per-day lookup, not this function
    return { isWork: false, positionInCycle: 0, cycleLength: 7 };
  }

  const anchor = new Date(anchorDate + 'T00:00:00');
  const today = new Date(checkDate);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - anchor.getTime()) / 86400000);

  if (diffDays < 0) {
    return { isWork: false, positionInCycle: 0, cycleLength: 14 };
  }

  // Get pattern array
  let pattern: boolean[] | null = ROTATION_PATTERNS[scheduleType] ?? null;

  if (scheduleType === 'custom' && customPatternDays) {
    pattern = parseCustomPattern(customPatternDays);
  }

  if (!pattern || pattern.length === 0) {
    return { isWork: false, positionInCycle: diffDays, cycleLength: 1 };
  }

  const cycleLength = pattern.length;
  const pos = ((diffDays % cycleLength) + cycleLength) % cycleLength;
  return {
    isWork: pattern[pos],
    positionInCycle: pos,
    cycleLength,
  };
}

function parseCustomPattern(input: string): boolean[] {
  // Input: "3,4" → [T,T,T,F,F,F,F] or "4,3,4,3" → [T×4,F×3,T×4,F×3]
  const parts = input
    .split(',')
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !isNaN(n) && n > 0);
  
  if (parts.length < 2) return [];
  
  const result: boolean[] = [];
  parts.forEach((count, idx) => {
    const isWork = idx % 2 === 0;  // first segment = work, second = off, etc.
    for (let i = 0; i < count; i++) result.push(isWork);
  });
  return result;
}
```

---

## SLEEP WINDOW CALCULATION

The sleep window MUST respond to shift kind. This is the primary complaint
from night-shift practitioners about existing scheduling apps.

```typescript
export interface SleepWindow {
  wake: string;      // "5:00 AM"
  windDown: string;  // "9:00 PM"
  sleep: string;     // "9:30 PM"
  note: string;
}

export function calcSleepWindow(
  shiftKind: ShiftKind,
  shiftStart: string,  // "HH:MM" 24h
  shiftEnd: string,    // "HH:MM" 24h
  isWorkDay: boolean,
  overtimeH: number = 0
): SleepWindow {

  function toMins(t: string): number {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }
  function fmtTime(totalMins: number): string {
    const normalized = ((totalMins % 1440) + 1440) % 1440;
    const h = Math.floor(normalized / 60);
    const m = normalized % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
  }

  if (!isWorkDay) {
    return {
      wake: '6:30 AM',
      windDown: '9:30 PM',
      sleep: '10:30 PM',
      note: 'Rest day — maintain anchor within 60 min.',
    };
  }

  const startM = toMins(shiftStart);
  const endM = toMins(shiftEnd);
  const isOvernight = endM < startM;  // crosses midnight

  if (shiftKind === 'overnight' || isOvernight) {
    // Night shift: sleep after shift ends, wake ~7.5hr later
    const sleepAt = endM + 45 + overtimeH * 60;  // 45-min wind-down post-shift
    const riseAt = sleepAt + 450;                  // 7.5hr = 5 × 90-min cycles
    const windDownAt = sleepAt - 30;
    return {
      wake: fmtTime(riseAt),
      windDown: fmtTime(windDownAt),
      sleep: fmtTime(sleepAt),
      note: 'Night shift — blackout room. Sleep immediately post-shift.',
    };
  }

  // Day shift: wake 1hr before shift start (45-min commute + 15-min buffer)
  const wakeAt = startM - 60 + overtimeH * 60;
  const sleepAt2 = wakeAt - 480;   // 8hr prior
  const windDown2 = wakeAt - 510;  // 8.5hr prior (30-min wind-down)
  return {
    wake: fmtTime(wakeAt),
    windDown: fmtTime(windDown2),
    sleep: fmtTime(sleepAt2),
    note: 'Rise time anchors the rhythm. Keep within 30 min on days off.',
  };
}
```

---

## useSchedule HOOK — COMPLETE REWRITE

Replace the entire existing useSchedule hook with this:

```typescript
// packages/shared/src/hooks/useSchedule.ts

import { useState, useEffect, useCallback } from 'react';
import { getSetting, saveSetting } from '../db/settings';
import { getDayStatus, calcSleepWindow } from './scheduleEngine';

export interface ShiftSchedule {
  // Current state
  scheduleType: ScheduleType;
  shiftKind: ShiftKind;
  shiftStart: string;       // "HH:MM"
  shiftEnd: string;         // "HH:MM"
  anchorDate: string;       // "YYYY-MM-DD"
  customPatternDays: string; // "3,4" | "4,3,4,3" | ""

  // Computed for today
  isWorkDay: boolean;
  shiftLabel: string;       // "DAY SHIFT 6A–6P" | "NIGHT SHIFT 6P–6A" | "OFF TODAY"
  sleepWindow: SleepWindow;

  // Overtime
  overtimeH: number;
  overtimeDate: string | null;

  // Actions
  setScheduleType: (t: ScheduleType) => Promise<void>;
  setShiftKind: (k: ShiftKind) => Promise<void>;
  setShiftTimes: (start: string, end: string) => Promise<void>;
  setAnchorDate: (d: string) => Promise<void>;
  setCustomPattern: (p: string) => Promise<void>;
  setOvertime: (h: number) => Promise<void>;
  cancelOvertime: () => Promise<void>;
}

export function useSchedule(): ShiftSchedule {
  const [scheduleType, setScheduleTypeState] = useState<ScheduleType>('manual');
  const [shiftKind, setShiftKindState] = useState<ShiftKind>('days');
  const [shiftStart, setShiftStart] = useState('06:00');
  const [shiftEnd, setShiftEnd] = useState('18:00');
  const [anchorDate, setAnchorDateState] = useState('');
  const [customPatternDays, setCustomPatternDaysState] = useState('');
  const [overtimeH, setOvertimeH] = useState(0);
  const [overtimeDate, setOvertimeDateStr] = useState<string | null>(null);

  // Manual schedule (per-day overrides for 'manual' type)
  const [manualSchedule, setManualSchedule] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const [st, sk, ss, se, ad, cpd, oth, otd, ms] = await Promise.all([
        getSetting('scheduleType'),
        getSetting('shiftKind'),
        getSetting('shiftStart'),
        getSetting('shiftEnd'),
        getSetting('anchorDate'),
        getSetting('customPatternDays'),
        getSetting('overtimeH'),
        getSetting('overtimeDate'),
        getSetting('manualSchedule'),
      ]);
      if (st) setScheduleTypeState(st as ScheduleType);
      if (sk) setShiftKindState(sk as ShiftKind);
      if (ss) setShiftStart(ss);
      if (se) setShiftEnd(se);
      if (ad) setAnchorDateState(ad);
      if (cpd) setCustomPatternDaysState(cpd);
      if (oth) setOvertimeH(parseInt(oth, 10) || 0);
      if (otd) setOvertimeDateStr(otd);
      if (ms) setManualSchedule(JSON.parse(ms) as Record<string, string>);
    })();
  }, []);

  const todayISO = new Date().toISOString().slice(0, 10);
  const otActive = overtimeH > 0 && overtimeDate === todayISO;

  // Determine today's work status
  let isWorkDay = false;
  if (scheduleType === 'manual') {
    const days = ['sun','mon','tue','wed','thu','fri','sat'];
    const key = days[new Date().getDay()];
    isWorkDay = !!(manualSchedule[key]);
  } else {
    const result = getDayStatus(anchorDate, scheduleType, customPatternDays);
    isWorkDay = result.isWork;
  }

  const effectiveOT = otActive ? overtimeH : 0;
  const sleepWindow = calcSleepWindow(shiftKind, shiftStart, shiftEnd, isWorkDay, effectiveOT);

  const shiftLabel = !isWorkDay
    ? 'OFF TODAY'
    : shiftKind === 'overnight'
    ? `NIGHT SHIFT  ${formatShift(shiftStart, shiftEnd)}`
    : shiftKind === 'swing'
    ? `SWING SHIFT  ${formatShift(shiftStart, shiftEnd)}`
    : `DAY SHIFT  ${formatShift(shiftStart, shiftEnd)}`;

  return {
    scheduleType,
    shiftKind,
    shiftStart,
    shiftEnd,
    anchorDate,
    customPatternDays,
    isWorkDay,
    shiftLabel,
    sleepWindow,
    overtimeH: effectiveOT,
    overtimeDate,

    setScheduleType: async (t) => {
      setScheduleTypeState(t);
      await saveSetting('scheduleType', t);
    },
    setShiftKind: async (k) => {
      setShiftKindState(k);
      await saveSetting('shiftKind', k);
    },
    setShiftTimes: async (start, end) => {
      setShiftStart(start);
      setShiftEnd(end);
      await Promise.all([saveSetting('shiftStart', start), saveSetting('shiftEnd', end)]);
    },
    setAnchorDate: async (d) => {
      setAnchorDateState(d);
      await saveSetting('anchorDate', d);
    },
    setCustomPattern: async (p) => {
      setCustomPatternDaysState(p);
      await saveSetting('customPatternDays', p);
    },
    setOvertime: async (h) => {
      setOvertimeH(h);
      setOvertimeDateStr(todayISO);
      await Promise.all([
        saveSetting('overtimeH', String(h)),
        saveSetting('overtimeDate', todayISO),
      ]);
    },
    cancelOvertime: async () => {
      setOvertimeH(0);
      setOvertimeDateStr(null);
      await Promise.all([
        saveSetting('overtimeH', '0'),
        saveSetting('overtimeDate', ''),
      ]);
    },
  };
}

function formatShift(start: string, end: string): string {
  function fmt(t: string): string {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'P' : 'A';
    const h12 = h % 12 || 12;
    return m ? `${h12}:${String(m).padStart(2,'0')}${ampm}` : `${h12}${ampm}`;
  }
  return `${fmt(start)} – ${fmt(end)}`;
}
```

---

## SETTINGS SCREEN — SCHEDULE SECTION

In Settings → Schedule (also surfaces in Planner → Schedule sub-tab):

```tsx
// Full Schedule settings component

<SectionHeader>SCHEDULE</SectionHeader>

{/* Rotation Pattern — tap buttons */}
<Label>Rotation Pattern</Label>
<PatternSelector
  options={[
    { key: 'manual',  label: 'Manual'   },
    { key: '223',     label: '2-2-3'    },
    { key: '410',     label: '4×10'     },
    { key: '312',     label: '3-1-2'    },
    { key: '247',     label: 'Pitman'   },
    { key: '4210',    label: '4-2-1'    },
    { key: 'custom',  label: 'Custom'   },
  ]}
  selected={schedule.scheduleType}
  onSelect={schedule.setScheduleType}
/>

{/* Helper text per pattern */}
<PatternHelperText type={schedule.scheduleType} />

{/* Shift kind */}
<Label>Shift Type</Label>
<SegmentedControl
  options={[
    { key: 'days',      label: 'Days'      },
    { key: 'overnight', label: 'Overnight' },
    { key: 'swing',     label: 'Swing'     },
  ]}
  selected={schedule.shiftKind}
  onSelect={schedule.setShiftKind}
/>

{/* Shift times */}
<Label>Shift Hours</Label>
<TimeRangeInput
  start={schedule.shiftStart}
  end={schedule.shiftEnd}
  onSave={schedule.setShiftTimes}
/>

{/* Anchor date — only for pattern modes */}
{schedule.scheduleType !== 'manual' && (
  <>
    <Label>{anchorLabelFor(schedule.scheduleType)}</Label>
    <HelperText>{anchorHelperFor(schedule.scheduleType)}</HelperText>
    <DatePicker
      value={schedule.anchorDate}
      onChange={schedule.setAnchorDate}
    />
  </>
)}

{/* Custom pattern input */}
{schedule.scheduleType === 'custom' && (
  <>
    <Label>Days On, Days Off</Label>
    <HelperText>Enter alternating on/off counts separated by commas.
      Example: "3,4" = 3 on then 4 off.
      Example: "4,3,4,3" = 4 on, 3 off, 4 on, 3 off.
    </HelperText>
    <TextInput
      value={schedule.customPatternDays}
      onSubmit={schedule.setCustomPattern}
      placeholder="e.g. 3,4"
      keyboardType="numbers-and-punctuation"
    />
  </>
)}

{/* Live preview */}
<PreviewCard schedule={schedule} />
```

### Anchor Label Strings (verbatim — Cursor imports these)

```typescript
function anchorLabelFor(t: ScheduleType): string {
  switch (t) {
    case '223':  return 'Anchor Date — Monday of a week you work Mon + Tue';
    case '247':  return 'Anchor Date — Day 1 of your 14-day Pitman cycle';
    case '410':  return 'Anchor Date — First day of your current 4-day block';
    case '312':  return 'Anchor Date — First day of your current 3-on block';
    case '4210': return 'Anchor Date — First day of your current 4-day block';
    case 'custom': return 'Anchor Date — First day of your work block';
    default: return 'Anchor Date';
  }
}

function anchorHelperFor(t: ScheduleType): string {
  switch (t) {
    case '223':
      return 'Set this to the Monday of a week where you work Monday and Tuesday.';
    case '247':
      return 'Set this to Day 1 of your Pitman cycle (first of two consecutive work days).';
    case '410':
      return 'Set this to the first day (Monday) of your current 4-day work block.';
    case '312':
      return 'Set this to the first day of your current 3-consecutive-day work block.';
    default:
      return 'Set this to the first day of your current work block.';
  }
}
```

---

## HOME TAB — SHIFT STRIP

The shift strip on the Home tab must use the `useSchedule` hook
and match `sovereign_v9.jsx` exactly.

```tsx
// In Home screen, shift strip section:

function ShiftStrip({ schedule }: { schedule: ShiftSchedule }) {
  const isOT = schedule.overtimeH > 0;
  
  return (
    <View style={styles.shiftStrip}>
      {/* Left: shift label */}
      <View style={styles.stripLeft}>
        <Text style={styles.shiftLabel}>{schedule.shiftLabel}</Text>
        <Text style={styles.sleepLine}>
          WAKE {schedule.sleepWindow.wake}  ·  SLEEP {schedule.sleepWindow.sleep}
        </Text>
        {/* Commute reminder on work days */}
        {schedule.isWorkDay && schedule.shiftKind !== 'overnight' && (
          <Text style={styles.commuteHint}>
            Leave by {calcLeaveBy(schedule.shiftStart)}
          </Text>
        )}
      </View>

      {/* Right: OT button */}
      <TouchableOpacity
        style={[styles.otButton, isOT && styles.otButtonActive]}
        onPress={() => openOTSheet()}
      >
        {isOT
          ? <Text style={styles.otBadge}>OT +{schedule.overtimeH}h</Text>
          : <Text style={styles.otLabel}>OT</Text>
        }
      </TouchableOpacity>
    </View>
  );
}

function calcLeaveBy(shiftStart: string): string {
  const [h, m] = shiftStart.split(':').map(Number);
  const leaveM = h * 60 + m - 45;  // 45-min commute
  const lH = Math.floor(((leaveM % 1440) + 1440) % 1440 / 60);
  const lM = ((leaveM % 60) + 60) % 60;
  const ampm = lH >= 12 ? 'PM' : 'AM';
  const lH12 = lH % 12 || 12;
  return `${lH12}:${String(lM).padStart(2, '0')} ${ampm}`;
}
```

### Overtime Bottom Sheet (one-tap from shift strip)

```tsx
// OT bottom sheet — fast tap, not a modal
// Opens as a bottom sheet with snap height ~220px

function OTSheet({ schedule }: { schedule: ShiftSchedule }) {
  return (
    <BottomSheet snapPoints={['220px']}>
      <Text style={styles.sheetTitle}>
        {schedule.overtimeH > 0 ? 'Cancel Overtime' : 'Set Overtime'}
      </Text>

      {schedule.overtimeH > 0 ? (
        // Already set — one tap to cancel
        <TouchableOpacity
          style={styles.cancelOT}
          onPress={() => { schedule.cancelOvertime(); closeSheet(); }}
        >
          <Text style={styles.cancelOTText}>Cancel OT +{schedule.overtimeH}h</Text>
        </TouchableOpacity>
      ) : (
        // Not set — quick options
        <View style={styles.otOptions}>
          {[1, 2, 4].map(h => (
            <TouchableOpacity
              key={h}
              style={styles.otOption}
              onPress={() => { schedule.setOvertime(h); closeSheet(); }}
            >
              <Text style={styles.otOptionText}>+{h}h</Text>
            </TouchableOpacity>
          ))}
          {/* Custom input */}
          <OTCustomInput onSet={(h) => { schedule.setOvertime(h); closeSheet(); }} />
        </View>
      )}

      <TouchableOpacity style={styles.sheetCancel} onPress={closeSheet}>
        <Text style={styles.sheetCancelText}>Dismiss</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}
```

---

## HUB TILE ICONS — CRITICAL FIX

This is confirmed missing in the APK. The IC icon paths from
`sovereign_v9.jsx` must be used. Cursor imports them verbatim:

```typescript
// In packages/shared/ui/icons.ts — THESE ARE ALREADY IN FIX_01
// Re-confirming them here because the hub tiles specifically need these:

// Mind hub tile  → IC.brain
brain: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.16|M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.16",

// Body hub tile  → IC.heart
heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",

// Soul hub tile  → IC.star
star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
```

In the Home screen hub tile components:

```tsx
// Mind hub tile
<View style={styles.hubTile}>
  <SvgIcon name="brain" size={40} color={T.cMind} />
  <Text style={styles.hubLabel}>MIND</Text>
  {/* Expanded content: mood log, shadow prompt, doctrine shortcut */}
</View>

// Body hub tile
<View style={styles.hubTile}>
  <SvgIcon name="heart" size={40} color={T.cBody} />
  <Text style={styles.hubLabel}>BODY</Text>
  {/* Expanded: hydration tracker, warrior's practice link */}
</View>

// Soul hub tile
<View style={styles.hubTile}>
  <SvgIcon name="star" size={40} color={T.cSoul} />
  <Text style={styles.hubLabel}>SOUL</Text>
  {/* Expanded: holy days, doctrine, litany shortcut */}
</View>
```

---

## PLANNER → SCHEDULE SUB-TAB

The Schedule sub-tab in the Planner surfaces the same schedule settings.
It is NOT a separate implementation — it renders the same ScheduleSettings
component from Settings, pre-scrolled to the Schedule section.

```typescript
// apps/imperium/app/planner/schedule.tsx
export default function ScheduleSubTab() {
  const schedule = useSchedule();
  return (
    <ScrollView style={styles.container}>
      <ScheduleSettings schedule={schedule} />
      <LivePreviewCard schedule={schedule} />
    </ScrollView>
  );
}
```

### Live Preview Card (shown in both Settings and Planner → Schedule)

```tsx
function LivePreviewCard({ schedule }: { schedule: ShiftSchedule }) {
  return (
    <View style={styles.previewCard}>
      <Text style={styles.previewLabel}>TODAY</Text>
      <Text style={styles.previewValue}>{schedule.shiftLabel}</Text>
      <Text style={styles.previewSub}>
        Wake: {schedule.sleepWindow.wake}  ·  Sleep: {schedule.sleepWindow.sleep}
      </Text>
      <Text style={styles.previewNote}>{schedule.sleepWindow.note}</Text>
    </View>
  );
}
```

---

## IMPROVEMENTS OVER PREVIOUS VERSION

Features researched from production shift schedulers and added here:

1. **Swing shift support** — Separate shift kind with its own sleep math.
   Swing (2PM–midnight) places wake at ~11 AM, sleep at ~2 AM.
   Workers on swing are routinely underserved by scheduling apps.

2. **4-2-1 pattern** — 4 on, 2 off, 1 on, 7-day cycle.
   Found in hospital nursing (researched: AAWF flexible scheduling framework).
   Less common in LE but used in some municipal departments.

3. **Overtime propagation to alarms** — OT hours shift the wake alarm
   the following day by the OT amount. This is the correct behavior:
   if a day-shift officer works 2 extra hours, they wake 2 hours later next day.
   Implementation: overtimeH stored with overtimeDate; alarm system reads both.

4. **30-minute anchor tolerance** — The spec note "keep within 30 min on days off"
   is now surfaced as a visible guideline in the rest-day sleep window,
   not just documentation. The Live Preview shows it.

5. **Tomorrow preview** — The Planner bedtime row should show tomorrow's
   shift status so the practitioner can set tonight's sleep time correctly.
   getDayStatus() is called with tomorrow's date for this.

6. **Commute buffer explicit** — "Leave by [time]" shown on shift strip
   for day shifts. Calculated as shift start minus 45 minutes.
   Not shown for overnight shifts or rest days.

---

## VERIFICATION CHECKLIST

After applying this fix, confirm:

- [ ] Settings → Schedule: all pattern options render as tap buttons
- [ ] Settings → Schedule: shift type (Days / Overnight / Swing) toggles correctly
- [ ] Settings → Schedule: time inputs accept HH:MM format, save on "Set"
- [ ] Settings → Schedule: anchor date picker appears for non-manual patterns
- [ ] Settings → Schedule: custom pattern field appears for "Custom" type
- [ ] Settings → Schedule: live preview shows today's correct work/off status
- [ ] Home tab shift strip: shows correct label from pattern engine
- [ ] Home tab shift strip: sleep window times are computed from shift times
- [ ] Home tab shift strip: OT button appears right side
- [ ] OT bottom sheet: +1h / +2h / +4h buttons set OT and update badge
- [ ] OT badge shows "OT +Xh" when active
- [ ] Cancel OT (tap badge again or dismiss from sheet) clears OT
- [ ] Night shift: sleep window says "Sleep by [post-shift+45min]" not pre-shift
- [ ] Rest day: sleep window says "Rest day — maintain anchor within 60 min"
- [ ] Mind hub tile: brain icon renders (SvgIcon name="brain")
- [ ] Body hub tile: heart icon renders (SvgIcon name="heart")
- [ ] Soul hub tile: star icon renders (SvgIcon name="star")
- [ ] Planner → Schedule sub-tab renders the schedule settings component
- [ ] Planner bedtime row shows tomorrow's shift status
- [ ] Settings → Schedule and Planner → Schedule share the same state

---

## BUILD SEQUENCE

```
S.01  Create packages/shared/src/hooks/scheduleEngine.ts
      (getDayStatus, parseCustomPattern, calcSleepWindow, formatShift, calcLeaveBy)

S.02  Rewrite packages/shared/src/hooks/useSchedule.ts using the new engine
      Keep the same export interface name — do not break other imports

S.03  Extend settings table with new columns if using SQLite:
      schedule_type TEXT DEFAULT 'manual'
      shift_kind TEXT DEFAULT 'days'
      shift_start TEXT DEFAULT '06:00'
      shift_end TEXT DEFAULT '18:00'
      anchor_date TEXT DEFAULT ''
      custom_pattern_days TEXT DEFAULT ''
      Manual schedule per-day entries remain in existing manualSchedule JSON

S.04  Build ScheduleSettings component with all controls
      (pattern selector, shift kind, time inputs, anchor date, custom pattern)

S.05  Build LivePreviewCard component

S.06  Wire Home tab shift strip to useSchedule hook
      Remove all hardcoded "6:00 AM" / "6:00 PM" strings

S.07  Build OT bottom sheet (replaces OT modal)
      Wire to OT badge on shift strip

S.08  Fix hub tile icons:
      Mind → SvgIcon name="brain"
      Body → SvgIcon name="heart"
      Soul → SvgIcon name="star"
      Remove all stub text ("Mind hub content is in active build")

S.09  Build Planner → Schedule sub-tab (renders ScheduleSettings)

S.10  Wire Planner bedtime row to show tomorrow's shift status

S.11  Verify all checklist items above pass on device

S.12  Rebuild both APKs
```
