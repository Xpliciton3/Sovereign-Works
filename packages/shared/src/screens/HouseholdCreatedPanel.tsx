import { useEffect, useState, type ReactNode } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '../colors';
import { householdShareMessage, watchHousehold, type HouseholdConfig } from '../firebase/household';
import type { Profile } from '../types';

export type HouseholdCreatedPayload = {
  householdName: string;
  joinCode: string;
  householdId: string;
};

type Props = {
  colors: ThemeColors;
  payload: HouseholdCreatedPayload;
  partnerProfile: Profile;
  partnerDisplayName: string;
  partnerApkUrl: string;
  onContinueSolo: () => void;
  renderButton: (props: { label: string; onPress: () => void }) => ReactNode;
  renderScreen: (children: ReactNode) => ReactNode;
};

export function HouseholdCreatedPanel({
  colors,
  payload,
  partnerProfile,
  partnerDisplayName,
  partnerApkUrl,
  onContinueSolo,
  renderButton,
  renderScreen,
}: Props) {
  const [partnerJoined, setPartnerJoined] = useState(false);

  useEffect(() => {
    const unsubscribe = watchHousehold(payload.householdId, (household: HouseholdConfig | null) => {
      if (household?.members?.[partnerProfile]) {
        setPartnerJoined(true);
      }
    });
    return unsubscribe;
  }, [payload.householdId, partnerProfile]);

  async function shareCode() {
    await Share.share({
      message: householdShareMessage(payload.joinCode, partnerApkUrl),
    });
  }

  const householdTitle = payload.householdName.toUpperCase();

  return renderScreen(
    <>
      <Text style={[styles.heading, { color: colors.text }]}>THE {householdTitle} HOUSEHOLD</Text>
      <Text style={[styles.body, { color: colors.textMuted }]}>Your household is ready.</Text>
      <Text style={[styles.body, { color: colors.textMuted }]}>
        Share this code with {partnerDisplayName} so they can join:
      </Text>
      <Text style={[styles.code, { color: colors.accent }]}>{payload.joinCode}</Text>
      <View style={styles.row}>{renderButton({ label: 'Share code', onPress: shareCode })}</View>
      <View style={[styles.divider, { borderColor: colors.border }]} />
      <Text style={[styles.waiting, { color: colors.textMuted }]}>
        {partnerJoined
          ? `${partnerDisplayName} has joined.`
          : `Waiting for ${partnerDisplayName} to join...`}
      </Text>
      {renderButton({ label: 'Skip for now — continue solo', onPress: onContinueSolo })}
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    letterSpacing: 3,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  code: {
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 6,
    marginVertical: 16,
  },
  row: {
    width: '100%',
  },
  divider: {
    borderTopWidth: 1,
    marginVertical: 16,
  },
  waiting: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
});
