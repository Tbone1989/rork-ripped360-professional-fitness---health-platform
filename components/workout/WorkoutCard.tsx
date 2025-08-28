import React, { memo } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Clock, Dumbbell, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/colors';
import { Badge } from '@/components/ui/Badge';
import { Workout, WorkoutPlan } from '@/types/workout';

interface WorkoutCardProps {
  item: Workout | WorkoutPlan;
  type: 'workout' | 'plan';
  onPress?: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = memo(({ 
  item,
  type,
  onPress,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      if (type === 'workout') {
        router.push(`/workout/${item.id}`);
      } else {
        router.push(`/plan/${item.id}`);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return colors.status.success;
      case 'intermediate':
        return colors.status.warning;
      case 'advanced':
        return colors.status.error;
      default:
        return colors.status.info;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
      testID={`workout-card-${item.id}`}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={Platform.OS === 'web' ? 0 : 150}
        cachePolicy="disk"
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Badge
            label={item.category}
            size="small"
            variant="default"
            style={styles.categoryBadge}
          />
          <Badge
            label={item.difficulty}
            size="small"
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(item.difficulty) },
            ]}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Clock size={14} color={colors.text.secondary} />
              <Text style={styles.metaText}>
                {type === 'workout'
                  ? `${(item as Workout).duration} min`
                  : (item as WorkoutPlan).duration}
              </Text>
            </View>
            {type === 'workout' && (
              <View style={styles.metaItem}>
                <Dumbbell size={14} color={colors.text.secondary} />
                <Text style={styles.metaText}>
                  {(item as Workout).exercises.length} exercises
                </Text>
              </View>
            )}
            <ChevronRight size={16} color={colors.text.secondary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 12,
  },
  metaText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  difficultyBadge: {
    backgroundColor: colors.status.warning,
  },
});