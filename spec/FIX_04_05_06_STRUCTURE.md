# FIX 04 + 05 + 06 — TAB STRUCTURE, INVENTED LOCKS, BAD URL
# Apply after Fix 01, 02, 03.

---

## FIX 04 — WRONG TAB STRUCTURE

### Problem
The app has 5–6 tabs: Home, Planner, Nourish, Doctrine, Warrior (and maybe More).
The spec is exactly 4 tabs: Home, Planner, Nourish, More.
Doctrine and Warrior/Practice screens are sections inside the More tab, not separate tabs.

### Fix
Delete `/(tabs)/doctrine.tsx` and `/(tabs)/warrior.tsx` as tab-level routes.
Both screens become sections accessible from More tab only.

```
apps/imperium/app/(tabs)/
  _layout.tsx    ← 4 tabs: index, planner, nourish, more
  index.tsx      ← Home
  planner.tsx    ← Planner
  nourish.tsx    ← Nourish
  more.tsx       ← More (contains Warrior Practice, Doctrine, Settings, etc.)

REMOVE:
  doctrine.tsx   ← DELETE THIS as a tab
  warrior.tsx    ← DELETE THIS as a tab
```

### Where Warrior's Practice / Keeper's Practice actually lives

**NOT in the More tab. In the Body hub on the Home tab.**

The Body hub tile on the Home tab expands inline to show:
1. Hydration tracker (already built)
2. Warrior's Practice entry point (Imperium) OR Keeper's Practice entry point (Tending)

```typescript
// In the Body hub expanded section (index.tsx / home screen):
// After the hydration tracker block:

{imp ? (
  <TouchableOpacity
    style={styles.practiceRow}
    onPress={() => router.push('/warrior-practice')}
  >
    <Text style={styles.practiceLabel}>WARRIOR'S PRACTICE</Text>
    <Text style={styles.practiceSubLabel}>Iaido · Kyudo · Systema · Daggers</Text>
    <SvgIcon name="back" size={14} color={T.t3} style={{ transform: [{ rotate: '180deg' }] }} />
  </TouchableOpacity>
) : (
  <TouchableOpacity
    style={styles.practiceRow}
    onPress={() => router.push('/keeper-practice')}
  >
    <Text style={styles.practiceLabel}>KEEPER'S PRACTICE</Text>
    <Text style={styles.practiceSubLabel}>Yoga · Strength · Walking · Stillness</Text>
    <SvgIcon name="back" size={14} color={T.t3} style={{ transform: [{ rotate: '180deg' }] }} />
  </TouchableOpacity>
)}
```

The practice screen itself (`/warrior-practice` or `/keeper-practice`) is a stub in Layer 2:
```typescript
// apps/imperium/app/warrior-practice.tsx (Layer 2 stub)
export default function WarriorPractice() {
  return (
    <View style={styles.stub}>
      <SvgIcon name="star" size={40} color={T.gold} />
      <Text style={styles.stubTitle}>WARRIOR'S PRACTICE</Text>
      <Text style={styles.stubBody}>Coming in a future layer.</Text>
    </View>
  );
}
```

## REVISED TAB AND HUB ARCHITECTURE

### Bottom tab bar — 5 tabs

```
Home | Planner | Mind | Body | Soul
```

The current 4-tab structure (Home / Planner / Nourish / More) is wrong.
The correct structure has 5 primary tabs. Each primary tab except Home has its own
secondary tab bar at the top of the screen.

More tab is removed. Settings and Household move to a gear icon or header button on Home.

### Secondary tabs within each primary tab

**Mind tab** — secondary tabs:
- Declaration
- Doctrine
- The Book
- Language (Vel'nar for Imperium, Nen'thara register for Tending)
- Shadow Work
- Mood

**Body tab** — secondary tabs:
- Nourish (meal plan + grocery + ceremony — same full implementation as before)
- Warrior's Practice (Imperium) / Keeper's Practice (Tending)
- Hydration
- Sleep

**Soul tab** — secondary tabs:
- Rites
- Partnership
- Holy Days
- Evening Inventory
- Morning Quiet + Replenishment (Tending only — these two merge or appear conditionally)

**Planner tab** — secondary tabs (already partially spec'd):
- Today (fully built Layer 2)
- Calendar (stub Layer 2 → full Layer 6)
- Schedule (stub Layer 2 → full Layer 6)

**Home tab** — no secondary tabs:
- Shift strip
- Daily quote
- Partner card
- Settings/gear icon in header

### Settings and Household

Remove the More tab entirely.
Settings icon (gear) appears in the Home screen header — taps into a settings screen.
Household appears in the same settings screen or as a separate header icon.
This is cleaner than a dedicated More tab that is mostly empty.

### Hub architecture — Home tab

The three hub tiles are the routing architecture for ALL content.
Nothing doctrine-related lives in More tab.

**MIND hub** — interior, cognitive, psychological:
- Morning Declaration
- Doctrine (axioms, creed, manifesto)
- The Book (holy text)
- Language practice (Vel'nar for Imperium / Nen'thara for Tending)
- Shadow Work
- Mood Tracker

**BODY hub** — physical, somatic, nutritional:
- Hydration tracker
- Warrior's Practice (Imperium) / Keeper's Practice (Tending)
- Sleep window (from shift schedule)
- Nourish — Meal Plan (4-week plan, per-meal recipes and macros)
- Nourish — Grocery List (cart, categories, ceremony supplies)

**SOUL hub** — relational, ceremonial, spiritual:
- Rites and ceremony
- Partnership content / communication translator
- Holy days calendar
- Morning Quiet (Tending only)
- Replenishment Session (Tending only)
- Evening Inventory

### Layer 2 implementation

Each hub tile expands inline on the Home screen to show its section list.
Tapping a section item navigates to a full-screen sub-screen.
All sub-screens are stubs in Layer 2:
  - Tradition sigil centered (40px)
  - Section name in display font
  - "Coming in a future layer." in muted text
  - No crash, no blank screen

Exception: Hydration and Mood Tracker are NOT stubs — they are fully built in Layer 2.
Exception: Nourish (meal plan + grocery) is fully built in Layer 2 — same implementation
  as before, just accessed from Body hub instead of a dedicated tab.

```typescript
const HUB_ITEMS = {
  imp: {
    mind: [
      { id: 'decl',    label: 'Morning Declaration' },
      { id: 'doctrine',label: 'Doctrine'            },
      { id: 'book',    label: 'The Book'            },
      { id: 'velnar',  label: "Vel'nar"             },
      { id: 'shadow',  label: 'Shadow Work'         },
      { id: 'mood',    label: 'Mood Tracker'        },
    ],
    body: [
      { id: 'hydration', label: 'Hydration',            full: true  },
      { id: 'warrior',   label: "Warrior's Practice"                },
      { id: 'sleep',     label: 'Sleep Window',          full: true  },
      { id: 'nourish',   label: 'Meal Plan',             full: true  },
      { id: 'grocery',   label: 'Grocery List',          full: true  },
    ],
    soul: [
      { id: 'rites',     label: 'The Rites'           },
      { id: 'partner',   label: 'Partnership'         },
      { id: 'holydays',  label: 'Holy Days'           },
      { id: 'inventory', label: 'Evening Inventory'   },
    ],
  },
  tend: {
    mind: [
      { id: 'decl',    label: 'Morning Declaration' },
      { id: 'doctrine',label: 'Doctrine'            },
      { id: 'book',    label: 'The Book'            },
      { id: 'shadow',  label: 'Shadow Work'         },
      { id: 'mood',    label: 'Mood Tracker'        },
    ],
    body: [
      { id: 'hydration', label: 'Hydration',            full: true  },
      { id: 'keeper',    label: "Keeper's Practice"                 },
      { id: 'sleep',     label: 'Sleep Window',          full: true  },
      { id: 'nourish',   label: 'Meal Plan',             full: true  },
      { id: 'grocery',   label: 'Grocery List',          full: true  },
    ],
    soul: [
      { id: 'rites',    label: 'The Rites'              },
      { id: 'partner',  label: 'Partnership'            },
      { id: 'holydays', label: 'Holy Days'              },
      { id: 'quiet',    label: 'Morning Quiet'          },
      { id: 'replen',   label: 'Replenishment Session'  },
      { id: 'inventory',label: 'Evening Inventory'      },
    ],
  },
};
// full: true = fully built in Layer 2. All others = stub screen.
```

### File structure after this fix

```
apps/imperium/app/(tabs)/
  _layout.tsx     ← 5 primary tabs: index, planner, mind, body, soul
  index.tsx       ← Home (shift strip, quote, partner card, settings icon)
  planner.tsx     ← Planner with secondary tabs: Today / Calendar / Schedule
  mind.tsx        ← Mind with secondary tabs (see below)
  body.tsx        ← Body with secondary tabs (see below)
  soul.tsx        ← Soul with secondary tabs (see below)

REMOVE:
  nourish.tsx     ← DELETE as a primary tab — Nourish becomes a secondary tab inside Body
  more.tsx        ← DELETE as a primary tab — Settings moves to gear icon on Home
  doctrine.tsx    ← DELETE as a primary tab
  warrior.tsx     ← DELETE as a primary tab
```

### Secondary tab implementation pattern

Each primary tab uses a top-of-screen secondary tab strip (not the bottom bar).
Style: small pill tabs or underline tabs, tradition color for active.

```typescript
// Example: body.tsx
const BODY_TABS_IMP  = ['Nourish', "Warrior's Practice", 'Hydration', 'Sleep'];
const BODY_TABS_TEND = ['Nourish', "Keeper's Practice",  'Hydration', 'Sleep'];

export default function BodyTab() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = imp ? BODY_TABS_IMP : BODY_TABS_TEND;
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <SecondaryTabBar tabs={tabs} active={activeTab} onSelect={setActiveTab} />
      {activeTab === 0 && <NourishScreen />}      {/* fully built */}
      {activeTab === 1 && <PracticeScreen />}     {/* stub */}
      {activeTab === 2 && <HydrationScreen />}    {/* fully built */}
      {activeTab === 3 && <SleepScreen />}        {/* stub */}
    </View>
  );
}

// Example: mind.tsx
const MIND_TABS_IMP  = ['Declaration', 'Doctrine', 'The Book', "Vel'nar", 'Shadow Work', 'Mood'];
const MIND_TABS_TEND = ['Declaration', 'Doctrine', 'The Book', 'Shadow Work', 'Mood'];

// Example: soul.tsx (Tending adds Morning Quiet and Replenishment)
const SOUL_TABS_IMP  = ['Rites', 'Partnership', 'Holy Days', 'Evening Inventory'];
const SOUL_TABS_TEND = ['Rites', 'Partnership', 'Holy Days', 'Morning Quiet', 'Replenishment', 'Evening Inventory'];
```

### Layer 2 stub rule
Every secondary tab that is not Nourish, Hydration, or Mood is a stub:
- Tradition sigil (40px, centered)
- Tab name in display font
- "Coming in a future layer." in muted text
- No crash, no blank screen

### Tab bar after fix
```typescript
// apps/imperium/app/(tabs)/_layout.tsx
<Tabs screenOptions={{ tabBarStyle: { backgroundColor: T.bg } }}>
  <Tabs.Screen name="index"    options={{ title: 'HOME',    tabBarIcon: ... }} />
  <Tabs.Screen name="planner"  options={{ title: 'PLANNER', tabBarIcon: ... }} />
  <Tabs.Screen name="nourish"  options={{ title: 'NOURISH', tabBarIcon: ... }} />
  <Tabs.Screen name="more"     options={{ title: 'MORE',    tabBarIcon: ... }} />
</Tabs>
```

---

## FIX 05 — REMOVE THE INVENTED PROGRESSIVE UNLOCK SYSTEM

### Problem
The bundle contains strings: "Doctrine opens at Day 14", "Mind hub opens at Day 7",
"Soul hub opens at Day 14", "The Forge opens at Day 7".

None of this is in the spec. Cursor invented a progression-gate system.
All hub tiles and content must be immediately accessible from Day 1.

### Fix
Search codebase for any of these strings and delete the entire lock/unlock logic:

```bash
grep -r "opens at Day\|Day 7\|Day 14\|forgeOpens\|doctrineUnlocked\|mindUnlocked\|soulUnlocked\|dayCount\|daysActive\|sinceInstall" apps/ --include="*.ts" --include="*.tsx" -l
```

Delete every file or block that:
- Counts days since install or first launch
- Shows a lock icon on hub tiles
- Prevents access to any content based on a day threshold
- Shows "available in X days" type messages

Replace locked hub tiles with this (identical for all three hubs):
```typescript
// Mind hub, Body hub, Soul hub — all expand immediately, no lock
<TouchableOpacity onPress={() => setExpandedHub(hub === expandedHub ? null : hub)}>
  <HubTile hub={hub} expanded={expandedHub === hub} />
</TouchableOpacity>
```

The prototype (`sovereign_v9.jsx`) has no locking. Match it exactly.

---

## FIX 06 — WRONG APK DOWNLOAD URL

### Problem
The bundle contains:
`https://github.com/Xpliciton3/Sovereign-Works/releases/download/v1.0.7/sovereign-tending-v1.0.6.apk`

Two errors:
1. Wrong repo name — should be `xpliciton3/Imperium`, not `Xpliciton3/Sovereign-Works`
2. Mismatched version numbers in the URL (v1.0.7 and v1.0.6 in the same path)

### Fix
Search for the URL and replace with the correct format:
```typescript
const TENDING_APK_URL = 'https://github.com/xpliciton3/Imperium/releases/latest/download/tending.apk';
```

Using `/releases/latest/download/` means it always pulls the newest APK without
hardcoding version numbers. Push new APKs to GitHub Releases with the filename
`tending.apk` and `imperium.apk` so the URL stays stable.

If the QR code in the household invite screen is generating this URL, update that too:
```typescript
// In create-household screen or wherever the QR is generated:
const apkUrl = 'https://github.com/xpliciton3/Imperium/releases/latest/download/tending.apk';
// Generate QR from this URL
```

---

## AFTER COMPLETING THESE FIXES

Build both APKs, push to GitHub:
```bash
git add -A
git commit -m "Fix 04/05/06 — correct tab structure, remove invented locks, fix APK URL"
git push origin main
```

Tell Garrin:
- "Fix 04/05/06 complete."
- "Tab bar is now exactly 4 tabs: Home, Planner, Nourish, More."
- "All hub tiles and content are immediately accessible — no day locks."
- "APK download URL corrected to xpliciton3/Imperium repo."
- "APKs: [filenames]. Install and test."
