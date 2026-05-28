# LAYER 7 PRIME PROMPT — SOVEREIGN WORKS
# Charts Tab + More Tab Full Implementation
# Do not begin until all L6.01–L6.13 checkboxes are confirmed.

## WHAT LAYER 7 BUILDS

Layer 7 scope:
- Charts tab — full implementation (currently stub)
- Sleep quality charts from alarm_log data
- Hydration trend charts
- Mood trend charts (dot score over time)
- Warrior's/Keeper's Practice session log charts
- More tab: all stub sections filled in
- Rite readiness tracker and progression display
- Streak tracking (planner completion, practice sessions)

## CHART DATA SOURCES

Sleep quality: alarm_log SQLite table (Layer 3) — fired_at, dismissed_type, snooze_count.
Hydration: hydration_log SQLite table — daily totals, 30-day rolling.
Mood: quote_bank/mood_entries — dot score over 30 days.
Practice: new practice_log SQLite table — session date, duration, art, stage.

## CHARTS TAB LAYOUT

Four chart sections, collapsible:
1. Sleep — bar chart, 14 days, color-coded by quality
2. Hydration — line chart, 30 days, goal line overlaid
3. Mood — dot grid (existing), plus 30-day trend line
4. Practice — calendar heat map (GitHub contribution style)

Chart library: recharts (already available in Expo web) or Victory Native.
Colors: tradition gold/rose. Dark backgrounds. No white.

## RITE READINESS

Readiness Engine (from IMPERIUM_APP_SPEC.md — Cursor imports, does not write spec):
- Pre-Rite mode: tracks days of practice, doctrine readings, planner completions
- Readiness % displayed on home screen sigil area
- Rite available when all criteria met
- Post-Rite: permanent unlock, date stamped

## BUILD SEQUENCE L7

```
L7.01  practice_log SQLite table
L7.02  Sleep quality chart (from alarm_log)
L7.03  Hydration trend chart
L7.04  Mood trend line
L7.05  Practice heat map
L7.06  Charts tab layout and navigation
L7.07  Rite readiness tracker
L7.08  More tab: all stubs replaced with real screens
L7.09  Streak tracking display
L7.10  Mark all L7 checkboxes in 21_BUILD_SEQUENCE.md as [x]
```
