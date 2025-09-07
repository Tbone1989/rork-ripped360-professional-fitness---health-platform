import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Wifi, WifiOff, Server, Database, Shield } from 'lucide-react-native';
import { trpc, trpcClient } from '@/lib/trpc';
import { colors } from '@/constants/colors';

interface ApiTestResult {
  name: string;
  endpoint: string;
  category: string;
  status: 'success' | 'error' | 'warning' | 'testing' | 'pending';
  message: string;
  responseTime?: number;
  data?: any;
  error?: any;
}

interface ApiCategory {
  name: string;
  icon: any;
  endpoints: ApiTest[];
}

interface ApiTest {
  name: string;
  endpoint: string;
  category: string;
  test: () => Promise<Partial<ApiTestResult>>;
}

export default function ApiTestScreen() {
  const [testResults, setTestResults] = useState<ApiTestResult[]>([]);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['System']));
  const [baseUrl, setBaseUrl] = useState('');

  // Get the actual base URL being used
  useEffect(() => {
    const url = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || 'https://rork.com/api/p/as5h45pls18cy2nuagueu';
    setBaseUrl(url);
  }, []);

  const apiCategories: ApiCategory[] = [
    {
      name: 'System',
      icon: Server,
      endpoints: [
        {
          name: 'API Status',
          endpoint: 'system.apiStatus',
          category: 'System',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.system.apiStatus.query();
              setConnectionStatus('connected');
              return {
                status: 'success' as const,
                message: `✅ Backend healthy - ${response?.apis?.length || 0} APIs configured`,
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              setConnectionStatus('disconnected');
              return {
                status: 'error' as const,
                message: `❌ ${error.message || 'Backend unreachable'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
        {
          name: 'Test Endpoint',
          endpoint: 'example.hi',
          category: 'System',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.example.hi.mutate({ name: 'Test' });
              return {
                status: 'success' as const,
                message: '✅ Test endpoint working',
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'error' as const,
                message: `❌ ${error.message || 'Failed'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
      ],
    },
    {
      name: 'Shop',
      icon: Database,
      endpoints: [
        {
          name: 'Products List',
          endpoint: 'shop.products',
          category: 'Shop',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.shop.products.query({ limit: 10 });
              const count = Array.isArray(response) ? response.length : 0;
              return {
                status: count > 0 ? 'success' as const : 'warning' as const,
                message: count > 0 ? `✅ Fetched ${count} products` : '⚠️ No products found',
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'error' as const,
                message: `❌ ${error.message || 'Failed to fetch products'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
      ],
    },
    {
      name: 'Coaching',
      icon: Shield,
      endpoints: [
        {
          name: 'Coaches List',
          endpoint: 'coaching.list',
          category: 'Coaching',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.coaching.list.query({});
              const count = Array.isArray(response) ? response.length : 0;
              return {
                status: 'success' as const,
                message: `✅ Found ${count} coaches`,
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'error' as const,
                message: `❌ ${error.message || 'Failed'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
        {
          name: 'Client List',
          endpoint: 'coaching.clients',
          category: 'Coaching',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.coaching.clients.query({ viewerId: 'test', viewerRole: 'coach' });
              return {
                status: 'success' as const,
                message: `✅ Retrieved client data`,
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'error' as const,
                message: `❌ ${error.message || 'Failed'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
        {
          name: 'Sessions',
          endpoint: 'coaching.sessions.list',
          category: 'Coaching',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.coaching.sessions.list.query({ coachId: 'test' });
              return {
                status: 'success' as const,
                message: `✅ Sessions endpoint working`,
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'error' as const,
                message: `❌ ${error.message || 'Failed'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
        {
          name: 'Conversations',
          endpoint: 'coaching.messages.conversations',
          category: 'Coaching',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.coaching.messages.conversations.query({ userId: 'test' });
              return {
                status: 'success' as const,
                message: `✅ Messages endpoint working`,
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'error' as const,
                message: `❌ ${error.message || 'Failed'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
      ],
    },
    {
      name: 'Fitness',
      icon: Database,
      endpoints: [
        {
          name: 'Exercises',
          endpoint: 'fitness.exercises',
          category: 'Fitness',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.fitness.exercises.query({ muscle: 'chest' });
              const count = Array.isArray(response) ? response.length : 0;
              return {
                status: 'success' as const,
                message: `✅ Found ${count} chest exercises`,
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'error' as const,
                message: `❌ ${error.message || 'Failed'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
        {
          name: 'Generate Workout',
          endpoint: 'fitness.generate',
          category: 'Fitness',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.fitness.generate.mutate({
                type: 'strength',
                muscle: ['chest', 'triceps'],
                difficulty: 'intermediate',
                duration: 45,
              });
              return {
                status: 'success' as const,
                message: `✅ Generated workout plan`,
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'warning' as const,
                message: `⚠️ ${error.message || 'Generation unavailable'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
      ],
    },
    {
      name: 'Nutrition',
      icon: Database,
      endpoints: [
        {
          name: 'Food Search',
          endpoint: 'nutrition.search',
          category: 'Nutrition',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.nutrition.search.query({ query: 'apple' });
              const count = Array.isArray(response) ? response.length : 0;
              return {
                status: count > 0 ? 'success' as const : 'warning' as const,
                message: count > 0 ? `✅ Found ${count} food items` : '⚠️ No results',
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'error' as const,
                message: `❌ ${error.message || 'Failed'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
        {
          name: 'Barcode Scan',
          endpoint: 'nutrition.barcode',
          category: 'Nutrition',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.nutrition.barcode.query({ barcode: '012345678905' });
              return {
                status: response ? 'success' as const : 'warning' as const,
                message: response ? '✅ Barcode API working' : '⚠️ Product not found',
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'warning' as const,
                message: `⚠️ ${error.message || 'Barcode API unavailable'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
        {
          name: 'Meal Plan',
          endpoint: 'nutrition.mealPlan',
          category: 'Nutrition',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.nutrition.mealPlan.mutate({
                calories: 2000,
                protein: 150,
                carbs: 250,
                fat: 70,
                meals: 3,
                restrictions: [],
              });
              return {
                status: 'success' as const,
                message: '✅ Generated meal plan',
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'warning' as const,
                message: `⚠️ ${error.message || 'Generation unavailable'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
      ],
    },
    {
      name: 'Health',
      icon: Shield,
      endpoints: [
        {
          name: 'Bloodwork',
          endpoint: 'health.bloodwork',
          category: 'Health',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.health.bloodwork.mutate({});
              return {
                status: 'success' as const,
                message: '✅ Bloodwork data retrieved',
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'error' as const,
                message: `❌ ${error.message || 'Failed'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
        {
          name: 'Supplements Search',
          endpoint: 'health.supplements.search',
          category: 'Health',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.health.supplements.search.query({ query: 'vitamin d' });
              return {
                status: 'success' as const,
                message: `✅ Supplements search working`,
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'error' as const,
                message: `❌ ${error.message || 'Failed'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
        {
          name: 'Digestive Health',
          endpoint: 'health.digestive',
          category: 'Health',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.health.digestive.mutate({
                symptoms: ['bloating'],
                frequency: { bloating: 'occasional' },
              });
              return {
                status: 'success' as const,
                message: '✅ Digestive health data retrieved',
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'error' as const,
                message: `❌ ${error.message || 'Failed'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
        {
          name: 'Detox Protocol',
          endpoint: 'health.detox',
          category: 'Health',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.health.detox.mutate({});
              return {
                status: 'success' as const,
                message: '✅ Detox protocol retrieved',
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'error' as const,
                message: `❌ ${error.message || 'Failed'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
        {
          name: 'Health Issues',
          endpoint: 'health.issues',
          category: 'Health',
          test: async () => {
            const start = Date.now();
            try {
              const response = await trpcClient.health.issues.mutate({
                symptoms: ['fatigue'],
              });
              return {
                status: 'success' as const,
                message: '✅ Health issues data retrieved',
                responseTime: Date.now() - start,
                data: response,
              };
            } catch (error: any) {
              return {
                status: 'error' as const,
                message: `❌ ${error.message || 'Failed'}`,
                responseTime: Date.now() - start,
                error,
              };
            }
          },
        },
      ],
    },
  ];

  const allTests = apiCategories.flatMap(cat => cat.endpoints);

  const runTest = async (test: ApiTest): Promise<ApiTestResult> => {
    const result = await test.test();
    return {
      name: test.name,
      endpoint: test.endpoint,
      category: test.category,
      status: 'success',
      message: '',
      ...result,
    } as ApiTestResult;
  };

  const runAllTests = async () => {
    setIsTestingAll(true);
    setTestResults([]);
    
    // Initialize all tests as pending
    const pendingResults = allTests.map(test => ({
      name: test.name,
      endpoint: test.endpoint,
      category: test.category,
      status: 'pending' as const,
      message: 'Waiting...',
    }));
    setTestResults(pendingResults);

    // Run tests sequentially by category
    const results: ApiTestResult[] = [];
    for (const category of apiCategories) {
      for (const test of category.endpoints) {
        // Update to testing status
        const updatedPending = [...results, 
          { name: test.name, endpoint: test.endpoint, category: test.category, status: 'testing' as const, message: 'Testing...' },
          ...pendingResults.slice(results.length + 1)
        ];
        setTestResults(updatedPending);
        
        // Run the test
        const result = await runTest(test);
        results.push(result);
        
        // Update with result
        setTestResults([...results, ...pendingResults.slice(results.length)]);
      }
    }

    setIsTestingAll(false);
  };

  const runCategoryTests = async (category: string) => {
    const categoryTests = allTests.filter(t => t.category === category);
    
    for (const test of categoryTests) {
      const updatedResults = [...testResults];
      const index = updatedResults.findIndex(r => r.endpoint === test.endpoint);
      
      if (index >= 0) {
        updatedResults[index] = { ...updatedResults[index], status: 'testing', message: 'Testing...' };
        setTestResults(updatedResults);
        
        const result = await runTest(test);
        updatedResults[index] = result;
        setTestResults(updatedResults);
      }
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await runAllTests();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    // Check connection status first
    setConnectionStatus('checking');
    runAllTests();
  }, []);

  const getStatusIcon = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={20} color={colors.status.success} />;
      case 'error':
        return <XCircle size={20} color={colors.status.error} />;
      case 'warning':
        return <AlertCircle size={20} color={colors.status.warning} />;
      case 'testing':
        return <ActivityIndicator size="small" color={colors.accent.primary} />;
      case 'pending':
        return <View style={styles.pendingIcon} />;
    }
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const warningCount = testResults.filter(r => r.status === 'warning').length;
  const totalTests = allTests.length;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'RORK API Testing',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Connection Status Card */}
        <View style={[styles.statusCard, { 
          borderColor: connectionStatus === 'connected' ? colors.status.success : 
                       connectionStatus === 'disconnected' ? colors.status.error : colors.status.warning 
        }]}>
          <View style={styles.statusHeader}>
            {connectionStatus === 'connected' ? (
              <Wifi size={24} color={colors.status.success} />
            ) : connectionStatus === 'disconnected' ? (
              <WifiOff size={24} color={colors.status.error} />
            ) : (
              <ActivityIndicator size="small" color={colors.accent.primary} />
            )}
            <Text style={[styles.statusTitle, { 
              color: connectionStatus === 'connected' ? colors.status.success : 
                     connectionStatus === 'disconnected' ? colors.status.error : colors.status.warning 
            }]}>
              {connectionStatus === 'connected' ? 'RORK Backend Connected' : 
               connectionStatus === 'disconnected' ? 'RORK Backend Disconnected' : 
               'Checking RORK Connection...'}
            </Text>
          </View>
          <Text style={styles.statusSubtitle} numberOfLines={1}>
            {baseUrl}
          </Text>
          {connectionStatus === 'disconnected' && (
            <Text style={styles.errorHint}>
              Verify your RORK project is running and accessible
            </Text>
          )}
        </View>

        {/* Test Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>API Test Results</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.status.success }]}>{successCount}</Text>
              <Text style={styles.statLabel}>Passed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.status.error }]}>{errorCount}</Text>
              <Text style={styles.statLabel}>Failed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.status.warning }]}>{warningCount}</Text>
              <Text style={styles.statLabel}>Warnings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text.secondary }]}>{totalTests}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { 
              width: `${(successCount / totalTests) * 100}%`,
              backgroundColor: colors.status.success 
            }]} />
          </View>
        </View>

        {/* Run All Tests Button */}
        <TouchableOpacity
          style={[styles.runAllButton, isTestingAll && styles.runAllButtonDisabled]}
          onPress={runAllTests}
          disabled={isTestingAll}
        >
          {isTestingAll ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <RefreshCw size={20} color="white" />
          )}
          <Text style={styles.runAllButtonText}>
            {isTestingAll ? `Testing ${testResults.filter(r => r.status === 'testing').length + 1}/${totalTests}...` : 'Test All RORK Endpoints'}
          </Text>
        </TouchableOpacity>

        {/* Test Results by Category */}
        {apiCategories.map((category) => {
          const categoryResults = testResults.filter(r => r.category === category.name);
          const categorySuccess = categoryResults.filter(r => r.status === 'success').length;
          const categoryError = categoryResults.filter(r => r.status === 'error').length;
          const isExpanded = expandedCategories.has(category.name);
          const Icon = category.icon;

          return (
            <View key={category.name} style={styles.categoryContainer}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleCategory(category.name)}
              >
                <View style={styles.categoryInfo}>
                  <Icon size={20} color={colors.accent.primary} />
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  <View style={styles.categoryBadges}>
                    {categorySuccess > 0 && (
                      <View style={[styles.badge, { backgroundColor: colors.status.success + '20' }]}>
                        <Text style={[styles.badgeText, { color: colors.status.success }]}>{categorySuccess}</Text>
                      </View>
                    )}
                    {categoryError > 0 && (
                      <View style={[styles.badge, { backgroundColor: colors.status.error + '20' }]}>
                        <Text style={[styles.badgeText, { color: colors.status.error }]}>{categoryError}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.testCategoryButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    runCategoryTests(category.name);
                  }}
                >
                  <Text style={styles.testCategoryText}>Test</Text>
                </TouchableOpacity>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.endpointsList}>
                  {category.endpoints.map((endpoint) => {
                    const result = testResults.find(r => r.endpoint === endpoint.endpoint);
                    if (!result) return null;

                    return (
                      <TouchableOpacity
                        key={endpoint.endpoint}
                        style={styles.endpointCard}
                        onPress={() => runTest(endpoint).then(r => {
                          setTestResults(prev => prev.map(tr => 
                            tr.endpoint === r.endpoint ? r : tr
                          ));
                        })}
                        disabled={result.status === 'testing'}
                      >
                        <View style={styles.endpointHeader}>
                          {getStatusIcon(result.status)}
                          <View style={styles.endpointInfo}>
                            <Text style={styles.endpointName}>{result.name}</Text>
                            <Text style={styles.endpointPath}>{result.endpoint}</Text>
                          </View>
                          {result.responseTime !== undefined && (
                            <Text style={styles.responseTime}>{result.responseTime}ms</Text>
                          )}
                        </View>
                        <Text style={styles.endpointMessage}>{result.message}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

        {/* Debug Information */}
        <View style={styles.debugCard}>
          <Text style={styles.debugTitle}>Configuration Details</Text>
          <View style={styles.debugRow}>
            <Text style={styles.debugLabel}>Platform:</Text>
            <Text style={styles.debugValue}>{Platform.OS}</Text>
          </View>
          <View style={styles.debugRow}>
            <Text style={styles.debugLabel}>RORK API URL:</Text>
            <Text style={styles.debugValue} numberOfLines={1}>{baseUrl}</Text>
          </View>
          <View style={styles.debugRow}>
            <Text style={styles.debugLabel}>Mock Data:</Text>
            <Text style={styles.debugValue}>{process.env.EXPO_PUBLIC_FORCE_MOCK_DATA || 'false'}</Text>
          </View>
          <View style={styles.debugRow}>
            <Text style={styles.debugLabel}>Debug Mode:</Text>
            <Text style={styles.debugValue}>{process.env.EXPO_PUBLIC_DEBUG_API || 'true'}</Text>
          </View>
          <View style={styles.debugRow}>
            <Text style={styles.debugLabel}>Total Endpoints:</Text>
            <Text style={styles.debugValue}>{totalTests}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  statusCard: {
    backgroundColor: colors.background.card,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 8,
  },
  errorHint: {
    fontSize: 12,
    color: colors.status.error,
    marginTop: 4,
    fontStyle: 'italic',
  },
  summaryCard: {
    backgroundColor: colors.background.card,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border.light,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  runAllButton: {
    backgroundColor: colors.accent.primary,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  runAllButtonDisabled: {
    opacity: 0.6,
  },
  runAllButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  categoryContainer: {
    backgroundColor: colors.background.card,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  categoryBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  testCategoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.accent.primary + '20',
  },
  testCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  endpointsList: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  endpointCard: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  endpointHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  endpointInfo: {
    flex: 1,
  },
  endpointName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
  endpointPath: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 2,
  },
  endpointMessage: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
    marginLeft: 32,
  },
  responseTime: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  pendingIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.border.light,
  },
  debugCard: {
    backgroundColor: colors.background.card,
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  debugRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  debugLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  debugValue: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});