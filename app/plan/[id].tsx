import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Calendar, Clock, Users, Star, Play, Heart, Share, ChevronRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { featuredWorkoutPlans } from '@/mocks/workouts';

// Extended plan data with detailed information
const getPlanById = (id: string) => {
  const basePlan = featuredWorkoutPlans.find(plan => plan.id === id);
  if (!basePlan) return null;
  
  // Create extended plan data based on the base plan
  const planData = {
    ...basePlan,
    rating: basePlan.id === '1' ? 4.9 : basePlan.id === '2' ? 4.7 : 4.6,
    enrollments: basePlan.id === '1' ? 2847 : basePlan.id === '2' ? 1923 : 3156,
    workoutsPerWeek: basePlan.id === '1' ? 4 : basePlan.id === '2' ? 5 : 3,
    avgWorkoutDuration: basePlan.id === '1' ? 60 : basePlan.id === '2' ? 75 : 45,
    equipment: basePlan.id === '1' ? ['Barbell', 'Dumbbells', 'Bench', 'Squat Rack'] :
               basePlan.id === '2' ? ['Barbell', 'Dumbbells', 'Pull-up Bar', 'Kettlebell', 'Box'] :
               ['Bodyweight', 'Resistance Bands'],
    targetGoals: basePlan.id === '1' ? ['Strength', 'Muscle Building', 'Progressive Overload'] :
                 basePlan.id === '2' ? ['Conditioning', 'Power', 'Athletic Performance'] :
                 ['Weight Loss', 'Toning', 'Flexibility'],
    weeks: basePlan.id === '1' ? [
      {
        week: 1,
        title: 'Foundation Week',
        description: 'Learn proper form and establish baseline strength',
        workouts: [
          { id: '1', name: 'Upper Body Push', duration: 60, exercises: 6 },
          { id: '2', name: 'Lower Body Power', duration: 55, exercises: 5 },
          { id: '3', name: 'Upper Body Pull', duration: 65, exercises: 7 },
          { id: '4', name: 'Full Body Conditioning', duration: 45, exercises: 8 },
        ],
      },
      {
        week: 2,
        title: 'Progression Week',
        description: 'Increase intensity and volume',
        workouts: [
          { id: '1', name: 'Heavy Upper Push', duration: 65, exercises: 6 },
          { id: '2', name: 'Squat Focus', duration: 60, exercises: 5 },
          { id: '3', name: 'Back & Biceps', duration: 70, exercises: 7 },
          { id: '1', name: 'Metabolic Finisher', duration: 40, exercises: 6 },
        ],
      },
    ] : basePlan.id === '2' ? [
      {
        week: 1,
        title: 'Base Building',
        description: 'Build aerobic capacity and movement quality',
        workouts: [
          { id: '2', name: 'CrossFit Fundamentals', duration: 75, exercises: 8 },
          { id: '2', name: 'Olympic Lifting Basics', duration: 80, exercises: 6 },
          { id: '2', name: 'MetCon Madness', duration: 60, exercises: 10 },
          { id: '2', name: 'Gymnastics Skills', duration: 70, exercises: 7 },
          { id: '2', name: 'Heavy Lifting Day', duration: 85, exercises: 5 },
        ],
      },
    ] : [
      {
        week: 1,
        title: 'Getting Started',
        description: 'Build basic fitness and learn movements',
        workouts: [
          { id: '3', name: 'Full Body Basics', duration: 35, exercises: 6 },
          { id: '3', name: 'Core & Cardio', duration: 40, exercises: 8 },
          { id: '3', name: 'Strength Foundation', duration: 45, exercises: 5 },
        ],
      },
    ],
  };
  
  return planData;
};

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  // Get plan data based on the ID
  const plan = getPlanById(id as string);
  
  if (!plan) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Plan Not Found</Text>
          <Text style={styles.errorDescription}>
            The workout plan you're looking for doesn't exist or has been removed.
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

  const handleEnroll = () => {
    if (isEnrolled) {
      Alert.alert(
        'Continue Plan',
        'You are already enrolled in this plan. Continue where you left off?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => console.log('Continuing plan...') },
        ]
      );
    } else {
      Alert.alert(
        'Enroll in Plan',
        `Are you ready to start the ${plan.name} program?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Enroll', 
            onPress: () => {
              setIsEnrolled(true);
              console.log('Enrolled in plan...');
            }
          },
        ]
      );
    }
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
            source={{ uri: plan.imageUrl }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <Badge
                label={plan.category}
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
              <Text style={styles.heroTitle}>{plan.name}</Text>
              <Text style={styles.heroDescription} numberOfLines={3}>
                {plan.description}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Calendar size={20} color={colors.accent.primary} />
            <Text style={styles.statValue}>{plan.duration}</Text>
            <Text style={styles.statLabel}>duration</Text>
          </View>
          <View style={styles.statItem}>
            <Clock size={20} color={colors.accent.primary} />
            <Text style={styles.statValue}>{plan.avgWorkoutDuration}</Text>
            <Text style={styles.statLabel}>min/workout</Text>
          </View>
          <View style={styles.statItem}>
            <Badge
              label={plan.difficulty}
              size="small"
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(plan.difficulty) },
              ]}
            />
            <Text style={styles.statLabel}>difficulty</Text>
          </View>
        </View>

        {/* Overview */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Program Overview</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{plan.workoutsPerWeek}</Text>
              <Text style={styles.overviewLabel}>workouts/week</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{plan.weeks.length}</Text>
              <Text style={styles.overviewLabel}>total weeks</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{plan.rating}</Text>
              <Text style={styles.overviewLabel}>rating</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{(plan.enrollments / 1000).toFixed(1)}k</Text>
              <Text style={styles.overviewLabel}>enrolled</Text>
            </View>
          </View>
        </Card>

        {/* Equipment */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Equipment Needed</Text>
          <View style={styles.equipmentContainer}>
            {plan.equipment.map((item, index) => (
              <Badge
                key={index}
                label={item}
                variant="secondary"
                style={styles.equipmentBadge}
              />
            ))}
          </View>
        </Card>

        {/* Goals */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Target Goals</Text>
          <View style={styles.goalsContainer}>
            {plan.targetGoals.map((goal, index) => (
              <Badge
                key={index}
                label={goal}
                variant="outline"
                style={styles.goalBadge}
              />
            ))}
          </View>
        </Card>

        {/* Weekly Breakdown */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Breakdown</Text>
          {plan.weeks.map((week) => (
            <View key={week.week} style={styles.weekContainer}>
              <View style={styles.weekHeader}>
                <Text style={styles.weekTitle}>Week {week.week}: {week.title}</Text>
                <Text style={styles.weekDescription}>{week.description}</Text>
              </View>
              {week.workouts.map((workout, index) => (
                <TouchableOpacity
                  key={workout.id}
                  style={styles.workoutItem}
                  onPress={() => router.push(`/workout/${workout.id}`)}
                >
                  <View style={styles.workoutNumber}>
                    <Text style={styles.workoutNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.workoutContent}>
                    <Text style={styles.workoutName}>{workout.name}</Text>
                    <View style={styles.workoutMeta}>
                      <Text style={styles.workoutMetaText}>
                        {workout.duration} min • {workout.exercises} exercises
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </Card>

        {/* Coach Info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Created by</Text>
          <View style={styles.coachInfo}>
            <View style={styles.coachAvatar}>
              <Text style={styles.coachInitial}>{plan.createdBy.charAt(0)}</Text>
            </View>
            <View style={styles.coachDetails}>
              <Text style={styles.coachName}>{plan.createdBy}</Text>
              <View style={styles.coachStats}>
                <Star size={14} color={colors.status.warning} fill={colors.status.warning} />
                <Text style={styles.coachRating}>{plan.rating}</Text>
                <Users size={14} color={colors.text.secondary} />
                <Text style={styles.coachEnrollments}>
                  {plan.enrollments.toLocaleString()} enrolled
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Enroll Button */}
      <View style={styles.bottomContainer}>
        <Button
          title={isEnrolled ? 'Continue Plan' : 'Enroll in Plan'}
          onPress={handleEnroll}
          style={styles.enrollButton}
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
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewItem: {
    width: '48%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    marginBottom: 8,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  overviewLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  equipmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentBadge: {
    marginBottom: 0,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalBadge: {
    marginBottom: 0,
  },
  weekContainer: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  weekHeader: {
    marginBottom: 12,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  weekDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    marginBottom: 8,
  },
  workoutNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  workoutContent: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutMetaText: {
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
    marginBottom: 4,
  },
  coachStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coachRating: {
    fontSize: 14,
    color: colors.text.secondary,
    marginRight: 8,
  },
  coachEnrollments: {
    fontSize: 14,
    color: colors.text.secondary,
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
  enrollButton: {
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