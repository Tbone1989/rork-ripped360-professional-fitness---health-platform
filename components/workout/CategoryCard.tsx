import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/colors';
import { WorkoutCategory } from '@/types/workout';

interface CategoryCardProps {
  category: WorkoutCategory;
  onPress?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/category/${category.id}`);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: category.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.name}>{category.name}</Text>
        <Text style={styles.count}>{category.workoutCount} workouts</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    width: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'flex-end',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  count: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});