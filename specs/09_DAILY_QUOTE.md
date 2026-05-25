# DAILY QUOTE SYSTEM

---

## WHAT IT IS

A featured card on the daily planner. Prominent. Visual weight. Not a footnote.
The quote is type-specific. Garrin sees INTJ-resonant quotes. Holli sees ESFJ-resonant quotes.
The same quote shows all day. It rotates at midnight.

---

## QUOTE SOURCES

Quotes are either:
1. Famous real-world quotes chosen to resonate with INTJ or ESFJ cognitive architecture, OR
2. Original quotes in the tradition's voice (from Canon content — oath lines, doctrine lines, etc.)

Groq generates banks of 30 quotes per tradition per month. They are stored locally. 
The app works fully offline — quotes always display from local storage.

---

## GROQ GENERATION PROMPTS

### INTJ / Imperium quote bank generation

```
Generate exactly 30 short quotes for a daily inspiration card in a personal development app
for an INTJ personality type (Ni-Te-Fi-Se cognitive stack).

The person this is written for: decisive, builds in the dark, long-range thinker, does not
perform, does not require approval, operates from internal authority. Precision over warmth.
Architecture over decoration.

Mix these source types equally across the 30:
- Famous quotes from real people (philosophers, military leaders, strategists, writers, scientists)
  that would resonate with someone who plans in decades and builds alone
- Original lines in the voice of someone who has already decided — not striving, not hoping, knowing

Rules for every quote:
- Under 25 words
- No motivational poster tone — too soft, too performed
- No "you can do it" energy — patronizing
- No warmth for its own sake — precision is warmth for this person
- The quote should feel like something a person says when they already know
- It can be quiet or fierce — never loud, never cheerful

Return ONLY a JSON array of 30 strings. No preamble. No explanations. No numbering.
No markdown code fences. Just the raw JSON array.
Example format: ["Quote one.", "Quote two.", ...]
```

### ESFJ / Tending quote bank generation

```
Generate exactly 30 short quotes for a daily inspiration card in a personal development app
for an ESFJ personality type (Fe-Si-Ne-Ti cognitive stack).

The person this is written for: a woman who gives deeply, tends carefully, and has historically
given more than she has received. She is not fragile — she is strong and has been running on
full for a long time. These quotes speak TO her, not about her.

Mix these source types equally across the 30:
- Famous quotes from real people (writers, caregivers, leaders, philosophers) that would speak
  to someone who tends what matters and is learning to tend herself too
- Original lines that speak directly to her — warm, relational, addressed to "you"

Rules for every quote:
- Under 25 words
- Addressed TO her — "you" is fine, "she" is not
- Not sentimental or saccharine — she has earned real language
- About the value of what she carries, the permission to receive, the rightness of tending herself
- Never dismissive of her care and warmth — these are her gifts, not her weakness
- Can be quiet and strong, or gentle and clear

Return ONLY a JSON array of 30 strings. No preamble. No explanations. No numbering.
No markdown code fences. Just the raw JSON array.
```

---

## OFFLINE FALLBACK BANK — 10 QUOTES PER TRADITION

Built into the app. Used if Groq hasn't generated a bank yet.

```typescript
export const IMPERIUM_FALLBACK_QUOTES = [
  "Power from within cannot be revoked.",
  "The amateur waits for inspiration. The professional gets to work.",
  "Plans collapse. Architecture endures.",
  "Every weapon raised against me has only ever sharpened me.",
  "I do not kneel. I endure. I outlast. I build.",
  "My enemies plan in seasons. I plan in decades.",
  "Precision is not coldness. It is care with a sharp edge.",
  "The work is not done. Unfinished.",
  "Do not wait for the world to confirm what you have already decided.",
  "Built in the dark. Visible when it is complete.",
];

export const TENDING_FALLBACK_QUOTES = [
  "The keeper of what matters is never powerless.",
  "Felt. Faithful. Full. Unspent.",
  "You give from fullness. Say so when the cup is empty.",
  "What you tend, you keep. What you keep, endures.",
  "You are not used up by what you give. You remain.",
  "The most important thing you tend today might be yourself.",
  "Warmth freely given is a gift. Warmth maintained past depletion is a debt.",
  "You are not meant to be spent.",
  "Your care is not weakness. It is intelligence.",
  "Rest is not retreat. Rest is the practice.",
];
```

---

## ROTATION LOGIC

```typescript
function getTodayQuote(profile: 'imperium' | 'tending'): string {
  const quotes = loadQuoteBankFromStorage(profile);
  const fallback = profile === 'imperium'
    ? IMPERIUM_FALLBACK_QUOTES
    : TENDING_FALLBACK_QUOTES;

  const bank = quotes.length > 0 ? quotes : fallback;

  // Deterministic rotation — same quote all day, changes at midnight
  const dayNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return bank[dayNumber % bank.length];
}
```

---

## QUOTE CARD UI

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  "The amateur waits for inspiration.            │
│   The professional gets to work."               │
│                                                 │
│  — Steven Pressfield                            │
│                                                 │
└─────────────────────────────────────────────────┘
```

- Background: tradition surface color
- Quote text: 16px, tradition accent color
- Attribution: 12px, muted
- Card has subtle border in tradition accent
- Tapping the card does nothing (no navigation needed in Phase 1)
- Card sits below the morning declaration, above the day plan

---

## QUOTE BANK REFRESH

```typescript
// Cloud Function: generateQuoteBank
// Called once per month, or when bank runs low (< 5 remaining)
// Stores 30 new quotes in Firebase for device to download
// Device stores locally in AsyncStorage

async function refreshQuoteBank(profile: Profile) {
  const lastRefresh = await AsyncStorage.getItem(`quoteRefresh_${profile}`);
  const daysSinceRefresh = daysBetween(new Date(lastRefresh), new Date());

  if (daysSinceRefresh >= 25) {
    const newQuotes = await callCloudFunction('generateQuoteBank', { profile });
    await AsyncStorage.setItem(`quoteBank_${profile}`, JSON.stringify(newQuotes));
    await AsyncStorage.setItem(`quoteRefresh_${profile}`, new Date().toISOString());
  }
}
```

