import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RECIPES } from '../data/recipes';
import type { IngredientL2 } from '../types/layer2';
import type { ThemeColors } from '../colors';

type Props = {
  mealName: string;
  colors: ThemeColors;
  accent: string;
  onAddIngredient: (ing: IngredientL2) => void;
  onAddAll: (mealName: string) => void;
};

export function MealIngredients({ mealName, colors, accent, onAddIngredient, onAddAll }: Props) {
  const rec = RECIPES[mealName];
  if (!rec) {
    return (
      <Text style={[styles.missing, { color: colors.textMuted }]}>
        Leftover — no prep needed
      </Text>
    );
  }

  return (
    <View>
      {rec.macros && (
        <View style={styles.macroRow}>
          {[
            { label: 'CAL', val: String(rec.macros.cal) },
            { label: 'PRO', val: `${rec.macros.p}g` },
            { label: 'CARB', val: `${rec.macros.c}g` },
            { label: 'FAT', val: `${rec.macros.f}g` },
            { label: 'FIBER', val: `${rec.macros.fiber}g` },
          ].map((m) => (
            <View
              key={m.label}
              style={[styles.macroCell, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={[styles.macroLabel, { color: colors.textMuted }]}>{m.label}</Text>
              <Text style={[styles.macroVal, { color: colors.text }]}>{m.val}</Text>
            </View>
          ))}
        </View>
      )}
      <Text style={[styles.section, { color: accent }]}>Ingredients</Text>
      {rec.ing.map((ing, idx) => (
        <View key={idx} style={[styles.ingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.ingText}>
            <Text style={[styles.ingName, { color: colors.text }]}>{ing.name}</Text>
            <Text style={[styles.ingAmt, { color: colors.textMuted }]}> {ing.amt}</Text>
          </View>
          <Pressable
            onPress={() => onAddIngredient(ing)}
            style={[styles.cartBtn, { borderColor: `${accent}88` }]}
          >
            <Text style={[styles.cartBtnText, { color: accent }]}>+ Cart</Text>
          </Pressable>
        </View>
      ))}
      <Pressable
        onPress={() => onAddAll(mealName)}
        style={[styles.addAll, { borderColor: `${accent}55`, backgroundColor: `${accent}14` }]}
      >
        <Text style={[styles.addAllText, { color: accent }]}>+ Add All to Cart</Text>
      </Pressable>
      {rec.steps.length > 0 && (
        <>
          <Text style={[styles.section, { color: accent, marginTop: 12 }]}>How to Make It</Text>
          {rec.steps.map((step, i) => (
            <View key={i} style={[styles.stepRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.stepNum, { color: accent }]}>{i + 1}.</Text>
              <Text style={[styles.stepText, { color: colors.textMuted }]}>{step}</Text>
            </View>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  missing: { fontSize: 12, fontStyle: 'italic', paddingVertical: 8 },
  macroRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 10 },
  macroCell: {
    flex: 1,
    minWidth: 52,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 4,
    alignItems: 'center',
  },
  macroLabel: { fontSize: 8, letterSpacing: 1 },
  macroVal: { fontSize: 12, fontWeight: '600' },
  section: { fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 },
  ingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  ingText: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
  ingName: { fontSize: 13 },
  ingAmt: { fontSize: 11 },
  cartBtn: { paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderRadius: 4 },
  cartBtnText: { fontSize: 9, letterSpacing: 0.5 },
  addAll: {
    marginTop: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
  },
  addAllText: { fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' },
  stepRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stepNum: { fontSize: 11, fontWeight: '700', width: 18 },
  stepText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
