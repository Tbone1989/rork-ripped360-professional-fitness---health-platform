import { Stack } from "expo-router";
import React from "react";

function RootLayoutNav() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return <RootLayoutNav />;
}
