# FIX 02 — MOOD NOTE GROQ TRANSLATION
# Apply immediately. This does not require rebuilding Layer 2 from scratch.
# Targeted change: mood modal note field → Groq translation → partner-facing text.

---

## WHAT IS WRONG

The mood modal captures a score (1–10) and a free-text note.
The "Auto-Translation" section currently shows a hardcoded bracket string
based on the score number only (e.g. score ≤4 = "He's running low today...").
The note the user types is stored privately but never processed.

## WHAT IT SHOULD DO

When the user types a note and taps submit (or after a 1.5-second debounce
from the last keystroke), the note goes to Groq with the score as context.
Groq returns a translation in the partner's tradition register.
That translation replaces the hardcoded bracket text in the "what your partner
will see" preview area.

The raw note NEVER leaves the device. Only the Groq-translated output syncs
to Firebase as the partner-facing text.

---

## THE GROQ CALL

### System prompt for INTJ (Garrin logging, Holli reads)

```
You are a mood translator for The Sovereign Traditions. The user is Garrin (INTJ, The Uncrowned). His partner is Holli (ESFJ, The Unspent/Keeper).

Garrin has logged a mood score of {score}/10 and written this private note:
"{note}"

Translate this into a 2–3 sentence message that Holli will see in her app.
Write it in the ESFJ register: warm, relational, specific, actionable.
Tell her what tonight looks like and one concrete thing that helps.
Do NOT include the raw score number. Do NOT quote the original note.
Do NOT mention "INTJ" or "ESFJ" or "traditions."
Keep it under 60 words. Return only the translated message, no preamble.
```

### System prompt for ESFJ (Holli logging, Garrin reads)

```
You are a mood translator for The Sovereign Traditions. The user is Holli (ESFJ, The Unspent/Keeper). Her partner is Garrin (INTJ, The Uncrowned).

Holli has logged a mood score of {score}/10 and written this private note:
"{note}"

Translate this into a 2–3 sentence message that Garrin will see in his app.
Write it in the INTJ register: direct, clear, specific, no softening.
Tell him the current state and the one most useful response.
Do NOT include the raw score number. Do NOT quote the original note.
Do NOT mention "INTJ" or "ESFJ" or "traditions."
Keep it under 60 words. Return only the translated message, no preamble.
```

---

## IMPLEMENTATION

### 1 — Create packages/shared/ai/moodTranslation.ts

```typescript
import Groq from 'groq-sdk';
import { getGroqKey } from '../db/settings';

const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPTS = {
  IMP: (score: number, note: string) =>
    `You are a mood translator for The Sovereign Traditions. The user is Garrin (INTJ). His partner is Holli (ESFJ/Keeper).

Garrin has logged a mood score of ${score}/10 and written this private note:
"${note}"

Translate this into a 2–3 sentence message Holli will see. Write in the ESFJ register: warm, relational, specific, actionable. Tell her what tonight looks like and one concrete thing that helps. Do NOT include the score number. Do NOT quote the note. Do NOT mention personality types or tradition names. Under 60 words. Return only the translated message.`,

  TEND: (score: number, note: string) =>
    `You are a mood translator for The Sovereign Traditions. The user is Holli (ESFJ/Keeper). Her partner is Garrin (INTJ/Uncrowned).

Holli has logged a mood score of ${score}/10 and written this private note:
"${note}"

Translate this into a 2–3 sentence message Garrin will see. Write in the INTJ register: direct, clear, no softening. Tell him the current state and the one most useful response. Do NOT include the score number. Do NOT quote the note. Do NOT mention personality types or tradition names. Under 60 words. Return only the translated message.`,
};

export async function translateMoodNote(
  score: number,
  note: string,
  profile: 'IMP' | 'TEND'
): Promise<string> {
  const apiKey = await getGroqKey();

  // If no note provided, fall back to bracket label
  if (!note.trim()) {
    return getFallbackTranslation(score, profile);
  }

  // If no API key, fall back to bracket label
  if (!apiKey) {
    return getFallbackTranslation(score, profile);
  }

  try {
    const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
    const response = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 120,
      temperature: 0.6,
      messages: [
        {
          role: 'user',
          content: SYSTEM_PROMPTS[profile](score, note),
        },
      ],
    });

    const translation = response.choices[0]?.message?.content?.trim();
    if (!translation) return getFallbackTranslation(score, profile);
    return translation;

  } catch (err) {
    console.error('Mood translation failed:', err);
    return getFallbackTranslation(score, profile);
  }
}

function getFallbackTranslation(score: number, profile: 'IMP' | 'TEND'): string {
  const brackets = {
    IMP: [
      "He's carrying something heavy today. No demands tonight. Just be near.",
      "He's running low today. A quiet evening without expectations is what helps.",
      "He's managing today. Moderate load. A calm evening is welcome.",
      "He's solid today. Good capacity. Connection and conversation are welcome.",
      "He's exceptional today. Clear, resourced. Great night for connection.",
    ],
    TEND: [
      "She's in a hard place today. No processing. Presence only.",
      "She's depleted today. Keep things low-key. Check in gently.",
      "She's holding steady. Present. A check-in is welcome.",
      "She's doing well. She'd welcome real time together.",
      "She's at full capacity. Wonderful day. She'd love to connect.",
    ],
  };

  const idx = score <= 2 ? 0 : score <= 4 ? 1 : score <= 6 ? 2 : score <= 8 ? 3 : 4;
  return brackets[profile][idx];
}
```

### 2 — Wire it into the mood modal (useMood hook or MoodModal component)

The flow:
1. User types in the note field → debounce 1500ms
2. After debounce fires (or on submit tap), call `translateMoodNote(score, note, profile)`
3. Show a loading state in the translation preview area: "Translating..." in muted text
4. On response: replace the hardcoded bracket text with the Groq translation
5. On submit tap: save the translated text (not the raw note) to SQLite + Firebase

```typescript
// In your mood modal component or useMood hook:

const [translating, setTranslating] = useState(false);
const [translation, setTranslation] = useState('');
const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

// When score changes with no note, update translation immediately (fallback)
useEffect(() => {
  if (!moodNote.trim()) {
    setTranslation(getFallbackTranslation(score, profile));
  }
}, [score]);

// When note changes, debounce the Groq call
const handleNoteChange = (text: string) => {
  setMoodNote(text);

  if (debounceRef.current) clearTimeout(debounceRef.current);

  debounceRef.current = setTimeout(async () => {
    if (!text.trim()) {
      setTranslation(getFallbackTranslation(score, profile));
      return;
    }
    setTranslating(true);
    const result = await translateMoodNote(score, text, profile);
    setTranslation(result);
    setTranslating(false);
  }, 1500);
};

// In the translation preview area, show:
// - "Translating..." while translating
// - The translation string when done
// - The fallback when no note

// On submit:
const handleSubmit = async () => {
  // If note exists but translation isn't ready yet, wait
  if (moodNote.trim() && translating) {
    // Wait for translation to complete
    return;
  }

  const finalTranslation = translation || getFallbackTranslation(score, profile);
  const dotScore = Math.ceil(score / 2);

  // Save to SQLite: score (raw), note (raw), translation, dotScore
  await saveMoodEntry({
    score,
    note: moodNote,          // stays on device only
    translation: finalTranslation,  // this is what partner sees
    dotScore,
    loggedAt: Date.now(),
  });

  // Sync to Firebase: dotScore + translation ONLY (never raw score or note)
  await writeShared(`households/${householdId}/mood/${uid}/${todayKey}`, {
    dotScore,
    translation: finalTranslation,
    updatedAt: Date.now(),
  });

  setShowMood(false);
  setMoodNote('');
  setTranslation('');
  showToast('Shared with ' + partnerName);
};
```

### 3 — Translation preview UI

In the "Auto-Translation — what [partner] will see" block:

```typescript
<View style={styles.translationCard}>
  <Text style={styles.translationLabel}>
    What {partnerName} will see
  </Text>

  {translating ? (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <ActivityIndicator size="small" color={T.teal} />
      <Text style={[styles.translationText, { color: T.t3 }]}>
        Translating...
      </Text>
    </View>
  ) : (
    <Text style={[styles.translationText, { fontStyle: 'italic' }]}>
      {translation || getFallbackTranslation(score, profile)}
    </Text>
  )}

  {/* Dot score preview */}
  <View style={{ flexDirection: 'row', gap: 4, marginTop: 8 }}>
    {[1,2,3,4,5].map(d => (
      <View
        key={d}
        style={{
          width: 10, height: 10, borderRadius: 5,
          backgroundColor: d <= dotScore ? T.teal : T.s3,
          borderWidth: 1, borderColor: T.b2,
        }}
      />
    ))}
  </View>

  <Text style={styles.dotLabel}>
    Dot score only · Raw note stays on device
  </Text>
</View>
```

---

## PARTNER TAB — RECEIVING END

When reading the partner's mood in the Partner tab, display the `translation`
field (not a score-based bracket) pulled from Firebase.

```typescript
// Firebase listener for partner mood:
onValue(
  ref(db, `households/${householdId}/mood/${partnerUid}/${todayKey}`),
  snap => {
    const data = snap.val();
    if (data) {
      setPartnerDot(data.dotScore);
      setPartnerTranslation(data.translation); // ← use this, not a bracket
    }
  }
);

// Display in Partner tab:
<Text style={[styles.translationText, { fontStyle: 'italic' }]}>
  {partnerTranslation || 'No reading yet today.'}
</Text>
```

---

## WHAT DOES NOT CHANGE

- Raw score still determines the dot count (Math.ceil(score/2))
- Raw note never leaves the device
- Raw score never syncs to Firebase
- Fallback brackets still fire when note is empty or Groq key is missing
- The history tab still shows personal dot score chart (no notes displayed)

---

## AFTER COMPLETING THIS FIX

Build both APKs, push to GitHub, tell Garrin:
- "Fix 02 complete."
- "Type something in the mood note field — Groq translates it in real time."
- "APKs: [filenames]"
- "Install and test. Tell me when you're ready for Layer 3."
