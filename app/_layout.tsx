import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { View, Platform, StyleSheet, InteractionManager } from "react-native";

import { colors } from "@/constants/colors";
import { WellnessProvider } from "@/store/wellnessStore";
import { DisclaimerProvider, DisclaimerGuard, DisclaimerHost } from "@/store/legalDisclaimerProvider";
import { ThemeProvider, useTheme } from "@/store/themeProvider";
import { trpc } from "@/lib/trpc";
import notificationService from "@/services/notificationService";
import calendarService from "@/services/calendarService";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1, gcTime: 10 * 60 * 1000 },
    mutations: { retry: 0 },
  },
});

const styles = StyleSheet.create({
  gestureRoot: { flex: 1 },
  root: { flex: 1, backgroundColor: colors.background.primary },
});

function ThemedRoot({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const barStyle = theme.mode === "dark" ? "light" : "dark";

  return (
    <View
      style={[styles.root, { backgroundColor: theme.colors.background.primary }]}
      testID="root-layout"
    >
      <StatusBar style={barStyle} />
      {children}
    </View>
  );
}

function RootLayoutNav() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  useEffect(() => {
    let isMounted = true;

    const initializeServices = async () => {
      const t0 = Date.now();
      try {
        if (Platform.OS !== "web") {
          await notificationService.initialize();
        }
        await calendarService.initialize();
        console.log("[RootLayout] Services initialized in", Date.now() - t0, "ms");
      } catch (error) {
        console.error("[RootLayout] Error initializing services:", error);
      }
    };

    SplashScreen.hideAsync().catch(() => {});

    const task = InteractionManager.runAfterInteractions(() => {
      if (!isMounted) return;
      setTimeout(() => {
        if (!isMounted) return;
        initializeServices();
      }, 0);
    });

    return () => {
      isMounted = false;
      task.cancel?.();
      if (Platform.OS !== "web") {
        notificationService.cleanup();
      }
    };
  }, []);

  console.log("[RootLayout] Mounted at", new Date().toISOString());

  return (
    <trpc.Provider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <WellnessProvider>
            <DisclaimerProvider>
              <GestureHandlerRootView style={styles.gestureRoot}>
                <ThemedRoot>
                  <ErrorBoundary>
                    <RootLayoutNav />
                    <DisclaimerGuard />
                    <DisclaimerHost />
                  </ErrorBoundary>
                </ThemedRoot>
              </GestureHandlerRootView>
            </DisclaimerProvider>
          </WellnessProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}