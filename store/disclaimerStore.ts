import { useCallback, useEffect, useRef, useState } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { LegalDisclaimer } from '@/components/ui/LegalDisclaimer';
import { usePathname } from 'expo-router';
import React from "react";

export type DisclaimerType = 'medical' | 'doctor' | 'audio' | 'coach' | 'product_selling' | 'general';

interface AcceptanceMap {
  medical?: boolean;
  doctor?: boolean;
  audio?: boolean;
  coach?: boolean;
  product_selling?: boolean;
  general?: boolean;
}

interface DisclaimerState {
  visible: boolean;
  type: DisclaimerType | null;
}

const STORAGE_KEY = 'legal_disclaimer_acceptance_v1';

export const [DisclaimerProvider, useDisclaimer] = createContextHook(() => {
  const [acceptance, setAcceptance] = useState<AcceptanceMap>({});
  const [state, setState] = useState<DisclaimerState>({ visible: false, type: null });
  const pendingResolve = useRef<((accepted: boolean) => void) | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as AcceptanceMap;
          setAcceptance(parsed ?? {});
        }
      } catch (e) {
        console.error('[Disclaimer] Failed to load acceptance', e);
      }
    };
    load();
  }, []);

  const persist = useCallback(async (next: AcceptanceMap) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('[Disclaimer] Failed to persist acceptance', e);
    }
  }, []);

  const ensureAccepted = useCallback(async (type: DisclaimerType): Promise<boolean> => {
    if (acceptance?.[type]) return true;
    return new Promise<boolean>((resolve) => {
      pendingResolve.current = resolve;
      setState({ visible: true, type });
    });
  }, [acceptance]);

  const onAccept = useCallback(() => {
    const t = state.type;
    if (!t) return;
    const next = { ...acceptance, [t]: true } as AcceptanceMap;
    setAcceptance(next);
    persist(next);
    setState({ visible: false, type: null });
    pendingResolve.current?.(true);
    pendingResolve.current = null;
  }, [state.type, acceptance, persist]);

  const onClose = useCallback(() => {
    setState({ visible: false, type: null });
    pendingResolve.current?.(false);
    pendingResolve.current = null;
  }, []);

  const Guard: React.FC = () => {
    const pathname = usePathname();

    useEffect(() => {
      const run = async () => {
        try {
          if (!acceptance?.general) {
            await ensureAccepted('general');
          }
          if (pathname?.includes('doctor') || pathname?.startsWith('/medical')) {
            if (!acceptance?.doctor) {
              await ensureAccepted('doctor');
            }
            if (!acceptance?.medical) {
              await ensureAccepted('medical');
            }
          }
        } catch (e) {
          console.error('[DisclaimerGuard] error', e);
        }
      };
      run();
    }, [pathname]);

    return null;
  };

  const Host: React.FC = () => {
    const visible = state.visible && !!state.type;
    if (!visible) return null;
    return React.createElement(LegalDisclaimer, {
      visible: true,
      onClose,
      onAccept,
      type: state.type as DisclaimerType,
      testID: `disclaimer-${state.type ?? 'unknown'}`,
    });
  };

  return {
    acceptance,
    visible: state.visible,
    type: state.type,
    ensureAccepted,
    Host,
    Guard,
    isWeb: Platform.OS === 'web',
  };
});
