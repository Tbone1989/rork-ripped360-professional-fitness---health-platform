import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Play, Calendar, Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useWorkoutStore } from '@/store/workoutStore';
import { useUserStore } from '@/store/userStore';

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  workoutsPerWeek: number;
  totalWeeks: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  enrolled: number;
  minutesPerWorkout: number;
  equipment: string[];
  imageUrl: string;
}

const mockPlans: Record<string, WorkoutPlan> = {
  'strength-foundations': {
    id: 'strength-foundations',
    title: 'Strength Foundations',
    description: 'Build a solid foundation of strength with this 8-week program focusing on compound movements and progressive overload.',
    duration: '8 weeks',
    workoutsPerWeek: 4,
    totalWeeks: 8,
    difficulty: 'intermediate',
    rating: 4.9,
    enrolled: 2800,
    minutesPerWorkout: 60,
    equipment: ['Barbell', 'Dumbbells', 'Bench', 'Squat Rack'],
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  },
  'hiit-shred': {
    id: 'hiit-shred',
    title: 'HIIT Shred',
    description: 'High-intensity interval training program designed to burn fat and improve cardiovascular fitness.',
    duration: '6 weeks',
    workoutsPerWeek: 5,
    totalWeeks: 6,
    difficulty: 'advanced',
    rating: 4.7,
    enrolled: 3200,
    minutesPerWorkout: 45,
    equipment: ['Kettlebells', 'Jump Rope', 'Medicine Ball'],
    imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800',
  },
  'beginner-basics': {
    id: 'beginner-basics',
    title: 'Beginner Basics',
    description: 'Perfect starting point for fitness newcomers. Learn proper form and build consistency.',
    duration: '4 weeks',
    workoutsPerWeek: 3,
    totalWeeks: 4,
    difficulty: 'beginner',
    rating: 4.8,
    enrolled: 5100,
    minutesPerWorkout: 30,
    equipment: ['Dumbbells', 'Resistance Bands'],
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
  },
};

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [enrolling, setEnrolling] = useState(false);
  const { enrollInPlan, enrolledPlans } = useWorkoutStore();
  const { user } = useUserStore();
  
  const plan = mockPlans[id] || mockPlans['strength-foundations'];
  const isEnrolled = enrolledPlans.includes(plan.id);

  const handleEnroll = async () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please log in to enroll in workout plans.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/(auth)/login') },
        ]
      );
      return;
    }

    // If already enrolled, navigate to workout session
    if (isEnrolled) {
      router.push(`/workout/${plan.id}`);
      return;
    }

    setEnrolling(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to enrolled plans
      enrollInPlan(plan.id);
      
      Alert.alert(
        'Success!',
        `You've successfully enrolled in ${plan.title}. Ready to start your fitness journey?`,
        [
          { text: 'Later', style: 'cancel' },
          { 
            text: 'Start Now', 
            onPress: () => router.push(`/workout/${plan.id}-day-1`)
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to enroll in plan. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return colors.accent.primary;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={{ uri: plan.imageUrl }}
        style={styles.header}
        imageStyle={styles.headerImage}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>{plan.title}</Text>
          <Text style={styles.description}>{plan.description}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Calendar size={20} color="#fff" />
              <Text style={styles.statText}>{plan.duration}</Text>
              <Text style={styles.statLabel}>duration</Text>
            </View>
            <View style={styles.stat}>
              <Clock size={20} color="#fff" />
              <Text style={styles.statText}>{plan.minutesPerWorkout}</Text>
              <Text style={styles.statLabel}>min/workout</Text>
            </View>
            <View style={styles.difficultyBadge}>
              <Text style={[styles.difficultyText, { backgroundColor: getDifficultyColor(plan.difficulty) }]}>
                {plan.difficulty}
              </Text>
              <Text style={styles.statLabel}>difficulty</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Program Overview</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{plan.workoutsPerWeek}</Text>
              <Text style={styles.overviewLabel}>workouts/week</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{plan.totalWeeks}</Text>
              <Text style={styles.overviewLabel}>total weeks</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>{plan.rating}</Text>
              <Text style={styles.overviewLabel}>rating</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewValue}>
                {plan.enrolled >= 1000 ? `${(plan.enrolled / 1000).toFixed(1)}k` : plan.enrolled}
              </Text>
              <Text style={styles.overviewLabel}>enrolled</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipment Needed</Text>
          <View style={styles.equipmentList}>
            {plan.equipment.map((item, index) => (
              <View key={index} style={styles.equipmentItem}>
                <Text style={styles.equipmentText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.enrollButton,
            isEnrolled && styles.enrolledButton,
            enrolling && styles.enrollingButton
          ]}
          onPress={handleEnroll}
          disabled={enrolling}
          activeOpacity={0.8}
        >
          <Play size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.enrollButtonText}>
            {enrolling ? 'Enrolling...' : isEnrolled ? 'Continue Plan' : 'Enroll in Plan'}
          </Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && <View style={{ height: 20 }} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    height: 400,
    justifyContent: 'flex-end',
  },
  headerImage: {
    opacity: 0.7,
  },
  overlay: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statText: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  difficultyBadge: {
    alignItems: 'center',
  },
  difficultyText: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginBottom: 15,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  overviewItem: {
    width: '50%',
    paddingHorizontal: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: colors.accent.primary,
  },
  overviewLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  equipmentItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 5,
  },
  equipmentText: {
    color: '#fff',
    fontSize: 14,
  },
  enrollButton: {
    backgroundColor: colors.accent.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 10,
  },
  enrolledButton: {
    backgroundColor: '#4CAF50',
  },
  enrollingButton: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 10,
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600' as const,
  },
});