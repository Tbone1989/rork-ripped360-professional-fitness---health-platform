import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      opacity: disabled ? 0.5 : 1,
      width: fullWidth ? '100%' : undefined,
    };

    return baseStyle;
  };

  const getButtonStyle = (): ViewStyle => {
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
      medium: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
      large: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12 },
    };

    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {},
      secondary: { backgroundColor: colors.background.tertiary },
      outline: { 
        backgroundColor: 'transparent', 
        borderWidth: 1, 
        borderColor: colors.accent.primary 
      },
      ghost: { backgroundColor: 'transparent' },
    };

    return {
      ...sizeStyles[size],
      ...variantStyles[variant],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles: Record<ButtonSize, TextStyle> = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    const variantStyles: Record<ButtonVariant, TextStyle> = {
      primary: { color: colors.text.primary, fontWeight: '600' },
      secondary: { color: colors.text.primary, fontWeight: '600' },
      outline: { color: colors.accent.primary, fontWeight: '600' },
      ghost: { color: colors.accent.primary, fontWeight: '500' },
    };

    return {
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...textStyle,
    };
  };

  const renderButton = () => {
    const content = (
      <>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' ? colors.text.primary : colors.accent.primary} 
          />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={getTextStyle()}>{title}</Text>
          </>
        )}
      </>
    );

    if (variant === 'primary') {
      return (
        <LinearGradient
          colors={colors.gradient.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={getButtonStyle()}
        >
          {content}
        </LinearGradient>
      );
    }

    return <View style={getButtonStyle()}>{content}</View>;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
      activeOpacity={0.8}
    >
      {renderButton()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 8,
  },
});