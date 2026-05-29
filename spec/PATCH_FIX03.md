# PATCH — FIX_03_WORK_SCHEDULER CORRECTION
# Resolves: C-18 (static sleep window becomes fallback after FIX_09 is applied)

## ONE ADDITION TO FIX_03

FIX_03 builds a static sleep window calculator via `useSchedule()`.
FIX_09 builds a Groq-powered dynamic planner that ALSO produces a sleep window.

These do not conflict — FIX_03 is the FOUNDATION, FIX_09 is the UPGRADE.

Add this note to the top of FIX_03_WORK_SCHEDULER.md:

```
# ══════════════════════════════════════════════════════════════════
# SLEEP WINDOW SOURCE — BUILD ORDER NOTE (C-18 resolution)
#
# FIX_03 calculates sleep window statically via useSchedule().
# This is correct and required as the FALLBACK.
#
# FIX_09 (Groq shift-aware planner) generates the sleep window dynamically
# and stores it in the planner_schedule SQLite table.
#
# AFTER FIX_09 IS APPLIED:
# - Planner bedtime row reads from planner_schedule (Groq output)
# - Home tab shift strip reads from planner_schedule (Groq output)
# - useSchedule().sleepWindow is the FALLBACK when Groq is unavailable
#
# DO NOT remove the static useSchedule() calculation after applying FIX_09.
# It is the offline/first-run fallback. It must always be present.
# ══════════════════════════════════════════════════════════════════
```

Everything else in FIX_03 is correct. No other changes.
