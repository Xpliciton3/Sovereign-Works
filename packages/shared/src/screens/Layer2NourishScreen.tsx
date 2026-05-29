import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { WEEK_PLAN } from '../data/weekPlan';
import { RECIPES } from '../data/recipes';
import { useHouseholdContext } from '../context/HouseholdContext';
import { useCart } from '../hooks/useCart';
import { useDietary } from '../hooks/useDietary';
import { MealIngredients } from './MealIngredients';
import { GroceryList } from './GroceryList';
import type { IngredientL2 } from '../types/layer2';

const TAB_COLORS = {
  imperium: { nourish: '#e05828' },
  tending: { nourish: '#c06048' },
};

type Props = {
  profile: Profile;
  colors: ThemeColors;
};

export function Layer2NourishScreen({ profile, colors }: Props) {
  const hh = useHouseholdContext();
  const accent = TAB_COLORS[profile].nourish;
  const [nourTab, setNourTab] = useState<'plan' | 'cart'>('plan');
  const [expWeek, setExpWeek] = useState<number | null>(null);
  const [expDay, setExpDay] = useState<string | null>(null);
  const { diet, updateDiet, mealPasses, parseCustomAvoidances } = useDietary();
  const [customText, setCustomText] = useState('');
  const {
    cart,
    addIngredient,
    addAllIngredients,
    removeCartItem,
    toggleChecked,
    clearChecked,
  } = useCart(profile, hh.householdId);

  const addAllWeek = (wi: number) => {
    const wk = WEEK_PLAN[wi];
    wk.days.forEach((day) => {
      (['b', 'l', 'd'] as const).forEach((slot) => {
        const mealName = day.meals[slot];
        const tags = day.tags[slot];
        if (mealPasses(tags) && RECIPES[mealName]) {
          RECIPES[mealName].ing.forEach((ing) => addIngredient(ing));
        }
      });
    });
  };

  return (
    <ScrollView style={[styles.root, { backgroundColor: colors.background }]} contentContainerStyle={styles.pad}>
      <View style={styles.tabRow}>
        {(['plan', 'cart'] as const).map((k) => (
          <Pressable key={k} onPress={() => setNourTab(k)} style={styles.tabBtn}>
            <Text style={{ color: nourTab === k ? accent : colors.textMuted, fontSize: 11, letterSpacing: 1.2 }}>
              {k === 'plan' ? 'Plan' : 'Grocery'}
            </Text>
            {nourTab === k && <View style={[styles.tabLine, { backgroundColor: accent }]} />}
          </Pressable>
        ))}
      </View>

      {nourTab === 'plan' && (
        <>
          <Text style={[styles.filterHdr, { color: colors.textMuted }]}>Dietary filters</Text>
          {(
            [
              ['nutFree', 'Nut-free'],
              ['gastricBypass', 'Post-gastric bypass'],
              ['avoidFish', 'Avoid fish/seafood'],
              ['avoidRawOnion', 'Avoid raw onion'],
              ['avoidCilantro', 'Avoid cilantro'],
              ['avoidStrongCheese', 'Avoid strong cheese'],
              ['avoidMushrooms', 'Avoid cooked mushrooms'],
            ] as const
          ).map(([key, label]) => (
            <Pressable
              key={key}
              onPress={() => updateDiet({ [key]: !diet[key] })}
              style={[styles.filterRow, { borderColor: colors.border }]}
            >
              <Text style={{ color: colors.text, fontSize: 13 }}>{label}</Text>
              <Text style={{ color: diet[key] ? accent : colors.textDisabled }}>{diet[key] ? 'ON' : 'OFF'}</Text>
            </Pressable>
          ))}
          {WEEK_PLAN.map((wk, wi) => (
            <View key={wi} style={[styles.weekCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Pressable onPress={() => setExpWeek(expWeek === wi ? null : wi)}>
                <Text style={[styles.weekTitle, { color: accent }]}>{wk.week}</Text>
              </Pressable>
              {expWeek === wi && (
                <>
                  <Pressable
                    onPress={() => addAllWeek(wi)}
                    style={[styles.weekAddAll, { borderColor: `${accent}44`, backgroundColor: `${accent}14` }]}
                  >
                    <Text style={[styles.weekAddAllText, { color: accent }]}>
                      + Add All Week {wi + 1} Ingredients to Cart
                    </Text>
                  </Pressable>
                  {wk.days.map((day) => (
                    <View key={day.day}>
                      <Pressable
                        onPress={() => setExpDay(expDay === day.day ? null : day.day)}
                        style={styles.dayHdr}
                      >
                        <Text style={{ color: colors.text, fontSize: 14 }}>{day.day}</Text>
                        {day.batch && <Text style={{ color: colors.accent, fontSize: 9 }}> BATCH</Text>}
                      </Pressable>
                      {expDay === day.day &&
                        (['b', 'l', 'd'] as const).map((slot) => {
                          const mealName = day.meals[slot];
                          const tags = day.tags[slot];
                          const blocked = !mealPasses(tags);
                          const slotLabel = slot === 'b' ? 'Breakfast' : slot === 'l' ? 'Lunch' : 'Dinner';
                          return (
                            <View
                              key={slot}
                              style={[styles.mealCard, { borderColor: blocked ? '#c07040' : colors.border }]}
                            >
                              <Text style={{ color: blocked ? '#c07040' : accent, fontSize: 9 }}>{slotLabel}</Text>
                              <Text
                                style={{
                                  color: blocked ? colors.textDisabled : colors.text,
                                  fontSize: 13,
                                  textDecorationLine: blocked ? 'line-through' : 'none',
                                }}
                              >
                                {mealName}
                              </Text>
                              {blocked && (
                                <Text style={{ color: '#c07040', fontSize: 10 }}>Not NF-tagged — swap needed</Text>
                              )}
                              {!blocked && (
                                <MealIngredients
                                  mealName={mealName}
                                  colors={colors}
                                  accent={accent}
                                  diet={diet}
                                  onAddIngredient={(ing: IngredientL2) => addIngredient(ing)}
                                  onAddAll={(name) => {
                                    const rec = RECIPES[name];
                                    if (rec) addAllIngredients(rec.ing);
                                  }}
                                />
                              )}
                            </View>
                          );
                        })}
                    </View>
                  ))}
                </>
              )}
            </View>
          ))}
          <View style={[styles.customWrap, { borderColor: colors.border }]}>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginBottom: 6 }}>
              Custom avoidances (comma-separated)
            </Text>
            <TextInput
              value={customText}
              onChangeText={setCustomText}
              placeholder="e.g. shellfish, raw onion"
              placeholderTextColor={colors.textDisabled}
              style={[styles.customInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
            />
            <Pressable
              onPress={async () => {
                await parseCustomAvoidances(customText);
                setCustomText('');
              }}
              style={[styles.weekAddAll, { borderColor: `${accent}44`, backgroundColor: `${accent}14`, marginHorizontal: 0 }]}
            >
              <Text style={[styles.weekAddAllText, { color: accent }]}>Update Meal Plan</Text>
            </Pressable>
            <Text style={{ color: colors.textDisabled, fontSize: 10, marginTop: 6 }}>
              Current: {diet.customAvoidances.join(', ') || 'none'}
            </Text>
          </View>
        </>
      )}

      {nourTab === 'cart' && (
        <GroceryList
          cart={cart}
          colors={colors}
          viewerProfile={profile}
          onToggle={toggleChecked}
          onRemove={removeCartItem}
          onClearChecked={clearChecked}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  pad: { padding: 16, paddingTop: 48, paddingBottom: 32 },
  tabRow: { flexDirection: 'row', marginBottom: 16 },
  tabBtn: { flex: 1, alignItems: 'center', paddingBottom: 8 },
  tabLine: { height: 2, width: '100%', marginTop: 6 },
  filterHdr: { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 4,
  },
  weekCard: { borderWidth: 1, borderRadius: 8, marginBottom: 10, overflow: 'hidden' },
  weekTitle: { padding: 12, fontSize: 13, letterSpacing: 0.5 },
  weekAddAll: { marginHorizontal: 12, marginBottom: 8, padding: 8, borderWidth: 1, borderRadius: 4 },
  weekAddAllText: { fontSize: 10, textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase' },
  dayHdr: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8 },
  mealCard: { marginHorizontal: 12, marginBottom: 8, padding: 10, borderWidth: 1, borderRadius: 6 },
  customWrap: { borderWidth: 1, borderRadius: 8, padding: 12, marginTop: 12 },
  customInput: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8 },
});
