import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/colors';
import { Exercise } from '@/types/workout';
import { Badge } from '@/components/ui/Badge';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onPress,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/exercise/${exercise.id}`);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: exercise.thumbnailUrl }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.content}>
        <View>
          <Text style={styles.name} numberOfLines={1}>
            {exercise.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {exercise.description}
          </Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.tagsContainer}>
            {exercise.muscleGroups.slice(0, 2).map((muscle, index) => (
              <Badge
                key={index}
                label={muscle}
                size="small"
                variant="default"
                style={styles.tag}
              />
            ))}
            {exercise.muscleGroups.length > 2 && (
              <Badge
                label={`+${exercise.muscleGroups.length - 2}`}
                size="small"
                variant="default"
                style={styles.tag}
              />
            )}
          </View>
          <ChevronRight size={16} color={colors.text.secondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    height: 100,
  },
  image: {
    width: 100,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  tag: {
    backgroundColor: colors.background.tertiary,
  },
});