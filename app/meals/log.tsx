import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Plus, 
  Search, 
  Clock, 
  Flame, 
  Camera,
  Utensils,
  Apple,
  Beef,
  Wheat
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiService, NutritionData } from '@/services/api';

interface FoodItem extends NutritionData {
  id?: string;
  serving?: string;
}

const popularFoods: FoodItem[] = [
  {
    id: '1',
    name: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    servingSize: '100g',
    serving: '100g'
  },
  {
    id: '2',
    name: 'Brown Rice',
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    fiber: 1.8,
    sugar: 0.4,
    sodium: 5,
    servingSize: '100g cooked',
    serving: '100g cooked'
  },
  {
    id: '3',
    name: 'Greek Yogurt',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    fiber: 0,
    sugar: 3.2,
    sodium: 36,
    servingSize: '100g',
    serving: '100g'
  },
  {
    id: '4',
    name: 'Banana',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    sugar: 12,
    sodium: 1,
    servingSize: '1 medium',
    serving: '1 medium'
  },
  {
    id: '5',
    name: 'Almonds',
    calories: 579,
    protein: 21,
    carbs: 22,
    fat: 50,
    fiber: 12,
    sugar: 4,
    sodium: 1,
    servingSize: '100g',
    serving: '100g'
  },
  {
    id: '6',
    name: 'Broccoli',
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    sugar: 1.5,
    sodium: 33,
    servingSize: '100g',
    serving: '100g'
  }
];

export default function LogFoodScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const filteredFoods = showResults ? searchResults : popularFoods.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Search API integration
  useEffect(() => {
    const searchFood = async () => {
      if (searchQuery.length < 2) {
        setShowResults(false);
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await apiService.searchFood(searchQuery);
        setSearchResults(results.map((item, index) => ({
          ...item,
          id: `search-${index}`,
          serving: item.servingSize
        })));
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        Alert.alert('Search Error', 'Unable to search foods. Please try again.');
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchFood, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const addFood = (food: FoodItem) => {
    setSelectedFoods(prev => [...prev, food]);
    Alert.alert('Added', `${food.name} added to your meal`);
  };

  const logMeal = () => {
    if (selectedFoods.length === 0) {
      Alert.alert('No Foods', 'Please add some foods to log your meal');
      return;
    }
    
    Alert.alert(
      'Meal Logged', 
      `Successfully logged ${selectedFoods.length} food items`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const totalCalories = selectedFoods.reduce((sum, food) => sum + food.calories, 0);
  const totalProtein = selectedFoods.reduce((sum, food) => sum + food.protein, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen 
        options={{ 
          title: 'Log Food',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/meals/scan')}
            >
              <Camera size={20} color={colors.accent.primary} />
            </TouchableOpacity>
          ),
        }} 
      />

      {/* Search */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search foods..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {isSearching && (
            <View style={styles.searchLoader}>
              <ActivityIndicator size="small" color={colors.accent.primary} />
            </View>
          )}
        </View>
      </View>

      {/* Selected Foods Summary */}
      {selectedFoods.length > 0 && (
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Selected Foods ({selectedFoods.length})</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Flame size={16} color={colors.accent.primary} />
              <Text style={styles.summaryValue}>{Math.round(totalCalories)} cal</Text>
            </View>
            <View style={styles.summaryItem}>
              <Beef size={16} color={colors.accent.primary} />
              <Text style={styles.summaryValue}>{Math.round(totalProtein)}g protein</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Foods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {showResults ? `Search Results (${filteredFoods.length})` : 'Popular Foods'}
        </Text>
        
        {filteredFoods.map((food) => (
          <Card key={food.id} style={styles.foodCard}>
            <TouchableOpacity 
              style={styles.foodContent}
              onPress={() => addFood(food)}
            >
              <View style={styles.foodHeader}>
                <View style={styles.foodIcon}>
                  <Utensils size={20} color={colors.accent.primary} />
                </View>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodServing}>{food.serving || food.servingSize}</Text>
                </View>
                <View style={styles.foodCalories}>
                  <Text style={styles.foodCaloriesText}>{food.calories}</Text>
                  <Text style={styles.foodCaloriesLabel}>cal</Text>
                </View>
              </View>
              
              <View style={styles.foodMacros}>
                <View style={styles.foodMacro}>
                  <Beef size={12} color={colors.text.secondary} />
                  <Text style={styles.foodMacroText}>{food.protein}g</Text>
                </View>
                <View style={styles.foodMacro}>
                  <Wheat size={12} color={colors.text.secondary} />
                  <Text style={styles.foodMacroText}>{food.carbs}g</Text>
                </View>
                <View style={styles.foodMacro}>
                  <Apple size={12} color={colors.text.secondary} />
                  <Text style={styles.foodMacroText}>{food.fat}g</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button
          title="Scan Barcode"
          variant="outline"
          onPress={() => router.push('/meals/scan')}
          icon={<Camera size={18} color={colors.accent.primary} />}
          style={styles.actionButton}
        />
        <Button
          title="Add Custom Food"
          variant="outline"
          onPress={() => router.push('/meals/add')}
          icon={<Plus size={18} color={colors.accent.primary} />}
          style={styles.actionButton}
        />
      </View>

      {/* Log Button */}
      {selectedFoods.length > 0 && (
        <View style={styles.logSection}>
          <Button
            title={`Log Meal (${selectedFoods.length} items)`}
            onPress={logMeal}
            style={styles.logButton}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    padding: 16,
  },
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    marginBottom: 0,
  },
  searchLoader: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  summaryCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  summaryStats: {
    flexDirection: 'row',
    gap: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  foodCard: {
    marginBottom: 12,
    padding: 0,
  },
  foodContent: {
    padding: 16,
  },
  foodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  foodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  foodServing: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  foodCalories: {
    alignItems: 'flex-end',
  },
  foodCaloriesText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  foodCaloriesLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  foodMacros: {
    flexDirection: 'row',
    gap: 16,
  },
  foodMacro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  foodMacroText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  logSection: {
    padding: 16,
    paddingTop: 0,
  },
  logButton: {
    marginBottom: 20,
  },
});