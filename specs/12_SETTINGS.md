# SETTINGS SCREEN

Same structure for both apps. Content differs per profile.

---

## SETTINGS NAVIGATION

Accessible from More tab → Settings (gear icon).

```
SETTINGS

─── YOUR SCHEDULE ──────────────────────────────
Work Schedule              [Edit →]
Sleep Preferences          [Edit →]

─── ALARMS & REMINDERS ──────────────────────────
My Alarms                  [Manage →]
Hydration Reminders        [On / Off toggle]
Meal Reminders             [On / Off toggle]
Supplement Reminders       [On / Off toggle]

─── PROFILE ────────────────────────────────────
Your Name                  Garrin
Your Tradition             The Imperium
Hydration Target           100 oz  [Edit]

─── HOUSEHOLD ──────────────────────────────────
Household Name             The Bane Household
Partner                    Holli (The Tending)
Household Connected        ✓

─── APP ─────────────────────────────────────────
App Version                1.0.0
Rebuild Quote Bank         [Refresh →]
Clear All Data             [⚠ Reset App →]
```

---

## WORK SCHEDULE SETTINGS

```
WORK SCHEDULE

Schedule Type:
  [Dropdown — all schedule types]

Shift Length:
  [8hr]  [10hr]  [12hr]  [Custom]

Shift Start Time:
  [Time picker]

Night Shift (shift crosses midnight):
  [Toggle]

Cycle Start Date:
  [Date picker]

─── PREVIEW ─────────────────────────────────────
[3-week rolling calendar — on-duty days highlighted]

[Save Schedule]

─── OVERTIME ─────────────────────────────────────────────────────
"I'm Working Late" button: [+ 1 Hr] [+ 2 Hrs] [+ 4 Hrs] [Custom]
  → Pushes tonight's evening alarms and sleep window only
  → Stores single-day exception. Tomorrow unchanged.

Overtime Log: [View History →]
  Shows this week and this month. Export as CSV.
```

---

## SLEEP PREFERENCES

```
SLEEP PREFERENCES

Target Sleep Duration:
  [7.0 hrs]  [7.5 hrs]  [8.0 hrs]  [8.5 hrs]  [9.0 hrs]

Sleep Alarms (from sleep optimizer):
  Wake alarm          [toggle: ON]
  Wind-down reminder  [toggle: ON]
  Wind-down time:     [60 min before sleep] [30 min] [custom]

Night Shift Sleep Mode (when on night shift):
  Block screen brightness during day sleep hours  [toggle]
  Do-not-disturb auto-enable during sleep window  [toggle]

[Save Preferences]
```

---

## ALARM SETTINGS

Full alarm management screen — see 07_ALARM_SYSTEM.md for complete spec.

Quick-access toggles in Settings:
- Master alarm on/off (emergency disable — persists across restarts)
- Default alarm times (tap to edit any of the 4 defaults)
- Snooze duration (applies to all alarms unless overridden per-alarm)
- Are-you-awake delay (applies to all alarms unless overridden)

---

## SNOOZE CONFIGURATION

```
SNOOZE SETTINGS

Default Snooze Duration:
  [5 min]  [9 min ●]  [10 min]  [15 min]  [20 min]  [Custom]

Max Snoozes Before Dismiss-Only:
  [1]  [2]  [3 ●]  [Unlimited]

Are You Awake Check:
  Fires after dismiss  [toggle: ON]
  Delay after dismiss:
    [15 min]  [20 min ●]  [30 min]  [Off]
```

---

## HYDRATION TARGET

```
HYDRATION TARGET

Daily Goal:     [100] oz     [← tap to change]

Tracking:
  ◉ oz (ounces)
  ○ ml (milliliters)
  ○ cups

Reminder Settings:
  Remind me every: [60 min]
  Starting at: [7:00 AM]
  Until: [9:00 PM]
  Skip if on target: [toggle: ON]

[Save]
```

---

---

## DIETARY SETTINGS

```
DIETARY SETTINGS

Who has what condition? Mark all that apply.
The meal plan rotation uses only recipes that match every active filter.

─── HARD FILTERS ───────────────────────────────────────────────────
Nut Allergy (one or both people)    [toggle]
  ON: Only nut-free recipes appear. Any recipe without the NF tag
      is excluded from the meal plan and swap list entirely.

GERD (one or both people)           [toggle]
  ON: Only GERD-safe recipes appear.

Gluten-Free (one or both people)    [toggle]
  ON: Only GF and GF* recipes appear. GF* shows a swap note.

Dairy-Free (one or both people)     [toggle]
  ON: Only DF and DF* recipes appear.

─── PRIORITY FILTERS ────────────────────────────────────────────────
These do not exclude recipes. They surface the best-match recipes
first when swapping a meal.

GBP — Gastric Bypass (maintenance)  [toggle]
  ON: GBP★ recipes appear first in every swap list.
      GBP recipes appear second.
      Other eligible recipes appear below.
      GBP notes visible on recipe cards (already shown only in
      Tending app — this setting enables them for any profile
      where GBP is active).

MTHFR                               [toggle]
  ON: MTHFR★ recipes appear first in every swap list.
      MTHFR recipes appear second.
      High-folate options are surfaced before lower-folate ones.

─── SHIFT COOKING ───────────────────────────────────────────────────
Prefer On-Duty recipes on work days [toggle]
  ON: When the shift schedule shows an on-duty day, the plan
      defaults to ON-DUTY tagged recipes (≤20 min active time).
      You can still swap to any eligible recipe.

─────────────────────────────────────────────────────────────────────

Current active filters:
  Nut Allergy: OFF
  GERD: OFF
  GBP: ON  ← (Holli's setting from onboarding)
  MTHFR: ON
  Gluten-Free: OFF
  Dairy-Free: OFF
  On-Duty preference: ON

[Save Dietary Settings]
```

**What happens when settings change:**
- The meal plan immediately re-evaluates. Any day with a now-ineligible
  recipe shows a swap prompt: "This meal doesn't match your current settings.
  Swap it now?" with the best-matching alternatives shown.
- Changing back to a less restrictive setting restores those recipes
  to the swap list. Previously scheduled meals are not auto-changed.


## RESET / CLEAR DATA

```
RESET THIS APP

⚠ This will clear all local data:
   · Mood journal entries
   · Grocery list (current)
   · Hydration log
   · Custom alarm configurations
   · Downloaded quote banks

This will NOT affect:
   · Firebase shared data (calendar, grocery list backup, shift schedule)
   · Your household connection

Type RESET to confirm:
[________________]

[Cancel]     [Reset App →]
```


---

## REPLENISHMENT SESSION SCHEDULER (Tending app only)

Located in Settings → Your Practice → Replenishment Session.
Also accessible by tapping the Replenishment Session item on the planner.

```
REPLENISHMENT SESSION

Once per week. Two hours. Yours.

Schedule it here so it repeats automatically
and appears as protected time on the calendar.

Day of week:
  ○ Monday    ○ Tuesday   ○ Wednesday
  ○ Thursday  ○ Friday    ● Saturday   ○ Sunday

Start time:  [time picker — defaults to 9:00 AM]
Duration:    [  90 min  |  ● 2 hours  |  Custom  ]

Remind me the day before:   [toggle — ON]
Remind me 30 min before:    [toggle — ON]

Mark as protected time:     [toggle — ON]
  When ON: this window shows as unavailable on
  the shared calendar. Garrin sees it blocked.
  He cannot schedule household events over it.

──────────────────────────────────────────────
Saturday · 9:00–11:00 AM · Weekly

[Save Replenishment Session]
[Skip — I'll schedule it manually]
```

**What happens when saved:**
- Creates a recurring calendar event: every Saturday (or chosen day) 9:00–11:00 AM
- Event label: "Replenishment Session — Holli's time"
- Marked as protected — shared calendar shows this window as unavailable
- Reminder fires the evening before: "Your Replenishment Session is tomorrow morning."
- Reminder fires 30 minutes before: "Your session starts in 30 minutes."
- The week it gets moved or missed, the next week's event is unaffected

**Garrin's app:** Shows the window as blocked on the shared calendar.
No label visible to him — just "Unavailable." He knows not to schedule over it.
This was his instruction in the Partner Note: *"Do not schedule things during this
window without asking first. Do not treat it as optional when other demands arise."*

