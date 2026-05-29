# 12 — SETTINGS (FIXED)
# Resolves: C-02 (GBP both apps), C-05 (Schedule location),
#           C-08 (grocery clear warning), C-10 (GBP directions),
#           C-12 (alarms location)

## LOCATION

Settings is accessed via the gear icon on the Home tab header.
It is NOT a primary tab. It is NOT inside a More tab.
(FIX_04 REVISED removed the More tab — C-13/C-17 resolution.)

---

## SETTINGS SECTIONS

### Schedule
**PRIMARY LOCATION: Planner → Schedule sub-tab (FIX_07 is authoritative — C-05 fix)**

Settings → Schedule is a SHORTCUT ONLY. It shows:
```
Schedule is configured in the Planner tab.
[Go to Planner → Schedule →]
```
Do NOT build a duplicate schedule panel here.
All actual schedule configuration (shift type, anchor date, live preview) lives in Planner → Schedule.

---

### Dietary Profile
**Applies to BOTH Imperium and Tending apps. (C-02 fix — GBP is not Tending-only.)**

Dietary settings sync to Firebase so each partner's app can show appropriate warnings.
Firebase path: `households/{householdId}/dietary/{uid}/` (C-09/C-15 fix — path now defined in 02_FIREBASE_SCHEMA_FIXED.md)
Custom avoidances (free text) stay local. Groq-parsed flags sync.

```
DIETARY PROFILE

[ ] Nut Allergy / Tree Nut Allergy
    Hard filter — removes meals with nut ingredients.
    Substitutions apply (almond butter → sunflower seed butter, etc.)

[ ] GERD
    Hard filter — removes high-acid, high-fat, fried items.

[ ] Gluten-Free
    Hard filter — removes gluten-containing meals.

[ ] Dairy-Free
    Hard filter — removes dairy-containing meals.

[ ] MTHFR
    Priority sort only — not a hard filter.
    Surfaces low-folate, low-B12 meals last.

[✓] Post-Gastric Bypass                       ← BOTH apps, not Tending-only
    Priority sort + gbpNote visible on all recipe cards.
    When toggled ON, show this permanent info card below the toggle:

    ┌─────────────────────────────────────────────────────┐
    │ POST-GASTRIC BYPASS MODE ACTIVE                     │
    │ • Do not drink 30 min before or after eating.       │
    │ • All recipes show protein-first instructions.      │
    │ • Portions adjusted to 4–6oz per meal.              │
    │ • High-sugar, fried, and raw fibrous items flagged. │
    └─────────────────────────────────────────────────────┘

    This card is ALWAYS VISIBLE when toggle is ON.
    It is not a one-time toast. It is a permanent reminder.
    (C-10 fix)

[ ] Avoid Strong Fish / Seafood
    Swaps salmon → chicken thighs, etc.

[ ] Avoid Raw Onion
    Swaps raw onion → caramelized/roasted only.

[ ] Avoid Cilantro
    Swaps cilantro → flat-leaf parsley at same volume.

[ ] Avoid Cooked Mushrooms
    Swaps mushrooms → zucchini or eggplant.

[ ] Avoid Strong Cheese
    Swaps blue cheese / aged varieties → mild mozzarella or omit.

[ ] On-Duty First
    Surfaces ON-DUTY tagged meals first on work days.

Custom avoidances:
[                                              ]
"Groq will adjust your meal plan for these. Tap Update to apply."
[Update Meal Plan]
```

---

### Notifications
**All alarm configuration is in Planner → Alarms tab. (C-12 fix — not here.)**

```
Alarms & Reminders → Configured in Planner tab
[Go to Planner → Alarms →]
```

This section is a navigation link ONLY.
Do NOT build alarm toggles, intervals, or scheduling UI here.
All of that lives in Planner → Alarms (FIX_07 is authoritative).

---

### Household
```
Household code: IMP-284751 (or TEND-xxxxxx)
[Copy Code]  [Show QR Code]

Partner: Holli — The Tending — Connected ✓
Last synced: 2 minutes ago

[Leave Household]  ← destructive, confirmation required
```

Household code is displayed here for convenience.
QR code opens a full-screen share modal.
Leave household requires two-step confirmation: tap → confirm dialog → leave.

---

### Data
```
[Clear Grocery List]
Confirmation dialog MUST say:
"This will clear the shared grocery list for both you and your partner.
 This cannot be undone."
Two buttons: [Cancel] [Clear for Both]
(C-08 fix — partner impact must be explicit)

[Clear Hydration History]
Confirmation: "This will permanently delete your hydration history. Cannot be undone."
Hydration history is LOCAL ONLY — no partner impact to warn about.

App version: [version string]
Groq API: [connected / not configured]
Firebase: [connected / offline]
```

---

## PERSISTENCE

All settings stored in SQLite (key-value pairs) on device.

Dietary settings (toggles only — not custom avoidances text) sync to Firebase:
  Path: `households/{householdId}/dietary/{uid}/`
  See `02_FIREBASE_SCHEMA_FIXED.md` for full schema.

Schedule settings stay LOCAL (different users work different shifts).
Household settings (code, member data) live in Firebase.
Custom avoidances text stays LOCAL (Groq-parsed flags sync, raw text does not).
