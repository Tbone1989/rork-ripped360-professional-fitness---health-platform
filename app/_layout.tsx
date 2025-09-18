import { Stack } from "expo-router";
import React from "react";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";

function RootLayoutNav() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
