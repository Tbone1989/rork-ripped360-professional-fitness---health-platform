import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
export type ThemeMode = 'light' | 'dark' | 'system';

interface AccessibilitySettings {
  colorBlindMode: ColorBlindMode;
  themeMode: ThemeMode;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reduceMotion: boolean;
  screenReaderEnabled: boolean;
}

class AccessibilityService {
  private settings: AccessibilitySettings = {
    colorBlindMode: 'none',
    themeMode: 'system',
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    screenReaderEnabled: false,
  };

  constructor() {
    this.loadSettings();
  }

  private async loadSettings() {
    try {
      const saved = await AsyncStorage.getItem('accessibility_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
    }
  }

  public async saveSettings(settings: Partial<AccessibilitySettings>) {
    this.settings = { ...this.settings, ...settings };
    try {
      await AsyncStorage.setItem('accessibility_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  }

  public getSettings(): AccessibilitySettings {
    return this.settings;
  }

  public adjustColorForColorBlindness(color: string): string {
    if (this.settings.colorBlindMode === 'none') return color;

    // Color transformation matrices for different types of color blindness
    const transformations: Record<ColorBlindMode, (r: number, g: number, b: number) => [number, number, number]> = {
      none: (r, g, b) => [r, g, b],
      protanopia: (r, g, b) => [
        0.567 * r + 0.433 * g,
        0.558 * r + 0.442 * g,
        0.242 * b + 0.758 * b
      ],
      deuteranopia: (r, g, b) => [
        0.625 * r + 0.375 * g,
        0.7 * r + 0.3 * g,
        0.3 * b + 0.7 * b
      ],
      tritanopia: (r, g, b) => [
        0.95 * r + 0.05 * g,
        0.433 * g + 0.567 * b,
        0.475 * g + 0.525 * b
      ],
      achromatopsia: (r, g, b) => {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        return [gray, gray, gray];
      }
    };

    // Parse color and apply transformation
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;

    const transform = transformations[this.settings.colorBlindMode];
    const [newR, newG, newB] = transform(rgb.r, rgb.g, rgb.b);
    
    return this.rgbToHex(
      Math.round(newR),
      Math.round(newG),
      Math.round(newB)
    );
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  public getFontSizeMultiplier(): number {
    const multipliers = {
      'small': 0.85,
      'medium': 1,
      'large': 1.15,
      'extra-large': 1.3
    };
    return multipliers[this.settings.fontSize];
  }

  public getThemeColors(isDark: boolean) {
    const baseColors = isDark ? {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      background: '#000000',
      surface: '#1A1A1A',
      accent: '#FFD700',
      error: '#FF6B6B',
      success: '#4CAF50',
      warning: '#FFA726',
      border: '#333333',
    } : {
      primary: '#000000',
      secondary: '#666666',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      accent: '#FFD700',
      error: '#D32F2F',
      success: '#388E3C',
      warning: '#F57C00',
      border: '#E0E0E0',
    };

    // Apply high contrast if enabled
    if (this.settings.highContrast) {
      if (isDark) {
        baseColors.primary = '#FFFFFF';
        baseColors.secondary = '#FFFFFF';
        baseColors.background = '#000000';
        baseColors.surface = '#000000';
        baseColors.border = '#FFFFFF';
      } else {
        baseColors.primary = '#000000';
        baseColors.secondary = '#000000';
        baseColors.background = '#FFFFFF';
        baseColors.surface = '#FFFFFF';
        baseColors.border = '#000000';
      }
    }

    // Apply color blind adjustments
    Object.keys(baseColors).forEach(key => {
      baseColors[key as keyof typeof baseColors] = this.adjustColorForColorBlindness(
        baseColors[key as keyof typeof baseColors]
      );
    });

    return baseColors;
  }
}

export default new AccessibilityService();