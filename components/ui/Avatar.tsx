import React from 'react';
import { StyleSheet, View, Text, ViewStyle, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';

type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  verified?: boolean;
  onPress?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'medium',
  style,
  verified = false,
  onPress,
}) => {
  const getSize = (): number => {
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 48;
      case 'large':
        return 64;
      case 'xlarge':
        return 96;
      default:
        return 48;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return 12;
      case 'medium':
        return 16;
      case 'large':
        return 24;
      case 'xlarge':
        return 32;
      default:
        return 16;
    }
  };

  const getInitials = (): string => {
    if (!name) return '';
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (
      nameParts[0].charAt(0).toUpperCase() + 
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const avatarSize = getSize();
  const fontSize = getFontSize();
  
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container style={[style, { position: 'relative' }]} onPress={onPress}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[
            styles.avatar,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
          contentFit="cover"
          transition={300}
        />
      ) : (
        <View
          style={[
            styles.placeholderAvatar,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
        >
          <Text
            style={[
              styles.initialsText,
              {
                fontSize,
              },
            ]}
          >
            {getInitials()}
          </Text>
        </View>
      )}
      
      {verified && (
        <View
          style={[
            styles.verifiedBadge,
            {
              width: avatarSize / 3,
              height: avatarSize / 3,
              borderRadius: avatarSize / 6,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.background.tertiary,
  },
  placeholderAvatar: {
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: colors.status.success,
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
});