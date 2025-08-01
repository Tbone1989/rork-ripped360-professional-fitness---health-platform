import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, Calendar, MessageCircle } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TabBar } from '@/components/ui/TabBar';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { CoachCard } from '@/components/coaching/CoachCard';
import { Card } from '@/components/ui/Card';
import { allCoaches } from '@/mocks/coaches';

const tabs = [
  { key: 'coaches', label: 'Coaches' },
  { key: 'sessions', label: 'My Sessions' },
  { key: 'messages', label: 'Messages' },
];

const specialtyOptions = [
  { id: 'all', label: 'All Specialties' },
  { id: 'strength', label: 'Strength Training' },
  { id: 'crossfit', label: 'CrossFit' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'rehab', label: 'Rehabilitation' },
  { id: 'yoga', label: 'Yoga' },
];

export default function CoachingScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('coaches');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState(['all']);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search coaches..."
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
        {activeTab === 'coaches' && (
          <>
            <View style={styles.filterSection}>
              <ChipGroup
                options={specialtyOptions}
                selectedIds={selectedSpecialties}
                onChange={setSelectedSpecialties}
                scrollable={true}
              />
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Featured Coaches</Text>
              {allCoaches.filter(coach => coach.featured).map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>All Coaches</Text>
              {allCoaches.filter(coach => !coach.featured).map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))}
            </View>
          </>
        )}

        {activeTab === 'sessions' && (
          <View style={styles.emptyState}>
            <Calendar size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyStateTitle}>No Upcoming Sessions</Text>
            <Text style={styles.emptyStateDescription}>
              You don't have any coaching sessions scheduled. Book a session with one of our expert coaches.
            </Text>
            <Button
              title="Find a Coach"
              onPress={() => setActiveTab('coaches')}
              style={styles.emptyStateButton}
            />
          </View>
        )}

        {activeTab === 'messages' && (
          <View style={styles.emptyState}>
            <MessageCircle size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyStateTitle}>No Messages</Text>
            <Text style={styles.emptyStateDescription}>
              You don't have any active conversations. Start by messaging a coach.
            </Text>
            <Button
              title="Find a Coach"
              onPress={() => setActiveTab('coaches')}
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
});