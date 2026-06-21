import { type ComponentType } from 'react';
import { type ColorValue } from 'react-native';

import { type NavigationIconSize } from '@/shared/ui/icons/HomeIcon';

/**
 * Native bottom navigation에서 직접 이동을 지원하는 WebView path입니다.
 * 새 탭을 추가할 때는 이 union과 `NAVIGATION_ITEMS`를 함께 갱신합니다.
 */
export type BottomNavigationPath = '/' | '/mypage';

export type NavigationIconProps = {
  color?: ColorValue;
  size?: NavigationIconSize;
};

export type NavigationItem = {
  Icon: ComponentType<NavigationIconProps>;
  id: string;
  label: string;
  path: BottomNavigationPath;
};

export type NavigationColors = {
  activeIcon: ColorValue;
  activeLabel: ColorValue;
  background: ColorValue;
  inactiveIcon: ColorValue;
  inactiveLabel: ColorValue;
};
