import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationPreferences {
  workoutReminders: boolean;
  mealReminders: boolean;
  supplementReminders: boolean;
  coachingSessionReminders: boolean;
  contestPrepReminders: boolean;
  restDayReminders: boolean;
  hydrationReminders: boolean;
  checkInReminders: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  workoutReminders: true,
  mealReminders: true,
  supplementReminders: true,
  coachingSessionReminders: true,
  contestPrepReminders: true,
  restDayReminders: false,
  hydrationReminders: true,
  checkInReminders: true,
};

class NotificationService {
  private static instance: NotificationService;
  private notificationListener: any;
  private responseListener: any;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize() {
    if (Platform.OS === 'web') {
      console.log('Notifications not supported on web');
      return;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      // Get push token
      const token = await Notifications.getExpoPushTokenAsync();
      console.log('Push token:', token);

      // Set up notification listeners
      this.setupListeners();

      // Load preferences
      await this.loadPreferences();
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  private setupListeners() {
    // Listen for incoming notifications
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for notification responses (when user taps on notification)
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response);
    });
  }

  private handleNotificationResponse(response: Notifications.NotificationResponse) {
    const { data } = response.notification.request.content;
    
    // Handle different notification types
    switch (data.type) {
      case 'workout':
        // Navigate to workout screen
        break;
      case 'meal':
        // Navigate to meal screen
        break;
      case 'coaching':
        // Navigate to coaching session
        break;
      case 'supplement':
        // Navigate to supplement reminder
        break;
      default:
        break;
    }
  }

  async scheduleWorkoutReminder(workoutId: string, workoutName: string, time: Date) {
    if (Platform.OS === 'web') return;

    const preferences = await this.getPreferences();
    if (!preferences.workoutReminders) return;

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '💪 Time to Work Out!',
        body: `Your ${workoutName} session starts in 15 minutes`,
        data: { type: 'workout', workoutId },
        sound: true,
      },
      trigger: {
        date: new Date(time.getTime() - 15 * 60 * 1000), // 15 minutes before
      },
    });

    return identifier;
  }

  async scheduleMealReminder(mealType: string, time: Date) {
    if (Platform.OS === 'web') return;

    const preferences = await this.getPreferences();
    if (!preferences.mealReminders) return;

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🍽️ Meal Time!',
        body: `Time for your ${mealType}. Stay on track with your nutrition!`,
        data: { type: 'meal', mealType },
        sound: true,
      },
      trigger: {
        date: time,
      },
    });

    return identifier;
  }

  async scheduleSupplementReminder(supplementName: string, time: Date, dosage: string) {
    if (Platform.OS === 'web') return;

    const preferences = await this.getPreferences();
    if (!preferences.supplementReminders) return;

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '💊 Supplement Reminder',
        body: `Time to take ${supplementName} (${dosage})`,
        data: { type: 'supplement', supplementName },
        sound: true,
      },
      trigger: {
        date: time,
      },
    });

    return identifier;
  }

  async scheduleCoachingSession(sessionId: string, clientName: string, time: Date, isCoach: boolean) {
    if (Platform.OS === 'web') return;

    const preferences = await this.getPreferences();
    if (!preferences.coachingSessionReminders) return;

    const title = isCoach ? '👥 Coaching Session' : '🏋️ Training Session';
    const body = isCoach 
      ? `Session with ${clientName} starts in 10 minutes`
      : `Your coaching session starts in 10 minutes`;

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: 'coaching', sessionId, isCoach },
        sound: true,
      },
      trigger: {
        date: new Date(time.getTime() - 10 * 60 * 1000), // 10 minutes before
      },
    });

    return identifier;
  }

  async scheduleContestPrepReminder(task: string, time: Date, weeksOut: number) {
    if (Platform.OS === 'web') return;

    const preferences = await this.getPreferences();
    if (!preferences.contestPrepReminders) return;

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: `🏆 Contest Prep - ${weeksOut} Weeks Out`,
        body: task,
        data: { type: 'contest', task, weeksOut },
        sound: true,
      },
      trigger: {
        date: time,
      },
    });

    return identifier;
  }

  async scheduleHydrationReminder() {
    if (Platform.OS === 'web') return;

    const preferences = await this.getPreferences();
    if (!preferences.hydrationReminders) return;

    // Schedule hourly hydration reminders during waking hours (8 AM - 10 PM)
    const now = new Date();
    const reminders = [];

    for (let hour = 8; hour <= 22; hour++) {
      const reminderTime = new Date();
      reminderTime.setHours(hour, 0, 0, 0);
      
      if (reminderTime > now) {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: '💧 Stay Hydrated!',
            body: 'Time to drink some water and stay hydrated',
            data: { type: 'hydration' },
            sound: false, // Silent for frequent reminders
          },
          trigger: {
            hour,
            minute: 0,
            repeats: true,
          },
        });
        reminders.push(identifier);
      }
    }

    return reminders;
  }

  async scheduleWeeklyCheckIn(dayOfWeek: number, hour: number) {
    if (Platform.OS === 'web') return;

    const preferences = await this.getPreferences();
    if (!preferences.checkInReminders) return;

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📊 Weekly Check-In',
        body: 'Time to log your progress and update your measurements',
        data: { type: 'checkin' },
        sound: true,
      },
      trigger: {
        weekday: dayOfWeek,
        hour,
        minute: 0,
        repeats: true,
      },
    });

    return identifier;
  }

  async cancelNotification(identifier: string) {
    if (Platform.OS === 'web') return;
    
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  async cancelAllNotifications() {
    if (Platform.OS === 'web') return;
    
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getScheduledNotifications() {
    if (Platform.OS === 'web') return [];
    
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  async sendInstantNotification(title: string, body: string, data?: any) {
    if (Platform.OS === 'web') return;

    await Notifications.presentNotificationAsync({
      title,
      body,
      data,
    });
  }

  // Preferences management
  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const stored = await AsyncStorage.getItem('notification_preferences');
      return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  async updatePreferences(preferences: Partial<NotificationPreferences>) {
    try {
      const current = await this.getPreferences();
      const updated = { ...current, ...preferences };
      await AsyncStorage.setItem('notification_preferences', JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  private async loadPreferences() {
    const preferences = await this.getPreferences();
    console.log('Loaded notification preferences:', preferences);
  }

  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

export default NotificationService.getInstance();