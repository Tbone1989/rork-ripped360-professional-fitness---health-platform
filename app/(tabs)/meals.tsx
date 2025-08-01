import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Flame, 
  Target,
  UtensilsCrossed,
  Apple,
  Beef,
  Wheat,
  Droplets,
  TrendingUp,
  Calendar,
  Camera
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ChipGroup } from '@/components/ui/ChipGroup';

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  foods: string[];
  image?: string;
}

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

const mockMeals: Meal[] = [
  {
    id: '1',
    name: 'Protein Power Breakfast',
    time: '7:30 AM',
    calories: 485,
    protein: 32,
    carbs: 28,
    fat: 24,
    fiber: 6,
    foods: ['Greek yogurt', 'Berries', 'Almonds', 'Protein powder']
  },
  {
    id: '2',
    name: 'Post-Workout Fuel',
    time: '10:00 AM',
    calories: 320,
    protein: 25,
    carbs: 35,
    fat: 8,
    fiber: 4,
    foods: ['Banana', 'Whey protein', 'Oats', 'Honey']
  },
  {
    id: '3',
    name: 'Balanced Lunch',
    time: '1:00 PM',
    calories: 650,
    protein: 45,
    carbs: 52,
    fat: 22,
    fiber: 8,
    foods: ['Grilled chicken', 'Brown rice', 'Broccoli', 'Avocado']
  },
  {
    id: '4',
    name: 'Pre-Workout Snack',
    time: '4:30 PM',
    calories: 180,
    protein: 8,
    carbs: 28,
    fat: 6,
    fiber: 3,
    foods: ['Apple', 'Almond butter']
  }
];

const nutritionGoals: NutritionGoals = {
  calories: 2400,
  protein: 180,
  carbs: 240,
  fat: 80,
  water: 3000 // ml
};

export default function MealsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [waterIntake, setWaterIntake] = useState(2100); // ml

  // Calculate totals
  const totals = mockMeals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const filterOptions = [
    { id: 'all', label: 'All Meals' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'snacks', label: 'Snacks' }
  ];

  const addWater = (amount: number) => {
    setWaterIntake(prev => Math.min(prev + amount, nutritionGoals.water));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen 
        options={{ 
          title: 'Nutrition & Meals',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push('/meals/scan')}
              >
                <Camera size={20} color={colors.accent.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push('/meals/add')}
              >
                <Plus size={20} color={colors.accent.primary} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />

      {/* Daily Overview */}
      <Card style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <Text style={styles.overviewTitle}>Today's Nutrition</Text>
          <Text style={styles.overviewDate}>{new Date().toLocaleDateString()}</Text>
        </View>
        
        <View style={styles.caloriesSection}>
          <View style={styles.caloriesMain}>
            <Text style={styles.caloriesConsumed}>{totals.calories}</Text>
            <Text style={styles.caloriesGoal}>/ {nutritionGoals.calories} cal</Text>
          </View>
          <View style={styles.caloriesRemaining}>
            <Text style={styles.remainingLabel}>Remaining</Text>
            <Text style={styles.remainingValue}>{nutritionGoals.calories - totals.calories}</Text>
          </View>
        </View>

        <ProgressBar 
          progress={totals.calories / nutritionGoals.calories}
          height={8}
          style={styles.caloriesProgress}
        />

        <View style={styles.macrosGrid}>
          <View style={styles.macroItem}>
            <View style={styles.macroIcon}>
              <Beef size={16} color={colors.accent.primary} />
            </View>
            <Text style={styles.macroValue}>{totals.protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
            <ProgressBar 
              progress={totals.protein / nutritionGoals.protein}
              height={4}
              style={styles.macroProgress}
            />
          </View>
          
          <View style={styles.macroItem}>
            <View style={styles.macroIcon}>
              <Wheat size={16} color={colors.status.warning} />
            </View>
            <Text style={styles.macroValue}>{totals.carbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
            <ProgressBar 
              progress={totals.carbs / nutritionGoals.carbs}
              height={4}
              style={styles.macroProgress}
            />
          </View>
          
          <View style={styles.macroItem}>
            <View style={styles.macroIcon}>
              <Apple size={16} color={colors.status.success} />
            </View>
            <Text style={styles.macroValue}>{totals.fat}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
            <ProgressBar 
              progress={totals.fat / nutritionGoals.fat}
              height={4}
              style={styles.macroProgress}
            />
          </View>
        </View>
      </Card>

      {/* Water Intake */}
      <Card style={styles.waterCard}>
        <View style={styles.waterHeader}>
          <View style={styles.waterIcon}>
            <Droplets size={20} color={colors.status.info} />
          </View>
          <Text style={styles.waterTitle}>Water Intake</Text>
        </View>
        
        <View style={styles.waterContent}>
          <Text style={styles.waterAmount}>{waterIntake} ml</Text>
          <Text style={styles.waterGoal}>/ {nutritionGoals.water} ml</Text>
        </View>
        
        <ProgressBar 
          progress={waterIntake / nutritionGoals.water}
          height={8}
          style={styles.waterProgress}
        />
        
        <View style={styles.waterButtons}>
          <Button
            title="+250ml"
            variant="outline"
            onPress={() => addWater(250)}
            style={styles.waterButton}
          />
          <Button
            title="+500ml"
            variant="outline"
            onPress={() => addWater(500)}
            style={styles.waterButton}
          />
        </View>
      </Card>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search meals or foods..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
        
        <ChipGroup
          options={filterOptions}
          selectedIds={[selectedFilter]}
          onChange={(ids) => setSelectedFilter(ids[0] || 'all')}
          style={styles.filterChips}
        />
      </View>

      {/* Meals List */}
      <View style={styles.mealsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <TouchableOpacity onPress={() => router.push('/meals/plan')}>
            <Text style={styles.sectionAction}>View Plan</Text>
          </TouchableOpacity>
        </View>
        
        {mockMeals.map((meal) => (
          <Card key={meal.id} style={styles.mealCard}>
            <TouchableOpacity 
              style={styles.mealContent}
              onPress={() => router.push(`/meals/${meal.id}`)}
            >
              <View style={styles.mealHeader}>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <View style={styles.mealTime}>
                    <Clock size={14} color={colors.text.secondary} />
                    <Text style={styles.mealTimeText}>{meal.time}</Text>
                  </View>
                </View>
                
                <View style={styles.mealCalories}>
                  <Flame size={16} color={colors.accent.primary} />
                  <Text style={styles.mealCaloriesText}>{meal.calories}</Text>
                </View>
              </View>
              
              <View style={styles.mealMacros}>
                <View style={styles.mealMacro}>
                  <Text style={styles.mealMacroValue}>{meal.protein}g</Text>
                  <Text style={styles.mealMacroLabel}>Protein</Text>
                </View>
                <View style={styles.mealMacro}>
                  <Text style={styles.mealMacroValue}>{meal.carbs}g</Text>
                  <Text style={styles.mealMacroLabel}>Carbs</Text>
                </View>
                <View style={styles.mealMacro}>
                  <Text style={styles.mealMacroValue}>{meal.fat}g</Text>
                  <Text style={styles.mealMacroLabel}>Fat</Text>
                </View>
                <View style={styles.mealMacro}>
                  <Text style={styles.mealMacroValue}>{meal.fiber}g</Text>
                  <Text style={styles.mealMacroLabel}>Fiber</Text>
                </View>
              </View>
              
              <View style={styles.mealFoods}>
                <Text style={styles.mealFoodsText}>
                  {meal.foods.join(' • ')}
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button
          title="Log Food"
          onPress={() => router.push('/meals/log')}
          icon={<Plus size={18} color={colors.text.primary} />}
          style={styles.actionButton}
        />
        <Button
          title="Meal Plans"
          variant="outline"
          onPress={() => router.push('/meals/plans')}
          icon={<Calendar size={18} color={colors.accent.primary} />}
          style={styles.actionButton}
        />
        <Button
          title="Progress"
          variant="outline"
          onPress={() => router.push('/meals/progress')}
          icon={<TrendingUp size={18} color={colors.accent.primary} />}
          style={styles.actionButton}
        />
      </View>
      
      {/* Grocery Price Finder */}
      <Card style={styles.groceryCard}>
        <View style={styles.groceryHeader}>
          <Text style={styles.groceryTitle}>Find Cheapest Groceries</Text>
          <Text style={styles.grocerySubtitle}>Compare prices across local stores</Text>
        </View>
        <Button
          title="Search Grocery Prices"
          onPress={() => router.push('/meals/grocery-prices')}
          icon={<Search size={18} color={colors.text.primary} />}
          style={styles.groceryButton}
        />
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
  overviewCard: {
    margin: 16,
    padding: 20,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  overviewDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  caloriesSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  caloriesMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  caloriesConsumed: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
  },
  caloriesGoal: {
    fontSize: 16,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  caloriesRemaining: {
    alignItems: 'flex-end',
  },
  remainingLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  remainingValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  caloriesProgress: {
    marginBottom: 20,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  macroLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  macroProgress: {
    width: '80%',
  },
  waterCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  waterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  waterIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  waterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  waterContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  waterAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  waterGoal: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  waterProgress: {
    marginBottom: 16,
  },
  waterButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  waterButton: {
    flex: 1,
  },
  searchSection: {
    padding: 16,
    paddingTop: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChips: {
    marginBottom: 0,
  },
  mealsSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  sectionAction: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '500',
  },
  mealCard: {
    marginBottom: 12,
    padding: 0,
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
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  mealTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mealTimeText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  mealCalories: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealCaloriesText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  mealMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mealMacro: {
    alignItems: 'center',
  },
  mealMacroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  mealMacroLabel: {
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
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  groceryCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  groceryHeader: {
    marginBottom: 16,
  },
  groceryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  grocerySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  groceryButton: {
    marginBottom: 0,
  },
});