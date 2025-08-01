import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Flame,
  Droplets,
  Activity,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ChipGroup } from '@/components/ui/ChipGroup';

const { width } = Dimensions.get('window');

interface DayData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  weight?: number;
}

interface WeeklyStats {
  avgCalories: number;
  avgProtein: number;
  avgWater: number;
  weightChange: number;
  streak: number;
}

const mockWeeklyData: DayData[] = [
  { date: '2024-01-15', calories: 2340, protein: 165, carbs: 280, fat: 78, water: 2800, weight: 75.2 },
  { date: '2024-01-16', calories: 2180, protein: 142, carbs: 245, fat: 82, water: 3200, weight: 75.1 },
  { date: '2024-01-17', calories: 2450, protein: 178, carbs: 290, fat: 85, water: 2900, weight: 75.0 },
  { date: '2024-01-18', calories: 2280, protein: 156, carbs: 265, fat: 79, water: 3100, weight: 74.9 },
  { date: '2024-01-19', calories: 2380, protein: 168, carbs: 275, fat: 81, water: 2750, weight: 74.8 },
  { date: '2024-01-20', calories: 2520, protein: 185, carbs: 295, fat: 88, water: 3300, weight: 74.7 },
  { date: '2024-01-21', calories: 2420, protein: 172, carbs: 285, fat: 84, water: 3000, weight: 74.6 }
];

const weeklyStats: WeeklyStats = {
  avgCalories: 2367,
  avgProtein: 167,
  avgWater: 3007,
  weightChange: -0.6,
  streak: 12
};

const goals = {
  calories: 2400,
  protein: 180,
  water: 3000,
  weight: 74.0
};

export default function MealProgressScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [currentWeek, setCurrentWeek] = useState(0);

  const periodOptions = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: '3months', label: '3 Months' }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getProgressColor = (current: number, goal: number) => {
    const percentage = current / goal;
    if (percentage >= 0.9) return colors.status.success;
    if (percentage >= 0.7) return colors.status.warning;
    return colors.status.error;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen 
        options={{ 
          title: 'Nutrition Progress',
        }} 
      />

      {/* Period Selector */}
      <View style={styles.periodSection}>
        <ChipGroup
          options={periodOptions}
          selectedIds={[selectedPeriod]}
          onChange={(ids) => setSelectedPeriod(ids[0] || 'week')}
          style={styles.periodChips}
        />
      </View>

      {/* Week Navigation */}
      <View style={styles.weekNavigation}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => setCurrentWeek(prev => prev - 1)}
        >
          <ChevronLeft size={20} color={colors.text.secondary} />
        </TouchableOpacity>
        
        <Text style={styles.weekTitle}>
          {currentWeek === 0 ? 'This Week' : `${Math.abs(currentWeek)} week${Math.abs(currentWeek) > 1 ? 's' : ''} ${currentWeek < 0 ? 'ago' : 'ahead'}`}
        </Text>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => setCurrentWeek(prev => prev + 1)}
          disabled={currentWeek >= 0}
        >
          <ChevronRight size={20} color={currentWeek >= 0 ? colors.text.tertiary : colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Weekly Overview */}
      <Card style={styles.overviewCard}>
        <Text style={styles.cardTitle}>Weekly Overview</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Flame size={20} color={colors.accent.primary} />
            </View>
            <Text style={styles.statValue}>{weeklyStats.avgCalories}</Text>
            <Text style={styles.statLabel}>Avg Calories</Text>
            <View style={styles.statChange}>
              <TrendingUp size={12} color={colors.status.success} />
              <Text style={[styles.changeText, { color: colors.status.success }]}>+5%</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Activity size={20} color={colors.accent.secondary} />
            </View>
            <Text style={styles.statValue}>{weeklyStats.avgProtein}g</Text>
            <Text style={styles.statLabel}>Avg Protein</Text>
            <View style={styles.statChange}>
              <TrendingDown size={12} color={colors.status.error} />
              <Text style={[styles.changeText, { color: colors.status.error }]}>-3%</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Droplets size={20} color={colors.status.info} />
            </View>
            <Text style={styles.statValue}>{weeklyStats.avgWater}ml</Text>
            <Text style={styles.statLabel}>Avg Water</Text>
            <View style={styles.statChange}>
              <TrendingUp size={12} color={colors.status.success} />
              <Text style={[styles.changeText, { color: colors.status.success }]}>+12%</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIcon}>
              <Target size={20} color={colors.status.warning} />
            </View>
            <Text style={styles.statValue}>{Math.abs(weeklyStats.weightChange)}kg</Text>
            <Text style={styles.statLabel}>Weight {weeklyStats.weightChange < 0 ? 'Lost' : 'Gained'}</Text>
            <View style={styles.statChange}>
              <Award size={12} color={colors.status.success} />
              <Text style={[styles.changeText, { color: colors.status.success }]}>Goal!</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Daily Progress */}
      <Card style={styles.dailyCard}>
        <Text style={styles.cardTitle}>Daily Progress</Text>
        
        <View style={styles.dailyList}>
          {mockWeeklyData.map((day, index) => (
            <View key={day.date} style={styles.dayItem}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayDate}>{formatDate(day.date)}</Text>
                {day.weight && (
                  <Text style={styles.dayWeight}>{day.weight}kg</Text>
                )}
              </View>
              
              <View style={styles.dayProgress}>
                <View style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Calories</Text>
                    <Text style={styles.progressValue}>{day.calories}/{goals.calories}</Text>
                  </View>
                  <ProgressBar 
                    progress={day.calories / goals.calories}
                    height={4}
                    color={getProgressColor(day.calories, goals.calories)}
                  />
                </View>
                
                <View style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Protein</Text>
                    <Text style={styles.progressValue}>{day.protein}g/{goals.protein}g</Text>
                  </View>
                  <ProgressBar 
                    progress={day.protein / goals.protein}
                    height={4}
                    color={getProgressColor(day.protein, goals.protein)}
                  />
                </View>
                
                <View style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Water</Text>
                    <Text style={styles.progressValue}>{day.water}ml/{goals.water}ml</Text>
                  </View>
                  <ProgressBar 
                    progress={day.water / goals.water}
                    height={4}
                    color={getProgressColor(day.water, goals.water)}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* Achievements */}
      <Card style={styles.achievementsCard}>
        <Text style={styles.cardTitle}>Achievements</Text>
        
        <View style={styles.achievements}>
          <View style={styles.achievement}>
            <View style={styles.achievementIcon}>
              <Award size={24} color={colors.status.warning} />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Consistency Streak</Text>
              <Text style={styles.achievementDescription}>{weeklyStats.streak} days in a row</Text>
            </View>
          </View>
          
          <View style={styles.achievement}>
            <View style={styles.achievementIcon}>
              <Target size={24} color={colors.status.success} />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Protein Goal</Text>
              <Text style={styles.achievementDescription}>Hit target 5/7 days this week</Text>
            </View>
          </View>
          
          <View style={styles.achievement}>
            <View style={styles.achievementIcon}>
              <Droplets size={24} color={colors.status.info} />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Hydration Hero</Text>
              <Text style={styles.achievementDescription}>Exceeded water goal 6/7 days</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Export Data"
          variant="outline"
          onPress={() => {}}
          style={styles.actionButton}
        />
        <Button
          title="Set Goals"
          onPress={() => router.push('/meals/goals')}
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  periodSection: {
    padding: 16,
  },
  periodChips: {
    marginBottom: 0,
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  overviewCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    width: (width - 80) / 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  dailyCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  dailyList: {
    gap: 16,
  },
  dayItem: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  dayWeight: {
    fontSize: 12,
    color: colors.text.secondary,
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dayProgress: {
    gap: 8,
  },
  progressItem: {
    gap: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.primary,
  },
  achievementsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  achievements: {
    gap: 16,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});