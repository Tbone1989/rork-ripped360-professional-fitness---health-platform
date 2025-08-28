import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle, TextStyle, View } from 'react-native';
import { colors } from '@/constants/colors';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  testID?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  style,
  textStyle,
  disabled = false,
  leftIcon,
  testID,
}) => {
  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.chip,
        selected && styles.selectedChip,
        disabled && styles.disabledChip,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        <Text
          style={[
            styles.label,
            selected && styles.selectedLabel,
            disabled && styles.disabledLabel,
            textStyle,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  leftIcon: {
    marginRight: 2,
  },
  selectedChip: {
    backgroundColor: colors.accent.primary,
  },
  disabledChip: {
    opacity: 0.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  selectedLabel: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  disabledLabel: {
    color: colors.text.tertiary,
  },
});