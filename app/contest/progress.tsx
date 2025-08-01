import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Stack, router } from 'expo-router';
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Target,
  ChevronRight,
  Award,
  Zap
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/colors';
import { useContestStore } from '@/store/contestStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

const { width } = Dimensions.get('window');

export default function ProgressTrackingScreen() {
  const { 
    currentPrep, 
    automatedProtocols,
    calorieCycleDays,
    cardioSessions,
    supplementReminders,
    progressPhotoReminders
  } = useContestStore();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  if (!currentPrep) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Progress Tracking' }} />
        <View style={styles.emptyState}>
          <BarChart3 size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Contest Prep Selected</Text>
          <Text style={styles.emptyDescription}>
            Please select a contest prep to view progress tracking.
          </Text>
        </View>
      </View>
    );
  }

  const activeProtocols = automatedProtocols.filter(
    p => p.contestPrepId === currentPrep.id && p.isActive
  );

  // Calculate stats based on selected period
  const getDateRange = () => {
    const now = new Date();
    const start = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setDate(now.getDate() - 30);
        break;
      case 'all':
        start.setTime(0);
        break;
    }
    
    return { start: start.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
  };

  const { start, end } = getDateRange();

  const periodCalorieDays = calorieCycleDays.filter(day => day.date >= start && day.date <= end);
  const periodCardio = cardioSessions.filter(session => session.date >= start && session.date <= end);
  const periodSupplements = supplementReminders.filter(reminder => reminder.date >= start && reminder.date <= end);
  const periodPhotos = progressPhotoReminders.filter(reminder => reminder.date >= start && reminder.date <= end);

  const getComplianceRate = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const calorieCompliance = getComplianceRate(
    periodCalorieDays.filter(d => d.completed).length,
    periodCalorieDays.length
  );

  const cardioCompliance = getComplianceRate(
    periodCardio.filter(c => c.completed).length,
    periodCardio.length
  );

  const supplementCompliance = getComplianceRate(
    periodSupplements.filter(s => s.taken).length,
    periodSupplements.length
  );

  const photoCompliance = getComplianceRate(
    periodPhotos.filter(p => p.completed).length,
    periodPhotos.length
  );

  const overallCompliance = [calorieCompliance, cardioCompliance, supplementCompliance, photoCompliance]
    .filter(rate => !isNaN(rate))
    .reduce((sum, rate, _, arr) => sum + rate / arr.length, 0);

  const renderOverviewCard = () => (
    <Card style={styles.overviewCard}>
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={styles.overviewGradient}
      >
        <View style={styles.overviewHeader}>
          <Text style={styles.overviewTitle}>Protocol Compliance</Text>
          <View style={styles.periodSelector}>
            {(['week', 'month', 'all'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive
                ]}>
                  {period === 'all' ? 'All Time' : `Last ${period}`}
                </Text>
              </TouchableOpacity>
            ))}\n          </View>
        </View>
        
        <View style={styles.complianceContainer}>
          <Text style={styles.compliancePercentage}>{Math.round(overallCompliance)}%</Text>
          <Text style={styles.complianceLabel}>Overall Compliance</Text>
        </View>
        
        <ProgressBar 
          progress={overallCompliance} 
          style={styles.progressBar}
          color="#ffffff"
          backgroundColor="rgba(255,255,255,0.3)"
        />
      </LinearGradient>
    </Card>
  );

  const renderProtocolStats = () => (
    <Card style={styles.statsCard}>
      <Text style={styles.statsTitle}>Protocol Performance</Text>
      
      <View style={styles.statsList}>
        {periodCalorieDays.length > 0 && (
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <TrendingUp size={20} color="#FF6B35" />
              <Text style={styles.statName}>Calorie Cycling</Text>
              <Text style={styles.statValue}>{Math.round(calorieCompliance)}%</Text>
            </View>
            <ProgressBar 
              progress={calorieCompliance} 
              style={styles.statProgress}
              color="#FF6B35"
            />
            <Text style={styles.statDetails}>
              {periodCalorieDays.filter(d => d.completed).length} of {periodCalorieDays.length} days completed
            </Text>
          </View>
        )}
        
        {periodCardio.length > 0 && (
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Calendar size={20} color="#45B7D1" />
              <Text style={styles.statName}>Cardio Sessions</Text>
              <Text style={styles.statValue}>{Math.round(cardioCompliance)}%</Text>
            </View>
            <ProgressBar 
              progress={cardioCompliance} 
              style={styles.statProgress}
              color="#45B7D1"
            />
            <Text style={styles.statDetails}>
              {periodCardio.filter(c => c.completed).length} of {periodCardio.length} sessions completed
            </Text>
          </View>
        )}
        
        {periodSupplements.length > 0 && (
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Target size={20} color="#96CEB4" />
              <Text style={styles.statName}>Supplements</Text>
              <Text style={styles.statValue}>{Math.round(supplementCompliance)}%</Text>
            </View>
            <ProgressBar 
              progress={supplementCompliance} 
              style={styles.statProgress}
              color="#96CEB4"
            />
            <Text style={styles.statDetails}>
              {periodSupplements.filter(s => s.taken).length} of {periodSupplements.length} doses taken
            </Text>
          </View>
        )}
        
        {periodPhotos.length > 0 && (
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Award size={20} color="#FFEAA7" />
              <Text style={styles.statName}>Progress Photos</Text>
              <Text style={styles.statValue}>{Math.round(photoCompliance)}%</Text>
            </View>
            <ProgressBar 
              progress={photoCompliance} 
              style={styles.statProgress}
              color="#FFEAA7"
            />
            <Text style={styles.statDetails}>
              {periodPhotos.filter(p => p.completed).length} of {periodPhotos.length} photo sessions completed
            </Text>
          </View>
        )}
      </View>
    </Card>
  );

  const renderActiveProtocols = () => (
    <Card style={styles.protocolsCard}>
      <View style={styles.protocolsHeader}>
        <Text style={styles.protocolsTitle}>Active Protocols</Text>
        <TouchableOpacity onPress={() => router.push('/contest/protocols')}>
          <ChevronRight size={20} color={colors.accent.primary} />
        </TouchableOpacity>
      </View>
      
      {activeProtocols.length === 0 ? (
        <View style={styles.noProtocols}>
          <Zap size={32} color={colors.text.tertiary} />
          <Text style={styles.noProtocolsText}>No active protocols</Text>
          <TouchableOpacity 
            style={styles.createProtocolButton}
            onPress={() => router.push('/contest/create-protocol')}
          >
            <Text style={styles.createProtocolText}>Create Protocol</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.protocolsList}>
          {activeProtocols.map((protocol) => (
            <View key={protocol.id} style={styles.protocolItem}>
              <View style={styles.protocolInfo}>
                <Text style={styles.protocolName}>{protocol.name}</Text>
                <Badge 
                  text={protocol.type.replace('-', ' ')} 
                  variant="secondary"
                  style={{ alignSelf: 'flex-start' }}
                />
              </View>
              <View style={styles.protocolStats}>
                <Text style={styles.protocolExecutions}>
                  {protocol.history.length} executions
                </Text>
                <Text style={styles.protocolFrequency}>
                  {protocol.schedule.frequency}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </Card>
  );

  const renderInsights = () => {
    const insights = [];
    
    if (overallCompliance >= 90) {
      insights.push("🎉 Excellent compliance! You're crushing your protocols.");
    } else if (overallCompliance >= 70) {
      insights.push("👍 Good compliance! Keep up the consistent effort.");
    } else if (overallCompliance >= 50) {
      insights.push("⚠️ Room for improvement. Focus on consistency.");
    } else {
      insights.push("🔄 Let's get back on track with your protocols.");
    }
    
    if (calorieCompliance < 70 && periodCalorieDays.length > 0) {
      insights.push("🍽️ Consider meal prep to improve calorie cycling adherence.");
    }
    
    if (cardioCompliance < 70 && periodCardio.length > 0) {
      insights.push("🏃‍♂️ Try scheduling cardio at consistent times to build the habit.");
    }
    
    if (supplementCompliance < 80 && periodSupplements.length > 0) {
      insights.push("💊 Set phone reminders for supplement timing.");
    }

    return (
      <Card style={styles.insightsCard}>
        <Text style={styles.insightsTitle}>Insights & Recommendations</Text>
        {insights.map((insight, index) => (
          <Text key={index} style={styles.insightText}>{insight}</Text>
        ))}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Progress Tracking' }} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderOverviewCard()}
        {renderProtocolStats()}
        {renderActiveProtocols()}
        {renderInsights()}
      </ScrollView>
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
  overviewCard: {
    margin: 20,
    overflow: 'hidden',
  },
  overviewGradient: {
    padding: 20,
  },
  overviewHeader: {
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  periodButtonText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
  complianceContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  compliancePercentage: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
  },
  complianceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  progressBar: {
    marginBottom: 8,
  },
  statsCard: {
    margin: 20,
    marginTop: 0,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  statsList: {
    gap: 20,
  },
  statItem: {
    marginBottom: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statProgress: {
    marginBottom: 4,
  },
  statDetails: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  protocolsCard: {
    margin: 20,
    marginTop: 0,
  },
  protocolsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  protocolsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  noProtocols: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noProtocolsText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
    marginBottom: 12,
  },
  createProtocolButton: {
    backgroundColor: colors.accent.primary + '20',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  createProtocolText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  protocolsList: {
    gap: 12,
  },
  protocolItem: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  protocolInfo: {
    flex: 1,
  },
  protocolName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  protocolStats: {
    alignItems: 'flex-end',
  },
  protocolExecutions: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  protocolFrequency: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  insightsCard: {
    margin: 20,
    marginTop: 0,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  insightText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
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