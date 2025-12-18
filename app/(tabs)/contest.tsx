import React, { useMemo, useState, useCallback } from 'react';
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
  Trophy, 
  Calendar, 
  Timer, 
  Droplets, 
  Plus,
  Target,
  TrendingUp,
  Clock,
  Brain
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/colors';
import { useContestStore } from '@/store/contestStore';
import { useUserStore } from '@/store/userStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TabBar } from '@/components/ui/TabBar';

const { width } = Dimensions.get('window');

export default function ContestScreen() {
  const { user } = useUserStore();
  const { contestPreps, currentPrep, setCurrentPrep } = useContestStore();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'peak-week' | 'posing'>('overview');

  const isCoach = user?.role === 'coach';
  const userPreps = contestPreps.filter(prep => 
    isCoach ? prep.coachId === user?.id : prep.userId === user?.id
  );

  const handleCreatePrep = () => {
    router.push('/contest/create' as any);
  };

  const handleSelectPrep = (prep: typeof currentPrep) => {
    setCurrentPrep(prep);
  };

  const getDaysUntilContest = (contestDate: string) => {
    const today = new Date();
    const contest = new Date(contestDate);
    const diffTime = contest.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleTabChange = useCallback((key: string) => {
    console.log('[ContestScreen] Tab change', key);
    if (key === 'overview') {
      setSelectedTab('overview');
      return;
    }
    if (key === 'peak-week') {
      router.push('/contest/peak-week' as any);
      return;
    }
    if (key === 'posing') {
      router.push('/contest/posing' as any);
      return;
    }
    if (key === 'ai') {
      router.push('/contest/peak-week-ai' as any);
      return;
    }
  }, []);

  const contestTabs = useMemo(() => [
    { key: 'overview', label: 'Overview', icon: <Trophy size={16} color={colors.text.secondary} /> },
    { key: 'peak-week', label: 'Peak Week', icon: <Calendar size={16} color={colors.text.secondary} /> },
    { key: 'posing', label: 'Posing', icon: <Target size={16} color={colors.text.secondary} /> },
    { key: 'ai', label: 'Peak Week AI', icon: <Brain size={16} color={colors.text.secondary} /> },
  ], []);

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {currentPrep ? (
        <>
          <Card style={styles.contestCard}>
            <LinearGradient
              colors={['#1a1a2e', '#16213e']}
              style={styles.contestGradient}
            >
              <View style={styles.contestHeader}>
                <View style={styles.contestInfo}>
                  <Text style={styles.contestName}>{currentPrep.contestName}</Text>
                  <Text style={styles.contestDate}>
                    {new Date(currentPrep.contestDate).toLocaleDateString()}
                  </Text>
                  <Badge 
                    label={currentPrep.category.replace('-', ' ')} 
                    variant="default"
                    style={styles.categoryBadge}
                  />
                </View>
                <View style={styles.daysContainer}>
                  <Text style={styles.daysNumber}>
                    {getDaysUntilContest(currentPrep.contestDate)}
                  </Text>
                  <Text style={styles.daysLabel}>days to go</Text>
                </View>
              </View>
              
              <View style={styles.progressRow}>
                <View style={styles.progressItem}>
                  <Text style={styles.progressValue}>
                    {currentPrep.progress.currentWeight}kg
                  </Text>
                  <Text style={styles.progressLabel}>Current Weight</Text>
                </View>
                <View style={styles.progressItem}>
                  <Text style={styles.progressValue}>
                    {currentPrep.progress.currentBodyFat}%
                  </Text>
                  <Text style={styles.progressLabel}>Body Fat</Text>
                </View>
                <View style={styles.progressItem}>
                  <Text style={styles.progressValue}>
                    {currentPrep.weeksOut}
                  </Text>
                  <Text style={styles.progressLabel}>Weeks Out</Text>
                </View>
              </View>
            </LinearGradient>
          </Card>

          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/contest/dashboard')}
              testID="contest-action-dashboard"
            >
              <TrendingUp size={24} color={colors.accent.primary} />
              <Text style={styles.actionText}>Dashboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/contest/protocols')}
              testID="contest-action-protocols"
            >
              <Timer size={24} color={colors.accent.primary} />
              <Text style={styles.actionText}>Protocols</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/contest/peak-week')}
              testID="contest-action-peak-week"
            >
              <Calendar size={24} color={colors.accent.primary} />
              <Text style={styles.actionText}>Peak Week</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/contest/posing')}
              testID="contest-action-posing"
            >
              <Droplets size={24} color={colors.accent.primary} />
              <Text style={styles.actionText}>Posing</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/contest/peak-week-ai')}
              testID="contest-action-peak-week-ai"
            >
              <Brain size={24} color={colors.accent.primary} />
              <Text style={styles.actionText}>Peak Week AI</Text>
            </TouchableOpacity>
          </View>

          <Card style={styles.phaseCard}>
            <View style={styles.phaseHeader}>
              <Text style={styles.phaseTitle}>Current Phase</Text>
              <Badge 
                label={currentPrep.status} 
                variant="primary"
              />
            </View>
            <Text style={styles.phaseName}>{currentPrep.currentPhase.name}</Text>
            <Text style={styles.phaseGoals}>
              Goals: {currentPrep.currentPhase.goals.join(', ')}
            </Text>
            
            <View style={styles.macrosRow}>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{currentPrep.currentPhase.macros.calories}</Text>
                <Text style={styles.macroLabel}>Calories</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{currentPrep.currentPhase.macros.protein}g</Text>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{currentPrep.currentPhase.macros.carbs}g</Text>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{currentPrep.currentPhase.macros.fat}g</Text>
                <Text style={styles.macroLabel}>Fat</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.recentActivity}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityItem}>
              <Clock size={16} color={colors.text.secondary} />
              <Text style={styles.activityText}>Last posing session: 2 days ago</Text>
            </View>
            <View style={styles.activityItem}>
              <TrendingUp size={16} color={colors.text.secondary} />
              <Text style={styles.activityText}>Weight check-in: Yesterday</Text>
            </View>
            <View style={styles.activityItem}>
              <Calendar size={16} color={colors.text.secondary} />
              <Text style={styles.activityText}>Progress photos: 3 days ago</Text>
            </View>
          </Card>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Trophy size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Contest Prep Active</Text>
          <Text style={styles.emptyDescription}>
            Start your contest preparation journey with personalized protocols and tracking.
          </Text>
          <Button
            title="Create Contest Prep"
            onPress={handleCreatePrep}
            style={styles.createButton}
          />
          <TouchableOpacity
            style={[styles.actionButton, { width: '100%', marginTop: 12 }]}
            onPress={() => router.push('/contest/peak-week-ai')}
            testID="empty-try-peak-week-ai"
          >
            <Brain size={24} color={colors.accent.primary} />
            <Text style={styles.actionText}>Try Peak Week AI</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Contest Prep',
          headerRight: () => (
            <TouchableOpacity onPress={handleCreatePrep}>
              <Plus size={24} color={colors.accent.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} testID="contest-scroll">
        {userPreps.length > 0 && (
          <View style={styles.prepSelector}>
            <Text style={styles.selectorTitle}>
              {isCoach ? 'Client Preps' : 'Your Preps'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {userPreps.map((prep) => (
                <TouchableOpacity
                  key={prep.id}
                  style={[
                    styles.prepCard,
                    currentPrep?.id === prep.id && styles.prepCardActive
                  ]}
                  onPress={() => handleSelectPrep(prep)}
                >
                  <Text style={styles.prepCardName}>{prep.contestName}</Text>
                  <Text style={styles.prepCardDate}>
                    {getDaysUntilContest(prep.contestDate)} days
                  </Text>
                  <Badge 
                    label={prep.status} 
                    variant="default"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.topTabs}>
          <TabBar
            tabs={contestTabs}
            activeTab={selectedTab}
            onTabChange={handleTabChange}
            style={styles.tabBar}
          />
        </View>

        {renderOverview()}
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
  prepSelector: {
    padding: 20,
    paddingBottom: 10,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  prepCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 160,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  prepCardActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.primary + '10',
  },
  prepCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  prepCardDate: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  tabContent: {
    padding: 20,
  },
  topTabs: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  tabBar: {
    borderRadius: 12,
  },
  contestCard: {
    marginBottom: 20,
    overflow: 'hidden',
  },
  contestGradient: {
    padding: 20,
  },
  contestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  contestInfo: {
    flex: 1,
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
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  daysContainer: {
    alignItems: 'center',
  },
  daysNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.accent.primary,
  },
  daysLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 60) / 2,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 8,
  },
  phaseCard: {
    marginBottom: 20,
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  phaseName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  phaseGoals: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  macroLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  recentActivity: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  createButton: {
    minWidth: 200,
  },
});