import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SovereignScreen, useSovereignTheme } from '@/components/SovereignScreen';
import { SigilMark } from '@/components/SigilMark';
import { PrimaryButton } from '@/components/LockScreen';
import { profileConfig } from '@/constants/profile';

export default function WelcomeScreen() {
  const colors = useSovereignTheme();

  return (
    <SovereignScreen style={styles.container}>
      <SigilMark size={88} />
      <Text style={[styles.title, { color: colors.text }]}>{profileConfig.displayName.toUpperCase()}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        {profileConfig.practitionerTitle} Operating System
      </Text>
      <View style={styles.actions}>
        <PrimaryButton label="Join Existing Household" onPress={() => router.push('/onboarding/join-household')} />
        <PrimaryButton label="Create New Household" onPress={() => router.push('/onboarding/create-household')} />
      </View>
    </SovereignScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    letterSpacing: 4,
    marginTop: 24,
  },
  subtitle: {
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 32,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
});
