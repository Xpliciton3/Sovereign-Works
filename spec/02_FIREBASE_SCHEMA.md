# 02 — FIREBASE SCHEMA AND SECURITY RULES

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
          dotScore: 1–5
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
```

## SECURITY RULES
Deploy to Firebase console before testing.

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

## SYNC RULES
- dotScore ONLY syncs to Firebase (raw mood score never leaves device)
- Raw note NEVER leaves device
- Grocery cart IS shared — both users read/write
- Planner completions ARE shared — both users can see (read-only for partner)
- Hydration IS shared — both users see totals
