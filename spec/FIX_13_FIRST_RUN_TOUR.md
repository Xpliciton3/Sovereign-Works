# FIX 13 — FIRST-RUN GUIDED TOUR
# The desktop Electron app needs a fully specified first-run tour.
# Layer 8 stub (L8.05) says "Cursor does not write tour copy" — this file IS that copy.
# Apply this file when building L8.05. Do not approximate. Import verbatim.

---

## WHERE THIS LIVES

Desktop app (Electron) only.
Phone apps do NOT have this tour — they have the phase gate system instead.

Triggered: on first launch, before surname is entered.
Trigger key: `tourComplete` in electron-store. If false or missing → show tour.
Set to true after the user clicks [Begin] on slide 6.
Never shown again unless electron-store is cleared.

---

## TOUR ARCHITECTURE

6 slides. Full-screen overlay with dark background (#0d0d0d).
Tradition accent color (#c9973a for Imperium gold by default — adapts if tradition detected).
Progress dots at bottom (6 dots, current one filled).
[Back] and [Next] buttons. Slide 6 shows [Begin] instead of [Next].
No skip button. The tour is short enough that skipping is not needed.
Swipe gesture support on touch screens.

---

## THE 6 SLIDES — COMPLETE COPY

### SLIDE 1 — THE HOUSEHOLD

**Header:** The Sovereign Works

**Body:**
This is the household hub. Not a second phone app — a command center.

Everything built on the phones — the daily practice, the doctrine, the planner — flows through a single household. This desktop app is how the household is set up, kept, and monitored.

One surname. One household. Two traditions.

**Visual element:** The household sigil (quill-over-crossed-swords for INTJ or heart-of-flame for ESFJ depending on which tradition is first detected — if unknown, show both). Static black and white line illustration, centered, mid-slide.

---

### SLIDE 2 — THE DAILY PLANNER

**Header:** Everything Runs Through the Planner

**Body:**
The daily planner is the single hub. Not the doctrine tab. Not the practices. The planner.

Every morning it builds the day — what practice is scheduled, when the meals fall, when to hydrate, what shift is being worked. When a night shift runs, the planner adjusts. When a day off opens up, it paces differently.

The phones carry the planner everywhere. The desktop shows it at full width so nothing gets missed.

**Visual element:** Simple wireframe of the planner Today view — checklist of 8 items, each with a time and a checkbox. No real data — illustrative.

---

### SLIDE 3 — THE BOOK

**Header:** The Doctrine Is Not Optional Reading

**Body:**
The Imperium and The Tending each have a complete doctrine — not a self-help summary, a full codex. Oath, Creed, Litany, Covenant, Manifesto, shadow work, meditations, the Rite of entry.

The Eight Who Carry the Fire is the holy book — the mythology behind the eight cognitive functions. It is not required reading on day one. It opens in stages.

The desktop shows the doctrine at full reading width. Use it for the passages that deserve full attention.

**Visual element:** Stack of three open book illustrations, minimal line art, centered.

---

### SLIDE 4 — THE PRACTICE

**Header:** The Practice Is Physical

**Body:**
The Sovereign Works is not a journaling app with an exercise section attached.

The Warrior's Practice (Imperium) and the Keeper's Practice (Tending) are the physical infrastructure the doctrine runs on. Iaido, Kyudo, throwing daggers, Systema for the Uncrowned. Yoga, strength training, breathwork for the Unspent.

Logs go through the phone. The desktop shows full practice libraries, stage guides, and progress across the household.

**Visual element:** Two column icons — left column: crossed swords + bow (Warrior). Right column: yoga figure + dumbbell outline (Keeper). Minimal line art.

---

### SLIDE 5 — THE HOUSEHOLD SYNC

**Header:** Both Phones. One Household.

**Body:**
The desktop generates a QR code. Each phone scans it once. That is the entire setup.

After that, the household syncs automatically — planner completion, mood entries (translated before sharing), hydration logs, practice sessions.

Nothing from one phone appears raw on another. Mood notes are translated into the partner's tradition voice before they arrive. Private notes stay private.

The household sync runs through Firebase. It works on any wifi or cell connection. No account required beyond the household key the QR code creates.

**Visual element:** Two phone outlines connected to a central cloud/server node by a line. Desktop outline connected to the same node. Simple, symmetrical.

---

### SLIDE 6 — THE WATCH

**Header:** The Watches

**Body:**
The Imperium syncs to a Garmin Vivoactive 4. Morning USB connection sends the day's schedule. The watch runs standalone all day — no live connection needed.

The Tending syncs to a Samsung Galaxy Watch. Same architecture — sync in the morning, runs standalone through the shift.

Watch setup happens from this desktop app. The USB instructions and files are in the Watch Setup section. Do that after the household QR code is scanned.

**Button:** [Begin] — large, tradition-colored, centered at bottom

**Visual element:** Garmin watch outline (left) and Galaxy Watch outline (right), centered side by side. Minimal line art.

---

## TOUR COMPONENT SPEC FOR CURSOR

```typescript
// apps/desktop/src/components/FirstRunTour.tsx

interface TourSlide {
  id: number;
  header: string;
  body: string;
  visual: 'household-sigil' | 'planner-wireframe' | 'books' |
          'practice-columns' | 'sync-diagram' | 'watches';
}

// Tour state
const [tourStep, setTourStep] = useState(0);
const [tourVisible, setTourVisible] = useState(!store.get('tourComplete'));

function completeTour() {
  store.set('tourComplete', true);
  setTourVisible(false);
  // Navigate to surname entry screen
}

// Keyboard navigation: ArrowRight / ArrowLeft advance/retreat slides
// Escape does nothing — tour cannot be dismissed except via [Begin]
```

**Styling:**
- Background: #0d0d0d (full viewport overlay)
- Slide container: max-width 640px, centered, padding 48px
- Header: tradition font (Cinzel or fallback serif), 28px, white
- Body: system font, 16px, line-height 1.7, #d4d4d4
- Progress dots: 8px circles, 12px gap, inactive #444, active tradition color
- [Back]: ghost button, border #444, white text
- [Next] / [Begin]: filled, tradition color background, white text, 200px wide
- Visual area: 180px height, centered, line art SVG inline

---

## VISUAL ASSETS

All visuals are static black-and-white line illustrations rendered as inline SVG.
No external images. No motion. No color except the tradition accent on the [Begin] button.

Cursor generates the SVG inline for each slide visual.
Keep them simple — these are schematic icons, not detailed illustrations.

The slide 1 sigil is the canonical sigil from the tradition:
- INTJ sigil: quill over crossed swords (description: see 15_VISUAL_DESIGN.md)
- ESFJ sigil: heart of flame (description: see 15_VISUAL_DESIGN.md)

---

## INTEGRATION WITH L8 BUILD SEQUENCE

This file applies to L8.05 specifically.
After building the tour, verify:

[ ] Tour shows on first launch (electron-store has no tourComplete key)
[ ] Tour does NOT show on second launch (tourComplete: true)
[ ] All 6 slides render correctly with copy from this file
[ ] Progress dots advance correctly
[ ] [Begin] on slide 6 navigates to surname entry screen
[ ] Keyboard left/right arrows advance and retreat slides
[ ] Tour is full-viewport overlay — nothing behind it is interactive
[ ] APP_VERSION bump does NOT reset tourComplete
    (tour is a one-time setup, not a version feature — unlike the phone tutorial)
