import { useCallback, useState } from 'react';
import type { CartItemL2, GroceryCategoryL2, IngredientL2 } from '../types/layer2';

export type CartState = Record<string, CartItemL2>;

function ingredientKey(name: string): string {
  return name.toLowerCase().trim();
}

export function useCart(initial: CartState = {}) {
  const [cart, setCart] = useState<CartState>(initial);

  const addIngredient = useCallback((ing: IngredientL2) => {
    const key = ingredientKey(ing.name);
    setCart((prev) => {
      if (prev[key]) {
        return {
          ...prev,
          [key]: { ...prev[key], count: prev[key].count + 1 },
        };
      }
      return {
        ...prev,
        [key]: {
          name: ing.name,
          amt: ing.amt,
          unit: ing.unit,
          count: 1,
          checked: false,
        },
      };
    });
    return ing.name;
  }, []);

  const addAllIngredients = useCallback(
    (ingredients: IngredientL2[]) => {
      ingredients.forEach((ing) => addIngredient(ing));
    },
    [addIngredient]
  );

  const removeCartItem = useCallback((key: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const toggleChecked = useCallback((key: string) => {
    setCart((prev) => {
      const item = prev[key];
      if (!item) return prev;
      return { ...prev, [key]: { ...item, checked: !item.checked } };
    });
  }, []);

  const clearChecked = useCallback(() => {
    setCart((prev) => {
      const next: CartState = {};
      Object.entries(prev).forEach(([k, v]) => {
        if (!v.checked) next[k] = v;
      });
      return next;
    });
  }, []);

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
