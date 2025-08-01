import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { 
  Clock, 
  Flame, 
  Edit3,
  Share,
  Copy,
  Trash2,
  Plus,
  Minus,
  Apple,
  Beef,
  Wheat,
  Droplets
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface FoodItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface MealDetail {
  id: string;
  name: string;
  time: string;
  date: string;
  foods: FoodItem[];
  notes?: string;
  isLogged: boolean;
}

const mockMealDetail: MealDetail = {
  id: '1',
  name: 'Protein Power Breakfast',
  time: '7:30 AM',
  date: '2024-01-22',
  isLogged: true,
  notes: 'Perfect post-workout meal with balanced macros',
  foods: [
    {
      id: '1',
      name: 'Greek Yogurt (Plain)',
      amount: 200,
      unit: 'g',
      calories: 130,
      protein: 20,
      carbs: 9,
      fat: 0,
      fiber: 0
    },
    {
      id: '2',
      name: 'Mixed Berries',
      amount: 100,
      unit: 'g',
      calories: 57,
      protein: 1,
      carbs: 14,
      fat: 0.3,
      fiber: 2.4
    },
    {
      id: '3',
      name: 'Almonds (Raw)',
      amount: 30,
      unit: 'g',
      calories: 174,
      protein: 6,
      carbs: 2.5,
      fat: 15,
      fiber: 3.5
    },
    {
      id: '4',
      name: 'Whey Protein Powder',
      amount: 30,
      unit: 'g',
      calories: 124,
      protein: 25,
      carbs: 2.5,
      fat: 1,
      fiber: 0
    }
  ]
};

export default function MealDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [meal, setMeal] = useState(mockMealDetail);
  const [servingMultiplier, setServingMultiplier] = useState(1);

  // Calculate totals
  const totals = meal.foods.reduce((acc, food) => ({
    calories: acc.calories + (food.calories * servingMultiplier),
    protein: acc.protein + (food.protein * servingMultiplier),
    carbs: acc.carbs + (food.carbs * servingMultiplier),
    fat: acc.fat + (food.fat * servingMultiplier),
    fiber: acc.fiber + (food.fiber * servingMultiplier)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

  const adjustServing = (increment: boolean) => {
    setServingMultiplier(prev => {
      const newValue = increment ? prev + 0.25 : prev - 0.25;
      return Math.max(0.25, Math.min(5, newValue));
    });
  };

  const deleteMeal = () => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Deleted', 'Meal has been deleted');
            router.back();
          }
        }
      ]
    );
  };

  const copyMeal = () => {
    Alert.alert('Copied', 'Meal has been copied to your meal library');
  };

  const shareMeal = () => {
    Alert.alert('Share', 'Sharing functionality would be implemented here');
  };

  const logMeal = () => {
    Alert.alert('Logged', 'Meal has been logged to your diary');
    setMeal(prev => ({ ...prev, isLogged: true }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen 
        options={{ 
          title: meal.name,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push(`/meals/edit/${meal.id}`)}
              >
                <Edit3 size={18} color={colors.accent.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={shareMeal}
              >
                <Share size={18} color={colors.accent.primary} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />

      {/* Meal Overview */}
      <Card style={styles.overviewCard}>
        <View style={styles.mealHeader}>
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <View style={styles.mealMeta}>
              <Clock size={14} color={colors.text.secondary} />
              <Text style={styles.mealTime}>{meal.time}</Text>
              <Text style={styles.mealDate}>• {new Date(meal.date).toLocaleDateString()}</Text>
            </View>
          </View>
          
          {meal.isLogged && (
            <View style={styles.loggedBadge}>
              <Text style={styles.loggedText}>Logged</Text>
            </View>
          )}
        </View>
        
        {meal.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesText}>{meal.notes}</Text>
          </View>
        )}
      </Card>

      {/* Serving Size Adjuster */}
      <Card style={styles.servingCard}>
        <View style={styles.servingHeader}>
          <Text style={styles.servingTitle}>Serving Size</Text>
          <View style={styles.servingControls}>
            <TouchableOpacity 
              style={styles.servingButton}
              onPress={() => adjustServing(false)}
              disabled={servingMultiplier <= 0.25}
            >
              <Minus size={16} color={servingMultiplier <= 0.25 ? colors.text.tertiary : colors.text.primary} />
            </TouchableOpacity>
            
            <Text style={styles.servingValue}>{servingMultiplier}x</Text>
            
            <TouchableOpacity 
              style={styles.servingButton}
              onPress={() => adjustServing(true)}
              disabled={servingMultiplier >= 5}
            >
              <Plus size={16} color={servingMultiplier >= 5 ? colors.text.tertiary : colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      {/* Nutrition Summary */}
      <Card style={styles.nutritionCard}>
        <Text style={styles.cardTitle}>Nutrition Summary</Text>
        
        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionItem}>
            <View style={styles.nutritionIcon}>
              <Flame size={20} color={colors.accent.primary} />
            </View>
            <Text style={styles.nutritionValue}>{Math.round(totals.calories)}</Text>
            <Text style={styles.nutritionLabel}>Calories</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <View style={styles.nutritionIcon}>
              <Beef size={20} color={colors.accent.secondary} />
            </View>
            <Text style={styles.nutritionValue}>{Math.round(totals.protein)}g</Text>
            <Text style={styles.nutritionLabel}>Protein</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <View style={styles.nutritionIcon}>
              <Wheat size={20} color={colors.status.warning} />
            </View>
            <Text style={styles.nutritionValue}>{Math.round(totals.carbs)}g</Text>
            <Text style={styles.nutritionLabel}>Carbs</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <View style={styles.nutritionIcon}>
              <Apple size={20} color={colors.status.success} />
            </View>
            <Text style={styles.nutritionValue}>{Math.round(totals.fat)}g</Text>
            <Text style={styles.nutritionLabel}>Fat</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <View style={styles.nutritionIcon}>
              <Droplets size={20} color={colors.status.info} />
            </View>
            <Text style={styles.nutritionValue}>{Math.round(totals.fiber)}g</Text>
            <Text style={styles.nutritionLabel}>Fiber</Text>
          </View>
        </View>
      </Card>

      {/* Food Items */}
      <Card style={styles.foodsCard}>
        <Text style={styles.cardTitle}>Food Items</Text>
        
        <View style={styles.foodsList}>
          {meal.foods.map((food, index) => (
            <View key={food.id} style={[styles.foodItem, index > 0 && styles.foodItemBorder]}>
              <View style={styles.foodHeader}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodAmount}>
                  {Math.round(food.amount * servingMultiplier)}{food.unit}
                </Text>
              </View>
              
              <View style={styles.foodNutrition}>
                <View style={styles.foodNutritionItem}>
                  <Text style={styles.foodNutritionValue}>{Math.round(food.calories * servingMultiplier)}</Text>
                  <Text style={styles.foodNutritionLabel}>cal</Text>
                </View>
                <View style={styles.foodNutritionItem}>
                  <Text style={styles.foodNutritionValue}>{Math.round(food.protein * servingMultiplier)}g</Text>
                  <Text style={styles.foodNutritionLabel}>protein</Text>
                </View>
                <View style={styles.foodNutritionItem}>
                  <Text style={styles.foodNutritionValue}>{Math.round(food.carbs * servingMultiplier)}g</Text>
                  <Text style={styles.foodNutritionLabel}>carbs</Text>
                </View>
                <View style={styles.foodNutritionItem}>
                  <Text style={styles.foodNutritionValue}>{Math.round(food.fat * servingMultiplier)}g</Text>
                  <Text style={styles.foodNutritionLabel}>fat</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* Actions */}
      <View style={styles.actions}>
        {!meal.isLogged ? (
          <Button
            title="Log This Meal"
            onPress={logMeal}
            style={styles.primaryAction}
          />
        ) : (
          <Button
            title="Log Again"
            onPress={logMeal}
            style={styles.primaryAction}
          />
        )}
        
        <View style={styles.secondaryActions}>
          <Button
            title="Copy Meal"
            variant="outline"
            onPress={copyMeal}
            icon={<Copy size={16} color={colors.accent.primary} />}
            style={styles.secondaryAction}
          />
          <Button
            title="Delete"
            variant="outline"
            onPress={deleteMeal}
            icon={<Trash2 size={16} color={colors.status.error} />}
            style={[styles.secondaryAction, styles.deleteButton]}
          />
        </View>
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
  overviewCard: {
    margin: 16,
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 6,
  },
  mealMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mealTime: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  mealDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  loggedBadge: {
    backgroundColor: colors.status.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loggedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  notesSection: {
    padding: 12,
    backgroundColor: colors.background.tertiary,
    borderRadius: 8,
  },
  notesText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  servingCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  servingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  servingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  servingButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    minWidth: 40,
    textAlign: 'center',
  },
  nutritionCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  nutritionItem: {
    alignItems: 'center',
    width: '18%',
  },
  nutritionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  nutritionLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  foodsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  foodsList: {
    gap: 0,
  },
  foodItem: {
    paddingVertical: 12,
  },
  foodItemBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  foodAmount: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  foodNutrition: {
    flexDirection: 'row',
    gap: 12,
  },
  foodNutritionItem: {
    alignItems: 'center',
  },
  foodNutritionValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
  },
  foodNutritionLabel: {
    fontSize: 10,
    color: colors.text.secondary,
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  primaryAction: {
    marginBottom: 4,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
  },
  deleteButton: {
    borderColor: colors.status.error,
  },
});