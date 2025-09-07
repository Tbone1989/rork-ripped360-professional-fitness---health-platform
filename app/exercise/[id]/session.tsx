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
  RotateCcw,
  ChevronRight,
  Check,
  X,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { popularExercises } from '@/mocks/workouts';

export default function ExerciseSessionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const exercise = popularExercises.find(ex => ex.id === id) || popularExercises[0];
  const totalSets = 3;
  const restDuration = 60; // seconds

  useEffect(() => {
    // Pulse animation for active timer
    if (isPlaying || isResting) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying, isResting, pulseAnim]);

  useEffect(() => {
    if (isPlaying && !isResting) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000) as NodeJS.Timeout;
    } else if (isResting) {
      intervalRef.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            setRestTimer(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000) as NodeJS.Timeout;
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
  }, [isPlaying, isResting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isResting) return;
    setIsPlaying(!isPlaying);
  };

  const handleCompleteSet = () => {
    if (!completedSets.includes(currentSet)) {
      setCompletedSets([...completedSets, currentSet]);
    }
    
    if (currentSet < totalSets) {
      setIsResting(true);
      setRestTimer(restDuration);
      setCurrentSet(currentSet + 1);
      setIsPlaying(false);
    } else {
      // All sets completed
      Alert.alert(
        'Exercise Complete! 💪',
        `Great job! You've completed all ${totalSets} sets of ${exercise.name}.`,
        [
          {
            text: 'Finish',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestTimer(0);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Exercise',
      'Are you sure you want to reset this exercise session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setIsPlaying(false);
            setCurrentSet(1);
            setCompletedSets([]);
            setTimer(0);
            setRestTimer(0);
            setIsResting(false);
          },
        },
      ]
    );
  };

  const handleEndSession = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this exercise session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Exercise Header */}
        <Card style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDescription}>{exercise.description}</Text>
            </View>
            <TouchableOpacity onPress={handleEndSession} style={styles.closeButton}>
              <X size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Video/Image Section */}
        <View style={styles.mediaContainer}>
          <Image
            source={{ uri: exercise.thumbnailUrl }}
            style={styles.exerciseImage}
            contentFit="cover"
          />
          <View style={styles.mediaOverlay}>
            <Text style={styles.mediaText}>Video guidance coming soon</Text>
          </View>
        </View>

        {/* Timer Section */}
        <Card style={styles.timerSection}>
          {isResting ? (
            <>
              <Text style={styles.restTitle}>Rest Time</Text>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Text style={styles.timerText}>{formatTime(restTimer)}</Text>
              </Animated.View>
              <Button
                title="Skip Rest"
                onPress={handleSkipRest}
                variant="secondary"
                style={styles.skipButton}
              />
            </>
          ) : (
            <>
              <Text style={styles.timerTitle}>Exercise Time</Text>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Text style={styles.timerText}>{formatTime(timer)}</Text>
              </Animated.View>
              <View style={styles.timerControls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause size={32} color={colors.accent.primary} />
                  ) : (
                    <Play size={32} color={colors.accent.primary} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleReset}
                >
                  <RotateCcw size={28} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </Card>

        {/* Sets Progress */}
        <Card style={styles.setsSection}>
          <Text style={styles.setsTitle}>
            Set {currentSet} of {totalSets}
          </Text>
          <View style={styles.setsProgress}>
            {Array.from({ length: totalSets }, (_, i) => i + 1).map(set => (
              <View
                key={set}
                style={[
                  styles.setIndicator,
                  completedSets.includes(set) && styles.setCompleted,
                  set === currentSet && !completedSets.includes(set) && styles.setCurrent,
                ]}
              >
                {completedSets.includes(set) ? (
                  <Check size={16} color={colors.text.primary} />
                ) : (
                  <Text style={styles.setNumber}>{set}</Text>
                )}
              </View>
            ))}
          </View>
          {!isResting && (
            <Button
              title={currentSet === totalSets ? "Complete Exercise" : "Complete Set"}
              onPress={handleCompleteSet}
              style={styles.completeButton}
              leftIcon={<Check size={20} color={colors.text.primary} />}
            />
          )}
        </Card>

        {/* Quick Instructions */}
        <Card style={styles.instructionsSection}>
          <Text style={styles.instructionsSectionTitle}>Quick Tips</Text>
          {exercise.tips.slice(0, 3).map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
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
  content: {
    flex: 1,
  },
  header: {
    margin: 16,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
  },
  mediaContainer: {
    height: 250,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  mediaOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaText: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
  },
  timerSection: {
    margin: 16,
    marginBottom: 8,
    alignItems: 'center',
    paddingVertical: 24,
  },
  timerTitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  restTitle: {
    fontSize: 18,
    color: colors.status.warning,
    fontWeight: '600',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.accent.primary,
    marginBottom: 16,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 24,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    paddingHorizontal: 24,
  },
  setsSection: {
    margin: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  setsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  setsProgress: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  setIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  setCompleted: {
    backgroundColor: colors.status.success,
    borderColor: colors.status.success,
  },
  setCurrent: {
    borderColor: colors.accent.primary,
    borderWidth: 3,
  },
  setNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  completeButton: {
    width: '100%',
  },
  instructionsSection: {
    margin: 16,
    marginBottom: 8,
  },
  instructionsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent.primary,
    marginTop: 6,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 20,
  },
});