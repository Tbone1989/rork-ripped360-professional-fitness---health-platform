import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { View, Platform, StyleSheet } from "react-native";

import { colors } from "@/constants/colors";
import { WellnessProvider } from "@/store/wellnessStore";
import { DisclaimerProvider, DisclaimerGuard, DisclaimerHost } from "@/store/legalDisclaimerProvider";
import { trpc, trpcClient } from "@/lib/trpc";
import notificationService from "@/services/notificationService";
import calendarService from "@/services/calendarService";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerTitleAlign: Platform.OS === 'web' ? 'center' : undefined,
        contentStyle: {
          backgroundColor: colors.background.primary,
          paddingHorizontal: Platform.OS === 'web' ? 24 : 0,
          paddingVertical: Platform.OS === 'web' ? 16 : 0,
        },
      }}
    >

      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="workout/[id]" 
        options={{ 
          title: "Workout Details",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="plan/[id]" 
        options={{ 
          title: "Workout Plan",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="exercise/[id]" 
        options={{ 
          title: "Exercise Details",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="exercise/[id]/session" 
        options={{ 
          title: "Exercise Session",
          presentation: "fullScreenModal",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="workout/[id]/session" 
        options={{ 
          title: "Workout Session",
          presentation: "fullScreenModal",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="category/[id]" 
        options={{ 
          title: "Category",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="coaching/[id]" 
        options={{ 
          title: "Coach Profile",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="medical/bloodwork/[id]" 
        options={{ 
          title: "Bloodwork Results",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="supplements/[id]" 
        options={{ 
          title: "Supplement Details",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="medicines/[id]" 
        options={{ 
          title: "Medicine Details",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="workouts/generate" 
        options={{ 
          title: "AI Workout Generator",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="workouts/dictionary" 
        options={{ 
          title: "Exercise Dictionary",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="medical/upload" 
        options={{ 
          title: "Upload Bloodwork",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="test-backend" 
        options={{ 
          title: "Backend API Test",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="contest/posing" 
        options={{ 
          title: "Posing Practice",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="contest/peak-week" 
        options={{ 
          title: "Peak Week Protocol",
          presentation: "card",
        }} 
      />
      <Stack.Screen 
        name="contest/create-protocol" 
        options={{ 
          title: "Create Protocol",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="test-trpc-debug" 
        options={{ 
          title: "tRPC Debug",
          presentation: "card",
        }} 
      />





    </Stack>
  );
}

const styles = StyleSheet.create({
  gestureRoot: { flex: 1 },
  root: { flex: 1, backgroundColor: colors.background.primary },
  centerWrap: { flex: 1, alignItems: 'center' },
  contentMax: { flex: 1, width: '100%', maxWidth: 1180, paddingHorizontal: 24, paddingVertical: 16 },
});

export default function RootLayout() {
  useEffect(() => {
    // Initialize services
    const initializeServices = async () => {
      try {
        // Initialize notifications (mobile only)
        if (Platform.OS !== 'web') {
          await notificationService.initialize();
        }
        
        // Initialize calendar service
        await calendarService.initialize();
        
        console.log('[RootLayout] Services initialized');
      } catch (error) {
        console.error('[RootLayout] Error initializing services:', error);
      } finally {
        // Hide splash screen after initialization
        await SplashScreen.hideAsync();
      }
    };

    initializeServices();

    // Cleanup on unmount
    return () => {
      if (Platform.OS !== 'web') {
        notificationService.cleanup();
      }
    };
  }, []);

  console.log('[RootLayout] Mounted');

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <WellnessProvider>
          <DisclaimerProvider>
            <GestureHandlerRootView style={styles.gestureRoot}>
              <View style={styles.root} testID="root-layout">
                <StatusBar style="light" />
                <DisclaimerGuard />
                {Platform.OS === 'web' ? (
                  <View style={styles.centerWrap} testID="web-center-wrap">
                    <View style={styles.contentMax} testID="web-content-max">
                      <RootLayoutNav />
                    </View>
                  </View>
                ) : (
                  <RootLayoutNav />
                )}
                <DisclaimerHost />
              </View>
            </GestureHandlerRootView>
          </DisclaimerProvider>
        </WellnessProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}