import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Clock, Dumbbell, Play, Heart, Share, ChevronRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { popularExercises, featuredWorkoutPlans, individualWorkouts } from '@/mocks/workouts';
import { Exercise, WorkoutPlan } from '@/types/workout';

// Extended workout data with exercises
const getWorkoutById = (id: string) => {
  // First check individual workouts
  const individualWorkout = individualWorkouts.find(workout => workout.id === id);
  if (individualWorkout) {
    return individualWorkout;
  }
  
  // Then check workout plans and convert them to workout format
  const baseWorkout = featuredWorkoutPlans.find(plan => plan.id === id);
  if (!baseWorkout) return null;
  
  // Create extended workout data based on the plan
  const workoutData = {
    ...baseWorkout,
    duration: baseWorkout.id === '1' ? 45 : baseWorkout.id === '2' ? 60 : 35,
    exercises: popularExercises.slice(0, baseWorkout.id === '1' ? 4 : baseWorkout.id === '2' ? 6 : 3),
    equipment: baseWorkout.id === '1' ? ['Barbell', 'Dumbbells', 'Bench'] : 
               baseWorkout.id === '2' ? ['Barbell', 'Dumbbells', 'Pull-up Bar', 'Kettlebell'] :
               ['Bodyweight'],
    targetMuscles: baseWorkout.id === '1' ? ['Chest', 'Back', 'Shoulders', 'Arms'] :
                   baseWorkout.id === '2' ? ['Full Body', 'Core', 'Cardio'] :
                   ['Full Body', 'Core'],
    calories: baseWorkout.id === '1' ? 320 : baseWorkout.id === '2' ? 450 : 280,
    rating: 4.8,
    completions: baseWorkout.id === '1' ? 1247 : baseWorkout.id === '2' ? 892 : 1534,
  };
  
  return workoutData;
};

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Get workout data based on the ID
  const workout = getWorkoutById(id as string);
  
  if (!workout) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Workout Not Found</Text>
          <Text style={styles.errorDescription}>
            The workout you're looking for doesn't exist or has been removed.
          </Text>
          <Button
            title="Back to Workouts"
            onPress={() => router.back()}
            style={styles.errorButton}
          />
        </View>
      </View>
    );
  }

  const handleStartWorkout = () => {
    // Navigate to workout session
    router.push(`/workout/${id}/session`);
  };

  const handleShare = () => {
    Alert.alert('Share', 'This would open the share dialog.');
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
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
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: workout.imageUrl }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <Badge
                label={workout.category}
                size="small"
                variant="default"
                style={styles.categoryBadge}
              />
              <View style={styles.heroActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleFavorite}
                >
                  <Heart
                    size={20}
                    color={isFavorited ? colors.status.error : colors.text.primary}
                    fill={isFavorited ? colors.status.error : 'transparent'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleShare}
                >
                  <Share size={20} color={colors.text.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.heroFooter}>
              <Text style={styles.heroTitle}>{workout.name}</Text>
              <Text style={styles.heroDescription}>{workout.description}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Clock size={20} color={colors.accent.primary} />
            <Text style={styles.statValue}>{workout.duration}</Text>
            <Text style={styles.statLabel}>minutes</Text>
          </View>
          <View style={styles.statItem}>
            <Dumbbell size={20} color={colors.accent.primary} />
            <Text style={styles.statValue}>{workout.exercises.length}</Text>
            <Text style={styles.statLabel}>exercises</Text>
          </View>
          <View style={styles.statItem}>
            <Badge
              label={workout.difficulty}
              size="small"
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(workout.difficulty) },
              ]}
            />
            <Text style={styles.statLabel}>difficulty</Text>
          </View>
        </View>

        {/* Equipment */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Equipment Needed</Text>
          <View style={styles.equipmentContainer}>
            {workout.equipment.map((item, index) => (
              <Badge
                key={index}
                label={item}
                variant="secondary"
                style={styles.equipmentBadge}
              />
            ))}
          </View>
        </Card>

        {/* Target Muscles */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Target Muscles</Text>
          <View style={styles.muscleContainer}>
            {workout.targetMuscles.map((muscle, index) => (
              <Badge
                key={index}
                label={muscle}
                variant="outline"
                style={styles.muscleBadge}
              />
            ))}
          </View>
        </Card>

        {/* Exercises */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises ({workout.exercises.length})</Text>
          {workout.exercises.map((exercise, index) => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseItem}
              onPress={() => router.push(`/exercise/${exercise.id}`)}
            >
              <Image
                source={{ uri: exercise.thumbnailUrl }}
                style={styles.exerciseImage}
                contentFit="cover"
              />
              <View style={styles.exerciseContent}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDescription} numberOfLines={2}>
                  {exercise.description}
                </Text>
                <View style={styles.exerciseMeta}>
                  <Badge
                    label={exercise.difficulty}
                    size="small"
                    style={[
                      styles.exerciseDifficulty,
                      { backgroundColor: getDifficultyColor(exercise.difficulty) },
                    ]}
                  />
                  <Text style={styles.exerciseMuscles}>
                    {exercise.muscleGroups.slice(0, 2).join(', ')}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Coach Info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Created by</Text>
          <View style={styles.coachInfo}>
            <View style={styles.coachAvatar}>
              <Text style={styles.coachInitial}>{workout.createdBy.charAt(0)}</Text>
            </View>
            <View style={styles.coachDetails}>
              <Text style={styles.coachName}>{workout.createdBy}</Text>
              <Text style={styles.coachStats}>
                ⭐ {workout.rating} • {workout.completions.toLocaleString()} completions
              </Text>
            </View>
          </View>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Start Workout Button */}
      <View style={styles.bottomContainer}>
        <Button
          title="Start Workout"
          onPress={handleStartWorkout}
          style={styles.startButton}
          leftIcon={<Play size={20} color={colors.text.primary} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
  },
  heroContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'space-between',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroFooter: {
    gap: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  heroDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: colors.background.secondary,
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  difficultyBadge: {
    marginBottom: 4,
  },
  section: {
    margin: 16,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  equipmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentBadge: {
    marginBottom: 0,
  },
  muscleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleBadge: {
    marginBottom: 0,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  exerciseContent: {
    flex: 1,
    gap: 4,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  exerciseDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exerciseDifficulty: {
    marginBottom: 0,
  },
  exerciseMuscles: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  coachInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  coachAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coachInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  coachDetails: {
    flex: 1,
  },
  coachName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  coachStats: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  bottomPadding: {
    height: 100,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  startButton: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  errorButton: {
    paddingHorizontal: 24,
  },
});