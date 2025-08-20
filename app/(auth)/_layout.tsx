import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="coach-login" />
      <Stack.Screen name="doctor-login" />
      <Stack.Screen name="admin-login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}