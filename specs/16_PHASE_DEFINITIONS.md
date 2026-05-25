# PHASE DEFINITIONS — EACH PHASE ENDS IN A TESTABLE APP

Every phase ends with a working APK that can be installed and fully tested on real phones.
No phase is complete until the APK installs, runs, and all features for that phase work.

---

## PHASE 1 — THE FOUNDATION
**Deliverable:** Two working APKs (Imperium + Tending) + Electron desktop app
**Test target:** Garrin's Android phone

### What must work before Phase 1 is done:

**Desktop Electron App**
- [ ] Opens, asks for household name
- [ ] Generates Firebase household ID
- [ ] Displays two QR codes (one per app)
- [ ] QR codes scannable and trigger correct APK download

**App Install & First Run**
- [ ] APK installs from QR scan
- [ ] App opens to the correct profile (Imperium or Tending)
- [ ] Guided tour starts automatically on first open
- [ ] Schedule setup launches from tour Screen 3
- [ ] Tour completes and opens the planner
- [ ] App icon on home screen matches the profile sigil
- [ ] Splash screen correct color per profile

**Shift Scheduler**
- [ ] All schedule types selectable
- [ ] Pattern preview shows correctly in calendar
- [ ] Manual day overrides work
- [ ] Shift status displays in planner header for both users
- [ ] No assumed schedule on first open — user is guided to set it

**Sleep Optimizer**
- [ ] Sleep window calculated from shift data
- [ ] Displays on planner
- [ ] Night-to-day transition message appears correctly
- [ ] Sleep alarms optional and configurable

**Calendar**
- [ ] Monthly view shows shift days, meals, events
- [ ] Tap date → opens that day's planner
- [ ] Long-press → add event sheet
- [ ] Shared event from one app appears in the other (Firebase sync)
- [ ] Private event stays on device only

**Alarm System**
- [ ] Default alarms fire at correct times
- [ ] Alarm fires on locked screen at full volume
- [ ] Volume buttons do not silence alarm
- [ ] SNOOZE fires again after configurable delay
- [ ] DISMISS triggers Are You Awake check (if enabled)
- [ ] Are You Awake screen locks entire screen
- [ ] Countdown timer visible on Are You Awake screen
- [ ] Timer expiry restarts full alarm
- [ ] I'M AWAKE clears screen and opens planner
- [ ] Toggle in Settings enables/disables Are You Awake check
- [ ] Delay options (1/2/5/10 min) work correctly
- [ ] Alarms survive app close and device restart

**Daily Planner — Today View**
- [ ] Morning declaration appears on open (tradition-specific)
- [ ] Swipe down dismisses declaration (persists until dismissed, resets daily)
- [ ] Daily quote card appears below declaration
- [ ] Quote rotates at midnight
- [ ] Meals appear as time slots linked to recipe cards
- [ ] Alarm indicators (🔔) show on items with alarms
- [ ] Sleep window block appears
- [ ] Hydration row visible with +8oz quick log

**Daily Quote**
- [ ] Generates bank on first open (Groq call)
- [ ] Offline fallback bank displays if no network
- [ ] Type-specific quotes (INTJ register vs ESFJ register)
- [ ] Same quote all day, rotates at midnight

**Mood Tracker**
- [ ] Mood entry screen opens from More tab
- [ ] Slider/category picker works
- [ ] Multiline note field (textarea, not single line)
- [ ] "Save Private Only" saves to device only (not Firebase)
- [ ] "Translate & Share" calls Groq and shows preview
- [ ] Preview screen shows translation, not raw entry
- [ ] Dot score shown on preview (never the raw number)
- [ ] "Send to Household" pushes approved translation to Firebase
- [ ] Partner sees translated entry in their app
- [ ] Partner view shows dots not numbers
- [ ] "What this means" block shows pre-written guidance
- [ ] Raw entry never appears in Firebase (verify)

**Hydration**
- [ ] Target correct per profile (100oz / 96oz)
- [ ] +8oz and +16oz quick log works
- [ ] Custom amount works
- [ ] Progress bar updates immediately
- [ ] History shows last 7 days
- [ ] Shift-adjusted reminders fire correctly

**Nourish Tab**
- [ ] Plan sub-tab shows week view of meals
- [ ] Recipe cards open with correct content
- [ ] Serving scale works (×0.5 through ×3)
- [ ] GBP notes appear on Holli's app, not Garrin's
- [ ] GBP note: Holli is in MAINTENANCE phase (not early post-op)
- [ ] Ingredient add to grocery list works
- [ ] Grocery list: tapping '+ Add' on a recipe ingredient adds it to the list; '+ Add All' adds the whole recipe
- [ ] Grocery list sorted by category
- [ ] Color-coded category headers visible
- [ ] Items check off correctly
- [ ] Share list opens system share sheet
- [ ] Manual item add works
- [ ] Supplement list displays (read-only)
- [ ] Wellness teas display under Beverages

**Settings**
- [ ] Work schedule settings save and update calendar
- [ ] Sleep preferences save and update planner
- [ ] Alarm management shows all alarms
- [ ] Are You Awake toggle and delay work
- [ ] Snooze duration configurable
- [ ] Hydration target editable
- [ ] Restart Tour clears keys and relaunches tour

**Home Screen Widget**
- [ ] Small widget (2×2) installs and displays
- [ ] Medium widget (4×2) installs and displays
- [ ] Shows correct profile content
- [ ] Shift status shows for both users
- [ ] Next 2-3 planner items appear
- [ ] Hydration row with quick-log tap
- [ ] Widget updates within 15 minutes
- [ ] Tap widget opens app at correct tab

**OTA Update**
- [ ] App checks for update on launch
- [ ] Update banner appears (non-blocking) when update available
- [ ] Tap to reload applies update
- [ ] Tour version system initialized (tour_v1_complete key set after tour)

**Locked Tabs (Phase 2+ content)**
- [ ] Warrior / Keep Yourself tab visible but locked
- [ ] Doctrine tab visible but locked
- [ ] Lock screen shows correct voice-appropriate message
- [ ] Locked tabs do not navigate to any real content

---

## PHASE 2 — WARRIOR PRACTICE / KEEP YOURSELF
**Deliverable:** Updated APKs with Warrior and Keep Yourself tabs fully working
**Test target:** Both phones (Garrin and Holli)

### What gets added:
- [ ] Warrior tab (Garrin): Foundation 7-day gate + 5 disciplines
- [ ] Keep Yourself tab (Holli): 5 pillars
- [ ] Session logging for all disciplines/pillars
- [ ] Progress charts
- [ ] Discipline library (instructions, stages, timers, session logs)
- [ ] Foundation gate logic (Day 7 before disciplines open)
- [ ] Warrior/Keeper sessions schedulable to planner
- [ ] Phase 2 new-features tour (max 2 cards)

**Phase 2 complete when:** Both tabs fully functional, sessions log correctly, progress charts populate, sessions appear on shared planner, tour shows on first Phase 2 launch.

---

## PHASE 3 — DOCTRINE
**Deliverable:** Updated APKs with Doctrine tab
**Test target:** Both phones

### What gets added:
- [ ] Doctrine tab unlocks (both apps)
- [ ] All 6 canon pieces readable (Day 1 of Phase 3)
- [ ] Morning declaration tappable (opens Oath)
- [ ] Daily quote links to Canon source
- [ ] Evening review (Garrin) / Evening tends itself (Holli) in planner
- [ ] Daily doctrine prompt in Today spine
- [ ] Shadow work: one position introduced per week by planner
- [ ] Phase 3 new-features tour

**Phase 3 complete when:** All doctrine readable, shadow work rotating weekly, evening review logging correctly.

---

## PHASE 4 — HOUSEHOLD & RELATIONSHIP
**Deliverable:** Updated APKs with Household tab
**Test target:** Both phones together (requires both to be running)

### What gets added:
- [ ] Household tab fully unlocks
- [ ] Cross-guide display (Uncrowned Guide / Unspent Guide visible to both)
- [ ] Couple activities schedulable to both planners simultaneously
- [ ] Relationship repair section
- [ ] Concord ceremony visible ("In Preparation") and schedulable
- [ ] Holy Days tab (both traditions, notification chain)
- [ ] Phase 4 new-features tour

**Phase 4 complete when:** Both apps see shared household content, couple activities appear on both planners, holy days fire notifications correctly.

---

## PHASE 5 — LANGUAGE, BOOK, RITE
**Deliverable:** Updated APKs with all remaining features
**Test target:** Both phones

### What gets added:
- [ ] Vel'nar language tab (Garrin) — all 7 tutor layers
- [ ] Vocal coach system (whisper.rn + TFLite + DSP)
- [ ] The Book tab (both apps, 8 movements)
- [ ] Rite readiness engine and Rite completion record
- [ ] Partnership Rite ceremony
- [ ] Progress tracking full dashboard
- [ ] Annual practices
- [ ] Phase 5 new-features tour

**Phase 5 complete when:** Full system operational. All tabs functional. Rite can be completed. Language coach gives accurate pronunciation feedback.

---

## VERSIONING CONVENTION

```
Phase 1 APK:  v1.0.0
Phase 2 APK:  v2.0.0
Phase 3 APK:  v3.0.0
Phase 4 APK:  v4.0.0
Phase 5 APK:  v5.0.0

Patch releases (bug fixes within a phase):
  v1.0.1, v1.0.2, etc.
```

Update the version in `app.json` before every APK build.
The OTA update system uses the version to determine which tours to show.

