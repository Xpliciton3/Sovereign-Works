# FIX 03 — WORK SCHEDULER / SHIFT STRIP
# This should have been built in Layer 2. It was missed.
# Fix before proceeding to Layer 3.

---

## WHAT IS MISSING

The shift strip on the Home tab is either blank, showing wrong data,
or not wired to an actual 2-2-3 schedule calculation.

The following must all work after this fix:
- User sets their shift pattern in Settings → Schedule
- Home tab shift strip shows: shift type, start/end time, work/off status
- On work days: shift strip shows "DAY SHIFT 6A–6P" or "NIGHT SHIFT 6P–6A"
- On off days: shift strip shows "OFF TODAY"
- Bedtime row in Planner shows sleep window calculated from that day's shift
- Overtime button in shift strip works (+1h/+2h/+4h), OT badge appears
- Overtime affects next-day wake alarm calculation (Layer 3 will use this)

---

## THE 2-2-3 PATTERN

Garrin's rotation. Starts from a user-set anchor date in Settings.

```
Week A: Work Mon/Tue — Off Wed/Thu — Work Fri/Sat/Sun
Week B: Off Mon/Tue  — Work Wed/Thu — Off Fri/Sat/Sun
Repeat
```

Two shift types (user selects which they are currently on):
- Day shift:   06:00 – 18:00
- Night shift: 18:00 – 06:00

---

## IMPLEMENTATION

### packages/shared/hooks/useSchedule.ts

```typescript
import { useState, useEffect } from 'react';
import { getSetting, saveSetting } from '../db/settings';

export type ShiftType = 'day' | 'night';

export interface ShiftSchedule {
  isWorkDay: boolean;
  shiftType: ShiftType;
  shiftStart: string;   // "06:00" or "18:00"
  shiftEnd:   string;   // "18:00" or "06:00"
  shiftLabel: string;   // "DAY SHIFT 6A–6P" | "NIGHT SHIFT 6P–6A" | "OFF TODAY"
  sleepWindow: {
    windDown: string;   // "9:30 PM"
    sleep:    string;   // "10:30 PM"
    wake:     string;   // "5:00 AM"
    note:     string;
  };
  overtimeH:    number;       // 0 if none active
  overtimeDate: string | null; // ISO date string for OT day
}

// 2-2-3 pattern: true = work, false = off
// Cycle of 14 days starting from anchor date (Sunday of week A)
const PATTERN_14 = [
  true,  true,  false, false, true,  true,  true,   // Week A: M T W Th F Sa Su
  false, false, true,  true,  false, false, false,  // Week B: M T W Th F Sa Su
];

function isWorkDay(anchorDate: Date, checkDate: Date): boolean {
  const msPerDay = 86400000;
  // Align to Monday of anchor week
  const anchorMonday = new Date(anchorDate);
  const dayOfWeek = anchorDate.getDay(); // 0=Sun
  anchorMonday.setDate(anchorDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  anchorMonday.setHours(0, 0, 0, 0);

  const checkMidnight = new Date(checkDate);
  checkMidnight.setHours(0, 0, 0, 0);

  const diffDays = Math.round((checkMidnight.getTime() - anchorMonday.getTime()) / msPerDay);
  const patternIndex = ((diffDays % 14) + 14) % 14;
  return PATTERN_14[patternIndex];
}

function calcSleepWindow(shiftType: ShiftType, isWork: boolean) {
  if (!isWork) {
    return { windDown: '9:30 PM', sleep: '10:30 PM', wake: '6:30 AM', note: 'Rest day' };
  }
  if (shiftType === 'day') {
    // Wake at 5:00 AM (1hr before 6AM + 45min commute buffer)
    return { windDown: '9:00 PM', sleep: '9:30 PM', wake: '5:00 AM', note: 'Pre-shift — full 8 hours' };
  }
  // Night shift: off at 6AM, sleep by 7AM, wake 3PM
  return { windDown: '6:30 AM', sleep: '7:00 AM', wake: '3:00 PM', note: 'Night shift — darken the room' };
}

export function useSchedule(): ShiftSchedule & {
  setShiftType: (t: ShiftType) => void;
  setAnchorDate: (d: string) => void;
  setOvertime: (h: number) => void;
  cancelOvertime: () => void;
} {
  const [shiftType,   setShiftTypeState]   = useState<ShiftType>('day');
  const [anchorDate,  setAnchorDateState]  = useState<string>('');
  const [overtimeH,   setOvertimeH]        = useState(0);
  const [overtimeDate,setOvertimeDateStr]  = useState<string | null>(null);

  // Load from SQLite on mount
  useEffect(() => {
    (async () => {
      const st  = await getSetting('shiftType');
      const ad  = await getSetting('anchorDate');
      const oth = await getSetting('overtimeH');
      const otd = await getSetting('overtimeDate');
      if (st)  setShiftTypeState(st as ShiftType);
      if (ad)  setAnchorDateState(ad);
      if (oth) setOvertimeH(parseInt(oth));
      if (otd) setOvertimeDateStr(otd);
    })();
  }, []);

  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);

  const anchor  = anchorDate ? new Date(anchorDate) : new Date('2024-01-01');
  const workDay = isWorkDay(anchor, today);
  const sleep   = calcSleepWindow(shiftType, workDay);

  // OT adjusts wake on the OT day only
  const otActive = overtimeH > 0 && overtimeDate === todayISO;
  const adjustedWake = otActive
    ? adjustTimeByHours(sleep.wake, overtimeH)
    : sleep.wake;

  const shiftLabel = !workDay
    ? 'OFF TODAY'
    : shiftType === 'day'
    ? 'DAY SHIFT  6A – 6P'
    : 'NIGHT SHIFT  6P – 6A';

  return {
    isWorkDay:   workDay,
    shiftType,
    shiftStart:  shiftType === 'day' ? '06:00' : '18:00',
    shiftEnd:    shiftType === 'day' ? '18:00' : '06:00',
    shiftLabel,
    sleepWindow: { ...sleep, wake: adjustedWake },
    overtimeH:   otActive ? overtimeH : 0,
    overtimeDate,

    setShiftType: async (t) => {
      setShiftTypeState(t);
      await saveSetting('shiftType', t);
    },
    setAnchorDate: async (d) => {
      setAnchorDateState(d);
      await saveSetting('anchorDate', d);
    },
    setOvertime: async (h) => {
      setOvertimeH(h);
      setOvertimeDateStr(todayISO);
      await saveSetting('overtimeH', String(h));
      await saveSetting('overtimeDate', todayISO);
    },
    cancelOvertime: async () => {
      setOvertimeH(0);
      setOvertimeDateStr(null);
      await saveSetting('overtimeH', '0');
      await saveSetting('overtimeDate', '');
    },
  };
}

function adjustTimeByHours(timeStr: string, hours: number): string {
  // timeStr: "5:00 AM", "9:30 PM", etc.
  const [time, ampm] = timeStr.split(' ');
  const [h, m] = time.split(':').map(Number);
  let total = (h % 12) + (ampm === 'PM' ? 12 : 0) + hours;
  total = total % 24;
  const newAmpm = total >= 12 ? 'PM' : 'AM';
  const newH    = total % 12 || 12;
  return `${newH}:${String(m).padStart(2, '0')} ${newAmpm}`;
}
```

---

## SETTINGS — SCHEDULE SECTION

In Settings → Schedule, the user must be able to set:

1. **Shift type:** Day or Night (two-button toggle)
2. **Pattern start date:** Date picker. Label: "First Monday of your current work cycle."
   Helper text: "Set this to the Monday of a week where you work Mon and Tue."

```typescript
// In Settings screen, Schedule section:

<Text style={styles.sectionHeader}>SCHEDULE</Text>

{/* Shift type */}
<Text style={styles.label}>Shift Type</Text>
<View style={styles.toggleRow}>
  <TouchableOpacity
    style={[styles.toggleBtn, shiftType === 'day' && styles.toggleActive]}
    onPress={() => schedule.setShiftType('day')}
  >
    <Text>Day  6A – 6P</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.toggleBtn, shiftType === 'night' && styles.toggleActive]}
    onPress={() => schedule.setShiftType('night')}
  >
    <Text>Night  6P – 6A</Text>
  </TouchableOpacity>
</View>

{/* Anchor date */}
<Text style={styles.label}>Pattern Start Date</Text>
<Text style={styles.helper}>
  Set this to the Monday of a week where you work Monday and Tuesday.
</Text>
<DatePicker
  value={anchorDate}
  onChange={schedule.setAnchorDate}
/>

{/* Live preview */}
<View style={styles.previewCard}>
  <Text style={styles.previewLabel}>TODAY</Text>
  <Text style={styles.previewValue}>{schedule.shiftLabel}</Text>
  <Text style={styles.previewSub}>
    Wake: {schedule.sleepWindow.wake}  ·  Sleep: {schedule.sleepWindow.sleep}
  </Text>
</View>
```

---

## SHIFT STRIP — HOME TAB

The shift strip must match `sovereign_v9.jsx` exactly. Reference the prototype.

Key elements:
- Tradition color left border or dot
- Shift label text (all caps, letter-spaced)
- Sleep window: "WAKE 5:00 AM · SLEEP 9:30 PM"
- OT button: small, right side — opens overtime modal
- OT badge when active: "OT +2h" in gold/rose
- On off days: "OFF TODAY" with rest-day note

```typescript
// Overtime modal — three quick buttons + custom input:
// +1h | +2h | +4h | Custom
// On select: schedule.setOvertime(hours)
// Cancel OT: schedule.cancelOvertime()
```

---

## VERIFICATION CHECKLIST

- [ ] Settings → Schedule: shift type toggle saves and persists across app restart
- [ ] Settings → Schedule: anchor date picker saves and persists
- [ ] Settings → Schedule: live preview shows correct work/off for today
- [ ] Home tab shift strip: shows correct label for today
- [ ] Home tab shift strip: shows correct wake/sleep times
- [ ] Home tab shift strip: OT button opens overtime modal
- [ ] Overtime modal: +1h/+2h/+4h buttons work
- [ ] OT badge appears in shift strip after setting overtime
- [ ] Cancel OT returns to original schedule
- [ ] Off day shows "OFF TODAY" correctly
- [ ] Planner bedtime row shows sleep window from schedule

---

## AFTER COMPLETING THIS FIX

Build both APKs, push to GitHub:

```bash
git add -A
git commit -m "Fix 03 — work scheduler, shift strip, 2-2-3 pattern"
git push origin main
```

Tell Garrin:
- "Fix 03 complete."
- "Go to Settings → Schedule, set your shift type and pattern start date."
- "Home tab shift strip should show your work/off status and sleep window."
- "APKs: [filenames]"
- "Test and confirm before Layer 3."
