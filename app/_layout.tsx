import { Stack } from "expo-router";
import React from "react";
import { NavigationContainer, DefaultTheme, Theme } from "@react-navigation/native";

function RootLayoutNav() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const theme: Theme = DefaultTheme;
  return (
    <NavigationContainer theme={theme}>
      <RootLayoutNav />
    </NavigationContainer>
  );
}
