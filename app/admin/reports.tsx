import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  FileText,
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ReportData {
  id: string;
  title: string;
  description: string;
  type: 'user' | 'financial' | 'activity' | 'system';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastGenerated: string;
  size: string;
  status: 'ready' | 'generating' | 'error';
}

const mockReports: ReportData[] = [
  {
    id: '1',
    title: 'User Analytics Report',
    description: 'Comprehensive user behavior and engagement metrics',
    type: 'user',
    period: 'monthly',
    lastGenerated: '2 hours ago',
    size: '2.4 MB',
    status: 'ready',
  },
  {
    id: '2',
    title: 'Revenue Analysis',
    description: 'Subscription revenue and payment analytics',
    type: 'financial',
    period: 'monthly',
    lastGenerated: '1 day ago',
    size: '1.8 MB',
    status: 'ready',
  },
  {
    id: '3',
    title: 'Workout Activity Report',
    description: 'User workout patterns and exercise popularity',
    type: 'activity',
    period: 'weekly',
    lastGenerated: '3 hours ago',
    size: '3.2 MB',
    status: 'ready',
  },
  {
    id: '4',
    title: 'System Performance',
    description: 'Server performance and system health metrics',
    type: 'system',
    period: 'daily',
    lastGenerated: '30 minutes ago',
    size: '856 KB',
    status: 'generating',
  },
];

export default function AdminReportsScreen() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportData[]>(mockReports);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const { isAdmin, user } = useUserStore((s) => ({ isAdmin: s.isAdmin, user: s.user }));

  useEffect(() => {
    const admin = isAdmin || (user?.role === 'admin');
    if (!admin) {
      router.replace('/admin/login');
    }
  }, [isAdmin, user, router]);

  const handleGenerateReport = (reportId: string) => {
    setReports(prev =>
      prev.map(report =>
        report.id === reportId
          ? { ...report, status: 'generating' as const }
          : report
      )
    );

    // Simulate report generation
    setTimeout(() => {
      setReports(prev =>
        prev.map(report =>
          report.id === reportId
            ? {
                ...report,
                status: 'ready' as const,
                lastGenerated: 'Just now',
              }
            : report
        )
      );
      Alert.alert('Success', 'Report generated successfully');
    }, 3000);
  };

  const handleDownloadReport = (reportTitle: string) => {
    Alert.alert('Download', `Downloading ${reportTitle}...`);
  };

  const handleScheduleReport = (reportId: string) => {
    Alert.alert(
      'Schedule Report',
      'Set up automatic report generation schedule',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Daily', onPress: () => Alert.alert('Scheduled', 'Report scheduled daily') },
        { text: 'Weekly', onPress: () => Alert.alert('Scheduled', 'Report scheduled weekly') },
        { text: 'Monthly', onPress: () => Alert.alert('Scheduled', 'Report scheduled monthly') },
      ]
    );
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'user':
        return Users;
      case 'financial':
        return DollarSign;
      case 'activity':
        return Activity;
      case 'system':
        return BarChart3;
      default:
        return FileText;
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'ready':
        return 'success';
      case 'generating':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'success';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user':
        return colors.accent.primary;
      case 'financial':
        return colors.status.success;
      case 'activity':
        return colors.status.warning;
      case 'system':
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  };

  const analyticsStats = [
    { title: 'Total Reports', value: '156', icon: FileText, color: colors.accent.primary },
    { title: 'This Month', value: '24', icon: Calendar, color: colors.status.success },
    { title: 'Scheduled', value: '8', icon: TrendingUp, color: colors.status.warning },
    { title: 'Storage Used', value: '2.1 GB', icon: BarChart3, color: colors.status.error },
  ];

  const quickReports = [
    { title: 'User Growth', icon: TrendingUp, description: 'Last 30 days user acquisition' },
    { title: 'Revenue Summary', icon: DollarSign, description: 'Monthly revenue breakdown' },
    { title: 'Top Workouts', icon: Activity, description: 'Most popular exercises' },
    { title: 'System Health', icon: BarChart3, description: 'Current system status' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: 'Reports & Analytics',
          headerBackTitle: 'Admin',
        }}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Analytics Dashboard</Text>
        <Text style={styles.subtitle}>Generate and manage system reports</Text>
      </View>

      <View style={styles.statsGrid}>
        {analyticsStats.map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <View style={styles.statHeader}>
              <stat.icon size={24} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
            <Text style={styles.statTitle}>{stat.title}</Text>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Reports</Text>
        <View style={styles.quickReportsGrid}>
          {quickReports.map((report, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickReportCard}
              onPress={() => Alert.alert('Generate Report', `Generate ${report.title} report?`)}
            >
              <report.icon size={24} color={colors.accent.primary} />
              <Text style={styles.quickReportTitle}>{report.title}</Text>
              <Text style={styles.quickReportDesc}>{report.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Report Library</Text>
          <View style={styles.periodSelector}>
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodText,
                  selectedPeriod === period && styles.periodTextActive
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {reports
          .filter(report => report.period === selectedPeriod)
          .map((report) => {
            const ReportIcon = getReportIcon(report.type);
            return (
              <Card key={report.id} style={styles.reportCard}>
                <View style={styles.reportHeader}>
                  <View style={styles.reportInfo}>
                    <View style={styles.reportTitleRow}>
                      <ReportIcon size={20} color={getTypeColor(report.type)} />
                      <Text style={styles.reportTitle}>{report.title}</Text>
                    </View>
                    <Text style={styles.reportDescription}>{report.description}</Text>
                    <View style={styles.reportMeta}>
                      <Badge
                        variant="info"
                        style={styles.typeBadge}
                      >
                        {report.type}
                      </Badge>
                      <Badge
                        variant={getStatusVariant(report.status)}
                        style={styles.statusBadge}
                      >
                        {report.status}
                      </Badge>
                      <Text style={styles.reportSize}>{report.size}</Text>
                    </View>
                  </View>
                  <View style={styles.reportActions}>
                    <Text style={styles.lastGenerated}>Generated: {report.lastGenerated}</Text>
                    <View style={styles.actionButtons}>
                      {report.status === 'ready' && (
                        <TouchableOpacity
                          style={styles.iconButton}
                          onPress={() => handleDownloadReport(report.title)}
                        >
                          <Download size={16} color={colors.accent.primary} />
                        </TouchableOpacity>
                      )}
                      <Button
                        title={report.status === 'generating' ? 'Generating...' : 'Generate'}
                        variant="outline"
                        onPress={() => handleGenerateReport(report.id)}
                        disabled={report.status === 'generating'}
                        style={styles.actionButton}
                      />
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => handleScheduleReport(report.id)}
                      >
                        <Calendar size={16} color={colors.text.secondary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Card>
            );
          })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Visualization</Text>
        <View style={styles.chartGrid}>
          <TouchableOpacity
            style={styles.chartCard}
            onPress={() => Alert.alert('Chart View', 'Open user growth chart')}
          >
            <LineChart size={32} color={colors.accent.primary} />
            <Text style={styles.chartTitle}>User Growth</Text>
            <Text style={styles.chartValue}>+12.5%</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chartCard}
            onPress={() => Alert.alert('Chart View', 'Open revenue breakdown')}
          >
            <PieChart size={32} color={colors.status.success} />
            <Text style={styles.chartTitle}>Revenue</Text>
            <Text style={styles.chartValue}>$24.8K</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chartCard}
            onPress={() => Alert.alert('Chart View', 'Open activity metrics')}
          >
            <BarChart3 size={32} color={colors.status.warning} />
            <Text style={styles.chartTitle}>Activity</Text>
            <Text style={styles.chartValue}>89.2%</Text>
          </TouchableOpacity>
        </View>
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
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  statTitle: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickReportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickReportCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  quickReportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  quickReportDesc: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 4,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  periodButtonActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  periodText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  periodTextActive: {
    color: colors.background.primary,
  },
  reportCard: {
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  reportHeader: {
    gap: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  reportDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  reportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  typeBadge: {
    marginRight: 0,
  },
  statusBadge: {
    marginRight: 0,
  },
  reportSize: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  reportActions: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingTop: 12,
  },
  lastGenerated: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    flex: 0,
    paddingHorizontal: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
  },
  chartGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  chartCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  chartValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent.primary,
  },
});