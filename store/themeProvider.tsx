import { useCallback, useEffect, useMemo, useState } from 'react';
import { Appearance, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@/utils/createContextHook';
import { buildTheme, Theme, ThemeMode } from '@/constants/theme';

const STORAGE_KEY = 'ui_theme_v1';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const colorScheme = Appearance.getColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setMode((JSON.parse(raw) as ThemeMode) ?? 'system');
      } catch (e) {
        console.error('[Theme] load failed', e);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme: next }) => {
      console.log('[Theme] appearance changed', next);
    });
    return () => sub.remove();
  }, []);

  const effectiveMode: Exclude<ThemeMode, 'system'> = mode === 'system' ? (colorScheme === 'dark' ? 'dark' : 'light') : mode;
  const theme: Theme = useMemo(() => buildTheme(effectiveMode), [effectiveMode]);

  const setThemeMode = useCallback(async (next: ThemeMode) => {
    try {
      setMode(next);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('[Theme] persist failed', e);
    }
  }, []);

  return { mode, theme, setThemeMode, isWeb: Platform.OS === 'web' };
});
