# 02 — FIREBASE SCHEMA AND SECURITY RULES (FIXED)
# Resolves: C-09/C-15 (dietary Firebase path added), C-11 (translation syncs)

## DATABASE STRUCTURE

```
households/
  {householdId}/
    meta/
      householdId: string
      createdAt: number
      memberA: { uid, displayName, tradition }
      memberB: { uid, displayName, tradition }   ← undefined until partner joins

    mood/
      {uid}/
        {dateKey}/     ← "2025-01-14"
          dotScore: 1–5          ← syncs (C-11 fix: LAYER4 was wrong to omit translation)
          translation: string    ← syncs (Groq output only — NEVER raw note text)
          updatedAt: number
    
    grocery/
      currentList/
        {itemKey}/
          name, amt, unit, count, checked, addedBy, updatedAt

    planner/
      {uid}/
        {dateKey}/
          {itemId}/
            done: boolean
            completedAt: number

    hydration/
      {uid}/
        {dateKey}/
          totalOz: number
          updatedAt: number

    dietary/                             ← NEW PATH (C-09/C-15 fix)
      {uid}/
        nutFree: boolean
        gerd: boolean
        glutenFree: boolean
        dairyFree: boolean
        mthfr: boolean
        gastricBypass: boolean           ← both apps, not Tending-only (C-02 fix)
        avoidFish: boolean
        avoidRawOnion: boolean
        avoidCilantro: boolean
        avoidStrongCheese: boolean
        avoidMushrooms: boolean
        onDutyFirst: boolean
        updatedAt: number
        ← NOTE: customAvoidances raw text stays LOCAL. Only parsed boolean flags sync here.
```

---

## SECURITY RULES

Deploy to Firebase console before testing.
Do not test with open rules.

```json
{
  "rules": {
    "households": {
      "$householdId": {
        ".read": "auth != null && (data.child('meta/memberA/uid').val() === auth.uid || data.child('meta/memberB/uid').val() === auth.uid)",
        ".write": "auth != null && (data.child('meta/memberA/uid').val() === auth.uid || data.child('meta/memberB/uid').val() === auth.uid || !data.exists())"
      }
    }
  }
}
```

---

## SYNC RULES (UPDATED)

| Data | Local SQLite | Firebase |
|------|-------------|----------|
| Raw mood score (1–10) | ✓ | ✗ NEVER |
| Raw mood note text | ✓ | ✗ NEVER |
| Mood dot score (1–5) | ✓ | ✓ syncs |
| Mood Groq translation | ✓ | ✓ syncs (C-11 fix — LAYER4 was wrong) |
| Grocery cart | ✓ | ✓ shared, both read/write |
| Planner completions | ✓ | ✓ shared, partner is read-only |
| Hydration totals | ✓ | ✓ shared |
| Dietary toggles (booleans) | ✓ | ✓ syncs so partner sees warnings (C-09 fix) |
| Custom avoidances text | ✓ | ✗ stays local |
| Schedule / shift settings | ✓ | ✗ stays local (different schedules) |
| Private journal | ✓ | ✗ NEVER |
| Shadow work entries | ✓ | ✗ NEVER |
