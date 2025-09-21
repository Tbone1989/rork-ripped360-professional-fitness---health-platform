import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { Mic, StopCircle, Bot, User, RotateCcw, Sparkles, Send } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useDisclaimer } from '@/store/legalDisclaimerProvider';

interface Turn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
}

type SessionState = 'idle' | 'recording' | 'transcribing' | 'responding';

export default function VoiceCoachScreen() {
  const [turns, setTurns] = useState<Turn[]>([
    {
      id: 'intro',
      role: 'assistant',
      text: "Hey! I'm your AI Voice Coach. I can guide workouts, give form cues, create routines, and motivate you. Tap the mic to start talking or use the quick buttons below!",
      ts: Date.now(),
    },
  ]);
  const [state, setState] = useState<SessionState>('idle');
  const [inputText, setInputText] = useState<string>('');
  const scrollRef = useRef<ScrollView>(null);
  const { ensureAccepted } = useDisclaimer();
  const recordingRef = useRef<Audio.Recording | null>(null);
  const webMediaStreamRef = useRef<MediaStream | null>(null);
  const webRecorderRef = useRef<MediaRecorder | null>(null);
  const webChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [turns]);

  const canRecord = state === 'idle' || state === 'recording';

  const stopWebRecording = useCallback(() => {
    try {
      console.log('[VoiceCoach] stopWebRecording');
      webRecorderRef.current?.stop();
      webMediaStreamRef.current?.getTracks().forEach(t => t.stop());
    } catch (e) {
      console.log('[VoiceCoach] stopWebRecording error', e);
    }
  }, []);

  const pushTurn = useCallback((t: Omit<Turn, 'id' | 'ts'>) => {
    setTurns(prev => [...prev, { id: String(Date.now() + Math.random()), ts: Date.now(), ...t }]);
  }, []);

  const speakOut = useCallback(async (text: string) => {
    try {
      const safe = (text ?? '').trim();
      if (!safe) return;
      if (Platform.OS === 'web') {
        try {
          const g: any = globalThis as any;
          if (g && g.speechSynthesis && typeof g.SpeechSynthesisUtterance !== 'undefined') {
            const utter = new g.SpeechSynthesisUtterance(safe);
            utter.rate = 1.02;
            utter.pitch = 1.0;
            g.speechSynthesis.cancel();
            g.speechSynthesis.speak(utter);
          }
        } catch (e) {
          console.log('[VoiceCoach] Web speech synthesis error', e);
        }
        return;
      }
      try {
        if (Speech && typeof Speech.speak === 'function') {
          Speech.speak(safe, { rate: 1.02, pitch: 1.0 });
        }
      } catch (e) {
        console.log('[VoiceCoach] TTS not available', e);
      }
    } catch (e) {
      console.log('[VoiceCoach] speak error', e);
    }
  }, []);

  const getAssistantReply = useCallback(async (text: string) => {
    console.log('[VoiceCoach] getAssistantReply', text);
    setState('responding');
    try {
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content:
                'You are an energetic, motivational AI fitness voice coach. Give specific, actionable guidance with exact rep counts, timing, and form cues. Be encouraging and enthusiastic. Keep responses conversational but informative. Always end with a motivating question or next step to keep the workout flowing.',
            },
            ...turns.map(t => ({ role: t.role, content: t.text })),
            { role: 'user', content: text },
          ],
        }),
      });
      const data = await response.json();
      const reply: string = data?.completion ?? "Let's keep going. What would you like to focus on next?";
      pushTurn({ role: 'assistant', text: reply });
      await speakOut(reply);
    } catch (e) {
      console.log('llm error', e);
      pushTurn({ role: 'assistant', text: 'Connection issue. Try again in a moment.' });
    } finally {
      setState('idle');
    }
  }, [turns, pushTurn, speakOut]);

  const transcribeBlob = useCallback(async (blob: Blob) => {
    console.log('[VoiceCoach] transcribeBlob size', blob.size);
    setState('transcribing');
    try {
      const form = new FormData();
      const file = new File([blob], 'voice.webm', { type: 'audio/webm' });
      form.append('audio', file as any);
      const res = await fetch('https://toolkit.rork.com/stt/transcribe/', { method: 'POST', body: form });
      const data = await res.json();
      const text: string = data?.text ?? '';
      console.log('[VoiceCoach] STT result (web):', text);
      if (text && text.trim().length > 0) {
        pushTurn({ role: 'user', text });
        await getAssistantReply(text);
      } else {
        pushTurn({ role: 'assistant', text: "I didn't catch that. Please try again and speak clearly." });
        setState('idle');
      }
    } catch (e) {
      console.log('stt web error', e);
      pushTurn({ role: 'assistant', text: 'I could not understand that. Please try again.' });
      setState('idle');
    }
  }, [pushTurn, getAssistantReply]);

  const startRecording = useCallback(async () => {
    if (state === 'recording') return;
    console.log('[VoiceCoach] startRecording');
    setState('recording');
    if (Platform.OS === 'web') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        webMediaStreamRef.current = stream;
        const mimeType = 'audio/webm';
        // @ts-ignore web-only API
        const recorder: MediaRecorder = new MediaRecorder(stream, { mimeType } as any);
        webRecorderRef.current = recorder;
        webChunksRef.current = [];
        // @ts-ignore web-only API types
        recorder.ondataavailable = (e: BlobEvent) => {
          if (e.data && e.data.size > 0) webChunksRef.current.push(e.data);
        };
        recorder.onstop = async () => {
          const blob = new Blob(webChunksRef.current, { type: 'audio/webm' });
          webChunksRef.current = [];
          await transcribeBlob(blob);
        };
        recorder.start();
      } catch (e) {
        console.log('[VoiceCoach] web mic start error', e);
        setState('idle');
      }
    } else {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const rec = new Audio.Recording();
        await rec.prepareToRecordAsync({
          android: {
            extension: '.m4a',
            // @ts-ignore constants typed any
            outputFormat: 2 as any,
            // @ts-ignore constants typed any
            audioEncoder: 3 as any,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: '.wav',
            // @ts-ignore constants typed any
            outputFormat: 1 as any,
            // @ts-ignore constants typed any
            audioQuality: 0 as any,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          web: {},
        } as any);
        recordingRef.current = rec;
        await rec.startAsync();
      } catch (e) {
        console.log('[VoiceCoach] native mic start error', e);
        setState('idle');
      }
    }
  }, [state, transcribeBlob]);

  const stopRecording = useCallback(async () => {
    if (state !== 'recording') return;
    console.log('[VoiceCoach] stopRecording');
    if (Platform.OS === 'web') {
      try {
        stopWebRecording();
      } catch {
        // noop
      }
      return;
    }
    try {
      const rec = recordingRef.current;
      if (rec) {
        await rec.stopAndUnloadAsync();
        const uri = rec.getURI();
        recordingRef.current = null;
        try {
          await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
        } catch {
          // noop
        }
        if (uri) {
          const uriParts = uri.split('.');
          const fileType = uriParts[uriParts.length - 1] ?? 'm4a';
          const form = new FormData();
          // @ts-expect-error RN File type
          form.append('audio', { uri, name: 'voice.' + fileType, type: 'audio/' + fileType });
          setState('transcribing');
          const res = await fetch('https://toolkit.rork.com/stt/transcribe/', { method: 'POST', body: form });
          const data = await res.json();
          const text: string = data?.text ?? '';
          console.log('[VoiceCoach] STT result (native):', text);
          if (text && text.trim().length > 0) {
            pushTurn({ role: 'user', text });
            await getAssistantReply(text);
          } else {
            pushTurn({ role: 'assistant', text: "I didn't catch that. Please try again and speak clearly." });
            setState('idle');
          }
        } else {
          setState('idle');
        }
      }
    } catch (e) {
      console.log('[VoiceCoach] native mic stop error', e);
      setState('idle');
    }
  }, [getAssistantReply, pushTurn, state, stopWebRecording]);

  const onMicPress = useCallback(async () => {
    const accepted = await ensureAccepted('audio');
    if (!accepted) return;
    if (state === 'recording') {
      await stopRecording();
    } else if (canRecord) {
      await startRecording();
    }
  }, [ensureAccepted, canRecord, startRecording, stopRecording, state]);

  const intents = useMemo(
    () => [
      { id: 'warmup', label: '5-min Warm-up', prompt: 'Guide me through a 5-minute dynamic warm-up with specific exercises and timing.' },
      { id: 'form', label: 'Form Check', prompt: 'Give me detailed form cues for proper squat technique.' },
      { id: 'hiit', label: 'HIIT Workout', prompt: 'Create a 15-minute HIIT workout with exercises, work/rest intervals, and coaching cues.' },
      { id: 'motivate', label: 'Motivate Me', prompt: 'Give me powerful motivation to push through this tough set!' },
      { id: 'routine', label: 'Quick Routine', prompt: 'Create a 20-minute full body workout I can do right now.' },
      { id: 'recovery', label: 'Cool Down', prompt: 'Guide me through a 5-minute cool down and stretching routine.' },
    ],
    [],
  );

  const runIntent = useCallback(async (text: string) => {
    const safe = (text ?? '').trim();
    if (!safe) return;
    pushTurn({ role: 'user', text: safe });
    await getAssistantReply(safe);
  }, [getAssistantReply, pushTurn]);

  useEffect(() => {
    return () => {
      try {
        if (Platform.OS === 'web') {
          webRecorderRef.current?.stop();
          webMediaStreamRef.current?.getTracks().forEach((t: MediaStreamTrack) => t.stop());
        } else if (recordingRef.current) {
          recordingRef.current.stopAndUnloadAsync().catch(() => {});
          Audio.setAudioModeAsync({ allowsRecordingIOS: false }).catch(() => {});
        }
      } catch (e) {
        console.log('[VoiceCoach] cleanup error', e);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Voice Coach', headerStyle: { backgroundColor: colors.background.primary }, headerTintColor: colors.text.primary }} />

      <ScrollView ref={scrollRef} style={styles.chat} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
        {turns.map(t => (
          <View key={t.id} style={[styles.row, t.role === 'user' ? styles.rowEnd : undefined]}>
            {t.role === 'assistant' && (
              <View style={styles.avatar}><Bot size={18} color={colors.accent.primary} /></View>
            )}
            <Card style={[styles.bubble, t.role === 'user' ? styles.userBubble : undefined]}>
              <Text style={[styles.text, t.role === 'user' ? styles.userText : undefined]}>{t.text}</Text>
            </Card>
            {t.role === 'user' && (
              <View style={styles.avatar}><User size={18} color={colors.text.primary} /></View>
            )}
          </View>
        ))}
        {state === 'responding' && (
          <View style={styles.row}>
            <View style={styles.avatar}><Bot size={18} color={colors.accent.primary} /></View>
            <Card style={styles.bubble}><ActivityIndicator color={colors.text.secondary} /></Card>
          </View>
        )}
      </ScrollView>

      <View style={styles.intents}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.intentsContent}>
          {intents.map(i => (
            <TouchableOpacity key={i.id} testID={`intent-${i.id}`} style={styles.intent} onPress={() => runIntent(i.prompt)}>
              <Sparkles size={16} color={colors.accent.primary} />
              <Text style={styles.intentText}>{i.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity testID="reset-session" style={styles.resetBtn} onPress={() => { setTurns(turns.slice(0, 1)); setState('idle'); }}>
          <RotateCcw size={22} color={colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity
          testID="mic-toggle"
          onPress={onMicPress}
          onLongPress={Platform.OS !== 'web' ? startRecording : undefined}
          onPressOut={Platform.OS !== 'web' ? stopRecording : undefined}
          delayLongPress={120}
          style={[styles.mic, state === 'recording' ? styles.micActive : undefined]}
        >
          {state === 'recording' ? (
            <StopCircle size={36} color={colors.status.error} />
          ) : (
            <Mic size={36} color={'#FFFFFF'} />
          )}
        </TouchableOpacity>
        <View style={styles.textEntry}>
          <TextInput
            testID="voicecoach-input"
            style={styles.input}
            placeholder="Type a question..."
            placeholderTextColor={colors.text.secondary}
            value={inputText}
            onChangeText={setInputText}
            returnKeyType="send"
            onSubmitEditing={() => {
              const v = (inputText ?? '').trim();
              if (v.length > 0) {
                setInputText('');
                runIntent(v);
              }
            }}
          />
          <TouchableOpacity
            testID="send-text"
            style={styles.sendBtn}
            onPress={() => {
              const v = (inputText ?? '').trim();
              if (v.length > 0) {
                setInputText('');
                runIntent(v);
              }
            }}
          >
            <Send size={20} color={'#FFFFFF'} />
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  chat: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  rowEnd: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  bubble: {
    maxWidth: '74%',
    padding: 12,
  },
  userBubble: {
    backgroundColor: colors.accent.primary,
  },
  text: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  intents: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  intentsContent: {
    gap: 8,
  },
  intent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: colors.background.secondary,
    marginRight: 8,
  },
  intentText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.primary,
  },
  controls: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resetBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
  },
  mic: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
  },
  micActive: {
    backgroundColor: colors.status.error + '20',
  },
  placeholder: {
    width: 8,
    height: 48,
  },
  textEntry: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 14,
    backgroundColor: colors.background.secondary,
    color: colors.text.primary,
    fontSize: 14,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
  },
});