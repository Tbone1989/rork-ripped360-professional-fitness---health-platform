import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, MessageSquare, Send, Phone, Video, MoreVertical } from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';

interface Message {
  id: string;
  clientId: string;
  clientName: string;
  clientImage: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

export default function CoachMessages() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const messages: Message[] = [
    {
      id: '1',
      clientId: '1',
      clientName: 'Sarah Johnson',
      clientImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200',
      lastMessage: 'Thanks for the workout plan! When is our next session?',
      timestamp: '2 min ago',
      unreadCount: 2,
      isOnline: true,
    },
    {
      id: '2',
      clientId: '2',
      clientName: 'Mike Rodriguez',
      clientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      lastMessage: 'I completed today\'s workout. Feeling great!',
      timestamp: '1 hour ago',
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: '3',
      clientId: '3',
      clientName: 'Emily Chen',
      clientImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
      lastMessage: 'Can we reschedule tomorrow\'s session?',
      timestamp: '3 hours ago',
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: '4',
      clientId: '4',
      clientName: 'David Park',
      clientImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
      lastMessage: 'The nutrition plan is working well. Lost 2 lbs this week!',
      timestamp: '1 day ago',
      unreadCount: 0,
      isOnline: false,
    },
  ];

  const filteredMessages = messages.filter(message =>
    message.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimestamp = (timestamp: string) => {
    return timestamp;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <MoreVertical size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.text.secondary}
          />
        </View>
      </View>

      <ScrollView style={styles.messagesList} showsVerticalScrollIndicator={false}>
        {filteredMessages.map((message) => (
          <TouchableOpacity
            key={message.id}
            style={styles.messageCard}
            onPress={() => router.push(`/coach/messages/${message.clientId}`)}
          >
            <Card style={styles.card}>
              <View style={styles.messageHeader}>
                <View style={styles.avatarContainer}>
                  <Avatar
                    source={message.clientImage}
                    size="medium"
                    style={styles.avatar}
                  />
                  {message.isOnline && <View style={styles.onlineIndicator} />}
                </View>
                
                <View style={styles.messageInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.clientName}>{message.clientName}</Text>
                    <Text style={styles.timestamp}>
                      {formatTimestamp(message.timestamp)}
                    </Text>
                  </View>
                  
                  <View style={styles.messageRow}>
                    <Text 
                      style={[
                        styles.lastMessage,
                        message.unreadCount > 0 && styles.unreadMessage
                      ]}
                      numberOfLines={1}
                    >
                      {message.lastMessage}
                    </Text>
                    {message.unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadCount}>
                          {message.unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.messageActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {/* Handle phone call */}}
                >
                  <Phone size={18} color={colors.text.secondary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => {/* Handle video call */}}
                >
                  <Video size={18} color={colors.text.secondary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.primaryAction]}
                  onPress={() => router.push(`/coach/messages/${message.clientId}`)}
                >
                  <MessageSquare size={18} color={colors.accent.primary} />
                </TouchableOpacity>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {filteredMessages.length === 0 && (
          <View style={styles.emptyState}>
            <MessageSquare size={48} color={colors.text.secondary} />
            <Text style={styles.emptyStateTitle}>No messages found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Your client messages will appear here'
              }
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.quickActions}>
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        <View style={styles.quickActionButtons}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/coach/messages/broadcast')}
          >
            <MessageSquare size={20} color={colors.accent.primary} />
            <Text style={styles.quickActionText}>Broadcast Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/coach/schedule')}
          >
            <Send size={20} color={colors.accent.primary} />
            <Text style={styles.quickActionText}>Schedule Reminder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageCard: {
    marginBottom: 12,
  },
  card: {
    padding: 16,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    marginRight: 0,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.status.success,
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  messageInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
    marginRight: 8,
  },
  unreadMessage: {
    color: colors.text.primary,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: colors.accent.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  primaryAction: {
    backgroundColor: `${colors.accent.primary}20`,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  quickActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  quickActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.primary,
    marginLeft: 8,
  },
});