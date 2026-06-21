import { Pressable, StyleSheet, Text } from 'react-native';

import {
  type BottomNavigationPath,
  type NavigationColors,
  type NavigationItem,
} from '../model/types';

interface Props {
  colors: NavigationColors;
  isActive: boolean;
  item: NavigationItem;
  onPress: (path: BottomNavigationPath) => void;
}

export const NavigationTab = ({ colors, isActive, item, onPress }: Props) => {
  const Icon = item.Icon;
  const iconColor = isActive ? colors.activeIcon : colors.inactiveIcon;
  const labelColor = isActive ? colors.activeLabel : colors.inactiveLabel;

  return (
    <Pressable
      onPress={() => onPress(item.path)}
      style={styles.tab}
      accessibilityLabel={item.label}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
    >
      <Icon color={iconColor} />
      <Text style={[styles.label, { color: labelColor }]}>{item.label}</Text>
    </Pressable>
  );
};

const TAB_HEIGHT = 74;

const styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: TAB_HEIGHT,
    paddingBottom: 16,
    paddingTop: 18,
  },
  label: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 11,
    lineHeight: 13,
    marginTop: 8,
  },
});
