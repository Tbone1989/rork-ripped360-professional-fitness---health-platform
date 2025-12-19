import React, { useMemo, useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Filter, Calendar, MessageCircle, ClipboardList, RefreshCw } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TabBar } from '@/components/ui/TabBar';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { CoachCard } from '@/components/coaching/CoachCard';
import { Card } from '@/components/ui/Card';
import { trpc } from '@/lib/trpc';
import type { Coach } from '@/types/coaching';

const tabs = [
  { key: 'coaches', label: 'Coaches' },
  { key: 'sessions', label: 'My Sessions' },
  { key: 'messages', label: 'Messages' },
] as const;

type CoachingTabKey = (typeof tabs)[number]['key'];

const specialtyOptions = [
  { id: 'all', label: 'All Specialties' },
  { id: 'strength', label: 'Strength Training' },
  { id: 'crossfit', label: 'CrossFit' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'rehab', label: 'Rehabilitation' },
  { id: 'yoga', label: 'Yoga' },
] as const;

type ApiCoach = {
  id: string;
  userId: string;
  name: string;
  bio: string;
  specialties: string[];
  certifications: {
    id: string;
    name: string;
    organization: string;
    year: number;
    verified: boolean;
  }[];
  experience: number;
  rating: number;
  reviewCount: number;
  hourlyRate?: number;
  availability: any[];
  profileImageUrl: string;
  featured?: boolean;
  pricingVisibility: 'upfront' | 'after_engagement' | 'consultation_required';
  pricingNote?: string;
  packages?: {
    id: string;
    name: string;
    price?: number;
    duration: number;
    description: string;
  }[];
  pricingHidden?: boolean;
};

function toCoach(api: ApiCoach): Coach {
  const pricingVisibility: Coach['pricingVisibility'] =
    api.pricingVisibility === 'after_engagement' ? 'after_contact' : api.pricingVisibility;

  const hourlyRate = typeof api.hourlyRate === 'number' ? api.hourlyRate : 0;

  return {
    id: String(api.id),
    userId: String(api.userId),
    name: String(api.name),
    bio: String(api.bio ?? ''),
    specialties: Array.isArray(api.specialties) ? api.specialties.map((s) => String(s)) : [],
    certifications: Array.isArray(api.certifications)
      ? api.certifications.map((c) => ({
          id: String(c.id),
          name: String(c.name),
          organization: String(c.organization),
          year: Number(c.year),
          verified: Boolean(c.verified),
        }))
      : [],
    experience: Number(api.experience ?? 0),
    rating: Number(api.rating ?? 0),
    reviewCount: Number(api.reviewCount ?? 0),
    hourlyRate,
    availability: [],
    profileImageUrl: String(api.profileImageUrl ?? ''),
    coverImageUrl: String(api.profileImageUrl ?? ''),
    featured: Boolean(api.featured),
    pricingVisibility,
    consultationFee: undefined,
    packageDeals: Array.isArray(api.packages)
      ? api.packages.map((p) => ({
          id: String(p.id),
          name: String(p.name),
          description: String(p.description ?? ''),
          sessions: 1,
          duration: Number(p.duration ?? 0),
          price: typeof p.price === 'number' ? p.price : 0,
          features: [],
        }))
      : undefined,
  };
}

export default function CoachingScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CoachingTabKey>('coaches');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(['all']);

  const specialtyFilter = useMemo(() => {
    const first = selectedSpecialties[0];
    if (!first || first === 'all') return undefined;
    const match = specialtyOptions.find((o) => o.id === first);
    return match?.label;
  }, [selectedSpecialties]);

  const coachesQuery = trpc.coaching.list.useQuery(
    {
      specialty: specialtyFilter,
      featured: undefined,
      showPricing: true,
    },
    {
      enabled: activeTab === 'coaches',
      staleTime: 2 * 60 * 1000,
    }
  );

  const coaches: Coach[] = useMemo(() => {
    const raw = (coachesQuery.data as any)?.coaches as ApiCoach[] | undefined;
    const arr = Array.isArray(raw) ? raw : [];
    const mapped = arr.map(toCoach);

    if (!searchQuery.trim()) return mapped;
    const q = searchQuery.trim().toLowerCase();
    return mapped.filter((c) => {
      const name = c.name.toLowerCase();
      const specs = c.specialties.join(' ').toLowerCase();
      return name.includes(q) || specs.includes(q);
    });
  }, [coachesQuery.data, searchQuery]);

  const featuredCoaches = useMemo(() => coaches.filter((c) => c.featured), [coaches]);
  const allOtherCoaches = useMemo(() => coaches.filter((c) => !c.featured), [coaches]);

  const onCoachPress = useCallback(
    (coachId: string) => {
      console.log('[CoachingTab] open coach', coachId);
      router.push(`/coaching/${coachId}` as any);
    },
    [router]
  );

  return (
    <View style={styles.container} testID="coaching-container">
      <View style={styles.header} testID="coaching-header">
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search coaches..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            inputStyle={styles.searchInputText}
            testID="coaching-search"
          />
          <TouchableOpacity style={styles.filterButton} testID="coaching-filter-btn" accessibilityRole="button">
            <Filter size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <TabBar tabs={[...tabs]} activeTab={activeTab} onTabChange={(k) => setActiveTab(k as CoachingTabKey)} style={styles.tabBar} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} testID="coaching-scroll">
        {activeTab === 'coaches' && (
          <>
            <View style={styles.filterSection}>
              <ChipGroup
                options={[...specialtyOptions]}
                selectedIds={selectedSpecialties}
                onChange={setSelectedSpecialties}
                scrollable={true}
              />
            </View>

            {coachesQuery.isLoading && (
              <View style={styles.loading} testID="coaching-loading">
                <ActivityIndicator color={colors.accent.primary} />
                <Text style={styles.loadingText}>Loading coaches…</Text>
              </View>
            )}

            {coachesQuery.error && !coachesQuery.isLoading && (
              <Card style={styles.errorCard} testID="coaching-error">
                <Text style={styles.errorTitle}>Couldn’t load coaches</Text>
                <Text style={styles.errorBody}>Check your connection and try again.</Text>
                <Button
                  title="Retry"
                  onPress={() => coachesQuery.refetch()}
                  icon={<RefreshCw size={18} color={colors.text.primary} />}
                  testID="coaching-retry"
                />
              </Card>
            )}

            {!coachesQuery.isLoading && !coachesQuery.error && coaches.length === 0 && (
              <View style={styles.emptyState} testID="coaching-empty">
                <Text style={styles.emptyStateTitle}>No coaches found</Text>
                <Text style={styles.emptyStateDescription}>Try a different specialty or search.</Text>
              </View>
            )}

            {featuredCoaches.length > 0 && (
              <View style={styles.section} testID="coaching-featured">
                <Text style={styles.sectionTitle}>Featured Coaches</Text>
                {featuredCoaches.map((coach) => (
                  <CoachCard key={coach.id} coach={coach} onPress={() => onCoachPress(coach.id)} />
                ))}
              </View>
            )}

            {allOtherCoaches.length > 0 && (
              <View style={styles.section} testID="coaching-all">
                <Text style={styles.sectionTitle}>All Coaches</Text>
                {allOtherCoaches.map((coach) => (
                  <CoachCard key={coach.id} coach={coach} onPress={() => onCoachPress(coach.id)} />
                ))}
              </View>
            )}
          </>
        )}

        {activeTab === 'sessions' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <Card style={styles.quickActionsCard}>
                <TouchableOpacity
                  style={styles.quickActionItem}
                  onPress={() => router.push('/questionnaire/client-checkin' as any)}
                  activeOpacity={0.8}
                  testID="coaching-weekly-checkin"
                >
                  <View style={styles.quickActionIcon}>
                    <ClipboardList size={24} color={colors.accent.primary} />
                  </View>
                  <View style={styles.quickActionContent}>
                    <Text style={styles.quickActionTitle}>Weekly Check-in</Text>
                    <Text style={styles.quickActionDescription}>Complete your weekly progress check-in for your coach</Text>
                  </View>
                </TouchableOpacity>
              </Card>
            </View>

            <View style={styles.emptyState} testID="coaching-sessions-empty">
              <Calendar size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyStateTitle}>No Upcoming Sessions</Text>
              <Text style={styles.emptyStateDescription}>
                Book a session with one of our expert coaches.
              </Text>
              <Button title="Find a Coach" onPress={() => setActiveTab('coaches')} style={styles.emptyStateButton} testID="coaching-find-coach" />
            </View>
          </>
        )}

        {activeTab === 'messages' && (
          <View style={styles.emptyState} testID="coaching-messages-empty">
            <MessageCircle size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyStateTitle}>No Messages</Text>
            <Text style={styles.emptyStateDescription}>Start by messaging a coach from their profile.</Text>
            <Button title="Find a Coach" onPress={() => setActiveTab('coaches')} style={styles.emptyStateButton} testID="coaching-find-coach-2" />
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
  loading: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: colors.text.secondary,
    fontWeight: '600',
  },
  errorCard: {
    margin: 16,
    marginTop: 10,
    padding: 16,
    gap: 10,
  },
  errorTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  errorBody: {
    color: colors.text.secondary,
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
    marginTop: 16,
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
  quickActionsCard: {
    padding: 0,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.accent.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
