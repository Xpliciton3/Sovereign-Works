import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, ref, set } from 'firebase/database';
import { getFirebaseDb, isFirebaseConfigured } from '../firebase/config';
import { scoreBracketLabel, scoreToDot } from '../content/moodTranslations';
import type { Profile } from '../types';
import { translateMoodWithGroq } from '../ai/groqMood';

function dateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useMood(profile: Profile, householdId: string | null) {
  const [score, setScore] = useState(3);
  const [note, setNote] = useState('');
  const [partnerDot, setPartnerDot] = useState<number | null>(null);
  const [partnerTranslation, setPartnerTranslation] = useState<string | null>(null);
  const [history, setHistory] = useState<number[]>([3, 2, 4, 2, 3, 5, 3]);
  const [previewTranslation, setPreviewTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

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
        if (val && typeof val.translatedText === 'string') setPartnerTranslation(val.translatedText);
      })
      .catch(() => {});
  }, [householdId, profile]);

  const bracket = scoreBracketLabel(score);
  const dotScore = scoreToDot(score);

  const saveLocalMood = useCallback(async () => {
    const nextHist = [...history.slice(-6), score];
    setHistory(nextHist);
    await AsyncStorage.setItem(`mood_history_${profile}`, JSON.stringify(nextHist));
    await AsyncStorage.setItem(`mood_note_${profile}_${dateKey()}`, note);
  }, [history, note, profile, score]);

  const generatePreview = useCallback(async () => {
    if (!note.trim()) {
      setPreviewTranslation('');
      return '';
    }
    setIsTranslating(true);
    try {
      const translated = await translateMoodWithGroq({
        note,
        score,
        authorProfile: profile,
      });
      setPreviewTranslation(translated);
      return translated;
    } finally {
      setIsTranslating(false);
    }
  }, [note, profile, score]);

  const sendPreviewToPartner = useCallback(async () => {
    if (!householdId || !isFirebaseConfigured()) return;
    if (!previewTranslation.trim()) return;
    if (householdId && isFirebaseConfigured()) {
      const db = getFirebaseDb();
      const path = `households/${householdId}/mood/${profile}/translatedEntries/${dateKey()}`;
      await set(ref(db, path), {
        translatedText: previewTranslation,
        dotScore,
        approved: true,
        timestamp: Date.now(),
      });
    }
  }, [dotScore, householdId, previewTranslation, profile]);

  return {
    score,
    setScore,
    note,
    setNote,
    bracket,
    dotScore,
    partnerDot,
    partnerTranslation,
    history,
    previewTranslation,
    isTranslating,
    saveLocalMood,
    generatePreview,
    sendPreviewToPartner,
    clearPreview: () => setPreviewTranslation(''),
  };
}
