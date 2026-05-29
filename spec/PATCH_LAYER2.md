# PATCH — LAYER2_PRIME_PROMPT CORRECTIONS
# Apply these corrections to LAYER2_PRIME_PROMPT.md before using it.
# Do not rewrite the whole file — patch these specific lines only.

---

## PATCH L2-A — DOT SCORE FORMULA (C-07 fix)

FIND (line ~490):
```
// What syncs to Firebase: dot score (Math.round(score/2), 1–5) only
```

REPLACE WITH:
```
// What syncs to Firebase: dot score (Math.ceil(score/2), 1–5) + Groq translation
// Raw score (1–10) NEVER syncs. Raw note text NEVER syncs.
// Use Math.ceil consistently — not Math.round. They produce same results for integers
// but Math.ceil is the spec-authoritative formula (08_MOOD_SYSTEM.md).
```

---

## PATCH L2-B — MOOD ENTRY SCORE RANGE (C-01 fix)

FIND any line in LAYER2 that says "1–5 score input" or "1–5 dot selector" in the
context of the mood ENTRY screen (not the partner display):

REPLACE WITH:
```
// Mood entry: 1–10 raw score (slider or numbered tap row — see sovereign_v9.jsx)
// The 1–5 dot score is the DISPLAY format for partner. Entry is always 1–10.
```

The 1–5 range in mood context ALWAYS refers to the dot score shown to the partner.
The raw entry the practitioner taps/slides is ALWAYS 1–10.

---

## PATCH L2-C — TAB STRUCTURE NOTE (C-17 fix)

At the top of LAYER2_PRIME_PROMPT.md, add this NOTE block:

```
# ══════════════════════════════════════════════════════════════
# NOTE ON TAB STRUCTURE
# Layer 2 builds: Home | Planner | Nourish | More (4 tabs)
# FIX_04_05_06_FIXED.md migrates this to: Home | Planner | Mind | Body | Soul (5 tabs)
# FIX_04_05_06 MUST be applied before Layer 3 begins.
# Layer 3 and Layer 4 assume the 5-tab REVISED structure.
# ══════════════════════════════════════════════════════════════
```

---

## PATCH L2-D — GBP NOT TENDING-ONLY (C-02 fix)

If LAYER2 references GBP or gastric bypass as "Tending app only," correct to:
```
// GBP/Bariatric toggle applies to BOTH apps.
// packages/shared dietaryProfile is shared. Garrin (Imperium) had gastric bypass surgery.
```
