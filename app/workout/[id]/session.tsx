import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  Play,
  Pause,
  SkipForward,
  ChevronRight,
  Check,
  X,
  Clock,
  Dumbbell,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { popularExercises, featuredWorkoutPlans, individualWorkouts } from '@/mocks/workouts';

// Get workout data
const getWorkoutById = (id: string) => {
  const individualWorkout = individualWorkouts.find(workout => workout.id === id);
  if (individualWorkout) {
    return individualWorkout;
  }
  
  const baseWorkout = featuredWorkoutPlans.find(plan => plan.id === id);
  if (!baseWorkout) return null;
  
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

export default function WorkoutSessionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const workout = getWorkoutById(id as string);
  
  if (!workout) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Workout Not Found</Text>
          <Button
            title="Back to Workouts"
            onPress={() => router.back()}
          />
        </View>
      </View>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const progress = (completedExercises.length / workout.exercises.length) * 100;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
        setExerciseTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCompleteExercise = () => {
    if (!completedExercises.includes(currentExerciseIndex)) {
      setCompletedExercises([...completedExercises, currentExerciseIndex]);
    }
    
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setExerciseTimer(0);
    } else {
      // Workout complete
      Alert.alert(
        'Workout Complete! 🎉',
        `Amazing job! You've completed ${workout.name} in ${formatTime(workoutTimer)}.`,
        [
          {
            text: 'Finish',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  const handleSkipExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setExerciseTimer(0);
    }
  };

  const handleExercisePress = (index: number) => {
    setCurrentExerciseIndex(index);
    setExerciseTimer(0);
  };

  const handleEndWorkout = () => {
    Alert.alert(
      'End Workout',
      'Are you sure you want to end this workout session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Workout',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleViewExerciseDetails = () => {
    router.push(`/exercise/${currentExercise.id}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerInfo}>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <Text style={styles.workoutProgress}>
              Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
            </Text>
          </View>
          <TouchableOpacity onPress={handleEndWorkout} style={styles.closeButton}>
            <X size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Exercise */}
        <Card style={styles.currentExerciseCard}>
          <Image
            source={{ uri: currentExercise.thumbnailUrl }}
            style={styles.exerciseImage}
            contentFit="cover"
          />
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <Text style={styles.exerciseDescription} numberOfLines={2}>
              {currentExercise.description}
            </Text>
            <View style={styles.exerciseMeta}>
              <Badge
                label={currentExercise.difficulty}
                size="small"
                variant="secondary"
              />
              <Text style={styles.muscleGroups}>
                {currentExercise.muscleGroups.slice(0, 2).join(', ')}
              </Text>
            </View>
          </View>
        </Card>

        {/* Timer Section */}
        <View style={styles.timerSection}>
          <View style={styles.timerCard}>
            <Clock size={20} color={colors.accent.primary} />
            <Text style={styles.timerLabel}>Exercise Time</Text>
            <Text style={styles.timerValue}>{formatTime(exerciseTimer)}</Text>
          </View>
          <View style={styles.timerCard}>
            <Dumbbell size={20} color={colors.accent.primary} />
            <Text style={styles.timerLabel}>Total Time</Text>
            <Text style={styles.timerValue}>{formatTime(workoutTimer)}</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleSkipExercise}
            disabled={currentExerciseIndex >= workout.exercises.length - 1}
          >
            <SkipForward size={24} color={colors.text.secondary} />
            <Text style={styles.controlText}>Skip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlayPause}
          >
            {isPlaying ? (
              <Pause size={32} color={colors.text.primary} />
            ) : (
              <Play size={32} color={colors.text.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleCompleteExercise}
          >
            <Check size={24} color={colors.status.success} />
            <Text style={[styles.controlText, { color: colors.status.success }]}>
              Complete
            </Text>
          </TouchableOpacity>
        </View>

        {/* View Details Button */}
        <Button
          title="View Exercise Details"
          onPress={handleViewExerciseDetails}
          variant="secondary"
          style={styles.detailsButton}
          rightIcon={<ChevronRight size={20} color={colors.text.primary} />}
        />

        {/* Exercise List */}
        <Card style={styles.exerciseListCard}>
          <Text style={styles.listTitle}>Workout Exercises</Text>
          {workout.exercises.map((exercise, index) => (
            <TouchableOpacity
              key={exercise.id}
              style={[
                styles.exerciseListItem,
                index === currentExerciseIndex && styles.currentExerciseItem,
                completedExercises.includes(index) && styles.completedExerciseItem,
              ]}
              onPress={() => handleExercisePress(index)}
            >
              <View style={styles.exerciseNumber}>
                {completedExercises.includes(index) ? (
                  <Check size={16} color={colors.status.success} />
                ) : (
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                )}
              </View>
              <Text
                style={[
                  styles.exerciseListName,
                  completedExercises.includes(index) && styles.completedText,
                ]}
              >
                {exercise.name}
              </Text>
              {index === currentExerciseIndex && (
                <Badge label="Current" size="small" variant="primary" />
              )}
            </TouchableOpacity>
          ))}
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    backgroundColor: colors.background.secondary,
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  workoutProgress: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  closeButton: {
    padding: 4,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  currentExerciseCard: {
    margin: 16,
    marginBottom: 8,
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  exerciseInfo: {
    gap: 8,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  exerciseDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  muscleGroups: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  timerSection: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  timerCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  timerLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  timerValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  controlButton: {
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  controlText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  exerciseListCard: {
    margin: 16,
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  exerciseListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  currentExerciseItem: {
    backgroundColor: colors.background.tertiary,
  },
  completedExerciseItem: {
    opacity: 0.7,
  },
  exerciseNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  exerciseListName: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary,
  },
  bottomPadding: {
    height: 20,
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
    marginBottom: 24,
    textAlign: 'center',
  },
});