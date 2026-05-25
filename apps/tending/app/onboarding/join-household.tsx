import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { isFirebaseConfigured, joinHouseholdByCode } from '@sovereign/shared';
import { SovereignScreen, useSovereignTheme } from '@/components/SovereignScreen';
import { PrimaryButton } from '@/components/LockScreen';
import { PROFILE, profileConfig } from '@/constants/profile';
import { setOnboardingComplete, setStoredHouseholdId } from '@/lib/storage';

export default function JoinHouseholdScreen() {
  const colors = useSovereignTheme();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    if (code.replace(/\D/g, '').length !== 6) {
      setError('Enter the full 6-digit code.');
      return;
    }

    if (!isFirebaseConfigured()) {
      setError('Firebase is not configured. Add keys to .env from Firebase console.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await joinHouseholdByCode(code, {
        profile: PROFILE,
        personName: profileConfig.personName,
      });
      await setStoredHouseholdId(result.householdId);
      await setOnboardingComplete();
      router.replace('/(tabs)/planner');
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === 'CODE_NOT_FOUND') {
          setError('Code not found. Ask Garrin to check the code or generate a new one.');
        } else if (e.message === 'CODE_EXPIRED') {
          setError('This code has expired. Ask Garrin to generate a new one from Settings.');
        } else {
          setError(e.message);
        }
      } else {
        setError('Could not join household.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SovereignScreen style={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]}>JOIN YOUR HOUSEHOLD</Text>
      <Text style={[styles.body, { color: colors.textMuted }]}>
        Enter the code Garrin shared with you.
      </Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={7}
        placeholder="847-291"
        placeholderTextColor={colors.textDisabled}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            letterSpacing: 8,
          },
        ]}
      />
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : (
        <PrimaryButton label="Join →" onPress={handleJoin} />
      )}
    </SovereignScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center',
    gap: 16,
  },
  heading: {
    fontSize: 18,
    letterSpacing: 3,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 18,
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '600',
  },
  error: {
    fontSize: 13,
    lineHeight: 20,
  },
});
