import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Smartphone, 
  UtensilsCrossed, 
  Heart, 
  Battery, 
  Wifi, 
  Sun, 
  Moon,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useWellnessStore } from '@/store/wellnessStore';

export default function TestingScreen() {
  const router = useRouter();
  const { gymTestingScenarios, nutritionTestScenarios } = useWellnessStore();

  // Calculate test completion stats
  const gymTestsCompleted = gymTestingScenarios.reduce((total, scenario) => 
    total + scenario.testCases.filter(tc => tc.status !== 'pending').length, 0
  );
  const totalGymTests = gymTestingScenarios.reduce((total, scenario) => 
    total + scenario.testCases.length, 0
  );
  
  const nutritionTestsCompleted = nutritionTestScenarios.reduce((total, scenario) => 
    total + scenario.testCases.filter(tc => tc.status !== 'pending').length, 0
  );
  const totalNutritionTests = nutritionTestScenarios.reduce((total, scenario) => 
    total + scenario.testCases.length, 0
  );

  const gymProgress = totalGymTests > 0 ? gymTestsCompleted / totalGymTests : 0;
  const nutritionProgress = totalNutritionTests > 0 ? nutritionTestsCompleted / totalNutritionTests : 0;

  const testingScenarios = [
    {
      id: 'gym',
      title: 'Gym Environment',
      description: 'Test app performance during actual workouts',
      icon: <Smartphone size={24} color={colors.accent.primary} />,
      progress: gymProgress,
      completed: gymTestsCompleted,
      total: totalGymTests,
      route: '/testing/gym-environment',
      features: ['Screen visibility', 'Touch responsiveness', 'Battery usage', 'Performance monitoring']
    },
    {
      id: 'nutrition',
      title: 'Nutrition Scenarios',
      description: 'Test meal logging and nutrition tracking',
      icon: <UtensilsCrossed size={24} color={colors.status.success} />,
      progress: nutritionProgress,
      completed: nutritionTestsCompleted,
      total: totalNutritionTests,
      route: '/testing/nutrition-scenarios',
      features: ['Meal prep logging', 'Restaurant scanning', 'Supplement timing', 'Hydration tracking']
    },
    {
      id: 'wellness',
      title: 'Wellness Tracking',
      description: 'Monitor sleep, stress, and recovery metrics',
      icon: <Heart size={24} color={colors.status.info} />,
      progress: 0.3, // Mock progress
      completed: 12,
      total: 40,
      route: '/testing/wellness-tracking',
      features: ['Sleep quality', 'Stress levels', 'Recovery metrics', 'Hormone tracking']
    }
  ];

  const systemChecks = [
    { name: 'Battery Optimization', status: 'good', icon: <Battery size={16} color={colors.status.success} /> },
    { name: 'Network Performance', status: 'good', icon: <Wifi size={16} color={colors.status.success} /> },
    { name: 'Screen Brightness', status: 'warning', icon: <Sun size={16} color={colors.status.warning} /> },
    { name: 'Background Sync', status: 'good', icon: <Activity size={16} color={colors.status.success} /> }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Real-World Testing</Text>
        <Text style={styles.headerSubtitle}>
          Test app performance in actual usage scenarios
        </Text>
      </View>

      {/* System Status */}
      <Card style={styles.systemCard}>
        <Text style={styles.sectionTitle}>System Status</Text>
        
        <View style={styles.systemChecks}>
          {systemChecks.map((check, index) => (
            <View key={index} style={styles.systemCheck}>
              {check.icon}
              <Text style={styles.systemCheckName}>{check.name}</Text>
              <View style={[
                styles.systemCheckStatus,
                check.status === 'good' && styles.statusGood,
                check.status === 'warning' && styles.statusWarning,
                check.status === 'error' && styles.statusError
              ]} />
            </View>
          ))}
        </View>
      </Card>

      {/* Testing Scenarios */}
      <View style={styles.scenariosSection}>
        <Text style={styles.sectionTitle}>Testing Scenarios</Text>
        
        {testingScenarios.map((scenario) => (
          <Card key={scenario.id} style={styles.scenarioCard}>
            <TouchableOpacity 
              style={styles.scenarioContent}
              onPress={() => router.push(scenario.route as any)}
            >
              <View style={styles.scenarioHeader}>
                <View style={styles.scenarioIcon}>
                  {scenario.icon}
                </View>
                
                <View style={styles.scenarioInfo}>
                  <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                  <Text style={styles.scenarioDescription}>{scenario.description}</Text>
                </View>
                
                <View style={styles.scenarioProgress}>
                  <Text style={styles.progressText}>
                    {scenario.completed}/{scenario.total}
                  </Text>
                  <Text style={styles.progressLabel}>tests</Text>
                </View>
              </View>
              
              <ProgressBar 
                progress={scenario.progress} 
                height={6} 
                style={styles.progressBar}
              />
              
              <View style={styles.scenarioFeatures}>
                {scenario.features.map((feature, index) => (
                  <View key={index} style={styles.featureTag}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      {/* Quick Stats */}
      <Card style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Testing Overview</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <CheckCircle size={20} color={colors.status.success} />
            <Text style={styles.statValue}>{gymTestsCompleted + nutritionTestsCompleted}</Text>
            <Text style={styles.statLabel}>Tests Completed</Text>
          </View>
          
          <View style={styles.statItem}>
            <Activity size={20} color={colors.accent.primary} />
            <Text style={styles.statValue}>{totalGymTests + totalNutritionTests}</Text>
            <Text style={styles.statLabel}>Total Tests</Text>
          </View>
          
          <View style={styles.statItem}>
            <TrendingUp size={20} color={colors.status.info} />
            <Text style={styles.statValue}>
              {Math.round(((gymTestsCompleted + nutritionTestsCompleted) / (totalGymTests + totalNutritionTests)) * 100)}%
            </Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
          
          <View style={styles.statItem}>
            <AlertTriangle size={20} color={colors.status.warning} />
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Issues Found</Text>
          </View>
        </View>
      </Card>

      {/* Testing Tips */}
      <Card style={styles.tipsCard}>
        <Text style={styles.sectionTitle}>Testing Best Practices</Text>
        
        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <View style={styles.tipBullet} />
            <Text style={styles.tipText}>Test in various lighting conditions (bright gym, dim lighting)</Text>
          </View>
          
          <View style={styles.tipItem}>
            <View style={styles.tipBullet} />
            <Text style={styles.tipText}>Monitor battery usage during extended workout sessions</Text>
          </View>
          
          <View style={styles.tipItem}>
            <View style={styles.tipBullet} />
            <Text style={styles.tipText}>Test touch responsiveness with sweaty or wet fingers</Text>
          </View>
          
          <View style={styles.tipItem}>
            <View style={styles.tipBullet} />
            <Text style={styles.tipText}>Verify data accuracy in nutrition logging scenarios</Text>
          </View>
          
          <View style={styles.tipItem}>
            <View style={styles.tipBullet} />
            <Text style={styles.tipText}>Check offline functionality when network is poor</Text>
          </View>
        </View>
      </Card>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Button
          title="Start Gym Testing"
          onPress={() => router.push('/testing/gym-environment')}
          icon={<Smartphone size={18} color={colors.text.primary} />}
          style={styles.actionButton}
        />
        
        <Button
          title="Test Nutrition Features"
          variant="outline"
          onPress={() => router.push('/testing/nutrition-scenarios')}
          icon={<UtensilsCrossed size={18} color={colors.accent.primary} />}
          style={styles.actionButton}
        />
        
        <Button
          title="Wellness Tracking"
          variant="outline"
          onPress={() => router.push('/testing/wellness-tracking')}
          icon={<Heart size={18} color={colors.accent.primary} />}
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
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  systemCard: {
    margin: 16,
    marginTop: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  systemChecks: {
    gap: 12,
  },
  systemCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  systemCheckName: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
  },
  systemCheckStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusGood: {
    backgroundColor: colors.status.success,
  },
  statusWarning: {
    backgroundColor: colors.status.warning,
  },
  statusError: {
    backgroundColor: colors.status.error,
  },
  scenariosSection: {
    padding: 16,
    paddingTop: 0,
  },
  scenarioCard: {
    marginBottom: 16,
    padding: 0,
  },
  scenarioContent: {
    padding: 16,
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scenarioIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scenarioInfo: {
    flex: 1,
  },
  scenarioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  scenarioDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  scenarioProgress: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  progressBar: {
    marginBottom: 12,
  },
  scenarioFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featureTag: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  tipsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent.primary,
    marginTop: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  actionsSection: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 32,
    gap: 12,
  },
  actionButton: {
    marginBottom: 0,
  },
});