import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { getDatabase } from '../sqlite/db';
import {
  areLayer3PermissionsComplete,
  runLayer3PermissionFlow,
  subscribeAlarmLogFlush,
} from './alarmBootstrap';
import { AlarmPermissionsOnboarding } from '../screens/AlarmPermissionsOnboarding';
import type { ThemeColors } from '../colors';

type Props = {
  children: ReactNode;
  colors: ThemeColors;
};

export function Layer3Boot({ children, colors }: Props) {
  const [ready, setReady] = useState(Platform.OS !== 'android');
  const [permsOk, setPermsOk] = useState(Platform.OS !== 'android');

  useEffect(() => {
    let unsub: (() => void) | undefined;
    void (async () => {
      await getDatabase();
      unsub = subscribeAlarmLogFlush();
      const done = await areLayer3PermissionsComplete();
      setPermsOk(done);
      setReady(true);
    })();
    return () => unsub?.();
  }, []);

  if (!ready) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!permsOk) {
    return (
      <AlarmPermissionsOnboarding
        colors={colors}
        onComplete={async () => {
          const ok = await runLayer3PermissionFlow();
          setPermsOk(ok);
        }}
      />
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
