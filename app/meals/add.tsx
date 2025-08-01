import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Plus, Minus, Clock, Flame } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ChipGroup } from '@/components/ui/ChipGroup';

interface FoodData {
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: string;
  barcode?: string;
}

const mealTypes = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack', label: 'Snack' },
];

export default function AddMealScreen() {
  const router = useRouter();
  const { foodData } = useLocalSearchParams();
  
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [quantity, setQuantity] = useState(1);
  const [customName, setCustomName] = useState('');
  const [notes, setNotes] = useState('');
  const [scannedFood, setScannedFood] = useState<FoodData | null>(null);

  useEffect(() => {
    if (foodData && typeof foodData === 'string') {
      try {
        const parsed = JSON.parse(foodData);
        setScannedFood(parsed);
        setCustomName(parsed.name);
      } catch (error) {
        console.error('Error parsing food data:', error);
      }
    }
  }, [foodData]);

  const adjustQuantity = (delta: number) => {
    setQuantity(Math.max(0.25, quantity + delta));
  };

  const calculateNutrition = (base: number) => {
    return Math.round(base * quantity);
  };

  const handleSave = () => {
    if (!customName.trim()) {
      Alert.alert('Error', 'Please enter a food name');
      return;
    }

    // Mock save functionality
    Alert.alert(
      'Meal Added!',
      `${customName} has been added to your ${selectedMealType}`,
      [
        {
          text: 'Add Another',
          onPress: () => {
            setCustomName('');
            setQuantity(1);
            setNotes('');
            setScannedFood(null);
          }
        },
        {
          text: 'Done',
          onPress: () => router.back()
        }
      ]
    );
  };

  const nutritionData = scannedFood ? {
    calories: calculateNutrition(scannedFood.calories),
    protein: calculateNutrition(scannedFood.protein),
    carbs: calculateNutrition(scannedFood.carbs),
    fat: calculateNutrition(scannedFood.fat),
    fiber: calculateNutrition(scannedFood.fiber),
  } : {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Add Food to Meal' }} />

      {/* Scanned Food Info */}
      {scannedFood && (
        <Card style={styles.scannedCard}>
          <View style={styles.scannedHeader}>
            <Text style={styles.scannedTitle}>Scanned Food</Text>
            <View style={styles.scannedBrand}>
              <Text style={styles.brandText}>{scannedFood.brand}</Text>
            </View>
          </View>
          <Text style={styles.scannedName}>{scannedFood.name}</Text>
          <Text style={styles.servingSize}>Per {scannedFood.servingSize}</Text>
        </Card>
      )}

      {/* Meal Type Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meal Type</Text>
        <ChipGroup
          options={mealTypes}
          selectedIds={[selectedMealType]}
          onChange={(ids) => setSelectedMealType(ids[0] || 'breakfast')}
          style={styles.chipGroup}
        />
      </View>

      {/* Food Details */}
      <View style={styles.section}>
        <Input
          label="Food Name"
          placeholder="Enter food name..."
          value={customName}
          onChangeText={setCustomName}
        />
      </View>

      {/* Quantity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quantity</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => adjustQuantity(-0.25)}
          >
            <Minus size={20} color={colors.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.quantityDisplay}>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <Text style={styles.quantityUnit}>
              {scannedFood ? `× ${scannedFood.servingSize}` : 'servings'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => adjustQuantity(0.25)}
          >
            <Plus size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Nutrition Preview */}
      {scannedFood && (
        <Card style={styles.nutritionCard}>
          <View style={styles.nutritionHeader}>
            <Flame size={20} color={colors.accent.primary} />
            <Text style={styles.nutritionTitle}>Nutrition Facts</Text>
          </View>
          
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{nutritionData.calories}</Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{nutritionData.protein}g</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{nutritionData.carbs}g</Text>
              <Text style={styles.nutritionLabel}>Carbs</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{nutritionData.fat}g</Text>
              <Text style={styles.nutritionLabel}>Fat</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Notes */}
      <View style={styles.section}>
        <Input
          label="Notes (Optional)"
          placeholder="Add any notes about this meal..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Add to Meal"
          onPress={handleSave}
          fullWidth
          icon={<Plus size={18} color={colors.text.primary} />}
        />
        
        <Button
          title="Scan Another"
          variant="outline"
          onPress={() => router.push('/meals/scan')}
          style={styles.scanButton}
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
  scannedCard: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  scannedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scannedTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent.primary,
    textTransform: 'uppercase',
  },
  scannedBrand: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  brandText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.primary,
  },
  scannedName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  servingSize: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  chipGroup: {
    marginBottom: 0,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDisplay: {
    alignItems: 'center',
    marginHorizontal: 32,
  },
  quantityValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  quantityUnit: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  nutritionCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  nutritionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  scanButton: {
    marginTop: 8,
  },
});