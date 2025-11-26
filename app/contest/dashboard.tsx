import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions
} from 'react-native';
import { Stack, router } from 'expo-router';
import { 
  Calendar, 
  TrendingUp, 
  Pill, 
  Camera,
  CheckCircle,
  Circle,
  Clock,
  Zap,
  BarChart3,
  Target
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/colors';
import { useContestStore } from '@/store/contestStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

const { width } = Dimensions.get('window');

export default function ProtocolDashboardScreen() {
  const { 
    currentPrep, 
    automatedProtocols,
    calorieCycleDays,
    cardioSessions,
    supplementReminders,
    progressPhotoReminders,
    updateCalorieCycleDay,
    updateCardioSession,
    updateSupplementReminder,
    updateProgressPhotoReminder
  } = useContestStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  if (!currentPrep) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Protocol Dashboard' }} />
        <View style={styles.emptyState}>
          <BarChart3 size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Contest Prep Selected</Text>
          <Text style={styles.emptyDescription}>
            Please select a contest prep to view your protocol dashboard.
          </Text>
        </View>
      </View>
    );
  }

  const activeProtocols = automatedProtocols.filter(
    p => p.contestPrepId === currentPrep.id && p.isActive
  );

  const todaysCalorieCycle = calorieCycleDays.find(day => day.date === selectedDate);
  const todaysCardio = cardioSessions.filter(session => session.date === selectedDate);
  const todaysSupplements = supplementReminders.filter(reminder => reminder.date === selectedDate);
  const todaysPhotos = progressPhotoReminders.filter(reminder => reminder.date === selectedDate);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getCompletionRate = () => {
    const totalTasks = [
      todaysCalorieCycle ? 1 : 0,
      todaysCardio.length,
      todaysSupplements.length,
      todaysPhotos.length
    ].reduce((a, b) => a + b, 0);

    const completedTasks = [
      todaysCalorieCycle?.completed ? 1 : 0,
      todaysCardio.filter(c => c.completed).length,
      todaysSupplements.filter(s => s.taken).length,
      todaysPhotos.filter(p => p.completed).length
    ].reduce((a, b) => a + b, 0);

    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  const renderOverviewCard = () => {
    const completionRate = getCompletionRate();
    
    return (
      <Card style={styles.overviewCard}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.overviewGradient}
        >
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>Today's Progress</Text>
            <Text style={styles.overviewDate}>
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          
          <View style={styles.completionContainer}>
            <Text style={styles.completionPercentage}>{Math.round(completionRate)}%</Text>
            <Text style={styles.completionLabel}>Complete</Text>
          </View>
          
          <ProgressBar 
            progress={completionRate} 
            style={styles.progressBar}
            color="#ffffff"
            backgroundColor="rgba(255,255,255,0.3)"
          />
          
          <View style={styles.overviewStats}>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewStatValue}>{activeProtocols.length}</Text>
              <Text style={styles.overviewStatLabel}>Active Protocols</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewStatValue}>
                {[todaysCardio.length, todaysSupplements.length, todaysPhotos.length].reduce((a, b) => a + b, 0)}
              </Text>
              <Text style={styles.overviewStatLabel}>Tasks Today</Text>
            </View>
          </View>
        </LinearGradient>
      </Card>
    );
  };

  const renderCalorieCycleCard = () => {
    if (!todaysCalorieCycle) return null;
    
    return (
      <Card style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleRow}>
            <TrendingUp size={20} color="#FF6B35" />
            <Text style={styles.taskTitle}>Calorie Cycling</Text>
          </View>
          <TouchableOpacity
            onPress={() => updateCalorieCycleDay(selectedDate, { completed: !todaysCalorieCycle.completed })}
          >
            {todaysCalorieCycle.completed ? (
              <CheckCircle size={24} color={colors.status.success} />
            ) : (
              <Circle size={24} color={colors.text.tertiary} />
            )}
          </TouchableOpacity>
        </View>
        
        <Badge 
          label={`${todaysCalorieCycle.type} day`} 
          variant="secondary"
          style={{ 
            backgroundColor: todaysCalorieCycle.type === 'high' ? '#4ECDC4' : 
                            todaysCalorieCycle.type === 'medium' ? '#FFE66D' : '#FF6B6B',
            alignSelf: 'flex-start',
            marginBottom: 12
          }}
        />
        
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{todaysCalorieCycle.calories}</Text>
            <Text style={styles.macroLabel}>Calories</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{todaysCalorieCycle.macros.protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{todaysCalorieCycle.macros.carbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{todaysCalorieCycle.macros.fat}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>
        
        {todaysCalorieCycle.actualIntake && (
          <View style={styles.actualIntake}>
            <Text style={styles.actualIntakeTitle}>Actual Intake</Text>
            <Text style={styles.actualIntakeValue}>
              {todaysCalorieCycle.actualIntake.calories} cal | 
              P: {todaysCalorieCycle.actualIntake.protein}g | 
              C: {todaysCalorieCycle.actualIntake.carbs}g | 
              F: {todaysCalorieCycle.actualIntake.fat}g
            </Text>
          </View>
        )}
      </Card>
    );
  };

  const renderCardioCard = () => {
    if (todaysCardio.length === 0) return null;
    
    return (
      <Card style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleRow}>
            <Calendar size={20} color="#45B7D1" />
            <Text style={styles.taskTitle}>Cardio Sessions</Text>
          </View>
          <Text style={styles.taskCount}>{todaysCardio.filter(c => c.completed).length}/{todaysCardio.length}</Text>
        </View>
        
        {todaysCardio.map((session) => (
          <View key={session.id} style={styles.cardioSession}>
            <View style={styles.cardioInfo}>
              <Text style={styles.cardioType}>{session.type.toUpperCase()}</Text>
              <Text style={styles.cardioDuration}>{session.duration} min</Text>
              <Badge 
                label={session.intensity} 
                variant="secondary"
                style={{ 
                  backgroundColor: session.intensity === 'high' ? '#FF6B35' : 
                                  session.intensity === 'moderate' ? '#FFE66D' : '#4ECDC4'
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => updateCardioSession(session.id, { completed: !session.completed })}
            >
              {session.completed ? (
                <CheckCircle size={20} color={colors.status.success} />
              ) : (
                <Circle size={20} color={colors.text.tertiary} />
              )}
            </TouchableOpacity>
          </View>
        ))}
      </Card>
    );
  };

  const renderSupplementCard = () => {
    if (todaysSupplements.length === 0) return null;
    
    return (
      <Card style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleRow}>
            <Pill size={20} color="#96CEB4" />
            <Text style={styles.taskTitle}>Supplements</Text>
          </View>
          <Text style={styles.taskCount}>{todaysSupplements.filter(s => s.taken).length}/{todaysSupplements.length}</Text>
        </View>
        
        {todaysSupplements.map((supplement) => (
          <View key={supplement.id} style={styles.supplementItem}>
            <View style={styles.supplementInfo}>
              <Text style={styles.supplementName}>{supplement.name}</Text>
              <Text style={styles.supplementDetails}>{supplement.dosage} at {supplement.time}</Text>
            </View>
            <TouchableOpacity
              onPress={() => updateSupplementReminder(supplement.id, { taken: !supplement.taken })}
            >
              {supplement.taken ? (
                <CheckCircle size={20} color={colors.status.success} />
              ) : (
                <Circle size={20} color={colors.text.tertiary} />
              )}
            </TouchableOpacity>
          </View>
        ))}
      </Card>
    );
  };

  const renderProgressPhotoCard = () => {
    if (todaysPhotos.length === 0) return null;
    
    return (
      <Card style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleRow}>
            <Camera size={20} color="#FFEAA7" />
            <Text style={styles.taskTitle}>Progress Photos</Text>
          </View>
          <Text style={styles.taskCount}>{todaysPhotos.filter(p => p.completed).length}/{todaysPhotos.length}</Text>
        </View>
        
        {todaysPhotos.map((photo) => (
          <View key={photo.id} style={styles.photoItem}>
            <View style={styles.photoInfo}>
              <Text style={styles.photoTime}>Reminder: {photo.time}</Text>
              <Text style={styles.photoPoses}>Poses: {photo.poses.join(', ')}</Text>
            </View>
            <TouchableOpacity
              onPress={() => updateProgressPhotoReminder(photo.id, { completed: !photo.completed })}
            >
              {photo.completed ? (
                <CheckCircle size={20} color={colors.status.success} />
              ) : (
                <Circle size={20} color={colors.text.tertiary} />
              )}
            </TouchableOpacity>
          </View>
        ))}
      </Card>
    );
  };

  const renderQuickActions = () => (
    <Card style={styles.quickActionsCard}>
      <Text style={styles.quickActionsTitle}>Quick Actions</Text>
      
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => router.push('/contest/protocols')}
        >
          <Zap size={24} color={colors.accent.primary} />
          <Text style={styles.quickActionText}>Manage Protocols</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => router.push('/meals/log')}
        >
          <Target size={24} color="#FF6B35" />
          <Text style={styles.quickActionText}>Log Meals</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => router.push('/contest/progress')}
        >
          <BarChart3 size={24} color="#4ECDC4" />
          <Text style={styles.quickActionText}>View Progress</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={() => router.push('/contest/create-protocol')}
        >
          <Clock size={24} color="#96CEB4" />
          <Text style={styles.quickActionText}>New Protocol</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Protocol Dashboard' }} />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderOverviewCard()}
        {renderCalorieCycleCard()}
        {renderCardioCard()}
        {renderSupplementCard()}
        {renderProgressPhotoCard()}
        {renderQuickActions()}
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
    marginBottom: 4,
  },
  overviewDate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  completionContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  completionPercentage: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
  },
  completionLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  progressBar: {
    marginBottom: 20,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  overviewStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  taskCard: {
    margin: 20,
    marginTop: 0,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  taskCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  macroLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  actualIntake: {
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
  },
  actualIntakeTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  actualIntakeValue: {
    fontSize: 14,
    color: colors.text.primary,
  },
  cardioSession: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  cardioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardioType: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.primary,
  },
  cardioDuration: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  supplementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  supplementInfo: {
    flex: 1,
  },
  supplementName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  supplementDetails: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  photoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  photoInfo: {
    flex: 1,
  },
  photoTime: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  photoPoses: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  quickActionsCard: {
    margin: 20,
    marginTop: 0,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 80) / 2,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 8,
    textAlign: 'center',
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