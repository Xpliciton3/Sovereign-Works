# BUILD SEQUENCE — ORDERED TASK LIST FOR CURSOR
# Reference this when resuming after a stop.
# Each item has a completion marker Cursor writes when done.

---

## HOW CURSOR USES THIS FILE

At the start of each session, Cursor reads this file and finds the first
unchecked item. It begins there. It does not restart from the beginning.
When a task is complete, Cursor writes [x] in the checkbox.

This file is the single source of progress tracking.

---

## PHASE 1 TASK LIST

### FOUNDATION
- [ ] 1.1 Firebase project exists in console.firebase.google.com
- [x] 1.2 Firebase config written to packages/shared/firebase/config.ts
- [ ] 1.3 Firebase Realtime Database security rules deployed (from 02_FIREBASE_SCHEMA.md)
- [ ] 1.4 Anonymous auth enabled in Firebase console
- [x] 1.4a SQLite schema created (sync_queue, grocery, hydration_log, mood_entries, planner_state, alarm_configs, quote_bank)
- [x] 1.4b writeShared() function — SQLite-first, Firebase queued (from 02_FIREBASE_SCHEMA.md)
- [x] 1.4c drainSyncQueue() — fires on app foreground and network-restored events
- [x] 1.5 React Native + Expo monorepo scaffolded (apps/imperium, apps/tending, packages/shared)
- [x] 1.6 TypeScript configured in all three workspaces
- [x] 1.7 Shared color systems from 15_VISUAL_DESIGN.md implemented in packages/shared/colors/
- [x] 1.8 Typography constants from 15_VISUAL_DESIGN.md implemented in packages/shared/typography/
- [x] 1.9 All TypeScript interfaces from 17_HOOKS_AND_EXPANSION.md created in packages/shared/types/

### ELECTRON DESKTOP APP
- [x] 2.1 Electron project scaffolded in desktop/ — N/A per UPDATE_04 (no desktop app in Phase 1)
- [ ] 2.2 Household creation flow (Screen 1-3 from 04_DESKTOP_ONBOARDING.md)
- [ ] 2.3 Firebase household document created on setup completion
- [ ] 2.4 QR code generation for both APK download URLs
- [ ] 2.5 Admin panel (Screen 4 — shift status display, schedule links, system status)
- [ ] 2.6 electron-builder configured for Windows NSIS installer
- [ ] 2.7 APK download page HTML file created for GitHub Pages hosting

### SCHEDULE SYSTEM
- [ ] 3.1 All schedule types from 05_SHIFT_SLEEP_SCHEDULER.md implemented
- [ ] 3.2 Shift pattern generator (generateShiftDays function)
- [ ] 3.3 90-day forward pre-generation on first save
- [ ] 3.4 Manual override — just this day and from here forward
- [ ] 3.5 Firebase sync of shift config and generated days
- [ ] 3.6 Sleep optimizer (calculateSleepWindow function)
- [ ] 3.7 Night-to-day transition message logic
- [ ] 3.8 Sleep alarms generated from sleep window (if user enables)
- [ ] 3.9 Partner shift status display (both in both planners)
- [ ] 3.10 Schedule setup screen (no pre-populated defaults — user sets from scratch)
- [ ] 3.11 Overtime tracker: "I'm Working Late" from planner shift strip and Settings; +1/2/4/custom hours; adjusts tonight's alarms and sleep window only; single-day SQLite exception
- [ ] 3.12 Overtime log: this week and this month totals, CSV export — user sets from scratch)

### CALENDAR
- [ ] 4.1 Monthly calendar view with all event types color-coded
- [ ] 4.2 Tap date → opens Today view for that date
- [ ] 4.3 Long-press date → Add Event sheet
- [ ] 4.4 Event types: Personal, Shared, Appointment, Couple Activity, Holy Day (auto), Rite
- [ ] 4.5 Shared events sync to Firebase and appear in partner's app (with color dot + label)
- [ ] 4.6 Private events stored locally in SQLite — never to Firebase
- [ ] 4.7 Recurring events (daily, weekdays, weekends, weekly, biweekly, monthly, custom)
- [ ] 4.7a Tending app: Replenishment Session recurring event — user sets day + time once, recurs weekly, protected from being overwritten by household events, shows on both calendars as blocked/unavailable
- [ ] 4.8 Natural language event input (Groq parses text → calendar entry)
- [ ] 4.9 Shift blocks auto-populate on calendar from shift schedule
- [ ] 4.10 Meal slots auto-populate on calendar from meal plan

### ALARM SYSTEM
- [ ] 5.1 AlarmConfig TypeScript interface
- [ ] 5.2 AreYouAwakeConfig TypeScript interface
- [ ] 5.3 All default alarms pre-loaded per profile (not tied to any assumed shift)
- [ ] 5.4 scheduleAlarm() function using expo-notifications
- [ ] 5.5 cancelAlarm() and rescheduleAlarm() functions
- [ ] 5.6 Boot receiver — alarms rescheduled on device restart
- [ ] 5.7 Full-screen alarm UI (black bg for Imperium, deep red for Tending)
- [ ] 5.8 Volume override — max volume regardless of device ringer setting
- [ ] 5.9 Volume button intercept — buttons do not silence alarm during firing
- [ ] 5.10 Vibration pattern — simultaneous with audio
- [ ] 5.11 SNOOZE button — configurable duration, max snooze count
- [ ] 5.12 DISMISS button — triggers Are You Awake check if enabled
- [ ] 5.13 I'M UP button — confirms awake, cancels check, opens planner
- [ ] 5.14 Are You Awake screen — full screen, back button disabled, home button returns to screen
- [ ] 5.14a Haptic pulse every 60 seconds during countdown: three short taps (Warning type) spaced 200ms apart
- [ ] 5.14b Cancel all pending haptic timeouts when I'M AWAKE is tapped, home button returns to screen
- [ ] 5.15 Are You Awake countdown timer — 5 minutes, visible progress bar
- [ ] 5.16 Timer expiry → full alarm restart (snooze counter resets)
- [ ] 5.17 I'M AWAKE button → clears screen, opens planner
- [ ] 5.18 Are You Awake delay options: 1 / 2 / 5 / 10 minutes (user setting)
- [ ] 5.19 Are You Awake toggle: ON/OFF in Settings
- [ ] 5.20 Android permissions: SCHEDULE_EXACT_ALARM, USE_EXACT_ALARM, VIBRATE, WAKE_LOCK, RECEIVE_BOOT_COMPLETED, SYSTEM_ALERT_WINDOW

### TODAY PLANNER
- [ ] 6.1 Today view — date header, shift status strip, content area
- [ ] 6.2 Morning declaration card (swipe-down to dismiss, resets daily)
- [ ] 6.3 Daily quote card (below declaration, offline from bank)
- [ ] 6.4 Sleep window card (from sleep optimizer or "Set schedule" nudge)
- [ ] 6.5 Meal slots as expandable cards (tap to expand inline)
- [ ] 6.5a Prep flag on Dinner card: if recipe prepNote/batchNote contains thaw/marinate/slow cooker/overnight/start by — show ⚠ + first sentence of prep note on collapsed card (tap → expands inline on planner with full recipe, [+ Cart] per ingredient, [+ Add All to Cart])
- [ ] 6.6 Alarm time labels with bell icon
- [ ] 6.7 Hydration row with quick-log buttons
- [ ] 6.8 Planner items checklist (from profile config)
- [ ] 6.9 Skip/defer item without breaking completion record
- [ ] 6.10 Consecutive-day streak tracking
- [ ] 6.11 Calendar view (monthly, within Planner tab)
- [ ] 6.12 Shifts sub-view (both schedules, week-at-a-glance)

### DAILY QUOTE
- [ ] 7.1 Offline fallback banks (10 quotes per tradition) stored in bundle
- [ ] 7.2 Groq generation function — generates 30 quotes per tradition per call
- [ ] 7.3 INTJ generation prompt from 09_DAILY_QUOTE.md
- [ ] 7.4 ESFJ generation prompt from 09_DAILY_QUOTE.md
- [ ] 7.5 AsyncStorage persistence of generated banks
- [ ] 7.6 Refresh trigger — when bank < 5 remaining or monthly
- [ ] 7.7 getTodayQuote() — deterministic rotation, same quote all day
- [ ] 7.8 Quote card UI — tradition accent border, Cormorant italic text

### MOOD SYSTEM
- [ ] 8.1 SQLite schema for local mood entries (raw — never leaves device)
- [ ] 8.2 Mood entry screen — slider, category picker, multiline textarea
- [ ] 8.3 "Save Private Only" — writes to SQLite only
- [ ] 8.4 "Translate & Share →" — calls Groq, shows preview screen
- [ ] 8.5 Translation preview — shows translated text, dot score (not number), edit option
- [ ] 8.6 "Send to Household →" — writes only approved translation + dot score to Firebase
- [ ] 8.7 INTJ→ESFJ translation prompt (from 08_MOOD_SYSTEM.md)
- [ ] 8.8 ESFJ→INTJ translation prompt (from 08_MOOD_SYSTEM.md)
- [ ] 8.9 Partner mood view — two-tab toggle, live Firebase listener
- [ ] 8.10 Dot score display (1–5 dots, never raw number)
- [ ] 8.11 "What this means" block — pre-written from 08_MOOD_SYSTEM.md (NOT Groq)
- [ ] 8.12 "No entry yet today" → shows yesterday's entry with label
- [ ] 8.13 30-day personal history view (on-device only)
- [ ] 8.14 Communication translator — bidirectional, Groq-powered

### HYDRATION
- [ ] 9.1 Daily hydration target per profile (100oz Garrin, 96oz Holli — adjustable)
- [ ] 9.2 +8oz and +16oz quick-log buttons on planner
- [ ] 9.3 Custom amount input
- [ ] 9.4 Progress bar (updates immediately on log)
- [ ] 9.5 Full hydration screen with history
- [ ] 9.6 Shift-adjusted reminder schedule (from 10_HYDRATION.md)
- [ ] 9.7 Firebase daily total sync (logged oz only — not entries)

### NOURISH TAB
- [ ] 10.1 Import all 45 recipes from RECIPE_CARDS_v3_1.md into typed Recipe objects — recipes are already fully written, Cursor imports only
- [ ] 10.1a Every recipe tag (NF, GBP, GBP★, MTHFR, MTHFR★, GERD, GF, DF, ON-DUTY, BATCH, etc.) imported exactly as written in RECIPE_CARDS_v3_1.md
- [ ] 10.2 Recipe cards import correctly — BASE SERVES shows "2 adults" (already corrected in source file)
- [ ] 10.3 GBP notes render ONLY in Tending app. Absent from Imperium app entirely.
- [ ] 10.4 GBP notes render only in Tending app — absent entirely from Imperium app
- [ ] 10.5 Plan sub-tab — multi-week scrollable meal plan view (current week + all weeks ahead)
- [ ] 10.6 ONE 30-day meal plan — one recipe pool, filtered by HouseholdDietarySettings from 11_NOURISH.md
- [ ] 10.7 On-Duty indicator (⚡) on meals tagged ON-DUTY on shift days; swap list surfaces ON-DUTY recipes first
- [ ] 10.7a [▶] button on each meal row — expands recipe inline (same expansion as planner)
- [ ] 10.7b [+ Cart] button on each meal row — adds all ingredients for that meal in one tap
- [ ] 10.7c [+ Add This Week's Ingredients to Cart] at bottom of each week — user-initiated, adds all ingredients not already in cart
- [ ] 10.7d Jump to Week — date picker for navigating to any future week
- [ ] 10.8 Recipe card component — full layout with all fields, step-by-step method (one step at a time), serving scale
       Used in THREE contexts: (1) expanded inline on planner, (2) expanded inline on Nourish plan view, (3) full screen from Recipes sub-tab
- [ ] 10.9 "+ Add" per ingredient → grocery list
- [ ] 10.10 "+ Add All" → all ingredients to grocery list
- [ ] 10.11 Grocery list built by user: "+ Add" per ingredient or "+ Add All" per recipe — no auto-generate button
- [ ] 10.12 Adding an item already in the list silently skips it (no duplicates)
- [ ] 10.13 Grocery list sorted by CATEGORY_ORDER from 11_NOURISH.md after every addition
- [ ] 10.14 Color-coded category headers with dots
- [ ] 10.15 Check-off with strike-through — real-time Firebase sync
- [ ] 10.16 Manual add item sheet
- [ ] 10.17 Share list → native share sheet (plain text, by category)
- [ ] 10.18 Regenerate with confirmation dialog
- [ ] 10.19 Supplements tab — both Garrin and Holli, read-only, MTHFR warnings
- [ ] 10.20 Wellness teas — all 22 listed, individual + Add to grocery
- [ ] 10.21 Household basics — all 26 items, individual + Add to grocery
- [ ] 10.22 Meal slots on planner → tap to EXPAND INLINE (not navigate away)
       Expansion shows: ingredients with [+ Cart] per item, [+ Add All to Cart], step-by-step method, nutrition, GBP note (Tending only)
       [▲ Collapse] or re-tap header collapses. Only one meal expanded at a time.

### SETTINGS
- [ ] 11.1 Work Schedule settings (schedule type, length, start time, night shift, cycle start, preview)
- [ ] 11.2 Sleep Preferences (target hours, sleep alarms toggle, wind-down timing)
- [ ] 11.3 Alarm management (all alarms listed, toggle, edit per alarm)
- [ ] 11.4 Are You Awake settings (toggle, delay: 1/2/5/10 min)
- [ ] 11.5 Snooze configuration (duration, max snoozes)
- [ ] 11.6 Hydration target (adjustable oz/ml/cups, reminder interval and window)
- [ ] 11.6a Dietary settings: Nut Allergy, GBP, MTHFR, GERD, GF, DF toggles (from 12_SETTINGS.md)
- [ ] 11.6b getEligibleRecipes() function — hard filters + priority scoring (from 11_NOURISH.md)
- [ ] 11.6c When dietary settings change: flag ineligible scheduled meals with swap prompt
- [ ] 11.7 Profile section (name, tradition, hydration target)
- [ ] 11.8 Household section (household name, partner name, connection status)
- [ ] 11.9 App section (version display, restart tour, rebuild quote bank, clear data)

### GUIDED TOUR + PHONE SETUP
- [ ] 12.1 Splash screen (sigil, tradition color, 1.5 seconds)
- [ ] 12.2 Household connection screen (connects Firebase on first launch)
- [ ] 12.3 Offline first-launch screen (retry loop until connected)
- [ ] 12.4 Profile confirmed screen (sigil, title, axiom, Begin button)
- [ ] 12.5 Android permissions sequence (4 permissions, explained before each dialog)
- [ ] 12.6 llama.rn model download — WiFi-only, background, non-blocking banner
- [ ] 12.7 Tour screen 1 — Welcome (tradition-specific voice)
- [ ] 12.8 Tour screen 2 — The Planner (annotated screenshot with callouts)
- [ ] 12.9 Tour screen 3 — Work Schedule (no assumptions, direct to setup)
- [ ] 12.10 Schedule setup screen (all options, no defaults pre-selected, skip option)
- [ ] 12.11 Tour screen 4 — Sleep Optimizer
- [ ] 12.12 Tour screen 5 — Alarms
- [ ] 12.13 Tour screen 6 — Nourish & Dietary Setup: toggle screen with NF/GERD/GF/DF hard filters and GBP/MTHFR priority toggles; GBP and MTHFR default ON; saves HouseholdDietarySettings before first plan view
- [ ] 12.14 Tour screen 7 — Hydration
- [ ] 12.15 Tour screen 8 — Mood & Partner
- [ ] 12.16 Tour screen 9 — Daily Quote
- [ ] 12.17 Tour screen 10 — What's Coming (locked tabs with lock icons)
- [ ] 12.18 Tour screen 11 — Begin (axiom, tradition sigil, opens planner)
- [ ] 12.19 tour_v1_complete key written to AsyncStorage after tour
- [ ] 12.20 Manual tour restart in Settings → App → Restart App Tour

### OTA UPDATE PIPELINE
- [ ] 13.1 Expo Updates configured in both apps (expo-updates SDK)
- [ ] 13.2 checkForUpdate() called on each app launch
- [ ] 13.3 Non-blocking update banner (tap to apply, never blocks the app)
- [ ] 13.4 TOUR_VERSIONS registry in packages/shared/tour/tourVersions.ts
- [ ] 13.5 determineTourToShow() — checks all tour version keys, shows oldest unseen
- [ ] 13.6 Manual tour reset clears all tour keys

### HOOK ARCHITECTURE
- [x] 14.1 tabConfig.ts — all tabs with locked/unlocked state and phase tags
- [x] 14.2 plannerSections.ts — all section types registered, Phase 2+ sections render null
- [ ] 14.3 Firebase namespaces for all phases pre-declared in security rules
- [x] 14.4 settingsSections.ts — section registry for Settings screen expansion
- [x] 14.5 Lock screen component — uses tab color, tradition voice message

### HOME SCREEN WIDGET
- [ ] 15.1 Small widget (2×2) — profile name, shift status, next 2 items, hydration tap — profile name, shift status, next 2 items, hydration tap
- [ ] 15.2 Medium widget (4×2) — shift status both people, next 2 items, PINNED tonight's dinner row with prep flag if applicable, hydration row
- [ ] 15.3 Widget refresh on app open, hydration log, alarm fire, every 15 minutes
- [ ] 15.4 Tap widget → opens app at correct tab

### VISUAL + ICONS
- [ ] 16.1 Imperium app icon (placeholder: gold quill shape on #0D0D0D)
- [ ] 16.2 Tending app icon (placeholder: rose heart shape on #120A0E)
- [ ] 16.3 Imperium adaptive icon (Android)
- [ ] 16.4 Tending adaptive icon (Android)
- [ ] 16.5 Notification icons (white on transparent, 96x96)
- [ ] 16.6 Splash screens (tradition background color, sigil centered)
- [ ] 16.7 app.json configured correctly for both apps (package names, icons, splash)

### APK BUILDS
- [ ] 17.1 eas.json configured with production profile
- [ ] 17.2 Imperium APK built with EAS (eas build --platform android --profile production)
- [ ] 17.3 Tending APK built with EAS (eas build --platform android --profile production)
- [ ] 17.4 Both APKs uploaded to GitHub Releases
- [ ] 17.5 APK download URLs inserted into Electron QR code generator

### ELECTRON + SETUP.EXE
- [ ] 18.1 npm cache cleared
- [ ] 18.2 electron-builder cache cleared (%APPDATA%\electron-builder)
- [ ] 18.3 Minimum 5GB free space verified
- [ ] 18.4 Electron desktop app builds and runs (npm start)
- [ ] 18.5 Windows NSIS installer built (npm run build:win)
- [ ] 18.6 dist/SovereignWorks-Setup-1.0.0.exe confirmed present (80-120MB)
- [ ] 18.7 setup.exe installs cleanly on Windows test machine
- [ ] 18.8 Desktop shortcut and Start Menu entry created on install
- [ ] 18.9 App opens after install — household creation flow works
- [ ] 18.10 QR codes display and are scannable

### FINAL VERIFICATION
- [ ] 19.1 All Phase 1 checkboxes in 16_PHASE_DEFINITIONS.md verified
- [ ] 19.2 Imperium APK installs on Garrin's Android phone
- [ ] 19.3 Tending APK installs on Holli's Android phone
- [ ] 19.4 Alarm fires at max volume on Garrin's phone
- [ ] 19.5 Are You Awake screen locks Garrin's phone
- [ ] 19.6 Alarm fires at max volume on Holli's phone
- [ ] 19.7 Are You Awake screen locks Holli's phone
- [ ] 19.8 Phase 1 complete. Request Phase 2 spec files.

