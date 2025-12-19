import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Star, Award } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { CoachCard } from '@/components/coaching/CoachCard';
import { trpc } from '@/lib/trpc';
import type { Coach } from '@/types/coaching';

export default function CoachingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  const coachesQuery = trpc.coaching.list.useQuery({ showPricing: true });

  const coaches: Coach[] = useMemo(() => {
    const raw = (coachesQuery.data as any)?.coaches as any[] | undefined;
    const arr = Array.isArray(raw) ? raw : [];

    return arr.map((api) => {
      const pricingVisibility: Coach['pricingVisibility'] =
        api?.pricingVisibility === 'after_engagement'
          ? 'after_contact'
          : (api?.pricingVisibility as Coach['pricingVisibility']);

      const hourlyRate = typeof api?.hourlyRate === 'number' ? api.hourlyRate : 0;

      return {
        id: String(api?.id ?? ''),
        userId: String(api?.userId ?? ''),
        name: String(api?.name ?? ''),
        bio: String(api?.bio ?? ''),
        specialties: Array.isArray(api?.specialties) ? api.specialties.map((s: any) => String(s)) : [],
        certifications: Array.isArray(api?.certifications)
          ? api.certifications.map((c: any) => ({
              id: String(c?.id ?? ''),
              name: String(c?.name ?? ''),
              organization: String(c?.organization ?? ''),
              year: Number(c?.year ?? 0),
              verified: Boolean(c?.verified),
            }))
          : [],
        experience: Number(api?.experience ?? 0),
        rating: Number(api?.rating ?? 0),
        reviewCount: Number(api?.reviewCount ?? 0),
        hourlyRate,
        availability: Array.isArray(api?.availability) ? api.availability : [],
        profileImageUrl: String(api?.profileImageUrl ?? ''),
        coverImageUrl: String(api?.profileImageUrl ?? ''),
        featured: Boolean(api?.featured),
        pricingVisibility: pricingVisibility ?? 'upfront',
        consultationFee: undefined,
        packageDeals: Array.isArray(api?.packages)
          ? api.packages.map((p: any) => ({
              id: String(p?.id ?? ''),
              name: String(p?.name ?? ''),
              description: String(p?.description ?? ''),
              sessions: 1,
              duration: Number(p?.duration ?? 0),
              price: typeof p?.price === 'number' ? p.price : 0,
              features: [],
            }))
          : undefined,
      } as Coach;
    });
  }, [coachesQuery.data]);

  const specialties = useMemo(() => {
    const allSpecialties = coaches.flatMap((c: Coach) => c.specialties);
    const unique = Array.from(new Set(allSpecialties)).filter(Boolean);
    return ['all', ...unique];
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
      <ScrollView showsVerticalScrollIndicator={false} testID="coaching-find-scroll">
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

        {coachesQuery.isLoading && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 18 }} testID="coaching-find-loading">
            <Text style={{ color: colors.text.secondary, fontWeight: '700' as const }}>Loading coaches…</Text>
          </View>
        )}

        {coachesQuery.error && !coachesQuery.isLoading && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 18 }} testID="coaching-find-error">
            <Text style={{ color: colors.text.primary, fontWeight: '800' as const, marginBottom: 6 }}>Couldn’t load coaches</Text>
            <Text style={{ color: colors.text.secondary }}>Check your connection and try again.</Text>
          </View>
        )}

        {!coachesQuery.isLoading && !coachesQuery.error && coaches.length === 0 && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 18 }} testID="coaching-find-empty">
            <Text style={{ color: colors.text.primary, fontWeight: '800' as const, marginBottom: 6 }}>No coaches available</Text>
            <Text style={{ color: colors.text.secondary }}>Please try again in a moment.</Text>
          </View>
        )}

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
