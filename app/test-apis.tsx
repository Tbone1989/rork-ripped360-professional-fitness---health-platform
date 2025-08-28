import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Play, CheckCircle, XCircle, Clock, Zap, Apple, Pill, Activity, HelpCircle } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { apiService } from '@/services/api';
import { apiTester, TestResult } from '@/utils/apiTester';
import { envChecker } from '@/utils/envChecker';
import { useUserStore } from '@/store/userStore';



export default function TestApisScreen() {
  const router = useRouter();
  const { isAdmin, user } = useUserStore((s) => ({ isAdmin: s.isAdmin, user: s.user }));
  const admin = isAdmin || (user?.role === 'admin');

  useEffect(() => {
    if (!admin) {
      router.replace('/');
    }
  }, [admin, router]);

  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Workout Generation (Rip360_Ninja)', status: 'pending' },
    { name: 'Nutrition Lookup (Rip360_Nutrition)', status: 'pending' },
    { name: 'Food Barcode Scan (Rip360_Nutrition)', status: 'pending' },
    { name: 'Supplement Check (Rip360_Health FDA)', status: 'pending' },
    { name: 'Supplement Barcode (Rip360_Health FDA)', status: 'pending' },
    { name: 'Bloodwork Analysis (Rip360_Health FDA)', status: 'pending' },
    { name: 'Exercise Search (Rip360_Ninja)', status: 'pending' },
    { name: 'Meal Plan Generation (Rip360_Nutrition)', status: 'pending' },
  ]);
  
  const [crossReferenceResult, setCrossReferenceResult] = useState<any>(null);
  const [envStatus, setEnvStatus] = useState<any[]>([]);
  
  React.useEffect(() => {
    setEnvStatus(envChecker.checkApiKeys());
  }, []);

  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const updateTestStatus = (testName: string, updates: Partial<TestResult>) => {
    setTests(prev => prev.map(test => 
      test.name === testName ? { ...test, ...updates } : test
    ));
  };

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    const startTime = Date.now();
    setCurrentTest(testName);
    updateTestStatus(testName, { status: 'running' });

    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      updateTestStatus(testName, {
        status: 'success',
        duration,
        data: result
      });
      
      return { success: true, data: result, duration };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      updateTestStatus(testName, {
        status: 'error',
        duration,
        error: errorMessage
      });
      
      return { success: false, error: errorMessage, duration };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    // Test 1: Workout Generation
    setCurrentTest('Workout Generation (Rip360_Ninja)');
    const workoutResult = await apiTester.testWorkoutGeneration();
    updateTestStatus(workoutResult.name, workoutResult);
    results.push(workoutResult);

    // Test 2: Nutrition Lookup
    setCurrentTest('Nutrition Lookup (Rip360_Nutrition)');
    const nutritionResult = await apiTester.testNutritionLookup();
    updateTestStatus(nutritionResult.name, nutritionResult);
    results.push(nutritionResult);

    // Test 3: Food Barcode Scan
    setCurrentTest('Food Barcode Scan (Rip360_Nutrition)');
    const barcodeResult = await apiTester.testFoodBarcode();
    updateTestStatus(barcodeResult.name, barcodeResult);
    results.push(barcodeResult);

    // Test 4: Supplement Check
    setCurrentTest('Supplement Check (Rip360_Health FDA)');
    const supplementResult = await apiTester.testSupplementSearch();
    updateTestStatus(supplementResult.name, supplementResult);
    results.push(supplementResult);

    // Test 5: Supplement Barcode
    setCurrentTest('Supplement Barcode (Rip360_Health FDA)');
    const suppBarcodeResult = await apiTester.testSupplementBarcode();
    updateTestStatus(suppBarcodeResult.name, suppBarcodeResult);
    results.push(suppBarcodeResult);

    // Test 6: Bloodwork Analysis
    setCurrentTest('Bloodwork Analysis (Rip360_Health FDA)');
    const bloodworkResult = await apiTester.testBloodworkAnalysis();
    updateTestStatus(bloodworkResult.name, bloodworkResult);
    results.push(bloodworkResult);

    // Test 7: Exercise Search
    setCurrentTest('Exercise Search (Rip360_Ninja)');
    const exerciseResult = await apiTester.testExerciseSearch();
    updateTestStatus(exerciseResult.name, exerciseResult);
    results.push(exerciseResult);

    // Test 8: Meal Plan Generation
    setCurrentTest('Meal Plan Generation (Rip360_Nutrition)');
    const mealPlanResult = await apiTester.testMealPlanGeneration();
    updateTestStatus(mealPlanResult.name, mealPlanResult);
    results.push(mealPlanResult);

    // Cross-reference data accuracy
    setCurrentTest('Cross-referencing data...');
    const crossRef = await apiTester.crossReferenceData();
    setCrossReferenceResult(crossRef);

    setCurrentTest(null);
    setIsRunning(false);

    // Calculate overall statistics
    const successCount = results.filter(r => r.status === 'success').length;
    const totalTests = results.length;
    const avgAccuracy = results.reduce((sum, r) => sum + (r.accuracy || 0), 0) / results.length;
    const avgResponseTime = results.reduce((sum, r) => sum + (r.duration || 0), 0) / results.length;
    
    Alert.alert(
      'Test Results Summary',
      `${successCount}/${totalTests} tests passed\nAverage Accuracy: ${Math.round(avgAccuracy)}%\nAverage Response Time: ${Math.round(avgResponseTime)}ms\n\n✓ Successful APIs:\n${results.filter(r => r.status === 'success').map(r => `${r.name} (${r.accuracy}%)`).join('\n')}\n\n✗ Failed APIs:\n${results.filter(r => r.status === 'error').map(r => `${r.name}: ${r.error}`).join('\n')}`,
      [{ text: 'OK' }]
    );
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} color={colors.text.tertiary} />;
      case 'running':
        return <Activity size={20} color={colors.accent.primary} />;
      case 'success':
        return <CheckCircle size={20} color={colors.status.success} />;
      case 'error':
        return <XCircle size={20} color={colors.status.error} />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return colors.text.tertiary;
      case 'running':
        return colors.accent.primary;
      case 'success':
        return colors.status.success;
      case 'error':
        return colors.status.error;
    }
  };

  const showTestDetails = (test: TestResult) => {
    if (test.status === 'pending' || test.status === 'running') return;

    const details = test.status === 'success' 
      ? `Duration: ${test.duration}ms\nAccuracy: ${test.accuracy}%\n\nSample Data: ${JSON.stringify(test.data, null, 2).substring(0, 500)}...`
      : `Duration: ${test.duration}ms\nAccuracy: ${test.accuracy || 0}%\n\nError: ${test.error}`;

    Alert.alert(test.name, details, [{ text: 'OK' }]);
  };

  if (!admin) {
    return <ScrollView style={styles.container} testID="restricted-screen" />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} testID="api-test-suite">
      <Stack.Screen options={{ title: 'API Test Suite' }} />
      
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Zap size={24} color={colors.accent.primary} />
        </View>
        <Text style={styles.title}>API Integration Test</Text>
        <Text style={styles.subtitle}>
          Test all API endpoints to verify connectivity and data accuracy
        </Text>
      </View>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>Test Sequence</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoNumber}>1.</Text>
          <Text style={styles.infoText}>Workout generation → Rip360_Ninja</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoNumber}>2.</Text>
          <Text style={styles.infoText}>Nutrition lookup → Rip360_Nutrition</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoNumber}>3.</Text>
          <Text style={styles.infoText}>Supplement check → Rip360_Health FDA</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoNumber}>4.</Text>
          <Text style={styles.infoText}>Cross-reference data accuracy</Text>
        </View>
      </Card>

      <View style={styles.testsContainer}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        
        {tests.map((test, index) => (
          <TouchableOpacity
            key={index}
            style={styles.testItem}
            onPress={() => showTestDetails(test)}
            disabled={test.status === 'pending' || test.status === 'running'}
          >
            <View style={styles.testInfo}>
              <View style={styles.testHeader}>
                {getStatusIcon(test.status)}
                <Text style={[styles.testName, { color: getStatusColor(test.status) }]}>
                  {test.name}
                </Text>
              </View>
              
              {test.status === 'running' && currentTest === test.name && (
                <Text style={styles.testStatus}>Running...</Text>
              )}
              
              {test.status === 'success' && (
                <Text style={styles.testStatus}>
                  ✓ Completed in {test.duration}ms • Accuracy: {test.accuracy}%
                </Text>
              )}
              
              {test.status === 'error' && (
                <Text style={[styles.testStatus, { color: colors.status.error }]}>
                  ✗ {test.error}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionContainer}>
        <Button
          title={isRunning ? 'Running Tests...' : 'Run All Tests'}
          onPress={runAllTests}
          loading={isRunning}
          disabled={isRunning}
          fullWidth
          icon={isRunning ? undefined : <Play size={18} color={colors.text.primary} />}
        />
      </View>

      <Card style={styles.apiKeysCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>API Keys Status</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => Alert.alert('Diagnostic Report', envChecker.getDiagnosticReport())}>
              <Text style={styles.helpText}>Report</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('API Key Setup', envChecker.getApiKeyInstructions())}>
              <Text style={styles.helpText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {envStatus.map((env, index) => {
          const iconColor = env.isSet ? colors.status.success : colors.status.error;
          const IconComponent = index === 0 ? Zap : index === 1 ? Apple : Pill;
          
          return (
            <View key={env.key} style={styles.apiKeyItem}>
              <IconComponent size={16} color={iconColor} />
              <View style={styles.apiKeyInfo}>
                <Text style={styles.apiKeyName}>{env.name}</Text>
                {env.isSet && env.masked && (
                  <Text style={styles.apiKeyMasked}>{env.masked}</Text>
                )}
              </View>
              <Text style={[styles.apiKeyStatus, { color: iconColor }]}>
                {env.isSet ? '✓ Set' : '✗ Missing'}
              </Text>
            </View>
          );
        })}
        
        <View style={styles.systemInfo}>
          <Text style={styles.systemInfoText}>
            Connection: {envChecker.getConnectionStatus() === 'online' ? '✓ Online' : '✗ Offline'}
          </Text>
          <Text style={styles.systemInfoText}>
            Ready for Testing: {envChecker.getSystemInfo().readyForTesting ? '✅ Yes' : '❌ No'}
          </Text>
        </View>
      </Card>
      
      {crossReferenceResult && (
        <Card style={styles.crossRefCard}>
          <Text style={styles.cardTitle}>Cross-Reference Analysis</Text>
          
          <View style={styles.crossRefItem}>
            <Text style={styles.crossRefLabel}>Nutrition Results:</Text>
            <Text style={styles.crossRefValue}>{crossReferenceResult.nutritionResults || 0}</Text>
          </View>
          
          <View style={styles.crossRefItem}>
            <Text style={styles.crossRefLabel}>Supplement Results:</Text>
            <Text style={styles.crossRefValue}>{crossReferenceResult.supplementResults || 0}</Text>
          </View>
          
          <View style={styles.crossRefItem}>
            <Text style={styles.crossRefLabel}>Data Consistency:</Text>
            <Text style={[styles.crossRefValue, {
              color: (crossReferenceResult.consistencyScore || 0) > 80 ? colors.status.success : colors.status.warning
            }]}>{crossReferenceResult.consistencyScore || 0}%</Text>
          </View>
          
          {crossReferenceResult.error && (
            <Text style={[styles.crossRefError, { color: colors.status.error }]}>
              Error: {crossReferenceResult.error}
            </Text>
          )}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 22,
  },
  infoCard: {
    margin: 16,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.primary,
    width: 20,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  testsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  testItem: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  testInfo: {
    flex: 1,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  testName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  testStatus: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 32,
  },
  actionContainer: {
    padding: 16,
    paddingTop: 0,
  },
  apiKeysCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  apiKeyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  apiKeyName: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  helpText: {
    fontSize: 14,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  apiKeyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  apiKeyMasked: {
    fontSize: 10,
    color: colors.text.tertiary,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  apiKeyStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  systemInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  systemInfoText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  crossRefCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    marginBottom: 32,
  },
  crossRefItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  crossRefLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  crossRefValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  crossRefError: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
});