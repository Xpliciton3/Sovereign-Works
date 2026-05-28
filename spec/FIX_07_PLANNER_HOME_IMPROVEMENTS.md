# FIX 07 — PLANNER EXPANSION + HOME TAB DEPTH + RECOMMENDED IMPROVEMENTS
# Apply after Fixes 01–06.

---

## PLANNER — SECONDARY TABS (revised)

```
Today | Calendar | Alarms | Reminders | Schedule
```

### Today (already built)
Daily checklist — declaration, meals, hydration, bedtime, practice items.

### Calendar
Monthly view with shift overlay. Shared household events. Holy days auto-marked.
Layer 2: stub. Full implementation Layer 6.

### Alarms
All alarm configuration lives here. Not buried in Settings.

Secondary sections within Alarms screen:
- **Wake alarm** — time shown, toggle ON/OFF, edit time
- **Wind-down alarm** — 60 min before sleep, toggle
- **Sleep alarm** — tradition-register label, toggle
- **Hydration reminders** — interval selector (60/90/120 min), toggle, active hours
- **Batch cook reminder** — fires 7 PM night before batch day, toggle
- **Overtime** — set OT hours for tomorrow, badge shows on Home shift strip

Each alarm row shows:
- Label (from ALARM_LABELS in 07_ALARM_SYSTEM.md — import verbatim)
- Time
- Days active (work only / every day / custom)
- Toggle

Layer 2: full UI built, native alarm wiring is Layer 3.
Show "Alarm system activates after next update" banner in Layer 2.

### Reminders
Custom one-off reminders the user can add.
Each reminder: label (free text), date/time, repeat options (none/daily/weekly).
Tradition-register suggested labels from ALARM_LABELS — user can edit.
Layer 2: stub. Full Layer 3.

### Schedule
2-2-3 pattern configuration — shift type (Day/Night), anchor date picker.
Live preview showing today's work/off status and sleep window.
This is the same Settings > Schedule content that Fix 03 builds — surface it here
as the primary location. Settings > Schedule can link here instead.

---

## HOME TAB — EXPANDED

### Current Home layout (prototype)
1. Shift strip
2. Quote
3. Partner card
4. Mind / Body / Soul hub tiles
5. Axiom

### Revised Home layout

```
1. Shift strip (work/off, times, OT badge, next alarm time)
2. Daily quote
3. QUICK ACTIONS strip
4. SOVEREIGNTY SCORE (Imperium) / RESERVOIR LEVEL (Tending)
5. Partner card
6. STREAK RACK
7. Mind / Body / Soul hub tiles
8. BATCH COOK BANNER (conditional)
9. Axiom
```

---

### QUICK ACTIONS strip

A horizontal row of tap targets for the most frequent single-tap actions.
No navigation required — fires inline.

```typescript
// Imperium quick actions
const QUICK_IMP = [
  { id: 'water',  icon: 'drop',  label: '+8oz',     action: () => logOz(8)             },
  { id: 'mood',   icon: 'heart', label: 'Mood',      action: () => openMoodModal()      },
  { id: 'done',   icon: 'check', label: 'Done',      action: () => markNextItem()       },
  { id: 'batch',  icon: 'leaf',  label: 'Groceries', action: () => goToGroceryList()    },
];

// Tending quick actions
const QUICK_TEND = [
  { id: 'water',  icon: 'drop',  label: '+8oz',      action: () => logOz(8)             },
  { id: 'mood',   icon: 'heart', label: 'Mood',      action: () => openMoodModal()      },
  { id: 'done',   icon: 'check', label: 'Done',       action: () => markNextItem()       },
  { id: 'quiet',  icon: 'star',  label: 'Quiet',     action: () => startQuietTimer()    },
];
```

Style: small pill buttons, tradition color border, 8px padding, horizontal scroll if needed.
"Done" marks the next unchecked planner item without opening Planner.

---

### SOVEREIGNTY SCORE (Imperium) / RESERVOIR LEVEL (Tending)

A single visual metric on the Home screen that reflects the day's operational state.
Not a gamification score — a functional readiness signal. No leaderboards, no points.

**Imperium — Sovereignty Score:**
Composite of: planner completion % + hydration % + mood score (if logged) + hours slept.
Displayed as: a single horizontal bar, gold fill, 0–100.
Label: "OPERATIONAL CAPACITY" in micro text above.
No number shown — visual only.
If mood not logged: bar shows dashes. Tap to log mood.

**Tending — Reservoir Level:**
Composite of: planner completion % + hydration % + mood score (if logged) + hours slept.
Displayed as: a vertical vessel shape (simple rectangle with rounded top), rose fill rising from bottom.
Label: "RESERVOIR" in micro text.
Visual metaphor matches the doctrine: the reservoir that must not run dry.

```typescript
function calcScore(
  plannerPct: number,      // 0-1
  hydrationPct: number,    // 0-1
  moodScore: number | null, // 1-10 or null
  hoursSlept: number | null // hours or null
): number | null {
  const components = [plannerPct, hydrationPct];
  if (moodScore !== null) components.push(moodScore / 10);
  if (hoursSlept !== null) components.push(Math.min(hoursSlept / 8, 1));
  if (components.length < 2) return null;
  return components.reduce((a, b) => a + b, 0) / components.length;
}
```

---

### STREAK RACK

A horizontal row of streak counters. Each shows an icon, streak count, and label.
Active streak: tradition color. Broken streak: muted gray.

```typescript
const STREAKS_IMP = [
  { id: 'planner',   icon: 'check', label: 'DAYS COMPLETE'  },
  { id: 'hydration', icon: 'drop',  label: 'HYDRATION'      },
  { id: 'practice',  icon: 'star',  label: "WARRIOR'S"      },
  { id: 'mood',      icon: 'heart', label: 'MOOD LOGGED'    },
];

const STREAKS_TEND = [
  { id: 'planner',   icon: 'check', label: 'DAYS COMPLETE'  },
  { id: 'hydration', icon: 'drop',  label: 'HYDRATION'      },
  { id: 'practice',  icon: 'star',  label: "KEEPER'S"       },
  { id: 'quiet',     icon: 'brain', label: 'MORNING QUIET'  },
];
```

Streak logic:
- Planner streak: consecutive days where all Today items were checked
- Hydration streak: consecutive days where goalOz was reached
- Practice streak: consecutive days where a practice session was logged (SQLite)
- Mood streak: consecutive days where mood was logged

Stored in SQLite streak_log table:
```sql
CREATE TABLE IF NOT EXISTS streak_log (
  id TEXT PRIMARY KEY,
  streak_type TEXT,     -- 'planner','hydration','practice','mood','quiet'
  profile TEXT,         -- 'IMP' | 'TEND'
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_logged_date TEXT,
  updated_at INTEGER
);
```

Layer 2: full implementation. Streak data persists locally.
Streaks do NOT sync to Firebase — they are personal, not shared.

---

### BATCH COOK BANNER

Appears on the Home screen on any day where tomorrow is a batch cook day.
Shows the dinner name from tomorrow's WEEK_PLAN entry.
Dismissable per day (stores dismissed date in SQLite).

```typescript
// Show when: tomorrow is batch:true in WEEK_PLAN AND not dismissed today
{isBatchCookEve && !batchBannerDismissed && (
  <TouchableOpacity style={styles.batchBanner} onPress={() => goToNourish()}>
    <Text style={styles.batchLabel}>BATCH COOK TOMORROW</Text>
    <Text style={styles.batchMeal}>{tomorrowDinner}</Text>
    <Text style={styles.batchHint}>Prep tonight if marinating.</Text>
  </TouchableOpacity>
)}
```

---

### SHIFT STRIP IMPROVEMENTS

Add to the existing shift strip:
- Next alarm time: "Next alarm: 5:00 AM" in small text below shift label
- Commute reminder: if work day, show "Leave by [wake + 45min]" in micro text
- Tap on shift strip → opens Schedule secondary tab in Planner

---

### PARTNER CARD IMPROVEMENTS

Currently shows: 5 mood dots.
Add below the dots:
- Partner's Groq-translated mood message (if logged today)
- Last sync time: "Synced 4m ago" in micro text
- Planner completion: "X/8 done today" for partner (from Firebase)

---

## RECOMMENDED IMPROVEMENTS NOT YET ADDRESSED

### 1 — Notification dots on primary tabs
When a tab has something requiring attention, show a small dot on the tab icon.
```typescript
// Dot conditions:
// Planner tab: incomplete items for today after 8 PM
// Mind tab:    mood not logged by 6 PM
// Body tab:    hydration goal not met by 8 PM
// Soul tab:    (no automatic dot in Layer 2 — future)
```

### 2 — Home screen widget (Android)
Already in Layer 5 spec. Confirm it shows:
- Today's planner completion count
- Hydration %
- Current streak (longest active)
- One-tap to open app to Planner Today

### 3 — Tending: Morning Quiet timer
When user taps Morning Quiet in Soul tab or quick action:
A simple countdown timer — 15 minutes, tradition color ring depleting.
No audio. No guided content. Just time and silence.
Completion marks the Morning Quiet planner item as done.
Built in Layer 2 as a simple timer screen.

### 4 — Imperium: Midday Anchor prompt
When user taps the Midday Anchor planner item at lunch:
Brief full-screen prompt — the midday anchor text from MASTER_IMPERIUM.md.
"Acknowledged" button marks it done and returns to Planner.
Content imported verbatim — Cursor does not write it.

### 5 — Overtime flow from Home
The OT badge on the shift strip should be a single tap to set/cancel overtime.
Currently it requires opening a modal. Instead:
- Tap OT badge when no OT → opens a bottom sheet with +1h / +2h / +4h
- Tap OT badge when OT active → single tap cancels, badge disappears
Faster. The user is often in a squad car or hallway when setting this.

### 6 — Grocery cart badge on Body tab
When items are in the grocery cart, show a count badge on the Body tab icon.
Matches how most shopping apps work — visible at a glance.

### 7 — Sleep score on Home (future Layer 5+)
After watch integration (Layer 9), the shift strip could show last night's sleep duration
pulled from the watch sync. For now, the Sleep secondary tab in Body is sufficient.

---

## WHAT CURSOR BUILDS IN LAYER 2 FROM THIS FIX

| Item | Layer 2 state |
|------|--------------|
| Planner secondary tabs (Today/Calendar/Alarms/Reminders/Schedule) | Today + Alarms UI full; others stub |
| Quick Actions strip | Full |
| Sovereignty Score / Reservoir Level | Full |
| Streak Rack + SQLite streak_log | Full |
| Batch Cook Banner | Full |
| Shift strip next alarm + commute | Full |
| Partner card Groq translation + planner count | Full |
| Notification dots on tabs | Full |
| Morning Quiet timer (Tending) | Full |
| Midday Anchor prompt (Imperium) | Full |
| Overtime bottom sheet | Full |
| Grocery cart badge on Body tab | Full |
