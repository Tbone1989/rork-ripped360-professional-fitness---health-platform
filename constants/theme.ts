import { colors } from '@/constants/colors';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: { primary: string; secondary: string; tertiary: string; card: string; modal: string };
  text: { primary: string; secondary: string; tertiary: string; disabled: string };
  accent: { primary: string; secondary: string; tertiary: string };
  status: { success: string; warning: string; error: string; info: string };
  border: { light: string; medium: string; focused: string };
}

export interface Theme {
  mode: Exclude<ThemeMode, 'system'>;
  colors: ThemeColors;
  radius: { xs: number; sm: number; md: number; lg: number; xl: number };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
  opacity: { disabled: number; overlay: number };
}

const lightColors: ThemeColors = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#EEEEEE',
    card: '#FFFFFF',
    modal: '#FFFFFF',
  },
  text: {
    primary: '#111111',
    secondary: '#333333',
    tertiary: '#666666',
    disabled: '#999999',
  },
  accent: {
    primary: colors.accent.primary,
    secondary: colors.accent.secondary,
    tertiary: colors.accent.tertiary,
  },
  status: {
    success: colors.status.success,
    warning: colors.status.warning,
    error: colors.status.error,
    info: colors.status.info,
  },
  border: {
    light: 'rgba(0, 0, 0, 0.08)',
    medium: 'rgba(0, 0, 0, 0.14)',
    focused: 'rgba(255, 0, 0, 0.5)',
  },
};

const darkColors: ThemeColors = {
  background: colors.background,
  text: colors.text,
  accent: colors.accent,
  status: colors.status,
  border: colors.border,
};

export const buildTheme = (mode: Exclude<ThemeMode, 'system'>): Theme => ({
  mode,
  colors: mode === 'dark' ? darkColors : lightColors,
  radius: { xs: 6, sm: 10, md: 14, lg: 20, xl: 28 },
  spacing: { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 },
  opacity: { disabled: 0.5, overlay: 0.7 },
});
