# UPDATE_04 — HOUSEHOLD JOIN FLOW

## HOUSEHOLD ID FORMAT
IMP-{6 digits} if creating user is Imperium tradition
TEND-{6 digits} if creating user is Tending tradition
Example: IMP-284751

## PATH A — CREATING THE HOUSEHOLD (first phone)
1. First launch, no householdId in SQLite
2. Generate householdId: `${tradition.toUpperCase().slice(0,3)}-${Math.random().toString().slice(2,8)}`
3. Write to Firebase: households/{id}/meta = { householdId, createdAt, memberA: {uid, displayName, tradition} }
4. Display on invite screen:
   - QR code (react-native-qrcode-svg) encoding the householdId
   - 6-digit code text (last 6 chars of householdId)
   - Share button: native share sheet with link + code
5. Store householdId in SQLite (persists across sessions)

## PATH B — JOINING THE HOUSEHOLD (second phone)
1. Invite screen: "Enter code" text input OR "Scan QR" button
2. Code entry: user types 6-digit code
3. App queries Firebase: find household where householdId ends with code
4. On match: write own profile to households/{id}/meta/memberB
5. Store householdId in SQLite
6. Both phones now listening to same householdId

## QR CODE CONTENT
Encode the full householdId string: "IMP-284751"
react-native-qrcode-svg renders this as a scannable QR

## INVITE SCREEN UI
Show if memberB is undefined (partner has not joined):
- Tradition sigil
- "Invite [partner name]" heading
- QR code (200x200)
- 6-digit code in large display text
- Share button

Show "Connected" when memberB is set.

## ERROR STATES
- Code not found: "No household found with that code."
- Already in household: "You're already connected to a household."
- Network error: "Could not connect. Try again when you have signal."
