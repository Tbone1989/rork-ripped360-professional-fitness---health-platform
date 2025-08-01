import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface Tab {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
  style?: ViewStyle;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              isActive && styles.activeTab,
              { width: `${100 / tabs.length}%` },
            ]}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            {tab.icon && (
              <View style={styles.iconContainer}>
                {tab.icon}
              </View>
            )}
            <Text
              style={[
                styles.tabLabel,
                isActive && styles.activeTabLabel,
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  activeTabLabel: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  iconContainer: {
    marginRight: 6,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: colors.accent.primary,
    borderRadius: 1.5,
  },
});