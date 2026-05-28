# FIX 01 — ICONS AND VISUAL MATCH
# Apply this fix before proceeding to Layer 3.
# This is a targeted correction — do not rebuild from scratch.

---

## THE TWO PROBLEMS

### Problem 1 — Icons are blank

The tab bar icons and all in-app icons render as nothing.
Root cause: the build is passing icon name strings (like "home", "plan", "leaf")
to a component that expects SVG path data, or no icon renderer was wired up at all.

The prototype renders all icons using a single SVG component (`Svg`) that reads
from the `IC` constant. That pattern must be replicated exactly in React Native
using `react-native-svg`.

### Problem 2 — Screens don't visually match the prototype

Every screen must be visually audited against `sovereign_v9.jsx` running in a browser.
The prototype is the contract. Open it now and keep it open.

---

## THE ICON SYSTEM — IMPLEMENT THIS EXACTLY

### Step 1 — Install react-native-svg

```bash
cd apps/imperium && npx expo install react-native-svg
cd ../tending && npx expo install react-native-svg
```

### Step 2 — Create the icon constant in packages/shared/ui/icons.ts

```typescript
// packages/shared/ui/icons.ts
// These are the EXACT paths from sovereign_v9.jsx — do not modify them

export const IC: Record<string, string> = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z|M9 22V12h6v10",
  plan: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2|M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2|M9 12l2 2 4-4",
  leaf: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z|M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
  more: "M3 6h18|M3 12h18|M3 18h18",
  check: "M20 6L9 17l-5-5",
  lock: "M5 11V7a7 7 0 0 1 14 0v4|M3 11h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  back: "M15 18l-6-6 6-6",
  brain: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.16|M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.16",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  drop: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9|M13.73 21a2 2 0 0 1-3.46 0",
  x:    "M18 6L6 18|M6 6l12 12",
};
```

### Step 3 — Create the Svg component in packages/shared/ui/Svg.tsx

The `|` character separates multiple SVG paths within a single icon.
Each segment is one `<Path>` element inside the same `<Svg>`.

```typescript
// packages/shared/ui/Svg.tsx
import React from 'react';
import { Svg as RNSvg, Path } from 'react-native-svg';
import { IC } from './icons';

interface SvgProps {
  name: keyof typeof IC;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function SvgIcon({ name, size = 20, color = '#E8E0D0', strokeWidth = 1.5 }: SvgProps) {
  const pathData = IC[name];
  if (!pathData) return null;

  const segments = pathData.split('|');

  return (
    <RNSvg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {segments.map((d, i) => (
        <Path key={i} d={d} />
      ))}
    </RNSvg>
  );
}
```

### Step 4 — Replace ALL icon usage in the app

Find every place where an icon is rendered (tab bar, hub tiles, planner rows,
cart buttons, mood modal, everything) and replace with `<SvgIcon name="..." />`.

The tab bar specifically:
```typescript
// In your bottom tab navigator, for each tab:
tabBarIcon: ({ color, focused }) => (
  <SvgIcon
    name="home"   // or "plan", "leaf", "more"
    size={20}
    color={color}
    strokeWidth={focused ? 2 : 1.5}
  />
)
```

---

## VISUAL AUDIT — EVERY SCREEN

Open `sovereign_v9.jsx` in a browser. Side by side with the running app.

Go through EVERY screen and fix every visual discrepancy. Check specifically:

### Home Tab
- [ ] Background: Imperium = #0D0D0D, Tending = #120A0E
- [ ] Shift strip at top: text legible, correct layout
- [ ] Quote: italic, left gold/rose border, Cormorant font (or system serif fallback)
- [ ] Partner card: 5 dot circles, correct color
- [ ] Mind / Body / Soul tiles: dark surface, correct labels, SvgIcon on each
- [ ] Body tile expanded: hydration ring/bar visible, + buttons work
- [ ] Axiom text at bottom in italic font

### Planner Tab
- [ ] Today items render as rows with color dots
- [ ] Expand/collapse on tap works
- [ ] Expanded breakfast: ingredient list with + Cart buttons on RIGHT side of each row
- [ ] Expanded breakfast: numbered cooking steps below ingredients
- [ ] Expanded breakfast: macro strip (CAL / PRO / CARB / FAT / FIBER) at top
- [ ] Bedtime row: "Set Alarm" button on the RIGHT side of the row header (not inside expansion)
- [ ] Checked items: checkbox fills with teal color

### Nourish Tab — Plan
- [ ] 4 weeks collapsible
- [ ] Week expands to days, day expands to 3 meal slots
- [ ] Each meal: macro strip, ingredient list with + Cart, numbered steps
- [ ] "Add All Week" button at top of expanded week

### Nourish Tab — Grocery
- [ ] Categories with colored dot headers
- [ ] Items with amounts, × remove button, checkbox
- [ ] Checked items move to "In Basket" section (dimmed, strikethrough)
- [ ] "Clear Checked" button when ≥1 item checked
- [ ] Ceremony category in purple (#7a5a8a) when ceremony items present

### More Tab
- [ ] Stub screens show tradition sigil, section name, "Coming in a future layer." text
- [ ] Settings section fully functional (all toggles work)
- [ ] No crashes, no blank screens

---

## FONTS

The prototype uses Cormorant Garamond for display text.
In React Native, load fonts via expo-google-fonts or bundle directly:

```bash
npx expo install @expo-google-fonts/cormorant-garamond @expo-google-fonts/josefin-sans expo-font
```

In _layout.tsx:
```typescript
import {
  useFonts,
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import {
  JosefinSans_300Light,
  JosefinSans_400Regular,
  JosefinSans_600SemiBold,
} from '@expo-google-fonts/josefin-sans';

// Load fonts before rendering
const [fontsLoaded] = useFonts({
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_600SemiBold,
  JosefinSans_300Light,
  JosefinSans_400Regular,
  JosefinSans_600SemiBold,
});

if (!fontsLoaded) return null;
```

If fonts fail to load, fall back to system-ui serif/sans-serif — do NOT leave
text rendering in the default React Native font (it won't match the prototype).

---

## AFTER COMPLETING THIS FIX

1. Run through ALL visual audit checkboxes above and confirm each passes
2. Build both APKs:

```bash
cd apps/imperium && npx eas build --platform android --profile preview --local
cd ../tending  && npx eas build --platform android --profile preview --local
```

3. Push to GitHub:
```bash
git add -A
git commit -m "Fix 01 — icons wired, visual match to prototype complete"
git push origin main
```

4. Tell Garrin:
   - "Fix 01 complete."
   - "Imperium APK: [filename]"
   - "Tending APK: [filename]"
   - "Install both and confirm icons and layout match the prototype."
   - "Tell me when you're ready for Layer 3."

DO NOT begin Layer 3 until Garrin confirms.
