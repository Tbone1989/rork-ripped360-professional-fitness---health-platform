import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Send, 
  Paperclip, 
  Camera, 
  Mic, 
  Phone, 
  Video, 
  MoreVertical,
  ArrowLeft
} from 'lucide-react-native';

import { colors } from '@/constants/colors';
import { Avatar } from '@/components/ui/Avatar';
import { featuredCoaches } from '@/mocks/coaches';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'audio' | 'file';
  isRead: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'coach-1',
    senderName: 'Sarah Johnson',
    content: 'Hi! I reviewed your workout from yesterday. Great job on hitting your target reps!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'text',
    isRead: true
  },
  {
    id: '2',
    senderId: 'user',
    senderName: 'You',
    content: 'Thank you! I felt really strong during the deadlifts. Should I increase the weight next session?',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    type: 'text',
    isRead: true
  },
  {
    id: '3',
    senderId: 'coach-1',
    senderName: 'Sarah Johnson',
    content: 'Absolutely! Let\'s bump it up by 10 lbs. Your form looked perfect in the video you sent.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    type: 'text',
    isRead: true
  },
  {
    id: '4',
    senderId: 'coach-1',
    senderName: 'Sarah Johnson',
    content: 'Also, I\'ve prepared a new program for next week focusing on your goals. We\'ll discuss it in our call tomorrow.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'text',
    isRead: true
  },
  {
    id: '5',
    senderId: 'user',
    senderName: 'You',
    content: 'Perfect! Looking forward to it. What time works best for you?',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'text',
    isRead: false
  }
];

export default function CoachMessageScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const coach = featuredCoaches.find((c) => c.id === id);
  
  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);
  
  if (!coach) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Coach not found</Text>
      </View>
    );
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: 'user',
        senderName: 'You',
        content: newMessage.trim(),
        timestamp: new Date(),
        type: 'text',
        isRead: false
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Simulate coach typing
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate coach response
        const coachResponse: Message = {
          id: (Date.now() + 1).toString(),
          senderId: coach.id,
          senderName: coach.name,
          content: 'Thanks for the message! I\'ll get back to you shortly.',
          timestamp: new Date(),
          type: 'text',
          isRead: true
        };
        setMessages(prev => [...prev, coachResponse]);
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const dateKey = message.timestamp.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen 
        options={{ 
          title: '',
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.text.primary} />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <TouchableOpacity 
              style={styles.headerTitle}
              onPress={() => router.push(`/coaching/${coach.id}`)}
            >
              <Avatar
                source={coach.profileImageUrl}
                name={coach.name}
                size="small"
              />
              <View style={styles.headerInfo}>
                <Text style={styles.headerName}>{coach.name}</Text>
                <Text style={styles.headerStatus}>
                  {isTyping ? 'typing...' : 'Online'}
                </Text>
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerAction}
                onPress={() => Alert.alert('Voice Call', 'Feature coming soon!')}
              >
                <Phone size={20} color={colors.text.secondary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerAction}
                onPress={() => Alert.alert('Video Call', 'Feature coming soon!')}
              >
                <Video size={20} color={colors.text.secondary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerAction}
                onPress={() => Alert.alert('More Options', 'Feature coming soon!')}
              >
                <MoreVertical size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {Object.entries(messageGroups).map(([dateKey, dayMessages]) => (
          <View key={dateKey}>
            <View style={styles.dateHeader}>
              <Text style={styles.dateText}>{formatDate(new Date(dateKey))}</Text>
            </View>
            
            {dayMessages.map((message, index) => {
              const isUser = message.senderId === 'user';
              const showAvatar = !isUser && (
                index === dayMessages.length - 1 || 
                dayMessages[index + 1]?.senderId !== message.senderId
              );
              
              return (
                <View 
                  key={message.id} 
                  style={[
                    styles.messageContainer,
                    isUser ? styles.userMessage : styles.coachMessage
                  ]}
                >
                  {!isUser && (
                    <View style={styles.avatarContainer}>
                      {showAvatar ? (
                        <Avatar
                          source={coach.profileImageUrl}
                          name={coach.name}
                          size="small"
                        />
                      ) : (
                        <View style={styles.avatarSpacer} />
                      )}
                    </View>
                  )}
                  
                  <View style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.coachBubble
                  ]}>
                    <Text style={[
                      styles.messageText,
                      isUser ? styles.userText : styles.coachText
                    ]}>
                      {message.content}
                    </Text>
                    <Text style={[
                      styles.messageTime,
                      isUser ? styles.userTime : styles.coachTime
                    ]}>
                      {formatTime(message.timestamp)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
        
        {isTyping && (
          <View style={[styles.messageContainer, styles.coachMessage]}>
            <View style={styles.avatarContainer}>
              <Avatar
                source={coach.profileImageUrl}
                name={coach.name}
                size="small"
              />
            </View>
            <View style={[styles.messageBubble, styles.coachBubble, styles.typingBubble]}>
              <View style={styles.typingIndicator}>
                <View style={[styles.typingDot, styles.typingDot1]} />
                <View style={[styles.typingDot, styles.typingDot2]} />
                <View style={[styles.typingDot, styles.typingDot3]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={() => Alert.alert('Attachments', 'Feature coming soon!')}
          >
            <Paperclip size={20} color={colors.text.secondary} />
          </TouchableOpacity>
          
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={colors.text.tertiary}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={1000}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.cameraButton}
            onPress={() => Alert.alert('Camera', 'Feature coming soon!')}
          >
            <Camera size={20} color={colors.text.secondary} />
          </TouchableOpacity>
          
          {newMessage.trim() ? (
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={sendMessage}
            >
              <Send size={20} color={colors.text.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.micButton}
              onPress={() => Alert.alert('Voice Message', 'Feature coming soon!')}
            >
              <Mic size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  errorText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerInfo: {
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  headerStatus: {
    fontSize: 12,
    color: colors.status.success,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dateHeader: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: colors.text.tertiary,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  coachMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    marginRight: 8,
  },
  avatarSpacer: {
    width: 32,
    height: 32,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: colors.accent.primary,
    borderBottomRightRadius: 4,
  },
  coachBubble: {
    backgroundColor: colors.background.secondary,
    borderBottomLeftRadius: 4,
  },
  typingBubble: {
    paddingVertical: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  userText: {
    color: colors.text.primary,
  },
  coachText: {
    color: colors.text.primary,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  userTime: {
    color: colors.text.secondary,
  },
  coachTime: {
    color: colors.text.tertiary,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text.tertiary,
  },
  typingDot1: {
    // Animation would be added here
  },
  typingDot2: {
    // Animation would be added here
  },
  typingDot3: {
    // Animation would be added here
  },
  inputContainer: {
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  textInput: {
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 20,
  },
  cameraButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});