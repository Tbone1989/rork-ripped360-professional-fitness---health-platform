import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  Bell,
  MessageCircle,
  Trophy,
  Heart,
  Users,
  Target,
  Settings,
  Check,
  X,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'challenge' | 'follow' | 'achievement' | 'message';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
  actionRequired?: boolean;
}

interface NotificationSettings {
  likes: boolean;
  comments: boolean;
  challenges: boolean;
  follows: boolean;
  achievements: boolean;
  messages: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'Sarah Johnson liked your post',
    message: 'Your 5K run achievement post received a like',
    timestamp: '5 minutes ago',
    isRead: false,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=500',
  },
  {
    id: '2',
    type: 'challenge',
    title: 'New Challenge Available',
    message: '30-Day Push-Up Challenge is starting tomorrow',
    timestamp: '1 hour ago',
    isRead: false,
    actionRequired: true,
  },
  {
    id: '3',
    type: 'comment',
    title: 'Mike Chen commented on your post',
    message: 'Great progress! What training program did you follow?',
    timestamp: '2 hours ago',
    isRead: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500',
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: 'You earned the "Consistency Champion" badge',
    timestamp: '1 day ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'follow',
    title: 'Emily Rodriguez started following you',
    message: 'Check out their fitness journey',
    timestamp: '2 days ago',
    isRead: true,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=500',
  },
  {
    id: '6',
    type: 'message',
    title: 'New message from Coach Alex',
    message: 'Your workout plan for next week is ready',
    timestamp: '3 days ago',
    isRead: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500',
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    likes: true,
    comments: true,
    challenges: true,
    follows: true,
    achievements: true,
    messages: true,
    pushNotifications: true,
    emailNotifications: false,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={20} color={colors.status.error} />;
      case 'comment': return <MessageCircle size={20} color={colors.accent.primary} />;
      case 'challenge': return <Trophy size={20} color={colors.status.warning} />;
      case 'follow': return <Users size={20} color={colors.status.success} />;
      case 'achievement': return <Target size={20} color={colors.status.warning} />;
      case 'message': return <MessageCircle size={20} color={colors.accent.primary} />;
      default: return <Bell size={20} color={colors.text.secondary} />;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderNotifications = () => (
    <View style={styles.notificationsContainer}>
      {unreadCount > 0 && (
        <View style={styles.actionsHeader}>
          <Text style={styles.unreadCount}>{unreadCount} unread notifications</Text>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllRead}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      {notifications.map((notification) => (
        <Card 
          key={notification.id} 
          style={[
            styles.notificationCard,
            !notification.isRead && styles.unreadNotification,
          ]}
        >
          <TouchableOpacity 
            style={styles.notificationContent}
            onPress={() => markAsRead(notification.id)}
          >
            <View style={styles.notificationHeader}>
              <View style={styles.notificationIcon}>
                {notification.avatar ? (
                  <Avatar source={notification.avatar} size="small" />
                ) : (
                  <View style={styles.iconContainer}>
                    {getNotificationIcon(notification.type)}
                  </View>
                )}
              </View>
              
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTimestamp}>{notification.timestamp}</Text>
              </View>
              
              <View style={styles.notificationActions}>
                {!notification.isRead && (
                  <View style={styles.unreadDot} />
                )}
                {notification.actionRequired && (
                  <Badge label="Action Required" variant="primary" size="small" />
                )}
              </View>
            </View>
          </TouchableOpacity>
          
          <View style={styles.notificationButtons}>
            {!notification.isRead && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => markAsRead(notification.id)}
              >
                <Check size={16} color={colors.status.success} />
                <Text style={styles.actionButtonText}>Mark as read</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => deleteNotification(notification.id)}
            >
              <X size={16} color={colors.status.error} />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}
      
      {notifications.length === 0 && (
        <Card style={styles.emptyState}>
          <Bell size={48} color={colors.text.secondary} />
          <Text style={styles.emptyStateTitle}>No notifications</Text>
          <Text style={styles.emptyStateMessage}>
            You&apos;re all caught up! New notifications will appear here.
          </Text>
        </Card>
      )}
    </View>
  );

  const renderSettings = () => (
    <View style={styles.settingsContainer}>
      <Card style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Notification Types</Text>
        
        {[
          { key: 'likes', label: 'Likes on posts', icon: <Heart size={20} color={colors.status.error} /> },
          { key: 'comments', label: 'Comments on posts', icon: <MessageCircle size={20} color={colors.accent.primary} /> },
          { key: 'challenges', label: 'Challenge updates', icon: <Trophy size={20} color={colors.status.warning} /> },
          { key: 'follows', label: 'New followers', icon: <Users size={20} color={colors.status.success} /> },
          { key: 'achievements', label: 'Achievements & badges', icon: <Target size={20} color={colors.status.warning} /> },
          { key: 'messages', label: 'Direct messages', icon: <MessageCircle size={20} color={colors.accent.primary} /> },
        ].map((item) => (
          <View key={item.key} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              {item.icon}
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <Switch
              value={settings[item.key as keyof NotificationSettings]}
              onValueChange={() => toggleSetting(item.key as keyof NotificationSettings)}
              trackColor={{ false: colors.border.light, true: colors.accent.primary }}
              thumbColor={colors.background.primary}
            />
          </View>
        ))}
      </Card>
      
      <Card style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Delivery Methods</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Bell size={20} color={colors.accent.primary} />
            <Text style={styles.settingLabel}>Push notifications</Text>
          </View>
          <Switch
            value={settings.pushNotifications}
            onValueChange={() => toggleSetting('pushNotifications')}
            trackColor={{ false: colors.border.light, true: colors.accent.primary }}
            thumbColor={colors.background.primary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <MessageCircle size={20} color={colors.accent.primary} />
            <Text style={styles.settingLabel}>Email notifications</Text>
          </View>
          <Switch
            value={settings.emailNotifications}
            onValueChange={() => toggleSetting('emailNotifications')}
            trackColor={{ false: colors.border.light, true: colors.accent.primary }}
            thumbColor={colors.background.primary}
          />
        </View>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Notifications',
          headerRight: () => (
            <TouchableOpacity onPress={() => setShowSettings(!showSettings)}>
              <Settings size={24} color={colors.text.primary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {showSettings ? renderSettings() : renderNotifications()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  notificationsContainer: {
    padding: 16,
  },
  actionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  unreadCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  markAllRead: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  notificationCard: {
    marginBottom: 12,
    padding: 0,
    overflow: 'hidden',
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent.primary,
  },
  notificationContent: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  notificationIcon: {
    marginTop: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  notificationActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent.primary,
  },
  notificationButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  settingsContainer: {
    padding: 16,
  },
  settingsSection: {
    marginBottom: 16,
    padding: 16,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text.primary,
  },
});