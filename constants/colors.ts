export const colors = {
  background: {
    primary: '#000000',
    secondary: '#2C2C2C',
    tertiary: '#1E1E1E',
    card: '#121212',
    modal: '#0A0A0A',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    tertiary: '#999999',
    disabled: '#666666',
  },
  accent: {
    primary: '#FF0000',
    secondary: '#FFD700',
    tertiary: '#FFFFFF',
  },
  status: {
    success: '#00C851',
    warning: '#FFD700',
    error: '#FF0000',
    info: '#1E88E5',
  },
  border: {
    light: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.14)',
    focused: 'rgba(255, 0, 0, 0.5)',
  },
  gradient: {
    primary: ['#FF0000', '#CC0000'] as const,
    secondary: ['#2C2C2C', '#000000'] as const,
  },
  brand: {
    PRIMARY: '#000000',
    SECONDARY: '#FF0000',
    ACCENT: '#FFFFFF',
    PREMIUM: '#FFD700',
    SUCCESS: '#00C851',
    TRUST: '#1E88E5',
    PROFESSIONAL: '#2C2C2C',
  },
} as const;