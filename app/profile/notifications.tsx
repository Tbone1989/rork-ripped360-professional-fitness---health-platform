import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, Alert, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { Bell, Dumbbell, Users, Heart, Calendar, MessageSquare } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';
import notificationService from '@/services/notificationService';

export default function NotificationsScreen() {
  const { user, updatePreferences } = useUserStore();
  const [notifications, setNotifications] = useState({
    workoutReminders: user?.preferences.notifications.workoutReminders ?? true,
    mealReminders: true,
    supplementReminders: true,
    coachingSessionReminders: true,
    contestPrepReminders: true,
    hydrationReminders: true,
    checkInReminders: true,
    coachMessages: user?.preferences.notifications.coachMessages ?? true,
    progressUpdates: user?.preferences.notifications.progressUpdates ?? true,
    medicalAlerts: user?.preferences.notifications.medicalAlerts ?? true,
  });

  useEffect(() => {
    // Load notification preferences from service
    const loadPreferences = async () => {
      if (Platform.OS !== 'web') {
        const prefs = await notificationService.getPreferences();
        setNotifications(prev => ({
          ...prev,
          workoutReminders: prefs.workoutReminders,
          mealReminders: prefs.mealReminders,
          supplementReminders: prefs.supplementReminders,
          coachingSessionReminders: prefs.coachingSessionReminders,
          contestPrepReminders: prefs.contestPrepReminders,
          hydrationReminders: prefs.hydrationReminders,
          checkInReminders: prefs.checkInReminders,
        }));
      }
    };
    loadPreferences();
  }, []);

  const handleToggle = async (key: keyof typeof notifications) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    
    // Update notification service preferences
    if (Platform.OS !== 'web') {
      await notificationService.updatePreferences({
        [key]: newNotifications[key]
      });

      // Schedule or cancel specific notifications based on the toggle
      if (key === 'hydrationReminders') {
        if (newNotifications[key]) {
          await notificationService.scheduleHydrationReminder();
        } else {
          // Cancel hydration reminders
          const scheduled = await notificationService.getScheduledNotifications();
          for (const notification of scheduled) {
            if (notification.content.data?.type === 'hydration') {
              await notificationService.cancelNotification(notification.identifier);
            }
          }
        }
      } else if (key === 'checkInReminders' && newNotifications[key]) {
        // Schedule weekly check-in for Sunday at 10 AM
        await notificationService.scheduleWeeklyCheckIn(0, 10);
      }
    }
    
    // Update user preferences in store
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
          description="Get reminded 15 minutes before scheduled workouts"
          value={notifications.workoutReminders}
          onToggle={() => handleToggle('workoutReminders')}
        />
        
        <NotificationItem
          icon={<Calendar size={20} color={colors.status.info} />}
          title="Weekly Check-ins"
          description="Sunday reminders to log progress and measurements"
          value={notifications.checkInReminders}
          onToggle={() => handleToggle('checkInReminders')}
        />
        
        <NotificationItem
          icon={<Bell size={20} color={colors.status.warning} />}
          title="Contest Prep Reminders"
          description="Daily tasks and protocol reminders during prep"
          value={notifications.contestPrepReminders}
          onToggle={() => handleToggle('contestPrepReminders')}
        />
      </Card>

      {/* Coaching Notifications */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Coaching & Support</Text>
        
        <NotificationItem
          icon={<Users size={20} color={colors.accent.secondary} />}
          title="Coaching Sessions"
          description="10 minute reminders before sessions"
          value={notifications.coachingSessionReminders}
          onToggle={() => handleToggle('coachingSessionReminders')}
        />
        
        <NotificationItem
          icon={<MessageSquare size={20} color={colors.status.info} />}
          title="Coach Messages"
          description="Instant notifications for coach messages"
          value={notifications.coachMessages}
          onToggle={() => handleToggle('coachMessages')}
        />
      </Card>

      {/* Nutrition & Supplements */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Nutrition & Supplements</Text>
        
        <NotificationItem
          icon={<Bell size={20} color={colors.status.success} />}
          title="Meal Reminders"
          description="Stay on track with meal timing"
          value={notifications.mealReminders}
          onToggle={() => handleToggle('mealReminders')}
        />
        
        <NotificationItem
          icon={<Heart size={20} color={colors.status.warning} />}
          title="Supplement Reminders"
          description="Never miss your supplement schedule"
          value={notifications.supplementReminders}
          onToggle={() => handleToggle('supplementReminders')}
        />
        
        <NotificationItem
          icon={<Calendar size={20} color={colors.status.info} />}
          title="Hydration Reminders"
          description="Hourly water intake reminders (8am-10pm)"
          value={notifications.hydrationReminders}
          onToggle={() => handleToggle('hydrationReminders')}
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
          title="Progress Updates"
          description="Weekly and monthly progress summaries"
          value={notifications.progressUpdates}
          onToggle={() => handleToggle('progressUpdates')}
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
              mealReminders: true,
              supplementReminders: true,
              coachingSessionReminders: true,
              contestPrepReminders: true,
              hydrationReminders: true,
              checkInReminders: true,
              coachMessages: true,
              progressUpdates: true,
              medicalAlerts: true,
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
              mealReminders: false,
              supplementReminders: false,
              coachingSessionReminders: false,
              contestPrepReminders: false,
              hydrationReminders: false,
              checkInReminders: false,
              coachMessages: false,
              progressUpdates: false,
              medicalAlerts: false,
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