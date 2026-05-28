# LAYER 6 PRIME PROMPT — SOVEREIGN WORKS
# Calendar, Schedule Sub-Tabs, Push Notifications
# Do not begin until all L5.01–L5.20 checkboxes are confirmed.

## WHAT LAYER 6 BUILDS

Layer 6 scope:
- Planner Calendar sub-tab — monthly view, event entry, shift overlay
- Planner Schedule sub-tab — 2-2-3 pattern display, shift type config
- Firebase push notifications (FCM) — partner mood nudge, household events
- Text-to-calendar event parsing via Groq
- Calendar event creation from natural language voice/text input
- Household calendar (shared events visible on both phones)

Layer 6 does NOT include:
- Charts — Layer 7
- Desktop app — Layer 8
- Watch app — Layer 9

## READ ORDER

1. `05_SHIFT_SCHEDULE.md` — 2-2-3 rotation spec, shift types
2. `02_FIREBASE_SCHEMA.md` — calendar event schema (add events/ path)
3. `sovereign_v9.jsx` — calendar UI, event entry modal

## CALENDAR SPEC

Monthly calendar grid. Tap date → expand event list for that date.
Work days highlighted with tradition color dot.
Events: label, time, type (work/personal/household/holy-day).
Holy days auto-populated from tradition calendar (Layer 5 content).

Text-to-calendar: user types/speaks "dentist Tuesday at 2pm" → Groq parses
→ event created. Cursor does not write the parsing prompt. Uses Groq API.

Shared events: write to households/{id}/calendar/{dateKey}/{eventId}.
Both partners see shared events. Personal events stay local.

## FIREBASE PUSH NOTIFICATIONS

FCM (Firebase Cloud Messaging) for partner nudges.
Triggers:
- Partner logs mood below 3 → your app gets "Check in with [partner]" nudge
- Partner completes all planner items → your app gets "✓ All done today" note
- Household calendar event in next 2 hours → reminder

Privacy rule: push notifications contain no mood scores, no raw data.
Content: tradition-appropriate label only. Cursor imports labels from MASTER docs.

## BUILD SEQUENCE L6

```
L6.01  Calendar sub-tab — monthly grid
L6.02  Shift overlay on calendar (work/off from useSchedule)
L6.03  Event entry — manual
L6.04  Text-to-calendar parsing via Groq
L6.05  Holy days auto-populated
L6.06  Shared household calendar sync (Firebase)
L6.07  Schedule sub-tab — 2-2-3 pattern display
L6.08  Shift type configuration (Day/Night)
L6.09  FCM setup — Firebase push notifications
L6.10  Partner mood nudge notification
L6.11  Planner completion notification
L6.12  Household event reminder notification
L6.13  Mark all L6 checkboxes in 21_BUILD_SEQUENCE.md as [x]
```
