import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Settings,
  Shield,
  Bell,
  Database,
  Mail,
  Globe,
  Lock,
  Users,
  Server,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SystemSetting {
  id: string;
  category: 'security' | 'notifications' | 'system' | 'api';
  title: string;
  description: string;
  type: 'toggle' | 'input' | 'select';
  value: any;
  options?: string[];
}

const mockSettings: SystemSetting[] = [
  {
    id: '1',
    category: 'security',
    title: 'Two-Factor Authentication',
    description: 'Require 2FA for all admin accounts',
    type: 'toggle',
    value: true,
  },
  {
    id: '2',
    category: 'security',
    title: 'Session Timeout',
    description: 'Auto-logout after inactivity (minutes)',
    type: 'input',
    value: '30',
  },
  {
    id: '3',
    category: 'security',
    title: 'Password Policy',
    description: 'Minimum password requirements',
    type: 'select',
    value: 'strong',
    options: ['basic', 'medium', 'strong'],
  },
  {
    id: '4',
    category: 'notifications',
    title: 'Email Notifications',
    description: 'Send system alerts via email',
    type: 'toggle',
    value: true,
  },
  {
    id: '5',
    category: 'notifications',
    title: 'Push Notifications',
    description: 'Send mobile push notifications',
    type: 'toggle',
    value: false,
  },
  {
    id: '6',
    category: 'system',
    title: 'Maintenance Mode',
    description: 'Enable system maintenance mode',
    type: 'toggle',
    value: false,
  },
  {
    id: '7',
    category: 'system',
    title: 'Debug Logging',
    description: 'Enable detailed system logging',
    type: 'toggle',
    value: true,
  },
  {
    id: '8',
    category: 'api',
    title: 'API Rate Limiting',
    description: 'Requests per minute per user',
    type: 'input',
    value: '100',
  },
];

export default function AdminSettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<SystemSetting[]>(mockSettings);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'security' | 'notifications' | 'system' | 'api'>('all');
  const [hasChanges, setHasChanges] = useState(false);
  const { isAdmin, user } = useUserStore((s) => ({ isAdmin: s.isAdmin, user: s.user }));

  useEffect(() => {
    const admin = isAdmin || (user?.role === 'admin');
    if (!admin) {
      router.replace('/admin/login');
    }
  }, [isAdmin, user, router]);

  const handleSettingChange = (settingId: string, newValue: any) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === settingId
          ? { ...setting, value: newValue }
          : setting
      )
    );
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    Alert.alert(
      'Save Settings',
      'Are you sure you want to save all changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            setHasChanges(false);
            Alert.alert('Success', 'Settings saved successfully');
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings(mockSettings);
            setHasChanges(false);
            Alert.alert('Success', 'Settings reset to defaults');
          },
        },
      ]
    );
  };

  const handleBackupSettings = () => {
    Alert.alert('Backup', 'Settings backup created successfully');
  };

  const handleRestoreSettings = () => {
    Alert.alert(
      'Restore Settings',
      'Restore settings from backup?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore', onPress: () => Alert.alert('Success', 'Settings restored from backup') },
      ]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security':
        return Shield;
      case 'notifications':
        return Bell;
      case 'system':
        return Server;
      case 'api':
        return Globe;
      default:
        return Settings;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security':
        return colors.status.error;
      case 'notifications':
        return colors.status.warning;
      case 'system':
        return colors.accent.primary;
      case 'api':
        return colors.status.success;
      default:
        return colors.text.secondary;
    }
  };

  const filteredSettings = selectedCategory === 'all'
    ? settings
    : settings.filter(setting => setting.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Server },
    { id: 'api', label: 'API', icon: Globe },
  ];

  const systemStats = [
    { title: 'Active Sessions', value: '24', icon: Users, color: colors.accent.primary },
    { title: 'System Uptime', value: '99.9%', icon: Server, color: colors.status.success },
    { title: 'API Calls Today', value: '12.4K', icon: Globe, color: colors.status.warning },
    { title: 'Security Events', value: '3', icon: Shield, color: colors.status.error },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: 'System Settings',
          headerBackTitle: 'Admin',
          headerRight: () => hasChanges ? (
            <TouchableOpacity onPress={handleSaveSettings} style={styles.saveButton}>
              <Save size={20} color={colors.accent.primary} />
            </TouchableOpacity>
          ) : null,
        }}
      />

      <View style={styles.header}>
        <Text style={styles.title}>System Configuration</Text>
        <Text style={styles.subtitle}>Manage application settings and preferences</Text>
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
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleBackupSettings}
          >
            <Database size={24} color={colors.accent.primary} />
            <Text style={styles.actionText}>Backup Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleRestoreSettings}
          >
            <RefreshCw size={24} color={colors.status.warning} />
            <Text style={styles.actionText}>Restore Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleResetSettings}
          >
            <Settings size={24} color={colors.status.error} />
            <Text style={styles.actionText}>Reset to Default</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <View style={styles.categoryRow}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category.id as any)}
              >
                <category.icon
                  size={20}
                  color={selectedCategory === category.id ? colors.background.primary : colors.text.secondary}
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {filteredSettings.map((setting) => {
          const CategoryIcon = getCategoryIcon(setting.category);
          return (
            <Card key={setting.id} style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <View style={styles.settingInfo}>
                  <View style={styles.settingTitleRow}>
                    <CategoryIcon size={18} color={getCategoryColor(setting.category)} />
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                  </View>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                <View style={styles.settingControl}>
                  {setting.type === 'toggle' && (
                    <Switch
                      value={setting.value}
                      onValueChange={(value) => handleSettingChange(setting.id, value)}
                      trackColor={{
                        false: colors.border.light,
                        true: colors.accent.primary,
                      }}
                      thumbColor={colors.background.primary}
                    />
                  )}
                  {setting.type === 'input' && (
                    <Input
                      value={setting.value}
                      onChangeText={(value) => handleSettingChange(setting.id, value)}
                      style={styles.settingInput}
                      keyboardType={setting.id === '2' || setting.id === '8' ? 'numeric' : 'default'}
                    />
                  )}
                  {setting.type === 'select' && setting.options && (
                    <View style={styles.selectContainer}>
                      {setting.options.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.selectOption,
                            setting.value === option && styles.selectOptionActive
                          ]}
                          onPress={() => handleSettingChange(setting.id, option)}
                        >
                          <Text style={[
                            styles.selectOptionText,
                            setting.value === option && styles.selectOptionTextActive
                          ]}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </Card>
          );
        })}
      </View>

      {hasChanges && (
        <View style={styles.saveSection}>
          <Card style={styles.saveCard}>
            <Text style={styles.saveText}>You have unsaved changes</Text>
            <View style={styles.saveActions}>
              <Button
                title="Discard"
                variant="outline"
                onPress={() => {
                  setSettings(mockSettings);
                  setHasChanges(false);
                }}
                style={styles.saveActionButton}
              />
              <Button
                title="Save Changes"
                onPress={handleSaveSettings}
                style={styles.saveActionButton}
              />
            </View>
          </Card>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  saveButton: {
    padding: 8,
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
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  actionText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 24,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  categoryButtonActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  categoryTextActive: {
    color: colors.background.primary,
  },
  settingCard: {
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  settingControl: {
    alignItems: 'flex-end',
  },
  settingInput: {
    minWidth: 100,
    marginBottom: 0,
  },
  selectContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  selectOptionActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  selectOptionText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  selectOptionTextActive: {
    color: colors.background.primary,
  },
  saveSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  saveCard: {
    padding: 16,
    backgroundColor: colors.status.warning + '20',
    borderColor: colors.status.warning,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  saveActions: {
    flexDirection: 'row',
    gap: 12,
  },
  saveActionButton: {
    flex: 1,
  },
});