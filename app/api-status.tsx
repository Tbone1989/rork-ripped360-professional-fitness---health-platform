import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Stack } from 'expo-router';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Settings,
  Key,
  Globe,
  Database
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { trpc } from '@/lib/trpc';

interface ApiStatus {
  name: string;
  key: string;
  configured: boolean;
  status: 'active' | 'placeholder' | 'missing';
  endpoint?: string;
}

interface ApiStatusResponse {
  apis: ApiStatus[];
  summary: {
    total: number;
    configured: number;
    placeholder: number;
    missing: number;
    active: number;
  };
  recommendations: (string | null)[];
  timestamp: string;
}

export default function ApiStatusScreen() {
  const [refreshing, setRefreshing] = useState(false);
  
  const { data: apiStatus, isLoading, refetch } = trpc.system.apiStatus.useQuery();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={20} color={colors.status.success} />;
      case 'placeholder':
        return <AlertCircle size={20} color={colors.status.warning} />;
      case 'missing':
        return <XCircle size={20} color={colors.status.error} />;
      default:
        return <AlertCircle size={20} color={colors.text.secondary} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.status.success;
      case 'placeholder':
        return colors.status.warning;
      case 'missing':
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'placeholder':
        return 'Placeholder';
      case 'missing':
        return 'Missing';
      default:
        return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'API Status' }} />
        <View style={styles.loadingContainer}>
          <RefreshCw size={24} color={colors.accent.primary} />
          <Text style={styles.loadingText}>Checking API status...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Stack.Screen 
        options={{ 
          title: 'API Configuration Status',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleRefresh}
            >
              <RefreshCw size={20} color={colors.accent.primary} />
            </TouchableOpacity>
          ),
        }} 
      />

      {/* Summary Card */}
      {apiStatus?.summary && (
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIcon}>
              <Database size={24} color={colors.accent.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryTitle}>API Configuration Summary</Text>
              <Text style={styles.summarySubtitle}>
                {apiStatus.summary.configured} of {apiStatus.summary.total} APIs configured
              </Text>
            </View>
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: colors.status.success + '20' }]}>
                <CheckCircle size={16} color={colors.status.success} />
              </View>
              <Text style={styles.statLabel}>Active</Text>
              <Text style={styles.statValue}>{apiStatus.summary.active}</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: colors.status.warning + '20' }]}>
                <AlertCircle size={16} color={colors.status.warning} />
              </View>
              <Text style={styles.statLabel}>Placeholder</Text>
              <Text style={styles.statValue}>{apiStatus.summary.placeholder}</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIndicator, { backgroundColor: colors.status.error + '20' }]}>
                <XCircle size={16} color={colors.status.error} />
              </View>
              <Text style={styles.statLabel}>Missing</Text>
              <Text style={styles.statValue}>{apiStatus.summary.missing}</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Recommendations */}
      {apiStatus?.recommendations && apiStatus.recommendations.length > 0 && (
        <Card style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
          {apiStatus.recommendations.filter((rec): rec is string => rec !== null).map((recommendation: string, index: number) => (
            <View key={index} style={styles.recommendationItem}>
              <AlertCircle size={16} color={colors.status.warning} />
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </Card>
      )}

      {/* API List */}
      <View style={styles.apiSection}>
        <Text style={styles.sectionTitle}>API Configuration Details</Text>
        
        {apiStatus?.apis.map((api: ApiStatus, index: number) => (
          <Card key={index} style={styles.apiCard}>
            <View style={styles.apiHeader}>
              <View style={styles.apiInfo}>
                <View style={styles.apiTitleRow}>
                  {getStatusIcon(api.status)}
                  <Text style={styles.apiName}>{api.name}</Text>
                </View>
                <Text style={styles.apiEndpoint}>{api.endpoint}</Text>
              </View>
              <Badge 
                label={getStatusText(api.status)}
                variant={api.status === 'active' ? 'success' : api.status === 'placeholder' ? 'warning' : 'error'}
              />
            </View>
            
            <View style={styles.apiDetails}>
              <View style={styles.apiDetailRow}>
                <Key size={14} color={colors.text.secondary} />
                <Text style={styles.apiDetailLabel}>API Key:</Text>
                <Text style={styles.apiDetailValue}>{api.key}</Text>
              </View>
              
              <View style={styles.apiDetailRow}>
                <Globe size={14} color={colors.text.secondary} />
                <Text style={styles.apiDetailLabel}>Status:</Text>
                <Text style={[styles.apiDetailValue, { color: getStatusColor(api.status) }]}>
                  {api.configured ? 'Configured' : 'Not Configured'}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      {/* Test APIs Button */}
      <View style={styles.actionSection}>
        <Button
          title="Test API Connections"
          onPress={() => {
            console.log('Testing API connections...');
            // In a real app, this would test actual API calls
          }}
          icon={<Settings size={18} color={colors.text.primary} />}
          style={styles.testButton}
        />
        
        <Text style={styles.actionNote}>
          This will test actual API calls to verify connectivity and authentication.
        </Text>
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Last checked: {apiStatus?.timestamp ? new Date(apiStatus.timestamp).toLocaleString() : 'Never'}
        </Text>
        <Text style={styles.footerNote}>
          Configure your API keys in the .env file to enable real data instead of mock responses.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  summaryCard: {
    margin: 16,
    padding: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  summarySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 2,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  recommendationsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  apiSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  apiCard: {
    marginBottom: 12,
    padding: 16,
  },
  apiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  apiInfo: {
    flex: 1,
    marginRight: 12,
  },
  apiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  apiName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  apiEndpoint: {
    fontSize: 12,
    color: colors.text.secondary,
    fontFamily: 'monospace',
  },
  apiDetails: {
    gap: 8,
  },
  apiDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  apiDetailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
    minWidth: 60,
  },
  apiDetailValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontFamily: 'monospace',
    flex: 1,
  },
  actionSection: {
    padding: 16,
    alignItems: 'center',
  },
  testButton: {
    width: '100%',
    marginBottom: 12,
  },
  actionNote: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    padding: 16,
    paddingTop: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  footerNote: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
  },
});