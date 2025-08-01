import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  style,
  textStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
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