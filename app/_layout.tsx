import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
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

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1, gcTime: 10 * 60 * 1000 },
    mutations: { retry: 0 },
  },
});

const styles = StyleSheet.create({
  gestureRoot: { flex: 1 },
  root: { flex: 1, backgroundColor: colors.background.primary },
  centerWrap: { flex: 1, alignItems: 'center' },
  contentMax: { flex: 1, width: '100%', maxWidth: 1180, paddingHorizontal: 24, paddingVertical: 16 },
});

function RootLayoutNav() {
  const content = (
    Platform.OS === 'web' ? (
      <View style={styles.centerWrap} testID="web-center-wrap">
        <View style={styles.contentMax} testID="web-content-max">
          <Slot />
        </View>
      </View>
    ) : (
      <Slot />
    )
  );
  return content;
}

export default function RootLayout() {
  useEffect(() => {
    const initializeServices = async () => {
      try {
        if (Platform.OS !== 'web') {
          await notificationService.initialize();
        }
        await calendarService.initialize();
        console.log('[RootLayout] Services initialized');
      } catch (error) {
        console.error('[RootLayout] Error initializing services:', error);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    initializeServices();

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
                <RootLayoutNav />
                <DisclaimerGuard />
                <DisclaimerHost />
              </View>
            </GestureHandlerRootView>
          </DisclaimerProvider>
        </WellnessProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
