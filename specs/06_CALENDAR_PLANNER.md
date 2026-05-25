# CALENDAR & DAILY PLANNER

---

## PLANNER TAB — THREE SUB-VIEWS

```
[TODAY]  [CALENDAR]  [SHIFTS]
```

---

## TODAY VIEW

This is the default view when the Planner tab opens.

```
┌─────────────────────────────────────────────┐
│  WEDNESDAY, JANUARY 14                      │
│  G: OFF DUTY   H: NIGHT — 7P–7A            │  ← shift header
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Power from within cannot be revoked.    │   │  ← morning declaration card
│  │  for permission.                    │   │     Gold accent, swipe down to dismiss
│  └─────────────────────────────────────┘   │     Only shows until dismissed
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  "The amateur waits for inspiration.│   │  ← daily quote card
│  │   The professional gets to work."   │   │     Type-specific
│  │  — Steven Pressfield                │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ─── SLEEP WINDOW ──────────────────────   │
│  Tonight: Wind down 9PM · Sleep 10:30PM    │
│  Tomorrow: OFF — recovery day              │
│                                             │
│  ─── TODAY'S PLAN ──────────────────────   │
│                                             │
│  9:00 AM   ● Breakfast                     │  ← tappable → meal card
│            Overnight Oats with Berries     │
│                                             │
│  12:00 PM  ● Midday anchor         🔔      │  ← alarm indicator
│                                             │
│  1:00 PM   ● Lunch                         │
│            Turkey & Avocado Wrap           │
│                                             │
│  3:00 PM   ◎ Doctor appointment            │  ← shared event (rose-gold dot if from Holli)
│                                             │
│  6:30 PM   ● Dinner                        │
│            Sheet Pan Chicken               │
│                                             │
│  9:30 PM   ● Wind down. No new decisions. 🔔│
│                                             │
│  ─── HYDRATION ─────────────────────────   │
│  64 / 100 oz     ████████░░░░  [+ 8oz]    │  ← tap + to log
│                                             │
└─────────────────────────────────────────────┘
```

---

## CALENDAR VIEW

Monthly grid. Tap any date to open that day's Today view.

```
Color coding:
■ Gold/Rose      = On-duty (shifts)
■ Accent         = Events (shared)
■ Muted dot      = Private event (device only)
● Hollow circle  = Holy day marker (auto)
✓ Checkmark      = Planner completion (all items done)
```

Long-press any date → "Add Event" sheet.

---

## ADD EVENT SHEET

```
ADD EVENT — [selected date]

Title          [________________________]

All Day        [toggle]

Start Time     [time picker]
End Time       [time picker]

Type           [Personal | Shared | Appointment | Couple Activity]

Alarm          [None | At time | 15 min before | 30 min before | 1 hr before | custom]

Notes          [________________________]

Visibility
  ◉ Just me     (stored on device only)
  ○ Both of us  (goes to Firebase — appears in both planners)

[Cancel]    [Add Event →]
```

---

## EVENT DISPLAY RULES

```typescript
// In Garrin's planner:
const getEventDot = (event: CalendarEvent, myProfile: 'imperium') => {
  if (event.addedBy === 'tending' && event.visibility === 'shared') {
    return { color: '#C47878', label: '(from Holli)' }; // rose dot
  }
  return { color: '#B8962E', label: null }; // gold dot, no label
};
```

---

## RECURRING EVENTS

```typescript
type RecurrenceRule =
  | 'none'
  | 'daily'
  | 'weekdays'                // Mon-Fri
  | 'weekends'
  | 'weekly'                  // same day each week
  | 'biweekly'
  | 'monthly'                 // same date each month
  | 'custom_days';            // user picks specific days

interface RecurrenceConfig {
  rule: RecurrenceRule;
  customDays?: number[];      // 0=Sun, 1=Mon, ... 6=Sat
  endDate?: string;           // optional end, otherwise indefinite
}
```

---

## PLANNER ITEMS FROM OTHER SYSTEMS

The planner automatically pulls in items from other tabs. These are display-only — they cannot be edited from the planner, only from their source tab.

| Source | Appears as | Tappable action |
|--------|-----------|-----------------|
| Meal plan | "Breakfast / Lunch / Dinner" time slot | Expands inline — see below |
| Shift schedule | On-duty time block | Opens shift detail |
| Sleep window | Sleep/wake indicators | Opens sleep optimizer |
| Default alarms | Alarm time labels | Opens alarm detail |
| Hydration target | Hydration row | Opens hydration tracker |

---

## MEAL CARDS ON THE PLANNER — EXPANDED INLINE VIEW

Tapping a meal slot on the Today planner expands it inline. The planner does not navigate away.

```
TODAY — WEDNESDAY JAN 14

  ─── already visible above (declaration, quote, sleep, breakfast, lunch) ───

6:00 PM   ▼ DINNER                          ← tapped — now expanded
──────────────────────────────────────────────
  Sheet Pan Chicken with Vegetables
  NF · GF · GERD · BATCH · ON-DUTY

  10 min prep · 35 min cook

  ─── INGREDIENTS ─────────────────────────
  Bone-in skin-on chicken thighs  3      [+ Cart]
  Broccoli florets                2 cups [+ Cart]
  Sweet potato, 1-inch cubes      1 lg   [+ Cart]
  Red bell pepper, sliced         1      [+ Cart]
  Zucchini, half-moons            1      [+ Cart]
  Olive oil                       3 tbsp [+ Cart]
  Garlic powder                   1 tsp  [+ Cart]
  Smoked paprika                  1 tsp  [+ Cart]
  Italian seasoning               1 tsp  [+ Cart]
  Salt and black pepper           to taste [+ Cart]

  [+ Add All to Cart]

  ─── METHOD ──────────────────────────────
  Step 1 of 4
  Preheat oven to 425°F. Line a large sheet
  pan with foil or parchment.

  [◀ Prev Step]              [Next Step ▶]

  ─── NUTRITION ───────────────────────────
  430 cal | 36g P | 28g C | 20g F | 7g fiber

  [GBP note — Tending app only]
  2–3 oz deboned chicken. Eat chicken first.

  [▲ Collapse]
──────────────────────────────────────────────
```

**Expand / Collapse behavior:**
- Tap the meal card → it expands in place. The rest of the Today view scrolls below it.
- Tap [▲ Collapse] or tap the meal header again → collapses back to the compact time-slot view.
- Only one meal is expanded at a time. Opening a second collapses the first.
- Steps are shown one at a time with Prev / Next navigation.
- GBP note renders only in the Tending app. Not present in Imperium app.

**[+ Cart] button behavior:**
- Tapping [+ Cart] next to any ingredient adds it to the grocery list immediately.
- Button changes to [✓ In Cart] once added. Does not change back on collapse.
- [+ Add All to Cart] adds every ingredient in the recipe in one tap.
- Duplicates (already in cart) are silently skipped.
- A subtle toast confirms: "Added: Chicken thighs" or "All ingredients added"

**Tonight's prep flag:**
The Dinner card on the planner shows a prep flag if the recipe's `batchNote`
or `prepNote` field contains any of these trigger words:
`thaw`, `marinate`, `slow cooker`, `start by`, `overnight`, `soak`

When a trigger word is present, a warning line appears on the collapsed
meal card — the user sees it without having to expand:

```
6:00 PM   ▶ DINNER — Overnight Chicken Thighs
           ⚠ Start tonight: place chicken in marinade now
```

The flag text is the first sentence of the recipe's prep note — not AI-generated,
not inferred. Pulled directly from the recipe card. If no trigger word is present,
no flag appears. No false positives.

**The planner meal card is the primary way to add to the grocery list during day-to-day use.**
The Nourish tab's plan view is the primary way to add for the week ahead.

