import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  mealPassesFilterL2,
  type DietarySettingsL2,
} from '../types/layer2';

const DEFAULT: DietarySettingsL2 = {
  nutAllergy: true,
  gerd: false,
  glutenFree: false,
  dairyFree: false,
  mthfr: true,
  gbp: true,
  onDutyFirst: false,
};

export function useDietary() {
  const [diet, setDiet] = useState<DietarySettingsL2>(DEFAULT);

  useEffect(() => {
    AsyncStorage.getItem('dietary_settings').then((raw) => {
      if (raw) {
        try {
          setDiet({ ...DEFAULT, ...(JSON.parse(raw) as DietarySettingsL2) });
        } catch {
          /* default */
        }
      }
    });
  }, []);

  const updateDiet = useCallback(async (patch: Partial<DietarySettingsL2>) => {
    setDiet((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem('dietary_settings', JSON.stringify(next));
      return next;
    });
  }, []);

  const mealPasses = useCallback(
    (tags: string[]) => mealPassesFilterL2(tags, diet),
    [diet]
  );

  return { diet, updateDiet, mealPasses };
}
