import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Dimensions
} from 'react-native';
import { Stack, router } from 'expo-router';
import { 
  Calendar, 
  Droplets, 
  Zap, 
  Camera, 
  Plus,
  CheckCircle,
  Circle,
  TrendingUp,
  AlertTriangle
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/colors';
import { useContestStore } from '@/store/contestStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PeakWeekDay } from '@/types/contest';

const { width } = Dimensions.get('window');

export default function PeakWeekScreen() {
  const { currentPrep, updatePeakWeekDay } = useContestStore();
  const [selectedDay, setSelectedDay] = useState<PeakWeekDay | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);

  if (!currentPrep) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Peak Week Protocol' }} />
        <View style={styles.emptyState}>
          <Calendar size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Contest Prep Selected</Text>
          <Text style={styles.emptyDescription}>
            Please select a contest prep to view peak week protocols.
          </Text>
        </View>
      </View>
    );
  }

  const peakWeekDays = currentPrep.peakWeekProtocol?.days || [];
  const contestDate = new Date(currentPrep.contestDate);
  
  // Generate 7 days leading up to contest
  const generatePeakWeekDays = () => {
    const days = [];
    for (let i = 7; i >= 1; i--) {
      const date = new Date(contestDate);
      date.setDate(date.getDate() - i);
      
      const existingDay = peakWeekDays.find(d => d.day === i);
      days.push(existingDay || {
        day: i,
        date: date.toISOString(),
        photos: [],
        energy: 3,
        fullness: 3,
        vascularity: 3,
        conditioning: 3,
        notes: '',
        completed: false
      });
    }
    return days;
  };

  const days = generatePeakWeekDays();

  const handleDayPress = (day: PeakWeekDay) => {
    setSelectedDay(day);
    setShowDayModal(true);
  };

  const handleUpdateDay = (updates: Partial<PeakWeekDay>) => {
    if (!selectedDay) return;
    
    updatePeakWeekDay(currentPrep.id, {
      ...updates,
      day: selectedDay.day
    });
    
    setSelectedDay({ ...selectedDay, ...updates });
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return '#FF6B6B';
    if (rating <= 3) return '#FFE66D';
    return '#4ECDC4';
  };

  const getDayStatus = (day: PeakWeekDay) => {
    const dayDate = new Date(day.date);
    const today = new Date();
    
    if (dayDate > today) return 'upcoming';
    if (day.completed) return 'completed';
    return 'current';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'current': return colors.accent.primary;
      case 'upcoming': return colors.text.tertiary;
      default: return colors.text.tertiary;
    }
  };

  const renderDayCard = (day: PeakWeekDay) => {
    const status = getDayStatus(day);
    const statusColor = getStatusColor(status);
    
    return (
      <TouchableOpacity
        key={day.day}
        style={[styles.dayCard, { borderColor: statusColor }]}
        onPress={() => handleDayPress(day)}
      >
        <View style={styles.dayHeader}>
          <View style={styles.dayInfo}>
            <Text style={styles.dayNumber}>{day.day}</Text>
            <Text style={styles.dayLabel}>
              {day.day === 1 ? 'Contest Day' : `${day.day} Days Out`}
            </Text>
          </View>
          <View style={styles.dayStatus}>
            {day.completed ? (
              <CheckCircle size={20} color={colors.success} />
            ) : (
              <Circle size={20} color={colors.text.tertiary} />
            )}
          </View>
        </View>
        
        <Text style={styles.dayDate}>
          {new Date(day.date).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
        </Text>
        
        {day.weight && (
          <Text style={styles.dayWeight}>{day.weight}kg</Text>
        )}
        
        <View style={styles.ratingsRow}>
          <View style={styles.ratingItem}>
            <View style={[styles.ratingDot, { backgroundColor: getRatingColor(day.energy) }]} />
            <Text style={styles.ratingLabel}>Energy</Text>
          </View>
          <View style={styles.ratingItem}>
            <View style={[styles.ratingDot, { backgroundColor: getRatingColor(day.fullness) }]} />
            <Text style={styles.ratingLabel}>Fullness</Text>
          </View>
        </View>
        
        {day.photos.length > 0 && (
          <View style={styles.photoIndicator}>
            <Camera size={14} color={colors.text.secondary} />
            <Text style={styles.photoCount}>{day.photos.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderProtocolCard = () => {
    if (!currentPrep.peakWeekProtocol) {
      return (
        <Card style={styles.protocolCard}>
          <Text style={styles.protocolTitle}>Peak Week Protocol</Text>
          <Text style={styles.protocolDescription}>
            No peak week protocol has been set up yet. Create one to track water, sodium, and carb manipulation.
          </Text>
          <Button
            title="Create Protocol"
            onPress={() => router.push('/contest/protocol-setup')}
            style={styles.createProtocolButton}
          />
        </Card>
      );
    }

    const protocol = currentPrep.peakWeekProtocol;
    
    return (
      <Card style={styles.protocolCard}>
        <Text style={styles.protocolTitle}>Peak Week Protocol</Text>
        
        <View style={styles.protocolSection}>
          <Text style={styles.protocolSectionTitle}>Water Intake</Text>
          {protocol.waterIntake.map((water, index) => (
            <View key={index} style={styles.protocolItem}>
              <Text style={styles.protocolDay}>Day {water.day}:</Text>
              <Text style={styles.protocolValue}>{water.amount}L</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.protocolSection}>
          <Text style={styles.protocolSectionTitle}>Sodium Manipulation</Text>
          {protocol.sodiumManipulation.map((sodium, index) => (
            <View key={index} style={styles.protocolItem}>
              <Text style={styles.protocolDay}>Day {sodium.day}:</Text>
              <Text style={styles.protocolValue}>{sodium.amount}mg</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.editProtocolButton}
          onPress={() => router.push('/contest/protocol-setup')}
        >
          <Text style={styles.editProtocolText}>Edit Protocol</Text>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Peak Week Protocol',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/contest/protocol-setup')}>
              <Plus size={24} color={colors.accent.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.contestName}>{currentPrep.contestName}</Text>
          <Text style={styles.contestDate}>
            Contest: {new Date(currentPrep.contestDate).toLocaleDateString()}
          </Text>
        </View>

        {renderProtocolCard()}

        <View style={styles.daysContainer}>
          <Text style={styles.sectionTitle}>Daily Tracking</Text>
          <View style={styles.daysGrid}>
            {days.map(renderDayCard)}
          </View>
        </View>

        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <AlertTriangle size={20} color={colors.warning} />
            <Text style={styles.tipsTitle}>Peak Week Tips</Text>
          </View>
          <Text style={styles.tipText}>
            • Take progress photos at the same time each day
          </Text>
          <Text style={styles.tipText}>
            • Monitor energy levels and muscle fullness closely
          </Text>
          <Text style={styles.tipText}>
            • Stay consistent with your protocol
          </Text>
          <Text style={styles.tipText}>
            • Communicate with your coach about any concerns
          </Text>
        </Card>
      </ScrollView>

      {/* Day Detail Modal would go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  contestName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  contestDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  protocolCard: {
    margin: 20,
    marginTop: 10,
  },
  protocolTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  protocolDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  createProtocolButton: {
    alignSelf: 'flex-start',
  },
  protocolSection: {
    marginBottom: 16,
  },
  protocolSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  protocolItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  protocolDay: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  protocolValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  editProtocolButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  editProtocolText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  daysContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    width: (width - 60) / 2,
    marginBottom: 12,
    borderWidth: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dayInfo: {
    flex: 1,
  },
  dayNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
  },
  dayLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  dayStatus: {
    marginLeft: 8,
  },
  dayDate: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  dayWeight: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.primary,
    marginBottom: 8,
  },
  ratingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  ratingLabel: {
    fontSize: 10,
    color: colors.text.tertiary,
  },
  photoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  photoCount: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  tipsCard: {
    margin: 20,
    marginTop: 0,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 6,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});