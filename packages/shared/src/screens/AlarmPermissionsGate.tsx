import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '../colors';
import { checkAlarmPermissions, PERMISSION_COPY } from '../alarms/permissionsFlow';
import { requestAlarmPermissions } from '../alarms/permissions';

type Props = {
  colors: ThemeColors;
  onGranted?: () => void;
};

export function AlarmPermissionsGate({ colors, onGranted }: Props) {
  const [status, setStatus] = useState<Awaited<ReturnType<typeof checkAlarmPermissions>> | null>(null);

  const refresh = () => {
    void checkAlarmPermissions().then(setStatus);
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (status?.allGranted) onGranted?.();
  }, [status, onGranted]);

  if (Platform.OS !== 'android' || status?.allGranted) return null;

  return (
    <View style={[styles.box, { borderColor: colors.accent, backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.accent }]}>Alarm permissions required</Text>
      <Text style={[styles.body, { color: colors.textMuted }]}>
        {!status?.exactAlarm && PERMISSION_COPY.exactAlarm}
        {status && !status.exactAlarm && !status.overlay ? '\n\n' : ''}
        {status && !status.overlay ? PERMISSION_COPY.overlay : ''}
        {status && !status.notifications ? `\n\n${PERMISSION_COPY.notifications}` : ''}
      </Text>
      <Pressable
        onPress={async () => {
          await requestAlarmPermissions();
          refresh();
        }}
        style={[styles.btn, { borderColor: colors.accent }]}
      >
        <Text style={{ color: colors.accent, fontSize: 11, letterSpacing: 1 }}>GRANT PERMISSIONS</Text>
      </Pressable>
      {status?.allGranted && (
        <Text style={{ color: colors.accent, fontSize: 12, marginTop: 8 }}>{PERMISSION_COPY.active}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 14 },
  title: { fontSize: 13, letterSpacing: 1, marginBottom: 8 },
  body: { fontSize: 12, lineHeight: 18, marginBottom: 12 },
  btn: { borderWidth: 1, borderRadius: 6, padding: 10, alignItems: 'center' },
});
