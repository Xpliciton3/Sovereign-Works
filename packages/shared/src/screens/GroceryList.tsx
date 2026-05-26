import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type CartItemL2,
  type GroceryCategoryL2,
} from '../types/layer2';
import type { ThemeColors } from '../colors';
import type { CartState } from '../hooks/useCart';

type Props = {
  cart: CartState;
  colors: ThemeColors;
  onToggle: (key: string) => void;
  onRemove: (key: string) => void;
  onClearChecked: () => void;
};

export function GroceryList({ cart, colors, onToggle, onRemove, onClearChecked }: Props) {
  const keys = Object.keys(cart);
  const checkedCount = Object.values(cart).filter((v) => v.checked).length;

  if (keys.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.emptyTitle, { color: colors.accent }]}>Open the 4-Week Plan</Text>
        <Text style={[styles.emptySub, { color: colors.textMuted }]}>
          Each ingredient has its own + Cart button
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={[styles.meta, { color: colors.textMuted }]}>
        {keys.length} items · {checkedCount} checked · Shared household list
      </Text>
      {checkedCount > 0 && (
        <Pressable
          onPress={onClearChecked}
          style={[styles.clearBtn, { borderColor: colors.border }]}
        >
          <Text style={[styles.clearText, { color: colors.textMuted }]}>Clear Checked Items</Text>
        </Pressable>
      )}
      {CATEGORY_ORDER.map((cat) => {
        const items = Object.entries(cart).filter(
          ([, v]) => v.unit === cat && !v.checked
        ) as [string, CartItemL2][];
        if (items.length === 0) return null;
        const dot = CATEGORY_COLORS[cat as GroceryCategoryL2];
        return (
          <View key={cat} style={styles.catBlock}>
            <View style={styles.catHeader}>
              <View style={[styles.dot, { backgroundColor: dot }]} />
              <Text style={[styles.catLabel, { color: dot }]}>
                {CATEGORY_LABELS[cat as GroceryCategoryL2]}
              </Text>
            </View>
            {items.map(([k, v]) => (
              <View key={k} style={[styles.row, { borderBottomColor: colors.border }]}>
                <Pressable onPress={() => onToggle(k)} style={[styles.check, { borderColor: colors.border }]}>
                  <Text style={{ color: colors.textMuted, fontSize: 10 }}>○</Text>
                </Pressable>
                <Text style={[styles.name, { color: colors.textMuted }]}>{v.name}</Text>
                <Text style={[styles.amt, { color: colors.textDisabled }]}>
                  {v.count > 1 ? `×${v.count} — ${v.amt}` : v.amt}
                </Text>
                <Pressable onPress={() => onRemove(k)}>
                  <Text style={{ color: colors.textMuted, fontSize: 18 }}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        );
      })}
      {Object.entries(cart).filter(([, v]) => v.checked).length > 0 && (
        <View style={{ opacity: 0.5, marginTop: 8 }}>
          <Text style={[styles.checkedHdr, { color: colors.textDisabled }]}>Checked</Text>
          {Object.entries(cart)
            .filter(([, v]) => v.checked)
            .map(([k, v]) => (
              <Pressable
                key={k}
                onPress={() => onToggle(k)}
                style={[styles.row, { borderBottomColor: colors.border }]}
              >
                <View style={[styles.check, { borderColor: colors.accent, backgroundColor: `${colors.accent}33` }]}>
                  <Text style={{ color: colors.accent, fontSize: 10 }}>✓</Text>
                </View>
                <Text style={[styles.name, { color: colors.textDisabled, textDecorationLine: 'line-through' }]}>
                  {v.name}
                </Text>
                <Text style={[styles.amt, { color: colors.textDisabled }]}>
                  {v.count > 1 ? `×${v.count}` : v.amt}
                </Text>
                <Pressable onPress={() => onRemove(k)}>
                  <Text style={{ color: colors.textMuted, fontSize: 18 }}>×</Text>
                </Pressable>
              </Pressable>
            ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { borderWidth: 1, borderRadius: 8, padding: 24, alignItems: 'center' },
  emptyTitle: { fontSize: 14, marginBottom: 6 },
  emptySub: { fontSize: 12, textAlign: 'center' },
  meta: { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  clearBtn: { borderWidth: 1, borderRadius: 4, padding: 8, marginBottom: 10, alignItems: 'center' },
  clearText: { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  catBlock: { marginBottom: 12 },
  catHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  catLabel: { fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  check: { width: 18, height: 18, borderWidth: 1, borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
  name: { flex: 1, fontSize: 14 },
  amt: { fontSize: 11, marginRight: 4 },
  checkedHdr: { fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 },
});
