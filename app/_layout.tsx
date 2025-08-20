import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import { colors } from "@/constants/colors";
import { WellnessProvider } from "@/store/wellnessStore";
import { trpc, trpcClient } from "@/lib/trpc";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

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
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
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
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  console.log('[RootLayout] Mounted');

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <WellnessProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
              <StatusBar style="light" />
              <RootLayoutNav />
            </View>
          </GestureHandlerRootView>
        </WellnessProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}