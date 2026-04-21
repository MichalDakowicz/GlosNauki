import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { TabId } from '../types/ui';

type BottomNavigationProps = {
  activeTab: TabId;
  onTabPress: (tab: TabId) => void;
};

type NavItem = {
  id: TabId;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  accessibilityLabel: string;
};

const ITEMS: NavItem[] = [
  { id: 'materials', icon: 'file-clock-outline', accessibilityLabel: 'Materialy' },
  { id: 'session', icon: 'microphone-outline', accessibilityLabel: 'Sesja glosowa' },
  { id: 'profile', icon: 'account-outline', accessibilityLabel: 'Profil' },
];

export function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  return (
    <View style={styles.container}>
      {ITEMS.map((item) => {
        const isActive = item.id === activeTab;
        return (
          <Pressable
            key={item.id}
            style={[styles.item, isActive && styles.activeItem]}
            onPress={() => onTabPress(item.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={item.accessibilityLabel}
            accessibilityHint="Przelacza sekcje aplikacji"
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={54}
              color={isActive ? '#d0adb1' : '#552430'}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 26,
    borderWidth: 3,
    borderColor: '#6f4950',
    backgroundColor: '#bd9398',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    minHeight: 108,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeItem: {
    backgroundColor: '#4b161d',
  },
});
