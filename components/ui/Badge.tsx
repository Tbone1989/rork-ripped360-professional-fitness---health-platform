import React from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  label?: string;
  children?: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  children,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
}) => {
  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'primary':
        return colors.accent.primary;
      case 'secondary':
        return colors.background.secondary;
      case 'outline':
        return 'transparent';
      case 'success':
        return colors.status.success;
      case 'warning':
        return colors.status.warning;
      case 'error':
        return colors.status.error;
      case 'info':
        return colors.status.info;
      default:
        return colors.background.tertiary;
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'warning':
        return '#000000';
      case 'default':
        return colors.text.secondary;
      case 'secondary':
        return colors.text.primary;
      case 'outline':
        return colors.accent.primary;
      default:
        return colors.text.primary;
    }
  };

  const getPadding = (): { paddingVertical: number; paddingHorizontal: number } => {
    switch (size) {
      case 'small':
        return { paddingVertical: 2, paddingHorizontal: 6 };
      case 'large':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      default:
        return { paddingVertical: 4, paddingHorizontal: 8 };
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return 10;
      case 'large':
        return 14;
      default:
        return 12;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          ...getPadding(),
          ...(variant === 'outline' && {
            borderWidth: 1,
            borderColor: colors.accent.primary,
          }),
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: getFontSize(),
          },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {children || label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});