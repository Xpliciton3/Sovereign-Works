import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { createHousehold, isFirebaseConfigured } from '@sovereign/shared';
import { SovereignScreen, useSovereignTheme } from '@/components/SovereignScreen';
import { PrimaryButton } from '@/components/LockScreen';
import { PROFILE, profileConfig } from '@/constants/profile';
import { setStoredHouseholdId } from '@/lib/storage';

export default function CreateHouseholdScreen() {
  const colors = useSovereignTheme();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) {
      setError('Enter a household name.');
      return;
    }

    if (!isFirebaseConfigured()) {
      setError('Firebase is not configured. Add keys to .env from Firebase console.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createHousehold(name.trim(), {
        profile: PROFILE,
        personName: profileConfig.personName,
      });
      await setStoredHouseholdId(result.householdId);
      router.replace({
        pathname: '/onboarding/household-created',
        params: {
          householdName: name.trim(),
          joinCode: result.joinCodeFormatted,
          householdId: result.householdId,
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create household.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SovereignScreen style={styles.container}>
      <Text style={[styles.heading, { color: colors.text }]}>NAME YOUR HOUSEHOLD</Text>
      <Text style={[styles.body, { color: colors.textMuted }]}>
        This connects both phones to the same system.
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. Bane"
        placeholderTextColor={colors.textDisabled}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      />
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : (
        <PrimaryButton label="Create →" onPress={handleCreate} />
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
    paddingVertical: 14,
    fontSize: 16,
  },
  error: {
    fontSize: 13,
  },
});
