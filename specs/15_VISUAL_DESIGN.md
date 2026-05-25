# VISUAL DESIGN — LOOK, FEEL, ICONS, CATEGORIES

---

## DESIGN PHILOSOPHY

**Imperium (Garrin / INTJ):** Clean. Architectural. No decoration for its own sake.
Every element has a reason to exist. The gold is not warm — it is precise.
Typography is upright, structured. Whitespace is used deliberately, not generously.
The app feels like a well-built instrument, not a wellness product.

**Tending (Holli / ESFJ):** Warm. Considered. Visually inviting without being soft.
The rose and ivory feel like a home that's been tended, not a spa.
Typography has curve but not whimsy. Warmth comes from color temperature, not decoration.
The app feels like it cares about the person using it.

---

## TYPOGRAPHY

```typescript
export const TYPOGRAPHY = {
  // Imperium — upright, structured
  imperium: {
    displayFont: 'Cormorant',          // headings, declarations
    bodyFont: 'Inter',                 // all body text, labels, UI
    monoFont: 'JetBrains Mono',        // times, numbers, stats
    displaySize: { xl: 32, lg: 24, md: 20, sm: 16 },
    bodySize: { lg: 16, md: 14, sm: 12 },
    letterSpacing: { display: 2, body: 0.3, caps: 4 },
    lineHeight: { display: 1.2, body: 1.6 },
  },
  // Tending — same fonts, warmer sizing and spacing
  tending: {
    displayFont: 'Cormorant',          // italic in headings
    bodyFont: 'Inter',
    monoFont: 'JetBrains Mono',
    displaySize: { xl: 30, lg: 22, md: 20, sm: 16 },
    bodySize: { lg: 16, md: 14, sm: 12 },
    letterSpacing: { display: 1, body: 0.2, caps: 3 },
    lineHeight: { display: 1.3, body: 1.7 },  // slightly more open
  },
};
```

Install: `expo-google-fonts` with Cormorant Garamond and Inter.

---

## IMPERIUM — FULL DESIGN SPEC

### Color Tokens (Dark Mode)
```
Background:       #0D0D0D    ← near-black, not pure black
Surface:          #141414    ← card backgrounds
Surface Elevated: #1C1C1C    ← modals, sheets
Border:           #2A2A2A    ← subtle dividers
Gold:             #B8962E    ← primary accent
Gold Muted:       #7A5C1E    ← secondary accent, inactive
Text Primary:     #F0EDE6    ← warm white, not pure white
Text Secondary:   #888880    ← labels, timestamps
Text Disabled:    #444440    ← locked tabs, unavailable
Danger:           #8B2020    ← destructive actions only
Success:          #4A7A4A    ← completion, confirmed
```

### Color Tokens (Light Mode)
```
Background:       #F5F0E8    ← warm cream
Surface:          #FFFFFF
Surface Elevated: #FAFAF7
Border:           #D4C8A8
Gold:             #8B6B1A
Gold Muted:       #C4A020
Text Primary:     #1A1208
Text Secondary:   #666050
Text Disabled:    #BBB090
```

### Component Specs

**Alarm Screen (Imperium)**
- Background: #000000 (true black — intentional, alarm is different from the app)
- Time text: #F0EDE6, 72px Cormorant, centered
- Label text: #B8962E, 18px Inter caps, letter-spacing 4
- SNOOZE button: full-width, 1px #B8962E border, #141414 fill, gold text
- DISMISS button: full-width, 1px #2A2A2A border, #141414 fill, muted text
- I'M UP: text link, #B8962E, 16px, centered below buttons

**Are You Awake Screen (Imperium)**
- Background: #000000
- Heading: "ARE YOU AWAKE?" — #F0EDE6, 28px Cormorant, uppercase, centered
- Sub-text: #888880, 14px Inter
- Progress bar: #B8962E fill on #1C1C1C track
- Timer: #B8962E, 24px mono, centered
- I'M AWAKE button: full-width, solid #B8962E fill, #000000 text, bold

**Cards (Planner)**
- Background: #141414
- Border: 1px solid #2A2A2A
- Border-radius: 8px
- Inner padding: 16px
- Accent stripe: 3px left border in #B8962E for featured cards (declaration, quote)

**Morning Declaration Card**
- Left border: 3px solid #B8962E
- Background: #141414
- Text: #F0EDE6, 18px Cormorant italic
- Swipe-down hint: small chevron-down, #2A2A2A, bottom-right

**Daily Quote Card**
- Left border: 3px solid #7A5C1E (muted gold — subordinate to declaration)
- Quote text: #B8962E, 15px Cormorant italic
- Attribution: #888880, 12px Inter

**Tab Bar**
- Background: #0D0D0D
- Active icon: #B8962E
- Inactive icon: #444440
- Active label: #B8962E, 10px Inter, weight 600
- Locked tab icon + label: #333330 (near invisible — present but not calling attention)

**Shift Status Header Strip**
- Background: #141414
- Text: #888880, 12px Inter caps, letter-spacing 3
- ON DUTY indicator: small filled circle #B8962E
- OFF DUTY indicator: small empty circle #444440

---

## TENDING — FULL DESIGN SPEC

### Color Tokens (Dark Mode)
```
Background:       #120A0E    ← deep warm burgundy-black
Surface:          #1C1016    ← card backgrounds
Surface Elevated: #241820    ← modals, sheets
Border:           #2E1820    ← dividers
Rose:             #C47878    ← primary accent
Rose Muted:       #8B4A4A    ← secondary, inactive
Ivory:            #F5E8EC    ← text primary
Ivory Muted:      #AA8888    ← labels, timestamps
Text Disabled:    #5A3A3A
Danger:           #8B2040
Success:          #4A6A4A
```

### Color Tokens (Light Mode)
```
Background:       #FFF5F0    ← warm ivory
Surface:          #FFFFFF
Surface Elevated: #FFF0EC
Border:           #F0D0D0
Rose:             #A85050
Rose Muted:       #E8A0A0
Text Primary:     #200A10
Text Secondary:   #806060
```

### Component Specs

**Alarm Screen (Tending)**
- Background: #1C0810 (deep burgundy — not black)
- Time text: #F5E8EC, 72px Cormorant
- Label text: #C47878, 18px Inter, letter-spacing 2
- SNOOZE button: 1px #C47878 border, rose text
- DISMISS button: 1px #2E1820 border, muted text
- I'M UP: #C47878 text link

**Are You Awake Screen (Tending)**
- Background: #1C0810
- Heading: "ARE YOU AWAKE?" — #F5E8EC, 28px Cormorant
- Progress bar: #C47878 fill
- Timer: #C47878, 24px mono
- I'M AWAKE button: solid #C47878 fill, #F5E8EC text

**Cards**
- Border-radius: 12px (slightly softer than Imperium's 8px)
- Inner padding: 18px
- Morning Declaration: 3px left border in #C47878, italic Cormorant text
- Daily Quote: 3px left border in #8B4A4A

**Tab Bar**
- Active: #C47878
- Inactive: #5A3A3A
- Locked: #2E1820

---

## APP ICONS

### Imperium Icon
- **Design:** The Uncrowned Seal — quill pen over crossed swords
- **Background:** #0D0D0D (near-black)
- **Icon art:** #B8962E (gold line art)
- Style: Clean vector, high contrast, no gradients
- The icon must read clearly at 48×48px (small notification icon) and 512×512px (Play Store)

### Tending Icon
- **Design:** Heart of Flame — flowing lines within a heart shape, flame from center
- **Background:** #120A0E (deep burgundy)
- **Icon art:** #C47878 (rose line art)
- Style: Same clean vector treatment as Imperium icon
- Must read at all sizes

### Icon File Requirements
```
Required exports per app:
  icon.png              → 1024×1024 (app store)
  adaptive-icon.png     → 1024×1024 (Android adaptive foreground)
  notification-icon.png → 96×96 white on transparent (Android notifications)
  splash.png            → 2048×2048 (splash screen background)
  favicon.png           → 196×196 (if any web component)
```

### app.json icon config
```json
// apps/imperium/app.json
{
  "expo": {
    "name": "The Imperium",
    "slug": "the-imperium",
    "icon": "./assets/icon.png",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0D0D0D"
      },
      "package": "com.sovereignworks.imperium"
    },
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#0D0D0D"
    }
  }
}

// apps/tending/app.json
{
  "expo": {
    "name": "The Tending",
    "slug": "the-tending",
    "icon": "./assets/icon.png",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#120A0E"
      },
      "package": "com.sovereignworks.tending"
    },
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#120A0E"
    }
  }
}
```

**CURSOR NOTE:** Generate placeholder icons in the correct colors for the initial build. The canonical sigil art will be provided by the project owner before final APK release. Placeholder: gold quill shape on black for Imperium, rose heart shape on burgundy for Tending.

---

## COLOR-CODED GROCERY CATEGORIES

In the grocery list, each category has a distinct color chip to aid store navigation.

```typescript
export const GROCERY_CATEGORY_COLORS = {
  PRODUCE:          { bg: '#1A2E1A', accent: '#5A9A5A', label: 'PRODUCE' },
  PROTEINS:         { bg: '#2E1A1A', accent: '#9A5A5A', label: 'PROTEINS' },
  DAIRY:            { bg: '#1A2A2E', accent: '#5A8A9A', label: 'DAIRY & EGGS' },
  PANTRY_OILS:      { bg: '#2A2218', accent: '#9A7A3A', label: 'OILS & CONDIMENTS' },
  PANTRY_GRAINS:    { bg: '#22201A', accent: '#8A7A5A', label: 'GRAINS & LEGUMES' },
  PANTRY_CANNED:    { bg: '#1E221E', accent: '#6A8A6A', label: 'CANNED GOODS' },
  PANTRY_BAKING:    { bg: '#241E18', accent: '#9A7A5A', label: 'BAKING & DRY' },
  HERBS_FRESH:      { bg: '#182218', accent: '#4A9A4A', label: 'FRESH HERBS' },
  HERBS_DRIED:      { bg: '#221E18', accent: '#8A6A3A', label: 'DRIED SPICES' },
  FROZEN:           { bg: '#181E2A', accent: '#4A6A9A', label: 'FROZEN' },
  BEVERAGES:        { bg: '#1A1E2E', accent: '#5A6AAA', label: 'BEVERAGES & TEAS' },
  WELLNESS:         { bg: '#201A2A', accent: '#7A5A9A', label: 'WELLNESS & SUPPS' },
  HOUSEHOLD:        { bg: '#1E1E1E', accent: '#6A6A6A', label: 'HOUSEHOLD BASICS' },
};
```

### Grocery Category Header UI
```
┌─────────────────────────────────────────────────┐
│ ●  PRODUCE                           8 items    │
│    ──────────────────────────────────────────   │
│    ☐  Baby spinach           2 bags             │
│    ☑  Avocado                3                  │
│    ☐  Cherry tomatoes        1 pint             │
└─────────────────────────────────────────────────┘
```

- `●` = colored dot in the category accent color
- Header row: category accent color text on category background
- Items: profile body text color, standard surface background
- Checked item: strikethrough, muted text color
- Section is collapsible — tap header to collapse/expand

---

## SHIFT STATUS BADGE — COLOR CODED

```typescript
export const SHIFT_STATUS_COLORS = {
  on_duty:   { bg: '#2E1A1A', text: '#FF6B6B', dot: '#FF4444' },  // red — on duty
  off_duty:  { bg: '#1A2A1A', text: '#6BFF6B', dot: '#44AA44' },  // green — off
  night:     { bg: '#1A1A2E', text: '#6B6BFF', dot: '#4444FF' },  // blue — night shift
  transition:{ bg: '#2A2218', text: '#FFB86B', dot: '#FF8C00' },  // amber — transition day
};
```

Displayed in planner header: `G: ● OFF DUTY   H: ● NIGHT — 7P–7A`

---

## VISUAL CONSISTENCY RULES FOR CURSOR

1. **Never use pure black (#000000) except the alarm screen.** App backgrounds are near-black.
2. **Never use pure white.** Text is warm ivory (#F0EDE6 or #F5E8EC).
3. **Accent color appears on active/important elements only.** Not decorative.
4. **Imperium border-radius: 8px. Tending border-radius: 12px.** Apply consistently.
5. **No shadows in Imperium.** Borders only. Shadows are allowed in Tending (subtle, warm-toned).
6. **Lock icons on gated tabs are muted, not prominent.** Present but not demanding attention.
7. **All touch targets minimum 48×48dp.** Alarm buttons minimum 72px height.
8. **Transitions: 200ms ease-in-out.** No bounce. No spring. Not playful.

