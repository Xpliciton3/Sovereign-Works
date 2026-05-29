import type { ThemeColors } from '../colors';
import { VELNAR_GUIDE } from '../content/layer5/VELNAR_GUIDE';
import { DoctrineReaderScreen } from './DoctrineReaderScreen';

type Props = {
  colors: ThemeColors;
};

/** Imperium only — Vel'nar language guide (verbatim from spec). */
export function VelnarGuideScreen({ colors }: Props) {
  return (
    <DoctrineReaderScreen
      title="Vel'nar"
      subtitle="The Language of the Uncrowned — phonology, roots, vocabulary"
      body={VELNAR_GUIDE}
      colors={colors}
      accent="#9060f0"
    />
  );
}
