# 08 — MOOD SYSTEM

## WHAT SYNCS VS WHAT STAYS LOCAL

| Data | Stays local | Syncs to Firebase |
|------|-------------|-------------------|
| Raw score (1–10) | ✓ Device only | ✗ Never |
| Raw note text | ✓ Device only | ✗ Never |
| Bracket translation | ✓ Device only | ✗ Never |
| Dot score (1–5) | ✓ SQLite | ✓ Firebase |
| Groq translation | ✓ SQLite cache | ✓ Firebase (auto on save) |
| Updated timestamp | ✓ SQLite | ✓ Firebase |

Dot score = Math.ceil(rawScore / 2). Range 1–5.

## MOOD MODAL — THREE TABS

### Log tab
- Slider or number input: 1–10
- Optional note field (private — never leaves device)
- Bracket translation shown in real time as score changes (from 03_PROFILES.md)
- Submit button → writes to SQLite, Groq translates note if present, auto-syncs dot score + translation to Firebase (no share button)

### Partner tab
- Shows partner's dot score for today: 5 circles, filled count = dot score
- Tradition-appropriate color (gold for Imperium reading, rose for Tending reading)
- No number shown. Dots only.
- Below dots: one-line state description in reader's tradition register
  - Imperium reader seeing partner's dots: INTJ-register description
  - Tending reader seeing partner's dots: ESFJ-register description
- Content from MASTER docs — Cursor imports. Does not write.
- If partner has not logged today: "No reading yet today."

### History tab
- Last 30 days of own dot scores
- Rendered as a small dot grid (6 columns × 5 rows)
- Dot color: tradition gold/rose at full opacity = 5, decreasing opacity to 20% at 1
- No numbers. Visual pattern only.

## PARTNER MOOD FIREBASE LISTENER

```typescript
// Fires whenever partner logs mood
onValue(ref(db, `households/${householdId}/mood/${partnerUid}/${todayKey}`),
  snap => setPartnerDot(snap.val()?.dotScore ?? null)
);
```

## MOOD ENTRY IN PLANNER

The planner Today tab includes a mood logging item (id: 'mood') as an optional
daily item. Tapping it opens the mood modal directly to the Log tab.
Checking this item marks it done when a score is submitted.
