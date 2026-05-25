import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSovereignTheme } from '@/components/SovereignScreen';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function PrimaryButton({ label, onPress, disabled }: PrimaryButtonProps) {
  const colors = useSovereignTheme();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.surface,
          borderColor: colors.accent,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={[styles.label, { color: colors.accent }]}>{label}</Text>
    </Pressable>
  );
}

interface LockScreenProps {
  tabName: string;
  message: string;
}

export function LockScreen({ tabName, message }: LockScreenProps) {
  const colors = useSovereignTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.lockIcon, { color: colors.textDisabled }]}>🔒</Text>
      <Text style={[styles.title, { color: colors.textMuted }]}>{tabName}</Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  lockIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
