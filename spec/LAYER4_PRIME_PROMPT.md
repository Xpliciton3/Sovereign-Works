# LAYER 4 PRIME PROMPT — SOVEREIGN WORKS
# Firebase Household Sync + Partner Feed
# Do not begin until all L3.01–L3.24 checkboxes are confirmed.

# ══════════════════════════════════════════════════════════════════
# PROTOTYPE LAW — NON-NEGOTIABLE
# sovereign_v9.jsx is the visual and behavioral contract for every
# screen. Have it open in a browser at all times during this build.
# Every screen must match it. If it doesn't, the screen is wrong.
# ══════════════════════════════════════════════════════════════════

# ══════════════════════════════════════════════════════════════════
# APK REQUIREMENT — MANDATORY FINAL STEP
# After ALL Layer 4 verification checks pass, build both APKs
# and push to GitHub before reporting Layer 4 complete.
# Garrin installs and tests on device before Layer 5 begins.
# ══════════════════════════════════════════════════════════════════

---

## WHAT LAYER 4 BUILDS

Real-time sync between Garrin's phone and Holli's phone.
When Garrin logs a mood — Holli sees it. When Holli adds to the grocery cart
— Garrin sees it. One household. Two phones. One living data layer.

Layer 4 scope:
- Firebase Realtime Database live listeners on both devices
- Mood sync:
    - dotScore (1–5): syncs to Firebase ✓
    - Groq translation: syncs to Firebase ✓ (auto on save — no share button)
    - Raw score (1–10): NEVER leaves device ✗
    - Raw note text: NEVER leaves device ✗
- Grocery cart sync (full shared list, both can add/check/remove)
- Planner completion sync (Garrin checks off "Morning Declaration" — Holli sees it done)
- Partner mood feed rendering (in partner's tradition register)
- Household join flow (QR code + 6-digit code entry)
- Sync status indicator (connected / offline / syncing)
- Offline queue drain on reconnect (SQLite → Firebase)
- Conflict resolution (last-write-wins for all fields)

Layer 4 does NOT include:
- Voice messaging — not in scope
- Photo sharing — not in scope
- Chat — not in scope
- Push notifications from Firebase — that is Layer 6
- Watch sync — separate layer

---

## READ ORDER

1. `02_FIREBASE_SCHEMA.md`         ← database structure and security rules
2. `UPDATE_04_HOUSEHOLD_JOIN.md`   ← household join flow spec
3. `08_MOOD_SYSTEM.md`             ← what syncs and what stays local
4. `03_PROFILES.md`               ← profile types, tradition assignment
5. `17_HOOKS_AND_EXPANSION.md`     ← useHousehold, useMood, useCart hooks
6. `sovereign_v9.jsx`             ← prototype mood feed and partner card

Read all six before writing any code.

---

## CONTENT RULE — UNCHANGED

Cursor does not write partner feed display copy, mood translation text,
or any tradition-specific language. All copy from spec files or placeholder.

---

## FIREBASE SCHEMA — LAYER 4 PATHS

```
households/
  {householdId}/
    meta/
      createdAt: timestamp
      memberA: { uid, displayName, tradition }   ← Garrin / Imperium
      memberB: { uid, displayName, tradition }   ← Holli / Tending
    mood/
      {uid}/
        {dateKey}/              ← "2025-01-14"
          dotScore: 1–5         ← syncs
          translation: string   ← syncs (Groq output only — never raw note text)
          updatedAt: timestamp
    grocery/
      currentList/
        {itemKey}/
          name: string
          amt: string
          unit: GroceryCategory
          count: number
          checked: boolean
          addedBy: uid
          updatedAt: timestamp
    planner/
      {uid}/
        {dateKey}/
          {itemId}/
            done: boolean
            completedAt: timestamp
    hydration/
      {uid}/
        {dateKey}/
          totalOz: number
          updatedAt: timestamp
```

Deploy these security rules from `02_FIREBASE_SCHEMA.md` before testing.
Do not test with open rules — security rules must be correct from the start.

---

## HOUSEHOLD JOIN FLOW

Two paths to join:

### Path A — First phone (creates household)
1. On first launch, if no householdId in SQLite → generate one
2. householdId format: `IMP-{6 random digits}` or `TEND-{6 digits}`
   based on tradition of creating user
3. Write household meta to Firebase
4. Display QR code + 6-digit text code on invite screen
5. Share button: sends GitHub link + code via native share sheet

### Path B — Second phone (joins household)
1. Invite screen shows: "Enter code" text field OR "Scan QR"
2. User enters the 6-digit code from partner's phone
3. App queries Firebase: `households/` where code matches
4. On match: write own profile to `memberB`, store householdId in SQLite
5. Both phones now listening to the same householdId

```typescript
interface HouseholdMeta {
  householdId: string;    // "IMP-284751"
  createdAt: number;
  memberA: HouseholdMember;
  memberB?: HouseholdMember;  // undefined until partner joins
}

interface HouseholdMember {
  uid: string;
  displayName: string;
  tradition: 'imperium' | 'tending';
  joinedAt: number;
}
```

---

## SYNC ARCHITECTURE

```typescript
// writeShared(path, data) — SQLite first, then Firebase
// drainSyncQueue() — fires on: app foreground, network restored, every 5 min

async function writeShared(path: string, data: any): Promise<void> {
  // 1. Write to SQLite immediately (user sees change instantly)
  await sqliteWrite(path, data);
  // 2. Queue for Firebase
  await queueSync(path, data);
  // 3. Attempt immediate Firebase write
  if (networkAvailable()) {
    await firebaseSet(path, data);
    await markSynced(path);
  }
}

async function drainSyncQueue(): Promise<void> {
  const pending = await getPendingSync();  // from sync_queue SQLite table
  for (const item of pending) {
    try {
      await firebaseSet(item.path, JSON.parse(item.payload));
      await markSynced(item.id);
    } catch (e) {
      // Leave in queue — retry next drain
    }
  }
}
```

Conflict resolution: last-write-wins on all fields.
`updatedAt` timestamp on every Firebase node.
If local `updatedAt` > Firebase `updatedAt` → local wins.

---

## MOOD SYNC — EXACT RULES

```typescript
// WHAT SYNCS TO FIREBASE:
// dotScore (1–5) = Math.ceil(rawScore / 2)
// translation = Groq-generated text in partner's tradition register
// updatedAt timestamp

// WHAT NEVER LEAVES THE DEVICE:
// Raw score (the actual 1–10 number)
// Raw note text (the words the user typed)

// Firebase write on mood submit (auto — no manual share step):
await writeShared(
  `households/${householdId}/mood/${uid}/${dateKey}`,
  {
    dotScore: Math.ceil(score / 2),
    translation: finalTranslation,
    updatedAt: Date.now(),
  }
);

// Partner feed reads:
const partnerMoodRef = ref(db,
  `households/${householdId}/mood/${partnerUid}/${dateKey}`
);
onValue(partnerMoodRef, snapshot => {
  const data = snapshot.val();
  setPartnerDotScore(data?.dotScore ?? null);
  setPartnerTranslation(data?.translation ?? data?.translatedText ?? null);
});
```

Partner mood display (from prototype):
- 5 circles rendered, filled count = dotScore
- Tradition-appropriate color (gold for Imperium reader, rose for Tending reader)
- No number shown — dots only
- Label in partner's tradition register (from master docs — Cursor imports, does not write)
- If partner has not logged today → show empty state from spec

---

## GROCERY CART SYNC

The cart is the most active shared data. Both Garrin and Holli can add,
check, and remove items simultaneously.

```typescript
// On addIngredient():
await writeShared(
  `households/${householdId}/grocery/currentList/${itemKey}`,
  { name, amt, unit, count, checked: false,
    addedBy: currentUid, updatedAt: Date.now() }
);

// Live listener — updates local cart state whenever Firebase changes:
const cartRef = ref(db, `households/${householdId}/grocery/currentList`);
onValue(cartRef, snapshot => {
  const data = snapshot.val() || {};
  setCart(data);  // replaces local cart state with Firebase truth
});

// On check/uncheck:
await writeShared(
  `households/${householdId}/grocery/currentList/${itemKey}/checked`,
  true
);

// On remove:
await firebaseRemove(
  `households/${householdId}/grocery/currentList/${itemKey}`
);
```

"Added by" indicator: small dot next to item showing which profile added it.
Imperium color dot = Garrin added. Tending color dot = Holli added.
This is the only identity marker in the cart. No names shown.

---

## PLANNER SYNC

Planner completions sync so each partner can see the other's daily progress.
This is read-only on the partner's side — you cannot check off your partner's items.

```typescript
// On item complete:
await writeShared(
  `households/${householdId}/planner/${uid}/${dateKey}/${itemId}`,
  { done: true, completedAt: Date.now() }
);

// Partner's progress visible on Home tab partner card:
// Shows: X of Y items complete today (number only, not which items)
// Tapping partner card does NOT open their planner
```

---

## SYNC STATUS INDICATOR

Show in the top of the More tab and as a small icon in the shift strip:

```typescript
type SyncStatus = 'connected' | 'offline' | 'syncing' | 'error';

// connected: Firebase listener is live, queue is empty
// offline: no network — all writes queuing to SQLite
// syncing: queue is draining (show brief animation)
// error: Firebase returned an error — show retry button
```

Visual: small colored dot in shift strip header
- Green = connected
- Yellow = syncing
- Gray = offline
- Red = error (tap to retry)

---

## HOUSEHOLD CARD ON HOME TAB

The partner card already exists in the prototype. Wire it to Firebase in Layer 4:

```
┌─────────────────────────────────┐
│ ● HOLLI — THE TENDING          │
│ ○ ○ ● ● ●  (dot score: 3/5)   │
│ 6 of 8 items complete today    │
│ Last synced: 2 minutes ago      │
└─────────────────────────────────┘
```

If partner has not yet joined (memberB is undefined):
Show invite card instead — "Invite Holli" button that opens the share screen.

---

## BUILD SEQUENCE FOR LAYER 4

```
L4.01  Deploy Firebase security rules from 02_FIREBASE_SCHEMA.md
L4.02  Household creation — generate ID, write meta, display QR + code
L4.03  Household join — code entry, QR scan, write memberB to Firebase
L4.04  useHousehold hook — householdId, members, sync status
L4.05  Offline sync queue — drainSyncQueue() wired to app foreground event
L4.06  Mood sync — writeShared on submit, onValue listener for partner
L4.07  Partner mood card on Home tab — dot score display, empty state
L4.08  Grocery cart Firebase listener — setCart from Firebase on change
L4.09  Grocery cart writes — addIngredient, check, remove all use writeShared
L4.10  "Added by" dot indicator on cart items
L4.11  Planner completion sync — writeShared on item complete
L4.12  Partner progress count on Home tab partner card
L4.13  Sync status indicator — dot in shift strip, detail in More tab
L4.14  Invite card when partner has not joined
L4.15  APP_VERSION bumped → tutorial reset on next launch
L4.16  Verify: Garrin logs mood → dot score appears on Holli's phone within 5 sec
L4.17  Verify: Holli adds ingredient → appears in Garrin's cart within 5 sec
L4.18  Verify: Phone goes offline → writes queue → drain fires on reconnect
L4.19  Verify: Both phones check same item → item shows checked on both
L4.20  Verify: memberB undefined → invite card shown, not empty partner card
L4.21  Mark all L4 checkboxes in 21_BUILD_SEQUENCE.md as [x]
```

---

## ══ MANDATORY FINAL STEP — BUILD BOTH APKS ══
## ══ MANDATORY FINAL STEP — BUILD BOTH APKS ══
## ══ MANDATORY — BUILD APKS BEFORE REPORTING LAYER 4 DONE ══
## APK BUILD AFTER LAYER 4

## ══ MANDATORY — BUILD APKS BEFORE REPORTING LAYER 4 DONE ══

### Step 1 — All L4 checks must be [x] first

### Step 2 — Build Imperium APK
```bash
cd C:\SovereignWorks\apps\imperium
npx eas build --platform android --profile preview --local
```

### Step 3 — Build Tending APK
```bash
cd C:\SovereignWorks\apps\tending
npx eas build --platform android --profile preview --local
```

### Step 4 — Push to GitHub
```bash
cd C:\SovereignWorks
git add -A
git commit -m "Layer 4 complete — both APKs rebuilt"
git push origin main
```

### Step 5 — Report and STOP
Tell Garrin:
- "Layer 4 complete."
- "Imperium APK: [filename and location]"
- "Tending APK: [filename and location]"
- "Install both on your phone. Uninstall the Layer 3 versions first."
- "Test both apps. Tell me when you're ready for Layer 5."

Do NOT open LAYER5_PRIME_PROMPT.md until Garrin confirms.


---

## WHAT CURSOR WRITES IN LAYER 4

| File | Cursor writes? |
|------|---------------|
| Firebase config and listener hooks | ✓ Yes |
| useHousehold, useMood, useCart updates | ✓ Yes |
| QR code generation component | ✓ Yes |
| Sync queue logic | ✓ Yes |
| Partner card component | ✓ Yes |
| Partner mood label text | ✗ Never — from MASTER docs |
| Empty state copy | ✗ Never — from MASTER docs |
| Tradition register translations | ✗ Never — from MASTER docs |
