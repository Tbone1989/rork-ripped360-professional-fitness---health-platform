import { Platform, Alert } from 'react-native';

export type TalkOptions = {
  rate?: number;
  pitch?: number;
  lang?: string;
};

export const talkService = {
  speak(text: string, options?: TalkOptions) {
    try {
      const safeText = (text ?? '').toString();
      if (safeText.trim().length === 0) {
        console.log('[talkService] No text to speak');
        return;
      }

      if (Platform.OS === 'web') {
        const synth: SpeechSynthesis | undefined = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
        if (!synth) {
          console.log('[talkService] Web Speech API unavailable');
          return;
        }
        try {
          synth.cancel();
          const utter = new SpeechSynthesisUtterance(safeText);
          utter.rate = options?.rate ?? 1.0;
          utter.pitch = options?.pitch ?? 1.0;
          utter.lang = options?.lang ?? (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
          synth.speak(utter);
        } catch (err) {
          console.log('[talkService] speech synthesis error', err);
        }
        return;
      }

      Alert.alert('Talk Text', 'Text-to-speech is not available in Expo Go. Please enable your device screen reader (VoiceOver/TalkBack) to have content read aloud.');
    } catch (error) {
      console.log('[talkService] speak error', error);
    }
  },
  stop() {
    try {
      if (Platform.OS === 'web') {
        const synth: SpeechSynthesis | undefined = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
        synth?.cancel();
      }
    } catch (error) {
      console.log('[talkService] stop error', error);
    }
  },
};

export default talkService;
