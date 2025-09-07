import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Target,
  Calendar,
  TrendingUp,
  Award,
  Plus,
  CheckCircle,
  Edit3,
  Trash2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'nutrition' | 'wellness' | 'strength';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Lose 10 pounds',
    description: 'Reach my target weight for summer',
    category: 'fitness',
    targetValue: 10,
    currentValue: 6.5,
    unit: 'lbs',
    deadline: '2024-06-01',
    status: 'active',
    priority: 'high',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'Run 5K under 25 minutes',
    description: 'Improve my running speed and endurance',
    category: 'fitness',
    targetValue: 25,
    currentValue: 28,
    unit: 'minutes',
    deadline: '2024-03-15',
    status: 'active',
    priority: 'medium',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    title: 'Drink 8 glasses of water daily',
    description: 'Stay hydrated throughout the day',
    category: 'wellness',
    targetValue: 30,
    currentValue: 22,
    unit: 'days',
    deadline: '2024-02-29',
    status: 'active',
    priority: 'medium',
    createdAt: '2024-01-30',
  },
  {
    id: '4',
    title: 'Bench press 200 lbs',
    description: 'Increase my bench press strength',
    category: 'strength',
    targetValue: 200,
    currentValue: 185,
    unit: 'lbs',
    deadline: '2024-04-01',
    status: 'active',
    priority: 'high',
    createdAt: '2024-01-10',
  },
];

export default function GoalsScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState(mockGoals);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All Goals' },
    { key: 'fitness', label: 'Fitness' },
    { key: 'nutrition', label: 'Nutrition' },
    { key: 'wellness', label: 'Wellness' },
    { key: 'strength', label: 'Strength' },
  ];

  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === selectedCategory);

  const getProgress = (goal: Goal) => {
    if (goal.unit === 'minutes' && goal.category === 'fitness') {
      // For time-based goals where lower is better (like running time)
      const improvement = goal.targetValue - goal.currentValue;
      const totalImprovement = goal.targetValue - (goal.targetValue * 1.2); // Assume starting 20% higher
      return Math.max(0, Math.min(100, (improvement / Math.abs(totalImprovement)) * 100));
    }
    return Math.min(100, (goal.currentValue / goal.targetValue) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.status.error;
      case 'medium': return colors.status.warning;
      case 'low': return colors.status.success;
      default: return colors.text.secondary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return <TrendingUp size={16} color={colors.accent.primary} />;
      case 'nutrition': return <Target size={16} color={colors.status.success} />;
      case 'wellness': return <Award size={16} color={colors.status.warning} />;
      case 'strength': return <Target size={16} color={colors.status.error} />;
      default: return <Target size={16} color={colors.text.secondary} />;
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCompleteGoal = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, status: 'completed' as const, currentValue: goal.targetValue }
        : goal
    ));
    Alert.alert('Congratulations!', 'Goal completed! 🎉');
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setGoals(prev => prev.filter(goal => goal.id !== goalId))
        }
      ]
    );
  };

  const handleCreateGoal = () => {
    Alert.alert('Create Goal', 'Goal creation feature coming soon!');
  };

  const handleEditGoal = (goalId: string) => {
    Alert.alert('Edit Goal', `Edit goal ${goalId} feature coming soon!`);
  };

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Goals',
          headerRight: () => (
            <TouchableOpacity onPress={handleCreateGoal}>
              <Plus size={24} color={colors.accent.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <Card style={styles.statsCard}>
          <LinearGradient
            colors={['#1a1a2e', '#16213e']}
            style={styles.statsGradient}
          >
            <Text style={styles.statsTitle}>Your Progress</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{activeGoals.length}</Text>
                <Text style={styles.statLabel}>Active Goals</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedGoals.length}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.round(activeGoals.reduce((acc, goal) => acc + getProgress(goal), 0) / activeGoals.length || 0)}%
                </Text>
                <Text style={styles.statLabel}>Avg Progress</Text>
              </View>
            </View>
          </LinearGradient>
        </Card>

        {/* Category Filter */}
        <View style={styles.categoryFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.key && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category.key && styles.categoryButtonTextActive
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Goals List */}
        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Goals' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Goals`}
          </Text>
          
          {filteredGoals.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Target size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyTitle}>No Goals Yet</Text>
              <Text style={styles.emptyDescription}>
                Set your first goal and start your journey to success!
              </Text>
              <Button
                title="Create Goal"
                onPress={handleCreateGoal}
                style={styles.emptyButton}
              />
            </Card>
          ) : (
            filteredGoals.map((goal) => {
              const progress = getProgress(goal);
              const daysRemaining = getDaysRemaining(goal.deadline);
              
              return (
                <Card key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleRow}>
                      {getCategoryIcon(goal.category)}
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Badge
                        label={goal.priority}
                        variant="default"
                        size="small"
                        style={{ backgroundColor: getPriorityColor(goal.priority) }}
                      />
                    </View>
                    
                    <View style={styles.goalActions}>
                      <TouchableOpacity
                        style={styles.goalAction}
                        onPress={() => handleEditGoal(goal.id)}
                      >
                        <Edit3 size={16} color={colors.text.secondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.goalAction}
                        onPress={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 size={16} color={colors.status.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                  
                  <View style={styles.goalProgress}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressText}>
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </Text>
                      <Text style={styles.progressPercentage}>
                        {Math.round(progress)}%
                      </Text>
                    </View>
                    <ProgressBar progress={progress} />
                  </View>
                  
                  <View style={styles.goalFooter}>
                    <View style={styles.goalDeadline}>
                      <Calendar size={14} color={colors.text.secondary} />
                      <Text style={styles.goalDeadlineText}>
                        {daysRemaining > 0 
                          ? `${daysRemaining} days left`
                          : daysRemaining === 0
                          ? 'Due today'
                          : `${Math.abs(daysRemaining)} days overdue`
                        }
                      </Text>
                    </View>
                    
                    {goal.status === 'active' && progress < 100 && (
                      <TouchableOpacity
                        style={styles.completeButton}
                        onPress={() => handleCompleteGoal(goal.id)}
                      >
                        <CheckCircle size={16} color={colors.status.success} />
                        <Text style={styles.completeButtonText}>Mark Complete</Text>
                      </TouchableOpacity>
                    )}
                    
                    {goal.status === 'completed' && (
                      <View style={styles.completedBadge}>
                        <CheckCircle size={16} color={colors.status.success} />
                        <Text style={styles.completedText}>Completed</Text>
                      </View>
                    )}
                  </View>
                </Card>
              );
            })
          )}
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  statsCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  statsGradient: {
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  categoryFilter: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  categoryButtonActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  goalsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
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
  },
  emptyButton: {
    minWidth: 150,
  },
  goalCard: {
    marginBottom: 16,
    padding: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  goalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  goalAction: {
    padding: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  goalProgress: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalDeadline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  goalDeadlineText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
  },
  completeButtonText: {
    fontSize: 12,
    color: colors.status.success,
    fontWeight: '500',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    color: colors.status.success,
    fontWeight: '500',
  },
});