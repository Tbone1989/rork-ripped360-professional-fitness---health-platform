import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Battery, 
  Sun, 
  Thermometer,
  Droplets,
  Volume2,
  Smartphone
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useWellnessStore } from '@/store/wellnessStore';

export default function GymEnvironmentTesting() {
  const router = useRouter();
  const { gymTestingScenarios, runGymTest } = useWellnessStore();
  const [activeScenario, setActiveScenario] = useState(gymTestingScenarios[0]);
  const [testTimer, setTestTimer] = useState(0);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTestRunning) {
      interval = setInterval(() => {
        setTestTimer(prev => prev + 1);
        // Simulate battery drain
        setBatteryLevel(prev => Math.max(prev - 0.1, 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestRunning]);

  const startTest = () => {
    setIsTestRunning(true);
    setTestTimer(0);
    setBatteryLevel(100);
  };

  const stopTest = () => {
    setIsTestRunning(false);
  };

  const markTestResult = (testCaseId: string, result: 'passed' | 'failed') => {
    Alert.prompt(
      'Test Notes',
      'Add any observations or notes about this test:',
      (notes) => {
        runGymTest(activeScenario.id, testCaseId, result, notes || undefined);
      }
    );
  };

  const getEnvironmentIcon = (environment: string) => {
    switch (environment) {
      case 'bright': return <Sun size={20} color={colors.status.warning} />;
      case 'dim': return <Sun size={20} color={colors.text.secondary} />;
      case 'outdoor': return <Sun size={20} color={colors.accent.primary} />;
      default: return <Sun size={20} color={colors.text.secondary} />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedTests = activeScenario.testCases.filter(tc => tc.status !== 'pending').length;
  const totalTests = activeScenario.testCases.length;
  const progress = totalTests > 0 ? completedTests / totalTests : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen 
        options={{ 
          title: 'Gym Environment Testing',
          headerStyle: { backgroundColor: colors.background.primary },
        }} 
      />

      {/* Test Control Panel */}
      <Card style={styles.controlPanel}>
        <View style={styles.controlHeader}>
          <Text style={styles.controlTitle}>Test Session</Text>
          <View style={styles.timerContainer}>
            <Clock size={16} color={colors.text.secondary} />
            <Text style={styles.timerText}>{formatTime(testTimer)}</Text>
          </View>
        </View>
        
        <View style={styles.controlButtons}>
          <Button
            title={isTestRunning ? 'Stop Test' : 'Start Test'}
            onPress={isTestRunning ? stopTest : startTest}
            icon={isTestRunning ? <Pause size={18} color={colors.text.primary} /> : <Play size={18} color={colors.text.primary} />}
            style={[styles.controlButton, isTestRunning && styles.stopButton]}
          />
          
          <View style={styles.batteryIndicator}>
            <Battery size={16} color={batteryLevel > 20 ? colors.status.success : colors.status.error} />
            <Text style={[styles.batteryText, batteryLevel <= 20 && styles.lowBattery]}>
              {Math.round(batteryLevel)}%
            </Text>
          </View>
        </View>
      </Card>

      {/* Scenario Selection */}
      <Card style={styles.scenarioCard}>
        <Text style={styles.sectionTitle}>Test Scenarios</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {gymTestingScenarios.map((scenario) => (
            <TouchableOpacity
              key={scenario.id}
              style={[
                styles.scenarioButton,
                activeScenario.id === scenario.id && styles.activeScenario
              ]}
              onPress={() => setActiveScenario(scenario)}
            >
              <Text style={[
                styles.scenarioButtonText,
                activeScenario.id === scenario.id && styles.activeScenarioText
              ]}>
                {scenario.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Card>

      {/* Environment Details */}
      <Card style={styles.environmentCard}>
        <Text style={styles.sectionTitle}>Environment Conditions</Text>
        <Text style={styles.scenarioDescription}>{activeScenario.description}</Text>
        
        <View style={styles.conditionsGrid}>
          <View style={styles.conditionItem}>
            {getEnvironmentIcon(activeScenario.environment)}
            <Text style={styles.conditionLabel}>Lighting</Text>
            <Text style={styles.conditionValue}>{activeScenario.environment}</Text>
          </View>
          
          <View style={styles.conditionItem}>
            <Thermometer size={20} color={colors.status.warning} />
            <Text style={styles.conditionLabel}>Temperature</Text>
            <Text style={styles.conditionValue}>{activeScenario.temperature}</Text>
          </View>
          
          <View style={styles.conditionItem}>
            <Droplets size={20} color={colors.status.info} />
            <Text style={styles.conditionLabel}>Humidity</Text>
            <Text style={styles.conditionValue}>{activeScenario.humidity}</Text>
          </View>
          
          <View style={styles.conditionItem}>
            <Volume2 size={20} color={colors.text.secondary} />
            <Text style={styles.conditionLabel}>Noise</Text>
            <Text style={styles.conditionValue}>{activeScenario.noiseLevel}</Text>
          </View>
        </View>
      </Card>

      {/* Progress Overview */}
      <Card style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.sectionTitle}>Test Progress</Text>
          <Text style={styles.progressText}>{completedTests}/{totalTests} completed</Text>
        </View>
        <ProgressBar progress={progress} height={8} style={styles.progressBar} />
      </Card>

      {/* Test Cases */}
      <Card style={styles.testCasesCard}>
        <Text style={styles.sectionTitle}>Test Cases</Text>
        
        {activeScenario.testCases.map((testCase) => (
          <View key={testCase.id} style={styles.testCase}>
            <View style={styles.testCaseHeader}>
              <View style={styles.testCaseInfo}>
                <Text style={styles.testCaseName}>{testCase.name}</Text>
                <Text style={styles.testCaseDescription}>{testCase.description}</Text>
              </View>
              
              <View style={styles.testCaseStatus}>
                {testCase.status === 'passed' && (
                  <CheckCircle size={24} color={colors.status.success} />
                )}
                {testCase.status === 'failed' && (
                  <XCircle size={24} color={colors.status.error} />
                )}
                {testCase.status === 'pending' && (
                  <View style={styles.pendingIndicator} />
                )}
              </View>
            </View>
            
            <View style={styles.testCaseDetails}>
              <Text style={styles.expectedBehavior}>
                Expected: {testCase.expectedBehavior}
              </Text>
              {testCase.actualBehavior && (
                <Text style={styles.actualBehavior}>
                  Actual: {testCase.actualBehavior}
                </Text>
              )}
            </View>
            
            {testCase.status === 'pending' && (
              <View style={styles.testCaseActions}>
                <Button
                  title="Pass"
                  variant="outline"
                  onPress={() => markTestResult(testCase.id, 'passed')}
                  style={[styles.testActionButton, styles.passButton]}
                />
                <Button
                  title="Fail"
                  variant="outline"
                  onPress={() => markTestResult(testCase.id, 'failed')}
                  style={[styles.testActionButton, styles.failButton]}
                />
              </View>
            )}
          </View>
        ))}
      </Card>

      {/* Device Info */}
      <Card style={styles.deviceCard}>
        <View style={styles.deviceHeader}>
          <Smartphone size={20} color={colors.accent.primary} />
          <Text style={styles.sectionTitle}>Device Information</Text>
        </View>
        
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceInfoText}>Screen Brightness: Auto</Text>
          <Text style={styles.deviceInfoText}>Touch Sensitivity: High</Text>
          <Text style={styles.deviceInfoText}>Performance Mode: Optimized</Text>
          <Text style={styles.deviceInfoText}>Network: WiFi + Cellular</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  controlPanel: {
    margin: 16,
    padding: 16,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  controlTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButton: {
    flex: 1,
    marginRight: 16,
  },
  stopButton: {
    backgroundColor: colors.status.error,
  },
  batteryIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
  },
  batteryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  lowBattery: {
    color: colors.status.error,
  },
  scenarioCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  scenarioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    marginRight: 8,
  },
  activeScenario: {
    backgroundColor: colors.accent.primary,
  },
  scenarioButtonText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  activeScenarioText: {
    color: colors.text.primary,
  },
  environmentCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  scenarioDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  conditionItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  conditionLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  conditionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  progressCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  progressBar: {
    marginTop: 8,
  },
  testCasesCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  testCase: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  testCaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  testCaseInfo: {
    flex: 1,
    marginRight: 12,
  },
  testCaseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  testCaseDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  testCaseStatus: {
    alignItems: 'center',
  },
  pendingIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.tertiary,
    borderWidth: 2,
    borderColor: colors.border.medium,
  },
  testCaseDetails: {
    marginBottom: 12,
  },
  expectedBehavior: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  actualBehavior: {
    fontSize: 13,
    color: colors.text.primary,
    fontStyle: 'italic',
  },
  testCaseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  testActionButton: {
    flex: 1,
  },
  passButton: {
    borderColor: colors.status.success,
  },
  failButton: {
    borderColor: colors.status.error,
  },
  deviceCard: {
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
    padding: 16,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  deviceInfo: {
    gap: 4,
  },
  deviceInfoText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});