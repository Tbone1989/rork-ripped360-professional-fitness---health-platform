import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { colors } from '@/constants/colors';

export default function Index() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const hasHydrated = useUserStore((state) => state.hasHydrated);
  const user = useUserStore((state) => state.user);
  const setHasHydrated = useUserStore((state) => state.setHasHydrated);
  const [hydrationFallbackReady, setHydrationFallbackReady] = useState<boolean>(() => hasHydrated);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (hasHydrated) {
      console.log('[Index] Hydration complete');
      setHydrationFallbackReady(true);
    } else {
      console.log('[Index] Waiting for hydration...');
      timeout = setTimeout(() => {
        console.log('[Index] Hydration fallback triggered');
        setHasHydrated(true);
        setHydrationFallbackReady(true);
      }, 1500);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [hasHydrated, setHasHydrated]);

  const isReady = useMemo(() => hasHydrated || hydrationFallbackReady, [hasHydrated, hydrationFallbackReady]);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent.primary} />
        <Text style={styles.loadingText}>Starting...</Text>
      </View>
    );
  }

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
    gap: 16,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: 16,
  },
});

