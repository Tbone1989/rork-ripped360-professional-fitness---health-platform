import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Search, Filter } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Input } from '@/components/ui/Input';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { WorkoutCard } from '@/components/workout/WorkoutCard';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { workoutCategories, popularExercises, featuredWorkoutPlans } from '@/mocks/workouts';

const difficultyOptions = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState(['all']);
  
  // In a real app, you would fetch the category data based on the ID
  const category = workoutCategories.find(cat => cat.id === id) || workoutCategories[0];
  
  // Mock filtered data - in a real app, this would come from an API
  const filteredWorkouts = featuredWorkoutPlans.filter(plan => 
    plan.category === category.name &&
    (selectedDifficulties.includes('all') || selectedDifficulties.includes(plan.difficulty)) &&
    (searchQuery === '' || plan.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredExercises = popularExercises.filter(exercise => 
    exercise.category === category.name &&
    (selectedDifficulties.includes('all') || selectedDifficulties.includes(exercise.difficulty)) &&
    (searchQuery === '' || exercise.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: category.imageUrl }}
          style={styles.heroImage}
          contentFit="cover"
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{category.name}</Text>
          <Text style={styles.heroDescription}>{category.description}</Text>
          <Text style={styles.heroStats}>{category.workoutCount} workouts available</Text>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search workouts and exercises..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            inputStyle={styles.searchInputText}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
        
        <ChipGroup
          options={difficultyOptions}
          selectedIds={selectedDifficulties}
          onChange={setSelectedDifficulties}
          scrollable={true}
          style={styles.difficultyFilter}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Workout Plans */}
        {filteredWorkouts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Plans ({filteredWorkouts.length})</Text>
            {filteredWorkouts.map((plan) => (
              <WorkoutCard key={plan.id} item={plan} type="plan" />
            ))}
          </View>
        )}

        {/* Exercises */}
        {filteredExercises.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exercises ({filteredExercises.length})</Text>
            {filteredExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </View>
        )}

        {/* Empty State */}
        {filteredWorkouts.length === 0 && filteredExercises.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Results Found</Text>
            <Text style={styles.emptyStateDescription}>
              Try adjusting your search terms or difficulty filters to find more content.
            </Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  heroContainer: {
    height: 200,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  heroContent: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'flex-end',
    gap: 4,
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
  heroStats: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  searchInputText: {
    paddingVertical: 10,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  difficultyFilter: {
    marginBottom: 0,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 24,
  },
});