# PATCH — FIX_04_05_06_STRUCTURE CORRECTIONS
# Resolves: C-03 (tab count ambiguity), C-04 (Practice location), C-13 (Nourish level)
# FIX_04_05_06_STRUCTURE.md contradicts itself. These patches clarify the correct answers.

---

## THE ONE TRUE ANSWER ON EVERY CONTESTED POINT IN FIX_04

Read this before reading FIX_04_05_06_STRUCTURE.md.
These override anything in that file that says otherwise.

---

### TAB COUNT AND NAMES (C-03 / C-13 fix)

**CORRECT:** 5 primary tabs.

```
Home | Planner | Mind | Body | Soul
```

The early section of FIX_04 that says "spec is exactly 4 tabs: Home, Planner, Nourish, More"
is describing what Cursor built wrong. It is NOT the target.

The REVISED ARCHITECTURE section of FIX_04 is the target.

The `_layout.tsx` code block at the bottom of FIX_04 showing 4 tabs is a copy-paste error.
Discard it. The _layout.tsx must have 5 tabs.

Correct `_layout.tsx`:
```typescript
// apps/imperium/app/(tabs)/_layout.tsx
<Tabs screenOptions={{ tabBarStyle: { backgroundColor: T.bg } }}>
  <Tabs.Screen name="index"   options={{ title: 'HOME',    tabBarIcon: ... }} />
  <Tabs.Screen name="planner" options={{ title: 'PLANNER', tabBarIcon: ... }} />
  <Tabs.Screen name="mind"    options={{ title: 'MIND',    tabBarIcon: ... }} />
  <Tabs.Screen name="body"    options={{ title: 'BODY',    tabBarIcon: ... }} />
  <Tabs.Screen name="soul"    options={{ title: 'SOUL',    tabBarIcon: ... }} />
</Tabs>
```

**DELETE as primary tabs:** `nourish.tsx`, `more.tsx`, `doctrine.tsx`, `warrior.tsx`
**CREATE as primary tabs:** `mind.tsx`, `body.tsx`, `soul.tsx`

---

### NOURISH LOCATION (C-13 fix)

**CORRECT:** Nourish is a secondary tab inside the Body primary tab.

```
Body primary tab → secondary tabs: Nourish | [Practice] | Hydration | Sleep
```

Nourish is NOT a primary tab in the 5-tab architecture.
`nourish.tsx` as a primary tab route is deleted.
The Nourish content (meal plan, grocery, ceremony) becomes `body.tsx` → secondary tab 0.

---

### WARRIOR/KEEPER PRACTICE LOCATION (C-04 fix)

**CORRECT:** Practice is a secondary tab inside the Body primary tab.

```
Body primary tab → secondary tabs: Nourish | Warrior's Practice (or Keeper's Practice) | Hydration | Sleep
```

Practice is NOT accessed from the Home tab Body hub tile.
The Home tab Body hub tile in the REVISED architecture links to the Body primary tab.
It does NOT contain inline practice content.

The practice screen (`/warrior-practice` or `/keeper-practice`) is a full screen
navigated to from the Body tab secondary tab, not a modal or inline expansion on Home.

Layer 2 stub for practice remains the same:
```typescript
export default function PracticeScreen() {
  return (
    <View style={styles.stub}>
      <SvgIcon name="star" size={40} color={T.gold} />
      <Text style={styles.stubTitle}>{imp ? "WARRIOR'S PRACTICE" : "KEEPER'S PRACTICE"}</Text>
      <Text style={styles.stubBody}>Coming in a future layer.</Text>
    </View>
  );
}
```

---

### BODY TAB — FULL SECONDARY TAB SPEC

```typescript
// apps/imperium/app/(tabs)/body.tsx
const BODY_TABS_IMP  = ['Nourish', "Warrior's Practice", 'Hydration', 'Sleep'];
const BODY_TABS_TEND = ['Nourish', "Keeper's Practice",  'Hydration', 'Sleep'];

export default function BodyTab() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = imp ? BODY_TABS_IMP : BODY_TABS_TEND;
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <SecondaryTabBar tabs={tabs} active={activeTab} onSelect={setActiveTab} />
      {activeTab === 0 && <NourishScreen />}    // fully built in Layer 2
      {activeTab === 1 && <PracticeScreen />}   // stub
      {activeTab === 2 && <HydrationScreen />}  // fully built in Layer 2
      {activeTab === 3 && <SleepScreen />}      // stub
    </View>
  );
}
```

---

### SETTINGS LOCATION (C-05 context)

Settings is accessed via the gear icon on the Home tab header.
There is NO More tab in the 5-tab architecture.
`more.tsx` as a primary tab is deleted.

---

### SUMMARY TABLE

| Question | Wrong answer in FIX_04 | Correct answer |
|----------|------------------------|----------------|
| Tab count | 4 (early section) | 5 |
| Tab names | Home/Planner/Nourish/More | Home/Planner/Mind/Body/Soul |
| Nourish level | Primary tab | Secondary tab inside Body |
| Practice location | Home hub tile (early) | Secondary tab inside Body (REVISED) |
| Settings location | More tab | Gear icon on Home header |
