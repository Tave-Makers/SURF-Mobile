import { StyleSheet, useColorScheme, View } from 'react-native';

import {
  type BottomNavigationPath,
  type NavigationColors,
  type NavigationItem,
} from '../model/types';
import { NavigationTab } from './NavigationTab';

import { HomeIcon } from '@/shared/ui/icons/HomeIcon';
import { MyIcon } from '@/shared/ui/icons/MyIcon';

interface Props {
  /** 현재 WebView 경로와 매칭되는 활성 탭 path입니다. */
  activePath: BottomNavigationPath;
  /** 테스트 또는 확장이 필요한 경우 기본 탭 목록을 대체할 수 있습니다. */
  items?: NavigationItem[];
  /** 탭을 눌렀을 때 WebView를 해당 path로 이동시키는 콜백입니다. */
  onNavigate: (path: BottomNavigationPath) => void;
}

/**
 * WebView 위에 고정되는 네이티브 하단 내비게이션입니다.
 *
 * `activePath`는 WebView의 현재 path와 동기화되어야 하며,
 * 이 컴포넌트는 탭 표시와 탭 클릭 이벤트 전달만 담당합니다.
 */
export const BottomNavigation = ({ activePath, items = NAVIGATION_ITEMS, onNavigate }: Props) => {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = getNavigationColors(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {items.map((item) => (
        <NavigationTab
          key={item.id}
          colors={colors}
          isActive={item.path === activePath}
          item={item}
          onPress={onNavigate}
        />
      ))}
    </View>
  );
};

const TAB_HEIGHT = 74;

const LIGHT_NAVIGATION_COLORS: NavigationColors = {
  activeIcon: '#4169E1',
  activeLabel: '#2D54C8',
  background: '#ffffff',
  inactiveIcon: '#D2DAE5',
  inactiveLabel: '#9DA6BE',
};

const DARK_NAVIGATION_COLORS: NavigationColors = {
  activeIcon: '#4169E1',
  activeLabel: '#2D54C8',
  background: '#171A22',
  inactiveIcon: '#5D6678',
  inactiveLabel: '#818BA0',
};

const NAVIGATION_ITEMS: NavigationItem[] = [
  { Icon: HomeIcon, id: 'home', label: '홈', path: '/' },
  { Icon: MyIcon, id: 'me', label: '마이페이지', path: '/mypage' },
];

const getNavigationColors = (isDarkMode: boolean) => {
  return isDarkMode ? DARK_NAVIGATION_COLORS : LIGHT_NAVIGATION_COLORS;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 4,
    flexDirection: 'row',
    height: TAB_HEIGHT,
    justifyContent: 'space-around',
    marginHorizontal: 4,
    marginTop: 6,
    shadowColor: '#000000',
    shadowOffset: { height: -2, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
});
