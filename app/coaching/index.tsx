import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Star, Award } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { CoachCard } from '@/components/coaching/CoachCard';
import { allCoaches } from '@/mocks/coaches';
import { trpc } from '@/lib/trpc';
import type { Coach } from '@/types/coaching';

export default function CoachingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  const coachesQuery = trpc.coaching.list.useQuery({});
  const coaches: Coach[] = (coachesQuery.data?.coaches as Coach[]) ?? allCoaches;

  const specialties = useMemo(() => {
    const allSpecialties = coaches.flatMap((c: Coach) => c.specialties);
    return ['all', ...Array.from(new Set(allSpecialties))];
  }, [coaches]);

  const filteredCoaches = useMemo(() => {
    let filtered = coaches;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c: Coach) =>
          c.name.toLowerCase().includes(query) ||
          c.bio.toLowerCase().includes(query) ||
          c.specialties.some((s: string) => s.toLowerCase().includes(query))
      );
    }

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter((c: Coach) => c.specialties.includes(selectedSpecialty));
    }

    return filtered.sort((a: Coach, b: Coach) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
  }, [coaches, searchQuery, selectedSpecialty]);

  const featuredCoaches = useMemo(
    () => filteredCoaches.filter((c: Coach) => c.featured),
    [filteredCoaches]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} testID="coaching-container">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Find Your Coach</Text>
          <Text style={styles.subtitle}>
            Connect with certified professionals to reach your fitness goals
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.text.tertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search coaches..."
              placeholderTextColor={colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="search-input"
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {specialties.map((specialty: string) => (
            <TouchableOpacity
              key={specialty}
              style={[
                styles.filterChip,
                selectedSpecialty === specialty && styles.filterChipActive,
              ]}
              onPress={() => setSelectedSpecialty(specialty)}
              testID={`filter-${specialty}`}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedSpecialty === specialty && styles.filterChipTextActive,
                ]}
              >
                {specialty === 'all' ? 'All' : specialty}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {featuredCoaches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Award size={20} color={colors.accent.primary} />
              <Text style={styles.sectionTitle}>Featured Coaches</Text>
            </View>
            {featuredCoaches.map((coach: Coach) => (
              <CoachCard
                key={coach.id}
                coach={coach}
                onPress={() => router.push(`/coaching/${coach.id}`)}
              />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Star size={20} color={colors.accent.primary} />
            <Text style={styles.sectionTitle}>
              {selectedSpecialty === 'all' ? 'All Coaches' : `${selectedSpecialty} Coaches`}
            </Text>
          </View>
          {filteredCoaches.filter((c: Coach) => !c.featured).length > 0 ? (
            filteredCoaches
              .filter((c: Coach) => !c.featured)
              .map((coach: Coach) => (
                <CoachCard
                  key={coach.id}
                  coach={coach}
                  onPress={() => router.push(`/coaching/${coach.id}`)}
                />
              ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No coaches found matching your criteria
              </Text>
            </View>
          )}
        </View>
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
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  filterContainer: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterChipActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  filterChipTextActive: {
    color: colors.text.primary,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text.primary,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
