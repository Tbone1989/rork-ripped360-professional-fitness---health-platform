import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { trpc } from '@/lib/trpc';
import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function TestBackend() {
  const [searchQuery, setSearchQuery] = useState<string>('chicken');
  const [barcode, setBarcode] = useState<string>('123456789');

  // Test queries
  const nutritionSearchQuery = trpc.nutrition.search.useQuery({ query: searchQuery });
  const nutritionBarcodeQuery = trpc.nutrition.barcode.useQuery({ barcode });
  const fitnessExercisesQuery = trpc.fitness.exercises.useQuery({ muscle: 'chest' });
  const supplementsSearchQuery = trpc.health.supplements.search.useQuery({ query: 'protein' });

  // Test mutations
  const generateWorkoutMutation = trpc.fitness.generate.useMutation();
  const generateMealPlanMutation = trpc.nutrition.mealPlan.useMutation();
  const analyzeBloodworkMutation = trpc.health.bloodwork.useMutation();

  const testWorkoutGeneration = async () => {
    try {
      const result = await generateWorkoutMutation.mutateAsync({
        type: 'strength',
        muscle: ['chest', 'shoulders'],
        difficulty: 'intermediate',
        duration: 45
      });
      Alert.alert('Success', `Generated workout: ${result.name}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate workout');
    }
  };

  const testMealPlanGeneration = async () => {
    try {
      const result = await generateMealPlanMutation.mutateAsync({
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 80,
        meals: 3,
        restrictions: []
      });
      Alert.alert('Success', `Generated meal plan: ${result.name}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate meal plan');
    }
  };

  const testBloodworkAnalysis = async () => {
    try {
      const result = await analyzeBloodworkMutation.mutateAsync({
        tests: ['cholesterol', 'vitamin_d']
      });
      Alert.alert('Success', `Analyzed ${result.length} tests`);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze bloodwork');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Backend API Test' }} />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔍 Search Tests</Text>
        
        <View style={styles.testItem}>
          <Text style={styles.testTitle}>Food Search</Text>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search food..."
            style={styles.input}
          />
          <Text style={styles.status}>
            Status: {nutritionSearchQuery.isLoading ? 'Loading...' : nutritionSearchQuery.isError ? 'Error' : 'Success'}
          </Text>
          {nutritionSearchQuery.data && (
            <Text style={styles.result}>Found {nutritionSearchQuery.data.length} items</Text>
          )}
        </View>

        <View style={styles.testItem}>
          <Text style={styles.testTitle}>Barcode Lookup</Text>
          <Input
            value={barcode}
            onChangeText={setBarcode}
            placeholder="Enter barcode..."
            style={styles.input}
          />
          <Text style={styles.status}>
            Status: {nutritionBarcodeQuery.isLoading ? 'Loading...' : nutritionBarcodeQuery.isError ? 'Error' : 'Success'}
          </Text>
          {nutritionBarcodeQuery.data && (
            <Text style={styles.result}>Found: {nutritionBarcodeQuery.data.name}</Text>
          )}
        </View>

        <View style={styles.testItem}>
          <Text style={styles.testTitle}>Exercise Search</Text>
          <Text style={styles.status}>
            Status: {fitnessExercisesQuery.isLoading ? 'Loading...' : fitnessExercisesQuery.isError ? 'Error' : 'Success'}
          </Text>
          {fitnessExercisesQuery.data && (
            <Text style={styles.result}>Found {fitnessExercisesQuery.data.length} exercises</Text>
          )}
        </View>

        <View style={styles.testItem}>
          <Text style={styles.testTitle}>Supplement Search</Text>
          <Text style={styles.status}>
            Status: {supplementsSearchQuery.isLoading ? 'Loading...' : supplementsSearchQuery.isError ? 'Error' : 'Success'}
          </Text>
          {supplementsSearchQuery.data && (
            <Text style={styles.result}>Found {supplementsSearchQuery.data.length} supplements</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Generation Tests</Text>
        
        <Button
          title="Generate Workout"
          onPress={testWorkoutGeneration}
          disabled={generateWorkoutMutation.isPending}
          style={styles.button}
        />

        <Button
          title="Generate Meal Plan"
          onPress={testMealPlanGeneration}
          disabled={generateMealPlanMutation.isPending}
          style={styles.button}
        />

        <Button
          title="Analyze Bloodwork"
          onPress={testBloodworkAnalysis}
          disabled={analyzeBloodworkMutation.isPending}
          style={styles.button}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 API Status</Text>
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Nutrition API</Text>
            <View style={[styles.statusIndicator, { backgroundColor: nutritionSearchQuery.isError ? '#ef4444' : '#10b981' }]} />
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Fitness API</Text>
            <View style={[styles.statusIndicator, { backgroundColor: fitnessExercisesQuery.isError ? '#ef4444' : '#10b981' }]} />
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Health API</Text>
            <View style={[styles.statusIndicator, { backgroundColor: supplementsSearchQuery.isError ? '#ef4444' : '#10b981' }]} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  testItem: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  result: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '500',
  },
  button: {
    marginBottom: 12,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});