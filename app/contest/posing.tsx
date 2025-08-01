import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Animated
} from 'react-native';
import { Stack, router } from 'expo-router';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Plus,
  Timer,
  Target,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/colors';
import { useContestStore } from '@/store/contestStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PosingTimer, PosingSession, POSING_CATEGORIES } from '@/types/contest';

const { width } = Dimensions.get('window');

export default function PosingScreen() {
  const { currentPrep, posingTimers, addPosingSession } = useContestStore();
  const [selectedTimer, setSelectedTimer] = useState<PosingTimer | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  useEffect(() => {
    if (selectedTimer && timeRemaining > 0) {
      const currentPose = selectedTimer.poses[currentPoseIndex];
      const totalTime = isResting ? currentPose.rest : currentPose.duration;
      const progress = 1 - (timeRemaining / totalTime);
      
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }, [timeRemaining, selectedTimer, currentPoseIndex, isResting]);

  const handleTimerComplete = () => {
    if (!selectedTimer) return;

    const currentPose = selectedTimer.poses[currentPoseIndex];
    
    if (isResting) {
      // Rest period complete, move to next pose or round
      if (currentPoseIndex < selectedTimer.poses.length - 1) {
        setCurrentPoseIndex(prev => prev + 1);
        setTimeRemaining(selectedTimer.poses[currentPoseIndex + 1].duration);
        setIsResting(false);
      } else if (currentRound < selectedTimer.rounds) {
        // Start next round
        setCurrentRound(prev => prev + 1);
        setCurrentPoseIndex(0);
        setTimeRemaining(selectedTimer.poses[0].duration);
        setIsResting(false);
      } else {
        // Session complete
        handleSessionComplete();
      }
    } else {
      // Pose complete, start rest period
      if (currentPose.rest > 0) {
        setTimeRemaining(currentPose.rest);
        setIsResting(true);
      } else {
        // No rest, move to next pose immediately
        handleTimerComplete();
      }
    }
  };

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    if (sessionStartTime && currentPrep) {
      const duration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000 / 60);
      
      const session: Omit<PosingSession, 'id'> = {
        contestPrepId: currentPrep.id,
        date: new Date().toISOString(),
        duration,
        poses: selectedTimer?.poses.map(pose => ({
          name: pose.name,
          category: 'mandatory',
          duration: pose.duration,
          repetitions: selectedTimer.rounds,
          rating: 4
        })) || [],
        selfRating: 4,
        notes: `Completed ${selectedTimer?.name} - ${selectedTimer?.rounds} rounds`,
        completed: true
      };
      
      addPosingSession(session);
      
      Alert.alert(
        'Session Complete!',
        `Great job! You completed ${selectedTimer?.name} in ${duration} minutes.`,
        [{ text: 'OK', onPress: resetTimer }]
      );
    }
  };

  const startTimer = () => {
    if (!selectedTimer) return;
    
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
    
    if (timeRemaining === 0) {
      setTimeRemaining(selectedTimer.poses[0].duration);
      setCurrentPoseIndex(0);
      setCurrentRound(1);
      setIsResting(false);
    }
    
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(0);
    setCurrentPoseIndex(0);
    setCurrentRound(1);
    setIsResting(false);
    setSessionStartTime(null);
    progressAnim.setValue(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderTimerCard = (timer: PosingTimer) => (
    <TouchableOpacity
      key={timer.id}
      style={[
        styles.timerCard,
        selectedTimer?.id === timer.id && styles.timerCardActive
      ]}
      onPress={() => {
        setSelectedTimer(timer);
        resetTimer();
      }}
    >
      <Text style={styles.timerName}>{timer.name}</Text>
      <Text style={styles.timerDetails}>
        {timer.poses.length} poses • {timer.rounds} rounds
      </Text>
      <Text style={styles.timerDuration}>
        ~{Math.ceil(timer.totalDuration / 60)} minutes
      </Text>
    </TouchableOpacity>
  );

  const renderActiveTimer = () => {
    if (!selectedTimer) return null;

    const currentPose = selectedTimer.poses[currentPoseIndex];
    const totalTime = isResting ? currentPose.rest : currentPose.duration;
    const progress = timeRemaining > 0 ? (1 - (timeRemaining / totalTime)) * 100 : 0;

    return (
      <Card style={styles.activeTimerCard}>
        <LinearGradient
          colors={['#1a1a2e', '#16213e']}
          style={styles.timerGradient}
        >
          <View style={styles.timerHeader}>
            <Text style={styles.activeTimerName}>{selectedTimer.name}</Text>
            <Badge 
              text={`Round ${currentRound}/${selectedTimer.rounds}`}
              variant="secondary"
            />
          </View>

          <View style={styles.currentPoseContainer}>
            <Text style={styles.currentPoseLabel}>
              {isResting ? 'Rest' : 'Current Pose'}
            </Text>
            <Text style={styles.currentPoseName}>
              {isResting ? 'Rest Period' : currentPose.name}
            </Text>
          </View>

          <View style={styles.timerDisplay}>
            <Text style={styles.timeRemaining}>
              {formatTime(timeRemaining)}
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                      backgroundColor: isResting ? colors.warning : colors.accent.primary,
                    }
                  ]}
                />
              </View>
            </View>
          </View>

          <View style={styles.timerControls}>
            {!isRunning ? (
              <TouchableOpacity style={styles.controlButton} onPress={startTimer}>
                <Play size={24} color={colors.text.primary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.controlButton} onPress={pauseTimer}>
                <Pause size={24} color={colors.text.primary} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.controlButton} onPress={resetTimer}>
              <RotateCcw size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.posesList}>
            <Text style={styles.posesListTitle}>Poses in this routine:</Text>
            {selectedTimer.poses.map((pose, index) => (
              <View
                key={index}
                style={[
                  styles.poseItem,
                  index === currentPoseIndex && !isResting && styles.poseItemActive
                ]}
              >
                <Text style={styles.poseName}>{pose.name}</Text>
                <Text style={styles.poseDuration}>
                  {pose.duration}s {pose.rest > 0 && `+ ${pose.rest}s rest`}
                </Text>
                {index < currentPoseIndex && (
                  <CheckCircle size={16} color={colors.success} />
                )}
              </View>
            ))}
          </View>
        </LinearGradient>
      </Card>
    );
  };

  const renderRecentSessions = () => {
    if (!currentPrep) return null;

    const recentSessions = currentPrep.posingPractice
      .slice(-3)
      .reverse();

    if (recentSessions.length === 0) return null;

    return (
      <Card style={styles.recentSessionsCard}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        {recentSessions.map((session) => (
          <View key={session.id} style={styles.sessionItem}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionDate}>
                {new Date(session.date).toLocaleDateString()}
              </Text>
              <Text style={styles.sessionDuration}>
                {session.duration} minutes
              </Text>
            </View>
            <View style={styles.sessionRating}>
              <Text style={styles.ratingText}>{session.selfRating}/5</Text>
            </View>
          </View>
        ))}
      </Card>
    );
  };

  if (!currentPrep) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Posing Practice' }} />
        <View style={styles.emptyState}>
          <Timer size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Contest Prep Selected</Text>
          <Text style={styles.emptyDescription}>
            Please select a contest prep to access posing practice timers.
          </Text>
        </View>
      </View>
    );
  }

  const categoryPoses = POSING_CATEGORIES[currentPrep.category] || [];

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Posing Practice',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/contest/create-timer')}>
              <Plus size={24} color={colors.accent.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.contestName}>{currentPrep.contestName}</Text>
          <Text style={styles.categoryName}>
            {currentPrep.category.replace('-', ' ')} Category
          </Text>
        </View>

        {renderActiveTimer()}

        <View style={styles.timersSection}>
          <Text style={styles.sectionTitle}>Practice Timers</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {posingTimers.map(renderTimerCard)}
          </ScrollView>
        </View>

        <Card style={styles.mandatoryPosesCard}>
          <Text style={styles.sectionTitle}>Mandatory Poses</Text>
          <Text style={styles.categoryDescription}>
            Required poses for {currentPrep.category.replace('-', ' ')} category:
          </Text>
          {categoryPoses.map((pose, index) => (
            <View key={index} style={styles.mandatoryPoseItem}>
              <Target size={16} color={colors.accent.primary} />
              <Text style={styles.mandatoryPoseName}>{pose}</Text>
            </View>
          ))}
        </Card>

        {renderRecentSessions()}

        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Posing Tips</Text>
          <Text style={styles.tipText}>
            • Practice in front of a mirror to check form
          </Text>
          <Text style={styles.tipText}>
            • Focus on breathing and holding poses steady
          </Text>
          <Text style={styles.tipText}>
            • Record yourself to review transitions
          </Text>
          <Text style={styles.tipText}>
            • Practice with stage lighting if possible
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  contestName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  activeTimerCard: {
    margin: 20,
    marginTop: 10,
    overflow: 'hidden',
  },
  timerGradient: {
    padding: 20,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  activeTimerName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    flex: 1,
  },
  currentPoseContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentPoseLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  currentPoseName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timeRemaining: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.accent.primary,
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posesList: {
    marginTop: 10,
  },
  posesListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  poseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  poseItemActive: {
    backgroundColor: colors.accent.primary + '20',
  },
  poseName: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  poseDuration: {
    fontSize: 12,
    color: colors.text.secondary,
    marginRight: 8,
  },
  timersSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  timerCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 160,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  timerCardActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.primary + '10',
  },
  timerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  timerDetails: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  timerDuration: {
    fontSize: 12,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  mandatoryPosesCard: {
    margin: 20,
    marginTop: 0,
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  mandatoryPoseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mandatoryPoseName: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 12,
  },
  recentSessionsCard: {
    margin: 20,
    marginTop: 0,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDate: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  sessionDuration: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  sessionRating: {
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  tipsCard: {
    margin: 20,
    marginTop: 0,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 6,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});