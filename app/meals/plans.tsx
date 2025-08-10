import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Flame, 
  Users,
  Target,
  ChefHat,
  Star,
  BookOpen,
  Sparkles
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { apiService } from '@/services/api';

interface MealPlan {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  calories: number;
  protein: number;
  meals: number;
  rating: number;
  reviews: number;
  tags: string[];
  price?: number;
  isPremium: boolean;
}

const mealPlans: MealPlan[] = [
  {
    id: '1',
    name: 'Muscle Building Plan',
    description: 'High-protein meal plan designed for muscle growth and recovery',
    duration: '4 weeks',
    difficulty: 'Intermediate',
    calories: 2800,
    protein: 200,
    meals: 6,
    rating: 4.8,
    reviews: 324,
    tags: ['High Protein', 'Muscle Gain', 'Post-Workout'],
    price: 29.99,
    isPremium: true
  },
  {
    id: '2',
    name: 'Fat Loss Accelerator',
    description: 'Balanced low-calorie plan for sustainable weight loss',
    duration: '6 weeks',
    difficulty: 'Beginner',
    calories: 1800,
    protein: 140,
    meals: 5,
    rating: 4.6,
    reviews: 567,
    tags: ['Weight Loss', 'Low Calorie', 'Balanced'],
    isPremium: false
  },
  {
    id: '3',
    name: 'Athletic Performance',
    description: 'Optimized nutrition for peak athletic performance',
    duration: '8 weeks',
    difficulty: 'Advanced',
    calories: 3200,
    protein: 180,
    meals: 7,
    rating: 4.9,
    reviews: 189,
    tags: ['Performance', 'High Energy', 'Competition'],
    price: 49.99,
    isPremium: true
  },
  {
    id: '4',
    name: 'Beginner Basics',
    description: 'Simple, nutritious meals for those starting their fitness journey',
    duration: '2 weeks',
    difficulty: 'Beginner',
    calories: 2200,
    protein: 120,
    meals: 4,
    rating: 4.4,
    reviews: 892,
    tags: ['Beginner', 'Simple', 'Balanced'],
    isPremium: false
  },
  {
    id: '5',
    name: 'Keto Transformation',
    description: 'Low-carb, high-fat meal plan for ketogenic lifestyle',
    duration: '4 weeks',
    difficulty: 'Intermediate',
    calories: 2000,
    protein: 150,
    meals: 5,
    rating: 4.7,
    reviews: 445,
    tags: ['Keto', 'Low Carb', 'High Fat'],
    price: 39.99,
    isPremium: true
  }
];

import { useMedicalStore } from '@/store/medicalStore';
import { MedicalCondition } from '@/types/medical';

export default function MealPlansScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const medicalProfile = useMedicalStore(state => state.medicalProfile);

  const healthRestrictions = useMemo<string[]>(() => {
    const conditions = medicalProfile?.conditions ?? [];
    const normalized = conditions.map((c: MedicalCondition) => c.name.toLowerCase());
    const restrictions: string[] = [];

    if (normalized.some(n => n.includes('diabetes') || n.includes('pre-diabetes') || n.includes('prediabetes'))) {
      restrictions.push('low-glycemic', 'controlled-carbs', 'no-added-sugar', 'high-fiber');
    }
    if (normalized.some(n => n.includes('hypertension') || n.includes('high blood pressure') || n.includes('blood pressure'))) {
      restrictions.push('low-sodium', 'dash-diet');
    }
    if (normalized.some(n => n.includes('kidney'))) {
      restrictions.push('renal-friendly');
    }
    if (normalized.some(n => n.includes('celiac') || n.includes('gluten'))) {
      restrictions.push('gluten-free');
    }
    if (normalized.some(n => n.includes('lactose') || n.includes('dairy'))) {
      restrictions.push('dairy-free');
    }

    return Array.from(new Set(restrictions));
  }, [medicalProfile?.conditions]);

  const filterOptions = [
    { id: 'all', label: 'All Plans' },
    { id: 'free', label: 'Free' },
    { id: 'premium', label: 'Premium' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'weight-loss', label: 'Weight Loss' },
    { id: 'muscle-gain', label: 'Muscle Gain' }
  ];

  const filteredPlans = mealPlans.filter(plan => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'free') return !plan.isPremium;
    if (selectedFilter === 'premium') return plan.isPremium;
    if (selectedFilter === 'beginner') return plan.difficulty === 'Beginner';
    if (selectedFilter === 'weight-loss') return plan.tags.some(tag => tag.toLowerCase().includes('weight') || tag.toLowerCase().includes('loss'));
    if (selectedFilter === 'muscle-gain') return plan.tags.some(tag => tag.toLowerCase().includes('muscle') || tag.toLowerCase().includes('gain'));
    return true;
  });

  const generateAIPlan = async (): Promise<void> => {
    setIsGenerating(true);
    try {
      // Enhanced preferences for better meal planning
      const preferences = {
        calories: 2200,
        protein: 150,
        carbs: 220,
        fat: 70,
        meals: 5,
        restrictions: healthRestrictions,
      } as const;
      
      const generatedPlan = await apiService.generateMealPlan(preferences);
      
      Alert.alert(
        'AI Meal Plan Generated!',
        `Your personalized ${preferences.meals}-meal plan has been created with optimized nutrition timing throughout the day.`,
        [
          {
            text: 'View Plan',
            onPress: () => {
              router.push({
                pathname: '/meals/plan',
                params: { planData: JSON.stringify(generatedPlan) }
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error generating meal plan:', error);
      Alert.alert('Generation Error', 'Unable to generate meal plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return colors.status.success;
      case 'Intermediate': return colors.status.warning;
      case 'Advanced': return colors.status.error;
      default: return colors.text.secondary;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen 
        options={{ 
          title: 'Meal Plans',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={generateAIPlan}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <ActivityIndicator size={16} color={colors.accent.primary} />
                ) : (
                  <Sparkles size={20} color={colors.accent.primary} />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push('/meals/plans/create')}
              >
                <Plus size={20} color={colors.accent.primary} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Meal Plans</Text>
        <Text style={styles.headerSubtitle}>
          Professionally designed nutrition plans to help you reach your goals
        </Text>
        
        {/* AI Generation Button */}
        <Card style={styles.aiCard}>
          <TouchableOpacity 
            style={styles.aiContent}
            onPress={generateAIPlan}
            disabled={isGenerating}
          >
            <View style={styles.aiIcon}>
              {isGenerating ? (
                <ActivityIndicator size={20} color={colors.accent.primary} />
              ) : (
                <Sparkles size={20} color={colors.accent.primary} />
              )}
            </View>
            <View style={styles.aiInfo}>
              <Text style={styles.aiTitle}>
                {isGenerating ? 'Generating...' : 'Generate AI Meal Plan'}
              </Text>
              <Text style={styles.aiDescription}>
                {isGenerating ? 'Creating your personalized plan' : healthRestrictions.length > 0 ? `Health-aware (${healthRestrictions.join(', ')})` : 'Get a custom plan tailored to your goals'}
              </Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <ChipGroup
          options={filterOptions}
          selectedIds={[selectedFilter]}
          onChange={(ids) => setSelectedFilter(ids[0] || 'all')}
          style={styles.filterChips}
        />
      </View>

      {/* Meal Plans */}
      <View style={styles.plansSection}>
        {filteredPlans.map((plan) => (
          <Card key={plan.id} style={styles.planCard}>
            <TouchableOpacity 
              style={styles.planContent}
              onPress={() => router.push(`/meals/plans/${plan.id}`)}
            >
              {/* Header */}
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <View style={styles.planTitleRow}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    {plan.isPremium && (
                      <View style={styles.premiumBadge}>
                        <Star size={12} color={colors.status.warning} />
                        <Text style={styles.premiumText}>PRO</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.planDescription}>{plan.description}</Text>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.planStats}>
                <View style={styles.statItem}>
                  <Calendar size={14} color={colors.text.secondary} />
                  <Text style={styles.statText}>{plan.duration}</Text>
                </View>
                <View style={styles.statItem}>
                  <Flame size={14} color={colors.text.secondary} />
                  <Text style={styles.statText}>{plan.calories} cal/day</Text>
                </View>
                <View style={styles.statItem}>
                  <ChefHat size={14} color={colors.text.secondary} />
                  <Text style={styles.statText}>{plan.meals} meals/day</Text>
                </View>
              </View>

              {/* Difficulty & Rating */}
              <View style={styles.planMeta}>
                <View style={styles.difficulty}>
                  <View style={[styles.difficultyDot, { backgroundColor: getDifficultyColor(plan.difficulty) }]} />
                  <Text style={styles.difficultyText}>{plan.difficulty}</Text>
                </View>
                
                <View style={styles.rating}>
                  <Star size={14} color={colors.status.warning} fill={colors.status.warning} />
                  <Text style={styles.ratingText}>{plan.rating}</Text>
                  <Text style={styles.reviewsText}>({plan.reviews})</Text>
                </View>
              </View>

              {/* Tags */}
              <View style={styles.planTags}>
                {plan.tags.slice(0, 3).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Price */}
              <View style={styles.planFooter}>
                {plan.isPremium ? (
                  <Text style={styles.price}>${plan.price}</Text>
                ) : (
                  <Text style={styles.freeText}>Free</Text>
                )}
                <Button
                  title={plan.isPremium ? 'Get Plan' : 'Start Free'}
                  variant={plan.isPremium ? 'primary' : 'outline'}
                  onPress={() => router.push(`/meals/plans/${plan.id}`)}
                  style={styles.planButton}
                />
              </View>
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      {/* Create Custom Plan */}
      <Card style={styles.customPlanCard}>
        <View style={styles.customPlanContent}>
          <View style={styles.customPlanIcon}>
            <BookOpen size={24} color={colors.accent.primary} />
          </View>
          <View style={styles.customPlanInfo}>
            <Text style={styles.customPlanTitle}>Create Custom Plan</Text>
            <Text style={styles.customPlanDescription}>
              Build your own personalized meal plan based on your specific goals and preferences
            </Text>
          </View>
          <Button
            title="Create"
            onPress={() => router.push('/meals/plans/create')}
            style={styles.customPlanButton}
          />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  aiCard: {
    marginTop: 16,
    padding: 0,
  },
  aiContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiInfo: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  aiDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  filtersSection: {
    padding: 16,
    paddingTop: 8,
  },
  filterChips: {
    marginBottom: 0,
  },
  plansSection: {
    padding: 16,
    paddingTop: 0,
  },
  planCard: {
    marginBottom: 16,
    padding: 0,
  },
  planContent: {
    padding: 16,
  },
  planHeader: {
    marginBottom: 16,
  },
  planInfo: {
    flex: 1,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.status.warning,
  },
  planDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  planStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  planMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  difficulty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  reviewsText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  planTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  planFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  freeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.status.success,
  },
  planButton: {
    paddingHorizontal: 20,
  },
  customPlanCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  customPlanContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customPlanIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customPlanInfo: {
    flex: 1,
  },
  customPlanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  customPlanDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  customPlanButton: {
    paddingHorizontal: 16,
  },
});