import { type ComponentType } from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View, type ColorValue } from 'react-native';

import { HomeIcon, type NavigationIconSize } from './HomeIcon';
import { MyIcon } from './MyIcon';

export type BottomNavigationPath = '/' | '/mypage';

type NavigationIconProps = {
  color?: ColorValue;
  size?: NavigationIconSize;
};

type NavItem = {
  Icon: ComponentType<NavigationIconProps>;
  id: string;
  label: string;
  path: BottomNavigationPath;
};

const ACTIVE_ICON_COLOR = '#4169E1';
const ACTIVE_LABEL_COLOR = '#2D54C8';
const LIGHT_INACTIVE_ICON_COLOR = '#D2DAE5';
const LIGHT_INACTIVE_LABEL_COLOR = '#9DA6BE';
const DARK_BAR_COLOR = '#171A22';
const DARK_INACTIVE_ICON_COLOR = '#5D6678';
const DARK_INACTIVE_LABEL_COLOR = '#818BA0';

const DEFAULT_ITEMS: NavItem[] = [
  { Icon: HomeIcon, id: 'home', label: '홈', path: '/' },
  { Icon: MyIcon, id: 'me', label: '마이페이지', path: '/mypage' },
];

type BottomNavigationProps = {
  activePath: BottomNavigationPath;
  items?: NavItem[];
  onNavigate: (path: BottomNavigationPath) => void;
};

export const BottomNavigation = ({
  activePath,
  items = DEFAULT_ITEMS,
  onNavigate,
}: BottomNavigationProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const inactiveIconColor = isDarkMode ? DARK_INACTIVE_ICON_COLOR : LIGHT_INACTIVE_ICON_COLOR;
  const inactiveLabelColor = isDarkMode ? DARK_INACTIVE_LABEL_COLOR : LIGHT_INACTIVE_LABEL_COLOR;

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {items.map((item) => {
        const isActive = item.path === activePath;
        const iconColor = isActive ? ACTIVE_ICON_COLOR : inactiveIconColor;
        const Icon = item.Icon;

        return (
          <Pressable
            key={item.id}
            onPress={() => onNavigate(item.path)}
            style={styles.tab}
            accessibilityLabel={item.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Icon color={iconColor} />
            <Text
              style={[styles.label, { color: inactiveLabelColor }, isActive && styles.activeLabel]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 4,
    flexDirection: 'row',
    height: 74,
    justifyContent: 'space-around',
    marginHorizontal: 4,
    marginTop: 6,
    shadowColor: '#000000',
    shadowOffset: { height: -2, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  darkContainer: {
    backgroundColor: DARK_BAR_COLOR,
    shadowColor: '#000000',
    shadowOpacity: 0.24,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 74,
    paddingBottom: 16,
    paddingTop: 18,
  },
  label: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 11,
    lineHeight: 13,
    marginTop: 8,
  },
  activeLabel: {
    color: ACTIVE_LABEL_COLOR,
  },
});
