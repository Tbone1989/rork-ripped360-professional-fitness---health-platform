import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { trpcClient } from '@/lib/trpc';
import { colors } from '@/constants/colors';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Wifi } from 'lucide-react-native';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
  duration?: number;
}

interface ApiEndpoint {
  name: string;
  url: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: any;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  {
    name: 'RORK API Health Check',
    url: 'https://rork.com/api/p/as5h45pls18cy2nuagueu',
    method: 'GET'
  },
  {
    name: 'RORK API tRPC Health',
    url: 'https://rork.com/api/p/as5h45pls18cy2nuagueu/api/trpc',
    method: 'GET'
  },
  {
    name: 'RORK API Direct tRPC',
    url: 'https://rork.com/api/p/as5h45pls18cy2nuagueu/trpc',
    method: 'GET'
  },
  {
    name: 'Local API Health',
    url: '/api',
    method: 'GET'
  },
  {
    name: 'Local tRPC Health',
    url: '/api/trpc',
    method: 'GET'
  }
];

const TRPC_ROUTES = [
  { name: 'example.hi', route: 'example.hi' },
  { name: 'system.apiStatus', route: 'system.apiStatus' },
  { name: 'nutrition.search', route: 'nutrition.search' },
  { name: 'fitness.exercises', route: 'fitness.exercises' },
  { name: 'health.bloodwork', route: 'health.bloodwork' },
  { name: 'coaching.list', route: 'coaching.list' },
  { name: 'shop.products', route: 'shop.products' }
];

export default function TestApiConnections() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testApiEndpoint = async (endpoint: ApiEndpoint): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...endpoint.headers
        },
        body: endpoint.body ? JSON.stringify(endpoint.body) : undefined
      });

      const duration = Date.now() - startTime;
      const responseText = await response.text();
      
      if (response.ok) {
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(responseText);
        } catch {
          parsedResponse = responseText;
        }

        return {
          name: endpoint.name,
          status: 'success',
          message: `✅ ${response.status} ${response.statusText}`,
          details: parsedResponse,
          duration
        };
      } else {
        return {
          name: endpoint.name,
          status: 'error',
          message: `❌ ${response.status} ${response.statusText}`,
          details: responseText,
          duration
        };
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      return {
        name: endpoint.name,
        status: 'error',
        message: `❌ Network Error: ${error.message}`,
        details: error,
        duration
      };
    }
  };

  const testTrpcRoute = async (routeName: string, route: string): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      let result;
      
      // Use the trpcClient directly for testing
      switch (route) {
        case 'example.hi':
          result = await trpcClient.example.hi.mutate({ name: 'Test' });
          break;
        case 'system.apiStatus':
          result = await trpcClient.system.apiStatus.query();
          break;
        case 'nutrition.search':
          result = await trpcClient.nutrition.search.query({ query: 'apple' });
          break;
        case 'fitness.exercises':
          result = await trpcClient.fitness.exercises.query({ muscle: 'chest' });
          break;
        case 'health.bloodwork':
          result = await trpcClient.health.bloodwork.mutate({ bloodworkData: {}, userProfile: {} });
          break;
        case 'coaching.list':
          result = await trpcClient.coaching.list.query({ specialty: 'fitness' });
          break;
        case 'shop.products':
          result = await trpcClient.shop.products.query({ category: 'supplements' });
          break;
        default:
          throw new Error(`Unknown route: ${route}`);
      }

      const duration = Date.now() - startTime;
      return {
        name: `tRPC: ${routeName}`,
        status: 'success',
        message: '✅ Route accessible and responding',
        details: result,
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      return {
        name: `tRPC: ${routeName}`,
        status: 'error',
        message: `❌ ${error.message}`,
        details: error,
        duration
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    clearResults();

    // Test API endpoints
    for (const endpoint of API_ENDPOINTS) {
      setCurrentTest(`Testing ${endpoint.name}...`);
      const result = await testApiEndpoint(endpoint);
      addResult(result);
    }

    // Test tRPC routes
    for (const { name, route } of TRPC_ROUTES) {
      setCurrentTest(`Testing tRPC ${name}...`);
      const result = await testTrpcRoute(name, route);
      addResult(result);
    }

    // Test environment variables
    setCurrentTest('Checking environment variables...');
    const envResult = checkEnvironmentVariables();
    addResult(envResult);

    // Test RORK toolkit APIs
    setCurrentTest('Testing RORK Toolkit APIs...');
    const rorkResult = await testRorkToolkitApis();
    addResult(rorkResult);

    setCurrentTest('');
    setIsRunning(false);
  };

  const testRorkToolkitApis = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      // Test RORK Toolkit LLM API
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'Hello, this is a test message.' }
          ]
        })
      });

      const duration = Date.now() - startTime;
      
      if (response.ok) {
        const result = await response.json();
        return {
          name: 'RORK Toolkit APIs',
          status: 'success',
          message: '✅ RORK Toolkit LLM API responding',
          details: result,
          duration
        };
      } else {
        return {
          name: 'RORK Toolkit APIs',
          status: 'error',
          message: `❌ RORK Toolkit API Error: ${response.status}`,
          details: await response.text(),
          duration
        };
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      return {
        name: 'RORK Toolkit APIs',
        status: 'error',
        message: `❌ RORK Toolkit Network Error: ${error.message}`,
        details: error,
        duration
      };
    }
  };

  const checkEnvironmentVariables = (): TestResult => {
    const requiredVars = [
      'EXPO_PUBLIC_RORK_API_BASE_URL',
      'EXPO_PUBLIC_RIP360_NINJA_API_KEY',
      'EXPO_PUBLIC_RIP360_NUTRITION_API_KEY',
      'EXPO_PUBLIC_RIP360_HEALTH_FDA_API_KEY'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    const presentVars = requiredVars.filter(varName => process.env[varName]);

    if (missingVars.length === 0) {
      return {
        name: 'Environment Variables',
        status: 'success',
        message: '✅ All required environment variables are set',
        details: { present: presentVars }
      };
    } else if (presentVars.length > 0) {
      return {
        name: 'Environment Variables',
        status: 'warning',
        message: `⚠️ Some variables missing: ${missingVars.join(', ')}`,
        details: { present: presentVars, missing: missingVars }
      };
    } else {
      return {
        name: 'Environment Variables',
        status: 'error',
        message: '❌ No required environment variables found',
        details: { missing: missingVars }
      };
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={20} color={colors.status.success} />;
      case 'error':
        return <XCircle size={20} color={colors.status.error} />;
      case 'warning':
        return <AlertCircle size={20} color={colors.status.warning} />;
      default:
        return <RefreshCw size={20} color={colors.text.secondary} />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return colors.status.success;
      case 'error':
        return colors.status.error;
      case 'warning':
        return colors.status.warning;
      default:
        return colors.text.secondary;
    }
  };

  const showResultDetails = (result: TestResult) => {
    // Log details to console for debugging
    console.log('Test Result Details:', {
      name: result.name,
      status: result.status,
      message: result.message,
      duration: result.duration,
      details: result.details
    });
    // Note: Details logged to console for web compatibility
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const warningCount = results.filter(r => r.status === 'warning').length;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'API Connection Test',
          headerStyle: { backgroundColor: colors.background.secondary },
          headerTintColor: colors.text.primary
        }} 
      />
      
      <View style={styles.header}>
        <View style={styles.statusRow}>
          <Wifi size={24} color={colors.status.info} />
          <Text style={styles.title}>API Connection Test</Text>
        </View>
        
        {results.length > 0 && (
          <View style={styles.summary}>
            <View style={styles.summaryItem}>
              <CheckCircle size={16} color={colors.status.success} />
              <Text style={[styles.summaryText, { color: colors.status.success }]}>
                {successCount}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <AlertCircle size={16} color={colors.status.warning} />
              <Text style={[styles.summaryText, { color: colors.status.warning }]}>
                {warningCount}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <XCircle size={16} color={colors.status.error} />
              <Text style={[styles.summaryText, { color: colors.status.error }]}>
                {errorCount}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, isRunning && styles.buttonDisabled]}
          onPress={runAllTests}
          disabled={isRunning}
        >
          <RefreshCw size={20} color={colors.text.primary} />
          <Text style={styles.buttonText}>
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Text>
        </TouchableOpacity>
        
        {results.length > 0 && (
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearResults}
          >
            <Text style={styles.buttonText}>Clear Results</Text>
          </TouchableOpacity>
        )}
      </View>

      {currentTest && (
        <View style={styles.currentTest}>
          <RefreshCw size={16} color={colors.status.info} />
          <Text style={styles.currentTestText}>{currentTest}</Text>
        </View>
      )}

      <ScrollView style={styles.results}>
        {results.map((result, index) => (
          <TouchableOpacity
            key={`${result.name}-${index}`}
            style={styles.resultItem}
            onPress={() => showResultDetails(result)}
          >
            <View style={styles.resultHeader}>
              <View style={styles.resultTitle}>
                {getStatusIcon(result.status)}
                <Text style={styles.resultName}>{result.name}</Text>
              </View>
              {result.duration && (
                <Text style={styles.duration}>{result.duration}ms</Text>
              )}
            </View>
            <Text style={[styles.resultMessage, { color: getStatusColor(result.status) }]}>
              {result.message}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginLeft: 10,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.status.info,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.text.disabled,
  },
  clearButton: {
    backgroundColor: colors.background.secondary,
  },
  buttonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  currentTest: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.background.secondary,
    gap: 8,
  },
  currentTestText: {
    color: colors.status.info,
    fontSize: 14,
    fontStyle: 'italic',
  },
  results: {
    flex: 1,
    padding: 20,
  },
  resultItem: {
    backgroundColor: colors.background.card,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  resultTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  duration: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  resultMessage: {
    fontSize: 14,
    marginTop: 5,
  },
});