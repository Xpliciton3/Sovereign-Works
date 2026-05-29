import type { Profile } from '../types';
import type { ThemeColors } from '../colors';
import { DoctrineReaderScreen } from './DoctrineReaderScreen';
import { WARRIORS_PRACTICE } from '../content/layer5/WARRIORS_PRACTICE';
import { KEEPERS_PRACTICE } from '../content/layer5/KEEPERS_PRACTICE';

type Props = {
  profile: Profile;
  colors: ThemeColors;
};

export function PracticeScreen({ profile, colors }: Props) {
  const body = profile === 'imperium' ? WARRIORS_PRACTICE : KEEPERS_PRACTICE;
  const title = profile === 'imperium' ? "The Warrior's Practice" : "The Keeper's Practice";
  return (
    <DoctrineReaderScreen
      title={title}
      subtitle={profile === 'imperium' ? 'Iaido · Kyudo · Systema · Daggers' : 'Yoga · Strength · Tending Protocol'}
      body={body}
      colors={colors}
      accent={profile === 'imperium' ? '#18c48a' : colors.accent}
    />
  );
}
