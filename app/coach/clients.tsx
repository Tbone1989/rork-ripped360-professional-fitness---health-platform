import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Users, Plus, MessageSquare, Calendar, TrendingUp, Filter } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

interface Client {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  status: 'active' | 'inactive' | 'trial';
  joinDate: string;
  lastSession: string;
  totalSessions: number;
  plan: string;
  progress: number;
  nextSession?: string;
}

export default function CoachClients() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive' | 'trial'>('all');

  const clients: Client[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200',
      status: 'active',
      joinDate: '2024-01-15',
      lastSession: '2024-01-20',
      totalSessions: 24,
      plan: 'Premium Training',
      progress: 85,
      nextSession: '2024-01-22 09:00',
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      email: 'mike.r@email.com',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      status: 'active',
      joinDate: '2023-11-08',
      lastSession: '2024-01-19',
      totalSessions: 45,
      plan: 'Strength & Conditioning',
      progress: 92,
      nextSession: '2024-01-22 10:30',
    },
    {
      id: '3',
      name: 'Emily Chen',
      email: 'emily.c@email.com',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
      status: 'trial',
      joinDate: '2024-01-18',
      lastSession: '2024-01-19',
      totalSessions: 3,
      plan: 'Trial Package',
      progress: 30,
      nextSession: '2024-01-22 14:00',
    },
    {
      id: '4',
      name: 'David Park',
      email: 'david.p@email.com',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
      status: 'inactive',
      joinDate: '2023-09-12',
      lastSession: '2024-01-10',
      totalSessions: 18,
      plan: 'Basic Training',
      progress: 60,
    },
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || client.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.status.success;
      case 'trial': return colors.accent.primary;
      case 'inactive': return colors.text.secondary;
      default: return colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'trial': return 'Trial';
      case 'inactive': return 'Inactive';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Clients</Text>
        <Text style={styles.subtitle}>{clients.length} total clients</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.text.secondary}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/coach/add-client')}>
          <Plus size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        {(['all', 'active', 'trial', 'inactive'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.filterTextActive
            ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.clientsList} showsVerticalScrollIndicator={false}>
        {filteredClients.map((client) => (
          <TouchableOpacity
            key={client.id}
            style={styles.clientCard}
            onPress={() => router.push(`/coach/client/${client.id}`)}
          >
            <Card style={styles.card}>
              <View style={styles.clientHeader}>
                <View style={styles.clientInfo}>
                  <Avatar
                    source={client.profileImage}
                    size="large"
                    style={styles.avatar}
                  />
                  <View style={styles.clientDetails}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientEmail}>{client.email}</Text>
                    <Text style={styles.clientPlan}>{client.plan}</Text>
                  </View>
                </View>
                <View style={styles.clientStatus}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(client.status) }]}>
                    <Text style={[styles.statusText, { color: colors.text.primary }]}>
                      {getStatusText(client.status)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.clientStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{client.totalSessions}</Text>
                  <Text style={styles.statLabel}>Sessions</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{client.progress}%</Text>
                  <Text style={styles.statLabel}>Progress</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {new Date(client.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                  <Text style={styles.statLabel}>Joined</Text>
                </View>
              </View>

              {client.nextSession && (
                <View style={styles.nextSession}>
                  <Calendar size={16} color={colors.accent.primary} />
                  <Text style={styles.nextSessionText}>
                    Next: {new Date(client.nextSession).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
              )}

              <View style={styles.clientActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push(`/coach/messages/${client.id}`)}
                >
                  <MessageSquare size={18} color={colors.accent.primary} />
                  <Text style={styles.actionText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push(`/coach/schedule/${client.id}`)}
                >
                  <Calendar size={18} color={colors.accent.primary} />
                  <Text style={styles.actionText}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push(`/coach/progress/${client.id}`)}
                >
                  <TrendingUp size={18} color={colors.accent.primary} />
                  <Text style={styles.actionText}>Progress</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
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
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterButtonActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: colors.text.primary,
  },
  clientsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  clientCard: {
    marginBottom: 16,
  },
  card: {
    padding: 20,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  clientInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  clientPlan: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  clientStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  clientStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.light,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  nextSession: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: `${colors.accent.primary}10`,
    borderRadius: 8,
  },
  nextSessionText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  clientActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  actionText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '600',
    marginLeft: 6,
  },
});