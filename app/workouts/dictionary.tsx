import React, { useMemo, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Filter } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Input } from '@/components/ui/Input';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { popularExercises, workoutCategories } from '@/mocks/workouts';

const difficultyOptions = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export default function ExerciseDictionaryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(['all']);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categoryOptions = useMemo(() => {
    const base = [{ id: 'all', label: 'All Categories' }];
    const fromExercises = Array.from(
      new Set(popularExercises.map((e) => e.category ?? 'Other'))
    ).map((c) => ({ id: c, label: c }));
    const fromMocks = workoutCategories.map((c) => ({ id: c.name, label: c.name }));
    const map: Record<string, boolean> = {};
    const merged = [...base, ...fromExercises, ...fromMocks].filter((o) => {
      if (map[o.id]) return false;
      map[o.id] = true;
      return true;
    });
    return merged;
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return popularExercises.filter((ex) => {
      const matchQ = !q
        || ex.name.toLowerCase().includes(q)
        || ex.description.toLowerCase().includes(q)
        || ex.muscleGroups.join(' ').toLowerCase().includes(q)
        || ex.equipment.join(' ').toLowerCase().includes(q);
      const diffAllowed = selectedDifficulties.includes('all')
        || selectedDifficulties.includes(ex.difficulty);
      const cat = ex.category ?? 'Other';
      const catAllowed = selectedCategory === 'all' || selectedCategory === cat;
      return matchQ && diffAllowed && catAllowed;
    });
  }, [searchQuery, selectedDifficulties, selectedCategory]);

  const onExercisePress = useCallback((id: string) => {
    router.push(`/exercise/${id}`);
  }, [router]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Exercise Dictionary' }} />
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search name, muscle, equipment..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            inputStyle={styles.searchInputText}
            testID="search-input"
          />
          <TouchableOpacity style={styles.filterButton} accessibilityRole="button" testID="filter-button">
            <Filter size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rowChips}
        >
          <ChipGroup
            options={difficultyOptions}
            selectedIds={selectedDifficulties}
            onChange={setSelectedDifficulties}
            scrollable={false}
          />
        </ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rowChips}
        >
          <ChipGroup
            options={categoryOptions}
            selectedIds={[selectedCategory]}
            onChange={(ids) => setSelectedCategory(ids[ids.length - 1] ?? 'all')}
            scrollable={false}
          />
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultMeta} testID="result-count">{filtered.length} results</Text>
        <View style={styles.list}>
          {filtered.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onPress={() => onExercisePress(exercise.id)}
            />
          ))}
          {filtered.length === 0 && (
            <View style={styles.empty} testID="empty-state">
              <Text style={styles.emptyTitle}>No matches</Text>
              <Text style={styles.emptyText}>Try adjusting filters or search terms.</Text>
            </View>
          )}
        </View>
        <View style={styles.footerSpacer} />
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
    paddingTop: Platform.OS === 'web' ? 16 : 16,
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
  rowChips: {
    paddingVertical: 6,
  },
  content: {
    flex: 1,
  },
  resultMeta: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    color: colors.text.secondary,
    fontSize: 12,
  },
  list: {
    padding: 16,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  footerSpacer: {
    height: 24,
  },
});