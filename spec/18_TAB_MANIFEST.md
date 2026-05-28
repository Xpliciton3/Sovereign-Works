# 18 — TAB MANIFEST

## TAB BAR

Four tabs. Bottom tab bar. Always visible.

| Position | Icon | Label | Layer |
|----------|------|-------|-------|
| 1 | Home (house) | HOME | L2 |
| 2 | Planner (checklist) | PLANNER | L2 |
| 3 | Leaf/plant | NOURISH | L2 |
| 4 | Hamburger/more | MORE | L2 (stub) |

Icon paths from IC constant in sovereign_v9.jsx — import verbatim.
Tab label: fontSize 7, letterSpacing 0.14em, uppercase, tradition color when active.

## HOME TAB — SCREENS

Home tab has no sub-navigation. Single scroll view:
1. Shift strip (shift type, times, OT badge if active)
2. Daily quote
3. Partner card (mood dots, planner progress, last sync time)
4. Mind hub tile → expandable (Layer 2: stub content)
5. Body hub tile → expandable with hydration tracker
6. Soul hub tile → expandable (Layer 2: stub content)
7. Axiom at bottom

## PLANNER TAB — SUB-TABS

Three sub-tabs (tab strip at top of Planner):
- Today (L2 — full implementation)
- Calendar (L6 — stub in L2)
- Schedule (L6 — stub in L2)

## NOURISH TAB — SUB-TABS

Three sub-tabs:
- Plan (L2 — full implementation)
- Grocery (L2 — full implementation)
- Ceremony (L2 — full implementation)

## MORE TAB — SECTIONS

More tab is a scroll view of sections. No sub-navigation.

| Section | Layer | L2 state |
|---------|-------|----------|
| Settings | L2 | Full |
| Alarms | L3 | Stub (button links to Settings) |
| Household | L4 | Partial (invite screen only) |
| Warrior's Practice / Keeper's Practice | L5 | Stub (text placeholder) |
| Vel'nar / Nen'thara | L5 | Stub |
| The Book | L5 | Stub |
| Sync status | L4 | Full |
| About | L2 | Full (version, tradition name) |

## MODALS (not tabs — overlay full screen)

| Modal | Trigger | Layer |
|-------|---------|-------|
| Mood | Home partner card or Planner mood item | L2 |
| Overtime | Shift strip OT button | L2 |
| Alarm setup | Planner bedtime Set Alarm button | L3 (stub in L2) |
| Household join | More → Household | L4 |

## STUB STATE FOR L2

Stub screens show:
- Tradition sigil (40px, centered)
- Section name in display font
- "Coming in a future layer." in muted text
- No error, no crash, no blank screen

Every stub is a real screen that launches and displays correctly.
