# PATCH — LAYER4_PRIME_PROMPT CORRECTIONS
# Apply these corrections to LAYER4_PRIME_PROMPT.md before using it.

---

## PATCH L4-A — TRANSLATION SYNCS TO FIREBASE (C-11 fix)
# LAYER4 says translation stays local. FIX_02 is authoritative. Translation syncs.

FIND (line ~29):
```
- Mood sync (dot score only — raw note stays local forever)
```
REPLACE WITH:
```
- Mood sync:
    - dotScore (1–5): syncs to Firebase ✓
    - Groq translation: syncs to Firebase ✓  ← FIX_02 is authoritative
    - Raw score (1–10): NEVER leaves device ✗
    - Raw note text: NEVER leaves device ✗
```

---

FIND (line ~79):
```
          dotScore: 1–5         ← ONLY this syncs. Raw note stays on device.
```
REPLACE WITH:
```
          dotScore: 1–5         ← syncs
          translation: string   ← syncs (Groq output only — never raw note text)
```

---

FIND (line ~187–198 — the MOOD SYNC comment block and Firebase write):
```typescript
// WHAT SYNCS:
// dotScore (1–5, rounded from raw 1–10 score)
// updatedAt timestamp

// WHAT NEVER LEAVES THE DEVICE:
// Raw score (the actual 1–10 number)
// Raw note text (the words the user typed)
// Groq translation (generated locally, stored locally)

// Firebase write on mood submit:
await writeShared(
  `households/${householdId}/mood/${uid}/${dateKey}`,
  { dotScore: Math.ceil(score / 2), updatedAt: Date.now() }
);
```

REPLACE WITH:
```typescript
// WHAT SYNCS TO FIREBASE:
// dotScore (1–5) = Math.ceil(rawScore / 2)
// translation = Groq-generated text in partner's tradition register
// updatedAt timestamp

// WHAT NEVER LEAVES THE DEVICE:
// Raw score (the actual 1–10 number)
// Raw note text (the words the user typed)

// Firebase write on mood submit (FIX_02 is authoritative for this structure):
await writeShared(
  `households/${householdId}/mood/${uid}/${dateKey}`,
  {
    dotScore: Math.ceil(score / 2),
    translation: finalTranslation,   // Groq output — never the raw note
    updatedAt: Date.now()
  }
);
```

---

FIND (line ~206 — the partner listener):
```typescript
const partnerMoodRef = ref(db,
  `households/${householdId}/mood/${partnerUid}/${dateKey}`
);
onValue(partnerMoodRef, snapshot => {
  setPartnerDotScore(snapshot.val()?.dotScore ?? null);
});
```

REPLACE WITH:
```typescript
const partnerMoodRef = ref(db,
  `households/${householdId}/mood/${partnerUid}/${dateKey}`
);
onValue(partnerMoodRef, snapshot => {
  const data = snapshot.val();
  setPartnerDotScore(data?.dotScore ?? null);
  setPartnerTranslation(data?.translation ?? null);  // ← add this
});
```

---

## PATCH L4-B — TAB STRUCTURE ASSUMPTION (C-17 fix)

Add at the TOP of LAYER4_PRIME_PROMPT.md, inside the PROTOTYPE LAW block:

```
# ══════════════════════════════════════════════════════════════════
# TAB STRUCTURE REQUIREMENT
# Layer 4 assumes the 5-tab REVISED architecture from FIX_04_05_06_FIXED.md:
# Home | Planner | Mind | Body | Soul
# If the codebase still has the Layer 2 structure (Home | Planner | Nourish | More),
# STOP and apply FIX_04_05_06_FIXED.md first. Do not proceed until tabs match.
# ══════════════════════════════════════════════════════════════════
```
