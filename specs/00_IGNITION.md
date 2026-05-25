# SOVEREIGN WORKS — PHASE 1
# Read every file in this folder before writing any code.

---

## THE HOUSEHOLD

| Person | Profile | Type | Phone | Shift |
|--------|---------|------|-------|-------|
| Garrin | imperium | INTJ — The Uncrowned | Android | Law enforcement 2-2-3 rotating |
| Holli | tending | ESFJ — The Unspent | Android | Nurse — 12hr days or nights, rotating |

**Holli has gastric bypass — MAINTENANCE PHASE.** GBP affects Nourish tab only.
Maintenance phase means she eats reduced portions and protein-first. Not early post-op.
GBP does not appear anywhere outside the Nourish tab.

**No children. No other household members.** The source files have already been cleaned. Do not add child-name content anywhere.

---

## DO NOT ASSUME SCHEDULES

Neither Garrin nor Holli has a pre-loaded shift schedule.
The app starts with "Schedule not set."
The guided tour takes them to schedule setup on Screen 3.
A nudge card stays on the planner until the schedule is set.
Both users set their own schedule independently from Settings → Work Schedule.

---

## PHASE 1 BUILD LIST

Build these. Nothing else.

**Infrastructure**
- Firebase Realtime Database household connection (family code + QR join)
- Electron desktop app → household creation → QR codes → APK download

**Both Apps**
- Guided tour on first open (11 screens — see 14_ONBOARDING_TOUR.md)
- OTA update pipeline — Expo Updates + version-gated tour system
- Shift work scheduler — all schedule types available to both users, no defaults
- Sleep optimizer — built from shift data once schedule is set
- Shared calendar — monthly view, private and shared events, recurring events
- Today planner — morning declaration, daily quote, sleep window, meals, hydration, alarms
- LOUD alarm system — full spec in 07_ALARM_SYSTEM.md
- Default alarms pre-loaded per profile (adjustable, not permanent)
- Daily quote — Groq-generated bank, offline fallback, type-specific
- Mood tracker + bidirectional translator — see 08_MOOD_SYSTEM.md
- Hydration tracker — 100oz Garrin / 96oz Holli, shift-adjusted reminders
- Nourish tab — full spec in 11_NOURISH.md. All 45 recipes. No placeholders.
- Settings — schedule, sleep, alarms, hydration, profile, household, app
- Home screen widget — two sizes
- Locked tabs — visible with lock icon, navigate to lock screen, no content
- Hook architecture — extension points for all future phases (17_HOOKS_AND_EXPANSION.md)

**Do NOT build yet:** Warrior, Keep Yourself, Doctrine, Household, Holy Days, Vel'nar, The Book, Rite.

---

## READ ORDER

| File | Read for |
|------|---------|
| 00_IGNITION.md | This file — rules and people |
| 01_TECH_STACK.md | Stack, colors, folder structure |
| 02_FIREBASE_SCHEMA.md | Firebase schema |
| 03_PROFILES.md | Profile objects, nav, privacy |
| 04_DESKTOP_ONBOARDING.md | Electron app |
| 05_SHIFT_SLEEP_SCHEDULER.md | Shift + sleep system |
| 06_CALENDAR_PLANNER.md | Calendar + Today view |
| 07_ALARM_SYSTEM.md | Full alarm spec |
| 08_MOOD_SYSTEM.md | Mood + translator |
| 09_DAILY_QUOTE.md | Quote system |
| 10_HYDRATION.md | Hydration tracker |
| 11_NOURISH.md | Full nourish tab — complete, no placeholders |
| 12_SETTINGS.md | Settings |
| 13_WIDGET.md | Widget |
| 14_ONBOARDING_TOUR.md | Guided tour + OTA updates |
| 15_VISUAL_DESIGN.md | Look/feel/icons |
| 16_PHASE_DEFINITIONS.md | Test checklists |
| 17_HOOKS_AND_EXPANSION.md | How to expand |
| 18_TAB_MANIFEST.md | Tab colors + build order |
| RECIPE_CARDS_v3_1.md | Recipe source — do not modify |
| MASTER_IMPERIUM.md | Canon content — do not modify |
| MASTER_TENDING.md | Canon content — do not modify |

---

## RULES — NO EXCEPTIONS

1. Every screen built for 6-inch vertical Android, thumb and stylus.
2. Core features work offline. No network dependency for alarms, planner, meals, quotes.
3. Device system dark/light controls theme. No toggle inside the app.
4. Mood raw entries never leave the device. Only approved translations go to Firebase.
5. The alarm fires at maximum volume. Volume buttons do not stop it.
6. No assumed schedules. User sets their own.
7. No placeholders except locked tabs. Every built feature is complete.
8. GBP is maintenance phase. Renders in Holli's app only. Not early post-op language.
9. App icon on home screen matches the profile sigil — see 15_VISUAL_DESIGN.md.
10. Phase 1 is done when both people test their APKs and the alarm works.

---

## MORNING DECLARATIONS (auto-display on planner open, dismiss by swipe, resets daily)

Garrin: "Power from within cannot be revoked."
Holli: "The keeper of what matters is never powerless."

---

## DEFAULT ALARMS

| App | Time | Label |
|-----|------|-------|
| Imperium | 5:30 AM | The system begins now |
| Imperium | 12:00 PM | Midday anchor |
| Imperium | 6:00 PM | Evening review opens |
| Imperium | 9:30 PM | Wind down. No new decisions. |
| Tending | 6:30 AM | Your day begins with you |
| Tending | 12:00 PM | Midday check in |
| Tending | 6:00 PM | Evening tends itself |
| Tending | 9:00 PM | Rest is coming |

These are adjustable in Settings. They are not tied to any shift schedule.

