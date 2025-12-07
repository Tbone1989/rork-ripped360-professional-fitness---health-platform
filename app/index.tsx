import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { colors } from '@/constants/colors';

export default function Index() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const hasHydrated = useUserStore((state) => state.hasHydrated);
  const user = useUserStore((state) => state.user);
  const setHasHydrated = useUserStore((state) => state.setHasHydrated);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    console.log('[Index] Component mounted');
    console.log('[Index] hasHydrated:', hasHydrated, 'isAuthenticated:', isAuthenticated);
    
    const timeout = setTimeout(() => {
      console.log('[Index] Force ready after 1s timeout');
      if (!hasHydrated) {
        console.log('[Index] Forcing hydration complete');
        setHasHydrated(true);
      }
      setIsReady(true);
    }, 1000);
    
    if (hasHydrated) {
      console.log('[Index] Already hydrated, setting ready');
      setIsReady(true);
    }
    
    return () => {
      console.log('[Index] Cleanup');
      clearTimeout(timeout);
    };
  }, [hasHydrated, isAuthenticated, setHasHydrated]);
  
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

