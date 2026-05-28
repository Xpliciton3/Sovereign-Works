import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { awakeCopyFor } from '../alarms/alarmLabels';

type Props = {
  visible: boolean;
  profile: Profile;
  colors: ThemeColors;
  snoozeMinutes?: number;
  onConfirm: () => void;
  onSnooze: () => void;
  onClose: () => void;
};

export function AreYouAwakeModal({
  visible,
  profile,
  colors,
  snoozeMinutes = 9,
  onConfirm,
  onSnooze,
  onClose,
}: Props) {
  const copy = awakeCopyFor(profile);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (!visible) {
      setSeconds(30);
      return;
    }
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          onSnooze();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [visible, onSnooze]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.accent }]}>
          <Text style={[styles.question, { color: colors.text }]}>{copy.question}</Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginBottom: 16 }}>
            {copy.countdown(seconds)}
          </Text>
          <View style={styles.actions}>
            <Pressable onPress={onSnooze} style={[styles.btn, { borderColor: colors.accent }]}>
              <Text style={{ color: colors.accent }}>{copy.snooze.replace('9', String(snoozeMinutes))}</Text>
            </Pressable>
            <Pressable onPress={onConfirm} style={[styles.btn, { backgroundColor: colors.accent }]}>
              <Text style={{ color: '#000' }}>{copy.confirm}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 24 },
  card: { borderWidth: 1, borderRadius: 12, padding: 24 },
  question: { fontSize: 20, textAlign: 'center', marginBottom: 12, fontStyle: 'italic' },
  actions: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 14, alignItems: 'center' },
});
