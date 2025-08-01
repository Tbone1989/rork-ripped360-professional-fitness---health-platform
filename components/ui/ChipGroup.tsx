import React from 'react';
import { StyleSheet, View, ScrollView, ViewStyle } from 'react-native';
import { Chip } from './Chip';

interface ChipOption {
  id: string;
  label: string;
  disabled?: boolean;
}

interface ChipGroupProps {
  options: ChipOption[];
  selectedIds?: string[];
  selectedId?: string;
  onChange?: (selectedIds: string[]) => void;
  onSelect?: (ids: string[]) => void;
  multiSelect?: boolean;
  style?: ViewStyle;
  scrollable?: boolean;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  options,
  selectedIds = [],
  selectedId,
  onChange,
  onSelect,
  multiSelect = false,
  style,
  scrollable = true,
}) => {
  const actualSelectedIds = selectedId ? [selectedId] : selectedIds;
  const handleChange = onChange || onSelect || (() => {});
  const handleChipPress = (id: string) => {
    if (multiSelect) {
      const newSelectedIds = actualSelectedIds.includes(id)
        ? actualSelectedIds.filter((selectedId) => selectedId !== id)
        : [...actualSelectedIds, id];
      handleChange(newSelectedIds);
    } else {
      handleChange([id]);
    }
  };

  const renderChips = () => {
    return options.map((option) => (
      <Chip
        key={option.id}
        label={option.label}
        selected={actualSelectedIds.includes(option.id)}
        onPress={() => handleChipPress(option.id)}
        disabled={option.disabled}
        style={styles.chip}
      />
    ));
  };

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, style]}
      >
        {renderChips()}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {renderChips()}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    gap: 8,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
});