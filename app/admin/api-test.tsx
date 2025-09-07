import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';

import { Stack } from 'expo-router';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react-native';


interface ApiTestResult {
  name: string;
  endpoint: string;
  status: 'testing' | 'success' | 'error' | 'warning';
  message: string;
  responseTime?: number;
  details?: any;
}

export default function ApiTestScreen() {
  const [testResults, setTestResults] = useState<ApiTestResult[]>([]);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check network connectivity using fetch
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
        });
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
      }
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Test backend connection
  const testBackendConnection = async () => {
    setBackendStatus('checking');
    try {
      const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || '';
      const endpoints = [
        '/api/trpc',
        `${baseUrl}/api/trpc`,
        'https://rork.com/api/p/as5h45pls18cy2nuagueu/api/trpc'
      ].filter(Boolean);

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          });
          
          if (response.ok || response.status === 405) { // 405 means endpoint exists but doesn't accept GET
            setBackendStatus('online');
            console.log('✅ Backend online at:', endpoint);
            return;
          }
        } catch (e) {
          console.log('Testing endpoint failed:', endpoint, e);
        }
      }
      setBackendStatus('offline');
    } catch (error) {
      console.error('Backend connection test failed:', error);
      setBackendStatus('offline');
    }
  };

  // Test individual APIs
  const testApi = async (api: {
    name: string;
    endpoint: string;
    testFn: () => Promise<any>;
  }): Promise<ApiTestResult> => {
    const startTime = Date.now();
    try {
      const result = await api.testFn();
      const responseTime = Date.now() - startTime;
      
      return {
        name: api.name,
        endpoint: api.endpoint,
        status: 'success',
        message: `Connected successfully (${responseTime}ms)`,
        responseTime,
        details: result,
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      // Check if it's a placeholder key
      if (error.message?.includes('placeholder') || error.message?.includes('_active')) {
        return {
          name: api.name,
          endpoint: api.endpoint,
          status: 'warning',
          message: 'Using placeholder API key - configure real key in .env',
          responseTime,
          details: error.message,
        };
      }
      
      return {
        name: api.name,
        endpoint: api.endpoint,
        status: 'error',
        message: error.message || 'Connection failed',
        responseTime,
        details: error,
      };
    }
  };

  const runAllTests = async () => {
    setIsTestingAll(true);
    setTestResults([]);

    // First test backend connection
    await testBackendConnection();

    const apis = [
      {
        name: 'RORK Backend API',
        endpoint: 'https://rork.com/api/p/as5h45pls18cy2nuagueu',
        testFn: async () => {
          const response = await fetch('https://rork.com/api/p/as5h45pls18cy2nuagueu/api/trpc/system.apiStatus', {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return await response.json();
        },
      },
      {
        name: 'tRPC System Status',
        endpoint: '/api/trpc/system.apiStatus',
        testFn: async () => {
          // Use trpcClient directly for testing
          const { trpcClient } = await import('@/lib/trpc');
          return await trpcClient.system.apiStatus.query();
        },
      },
      {
        name: 'Shop Products API',
        endpoint: '/api/trpc/shop.products',
        testFn: async () => {
          const { trpcClient } = await import('@/lib/trpc');
          return await trpcClient.shop.products.query();
        },
      },
      {
        name: 'RippedCity Website',
        endpoint: 'https://www.rippedcityinc.com',
        testFn: async () => {
          const response = await fetch('https://www.rippedcityinc.com/products.json?limit=10', {
            headers: {
              'User-Agent': 'Rip360-Mobile-App/1.0',
              'Accept': 'application/json',
            },
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          return { productCount: data.products?.length || 0 };
        },
      },
      {
        name: 'Fitness Exercises API',
        endpoint: '/api/trpc/fitness.exercises',
        testFn: async () => {
          const { trpcClient } = await import('@/lib/trpc');
          return await trpcClient.fitness.exercises.query({ muscle: 'chest' });
        },
      },
      {
        name: 'Nutrition Search API',
        endpoint: '/api/trpc/nutrition.search',
        testFn: async () => {
          const { trpcClient } = await import('@/lib/trpc');
          return await trpcClient.nutrition.search.query({ query: 'apple' });
        },
      },
      {
        name: 'Health Supplements API',
        endpoint: '/api/trpc/health.supplements.search',
        testFn: async () => {
          const { trpcClient } = await import('@/lib/trpc');
          return await trpcClient.health.supplements.search.query({ query: 'vitamin c' });
        },
      },
      {
        name: 'Coaching List API',
        endpoint: '/api/trpc/coaching.list',
        testFn: async () => {
          const { trpcClient } = await import('@/lib/trpc');
          return await trpcClient.coaching.list.query({});
        },
      },
      {
        name: 'AI Text Generation',
        endpoint: 'https://toolkit.rork.com/text/llm/',
        testFn: async () => {
          const response = await fetch('https://toolkit.rork.com/text/llm/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [{ role: 'user', content: 'Test connection' }]
            }),
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return await response.json();
        },
      },
      {
        name: 'AI Image Generation',
        endpoint: 'https://toolkit.rork.com/images/generate/',
        testFn: async () => {
          // Just test if endpoint responds, don't actually generate
          const response = await fetch('https://toolkit.rork.com/images/generate/', {
            method: 'OPTIONS',
          });
          return { status: response.status, available: response.status !== 404 };
        },
      },
    ];

    const results: ApiTestResult[] = [];
    
    for (const api of apis) {
      const result = await testApi(api);
      results.push(result);
      setTestResults([...results]);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsTestingAll(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await runAllTests();
    setRefreshing(false);
  };

  useEffect(() => {
    testBackendConnection();
    runAllTests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getStatusIcon = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={20} color="#10b981" />;
      case 'error':
        return <XCircle size={20} color="#ef4444" />;
      case 'warning':
        return <AlertCircle size={20} color="#f59e0b" />;
      default:
        return <ActivityIndicator size="small" />;
    }
  };

  const getStatusColor = (status: ApiTestResult['status']) => {
    switch (status) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const warningCount = testResults.filter(r => r.status === 'warning').length;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'API Connection Test',
          headerStyle: { backgroundColor: '#1f2937' },
          headerTintColor: '#fff',
        }}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Network Status */}
        <View style={[styles.statusCard, { backgroundColor: isConnected ? '#10b981' : '#ef4444' }]}>
          <View style={styles.statusHeader}>
            {isConnected ? (
              <Wifi size={24} color="#fff" />
            ) : (
              <WifiOff size={24} color="#fff" />
            )}
            <Text style={styles.statusTitle}>
              Network: {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>

        {/* Backend Status */}
        <View style={[
          styles.statusCard,
          { backgroundColor: backendStatus === 'online' ? '#10b981' : backendStatus === 'offline' ? '#ef4444' : '#f59e0b' }
        ]}>
          <View style={styles.statusHeader}>
            {backendStatus === 'checking' ? (
              <ActivityIndicator color="#fff" />
            ) : backendStatus === 'online' ? (
              <CheckCircle size={24} color="#fff" />
            ) : (
              <XCircle size={24} color="#fff" />
            )}
            <Text style={styles.statusTitle}>
              Backend: {backendStatus === 'checking' ? 'Checking...' : backendStatus === 'online' ? 'Online' : 'Offline'}
            </Text>
          </View>
          {backendStatus === 'offline' && (
            <Text style={styles.statusSubtitle}>
              Check EXPO_PUBLIC_RORK_API_BASE_URL in .env
            </Text>
          )}
        </View>

        {/* Test Summary */}
        {testResults.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Test Summary</Text>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#10b981' }]}>{successCount}</Text>
                <Text style={styles.statLabel}>Success</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{warningCount}</Text>
                <Text style={styles.statLabel}>Warning</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#ef4444' }]}>{errorCount}</Text>
                <Text style={styles.statLabel}>Failed</Text>
              </View>
            </View>
          </View>
        )}

        {/* Test Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>API Test Results</Text>
          
          {testResults.map((result, index) => (
            <View key={index} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                {getStatusIcon(result.status)}
                <Text style={styles.resultName}>{result.name}</Text>
              </View>
              
              <Text style={styles.resultEndpoint}>{result.endpoint}</Text>
              
              <Text style={[styles.resultMessage, { color: getStatusColor(result.status) }]}>
                {result.message}
              </Text>
              
              {result.responseTime && (
                <Text style={styles.responseTime}>
                  Response time: {result.responseTime}ms
                </Text>
              )}
              
              {result.status === 'error' && result.details && (
                <TouchableOpacity
                  onPress={() => Alert.alert('Error Details', JSON.stringify(result.details, null, 2))}
                >
                  <Text style={styles.viewDetails}>View Details</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Test Button */}
        {!isTestingAll && (
          <TouchableOpacity style={styles.testButton} onPress={runAllTests}>
            <RefreshCw size={20} color="#fff" />
            <Text style={styles.testButtonText}>Run All Tests</Text>
          </TouchableOpacity>
        )}

        {isTestingAll && (
          <View style={styles.testingIndicator}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.testingText}>Running API tests...</Text>
          </View>
        )}

        {/* Configuration Info */}
        <View style={styles.configCard}>
          <Text style={styles.configTitle}>Configuration</Text>
          <Text style={styles.configItem}>
            Platform: {Platform.OS}
          </Text>
          <Text style={styles.configItem}>
            Base URL: {process.env.EXPO_PUBLIC_RORK_API_BASE_URL || 'Not configured'}
          </Text>
          <Text style={styles.configItem}>
            Force Mock: {process.env.EXPO_PUBLIC_FORCE_MOCK_DATA || 'false'}
          </Text>
          <Text style={styles.configItem}>
            Debug API: {process.env.EXPO_PUBLIC_DEBUG_API || 'false'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  statusCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
    opacity: 0.9,
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  resultsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  resultEndpoint: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  responseTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  viewDetails: {
    fontSize: 14,
    color: '#3b82f6',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  testingIndicator: {
    alignItems: 'center',
    padding: 32,
  },
  testingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  configCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  configTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  configItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
});