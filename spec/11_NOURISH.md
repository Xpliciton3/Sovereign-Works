# 11 — NOURISH TAB

## THREE SUB-TABS

Plan | Grocery | Ceremony

## PLAN SUB-TAB

Displays WEEK_PLAN as 4 collapsible weeks.
Each week expands to 7 days.
Each day expands to 3 meal slots (Breakfast / Lunch / Dinner).
Each meal slot shows: tags, macro strip, ingredient list with + Cart per item,
+ Add All to Cart button, numbered cooking steps.
"Add All Week N" button at top of each expanded week.

Dietary filters (from useSchedule/useDiet settings):
- nutAllergy: hard filter — hides meals missing NF tag
- gerd: hard filter
- glutenFree: hard filter
- dairyFree: hard filter
- Blocked meal (fails filter): show warning indicator, not removed silently

Week plan source: WEEK_PLAN constant from sovereign_v9.jsx — import verbatim.
Recipe data source: RECIPES constant from sovereign_v9.jsx — import verbatim.

## GROCERY SUB-TAB

Grouped by category in CATEGORY_ORDER:
produce, protein, dairy, grains, pantry, spice, beverage, ceremony

Each category: colored dot header, items list.
Each item: checkbox, name, amount (×2 if count > 1), × remove.
Checked items: collapse to "In Basket" section at bottom, strike-through, dim.
Clear Checked button: appears when ≥1 item checked.

Cart is shared between both phones via Firebase.
"Added by" dot: Imperium color dot or Tending color dot next to item.
Ceremony items: show where-to-find text below item name.

## CEREMONY SUB-TAB

Lists CEREMONY_SUPPLIES entries from sovereign_v9.jsx.
Groups by ceremony name.
Each entry: item name, amount, where-to-find.
Tea protocols: show prep instructions in gold-bordered block.
"+ Add to Cart" button per item adds to grocery cart with unit:'ceremony'.

## DATA FLOW

Cart state: useCart hook.
Local persistence: SQLite grocery table.
Sync: Firebase households/{id}/grocery/currentList/ (real-time listener).
