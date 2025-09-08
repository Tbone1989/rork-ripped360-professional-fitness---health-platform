import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { trpcClient } from '@/lib/trpc';
import { Button } from '@/components/ui/Button';

export default function TestTRPCSimpleScreen() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (result: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, `${timestamp}: ${result}`]);
    console.log(`tRPC Test ${timestamp}: ${result}`);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Test basic tRPC connection with the simplest endpoint
  const testBasicConnection = async () => {
    setIsLoading(true);
    addResult('🔄 Testing basic tRPC connection...');
    
    try {
      const result = await trpcClient.example.hi.mutate({ name: 'Simple Test' });
      addResult(`✅ Basic connection successful!`);
      addResult(`📄 Response: ${JSON.stringify(result, null, 2)}`);
    } catch (error: any) {
      addResult(`❌ Basic connection failed: ${error.message}`);
      addResult(`🔍 Error details: ${JSON.stringify(error, null, 2)}`);
      console.error('Basic connection error:', error);
    }
    
    setIsLoading(false);
  };

  // Test API status endpoint
  const testApiStatus = async () => {
    setIsLoading(true);
    addResult('🔄 Testing API status endpoint...');
    
    try {
      const result = await trpcClient.system.apiStatus.query();
      addResult(`✅ API status successful!`);
      addResult(`📊 Summary: ${result.summary.configured}/${result.summary.total} APIs configured`);
    } catch (error: any) {
      addResult(`❌ API status failed: ${error.message}`);
      console.error('API status error:', error);
    }
    
    setIsLoading(false);
  };

  // Test shop products endpoint
  const testShopProducts = async () => {
    setIsLoading(true);
    addResult('🔄 Testing shop products endpoint...');
    
    try {
      const result = await trpcClient.shop.products.query();
      addResult(`✅ Shop products successful!`);
      addResult(`🛍️ Found ${result.length} products`);
    } catch (error: any) {
      addResult(`❌ Shop products failed: ${error.message}`);
      console.error('Shop products error:', error);
    }
    
    setIsLoading(false);
  };

  // Test all endpoints sequentially
  const testAllEndpoints = async () => {
    setIsLoading(true);
    addResult('🚀 Starting comprehensive tRPC tests...');
    
    await testBasicConnection();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testApiStatus();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testShopProducts();

    addResult('🏁 All tests completed!');
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Simple tRPC Test',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Simple tRPC Connection Test</Text>
        <Text style={styles.subtitle}>Test basic tRPC functionality</Text>
        
        <View style={styles.configContainer}>
          <Text style={styles.configTitle}>Current Configuration:</Text>
          <Text style={styles.configText}>
            RORK URL: {process.env.EXPO_PUBLIC_RORK_URL || 'Not set'}
          </Text>
          <Text style={styles.configText}>
            Project ID: {process.env.EXPO_PUBLIC_RORK_PROJECT_ID || 'Not set'}
          </Text>
          <Text style={styles.configText}>
            Base URL: {process.env.EXPO_PUBLIC_TRPC_BASE_URL || 'Not set'}
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Test Basic Connection"
            onPress={testBasicConnection}
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
            title="Test Shop Products"
            onPress={testShopProducts}
            disabled={isLoading}
            style={styles.testButton}
          />
          
          <Button
            title="Run All Tests"
            onPress={testAllEndpoints}
            disabled={isLoading}
            style={[styles.testButton, styles.primaryButton]}
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
              <Text key={`result-${index}-${result.substring(0, 20)}`} style={styles.resultText}>
                {result}
              </Text>
            ))
          )}
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
  configContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  testButton: {
    marginBottom: 0,
  },
  primaryButton: {
    backgroundColor: colors.accent.primary,
  },
  resultsContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    minHeight: 200,
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
    fontSize: 11,
    color: colors.text.primary,
    marginBottom: 4,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});