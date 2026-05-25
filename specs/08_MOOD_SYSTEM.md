# MOOD TRACKER & BIDIRECTIONAL TRANSLATOR

---

## ARCHITECTURE — NON-NEGOTIABLE

```
RAW MOOD ENTRY (device only, never leaves)
    ↓
GROQ TRANSLATION (Cloud Function call)
    ↓
TRANSLATION PREVIEW SCREEN (user approves or edits)
    ↓
APPROVED TRANSLATION + DOT SCORE only → Firebase
    ↓
PARTNER SEES: warm prose in their register + dots (not numbers)
```

---

## MOOD JOURNAL — PERSONAL VIEW

Accessed from More tab → Mood Journal.

```
MY MOOD — TODAY

How are you today?

[1]──────────────────[10]
 ●

  ◉ 1-3   Heavy. Hard. Depleted.
  ○ 4-6   Managing. Okay. Present.
  ○ 7-10  Good. Solid. Resourced.

(Slider and category options — both available)

What's going on?
┌────────────────────────────────────────────┐
│                                            │
│                                            │
│                                            │
└────────────────────────────────────────────┘
(Multiline textarea — at least 4 lines visible)

[Save Private Only]     [Translate & Share →]
```

**"Save Private Only"** — saves to device. Never goes to Firebase. No translation.
**"Translate & Share →"** — calls Groq, shows preview, waits for approval.

---

## TRANSLATION PREVIEW SCREEN

```
WHAT HOLLI WILL SEE

┌────────────────────────────────────────────┐
│                                            │
│  He's carrying something today. The day    │
│  had weight to it — not crisis, but the    │
│  kind of tired that comes from pushing     │
│  through something that didn't cooperate.  │
│                                            │
│  He's present. He's stable. He could use  │
│  some quiet tonight.                       │
│                                            │
└────────────────────────────────────────────┘

Score shown to her:  ●●●○○  (3/5 dots)
(Never shown as "6/10" — always dots only)

[Edit Translation]        [Send to Household →]
```

"Edit Translation" — makes the translated text editable. Never shows the raw entry during editing.
"Send to Household →" — writes approved translation + dot score to Firebase.

---

## GROQ TRANSLATION PROMPTS

### Garrin's mood → Holli's register (INTJ → ESFJ)

```
You are translating a mood entry from an INTJ man to his ESFJ wife.

The INTJ writes in analytical, efficient language. The ESFJ reads in emotional, relational language.

Your job:
- Translate the emotional CONTENT and STATE — not the words
- Write in warm, relational prose addressed to the reader ("He is..." not "I am...")
- Preserve the accuracy of the emotional state — do not inflate or minimize
- Include: what his emotional state is + one concrete thing she can do or not do
- Never diagnose. Never add drama. Never add what he didn't say.
- End with one concrete, practical line about what he needs right now.

Raw score: {rawScore}/10
His entry: {rawEntry}

Write only the translation. No preamble. No quotation marks. 3-5 sentences.
```

### Holli's mood → Garrin's register (ESFJ → INTJ)

```
You are translating a mood entry from an ESFJ woman to her INTJ husband.

The ESFJ writes in emotional, relational, feeling-based language. The INTJ reads in precise, efficient, actionable language.

Your job:
- Translate the emotional state into precise, actionable information
- Write in clear direct prose: "She is [state]. The load is [level]. [One concrete thing]."
- Preserve accuracy — do not soften or dramatize
- Tell him: what her actual state is, what the load level is, and one concrete thing that helps or doesn't
- Never make him guess. Precision is care in his language.

Raw score: {rawScore}/10
Her entry: {rawEntry}

Write only the translation. No preamble. No quotation marks. 2-4 sentences.
```

---

## PARTNER VIEW

Accessed from More tab → Partner View.

```
HOLLI TODAY

●●●○○                    ← 3 of 5 dots — never a raw number

─────────────────────────────────────────────

He's carrying something today. The day had
weight to it — not crisis, but the kind of
tired that comes from pushing through something
that didn't cooperate. He's present. He's
stable. He could use some quiet tonight.

─────────────────────────────────────────────

WHAT THIS MEANS:
Managing load. Present but running lower.
Give him space first, check in later.

─────────────────────────────────────────────

No entry yet today? → Shows yesterday's entry
"Holli hasn't logged today. Yesterday: [dot display]"
```

**"WHAT THIS MEANS" block** — pre-written, NOT Groq-generated.
Based on dot score range:

```typescript
const PARTNER_GUIDANCE = {
  imperium: {  // Garrin sees Holli's in INTJ register
    '1-2': 'Depleted. Do not add demands. One task: be present and say nothing.',
    '3':   'Running low. Quiet is the correct response. No processing tonight.',
    '4-5': 'Managing. She is present. Check in gently — one question, then listen.',
    '6-7': 'Good capacity. Normal engagement is fine.',
    '8-10': 'Resourced. She is solid. Genuine connection opportunity.',
  },
  tending: {  // Holli sees Garrin's in ESFJ register
    '1-2': 'He is depleted today. He needs quiet space and no expectations. Being nearby without talking is enough.',
    '3':   'He is carrying something. He probably won\'t say much — that\'s okay. Gentle presence, no questions.',
    '4-5': 'He is managing. He is okay. A calm evening together will help more than checking in.',
    '6-7': 'He is doing well today. Connection is welcome. He will be more responsive than usual.',
    '8-10': 'He is solid and resourced. This is a good day for real conversation.',
  },
};
```

---

## MOOD HISTORY (Personal View Only)

```
LAST 7 DAYS

Mon  ●●●●○   Tue  ●●●○○   Wed  ●●●●●
Thu  ●●○○○   Fri  ●●●●○   Sat  ———    Sun  ●●●●○

(dashes = no entry)
```

30-day history available with a "Show more" tap.
History stays on device. Never synced.

---

## TECHNICAL NOTES

```typescript
// Mood data schema — device only (expo-sqlite)
interface MoodEntry {
  id: string;
  date: string;          // YYYY-MM-DD
  rawScore: number;      // 1-10 — NEVER leaves device
  rawText: string;       // user's words — NEVER leaves device
  translatedText?: string;    // after translation
  dotScore?: number;     // 1-5 — sent to Firebase after approval
  shared: boolean;       // was translation approved and shared?
  timestamp: number;
}

// What goes to Firebase — only after explicit approval
interface MoodFirebaseEntry {
  translatedText: string;  // the translated prose only
  dotScore: number;        // 1-5 only
  approved: boolean;
  timestamp: number;
  // NO raw score. NO raw text.
}
```

