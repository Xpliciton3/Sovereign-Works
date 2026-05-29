import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ThemeColors } from '../colors';
import type { Profile } from '../types';
import { useHouseholdContext } from '../context/HouseholdContext';
import { SyncStatusDot, syncStatusLabel } from '../ui/SyncStatusDot';
import { isFirebaseConfigured } from '../firebase/config';
import { getProfileConfig } from '../profiles';

type Props = {
  profile: Profile;
  colors: ThemeColors;
  partnerApkUrl: string;
};

export function HouseholdSettingsPanel({ profile, colors, partnerApkUrl }: Props) {
  const hh = useHouseholdContext();
  const pc = getProfileConfig(profile);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isFirebaseConfigured()) {
    return (
      <Text style={{ color: colors.textMuted, fontSize: 12 }}>
        Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* keys to enable household sync.
      </Text>
    );
  }

  async function handleCreate() {
    if (!name.trim()) {
      setError('Enter a household name.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await hh.createNewHousehold(name.trim());
      setName('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create household.');
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin() {
    setBusy(true);
    setError(null);
    try {
      await hh.joinByCode(code);
      setCode('');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'JOIN_FAILED';
      if (msg === 'CODE_NOT_FOUND') setError('Code not found.');
      else if (msg === 'CODE_EXPIRED') setError('Code expired — ask partner to regenerate.');
      else if (msg === 'PROFILE_ALREADY_JOINED') setError('This profile is already in that household.');
      else setError('Could not join household.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={[styles.panel, { borderColor: colors.border }]}>
      <View style={styles.syncRow}>
        <SyncStatusDot status={hh.syncStatus} colors={colors} onRetry={() => void hh.retrySync()} />
        <Text style={{ color: colors.textMuted, fontSize: 12, flex: 1 }}>
          {syncStatusLabel(hh.syncStatus)}
        </Text>
      </View>

      {hh.householdId ? (
        <>
          <Text style={{ color: colors.text, fontSize: 13, marginTop: 8 }}>
            Household: {hh.household?.householdName ?? hh.householdId}
          </Text>
          {hh.joinCodeFormatted && !hh.partnerJoined ? (
            <>
              <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 8 }}>
                Invite code for {pc.partnerName}:
              </Text>
              <Text style={{ color: colors.accent, fontSize: 24, letterSpacing: 3, marginVertical: 8 }}>
                {hh.joinCodeFormatted}
              </Text>
            </>
          ) : null}
          {hh.partnerJoined ? (
            <Text style={{ color: '#44aa44', fontSize: 12, marginTop: 8 }}>
              {pc.partnerName} is connected.
            </Text>
          ) : (
            <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 8 }}>
              Waiting for {pc.partnerName} to join.
            </Text>
          )}
        </>
      ) : (
        <>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 8 }}>
            Create a household (first phone) or join with your partner&apos;s code.
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Household name"
            placeholderTextColor={colors.textDisabled}
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
          />
          <Pressable onPress={() => void handleCreate()} style={[styles.btn, { backgroundColor: colors.accent }]}>
            {busy ? (
              <ActivityIndicator color="#0D0D0D" />
            ) : (
              <Text style={{ color: '#0D0D0D', fontSize: 11, letterSpacing: 1 }}>CREATE HOUSEHOLD</Text>
            )}
          </Pressable>
          <Text style={{ color: colors.textDisabled, fontSize: 10, textAlign: 'center', marginVertical: 10 }}>— or —</Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="6-digit join code"
            placeholderTextColor={colors.textDisabled}
            keyboardType="number-pad"
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
          />
          <Pressable onPress={() => void handleJoin()} style={[styles.btnOutline, { borderColor: colors.border }]}>
            <Text style={{ color: colors.text, fontSize: 11, letterSpacing: 1 }}>JOIN HOUSEHOLD</Text>
          </Pressable>
        </>
      )}

      {error ? <Text style={{ color: '#c04040', fontSize: 12, marginTop: 8 }}>{error}</Text> : null}
      <Text style={{ color: colors.textDisabled, fontSize: 10, marginTop: 12 }}>
        Partner APK: {partnerApkUrl.replace(/^https:\/\//, '')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderWidth: 1, borderRadius: 8, padding: 14, marginTop: 4 },
  syncRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { borderWidth: 1, borderRadius: 6, padding: 10, fontSize: 14, marginBottom: 8 },
  btn: { borderRadius: 6, padding: 12, alignItems: 'center' },
  btnOutline: { borderWidth: 1, borderRadius: 6, padding: 12, alignItems: 'center' },
});
