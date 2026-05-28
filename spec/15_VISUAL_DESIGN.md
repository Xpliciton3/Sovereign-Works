# 15 — VISUAL DESIGN SYSTEM

## DESIGN PHILOSOPHY
No white backgrounds. No light mode. Dark, focused, intentional.
Every color token must come from this file. Never hardcode hex values in components.

## COLOR TOKENS

### Imperium (INTJ / The Uncrowned)
```typescript
export const IMPERIUM_THEME = {
  // Backgrounds
  bg:      '#0D0D0D',  // primary background
  s1:      '#111111',  // surface 1 — cards
  s2:      '#161616',  // surface 2 — nested cards
  s3:      '#1c1c1c',  // surface 3 — deep nested

  // Text
  text:    '#E8E0D0',  // primary text
  t2:      '#A89880',  // secondary text
  t3:      '#605848',  // tertiary/muted text

  // Borders
  b1:      '#2a2520',  // primary border
  b2:      '#3a3028',  // secondary border

  // Accent — Gold
  gold:    '#B8962E',  // primary gold
  goldBg:  'rgba(184,150,46,0.08)',
  teal:    '#4a8a78',  // completion/check color
  tealBg:  'rgba(74,138,120,0.12)',

  // Tab colors
  cHome:   '#B8962E',  // Home tab accent
  cPlan:   '#8a7a6a',  // Planner tab accent
  cNour:   '#C07040',  // Nourish tab accent

  // Sigil
  sigil:   '#B8962E',

  // Identity
  person:  'GARRIN',
  tradition: 'THE UNCROWNED',
  tagline:   'Uncrowned. Unbowed. Unbroken. Unfinished.',
};
```

### Tending (ESFJ / The Unspent)
```typescript
export const TENDING_THEME = {
  // Backgrounds
  bg:      '#120A0E',  // primary background
  s1:      '#1a0e13',  // surface 1
  s2:      '#200f17',  // surface 2
  s3:      '#26111b',  // surface 3

  // Text
  text:    '#F0E0E8',  // primary text
  t2:      '#C0A0B0',  // secondary text
  t3:      '#806070',  // tertiary/muted text

  // Borders
  b1:      '#2a1820',  // primary border
  b2:      '#3a2030',  // secondary border

  // Accent — Rose
  gold:    '#C47878',  // rose accent (named gold for code compatibility)
  goldBg:  'rgba(196,120,120,0.08)',
  teal:    '#6a8a78',  // completion/check color
  tealBg:  'rgba(106,138,120,0.12)',

  // Tab colors
  cHome:   '#C47878',  // Home tab accent
  cPlan:   '#9a8a8a',  // Planner tab accent
  cNour:   '#C07888',  // Nourish tab accent

  // Sigil
  sigil:   '#C47878',

  // Identity
  person:  'HOLLI',
  tradition: 'THE UNSPENT',
  tagline:   'Unspent. Unbowed. Given Freely. Inexhaustible.',
};
```

## TYPOGRAPHY

Fonts loaded via Google Fonts in app.json or _layout.tsx:

```typescript
// Load these fonts:
// Cormorant_Garamond: 400, 400italic, 600, 700
// Josefin_Sans: 300, 400, 600
// These are free via Google Fonts — no license cost

const FONTS = {
  display:   'CormorantGaramond-Regular',     // headers, axioms, rite text
  displayI:  'CormorantGaramond-Italic',      // quotes, declarations
  displayB:  'CormorantGaramond-SemiBold',    // display headings
  ui:        'JosefinSans-Regular',           // all UI labels
  uiLight:   'JosefinSans-Light',             // secondary UI
  uiSemi:    'JosefinSans-SemiBold',          // tab labels, headers
};

// Font sizes
const FS = {
  display: 26,   // axioms, rite headings
  h1:      20,   // section headers
  h2:      16,   // subsection headers
  body:    14,   // body text
  ui:      12,   // UI labels
  micro:   9,    // small labels, tags, category headers
  tiny:    8,    // timestamps, counts
};
```

## SIGILS

### INTJ — The Uncrowned (quill over crossed swords)
```svg
<!-- Quill over two crossed swords -->
<!-- Black and white line only. No fill gradients. No motion. -->
<!-- SVG path for use in React Native via react-native-svg -->
<!-- Cursor generates the actual SVG path from this description -->
<!-- Width: 80px × 80px viewBox at construction -->
```

### ESFJ — The Unspent (heart of flame)
```svg
<!-- Heart shape with flame rising from the center -->
<!-- Black and white line only. No fill gradients. No motion. -->
<!-- Cursor generates the actual SVG path from this description -->
<!-- Width: 80px × 80px viewBox at construction -->
```

Sigil rendering rules:
- Static only. No animation.
- Single stroke weight throughout.
- Black lines on dark background OR white lines on dark background.
- Imperium: gold color (#B8962E) on home screen. White in other contexts.
- Tending: rose color (#C47878) on home screen. White in other contexts.

## COMPONENT PATTERNS

### Cards
```typescript
// Standard card
{ background: T.s1, borderRadius: 8, border: `1px solid ${T.b1}`, padding: 12 }

// Elevated card (modal, expanded content)
{ background: T.s2, borderRadius: 8, border: `1px solid ${T.b2}`, padding: 16 }
```

### Buttons
```typescript
// Primary action (full width)
{ background: T.goldBg, border: `1px solid ${T.gold}66`, borderRadius: 4,
  padding: '8px 0', color: T.gold, fontSize: 9, letterSpacing: '0.12em',
  textTransform: 'uppercase' }

// Secondary action (inline)
{ background: 'transparent', border: `1px solid ${T.b2}`, borderRadius: 3,
  padding: '4px 10px', color: T.t2, fontSize: 9, letterSpacing: '0.1em' }

// Destructive (remove, clear)
{ background: 'transparent', border: 'none', color: T.t3, fontSize: 15 }
```

### Tab Bar
```typescript
{ background: T.bg, borderTop: `1px solid ${T.b1}`, height: 52,
  position: 'absolute', bottom: 0, left: 0, right: 0 }

// Tab icon: active = T.gold, inactive = T.t3
// Tab label: fontSize 7, letterSpacing 0.14em, uppercase
// Tabs: Home, Planner, Nourish, More
```

### Status Bar
```typescript
// Always dark content. Set in _layout.tsx:
<StatusBar style="light" />
// backgroundColor: T.bg
```

## QUOTE DISPLAY

Imperium:
```typescript
{ borderLeft: `2px solid ${T.gold}`, paddingLeft: 12,
  fontFamily: FONTS.displayI, fontSize: 15, color: T.t2,
  lineHeight: 24, letterSpacing: '0.02em' }
```

Tending:
```typescript
{ borderLeft: `2px solid ${T.gold}`, paddingLeft: 12,   // T.gold = rose in tending theme
  fontFamily: FONTS.displayI, fontSize: 15, color: T.t2,
  lineHeight: 24, letterSpacing: '0.02em' }
```
