# 03 — PROFILES

## TWO PROFILES, TWO SEPARATE APPS

| Field | Imperium (Garrin) | Tending (Holli) |
|-------|-------------------|-----------------|
| Type | INTJ | ESFJ |
| Tradition | The Uncrowned | The Unspent |
| App | apps/imperium | apps/tending |
| Language | Vel'nar | Nen'thara (register only — not constructed) |
| Accent color | #B8962E (gold) | #C47878 (rose) |
| Background | #0D0D0D | #120A0E |
| Sigil | Quill over crossed swords | Heart of flame |
| Axiom | Power from within cannot be revoked. | The keeper of what matters is never powerless. |
| Short axiom | Uncrowned. Unbowed. Unbroken. Unfinished. | Felt. Faithful. Full. Unspent. |
| Practice | Warrior's Practice (Iaido, Kyudo, Systema) | Keeper's Practice (Yoga, Strength, Walking) |
| Internal key | 'IMP' | 'TEND' |

## PROFILE SELECTION

On first launch, the user selects their tradition. This selection is permanent
and stored in SQLite (profile_key: 'IMP' | 'TEND').

The tradition cannot be changed without reinstalling the app. This is intentional.

## HOUSEHOLD RELATIONSHIP

Garrin (IMP) and Holli (TEND) are in the same household.
Garrin's app: memberA. Holli's app: memberB.
Each app shows the other's mood in their tradition's register.
The Household tab (partner card) shows both profiles.

## WHAT CHANGES PER TRADITION

Everything that has text changes. Code structure is identical across both apps.
The only differences are:
- Colors (gold vs rose)
- Axioms and declaration text (from MASTER docs — Cursor imports)
- Planner items (Imperium has Midday Anchor; Tending has Morning Quiet, Replenishment)
- Practice names (Warrior's Practice vs Keeper's Practice)
- Quote register (Imperium vs Tending quotes)
- Mood translation brackets (from sovereign_v9.jsx — import verbatim)

## MOOD TRANSLATION BRACKETS

```typescript
// From sovereign_v9.jsx — import verbatim, do not rewrite
const MOOD_BRACKETS = {
  IMP: [
    { min: 1,  max: 2,  text: "Below operational threshold. Conserve. Do not engage." },
    { min: 3,  max: 4,  text: "Running low. Reduce inputs. Hold the line." },
    { min: 5,  max: 6,  text: "Functional. Watchful. Processing." },
    { min: 7,  max: 8,  text: "Clear. Operational. The work is moving." },
    { min: 9,  max: 10, text: "Sovereign state. Full capacity. Uncrowned." },
  ],
  TEND: [
    { min: 1,  max: 2,  text: "The reservoir is empty. Withdraw. Tend yourself first." },
    { min: 3,  max: 4,  text: "Running low. You have given past the line. Rest." },
    { min: 5,  max: 6,  text: "Present. Tending. Watching the field." },
    { min: 7,  max: 8,  text: "Warm and full. The giving is genuine today." },
    { min: 9,  max: 10, text: "Inexhaustible. Full. Unspent." },
  ],
};
```
