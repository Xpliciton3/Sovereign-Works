# INSTALLATION INSTRUCTIONS + FIRST LAUNCH SETUP
# No Play Store. No desktop app. No QR codes.
# Direct APK download and 6-digit household join code.

---

## PART 1 — INSTALLATION INSTRUCTIONS

These instructions are shown on a simple web page hosted at the APK download URL.
Cursor builds this page as a static HTML file deployed to GitHub Pages.
URL format: https://xpliciton3.github.io/Imperium/install

---

### Installation Page Content (imperium-install.html)

```
THE IMPERIUM
Installing Garrin's App

────────────────────────────────────────
STEP 1 — Download the APK

[↓ Download The Imperium — v1.0]
                ↑ large gold button

File size: approx 80MB
This is an Android app file (.apk)
────────────────────────────────────────
STEP 2 — Allow installation

When Android asks "Allow installs from
this source?" — tap Allow.

If you don't see this prompt:
  Settings → Apps → Special app access
  → Install unknown apps
  → find your browser → Allow

────────────────────────────────────────
STEP 3 — Install

Tap the downloaded file in your
notifications or Downloads folder.
Tap Install.

────────────────────────────────────────
STEP 4 — Open the app

Tap Open. Garrin goes first — he creates
the household and gets the join code
for Holli.

────────────────────────────────────────

Having trouble?
Android version 8.0 or later required.
```

Identical page for Tending with rose color scheme and Holli's name.
Holli's page says: "Garrin opens his app first and gives you a 6-digit code.
You'll need it in Step 2 of setup."

---

## PART 2 — FIRST LAUNCH SEQUENCE

This runs once on first open. Never again unless the app is reinstalled.
Progress is tracked in AsyncStorage: `firstLaunchComplete: true`

---

### Screen 1 — Splash (1.5 seconds)

```
[Black screen]

[Tradition sigil animates in — 600ms fade]

[No text. No loading spinner. Just the sigil.]
```

Auto-advances after 1.5 seconds.

---

### Screen 2 — Welcome

```
[Sigil — small, centered top third]


THE IMPERIUM          (or: THE TENDING)
Uncrowned Operating System


A household operating system built for
the way your mind actually works.


[Begin Setup →]
```

Tap Begin Setup → Screen 3.

---

### Screen 3 — Household Setup (Garrin — goes first)

```
SET UP YOUR HOUSEHOLD

Are you setting up for the first time,
or joining an existing household?

[Create New Household]     ← Garrin taps this
[Join with a Code]         ← Holli taps this
```

---

### Screen 3A — Create Household (Garrin's path)

```
NAME YOUR HOUSEHOLD

[_______________________]

This connects both phones to the same
system. Your grocery list, calendar, and
mood check-ins sync between you.

[Create Household →]
```

On tap:
- Firebase creates: `households/{id}` with name, joinCode (6 digits), expiry (48hrs)
- Stores householdId + profile in AsyncStorage
- Advances to Screen 3B

---

### Screen 3B — Share the Code (Garrin)

```
YOUR HOUSEHOLD CODE

Share this with Holli so she can join.

         847 - 291

[Copy Code]    [Send via Text]

"Send via Text" opens Messages with:
"Download The Tending at [URL] and use
code 847-291 to join our household."

──────────────────────────────────────
[Continue to my setup →]

(Holli can join later — you don't need
 to wait for her now)
```

---

### Screen 3C — Join Household (Holli's path)

```
JOIN YOUR HOUSEHOLD

Garrin will have a 6-digit code.
Ask him for it now.

[8] [4] [7] [-] [2] [9] [1]
     ↑ large tappable digit entry

[Join →]
```

Error states:
- Wrong code: "Code not found. Double-check with Garrin."
- Expired: "This code expired. Ask Garrin to generate a new one in Settings."
- No internet: "No connection. Connect to WiFi and try again."

On success: advances to Screen 4.

---

### Screen 4 — Profile Confirmed

```
[Sigil — full size, glowing faintly]


THE IMPERIUM
You are The Uncrowned.


"Power from within cannot be revoked.
Uncrowned. Unbowed. Unbroken. Unfinished."


[Begin →]
```

Pause 2 seconds on the axiom before the Begin button appears.
Tap Begin → Android permissions sequence.

---

### Screen 5 — Permissions (Android)

Four permissions. Each gets its own screen before the system dialog.
Do not chain them. Do not show the system dialog without explaining first.

**Permission 1 — Notifications:**
```
ALARMS WON'T WORK WITHOUT THIS

This app uses real alarms — full screen,
maximum volume, on your lock screen.

For this to work, Android needs
permission to send notifications.

[Allow Notifications →]
[Skip — I understand alarms won't work]
```

**Permission 2 — Exact Alarms (Android 12+):**
```
ONE MORE STEP FOR ALARMS

Android 13+ requires a separate setting
for exact alarm scheduling.

We'll take you directly to the screen.
Enable "Alarms & Reminders" for this app,
then come back.

[Open Alarm Settings →]
```

**Permission 3 — Display Over Other Apps:**
```
ALARMS NEED TO REACH YOUR LOCK SCREEN

For the alarm to appear when your phone
is locked, enable "Display over other apps."

We'll take you to the setting.

[Open Display Settings →]
```

**Permission 4 — Battery Optimization:**
```
CRITICAL — ALARMS DIE WITHOUT THIS

Android can kill background apps to save
battery. This stops alarms from firing.

We need an exemption for this app.

[Disable Battery Optimization →]
```

After all permissions → Screen 6.
If any declined: note what won't work, do not block progress.

---

### Screen 6 — Work Schedule

```
YOUR WORK SCHEDULE

The app builds your sleep window from
your shift. Set it once — it handles
the rest.

Schedule type:
  ○ 2-2-3 Rotating     ← law enforcement
  ○ Rotating 12hr Nights
  ○ Rotating 12hr Days
  ○ Mixed Days & Nights
  ○ Fixed Days
  ○ Mark each day manually

[→ I'll set this up now]
[Skip — I'll do this later in Settings]
```

Tapping "I'll set this up now" expands the full schedule builder inline:
work day toggles + shift start/end time pickers + live calendar preview.

Skip stores `scheduleSet: false` — a nudge card appears on the planner until it's done.

---

### Screen 7 — Dietary Settings

```
DIETARY SETTINGS

Who has what condition in your household?
This filters the meal plan rotation.

NUT ALLERGY          [toggle]  ← HARD FILTER
GERD                 [toggle]  ← HARD FILTER
Gluten-Free          [toggle]  ← HARD FILTER
Dairy-Free           [toggle]  ← HARD FILTER

GBP (Gastric Bypass) [toggle]  ← priority
MTHFR                [toggle]  ← priority

Hard filters remove meals that don't
qualify. Priority filters surface the
best matches first.

[Save →]
[Skip — No filters needed]
```

These can be changed anytime in Nourish → Dietary Settings.

---

### Screen 8 — Replenishment Session (Tending app only)

Shown only in the Tending app. Imperium skips from Screen 7 to Screen 9.

```
YOUR REPLENISHMENT SESSION

Once per week. Two hours. Yours.

With everything you carry — six kids,
work, school — this doesn't happen
by accident. It has to be scheduled.

Day:
  ○ Mon  ○ Tue  ○ Wed  ○ Thu
  ○ Fri  ● Sat  ○ Sun

Start time:  [9:00 AM]
Duration:    [2 hours]

This creates a repeating calendar event
and shows as protected time so it
doesn't get overwritten.

[Schedule It →]
[I'll set this up later]
```

---

### Screen 9 — Alarms

```
YOUR DEFAULT ALARMS

These are pre-loaded based on your
tradition. Adjust anytime in Settings.

IMPERIUM                  TENDING
5:30 AM — System begins   6:30 AM — Begins with you
12:00 PM — Midday anchor  12:00 PM — Midday check in
9:30 PM — Wind down       9:00 PM — Rest is coming

[Keep These]
[Adjust Before Continuing →]
```

---

### Screen 10 — What's Coming

```
WHAT'S LOCKED (AND WHY)

The app unlocks as you build the
foundation. Not paywalled — staged.

🔒 Warrior Practice    Opens at Day 7
🔒 Doctrine            Opens at Day 14
🔒 Holy Days           Opens at Day 30
🔒 The Rite            Opens at Day 30

You don't need those yet.
Start with the planner. That's enough.

[Got It →]
```

---

### Screen 11 — Begin

```
[Sigil — full size]


[Axiom — full, centered, in Cormorant]

IMPERIUM:
POWER FROM WITHIN CANNOT BE REVOKED.
UNCROWNED. UNBOWED. UNBROKEN. UNFINISHED.

TENDING:
THE KEEPER OF WHAT MATTERS IS NEVER
POWERLESS. FELT. FAITHFUL. FULL. UNSPENT.


[Enter The Imperium →]    (or: Enter The Tending →)
```

Tap → opens the home screen. Tour complete.
Writes `tour_v1_complete: true` to AsyncStorage.
Never shown again unless user taps "Restart Tour" in Settings.

---

## PART 3 — FIRST OPEN AFTER TOUR (Home Screen Nudges)

These appear on the home screen until the action is taken, then disappear.

```
┌─ NUDGE: Schedule not set ────────────────────┐
│ Set your work schedule to enable the sleep   │
│ optimizer and shift-adjusted reminders.      │
│ [Set Schedule →]                             │
└──────────────────────────────────────────────┘
```

```
┌─ NUDGE: Household not connected ─────────────┐
│ Holli hasn't joined yet. Share your code.   │
│ [Show Code →]                                │
└──────────────────────────────────────────────┘
```

Both nudges disappear automatically when the action is completed.

---

## PART 4 — REINSTALL / FRESH DEVICE

If the app is reinstalled or moved to a new phone:

1. User downloads the APK again from the same GitHub Releases URL
2. Installs — same process as first time
3. First launch shows household join screen
4. User taps "Join with a Code"
5. Garrin generates a fresh code from Settings → Household → Regenerate Code
6. Holli enters the code — reconnects to the same Firebase household
7. All shared data (calendar, grocery list, mood entries) restored immediately
8. Private data (raw mood entries, hydration log) was on the old device — fresh start on new device
9. Tour does NOT re-run — app detects it is rejoining an existing household and skips to home screen

