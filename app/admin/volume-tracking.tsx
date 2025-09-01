import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Clock,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Zap,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface VolumeMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
  description: string;
}

interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
}

interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

const { width } = Dimensions.get('window');

export default function VolumeTrackingScreen() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [refreshing, setRefreshing] = useState(false);

  const volumeMetrics: VolumeMetric[] = [
    {
      id: '1',
      title: 'Active Users',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: colors.accent.primary,
      description: 'Users active in the last 24h'
    },
    {
      id: '2',
      title: 'API Requests',
      value: '45.2K',
      change: '+8.3%',
      trend: 'up',
      icon: Zap,
      color: colors.status.success,
      description: 'Total API calls made'
    },
    {
      id: '3',
      title: 'Avg Response Time',
      value: '245ms',
      change: '-5.2%',
      trend: 'down',
      icon: Clock,
      color: colors.status.warning,
      description: 'Average server response time'
    },
    {
      id: '4',
      title: 'Error Rate',
      value: '0.8%',
      change: '+0.3%',
      trend: 'up',
      icon: AlertTriangle,
      color: colors.status.error,
      description: 'Percentage of failed requests'
    },
    {
      id: '5',
      title: 'Data Transfer',
      value: '2.1GB',
      change: '+15.7%',
      trend: 'up',
      icon: BarChart3,
      color: colors.accent.secondary,
      description: 'Total data transferred'
    },
    {
      id: '6',
      title: 'Peak Concurrent',
      value: '892',
      change: '+22.1%',
      trend: 'up',
      icon: Activity,
      color: colors.status.info,
      description: 'Peak concurrent users'
    },
  ];

  const recentActivity: UserActivity[] = [
    {
      id: '1',
      userId: 'user_123',
      userName: 'John Doe',
      action: 'Bloodwork Upload',
      timestamp: '2 minutes ago',
      details: 'Uploaded 3 lab result images',
      severity: 'medium'
    },
    {
      id: '2',
      userId: 'user_456',
      userName: 'Sarah Johnson',
      action: 'Workout Generation',
      timestamp: '5 minutes ago',
      details: 'Generated AI workout plan',
      severity: 'low'
    },
    {
      id: '3',
      userId: 'user_789',
      userName: 'Mike Chen',
      action: 'Coach Message',
      timestamp: '8 minutes ago',
      details: 'Sent message to coach about nutrition',
      severity: 'low'
    },
    {
      id: '4',
      userId: 'user_101',
      userName: 'Emily Rodriguez',
      action: 'Supplement Scan',
      timestamp: '12 minutes ago',
      details: 'Scanned barcode for supplement info',
      severity: 'low'
    },
    {
      id: '5',
      userId: 'user_202',
      userName: 'David Wilson',
      action: 'Error Report',
      timestamp: '15 minutes ago',
      details: 'Reported app crash during workout',
      severity: 'high'
    },
  ];

  const systemAlerts: SystemAlert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'High API Usage',
      message: 'API usage is 85% of daily limit',
      timestamp: '10 minutes ago',
      resolved: false
    },
    {
      id: '2',
      type: 'error',
      title: 'Database Connection',
      message: 'Intermittent database connection issues',
      timestamp: '25 minutes ago',
      resolved: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'System maintenance scheduled for tonight',
      timestamp: '1 hour ago',
      resolved: true
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Refreshed', 'Volume data has been updated');
    }, 1500);
  };

  const handleMetricClick = (metric: VolumeMetric) => {
    Alert.alert(
      metric.title,
      `${metric.description}\n\nCurrent Value: ${metric.value}\nChange: ${metric.change}\nTrend: ${metric.trend}`,
      [
        { text: 'OK', style: 'default' },
        { text: 'View Details', onPress: () => Alert.alert('Details', 'Detailed analytics would be shown here.') }
      ]
    );
  };

  const handleActivityClick = (activity: UserActivity) => {
    Alert.alert(
      'User Activity Details',
      `User: ${activity.userName}\nAction: ${activity.action}\nTime: ${activity.timestamp}\nDetails: ${activity.details}\nSeverity: ${activity.severity}`,
      [
        { text: 'OK', style: 'default' },
        { text: 'View User', onPress: () => Alert.alert('User Profile', 'User profile would be shown here.') }
      ]
    );
  };

  const handleAlertClick = (alert: SystemAlert) => {
    Alert.alert(
      alert.title,
      `${alert.message}\n\nType: ${alert.type}\nTime: ${alert.timestamp}\nStatus: ${alert.resolved ? 'Resolved' : 'Active'}`,
      [
        { text: 'OK', style: 'default' },
        !alert.resolved && { text: 'Mark Resolved', onPress: () => Alert.alert('Resolved', 'Alert marked as resolved.') }
      ].filter(Boolean) as any
    );
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} color={colors.status.success} />;
      case 'down':
        return <TrendingDown size={16} color={colors.status.error} />;
      default:
        return <Activity size={16} color={colors.text.secondary} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return colors.status.error;
      case 'medium':
        return colors.status.warning;
      default:
        return colors.status.success;
    }
  };

  const getAlertIcon = (type: string, resolved: boolean) => {
    if (resolved) {
      return <CheckCircle size={20} color={colors.status.success} />;
    }
    switch (type) {
      case 'error':
        return <AlertTriangle size={20} color={colors.status.error} />;
      case 'warning':
        return <AlertTriangle size={20} color={colors.status.warning} />;
      default:
        return <Activity size={20} color={colors.status.info} />;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: 'Volume Tracking',
          headerRight: () => (
            <Button
              title="Refresh"
              onPress={handleRefresh}
              variant="outline"
              loading={refreshing}
              style={styles.refreshButton}
            />
          ),
        }}
      />

      <View style={styles.header}>
        <Text style={styles.title}>System Volume Monitoring</Text>
        <Text style={styles.subtitle}>Real-time user activity and system metrics</Text>
        
        <View style={styles.timeframeSelector}>
          {(['1h', '24h', '7d', '30d'] as const).map((timeframe) => (
            <TouchableOpacity
              key={timeframe}
              style={[
                styles.timeframeButton,
                selectedTimeframe === timeframe && styles.timeframeButtonActive
              ]}
              onPress={() => setSelectedTimeframe(timeframe)}
            >
              <Text style={[
                styles.timeframeText,
                selectedTimeframe === timeframe && styles.timeframeTextActive
              ]}>
                {timeframe}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.metricsGrid}>
        {volumeMetrics.map((metric) => (
          <TouchableOpacity
            key={metric.id}
            style={styles.metricCard}
            onPress={() => handleMetricClick(metric)}
            activeOpacity={0.8}
          >
            <Card style={styles.metricCardInner}>
              <View style={styles.metricHeader}>
                <View style={[styles.metricIcon, { backgroundColor: `${metric.color}20` }]}>
                  <metric.icon size={20} color={metric.color} />
                </View>
                <View style={styles.metricTrend}>
                  {getTrendIcon(metric.trend)}
                  <Text style={[
                    styles.metricChange,
                    { color: metric.trend === 'up' ? colors.status.success : colors.status.error }
                  ]}>
                    {metric.change}
                  </Text>
                </View>
              </View>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricTitle}>{metric.title}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Alerts</Text>
        {systemAlerts.map((alert) => (
          <TouchableOpacity
            key={alert.id}
            onPress={() => handleAlertClick(alert)}
            activeOpacity={0.9}
          >
            <Card style={[
              styles.alertCard,
              !alert.resolved && styles.alertCardActive
            ]}>
              <View style={styles.alertHeader}>
                {getAlertIcon(alert.type, alert.resolved)}
                <View style={styles.alertInfo}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                </View>
                <View style={styles.alertMeta}>
                  <Text style={styles.alertTime}>{alert.timestamp}</Text>
                  <Badge 
                    variant={alert.resolved ? 'success' : alert.type === 'error' ? 'error' : 'warning'}
                    style={styles.alertBadge}
                  >
                    {alert.resolved ? 'Resolved' : alert.type.toUpperCase()}
                  </Badge>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent User Activity</Text>
        {recentActivity.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            onPress={() => handleActivityClick(activity)}
            activeOpacity={0.9}
          >
            <Card style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityUser}>{activity.userName}</Text>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityDetails}>{activity.details}</Text>
                </View>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityTime}>{activity.timestamp}</Text>
                  <View style={[
                    styles.severityDot,
                    { backgroundColor: getSeverityColor(activity.severity) }
                  ]} />
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 20,
  },
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 4,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  timeframeButtonActive: {
    backgroundColor: colors.accent.primary,
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  timeframeTextActive: {
    color: colors.text.primary,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    width: (width - 44) / 2,
  },
  metricCardInner: {
    padding: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  alertCard: {
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  alertCardActive: {
    borderColor: colors.status.warning,
    backgroundColor: `${colors.status.warning}05`,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  alertMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  alertTime: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  alertBadge: {
    alignSelf: 'flex-end',
  },
  activityCard: {
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  activityInfo: {
    flex: 1,
  },
  activityUser: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.accent.primary,
    marginBottom: 2,
  },
  activityDetails: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  activityMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  activityTime: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});