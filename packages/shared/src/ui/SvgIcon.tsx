import React from 'react';
import { Svg as RNSvg, Path } from 'react-native-svg';
import { IC, type IconName } from './icons';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function SvgIcon({ name, size = 20, color = '#E8E0D0', strokeWidth = 1.5 }: Props) {
  const pathData = IC[name];
  if (!pathData) return null;
  const segments = pathData.split('|');
  return (
    <RNSvg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {segments.map((d, i) => (
        <Path key={i} d={d} />
      ))}
    </RNSvg>
  );
}
