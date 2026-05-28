# 09 — DAILY QUOTE SYSTEM

## DISPLAY

Location: Home tab, below shift strip, above hub tiles.
Style: left-border gold (Imperium) or rose (Tending), italic, Cormorant font.
One quote per day. Does not change within a day.

## ONLINE PATH (Groq)

Generate 30 quotes per tradition per month at start of each month.
Store in quote_bank SQLite table (see 02_FIREBASE_SCHEMA.md schema).
Rotate daily: select unused quote, mark used=1.
Regenerate when used count reaches 28.

Groq system prompt for quote generation — Cursor imports verbatim, does not write:
```
// TODO: quote generation prompt from MASTER_IMPERIUM.md / MASTER_TENDING.md
// Cursor leaves this as TODO and imports the prompt from the master docs.
// The prompt should instruct the model to generate quotes matching the
// tradition's axiom, register, and doctrine — not generic inspirational content.
```

## OFFLINE FALLBACK

30 hardcoded quotes per tradition in packages/shared/data/quotes.ts.
Content imported verbatim from MASTER_IMPERIUM.md and MASTER_TENDING.md.
Cursor does NOT write quote text. If not locatable in master docs: TODO placeholder.

```typescript
// packages/shared/data/quotes.ts
export const QUOTES = {
  IMP: [
    // TODO: 30 quotes from MASTER_IMPERIUM.md — Cursor imports verbatim
  ],
  TEND: [
    // TODO: 30 quotes from MASTER_TENDING.md — Cursor imports verbatim
  ],
};
```

## SELECTION LOGIC

```typescript
function getTodayQuote(profile: 'IMP' | 'TEND'): string {
  // 1. Check quote_bank for unused quote for today's month
  // 2. If found: return it
  // 3. If not found (offline or not generated): return fallback
  //    Fallback: QUOTES[profile][dayOfYear % 30]
  // 4. Mark returned quote as used
}
```
