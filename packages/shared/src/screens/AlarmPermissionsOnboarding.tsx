import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '../colors';
import { FONT_FAMILIES } from '../typography';
import { checkAlarmPermissions, PERMISSION_COPY } from '../alarms/permissionsFlow';
import { requestAlarmPermissions, openAppSettings } from '../alarms/permissions';
import { markLayer3PermissionsComplete } from '../alarms/alarmBootstrap';

type Props = {
  colors: ThemeColors;
  onComplete: () => void | Promise<void>;
};

export function AlarmPermissionsOnboarding({ colors, onComplete }: Props) {
  const [status, setStatus] = useState<string>(PERMISSION_COPY.intro);

  const refresh = async () => {
    const s = await checkAlarmPermissions();
    if (s.allGranted) {
      await markLayer3PermissionsComplete();
      await onComplete();
      return;
    }
    const missing: string[] = [];
    if (!s.exactAlarm) missing.push('exact alarms');
    if (!s.overlay) missing.push('display over other apps');
    if (!s.notifications) missing.push('notifications');
    setStatus(`Still needed: ${missing.join(', ')}`);
  };

  if (Platform.OS !== 'android') {
    void onComplete();
    return null;
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.accent, fontFamily: FONT_FAMILIES.displayB }]}>
        Enable alarms
      </Text>
      <Text style={[styles.body, { color: colors.text, fontFamily: FONT_FAMILIES.ui }]}>
        {PERMISSION_COPY.intro}
      </Text>
      <Text style={[styles.status, { color: colors.textMuted, fontFamily: FONT_FAMILIES.uiLight }]}>
        {status}
      </Text>
      <Pressable
        onPress={async () => {
          await requestAlarmPermissions();
          await refresh();
        }}
        style={[styles.btn, { backgroundColor: colors.accent }]}
      >
        <Text style={[styles.btnText, { fontFamily: FONT_FAMILIES.uiSemi }]}>GRANT PERMISSIONS</Text>
      </Pressable>
      <Pressable onPress={() => openAppSettings()} style={[styles.btnOutline, { borderColor: colors.border }]}>
        <Text style={{ color: colors.textMuted, fontFamily: FONT_FAMILIES.ui, fontSize: 11, letterSpacing: 1 }}>
          OPEN SETTINGS
        </Text>
      </Pressable>
      <Pressable onPress={() => refresh()} style={styles.link}>
        <Text style={{ color: colors.accent, fontFamily: FONT_FAMILIES.ui, fontSize: 11 }}>I already granted — check again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 24, justifyContent: 'center', gap: 16 },
  title: { fontSize: 28, letterSpacing: 1, textAlign: 'center' },
  body: { fontSize: 14, lineHeight: 22, textAlign: 'center' },
  status: { fontSize: 12, textAlign: 'center' },
  btn: { borderRadius: 8, padding: 14, alignItems: 'center' },
  btnText: { color: '#0D0D0D', fontSize: 12, letterSpacing: 2 },
  btnOutline: { borderWidth: 1, borderRadius: 8, padding: 14, alignItems: 'center' },
  link: { alignItems: 'center', paddingTop: 8 },
});
