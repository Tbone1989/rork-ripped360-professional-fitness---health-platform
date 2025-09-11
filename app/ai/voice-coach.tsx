import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { Mic, StopCircle, Bot, User, RotateCcw, Sparkles } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';
import { Audio } from 'expo-av';

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
      text: "I'm your AI Voice Coach. Tap and hold the mic or tap to start/stop. Ask for a workout, cues, or motivation.",
      ts: Date.now(),
    },
  ]);
  const [state, setState] = useState<SessionState>('idle');
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(true);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const webMediaStreamRef = useRef<MediaStream | null>(null);
  const webRecorderRef = useRef<MediaRecorder | null>(null);
  const webChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [turns]);

  const canRecord = acceptedDisclaimer && (state === 'idle' || state === 'recording');

  const stopWebRecording = useCallback(() => {
    try {
      webRecorderRef.current?.stop();
      webMediaStreamRef.current?.getTracks().forEach(t => t.stop());
    } catch {}
  }, []);

  const pushTurn = useCallback((t: Omit<Turn, 'id' | 'ts'>) => {
    setTurns(prev => [...prev, { id: String(Date.now() + Math.random()), ts: Date.now(), ...t }]);
  }, []);

  const getAssistantReply = useCallback(async (text: string) => {
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
                'You are an upbeat, concise AI fitness voice coach. Give short, actionable tips, rep/set counts, cues, and pacing. Avoid long paragraphs. Offer a quick follow-up question to keep session flowing.',
            },
            ...turns.map(t => ({ role: t.role, content: t.text })),
            { role: 'user', content: text },
          ],
        }),
      });
      const data = await response.json();
      const reply: string = data?.completion ?? "Let's keep going. What would you like to focus on next?";
      pushTurn({ role: 'assistant', text: reply });
    } catch (e) {
      console.log('llm error', e);
      pushTurn({ role: 'assistant', text: 'Connection issue. Try again in a moment.' });
    } finally {
      setState('idle');
    }
  }, [turns, pushTurn]);

  const transcribeBlob = useCallback(async (blob: Blob) => {
    setState('transcribing');
    try {
      const form = new FormData();
      const file = new File([blob], 'voice.webm', { type: 'audio/webm' });
      form.append('audio', file as any);
      const res = await fetch('https://toolkit.rork.com/stt/transcribe/', { method: 'POST', body: form });
      const data = await res.json();
      const text: string = data?.text ?? '';
      if (text) {
        pushTurn({ role: 'user', text });
        await getAssistantReply(text);
      }
    } catch (e) {
      console.log('stt web error', e);
      pushTurn({ role: 'assistant', text: 'I could not understand that. Please try again.' });
      setState('idle');
    }
  }, [pushTurn, getAssistantReply]);



  const startRecording = useCallback(async () => {
    if (!acceptedDisclaimer) {
      setShowDisclaimer(true);
      return;
    }
    if (state === 'recording') return;
    setState('recording');
    if (Platform.OS === 'web') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        webMediaStreamRef.current = stream;
        // @ts-ignore
        const recorder: MediaRecorder = new MediaRecorder(stream);
        webRecorderRef.current = recorder;
        webChunksRef.current = [];
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
        console.log('web mic start error', e);
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
        recordingRef.current = rec;
        await rec.startAsync();
      } catch (e) {
        console.log('native mic start error', e);
        setState('idle');
      }
    }
  }, [acceptedDisclaimer, state, transcribeBlob]);

  const stopRecording = useCallback(async () => {
    if (state !== 'recording') return;
    if (Platform.OS === 'web') {
      try {
        stopWebRecording();
      } catch {}
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
        } catch {}
        if (uri) {
          const uriParts = uri.split('.');
          const fileType = uriParts[uriParts.length - 1];
          const form = new FormData();
          form.append('audio', { uri, name: 'voice.' + fileType, type: 'audio/' + fileType } as any);
          setState('transcribing');
          const res = await fetch('https://toolkit.rork.com/stt/transcribe/', { method: 'POST', body: form });
          const data = await res.json();
          const text: string = data?.text ?? '';
          if (text) {
            pushTurn({ role: 'user', text });
            await getAssistantReply(text);
          } else {
            setState('idle');
          }
        } else {
          setState('idle');
        }
      }
    } catch (e) {
      console.log('native mic stop error', e);
      setState('idle');
    }
  }, [getAssistantReply, pushTurn, state, stopWebRecording]);

  const onMicPress = useCallback(async () => {
    if (!canRecord) {
      setShowDisclaimer(true);
      return;
    }
    if (state === 'recording') {
      await stopRecording();
    } else {
      await startRecording();
    }
  }, [canRecord, startRecording, stopRecording, state]);

  const intents = useMemo(
    () => [
      { id: 'warmup', label: '5-min Warm-up', prompt: 'Guide me through a 5-minute dynamic warm-up.' },
      { id: 'form', label: 'Form Cues', prompt: 'Give me squat form cues for 3 sets.' },
      { id: 'hit', label: 'HIIT 10', prompt: 'Create a 10-minute HIIT finisher with times.' },
      { id: 'mot', label: 'Motivate', prompt: 'Give me short motivation for the next set.' },
    ],
    [],
  );

  const runIntent = useCallback(async (text: string) => {
    const safe = (text ?? '').trim();
    if (!safe) return;
    pushTurn({ role: 'user', text: safe });
    await getAssistantReply(safe);
  }, [getAssistantReply, pushTurn]);

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
          style={[styles.mic, state === 'recording' ? styles.micActive : undefined]}
        >
          {state === 'recording' ? (
            <StopCircle size={36} color={colors.status.error} />
          ) : (
            <Mic size={36} color={'#FFFFFF'} />
          )}
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>

      <LegalDisclaimer
        visible={showDisclaimer}
        type="audio"
        title="Audio Safety & Consent"
        onClose={() => setShowDisclaimer(false)}
        onAccept={() => { setAcceptedDisclaimer(true); setShowDisclaimer(false); }}
        testID="voiceDisclaimerModal"
      />
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
    width: 48,
    height: 48,
  },
});