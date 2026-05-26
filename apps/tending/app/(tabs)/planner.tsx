import { Alert } from 'react-native';
import { Layer2PlannerScreen } from '@sovereign/shared';
import { useSovereignTheme } from '@/components/SovereignScreen';
import { PROFILE } from '@/constants/profile';

export default function PlannerScreen() {
  const colors = useSovereignTheme();

  return (
    <Layer2PlannerScreen
      profile={PROFILE}
      colors={colors}
      onSetAlarm={() =>
        Alert.alert('Set Alarm', 'Native alarm wiring arrives in Layer 3.', [{ text: 'OK' }])
      }
    />
  );
}
