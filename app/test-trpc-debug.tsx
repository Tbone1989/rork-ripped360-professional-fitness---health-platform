import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/Button';

export default function TRPCDebugScreen() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use tRPC hooks for reactive queries
  const hiMutation = trpc.example.hi.useMutation();
  const shopProductsQuery = trpc.shop.products.useQuery({}, { enabled: false });
  const apiStatusQuery = trpc.system.apiStatus.useQuery(undefined, { enabled: false });

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Test basic tRPC connection
  const testBasicConnection = async () => {
    setIsLoading(true);
    addResult('🔄 Testing basic tRPC connection...');
    
    try {
      const result = await hiMutation.mutateAsync({ name: 'Debug Test' });
      addResult(`✅ Basic connection successful: ${JSON.stringify(result)}`);
    } catch (error: any) {
      addResult(`❌ Basic connection failed: ${error.message}`);
      console.error('Basic connection error:', error);
    }
    
    setIsLoading(false);
  };

  // Test shop products endpoint
  const testShopProducts = async () => {
    setIsLoading(true);
    addResult('🔄 Testing shop products endpoint...');
    
    try {
      const result = await shopProductsQuery.refetch();
      if (result.data) {
        addResult(`✅ Shop products successful: ${result.data.length} products loaded`);
      } else {
        addResult(`❌ Shop products failed: No data returned`);
      }
    } catch (error: any) {
      addResult(`❌ Shop products failed: ${error.message}`);
      console.error('Shop products error:', error);
    }
    
    setIsLoading(false);
  };

  // Test API status endpoint
  const testApiStatus = async () => {
    setIsLoading(true);
    addResult('🔄 Testing API status endpoint...');
    
    try {
      const result = await apiStatusQuery.refetch();
      if (result.data) {
        addResult(`✅ API status successful: ${JSON.stringify(result.data)}`);
      } else {
        addResult(`❌ API status failed: No data returned`);
      }
    } catch (error: any) {
      addResult(`❌ API status failed: ${error.message}`);
      console.error('API status error:', error);
    }
    
    setIsLoading(false);
  };

  // Test backend health check
  const testBackendHealth = async () => {
    setIsLoading(true);
    addResult('🔄 Testing backend health check...');
    
    const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || '';
    const healthUrls = [
      `${baseUrl}/api`,
      `${baseUrl}/`,
      '/api',
      '/'
    ];
    
    for (const url of healthUrls) {
      try {
        addResult(`🔄 Health check: ${url}`);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        const text = await response.text();
        addResult(`📡 Health Response ${response.status}: ${text.substring(0, 200)}`);
        
        if (response.ok) {
          addResult(`✅ Backend health check successful for: ${url}`);
          break;
        }
      } catch (error: any) {
        addResult(`❌ Health check failed for ${url}: ${error.message}`);
      }
    }
    
    setIsLoading(false);
  };

  // Test direct fetch to backend
  const testDirectFetch = async () => {
    setIsLoading(true);
    addResult('🔄 Testing direct fetch to backend...');
    
    const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || '';
    const testUrls = [
      `${baseUrl}/api/trpc/example.hi`,
      `${baseUrl}/trpc/example.hi`,
      '/api/trpc/example.hi',
      '/trpc/example.hi'
    ];
    
    for (const url of testUrls) {
      try {
        addResult(`🔄 Trying: ${url}`);
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            json: { name: 'Direct Fetch Test' },
            meta: { values: { name: ['undefined'] } }
          })
        });
        
        const text = await response.text();
        addResult(`📡 Response ${response.status}: ${text.substring(0, 200)}`);
        
        if (response.ok) {
          addResult(`✅ Direct fetch successful for: ${url}`);
          break;
        }
      } catch (error: any) {
        addResult(`❌ Direct fetch failed for ${url}: ${error.message}`);
      }
    }
    
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'tRPC Debug',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>tRPC Connection Debug</Text>
        <Text style={styles.subtitle}>Test various tRPC endpoints and connections</Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Test Basic Connection"
            onPress={testBasicConnection}
            disabled={isLoading}
            style={styles.testButton}
          />
          
          <Button
            title="Test Shop Products"
            onPress={testShopProducts}
            disabled={isLoading}
            style={styles.testButton}
          />
          
          <Button
            title="Test API Status"
            onPress={testApiStatus}
            disabled={isLoading}
            style={styles.testButton}
          />
          
          <Button
            title="Test Backend Health"
            onPress={testBackendHealth}
            disabled={isLoading}
            style={styles.testButton}
          />
          
          <Button
            title="Test Direct Fetch"
            onPress={testDirectFetch}
            disabled={isLoading}
            style={styles.testButton}
          />
          
          <Button
            title="Clear Results"
            onPress={clearResults}
            variant="outline"
            style={styles.testButton}
          />
        </View>
        
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Results:</Text>
          {testResults.length === 0 ? (
            <Text style={styles.noResults}>No tests run yet</Text>
          ) : (
            testResults.map((result, index) => (
              <Text key={index} style={styles.resultText}>
                {result}
              </Text>
            ))
          )}
        </View>
        
        <View style={styles.configContainer}>
          <Text style={styles.configTitle}>Configuration:</Text>
          <Text style={styles.configText}>
            EXPO_PUBLIC_RORK_API_BASE_URL: {process.env.EXPO_PUBLIC_RORK_API_BASE_URL || 'Not set'}
          </Text>
          <Text style={styles.configText}>
            EXPO_PUBLIC_TRPC_URL: {process.env.EXPO_PUBLIC_TRPC_URL || 'Not set'}
          </Text>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  testButton: {
    marginBottom: 0,
  },
  resultsContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  noResults: {
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  resultText: {
    fontSize: 12,
    color: colors.text.primary,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  configContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
  },
  configTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  configText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});