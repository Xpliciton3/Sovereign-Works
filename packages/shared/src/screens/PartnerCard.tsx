import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '../colors';
import type { Profile } from '../types';
import { getProfileConfig } from '../profiles';
import { householdShareMessage } from '../firebase/household';
import { useMood } from '../hooks/useMood';
import { SyncStatusDot, syncStatusLabel } from '../ui/SyncStatusDot';
import type { SyncStatus } from '../firebase/sync';

type Props = {
  profile: Profile;
  colors: ThemeColors;
  householdId: string | null;
  partnerJoined: boolean;
  partnerName: string;
  partnerDoneCount: number;
  partnerTotalCount: number;
  syncStatus: SyncStatus;
  joinCodeFormatted: string | null;
  partnerApkUrl: string;
  onInvite?: () => void;
  onRetrySync?: () => void;
};

export function PartnerCard({
  profile,
  colors,
  householdId,
  partnerJoined,
  partnerName,
  partnerDoneCount,
  partnerTotalCount,
  syncStatus,
  joinCodeFormatted,
  partnerApkUrl,
  onInvite,
  onRetrySync,
}: Props) {
  const pc = getProfileConfig(profile);
  const mood = useMood(profile, householdId);
  const partnerTradition = pc.partnerProfile;
  const dotColor = profile === 'imperium' ? '#c47878' : '#c9a84c';
  const total = partnerTotalCount > 0 ? partnerTotalCount : 8;

  if (!householdId) {
    return (
      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>
          Create or join a household in Settings → Household to sync with your partner.
        </Text>
      </View>
    );
  }

  if (!partnerJoined) {
    return (
      <View style={[styles.card, { borderColor: colors.accent, backgroundColor: colors.surface }]}>
        <Text style={{ color: colors.accent, fontSize: 11, letterSpacing: 1 }}>INVITE {partnerName.toUpperCase()}</Text>
        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 8, lineHeight: 18 }}>
          Share your join code so {partnerName} can connect on their phone.
        </Text>
        {joinCodeFormatted ? (
          <Text style={{ color: colors.accent, fontSize: 28, letterSpacing: 4, marginVertical: 12 }}>
            {joinCodeFormatted}
          </Text>
        ) : null}
        <Pressable
          onPress={async () => {
            if (joinCodeFormatted) {
              await Share.share({
                message: householdShareMessage(joinCodeFormatted, partnerApkUrl),
              });
            }
            onInvite?.();
          }}
          style={[styles.btn, { borderColor: colors.accent }]}
        >
          <Text style={{ color: colors.accent, fontSize: 11, letterSpacing: 1 }}>SHARE INVITE</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SyncStatusDot status={syncStatus} colors={colors} onRetry={onRetrySync} size={7} />
          <Text style={{ color: dotColor, fontSize: 11, letterSpacing: 1 }}>
            {partnerName.toUpperCase()} — {partnerTradition === 'imperium' ? 'THE IMPERIUM' : 'THE TENDING'}
          </Text>
        </View>
      </View>
      <View style={styles.dots}>
        {[1, 2, 3, 4, 5].map((d) => (
          <View
            key={d}
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: mood.partnerDot !== null && d <= mood.partnerDot ? dotColor : colors.surfaceElevated,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          />
        ))}
      </View>
      {mood.partnerDot === null ? (
        <Text style={{ color: colors.textDisabled, fontSize: 11, marginTop: 6 }}>No reading yet today.</Text>
      ) : mood.partnerTranslation ? (
        <Text style={{ color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 6 }}>
          {mood.partnerTranslation}
        </Text>
      ) : null}
      <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 10 }}>
        {partnerDoneCount} of {total} items complete today
      </Text>
      <Text style={{ color: colors.textDisabled, fontSize: 10, marginTop: 4 }}>
        {syncStatusLabel(syncStatus)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dots: { flexDirection: 'row', gap: 6, marginTop: 10 },
  btn: { borderWidth: 1, borderRadius: 6, padding: 10, alignItems: 'center', marginTop: 8 },
});
