import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ThemeColors } from '../colors';
import { FONT_FAMILIES } from '../typography';

type Props = {
  visible: boolean;
  colors: ThemeColors;
  onClose: () => void;
  onSave: (hour: number, minute: number, label: string) => void;
};

export function AddAlarmModal({ visible, colors, onClose, onSave }: Props) {
  const [label, setLabel] = useState('Custom alarm');
  const [hour, setHour] = useState('7');
  const [minute, setMinute] = useState('0');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.accent, fontFamily: FONT_FAMILIES.uiSemi }]}>NEW ALARM</Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="Label"
            placeholderTextColor={colors.textDisabled}
            style={[styles.input, { color: colors.text, borderColor: colors.border, fontFamily: FONT_FAMILIES.ui }]}
          />
          <View style={styles.row}>
            <TextInput
              value={hour}
              onChangeText={setHour}
              keyboardType="number-pad"
              maxLength={2}
              style={[styles.timeInput, { color: colors.text, borderColor: colors.border }]}
            />
            <Text style={{ color: colors.textMuted }}>:</Text>
            <TextInput
              value={minute}
              onChangeText={setMinute}
              keyboardType="number-pad"
              maxLength={2}
              style={[styles.timeInput, { color: colors.text, borderColor: colors.border }]}
            />
          </View>
          <View style={styles.actions}>
            <Pressable onPress={onClose} style={[styles.btn, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textMuted, fontFamily: FONT_FAMILIES.ui }}>CANCEL</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                const h = Math.min(23, Math.max(0, parseInt(hour, 10) || 0));
                const m = Math.min(59, Math.max(0, parseInt(minute, 10) || 0));
                onSave(h, m, label.trim() || 'Custom alarm');
                onClose();
              }}
              style={[styles.btn, { backgroundColor: colors.accent }]}
            >
              <Text style={{ color: '#0D0D0D', fontFamily: FONT_FAMILIES.uiSemi }}>SAVE</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  card: { borderWidth: 1, borderRadius: 12, padding: 20, gap: 12 },
  title: { fontSize: 12, letterSpacing: 2 },
  input: { borderWidth: 1, borderRadius: 6, padding: 10, fontSize: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center' },
  timeInput: { borderWidth: 1, borderRadius: 6, width: 56, padding: 10, fontSize: 18, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btn: { flex: 1, borderWidth: 1, borderRadius: 6, padding: 12, alignItems: 'center' },
});
