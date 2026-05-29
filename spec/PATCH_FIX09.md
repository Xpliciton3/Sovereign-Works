# PATCH — FIX_09_GROQ_SHIFT_PLANNER CORRECTION
# Resolves: C-18 (Groq sleep window supersedes static, C-06 alarm suppression)

## ADDITION 1 — SUPERSEDES STATIC SLEEP WINDOW

Add this note to the top of FIX_09_GROQ_SHIFT_PLANNER.md:

```
# ══════════════════════════════════════════════════════════════════
# SLEEP WINDOW — FIX_09 SUPERSEDES FIX_03 OUTPUT (C-18 resolution)
#
# FIX_09 Groq output replaces the static sleep window from FIX_03's useSchedule()
# as the SOURCE OF TRUTH for planner and alarm timing.
#
# After FIX_09 is complete:
# - planner_schedule.schedule_json contains sleepWindowStart and sleepWindowEnd
# - These are the authoritative sleep times for TODAY
# - The static calcSleepWindow() from FIX_03 is the FALLBACK only
#
# BOTH must exist. FIX_09 output wins when available.
# ══════════════════════════════════════════════════════════════════
```

## ADDITION 2 — ALARM SUPPRESSION HOOKUP

After step G.07 in the build sequence (wire alarm creation to items with alarm:true),
add step G.07a:

```
G.07a  Wire shift suppression to wind-down and sleep alarm scheduling.
       Before scheduling winddown/sleep alarms, call isAlarmSuppressed()
       from 07_ALARM_SYSTEM_FIXED.md.
       If suppressed, use the Groq sleepWindowStart as the alarm fire time
       instead of the pre-shift estimate.
       (This prevents a night shift practitioner from getting a sleep alarm
        at 9 PM when their shift starts at 6 PM.)
```

Everything else in FIX_09 is correct. No other changes.
