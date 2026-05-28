# 12 — SETTINGS

## LOCATION

More tab → Settings section.
Not a separate tab. Inline within More tab.

## SETTINGS SECTIONS

### Schedule
- Shift type: Day (6AM–6PM) or Night (6PM–6AM)
- 2-2-3 pattern start date (date picker)
- View current week's work days (read-only calendar strip)

### Dietary
- Nut Allergy toggle (hard filter, NF)
- GERD toggle (hard filter, GERD)  
- Gluten-Free toggle (hard filter, GF)
- Dairy-Free toggle (hard filter, DF)
- MTHFR toggle (priority sort only — not a hard filter)
- GBP/Bariatric toggle (Tending app only — priority sort + gbpNote visible)
- On-Duty First toggle (surfaces ON-DUTY meals first on work days)

### Notifications
- Hydration reminders: ON/OFF + interval (60 / 90 / 120 min)
- Batch cook reminder: ON/OFF
- Wind-down alarm: ON/OFF
- Wake alarm: managed via Alarm Management screen (Layer 3)

### Household
- Household code display (for sharing with partner)
- Partner connection status
- Leave household (destructive — requires confirmation)

### Data
- Clear grocery list (confirmation required)
- Clear hydration history (confirmation required)
- App version display

## PERSISTENCE

All settings stored in SQLite (key-value pairs).
Dietary settings sync to Firebase so partner's app can show appropriate warnings.
Schedule settings stay local (different users have different schedules).
