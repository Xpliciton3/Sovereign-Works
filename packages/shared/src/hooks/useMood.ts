import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, ref, set } from 'firebase/database';
import { getFirebaseDb, isFirebaseConfigured } from '../firebase/config';
import {
  getMoodTranslation,
  scoreBracketLabel,
  scoreToDot,
} from '../content/moodTranslations';
import type { Profile } from '../types';

function dateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useMood(profile: Profile, householdId: string | null) {
  const [score, setScore] = useState(6);
  const [note, setNote] = useState('');
  const [partnerDot, setPartnerDot] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([7, 4, 8, 3, 6, 9, 6]);

  useEffect(() => {
    AsyncStorage.getItem(`mood_history_${profile}`).then((raw) => {
      if (raw) {
        try {
          setHistory(JSON.parse(raw) as number[]);
        } catch {
          /* keep default */
        }
      }
    });
  }, [profile]);

  useEffect(() => {
    if (!householdId || !isFirebaseConfigured()) return;
    const partner = profile === 'imperium' ? 'tending' : 'imperium';
    const path = `households/${householdId}/mood/${partner}/translatedEntries/${dateKey()}`;
    const db = getFirebaseDb();
    get(ref(db, path))
      .then((snap) => {
        const val = snap.val();
        if (val && typeof val.dotScore === 'number') setPartnerDot(val.dotScore);
      })
      .catch(() => {});
  }, [householdId, profile]);

  const translation = getMoodTranslation(score, profile);
  const bracket = scoreBracketLabel(score);
  const dotScore = scoreToDot(score);

  const submitMood = useCallback(async () => {
    const nextHist = [...history.slice(-6), score];
    setHistory(nextHist);
    await AsyncStorage.setItem(`mood_history_${profile}`, JSON.stringify(nextHist));
    await AsyncStorage.setItem(`mood_note_${profile}_${dateKey()}`, note);

    if (householdId && isFirebaseConfigured()) {
      const db = getFirebaseDb();
      const path = `households/${householdId}/mood/${profile}/translatedEntries/${dateKey()}`;
      await set(ref(db, path), {
        translatedText: translation,
        dotScore,
        approved: true,
        timestamp: Date.now(),
      });
    }
    return { dotScore, translation };
  }, [dotScore, history, householdId, note, profile, score, translation]);

  return {
    score,
    setScore,
    note,
    setNote,
    translation,
    bracket,
    dotScore,
    partnerDot,
    history,
    submitMood,
  };
}
