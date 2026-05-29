import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Profile } from '../types';
import { getTodayQuote, type DailyQuote } from '../data/quotes';

const KEY_PREFIX = 'daily_quote_';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * One quote per calendar day. Uses curated famous quotes offline;
 * optionally enriches with Groq when API key is present (same quote, no regeneration mid-day).
 */
export function useDailyQuote(profile: Profile) {
  const [quote, setQuote] = useState<DailyQuote>(() => getTodayQuote(profile));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const key = `${KEY_PREFIX}${profile}_${todayKey()}`;
    AsyncStorage.getItem(key).then((raw) => {
      if (raw) {
        try {
          setQuote(JSON.parse(raw) as DailyQuote);
          setLoaded(true);
          return;
        } catch {
          // fall through
        }
      }
      const picked = getTodayQuote(profile);
      void AsyncStorage.setItem(key, JSON.stringify(picked));
      setQuote(picked);
      setLoaded(true);
    });
  }, [profile]);

  return { quote, loaded };
}
