import React from 'react';
import { Redirect } from 'expo-router';
import { useUserStore } from '@/store/userStore';

export default function Index() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const hasHydrated = useUserStore((state) => state.hasHydrated);
  const user = useUserStore((state) => state.user);
  
  if (!hasHydrated) {
    return null;
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

