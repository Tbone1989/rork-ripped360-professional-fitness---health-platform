import React, { useState } from 'react';
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
  Database,
  Server,
  HardDrive,
  Activity,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Shield,
  AlertTriangle,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface DatabaseInfo {
  name: string;
  type: string;
  size: string;
  status: 'healthy' | 'warning' | 'error';
  lastBackup: string;
  connections: number;
}

const mockDatabases: DatabaseInfo[] = [
  {
    name: 'Users Database',
    type: 'PostgreSQL',
    size: '2.4 GB',
    status: 'healthy',
    lastBackup: '2 hours ago',
    connections: 45,
  },
  {
    name: 'Workouts Database',
    type: 'MongoDB',
    size: '1.8 GB',
    status: 'healthy',
    lastBackup: '1 hour ago',
    connections: 23,
  },
  {
    name: 'Medical Records',
    type: 'PostgreSQL',
    size: '856 MB',
    status: 'warning',
    lastBackup: '6 hours ago',
    connections: 12,
  },
  {
    name: 'Analytics Cache',
    type: 'Redis',
    size: '124 MB',
    status: 'healthy',
    lastBackup: '30 minutes ago',
    connections: 8,
  },
];

export default function AdminDatabaseScreen() {
  const router = useRouter();
  const [databases, setDatabases] = useState<DatabaseInfo[]>(mockDatabases);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      Alert.alert('Success', 'Database status refreshed');
    }, 1500);
  };

  const handleBackup = (dbName: string) => {
    Alert.alert(
      'Backup Database',
      `Are you sure you want to backup ${dbName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Backup',
          onPress: () => {
            Alert.alert('Success', `Backup initiated for ${dbName}`);
          },
        },
      ]
    );
  };

  const handleOptimize = (dbName: string) => {
    Alert.alert(
      'Optimize Database',
      `This will optimize ${dbName} and may take several minutes. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Optimize',
          onPress: () => {
            Alert.alert('Success', `Optimization started for ${dbName}`);
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return colors.status.success;
      case 'warning':
        return colors.status.warning;
      case 'error':
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'success';
    }
  };

  const systemStats = [
    { title: 'Total Storage', value: '5.2 GB', icon: HardDrive, color: colors.accent.primary },
    { title: 'Active Connections', value: '88', icon: Activity, color: colors.status.success },
    { title: 'Backup Status', value: 'Current', icon: Shield, color: colors.status.success },
    { title: 'System Health', value: 'Good', icon: Server, color: colors.status.success },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: 'Database Management',
          headerBackTitle: 'Admin',
        }}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Database Administration</Text>
        <Text style={styles.subtitle}>Monitor and manage system databases</Text>
      </View>

      <View style={styles.statsGrid}>
        {systemStats.map((stat, index) => (
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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Database Status</Text>
          <TouchableOpacity
            onPress={handleRefresh}
            disabled={isRefreshing}
            style={styles.refreshButton}
          >
            <RefreshCw
              size={20}
              color={colors.accent.primary}
              style={isRefreshing ? styles.spinning : undefined}
            />
          </TouchableOpacity>
        </View>

        {databases.map((db, index) => (
          <Card key={index} style={styles.dbCard}>
            <View style={styles.dbHeader}>
              <View style={styles.dbInfo}>
                <Text style={styles.dbName}>{db.name}</Text>
                <Text style={styles.dbType}>{db.type}</Text>
                <View style={styles.dbMeta}>
                  <Badge
                    variant={getStatusVariant(db.status)}
                    style={styles.statusBadge}
                  >
                    {db.status}
                  </Badge>
                  <Text style={styles.dbSize}>{db.size}</Text>
                </View>
              </View>
              <View style={styles.dbStats}>
                <Text style={styles.connections}>{db.connections} connections</Text>
                <Text style={styles.lastBackup}>Backup: {db.lastBackup}</Text>
              </View>
            </View>

            <View style={styles.dbActions}>
              <Button
                title="Backup"
                variant="outline"
                onPress={() => handleBackup(db.name)}
                style={styles.actionButton}
              />
              <Button
                title="Optimize"
                variant="outline"
                onPress={() => handleOptimize(db.name)}
                style={styles.actionButton}
              />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => Alert.alert('Export', `Export ${db.name} data`)}
              >
                <Download size={16} color={colors.accent.primary} />
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Operations</Text>
        <View style={styles.operationsGrid}>
          <TouchableOpacity
            style={styles.operationCard}
            onPress={() => Alert.alert('Full Backup', 'Initiate full system backup')}
          >
            <Upload size={24} color={colors.accent.primary} />
            <Text style={styles.operationText}>Full Backup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.operationCard}
            onPress={() => Alert.alert('System Cleanup', 'Clean temporary files and logs')}
          >
            <Trash2 size={24} color={colors.status.warning} />
            <Text style={styles.operationText}>Cleanup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.operationCard}
            onPress={() => Alert.alert('Health Check', 'Run comprehensive system health check')}
          >
            <AlertTriangle size={24} color={colors.status.error} />
            <Text style={styles.operationText}>Health Check</Text>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  refreshButton: {
    padding: 8,
  },
  spinning: {
    // Add rotation animation if needed
  },
  dbCard: {
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  dbHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dbInfo: {
    flex: 1,
  },
  dbName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  dbType: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  dbMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    marginRight: 0,
  },
  dbSize: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  dbStats: {
    alignItems: 'flex-end',
  },
  connections: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  lastBackup: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  dbActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingTop: 12,
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
  operationsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  operationCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  operationText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});