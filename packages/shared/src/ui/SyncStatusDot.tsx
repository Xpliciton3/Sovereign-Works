import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SyncStatus } from '../firebase/sync';
import type { ThemeColors } from '../colors';

const COLORS: Record<SyncStatus, string> = {
  connected: '#44aa44',
  syncing: '#c9a84c',
  offline: '#888888',
  error: '#c04040',
};

type Props = {
  status: SyncStatus;
  colors: ThemeColors;
  onRetry?: () => void;
  size?: number;
};

export function SyncStatusDot({ status, colors, onRetry, size = 8 }: Props) {
  const dot = (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: COLORS[status],
      }}
    />
  );

  if (status === 'error' && onRetry) {
    return (
      <Pressable onPress={onRetry} style={styles.row}>
        {dot}
        <Text style={{ color: colors.textMuted, fontSize: 9 }}>RETRY</Text>
      </Pressable>
    );
  }

  return dot;
}

export function syncStatusLabel(status: SyncStatus): string {
  switch (status) {
    case 'connected':
      return 'Connected';
    case 'syncing':
      return 'Syncing…';
    case 'offline':
      return 'Offline — changes queued';
    case 'error':
      return 'Sync error — tap to retry';
    default:
      return status;
  }
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
