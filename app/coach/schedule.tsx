import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Clock, Plus, Users, ChevronLeft, ChevronRight } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

interface Session {
  id: string;
  clientName: string;
  clientImage: string;
  time: string;
  duration: number;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function CoachSchedule() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const sessions: Session[] = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      clientImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200',
      time: '09:00',
      duration: 60,
      type: 'Strength Training',
      status: 'scheduled',
    },
    {
      id: '2',
      clientName: 'Mike Rodriguez',
      clientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      time: '10:30',
      duration: 45,
      type: 'Nutrition Consultation',
      status: 'scheduled',
    },
    {
      id: '3',
      clientName: 'Emily Chen',
      clientImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
      time: '14:00',
      duration: 60,
      type: 'Injury Rehabilitation',
      status: 'scheduled',
    },
    {
      id: '4',
      clientName: 'David Park',
      clientImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
      time: '16:00',
      duration: 30,
      type: 'Progress Check-in',
      status: 'completed',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return colors.accent.primary;
      case 'completed': return colors.status.success;
      case 'cancelled': return colors.status.error;
      default: return colors.text.secondary;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/coach/schedule/add')}
        >
          <Plus size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.dateNavigation}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateDate('prev')}
        >
          <ChevronLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateDate('next')}
        >
          <ChevronRight size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.viewModeContainer}>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'day' && styles.viewModeButtonActive
          ]}
          onPress={() => setViewMode('day')}
        >
          <Text style={[
            styles.viewModeText,
            viewMode === 'day' && styles.viewModeTextActive
          ]}>
            Day
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'week' && styles.viewModeButtonActive
          ]}
          onPress={() => setViewMode('week')}
        >
          <Text style={[
            styles.viewModeText,
            viewMode === 'week' && styles.viewModeTextActive
          ]}>
            Week
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.sessionsList} showsVerticalScrollIndicator={false}>
        <View style={styles.sessionsHeader}>
          <Text style={styles.sessionsTitle}>
            {sessions.length} sessions today
          </Text>
        </View>

        {sessions.map((session) => (
          <TouchableOpacity
            key={session.id}
            style={styles.sessionCard}
            onPress={() => router.push(`/coach/session/${session.id}`)}
          >
            <Card style={styles.card}>
              <View style={styles.sessionHeader}>
                <View style={styles.timeContainer}>
                  <Clock size={16} color={colors.text.secondary} />
                  <Text style={styles.timeText}>{session.time}</Text>
                  <Text style={styles.durationText}>({session.duration}min)</Text>
                </View>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: getStatusColor(session.status) }
                ]} />
              </View>

              <View style={styles.sessionContent}>
                <Avatar
                  source={session.clientImage}
                  size="medium"
                  style={styles.clientAvatar}
                />
                <View style={styles.sessionDetails}>
                  <Text style={styles.clientName}>{session.clientName}</Text>
                  <Text style={styles.sessionType}>{session.type}</Text>
                  <Text style={styles.sessionStatus}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.sessionActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push(`/coach/messages/${session.id}`)}
                >
                  <Text style={styles.actionText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.primaryAction]}
                  onPress={() => router.push(`/coach/session/${session.id}`)}
                >
                  <Text style={[styles.actionText, styles.primaryActionText]}>
                    {session.status === 'scheduled' ? 'Start Session' : 'View Details'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        <View style={styles.emptySlots}>
          <Text style={styles.emptySlotsTitle}>Available Time Slots</Text>
          {['11:00', '12:30', '15:00', '17:30'].map((time) => (
            <TouchableOpacity
              key={time}
              style={styles.emptySlot}
              onPress={() => router.push(`/coach/schedule/add?time=${time}`)}
            >
              <Clock size={16} color={colors.text.secondary} />
              <Text style={styles.emptySlotText}>{time} - Available</Text>
              <Plus size={16} color={colors.accent.primary} />
            </TouchableOpacity>
          ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  viewModeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  viewModeButtonActive: {
    backgroundColor: colors.accent.primary,
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  viewModeTextActive: {
    color: colors.text.primary,
  },
  sessionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sessionsHeader: {
    marginBottom: 16,
  },
  sessionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  sessionCard: {
    marginBottom: 16,
  },
  card: {
    padding: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginLeft: 8,
  },
  durationText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sessionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  clientAvatar: {
    marginRight: 12,
  },
  sessionDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  sessionStatus: {
    fontSize: 12,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  sessionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  primaryAction: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  primaryActionText: {
    color: colors.text.primary,
  },
  emptySlots: {
    marginTop: 24,
    marginBottom: 20,
  },
  emptySlotsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
  },
  emptySlot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
  },
  emptySlotText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 12,
  },
});