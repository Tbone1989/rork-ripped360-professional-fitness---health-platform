import { Stack } from "expo-router";
import React from "react";
import { ThemeProvider, DefaultTheme, Theme } from "@react-navigation/native";

function RootLayoutNav() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const theme: Theme = DefaultTheme;
  return (
    <ThemeProvider value={theme}>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
