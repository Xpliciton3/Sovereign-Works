import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onValue, ref } from 'firebase/database';
import { getFirebaseDb, isFirebaseConfigured } from '../firebase/config';
import { writeShared } from '../firebase/sync';
import { getMoodTranslation, scoreBracketLabel, scoreToDot } from '../content/moodTranslations';
import type { Profile } from '../types';
import { translateMoodWithGroq } from '../ai/groqMood';

function dateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function moodPath(householdId: string, memberProfile: Profile, day: string): string {
  return `households/${householdId}/mood/${memberProfile}/${day}`;
}

export function useMood(profile: Profile, householdId: string | null) {
  const [score, setScore] = useState(3);
  const [note, setNote] = useState('');
  const [partnerDot, setPartnerDot] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([3, 2, 4, 2, 3, 5, 3]);
  const [previewTranslation, setPreviewTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const partnerProfile: Profile = profile === 'imperium' ? 'tending' : 'imperium';
  const partnerTranslation =
    partnerDot !== null ? getMoodTranslation(partnerDot * 2, profile) : null;

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
    const path = moodPath(householdId, partnerProfile, dateKey());
    const db = getFirebaseDb();
    return onValue(ref(db, path), (snap) => {
      const val = snap.val() as { dotScore?: number } | null;
      setPartnerDot(typeof val?.dotScore === 'number' ? val.dotScore : null);
    });
  }, [householdId, partnerProfile]);

  const bracket = scoreBracketLabel(score);
  const dotScore = scoreToDot(score);

  const syncDotScore = useCallback(async () => {
    if (!householdId || !isFirebaseConfigured()) return;
    await writeShared(moodPath(householdId, profile, dateKey()), {
      dotScore,
      updatedAt: Date.now(),
    });
  }, [dotScore, householdId, profile]);

  const saveLocalMood = useCallback(async () => {
    const nextHist = [...history.slice(-6), score];
    setHistory(nextHist);
    await AsyncStorage.setItem(`mood_history_${profile}`, JSON.stringify(nextHist));
    await AsyncStorage.setItem(`mood_note_${profile}_${dateKey()}`, note);
    await syncDotScore();
  }, [history, note, profile, score, syncDotScore]);

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
    clearPreview: () => setPreviewTranslation(''),
  };
}
