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
    console.log("[RootLayout] Mounted");

    let isMounted = true;

    SplashScreen.hideAsync().catch((e) => {
      console.log("[RootLayout] SplashScreen hide error (safe to ignore):", e);
    });

    const initializeServices = async () => {
      try {
        console.log("[RootLayout] Initializing services...");

        if (!isMounted) return;

        if (Platform.OS !== "web") {
          await notificationService.initialize().catch((e) => {
            console.log("[RootLayout] Notification init failed:", e);
          });
        }

        if (!isMounted) return;

        await calendarService.initialize().catch((e) => {
          console.log("[RootLayout] Calendar init failed:", e);
        });

        if (!isMounted) return;

        console.log("[RootLayout] Services initialized");
      } catch (error) {
        console.error("[RootLayout] Service init error:", error);
      }
    };

    const timeout = setTimeout(() => {
      void initializeServices();
    }, 500);

    return () => {
      console.log("[RootLayout] Unmounting");
      isMounted = false;
      clearTimeout(timeout);
      if (Platform.OS !== "web") {
        notificationService.cleanup();
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <trpc.Provider>
          <ThemeProvider>
            <WellnessProvider>
              <DisclaimerProvider>
                <GestureHandlerRootView style={styles.gestureRoot}>
                  <ThemedRoot>
                    <RootLayoutNav />
                    <DisclaimerGuard />
                    <DisclaimerHost />
                  </ThemedRoot>
                </GestureHandlerRootView>
              </DisclaimerProvider>
            </WellnessProvider>
          </ThemeProvider>
        </trpc.Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}