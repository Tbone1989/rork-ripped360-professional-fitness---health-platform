import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { Redirect } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { colors } from '@/constants/colors';

const HYDRATION_FALLBACK_MS = 1500;

export default function Index() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const hasHydrated = useUserStore((state) => state.hasHydrated);
  const user = useUserStore((state) => state.user);
  const setHasHydrated = useUserStore((state) => state.setHasHydrated);
  const [hydrationFallbackReady, setHydrationFallbackReady] = useState<boolean>(() => hasHydrated);
  const [stuck, setStuck] = useState<boolean>(false);
  const [forceProceed, setForceProceed] = useState<boolean>(false);

  useEffect(() => {
    console.log('[Index] Mount/state', { hasHydrated, isAuthenticated, role: user?.role ?? null });
  }, [hasHydrated, isAuthenticated, user?.role]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let stuckTimeout: ReturnType<typeof setTimeout> | undefined;

    if (hasHydrated) {
      console.log('[Index] Hydration complete');
      setHydrationFallbackReady(true);
      setStuck(false);
      setForceProceed(false);
    } else {
      console.log('[Index] Waiting for hydration...');

      stuckTimeout = setTimeout(() => {
        console.log('[Index] Still waiting for hydration - showing fallback UI');
        setStuck(true);
      }, 800);

      timeout = setTimeout(() => {
        console.log('[Index] Hydration fallback reached -> proceeding with current state');
        setHydrationFallbackReady(true);
        setForceProceed(true);

        try {
          setHasHydrated(true);
        } catch (e) {
          console.log('[Index] setHasHydrated failed (non-fatal):', e);
        }
      }, HYDRATION_FALLBACK_MS);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      if (stuckTimeout) clearTimeout(stuckTimeout);
    };
  }, [hasHydrated, setHasHydrated]);

  const isReady = useMemo(
    () => Boolean(hasHydrated || hydrationFallbackReady || forceProceed),
    [hasHydrated, hydrationFallbackReady, forceProceed]
  );

  if (!isReady) {
    return (
      <View style={styles.loadingContainer} testID="app-loading">
        <ActivityIndicator size="large" color={colors.accent.primary} />
        <Text style={styles.loadingTitle}>Loading Ripped360…</Text>
        <Text style={styles.loadingText}>
          {stuck ? 'Taking longer than expected…' : 'Starting up…'}
        </Text>
        <Pressable
          onPress={() => {
            console.log('[Index] User tapped Continue (proceed)');
            setForceProceed(true);
            setHydrationFallbackReady(true);
            try {
              setHasHydrated(true);
            } catch (e) {
              console.log('[Index] setHasHydrated failed (non-fatal):', e);
            }
          }}
          style={styles.secondaryButton}
          testID="loading-continue"
        >
          <Text style={styles.secondaryButtonText}>Continue</Text>
        </Pressable>
      </View>
    );
  }

  console.log('[Index] Ready -> routing', { isAuthenticated, role: user?.role ?? null });

  if (isAuthenticated && user) {
    if (user.role === 'coach') {
      return <Redirect href="/coach/dashboard" />;
    }
    if (user.role === 'admin') {
      return <Redirect href="/admin/dashboard" />;
    }
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  loadingTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  secondaryButton: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.secondary,
  },
  secondaryButtonText: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});

