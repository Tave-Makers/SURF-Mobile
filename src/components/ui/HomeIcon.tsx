import { type ColorValue, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export type NavigationIconSize = 's' | 'm' | 'l' | 'xl';

type HomeIconProps = {
  color?: ColorValue;
  size?: NavigationIconSize;
  style?: StyleProp<ViewStyle>;
};

const sizeMap: Record<NavigationIconSize, number> = { s: 16, m: 20, l: 24, xl: 28 };

export const HomeIcon = ({ color = '#262626', size = 'l', style }: HomeIconProps) => {
  const iconSize = sizeMap[size];

  return (
    <Svg fill="none" height={iconSize} style={style} viewBox="0 0 24 24" width={iconSize}>
      <Path
        d="M12.8567 4.05949L18.7234 8.87737C19.0528 9.14789 19.25 9.56288 19.25 10.0078V18.8101C19.25 19.624 18.6123 20.25 17.8667 20.25H15.25V15.5C15.25 13.9812 14.0188 12.75 12.5 12.75H11.5C9.98122 12.75 8.75 13.9812 8.75 15.5V20.25H6.13333C5.38774 20.25 4.75 19.624 4.75 18.8101V10.0078C4.75 9.56288 4.94723 9.14789 5.27664 8.87737L11.1433 4.05949C11.6458 3.64684 12.3542 3.64684 12.8567 4.05949ZM17.8667 21.75C19.4775 21.75 20.75 20.4151 20.75 18.8101V10.0078C20.75 9.12224 20.358 8.27883 19.6753 7.71817L13.8087 2.90028C12.7529 2.03324 11.2471 2.03324 10.1913 2.90029L4.32466 7.71817C3.64195 8.27883 3.25 9.12224 3.25 10.0078V18.8101C3.25 20.4151 4.52252 21.75 6.13333 21.75H17.8667Z"
        fill={color}
      />
    </Svg>
  );
};
