import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Bell, Dumbbell, Users, Heart, Calendar, MessageSquare } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';

export default function NotificationsScreen() {
  const { user, updatePreferences } = useUserStore();
  const [notifications, setNotifications] = useState({
    workoutReminders: user?.preferences.notifications.workoutReminders ?? true,
    coachMessages: user?.preferences.notifications.coachMessages ?? true,
    progressUpdates: user?.preferences.notifications.progressUpdates ?? true,
    medicalAlerts: user?.preferences.notifications.medicalAlerts ?? true,
    socialUpdates: true,
    weeklyReports: true,
    achievementAlerts: true,
    appointmentReminders: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    
    // Update user preferences
    updatePreferences({
      notifications: {
        workoutReminders: newNotifications.workoutReminders,
        coachMessages: newNotifications.coachMessages,
        progressUpdates: newNotifications.progressUpdates,
        medicalAlerts: newNotifications.medicalAlerts,
      }
    });
  };

  const NotificationItem = ({ 
    icon, 
    title, 
    description, 
    value, 
    onToggle 
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationLeft}>
        <View style={styles.notificationIcon}>
          {icon}
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{title}</Text>
          <Text style={styles.notificationDescription}>{description}</Text>
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Notifications' }} />

      {/* Fitness Notifications */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Fitness & Workouts</Text>
        
        <NotificationItem
          icon={<Dumbbell size={20} color={colors.accent.primary} />}
          title="Workout Reminders"
          description="Get reminded about your scheduled workouts"
          value={notifications.workoutReminders}
          onToggle={() => handleToggle('workoutReminders')}
        />
        
        <NotificationItem
          icon={<Calendar size={20} color={colors.status.info} />}
          title="Progress Updates"
          description="Weekly and monthly progress summaries"
          value={notifications.progressUpdates}
          onToggle={() => handleToggle('progressUpdates')}
        />
        
        <NotificationItem
          icon={<Bell size={20} color={colors.status.warning} />}
          title="Achievement Alerts"
          description="Celebrate your milestones and achievements"
          value={notifications.achievementAlerts}
          onToggle={() => handleToggle('achievementAlerts')}
        />
      </Card>

      {/* Coaching Notifications */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Coaching & Support</Text>
        
        <NotificationItem
          icon={<Users size={20} color={colors.accent.secondary} />}
          title="Coach Messages"
          description="Messages from your personal coaches"
          value={notifications.coachMessages}
          onToggle={() => handleToggle('coachMessages')}
        />
        
        <NotificationItem
          icon={<MessageSquare size={20} color={colors.status.info} />}
          title="Appointment Reminders"
          description="Upcoming coaching sessions and consultations"
          value={notifications.appointmentReminders}
          onToggle={() => handleToggle('appointmentReminders')}
        />
      </Card>

      {/* Health & Medical */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Health & Medical</Text>
        
        <NotificationItem
          icon={<Heart size={20} color={colors.status.error} />}
          title="Medical Alerts"
          description="Important health updates and reminders"
          value={notifications.medicalAlerts}
          onToggle={() => handleToggle('medicalAlerts')}
        />
        
        <NotificationItem
          icon={<Calendar size={20} color={colors.status.success} />}
          title="Weekly Reports"
          description="Health and fitness summary reports"
          value={notifications.weeklyReports}
          onToggle={() => handleToggle('weeklyReports')}
        />
      </Card>

      {/* Social & Community */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Social & Community</Text>
        
        <NotificationItem
          icon={<Users size={20} color={colors.accent.primary} />}
          title="Social Updates"
          description="Updates from friends and community"
          value={notifications.socialUpdates}
          onToggle={() => handleToggle('socialUpdates')}
        />
      </Card>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button
          title="Enable All"
          variant="outline"
          onPress={() => {
            const allEnabled = {
              workoutReminders: true,
              coachMessages: true,
              progressUpdates: true,
              medicalAlerts: true,
              socialUpdates: true,
              weeklyReports: true,
              achievementAlerts: true,
              appointmentReminders: true,
            };
            setNotifications(allEnabled);
            updatePreferences({
              notifications: {
                workoutReminders: true,
                coachMessages: true,
                progressUpdates: true,
                medicalAlerts: true,
              }
            });
            Alert.alert('Success', 'All notifications enabled');
          }}
          style={styles.actionButton}
        />
        
        <Button
          title="Disable All"
          variant="outline"
          onPress={() => {
            const allDisabled = {
              workoutReminders: false,
              coachMessages: false,
              progressUpdates: false,
              medicalAlerts: false,
              socialUpdates: false,
              weeklyReports: false,
              achievementAlerts: false,
              appointmentReminders: false,
            };
            setNotifications(allDisabled);
            updatePreferences({
              notifications: {
                workoutReminders: false,
                coachMessages: false,
                progressUpdates: false,
                medicalAlerts: false,
              }
            });
            Alert.alert('Success', 'All notifications disabled');
          }}
          style={styles.actionButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You can change these settings anytime. Some critical health alerts cannot be disabled for your safety.
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
  section: {
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  footer: {
    padding: 16,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});