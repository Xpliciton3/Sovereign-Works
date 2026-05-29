# FIX 02 — MOOD GROQ TRANSLATION
# The mood note Groq translation is partially wired in the APK
# but the full flow is incomplete. This file completes the spec.

---

## WHAT THE APK HAS (CONFIRMED WORKING)

- generatePartnerNote() function exists and fires after mood save
- Groq call to llama-3.3-70b-versatile with mood score + raw note
- Result stored as partnerNote in mood log
- 5-dot partner card on Home tab reads dotScore

---

## WHAT IS MISSING

1. **Translation preview before sync** — The translated note is stored
   immediately. Practitioner has no chance to review it before it
   is queued to Firebase.

2. **Keep Private option** — No way to save a mood note locally without
   it ever reaching Firebase.

3. **Full mood modal with 3 tabs** — Only Log tab exists.
   Partner tab and History tab are absent.

4. **Mood in wrong location** — Mood entry appears outside the Mind hub.
   It must live only in the Mind hub tile expansion.

---

## CORRECTED MOOD FLOW

```
Practitioner opens mood modal from Mind hub tile (tap) or Planner mood item

TAB 1 — LOG
  1. Score selector: 5 large circular buttons (1–5)
     Color: 1=deep red, 2=orange, 3=amber, 4=teal-ish, 5=gold
     Labels from 03_PROFILES.md bracket text (INTJ or ESFJ version)
  2. Optional private note field (multiline, 500 char max)
     Privacy note above field: "This note stays on your device."
  3. [Save Entry] button
     → writes to SQLite mood_entries table
     → if Groq key exists AND note is non-empty:
         calls Groq to generate partner translation
         shows TRANSLATION PREVIEW SCREEN (see below)
     → if no note or no Groq key:
         stores dotScore to Firebase directly
         closes modal

TRANSLATION PREVIEW SCREEN (fullscreen overlay, not a new tab)
  Shows:
    "Your entry: [score]/5 — [bracket label]"
    "Your note will not be shared."
    "Translation for [partner name]:"
    [The Groq-generated translation in the partner's tradition voice]
    
  Two buttons:
    [Send to Partner]  — queues translated note to Firebase, closes
    [Keep Private]     — stores locally only, syncs dotScore only, closes

TAB 2 — PARTNER
  Reads from Firebase: households/{id}/mood/{partnerUid}/{todayKey}
  Shows:
    - 5 dot circles filled to partner's dot score
    - Tradition-appropriate description below dots:
        INTJ reading Tending dots: INTJ register description
        ESFJ reading Imperium dots: ESFJ register description
    - One-line Groq-translated partner note (if shared)
    - "No reading yet today." if partner has not logged

TAB 3 — HISTORY
  Scrollable list, newest first
  Each entry:
    - Date label
    - Score as colored dot (same 5-color scheme)
    - Tap to expand: shows original private note
    - Swipe to delete with confirmation ("Delete this entry?")
  
  7-day mini chart below list:
    7 dots in a row, colored by score, grayed if no entry
```

---

## GROQ TRANSLATION PROMPT

```typescript
// packages/shared/src/ai/groqMoodTranslation.ts

const MOOD_TRANSLATION_SYSTEM = `You write warm, brief 1-2 sentence 
emotional summaries for a partner. The reader is the practitioner's 
spouse or partner. Use natural, caring language.

CRITICAL RULES:
- Never use numbers or scores
- Never use clinical vocabulary (mood, psychology, functioning, etc.)
- Never reproduce the raw note text
- Write in third person about the practitioner
- Translate the emotional gist, not the literal content
- Match the reader's tradition register (given in the user message)
- Keep it brief: 1-2 sentences only`;

async function generateMoodTranslation(
  score: number,      // 1-5 dot score
  rawNote: string,    // private note text
  readerTradition: 'imperium' | 'tending',
  groqKey: string
): Promise<string> {
  const registerNote = readerTradition === 'imperium'
    ? 'The reader values directness and understands things in terms of strength, clarity, and mission. Write in those terms.'
    : 'The reader values warmth, connection, and care. Write in terms of feelings, relationship, and being present.';
  
  const prompt = `Score: ${score}/5. Raw note: "${rawNote}".
${registerNote}
Write a 1-2 sentence translation for this reader.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${groqKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 100,
      temperature: 0.65,
      messages: [
        { role: 'system', content: MOOD_TRANSLATION_SYSTEM },
        { role: 'user', content: prompt },
      ],
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
}
```

---

## FIREBASE WRITE — WHAT SYNCS

Only these fields ever leave the device:

```typescript
// Firebase path: households/{householdId}/mood/{uid}/{dateKey}
{
  dotScore: number,      // Math.ceil(rawScore / 2), range 1-5
  partnerNote: string,   // Groq-translated version — if user tapped [Send to Partner]
  ts: number,            // unix timestamp
}

// NEVER written to Firebase:
// - rawScore
// - rawNote
// - bracket label text
// - any user-typed text
```

---

## MOOD ENTRY IN PLANNER

The planner item id 'mood' ("Log Mood") in Today sub-tab:
- Tapping it opens the mood modal directly to the Log tab
- Completing the log (any path through) marks the planner item done
- Planner item does NOT include a score entry itself — modal handles it

---

## SQLITE TABLES

```sql
-- mood_entries: raw private data, never leaves device
CREATE TABLE IF NOT EXISTS mood_entries (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,           -- YYYY-MM-DD
  dot_score INTEGER NOT NULL,   -- 1-5
  raw_note TEXT,                -- private, device only
  partner_note TEXT,            -- Groq translation, only if user sent
  sent_to_partner INTEGER DEFAULT 0,  -- 1 if user tapped [Send to Partner]
  created_at INTEGER NOT NULL
);

-- mood_partner_cache: last-read partner dot scores, for offline display
CREATE TABLE IF NOT EXISTS mood_partner_cache (
  uid TEXT NOT NULL,
  date TEXT NOT NULL,
  dot_score INTEGER,
  partner_note TEXT,
  synced_at INTEGER,
  PRIMARY KEY (uid, date)
);
```

---

## BUILD SEQUENCE

```
M.01  Remove mood entry from anywhere outside Mind hub
      (confirmed issue in APK v1.0.10)

M.02  Build mood modal with 3 tabs: Log, Partner, History

M.03  Build Translation Preview Screen overlay
      (shows before any Firebase write if note + Groq key present)

M.04  Wire [Send to Partner] → queues to Firebase sync
M.05  Wire [Keep Private] → skips Firebase translation sync

M.06  History tab: scrollable list, swipe-to-delete, 7-day mini chart

M.07  Partner tab: Firebase listener for partner dotScore + partnerNote

M.08  Mind hub tile: tap opens mood modal, dot count shows on tile

M.09  Planner mood item: tap opens mood modal Log tab directly

M.10  Verify: raw note never appears in Firebase (check network traffic)
M.11  Verify: Translation Preview shows before any sync occurs
M.12  Verify: Keep Private → partner tab shows dotScore only (no note)
```
