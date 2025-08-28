import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  MessageSquare,
  Send,
  Bell,
  Users,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

interface SystemMessage {
  id: string;
  type: 'notification' | 'alert' | 'system' | 'user';
  title: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'pending' | 'failed';
  recipients: number;
  priority: 'low' | 'medium' | 'high';
}

const mockMessages: SystemMessage[] = [
  {
    id: '1',
    type: 'notification',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2-4 AM EST.',
    timestamp: '2 hours ago',
    status: 'sent',
    recipients: 2847,
    priority: 'high',
  },
  {
    id: '2',
    type: 'alert',
    title: 'Security Update',
    message: 'New security features have been enabled for all accounts.',
    timestamp: '1 day ago',
    status: 'sent',
    recipients: 2847,
    priority: 'medium',
  },
  {
    id: '3',
    type: 'system',
    title: 'Database Backup',
    message: 'Daily backup completed successfully.',
    timestamp: '2 days ago',
    status: 'sent',
    recipients: 15,
    priority: 'low',
  },
  {
    id: '4',
    type: 'user',
    title: 'Welcome New Users',
    message: 'Welcome to Ripped360! Get started with your fitness journey.',
    timestamp: '3 days ago',
    status: 'pending',
    recipients: 156,
    priority: 'medium',
  },
];

export default function AdminMessagesScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<SystemMessage[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'notification' | 'alert' | 'system' | 'user'>('all');
  const [newMessage, setNewMessage] = useState({
    title: '',
    message: '',
    type: 'notification' as SystemMessage['type'],
    priority: 'medium' as SystemMessage['priority'],
  });
  const { isAdmin, user } = require('@/store/userStore').useUserStore((s: any) => ({ isAdmin: s.isAdmin, user: s.user }));

  useEffect(() => {
    const admin = isAdmin || (user?.role === 'admin');
    if (!admin) {
      router.replace('/admin/login');
    }
  }, [isAdmin, user, router]);

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         msg.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || msg.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (!newMessage.title.trim() || !newMessage.message.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const message: SystemMessage = {
      id: Date.now().toString(),
      ...newMessage,
      timestamp: 'Just now',
      status: 'pending',
      recipients: newMessage.type === 'system' ? 15 : 2847,
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage({
      title: '',
      message: '',
      type: 'notification',
      priority: 'medium',
    });

    Alert.alert('Success', 'Message sent successfully');
  };

  const handleDeleteMessage = (messageId: string) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMessages(prev => prev.filter(msg => msg.id !== messageId));
            Alert.alert('Success', 'Message deleted');
          },
        },
      ]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle size={16} color={colors.status.success} />;
      case 'pending':
        return <Clock size={16} color={colors.status.warning} />;
      case 'failed':
        return <AlertCircle size={16} color={colors.status.error} />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'sent':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'success';
    }
  };

  const getPriorityVariant = (priority: string): 'success' | 'warning' | 'error' => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'success';
    }
  };

  const messageStats = [
    { title: 'Total Sent', value: '1,234', icon: Send, color: colors.accent.primary },
    { title: 'Active Users', value: '2,847', icon: Users, color: colors.status.success },
    { title: 'Pending', value: '12', icon: Clock, color: colors.status.warning },
    { title: 'Failed', value: '3', icon: AlertCircle, color: colors.status.error },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: 'Message Management',
          headerBackTitle: 'Admin',
        }}
      />

      <View style={styles.header}>
        <Text style={styles.title}>System Messages</Text>
        <Text style={styles.subtitle}>Send notifications and manage communications</Text>
      </View>

      <View style={styles.statsGrid}>
        {messageStats.map((stat, index) => (
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
        <Text style={styles.sectionTitle}>Send New Message</Text>
        <Card style={styles.composeCard}>
          <Input
            placeholder="Message title"
            value={newMessage.title}
            onChangeText={(text) => setNewMessage(prev => ({ ...prev, title: text }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Message content"
            value={newMessage.message}
            onChangeText={(text) => setNewMessage(prev => ({ ...prev, message: text }))}
            multiline
            numberOfLines={4}
            style={styles.textArea}
            placeholderTextColor={colors.text.tertiary}
          />
          <View style={styles.messageOptions}>
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>Type:</Text>
              <TouchableOpacity
                style={[styles.optionButton, newMessage.type === 'notification' && styles.optionButtonActive]}
                onPress={() => setNewMessage(prev => ({ ...prev, type: 'notification' }))}
              >
                <Text style={styles.optionText}>Notification</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, newMessage.type === 'alert' && styles.optionButtonActive]}
                onPress={() => setNewMessage(prev => ({ ...prev, type: 'alert' }))}
              >
                <Text style={styles.optionText}>Alert</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.optionGroup}>
              <Text style={styles.optionLabel}>Priority:</Text>
              <TouchableOpacity
                style={[styles.optionButton, newMessage.priority === 'low' && styles.optionButtonActive]}
                onPress={() => setNewMessage(prev => ({ ...prev, priority: 'low' }))}
              >
                <Text style={styles.optionText}>Low</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, newMessage.priority === 'medium' && styles.optionButtonActive]}
                onPress={() => setNewMessage(prev => ({ ...prev, priority: 'medium' }))}
              >
                <Text style={styles.optionText}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, newMessage.priority === 'high' && styles.optionButtonActive]}
                onPress={() => setNewMessage(prev => ({ ...prev, priority: 'high' }))}
              >
                <Text style={styles.optionText}>High</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Button
            title="Send Message"
            onPress={handleSendMessage}
            style={styles.sendButton}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Message History</Text>
          <View style={styles.searchContainer}>
            <Search size={16} color={colors.text.tertiary} />
            <TextInput
              placeholder="Search messages..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </View>

        <View style={styles.filterRow}>
          {['all', 'notification', 'alert', 'system', 'user'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter as any)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredMessages.map((message) => (
          <Card key={message.id} style={styles.messageCard}>
            <View style={styles.messageHeader}>
              <View style={styles.messageInfo}>
                <Text style={styles.messageTitle}>{message.title}</Text>
                <Text style={styles.messageContent}>{message.message}</Text>
                <View style={styles.messageMeta}>
                  <Badge
                    variant="info"
                    style={styles.typeBadge}
                  >
                    {message.type}
                  </Badge>
                  <Badge
                    variant={getPriorityVariant(message.priority)}
                    style={styles.priorityBadge}
                  >
                    {message.priority}
                  </Badge>
                  <Text style={styles.recipients}>{message.recipients} recipients</Text>
                </View>
              </View>
              <View style={styles.messageStatus}>
                <View style={styles.statusRow}>
                  {getStatusIcon(message.status)}
                  <Badge
                    variant={getStatusVariant(message.status)}
                  >
                    {message.status}
                  </Badge>
                </View>
                <Text style={styles.timestamp}>{message.timestamp}</Text>
              </View>
            </View>
            <View style={styles.messageActions}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteMessage(message.id)}
              >
                <Trash2 size={16} color={colors.status.error} />
              </TouchableOpacity>
            </View>
          </Card>
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
  composeCard: {
    padding: 16,
    gap: 16,
  },
  input: {
    marginBottom: 0,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.secondary,
    textAlignVertical: 'top',
  },
  messageOptions: {
    gap: 16,
  },
  optionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    minWidth: 60,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  optionButtonActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  optionText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  sendButton: {
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    flex: 1,
    maxWidth: 200,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterButtonActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  filterText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: colors.background.primary,
  },
  messageCard: {
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  messageInfo: {
    flex: 1,
    marginRight: 16,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  messageContent: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  typeBadge: {
    marginRight: 0,
  },
  priorityBadge: {
    marginRight: 0,
  },
  recipients: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  messageStatus: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingTop: 12,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
  },
});