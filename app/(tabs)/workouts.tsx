import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, Zap } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TabBar } from '@/components/ui/TabBar';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { WorkoutCard } from '@/components/workout/WorkoutCard';
import { CategoryCard } from '@/components/workout/CategoryCard';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { featuredWorkoutPlans } from '@/mocks/workouts';
import { workoutCategories } from '@/mocks/workouts';
import { popularExercises } from '@/mocks/workouts';

const tabs = [
  { key: 'workouts', label: 'Workouts' },
  { key: 'exercises', label: 'Exercises' },
  { key: 'my-workouts', label: 'My Workouts' },
];

const difficultyOptions = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export default function WorkoutsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('workouts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState(['all']);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search workouts, exercises..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            inputStyle={styles.searchInputText}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
        
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          style={styles.tabBar}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'workouts' && (
          <>
            <View style={styles.filterSection}>
              <ChipGroup
                options={difficultyOptions}
                selectedIds={selectedDifficulties}
                onChange={setSelectedDifficulties}
                scrollable={true}
              />
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              >
                {workoutCategories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Featured Workouts</Text>
              {featuredWorkoutPlans.map((plan) => (
                <WorkoutCard key={plan.id} item={plan} type="plan" />
              ))}
            </View>
            
            <View style={styles.aiWorkoutContainer}>
              <View style={styles.aiWorkoutCard}>
                <View style={styles.aiWorkoutHeader}>
                  <Zap size={24} color={colors.accent.primary} />
                  <Text style={styles.aiWorkoutTitle}>AI Workout Generator</Text>
                </View>
                <Text style={styles.aiWorkoutDescription}>
                  Create a personalized workout based on your goals, equipment, and available time.
                </Text>
                <Button
                  title="Generate Workout"
                  onPress={() => router.push('/workouts/generate')}
                  style={styles.aiWorkoutButton}
                />
              </View>
            </View>
          </>
        )}

        {activeTab === 'exercises' && (
          <>
            <View style={styles.filterSection}>
              <ChipGroup
                options={difficultyOptions}
                selectedIds={selectedDifficulties}
                onChange={setSelectedDifficulties}
                scrollable={true}
              />
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Exercises</Text>
              {popularExercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </View>
          </>
        )}

        {activeTab === 'my-workouts' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Saved Workouts</Text>
            <Text style={styles.emptyStateDescription}>
              You haven't saved any workouts yet. Start by exploring our featured workouts or create your own.
            </Text>
            <Button
              title="Browse Workouts"
              onPress={() => setActiveTab('workouts')}
              style={styles.emptyStateButton}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 16,
    paddingBottom: 0,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  tabBar: {
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
  categoriesContainer: {
    paddingVertical: 8,
  },
  aiWorkoutContainer: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 24,
  },
  aiWorkoutCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  aiWorkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiWorkoutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginLeft: 8,
  },
  aiWorkoutDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  aiWorkoutButton: {
    alignSelf: 'flex-start',
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
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyStateButton: {
    marginTop: 8,
  },
});