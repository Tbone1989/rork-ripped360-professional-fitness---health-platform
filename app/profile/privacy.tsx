import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Users, 
  FileText, 
  Download, 
  Trash2,
  ChevronRight
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PrivacyScreen() {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    workoutSharing: false,
    progressSharing: true,
    medicalDataSharing: false,
    locationTracking: false,
    analyticsOptIn: true,
    marketingEmails: false,
    dataCollection: true,
  });

  const handleToggle = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const PrivacyItem = ({ 
    icon, 
    title, 
    description, 
    value, 
    onToggle,
    isWarning = false
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    value: boolean;
    onToggle: () => void;
    isWarning?: boolean;
  }) => (
    <View style={styles.privacyItem}>
      <View style={styles.privacyLeft}>
        <View style={[styles.privacyIcon, isWarning && styles.warningIcon]}>
          {icon}
        </View>
        <View style={styles.privacyContent}>
          <Text style={styles.privacyTitle}>{title}</Text>
          <Text style={styles.privacyDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border.medium, true: colors.accent.primary }}
        thumbColor={value ? colors.background.primary : colors.text.tertiary}
      />
    </View>
  );

  const ActionItem = ({ 
    icon, 
    title, 
    description, 
    onPress,
    isDanger = false
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    onPress: () => void;
    isDanger?: boolean;
  }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={styles.actionLeft}>
        <View style={[styles.actionIcon, isDanger && styles.dangerIcon]}>
          {icon}
        </View>
        <View style={styles.actionContent}>
          <Text style={[styles.actionTitle, isDanger && styles.dangerText]}>{title}</Text>
          <Text style={styles.actionDescription}>{description}</Text>
        </View>
      </View>
      <ChevronRight size={20} color={colors.text.tertiary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Privacy & Security' }} />

      {/* Profile Privacy */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Privacy</Text>
        
        <PrivacyItem
          icon={<Eye size={20} color={colors.accent.primary} />}
          title="Profile Visibility"
          description="Allow others to see your profile information"
          value={privacySettings.profileVisibility}
          onToggle={() => handleToggle('profileVisibility')}
        />
        
        <PrivacyItem
          icon={<Users size={20} color={colors.status.info} />}
          title="Workout Sharing"
          description="Share your workouts with the community"
          value={privacySettings.workoutSharing}
          onToggle={() => handleToggle('workoutSharing')}
        />
        
        <PrivacyItem
          icon={<FileText size={20} color={colors.status.success} />}
          title="Progress Sharing"
          description="Allow coaches to see your progress data"
          value={privacySettings.progressSharing}
          onToggle={() => handleToggle('progressSharing')}
        />
      </Card>

      {/* Medical Privacy */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Privacy</Text>
        <Text style={styles.sectionDescription}>
          Your medical data is always encrypted and HIPAA compliant
        </Text>
        
        <PrivacyItem
          icon={<Shield size={20} color={colors.status.error} />}
          title="Medical Data Sharing"
          description="Share anonymized data for research purposes"
          value={privacySettings.medicalDataSharing}
          onToggle={() => handleToggle('medicalDataSharing')}
          isWarning
        />
      </Card>

      {/* Data & Analytics */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Analytics</Text>
        
        <PrivacyItem
          icon={<Lock size={20} color={colors.accent.secondary} />}
          title="Location Tracking"
          description="Allow app to access your location for workouts"
          value={privacySettings.locationTracking}
          onToggle={() => handleToggle('locationTracking')}
        />
        
        <PrivacyItem
          icon={<FileText size={20} color={colors.status.info} />}
          title="Analytics"
          description="Help improve the app with usage analytics"
          value={privacySettings.analyticsOptIn}
          onToggle={() => handleToggle('analyticsOptIn')}
        />
        
        <PrivacyItem
          icon={<Users size={20} color={colors.status.warning} />}
          title="Marketing Communications"
          description="Receive promotional emails and updates"
          value={privacySettings.marketingEmails}
          onToggle={() => handleToggle('marketingEmails')}
        />
      </Card>

      {/* Data Management */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <ActionItem
          icon={<Download size={20} color={colors.accent.primary} />}
          title="Download My Data"
          description="Get a copy of all your data"
          onPress={() => Alert.alert('Download Data', 'Your data export will be emailed to you within 24 hours.')}
        />
        
        <ActionItem
          icon={<FileText size={20} color={colors.status.info} />}
          title="Privacy Policy"
          description="Read our privacy policy and terms"
          onPress={() => Alert.alert('Privacy Policy', 'Opening privacy policy...')}
        />
        
        <ActionItem
          icon={<Shield size={20} color={colors.status.success} />}
          title="Security Settings"
          description="Manage two-factor authentication"
          onPress={() => Alert.alert('Security', 'Security settings coming soon!')}
        />
      </Card>

      {/* Danger Zone */}
      <Card style={[styles.section, styles.dangerSection]}>
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        <Text style={styles.dangerDescription}>
          These actions are permanent and cannot be undone.
        </Text>
        
        <ActionItem
          icon={<EyeOff size={20} color={colors.status.error} />}
          title="Make Profile Private"
          description="Hide your profile from all users"
          onPress={() => Alert.alert(
            'Make Profile Private',
            'This will hide your profile from all users. You can change this later.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Make Private', style: 'destructive' },
            ]
          )}
          isDanger
        />
        
        <ActionItem
          icon={<Trash2 size={20} color={colors.status.error} />}
          title="Delete All Data"
          description="Permanently delete all your data"
          onPress={() => Alert.alert(
            'Delete All Data',
            'This will permanently delete all your data including workouts, progress, and medical records. This action cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete All', style: 'destructive' },
            ]
          )}
          isDanger
        />
      </Card>

      {/* Compliance Info */}
      <View style={styles.complianceSection}>
        <Text style={styles.complianceTitle}>Privacy Compliance</Text>
        <Text style={styles.complianceText}>
          Ripped360 is fully compliant with HIPAA, GDPR, and CCPA regulations. 
          Your data is encrypted at rest and in transit using industry-standard security measures.
        </Text>
        
        <View style={styles.complianceBadges}>
          <View style={styles.complianceBadge}>
            <Text style={styles.badgeText}>HIPAA</Text>
          </View>
          <View style={styles.complianceBadge}>
            <Text style={styles.badgeText}>GDPR</Text>
          </View>
          <View style={styles.complianceBadge}>
            <Text style={styles.badgeText}>CCPA</Text>
          </View>
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
  section: {
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  privacyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  privacyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  privacyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  warningIcon: {
    backgroundColor: colors.status.error + '20',
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: colors.status.error + '20',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  dangerText: {
    color: colors.status.error,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  dangerSection: {
    borderColor: colors.status.error,
    borderWidth: 1,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.status.error,
    marginBottom: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  complianceSection: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  complianceText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  complianceBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  complianceBadge: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
});