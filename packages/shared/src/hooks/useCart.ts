import { useCallback, useEffect, useRef, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import type { CartItemL2, GroceryCategoryL2, IngredientL2 } from '../types/layer2';
import type { Profile } from '../types';
import { getFirebaseDb, isFirebaseConfigured } from '../firebase/config';
import { firebaseRemove, writeShared } from '../firebase/sync';

export type CartState = Record<string, CartItemL2>;

function ingredientKey(name: string): string {
  return name.toLowerCase().trim();
}

type FirebaseCartItem = CartItemL2 & {
  addedBy?: Profile;
  updatedAt?: number;
};

function cartPath(householdId: string, key: string): string {
  return `households/${householdId}/grocery/currentList/${key}`;
}

export function useCart(profile: Profile, householdId: string | null, initial: CartState = {}) {
  const [cart, setCart] = useState<CartState>(initial);
  const applyingRemote = useRef(false);

  useEffect(() => {
    if (!householdId || !isFirebaseConfigured()) return;
    const cartRef = ref(getFirebaseDb(), `households/${householdId}/grocery/currentList`);
    return onValue(cartRef, (snapshot) => {
      const data = (snapshot.val() || {}) as Record<string, FirebaseCartItem>;
      const next: CartState = {};
      Object.entries(data).forEach(([key, item]) => {
        next[key] = {
          name: item.name,
          amt: item.amt,
          unit: item.unit as GroceryCategoryL2,
          count: item.count ?? 1,
          checked: Boolean(item.checked),
          addedBy: item.addedBy,
        };
      });
      applyingRemote.current = true;
      setCart(next);
      queueMicrotask(() => {
        applyingRemote.current = false;
      });
    });
  }, [householdId]);

  const persistItem = useCallback(
    async (key: string, item: CartItemL2) => {
      if (!householdId || !isFirebaseConfigured() || applyingRemote.current) return;
      await writeShared(cartPath(householdId, key), {
        ...item,
        addedBy: item.addedBy ?? profile,
        updatedAt: Date.now(),
      });
    },
    [householdId, profile]
  );

  const addIngredient = useCallback(
    async (ing: IngredientL2) => {
      const key = ingredientKey(ing.name);
      let nextItem: CartItemL2 | null = null;
      setCart((prev) => {
        if (prev[key]) {
          nextItem = { ...prev[key], count: prev[key].count + 1 };
          return { ...prev, [key]: nextItem };
        }
        nextItem = {
          name: ing.name,
          amt: ing.amt,
          unit: ing.unit,
          count: 1,
          checked: false,
          addedBy: profile,
        };
        return { ...prev, [key]: nextItem };
      });
      if (nextItem && householdId) await persistItem(key, nextItem);
      return ing.name;
    },
    [householdId, persistItem, profile]
  );

  const addAllIngredients = useCallback(
    async (ingredients: IngredientL2[]) => {
      for (const ing of ingredients) {
        await addIngredient(ing);
      }
    },
    [addIngredient]
  );

  const removeCartItem = useCallback(
    async (key: string) => {
      setCart((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      if (householdId && isFirebaseConfigured()) {
        await firebaseRemove(cartPath(householdId, key));
      }
    },
    [householdId]
  );

  const toggleChecked = useCallback(
    async (key: string) => {
      let nextItem: CartItemL2 | undefined;
      setCart((prev) => {
        const item = prev[key];
        if (!item) return prev;
        nextItem = { ...item, checked: !item.checked };
        return { ...prev, [key]: nextItem };
      });
      if (nextItem) await persistItem(key, nextItem);
    },
    [persistItem]
  );

  const clearChecked = useCallback(async () => {
    const checkedKeys = Object.entries(cart)
      .filter(([, v]) => v.checked)
      .map(([k]) => k);
    setCart((prev) => {
      const next: CartState = {};
      Object.entries(prev).forEach(([k, v]) => {
        if (!v.checked) next[k] = v;
      });
      return next;
    });
    for (const key of checkedKeys) {
      if (householdId && isFirebaseConfigured()) {
        await firebaseRemove(cartPath(householdId, key));
      }
    }
  }, [cart, householdId]);

  const itemsByCategory = useCallback(
    (category: GroceryCategoryL2, includeChecked = false) =>
      Object.entries(cart).filter(
        ([, v]) => v.unit === category && (includeChecked || !v.checked)
      ),
    [cart]
  );

  return {
    cart,
    setCart,
    addIngredient,
    addAllIngredients,
    removeCartItem,
    toggleChecked,
    clearChecked,
    itemsByCategory,
  };
}
