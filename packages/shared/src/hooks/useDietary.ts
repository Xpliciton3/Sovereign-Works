import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  mealPassesFilterL2,
  type DietarySettingsL2,
} from '../types/layer2';

const DEFAULT: DietarySettingsL2 = {
  nutFree: false,
  gastricBypass: false,
  avoidFish: false,
  avoidRawOnion: false,
  avoidCilantro: false,
  avoidStrongCheese: false,
  avoidMushrooms: false,
  customAvoidances: [],
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

  const parseCustomAvoidances = useCallback(async (raw: string) => {
    const text = raw.toLowerCase();
    const next: Partial<DietarySettingsL2> = {
      customAvoidances: raw
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      avoidFish: text.includes('fish') || text.includes('seafood'),
      avoidRawOnion: text.includes('raw onion') || text.includes('onion'),
      avoidCilantro: text.includes('cilantro'),
      avoidStrongCheese: text.includes('strong cheese') || text.includes('blue cheese'),
      avoidMushrooms: text.includes('mushroom'),
    };
    await updateDiet(next);
  }, [updateDiet]);

  return { diet, updateDiet, mealPasses, parseCustomAvoidances };
}
