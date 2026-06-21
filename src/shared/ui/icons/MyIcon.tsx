import { type ColorValue, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { type NavigationIconSize } from './HomeIcon';

interface Props {
  color?: ColorValue;
  size?: NavigationIconSize;
  style?: StyleProp<ViewStyle>;
}

const sizeMap: Record<NavigationIconSize, number> = { s: 16, m: 20, l: 24, xl: 28 };

export const MyIcon = ({ color = '#262626', size = 'l', style }: Props) => {
  const iconSize = sizeMap[size];

  return (
    <Svg fill="none" height={iconSize} style={style} viewBox="0 0 24 24" width={iconSize}>
      <Path
        d="M9 15C9.85038 15.6303 10.8846 16 12 16C13.1154 16 14.1496 15.6303 15 15"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <Path
        d="M9.5 10.5V10"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <Path
        d="M14.5 10.5V10"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <Path
        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
};
