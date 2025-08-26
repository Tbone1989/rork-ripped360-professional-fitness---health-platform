import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Flame, 
  Plus,
  Edit3,
  Copy,
  Share,
  ChefHat,
  Apple,
  Beef,
  Wheat
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChipGroup } from '@/components/ui/ChipGroup';

interface GeneratedMeal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time?: string;
}

interface GeneratedDayPlan {
  day: number;
  breakfast?: GeneratedMeal;
  lunch?: GeneratedMeal;
  dinner?: GeneratedMeal;
  snack?: GeneratedMeal;
  'pre-workout'?: GeneratedMeal;
  'post-workout'?: GeneratedMeal;
}

interface GeneratedPlanData {
  id: string;
  name: string;
  duration: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealsPerDay: number;
  restrictions: string[];
  meals: GeneratedDayPlan[];
}

interface PlannedMeal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: string[];
  isCompleted: boolean;
  notes?: string;
}

interface DayPlanUI {
  date: string;
  meals: PlannedMeal[];
  totalCalories: number;
  totalProtein: number;
}

const fallbackPlan: DayPlanUI = {
  date: new Date().toISOString(),
  totalCalories: 2450,
  totalProtein: 185,
  meals: [
    {
      id: '1',
      name: 'Power Breakfast',
      time: '7:30 AM',
      calories: 485,
      protein: 32,
      carbs: 28,
      fat: 24,
      foods: ['Greek yogurt', 'Berries', 'Almonds', 'Protein powder'],
      isCompleted: true,
    },
  ],
};

function mapGeneratedToUI(day: GeneratedDayPlan | undefined): DayPlanUI {
  if (!day) return fallbackPlan;
  const entries: Array<[string, GeneratedMeal | undefined]> = [
    ['breakfast', day['breakfast']],
    ['pre-workout', day['pre-workout']],
    ['lunch', day['lunch']],
    ['snack', day['snack']],
    ['post-workout', day['post-workout']],
    ['dinner', day['dinner']],
  ];
  const meals: PlannedMeal[] = entries
    .filter(([, m]) => !!m)
    .map(([key, m], idx) => {
      const meal = m as GeneratedMeal;
      return {
        id: `${day.day}-${key}`,
        name: meal.name,
        time: meal.time ?? '',
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        foods: [],
        isCompleted: false,
      } as PlannedMeal;
    });
  const totals = meals.reduce(
    (acc, m) => {
      acc.cal += m.calories;
      acc.pro += m.protein;
      return acc;
    },
    { cal: 0, pro: 0 }
  );
  return {
    date: new Date().toISOString(),
    meals,
    totalCalories: totals.cal,
    totalProtein: totals.pro,
  };
}

export default function MealPlanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ planData?: string; planId?: string; preview?: string }>();
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'upcoming'>('today');

  const viewOptions = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'upcoming', label: 'Upcoming' },
  ];

  const generated: GeneratedPlanData | null = useMemo(() => {
    try {
      if (!params.planData || typeof params.planData !== 'string') return null;
      const parsed = JSON.parse(params.planData) as GeneratedPlanData;
      return parsed;
    } catch (e) {
      console.error('Failed to parse planData param', e);
      return null;
    }
  }, [params.planData]);

  const currentPlan: DayPlanUI = useMemo(() => {
    const dayIndex = Math.max(0, Math.min(Number(params.preview ?? '1') - 1, 6));
    if (generated?.meals?.length) {
      return mapGeneratedToUI(generated.meals[dayIndex]);
    }
    return fallbackPlan;
  }, [generated?.meals, params.preview]);

  const completedMeals = currentPlan.meals.filter((meal) => meal.isCompleted).length;
  const completionRate = currentPlan.meals.length > 0 ? (completedMeals / currentPlan.meals.length) * 100 : 0;

  const toggleMealCompletion = (mealId: string) => {
    console.log('Toggle meal completion:', mealId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    if (isToday) return 'Today';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} testID="meal-plan-screen">
      <Stack.Screen
        options={{
          title: 'Meal Plan',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/meals/plans/edit')}>
                <Edit3 size={18} color={colors.accent.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => {
                  Alert.alert('Share', 'Sharing coming soon');
                }}
              >
                <Share size={18} color={colors.accent.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View style={styles.viewSection}>
        <ChipGroup
          options={viewOptions}
          selectedIds={[viewMode]}
          onChange={(ids) => setViewMode((ids[0] as 'today' | 'week' | 'upcoming') ?? 'today')}
          style={styles.viewChips}
        />
      </View>

      <Card style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <View style={styles.dateInfo}>
            <Text style={styles.dateTitle}>{formatDate(currentPlan.date)}</Text>
            <Text style={styles.dateSubtitle}>{currentPlan.meals.length} meals planned</Text>
          </View>
          <View style={styles.completionBadge}>
            <Text style={styles.completionText}>{Math.round(completionRate)}%</Text>
          </View>
        </View>

        <View style={styles.dailyStats}>
          <View style={styles.dailyStat}>
            <Flame size={16} color={colors.accent.primary} />
            <Text style={styles.dailyStatValue}>{currentPlan.totalCalories}</Text>
            <Text style={styles.dailyStatLabel}>Calories</Text>
          </View>
          <View style={styles.dailyStat}>
            <Beef size={16} color={colors.accent.secondary} />
            <Text style={styles.dailyStatValue}>{currentPlan.totalProtein}g</Text>
            <Text style={styles.dailyStatLabel}>Protein</Text>
          </View>
          <View style={styles.dailyStat}>
            <ChefHat size={16} color={colors.status.success} />
            <Text style={styles.dailyStatValue}>{completedMeals}/{currentPlan.meals.length}</Text>
            <Text style={styles.dailyStatLabel}>Completed</Text>
          </View>
        </View>
      </Card>

      <View style={styles.timelineSection}>
        <Text style={styles.sectionTitle}>Today's Meals</Text>
        {currentPlan.meals.map((meal) => (
          <Card key={meal.id} style={[styles.mealCard, meal.isCompleted && styles.completedMealCard]} testID={`meal-${meal.id}`}>
            <TouchableOpacity style={styles.mealContent} onPress={() => toggleMealCompletion(meal.id)}>
              <View style={styles.mealHeader}>
                <View style={styles.mealTime}>
                  <View style={[styles.timeIndicator, meal.isCompleted && styles.completedIndicator]} />
                  <View style={styles.mealTimeInfo}>
                    <Text style={styles.mealTimeText}>{meal.time}</Text>
                    <Text style={[styles.mealName, meal.isCompleted && styles.completedText]}>{meal.name}</Text>
                  </View>
                </View>
                <View style={styles.mealActions}>
                  <TouchableOpacity style={styles.mealAction} onPress={() => router.push(`/meals/edit/${meal.id}`)}>
                    <Edit3 size={16} color={colors.text.secondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.mealAction} onPress={() => {}}>
                    <Copy size={16} color={colors.text.secondary} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.mealNutrition}>
                <View style={styles.nutritionItem}>
                  <Flame size={12} color={colors.accent.primary} />
                  <Text style={styles.nutritionText}>{meal.calories} cal</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Beef size={12} color={colors.accent.secondary} />
                  <Text style={styles.nutritionText}>{meal.protein}g protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Wheat size={12} color={colors.status.warning} />
                  <Text style={styles.nutritionText}>{meal.carbs}g carbs</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Apple size={12} color={colors.status.success} />
                  <Text style={styles.nutritionText}>{meal.fat}g fat</Text>
                </View>
              </View>
              {meal.notes && (
                <View style={styles.mealNotes}>
                  <Text style={styles.mealNotesText}>{meal.notes}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      <View style={styles.quickActions}>
        <Button
          title="Add Meal"
          onPress={() => router.push('/meals/add')}
          icon={<Plus size={18} color={colors.text.primary} />}
          style={styles.actionButton}
        />
        <Button
          title="Generate Plan"
          variant="outline"
          onPress={() => router.push('/meals/plans/create')}
          icon={<ChefHat size={18} color={colors.accent.primary} />}
          style={styles.actionButton}
        />
      </View>
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
  viewSection: {
    padding: 16,
  },
  viewChips: {
    marginBottom: 0,
  },
  overviewCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateInfo: {
    flex: 1,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  dateSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  completionBadge: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  dailyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dailyStat: {
    alignItems: 'center',
    gap: 4,
  },
  dailyStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  dailyStatLabel: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  timelineSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  mealCard: {
    marginBottom: 12,
    padding: 0,
  },
  completedMealCard: {
    opacity: 0.7,
  },
  mealContent: {
    padding: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealTime: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  timeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border.light,
    marginRight: 12,
    marginTop: 4,
  },
  completedIndicator: {
    backgroundColor: colors.status.success,
  },
  mealTimeInfo: {
    flex: 1,
  },
  mealTimeText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.text.secondary,
  },
  mealActions: {
    flexDirection: 'row',
    gap: 8,
  },
  mealAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealNutrition: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  nutritionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nutritionText: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  mealFoods: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  mealFoodsText: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  mealNotes: {
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
  },
  mealNotesText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});