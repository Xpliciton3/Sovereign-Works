import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onValue, ref } from 'firebase/database';
import { getFirebaseDb, isFirebaseConfigured } from '../firebase/config';
import { writeShared } from '../firebase/sync';
import { scoreBracketLabel, scoreToDot } from '../content/moodTranslations';
import type { Profile } from '../types';
import { translateMoodWithGroq } from '../ai/groqMood';

function dateKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function moodPath(householdId: string, memberProfile: Profile, day: string): string {
  return `households/${householdId}/mood/${memberProfile}/${day}`;
}

export type MoodSyncPayload = {
  dotScore?: number;
  /** Canonical Firebase field (v8.2 schema) */
  translation?: string;
  /** Legacy alias — still read for older nodes */
  translatedText?: string;
  updatedAt?: number;
};

export type PartnerMoodDay = {
  date: string;
  dotScore: number;
  translation?: string;
};

function readPartnerTranslation(val: MoodSyncPayload | undefined): string | null {
  if (!val) return null;
  const raw = val.translation ?? val.translatedText;
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function useMood(profile: Profile, householdId: string | null) {
  const [score, setScore] = useState(5);
  const [note, setNote] = useState('');
  const [partnerDot, setPartnerDot] = useState<number | null>(null);
  const [partnerTranslatedText, setPartnerTranslatedText] = useState<string | null>(null);
  const [partnerHistory, setPartnerHistory] = useState<PartnerMoodDay[]>([]);
  const [history, setHistory] = useState<number[]>([5, 4, 6, 4, 5, 8, 5]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const partnerProfile: Profile = profile === 'imperium' ? 'tending' : 'imperium';

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
    AsyncStorage.getItem(`mood_note_${profile}_${dateKey()}`).then((raw) => {
      if (raw) setNote(raw);
    });
  }, [profile]);

  useEffect(() => {
    if (!householdId || !isFirebaseConfigured()) {
      setPartnerDot(null);
      setPartnerTranslatedText(null);
      setPartnerHistory([]);
      return;
    }
    const rootRef = ref(getFirebaseDb(), `households/${householdId}/mood/${partnerProfile}`);
    return onValue(rootRef, (snap) => {
      const data = snap.val() as Record<string, MoodSyncPayload> | null;
      if (!data) {
        setPartnerDot(null);
        setPartnerTranslatedText(null);
        setPartnerHistory([]);
        return;
      }
      const today = dateKey();
      const todayVal = data[today];
      setPartnerDot(typeof todayVal?.dotScore === 'number' ? todayVal.dotScore : null);
      setPartnerTranslatedText(readPartnerTranslation(todayVal));
      const days = Object.entries(data)
        .map(([date, val]) => ({
          date,
          dotScore: typeof val.dotScore === 'number' ? val.dotScore : 0,
          translation: readPartnerTranslation(val) ?? undefined,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-14);
      setPartnerHistory(days);
    });
  }, [householdId, partnerProfile]);

  const bracket = scoreBracketLabel(score);
  const dotScore = scoreToDot(score);

  const saveEntry = useCallback(async (): Promise<boolean> => {
    setSaveError(null);
    const nextHist = [...history.slice(-6), score];
    setHistory(nextHist);
    await AsyncStorage.setItem(`mood_history_${profile}`, JSON.stringify(nextHist));
    await AsyncStorage.setItem(`mood_note_${profile}_${dateKey()}`, note);

    let translation = '';
    let translationFailed = false;
    const hasNote = note.trim().length > 0;

    if (hasNote) {
      setIsTranslating(true);
      try {
        translation = await translateMoodWithGroq({ note, score, authorProfile: profile });
      } catch {
        translationFailed = true;
        setSaveError(
          'Translation failed — check EXPO_PUBLIC_GROQ_API_KEY. Your score still syncs; add the key and save again for your journal.'
        );
      }
      setIsTranslating(false);
    }

    if (householdId && isFirebaseConfigured()) {
      const payload: MoodSyncPayload = {
        dotScore,
        updatedAt: Date.now(),
      };
      if (translation) {
        payload.translation = translation;
        payload.translatedText = translation;
      }
      try {
        await writeShared(moodPath(householdId, profile, dateKey()), payload);
        if (translation) {
          await AsyncStorage.setItem(`mood_translation_${profile}_${dateKey()}`, translation);
        }
      } catch {
        setSaveError('Could not reach Firebase — entry saved locally; will retry when online.');
        return false;
      }
    }

    if (hasNote && translationFailed) {
      return false;
    }

    return true;
  }, [dotScore, history, householdId, note, profile, score]);

  return {
    score,
    setScore,
    note,
    setNote,
    bracket,
    dotScore,
    partnerDot,
    partnerTranslatedText,
    partnerHistory,
    history,
    isTranslating,
    saveError,
    saveEntry,
  };
}
