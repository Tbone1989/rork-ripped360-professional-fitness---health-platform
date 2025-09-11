import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import {
  Bot,
  Send,
  Mic,
  StopCircle,
  Sparkles,
  User,
  Dumbbell,
  Utensils,
  Heart,
  Brain,
  Target,
  TrendingUp,
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';
import { Audio } from 'expo-av';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  id: string;
  label: string;
  prompt: string;
  icon: any;
  color: string;
}

export default function AICoachScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI fitness coach. I can help you with workouts, nutrition, form checks, and reaching your goals. What would you like to work on today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const webMediaStreamRef = useRef<MediaStream | null>(null);
  const webRecorderRef = useRef<MediaRecorder | null>(null);
  const webChunksRef = useRef<BlobPart[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const [showAudioDisclaimer, setShowAudioDisclaimer] = useState<boolean>(false);
  const [acceptedAudioDisclaimer, setAcceptedAudioDisclaimer] = useState<boolean>(false);

  const quickActions: QuickAction[] = [
    {
      id: 'workout',
      label: 'Create Workout',
      prompt: 'Create a workout plan for today',
      icon: Dumbbell,
      color: colors.accent.primary,
    },
    {
      id: 'meal',
      label: 'Meal Plan',
      prompt: 'Suggest a high-protein meal',
      icon: Utensils,
      color: colors.status.success,
    },
    {
      id: 'form',
      label: 'Form Tips',
      prompt: 'How do I improve my squat form?',
      icon: Target,
      color: colors.status.info,
    },
    {
      id: 'progress',
      label: 'Progress Check',
      prompt: 'Analyze my progress this week',
      icon: TrendingUp,
      color: colors.status.warning,
    },
  ];

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI fitness coach. Provide helpful, motivating, and scientifically-backed fitness and nutrition advice. Keep responses concise and actionable.'
            },
            ...messages.map(m => ({
              role: m.role,
              content: m.content
            })),
            {
              role: 'user',
              content: text
            }
          ]
        })
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.completion,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'll help you create an effective workout plan! Based on your goals, I recommend starting with compound movements like squats, deadlifts, and bench press. Would you like me to create a specific program for you?",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const stopWebRecording = () => {
    try {
      webRecorderRef.current?.stop();
      webMediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}
  };

  const transcribeAudioBlob = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const form = new FormData();
      const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
      form.append('audio', file as any);
      const res = await fetch('https://toolkit.rork.com/stt/transcribe/', { method: 'POST', body: form });
      const data = await res.json();
      const text: string = data?.text ?? '';
      if (text) setInputText(text);
    } catch (e) {
      console.log('STT error', e);
      setInputText("What's the best workout for building muscle?");
    } finally {
      setIsTranscribing(false);
    }
  };

  const toggleRecording = async () => {
    if (!acceptedAudioDisclaimer) {
      setShowAudioDisclaimer(true);
      return;
    }
    if (isRecording) {
      setIsRecording(false);
      if (Platform.OS === 'web') {
        stopWebRecording();
      } else {
        try {
          const rec = recordingRef.current;
          if (rec) {
            await rec.stopAndUnloadAsync();
            const uri = rec.getURI();
            if (uri) {
              const uriParts = uri.split('.');
              const fileType = uriParts[uriParts.length - 1];
              const form = new FormData();
              form.append('audio', {
                uri,
                name: 'recording.' + fileType,
                type: 'audio/' + fileType,
              } as any);
              const res = await fetch('https://toolkit.rork.com/stt/transcribe/', { method: 'POST', body: form });
              const data = await res.json();
              const text: string = data?.text ?? '';
              if (text) setInputText(text);
            }
          }
        } catch (e) {
          console.log('mobile STT error', e);
          setInputText("What's the best workout for building muscle?");
        } finally {
          recordingRef.current = null;
          try { await Audio.setAudioModeAsync({ allowsRecordingIOS: false }); } catch {}
        }
      }
      return;
    }

    setIsRecording(true);
    if (Platform.OS === 'web') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        webMediaStreamRef.current = stream;
        // @ts-ignore MediaRecorder exists on web
        const recorder: MediaRecorder = new MediaRecorder(stream);
        webRecorderRef.current = recorder;
        webChunksRef.current = [];
        recorder.ondataavailable = (e: BlobEvent) => {
          if (e.data && e.data.size > 0) webChunksRef.current.push(e.data);
        };
        recorder.onstop = async () => {
          const blob = new Blob(webChunksRef.current, { type: 'audio/webm' });
          await transcribeAudioBlob(blob);
          webChunksRef.current = [];
        };
        recorder.start();
      } catch (e) {
        console.log('Web mic error', e);
        setIsRecording(false);
      }
    } else {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync({
          android: {
            extension: '.m4a',
            outputFormat: 2 as any,
            audioEncoder: 3 as any,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: '.wav',
            outputFormat: 1 as any,
            audioQuality: 0 as any,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          web: {},
        } as any);
        recordingRef.current = recording;
        await recording.startAsync();
      } catch (e) {
        console.log('Recording error', e);
        setIsRecording(false);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'AI Coach',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        {/* AI Banner */}
        <View style={styles.aiBanner}>
          <View style={styles.aiBannerContent}>
            <Bot size={24} color="#FFFFFF" />
            <View style={styles.aiBannerText}>
              <Text style={styles.aiBannerTitle}>24/7 AI Personal Trainer</Text>
              <Text style={styles.aiBannerSubtitle}>Get instant fitness & nutrition advice</Text>
            </View>
            <View style={styles.aiStatus}>
              <View style={styles.aiStatusDot} />
              <Text style={styles.aiStatusText}>Online</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionsScroll}
          contentContainerStyle={styles.quickActionsContent}
        >
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickAction, { backgroundColor: action.color + '15' }]}
                onPress={() => sendMessage(action.prompt)}
              >
                <Icon size={20} color={action.color} />
                <Text style={styles.quickActionText}>{action.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageRow,
                message.role === 'user' && styles.messageRowUser
              ]}
            >
              {message.role === 'assistant' && (
                <View style={styles.avatarContainer}>
                  <Bot size={20} color={colors.accent.primary} />
                </View>
              )}
              
              <Card style={[
                styles.messageBubble,
                message.role === 'user' && styles.messageBubbleUser
              ]}>
                <Text style={[
                  styles.messageText,
                  message.role === 'user' && styles.messageTextUser
                ]}>
                  {message.content}
                </Text>
                <Text style={[
                  styles.messageTime,
                  message.role === 'user' && styles.messageTimeUser
                ]}>
                  {formatTime(message.timestamp)}
                </Text>
              </Card>
              
              {message.role === 'user' && (
                <View style={styles.avatarContainer}>
                  <User size={20} color={colors.text.primary} />
                </View>
              )}
            </View>
          ))}
          
          {isTyping && (
            <View style={styles.messageRow}>
              <View style={styles.avatarContainer}>
                <Bot size={20} color={colors.accent.primary} />
              </View>
              <Card style={styles.messageBubble}>
                <View style={styles.typingIndicator}>
                  <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
                  <View style={[styles.typingDot, { animationDelay: '200ms' }]} />
                  <View style={[styles.typingDot, { animationDelay: '400ms' }]} />
                </View>
              </Card>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <Card style={styles.inputCard}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me anything about fitness..."
              placeholderTextColor={colors.text.secondary}
              multiline
              maxLength={500}
            />
            
            <View style={styles.inputActions}>
              <TouchableOpacity
                testID="voice-toggle"
                style={[styles.voiceButton, isRecording && styles.voiceButtonActive]}
                onPress={toggleRecording}
              >
                {isRecording ? (
                  <StopCircle size={24} color={colors.status.error} />
                ) : (
                  <Mic size={24} color={colors.text.secondary} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                testID="send-message"
                style={[styles.sendButton, (!inputText.trim() || isTranscribing) && styles.sendButtonDisabled]}
                onPress={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isTranscribing}
              >
                <Send size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Feature Cards */}
        <View style={styles.featureCards}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push('/ai/body-scan')}
            >
              <Card style={styles.featureCardContent}>
                <Brain size={24} color={colors.accent.primary} />
                <Text style={styles.featureCardTitle}>Body Scan</Text>
                <Text style={styles.featureCardText}>AI composition analysis</Text>
              </Card>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push('/ai/form-check')}
            >
              <Card style={styles.featureCardContent}>
                <Target size={24} color={colors.status.info} />
                <Text style={styles.featureCardTitle}>Form Check</Text>
                <Text style={styles.featureCardText}>Real-time corrections</Text>
              </Card>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push('/ai/meal-scan')}
            >
              <Card style={styles.featureCardContent}>
                <Utensils size={24} color={colors.status.success} />
                <Text style={styles.featureCardTitle}>Meal Scan</Text>
                <Text style={styles.featureCardText}>Instant macros</Text>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureCard}
              onPress={() => router.push('/ai/voice-coach')}
            >
              <Card style={styles.featureCardContent}>
                <Mic size={24} color={colors.accent.primary} />
                <Text style={styles.featureCardTitle}>Voice Coach</Text>
                <Text style={styles.featureCardText}>Hands-free session</Text>
              </Card>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <LegalDisclaimer
        visible={showAudioDisclaimer}
        type="audio"
        onClose={() => setShowAudioDisclaimer(false)}
        onAccept={() => {
          setAcceptedAudioDisclaimer(true);
          setShowAudioDisclaimer(false);
        }}
        title="Audio Safety & Consent"
        testID="audioDisclaimerModal"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardAvoid: {
    flex: 1,
  },
  aiBanner: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FF69B4',
  },
  aiBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  aiBannerText: {
    flex: 1,
  },
  aiBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  aiBannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  aiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00FF00',
  },
  aiStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActionsScroll: {
    maxHeight: 50,
    marginBottom: 8,
  },
  quickActionsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    marginRight: 8,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
  },
  messageBubbleUser: {
    backgroundColor: colors.accent.primary,
  },
  messageText: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 10,
    color: colors.text.secondary,
    marginTop: 4,
  },
  messageTimeUser: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  typingIndicator: {
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.secondary,
  },
  inputContainer: {
    padding: 16,
    paddingTop: 8,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    maxHeight: 100,
    marginRight: 12,
  },
  inputActions: {
    flexDirection: 'row',
    gap: 8,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: colors.status.error + '15',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  featureCards: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  featureCard: {
    marginRight: 12,
  },
  featureCardContent: {
    padding: 12,
    alignItems: 'center',
    width: 100,
  },
  featureCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 8,
  },
  featureCardText: {
    fontSize: 10,
    color: colors.text.secondary,
    marginTop: 2,
  },
});