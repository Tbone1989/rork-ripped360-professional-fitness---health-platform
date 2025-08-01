import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, Calendar, MessageSquare, TrendingUp, Award, Clock } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CoachDashboard() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const stats = [
    { label: 'Active Clients', value: '24', icon: Users, color: colors.accent.primary },
    { label: 'Sessions Today', value: '8', icon: Calendar, color: '#10B981' },
    { label: 'Unread Messages', value: '12', icon: MessageSquare, color: '#F59E0B' },
    { label: 'Revenue This Month', value: '$4,280', icon: TrendingUp, color: '#8B5CF6' },
  ];

  const upcomingSessions = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      time: '9:00 AM',
      type: 'Strength Training',
      duration: '60 min',
    },
    {
      id: '2',
      clientName: 'Mike Rodriguez',
      time: '10:30 AM',
      type: 'Nutrition Consultation',
      duration: '45 min',
    },
    {
      id: '3',
      clientName: 'Emily Chen',
      time: '2:00 PM',
      type: 'Injury Rehabilitation',
      duration: '60 min',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'session_completed',
      message: 'Completed session with John Doe',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'new_client',
      message: 'New client registration: Lisa Park',
      time: '4 hours ago',
    },
    {
      id: '3',
      type: 'message_received',
      message: 'Message from Alex Thompson',
      time: '6 hours ago',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Coach Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back, Coach!</Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <View style={styles.statContent}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today&apos;s Sessions</Text>
          <TouchableOpacity onPress={() => router.push('/coach/schedule')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {upcomingSessions.map((session) => (
          <TouchableOpacity 
            key={session.id} 
            style={styles.sessionItem}
            onPress={() => router.push(`/coach/session/${session.id}`)}
          >
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionClient}>{session.clientName}</Text>
              <Text style={styles.sessionType}>{session.type}</Text>
            </View>
            <View style={styles.sessionTime}>
              <View style={styles.timeContainer}>
                <Clock size={16} color={colors.text.secondary} />
                <Text style={styles.sessionTimeText}>{session.time}</Text>
              </View>
              <Text style={styles.sessionDuration}>{session.duration}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Card>

      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/coach/clients')}
          >
            <Users size={24} color={colors.accent.primary} />
            <Text style={styles.actionText}>Manage Clients</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/coach/schedule')}
          >
            <Calendar size={24} color={colors.accent.primary} />
            <Text style={styles.actionText}>Schedule</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/coach/messages')}
          >
            <MessageSquare size={24} color={colors.accent.primary} />
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/coach/rehab')}
          >
            <Award size={24} color={colors.accent.primary} />
            <Text style={styles.actionText}>Rehab Programs</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        
        {recentActivity.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
              <Text style={styles.activityMessage}>{activity.message}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 12,
    padding: 16,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionClient: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  sessionTime: {
    alignItems: 'flex-end',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sessionTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 4,
  },
  sessionDuration: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent.primary,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});