# TAB MANIFEST — COLOR-CODED BY TAB
# Every tab has a distinct identity color within its tradition's palette.
# This color appears on: tab icon, tab label, tab header bar accent,
# section headers inside the tab, and any cards or UI elements unique to that tab.
# The tradition's primary accent (gold / rose) is the app-wide accent.
# Tab colors are secondary identifiers — they help navigate and orient, not dominate.

---

## IMPERIUM — ALL TABS

| Tab | Color Name | Hex | Phase | Icon |
|-----|-----------|-----|-------|------|
| Planner | Sovereign Gold | #B8962E | 1 | calendar-outline |
| Nourish | Forge Green | #6B8B3A | 1 | leaf-outline |
| Warrior | Blood Iron | #8B3A2A | 2 | — (sword SVG, custom) |
| Doctrine | Deep Slate | #3A4A6B | 3 | book-outline |
| Household | Hearthgold | #8B6B2A | 4 | home-outline |
| Holy Days | Ash Violet | #5A3A6B | 4 | moon-outline |
| Vel'nar | Cold Teal | #2A6B5A | 5 | — (custom glyph SVG) |
| The Book | Iron Indigo | #2A3A6B | 5 | scroll (custom SVG) |
| More | Muted | #444440 | 1 | menu-outline |

---

## TENDING — ALL TABS

| Tab | Color Name | Hex | Phase | Icon |
|-----|-----------|-----|-------|------|
| Planner | Keeper Rose | #C47878 | 1 | calendar-outline |
| Nourish | Harvest Sage | #7A8B6B | 1 | leaf-outline |
| Keep Yourself | Hearthcoral | #C47B5A | 2 | heart-outline |
| Doctrine | Dusty Mauve | #8B6B7A | 3 | book-outline |
| Household | Warm Amber | #B87A5A | 4 | home-outline |
| Holy Days | Dusk Plum | #7A5A7B | 4 | moon-outline |
| The Book | Rose Indigo | #7A5A8B | 5 | scroll (custom SVG) |
| More | Muted | #5A3A3A | 1 | menu-outline |

---

## HOW TAB COLOR IS APPLIED

```typescript
// packages/shared/navigation/tabConfig.ts

export const TAB_CONFIG = {
  imperium: [
    {
      key: 'planner',
      label: 'Planner',
      icon: 'calendar-outline',
      color: '#B8962E',       // Sovereign Gold
      locked: false,
      phase: 1,
    },
    {
      key: 'nourish',
      label: 'Nourish',
      icon: 'leaf-outline',
      color: '#6B8B3A',       // Forge Green
      locked: false,
      phase: 1,
    },
    {
      key: 'warrior',
      label: 'Warrior',
      icon: 'sword',          // custom SVG asset
      color: '#8B3A2A',       // Blood Iron
      locked: true,
      phase: 2,
      lockMessage: 'The Forge opens at Day 7.',
    },
    {
      key: 'doctrine',
      label: 'Doctrine',
      icon: 'book-outline',
      color: '#3A4A6B',       // Deep Slate
      locked: true,
      phase: 3,
      lockMessage: 'Doctrine opens at Day 14.',
    },
    {
      key: 'household',
      label: 'Household',
      icon: 'home-outline',
      color: '#8B6B2A',       // Hearthgold
      locked: true,
      phase: 4,
      lockMessage: 'Household opens at Day 30.',
    },
    {
      key: 'holy_days',
      label: 'Holy Days',
      icon: 'moon-outline',
      color: '#5A3A6B',       // Ash Violet
      locked: true,
      phase: 4,
      lockMessage: 'Holy Days open at Day 30.',
    },
    {
      key: 'velnar',
      label: "Vel'nar",
      icon: 'velnar-glyph',   // custom SVG glyph
      color: '#2A6B5A',       // Cold Teal
      locked: true,
      phase: 5,
      lockMessage: "Vel'nar opens at Gate 4.",
    },
    {
      key: 'book',
      label: 'The Book',
      icon: 'scroll',         // custom SVG
      color: '#2A3A6B',       // Iron Indigo
      locked: true,
      phase: 5,
      lockMessage: 'The Book opens at Gate 4.',
    },
    {
      key: 'more',
      label: 'More',
      icon: 'menu-outline',
      color: '#444440',
      locked: false,
      phase: 1,
    },
  ],

  tending: [
    {
      key: 'planner',
      label: 'Planner',
      icon: 'calendar-outline',
      color: '#C47878',       // Keeper Rose
      locked: false,
      phase: 1,
    },
    {
      key: 'nourish',
      label: 'Nourish',
      icon: 'leaf-outline',
      color: '#7A8B6B',       // Harvest Sage
      locked: false,
      phase: 1,
    },
    {
      key: 'keep',
      label: 'Keep Yourself',
      icon: 'heart-outline',
      color: '#C47B5A',       // Hearthcoral
      locked: true,
      phase: 2,
      lockMessage: 'This opens when your foundation is set.',
    },
    {
      key: 'doctrine',
      label: 'Doctrine',
      icon: 'book-outline',
      color: '#8B6B7A',       // Dusty Mauve
      locked: true,
      phase: 3,
      lockMessage: 'Doctrine opens when practice is stable.',
    },
    {
      key: 'household',
      label: 'Household',
      icon: 'home-outline',
      color: '#B87A5A',       // Warm Amber
      locked: true,
      phase: 4,
      lockMessage: 'Household opens when doctrine is rooted.',
    },
    {
      key: 'holy_days',
      label: 'Holy Days',
      icon: 'moon-outline',
      color: '#7A5A7B',       // Dusk Plum
      locked: true,
      phase: 4,
      lockMessage: 'Holy Days open at Day 30.',
    },
    {
      key: 'book',
      label: 'The Book',
      icon: 'scroll',
      color: '#7A5A8B',       // Rose Indigo
      locked: true,
      phase: 5,
      lockMessage: 'The Book opens at Gate 4.',
    },
    {
      key: 'more',
      label: 'More',
      icon: 'menu-outline',
      color: '#5A3A3A',
      locked: false,
      phase: 1,
    },
  ],
};
```

---

## LOCKED TAB SCREEN — DESIGN

When a user taps a locked tab, they see a full-screen lock state.
The lock screen uses THAT TAB'S color — not the tradition's primary accent.
This makes each locked tab feel distinct and gives the user a preview of its personality.

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│             [Lock icon]                     │
│          in tab's color                     │
│                                             │
│           WARRIOR PRACTICE                  │
│        in tab's color, all caps             │
│                                             │
│    "The Forge opens at Day 7."              │
│     in muted text                           │
│                                             │
│    Days remaining: 4                        │
│    (if gate day is known)                   │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

No button. No navigation. Just the color, the name, and the unlock condition.
The user understands immediately what this space will become.

---

## BUILD-BY-TAB EXPANSION ORDER

This is the sequence for adding tabs after Phase 1 is stable and tested:

```
PHASE 1 — TESTABLE APK
  ✓ Planner tab (both apps)
  ✓ Nourish tab (both apps)
  ✓ More tab (both apps)
  ✓ All other tabs visible but locked

PHASE 2 — TESTABLE APK
  + Warrior tab (Imperium) — fully built
  + Keep Yourself tab (Tending) — fully built
  (All other locked tabs remain locked)

PHASE 3 — TESTABLE APK
  + Doctrine tab (both apps)

PHASE 4 — TESTABLE APK
  + Household tab (both apps)
  + Holy Days tab (both apps)

PHASE 5 — TESTABLE APK
  + Vel'nar tab (Imperium only)
  + The Book tab (both apps)
  + Rite system (lives in Doctrine + Planner, not its own tab)
```

Each phase: one or two tabs added, fully functional, both people test their app.
The app is always working. No phase leaves the app broken.

---

## TAB COLOR USAGE IN UI

Inside each tab, the tab color appears on:
- Tab icon (active state)
- Tab label text (active state)
- Tab screen header accent line (3px border under header)
- Section headers within the tab
- Primary buttons within the tab
- Progress bars and indicators within the tab
- Selected/active states within the tab

The tradition's primary accent (Gold / Rose) appears on:
- Morning declaration card
- Daily quote card
- Alarm screen
- The app icon
- Are You Awake screen CTA button

This separation keeps the app visually organized.
Gold/Rose = identity. Tab color = where you are.

