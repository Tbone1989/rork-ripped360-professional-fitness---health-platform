import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/store/themeProvider';
import { colors } from '@/constants/colors';

interface Option {
  key: 'light' | 'dark' | 'system';
  label: string;
}

export const ThemeToggle: React.FC = React.memo(() => {
  const { mode, setThemeMode, theme } = useTheme();

  const options: Option[] = useMemo(() => [
    { key: 'light', label: 'Light' },
    { key: 'dark', label: 'Dark' },
    { key: 'system', label: 'System' },
  ], []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.card }]} testID="theme-toggle">
      {options.map((opt) => {
        const selected = mode === opt.key;
        return (
          <TouchableOpacity
            key={opt.key}
            style={[styles.chip, selected && { backgroundColor: colors.accent.primary }]}
            onPress={() => setThemeMode(opt.key)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            testID={`theme-${opt.key}`}
          >
            <Text style={[styles.label, { color: selected ? '#FFFFFF' : theme.colors.text.secondary }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8 as unknown as number,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ThemeToggle;
