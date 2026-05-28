# LAYER 9 PRIME PROMPT — SOVEREIGN WORKS
# Garmin Vivoactive 4 Companion App
# Do not begin until all L8.01–L8.11 checkboxes are confirmed.

## WHAT LAYER 9 BUILDS

Garmin Connect IQ companion app for the Vivoactive 4.
No LTE. Sync architecture: morning USB/Bluetooth sync, not live push.

Layer 9 scope:
- Connect IQ app for Garmin Vivoactive 4
- Standalone watch face with tradition sigil
- Today's planner items on wrist (read-only)
- Hydration log from watch (+8oz tap)
- Mood log from watch (1–5 score via scroll/tap)
- Shift strip on watch face (work/off, time remaining)
- Sleep window countdown on watch face
- Morning sync: phone → watch (planner items, schedule, quote)
- Evening sync: watch → phone (mood, hydration from watch)

## VIVOACTIVE 4 CONSTRAINTS

- No LTE. No live sync. All data transferred via USB or Bluetooth paired connection.
- Sync window: morning (phone pushes to watch) + evening (watch pushes to phone).
- Watch app written in Connect IQ Monkey C language.
- Storage: watch stores today's planner items only (no history).
- Display: 260×260px color touchscreen.

## SYNC ARCHITECTURE

```
MORNING SYNC (app foreground + watch connected):
Phone → Watch:
  - Today's 8 planner items (label + done status)
  - Shift type + start/end time
  - Sleep window times
  - Today's quote (truncated to 80 chars)
  - Hydration goal for today

EVENING SYNC (watch → phone when paired):
Watch → Phone:
  - Mood dot score logged on watch
  - Hydration oz logged on watch
  - Planner items checked on watch
```

## WATCH FACE LAYOUT

```
[Sigil — 40px centered]
[Time — 36px]
[Shift strip — "DAY SHIFT · 4H 22M LEFT" or "OFF TODAY"]
[Planner: X/8 done ■■■□□□□□]
[Hydration: 48oz / 80oz]
```

## CONNECT IQ DEVELOPMENT

Language: Monkey C
SDK: Garmin Connect IQ SDK (free, download from developer.garmin.com)
Target device: Vivoactive 4 (product ID: vivoactive4)
Distribution: sideload via Garmin Express or Connect IQ Store

Cursor writes the Monkey C source for the watch app.
Content (sigil description, labels) imported from MASTER docs or // TODO.

## BUILD SEQUENCE L9

```
L9.01  Connect IQ project scaffold for Vivoactive 4
L9.02  Watch face — sigil, time, shift strip
L9.03  Planner items display (read-only, today only)
L9.04  Planner item check off on watch
L9.05  Hydration tap-to-log on watch
L9.06  Mood dot score input on watch (scroll 1–5)
L9.07  Morning sync: phone → watch (Bluetooth data transfer)
L9.08  Evening sync: watch → phone
L9.09  Watch setup guide in desktop app (Layer 8)
L9.10  Verify: planner shows correctly on physical watch
L9.11  Verify: hydration logged on watch appears in phone app
L9.12  Verify: mood logged on watch appears in phone partner feed
L9.13  Mark all L9 checkboxes in 21_BUILD_SEQUENCE.md as [x]
```
