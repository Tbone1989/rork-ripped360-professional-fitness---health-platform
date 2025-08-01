import { Stack } from 'expo-router';
import React from 'react';

export default function CoachLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="rehab" />
      <Stack.Screen name="clients" />
      <Stack.Screen name="schedule" />
      <Stack.Screen name="messages" />
      <Stack.Screen name="session/[id]" />
      <Stack.Screen name="client/[id]" />
      <Stack.Screen name="messages/[id]" />
      <Stack.Screen name="schedule/[id]" />
      <Stack.Screen name="progress/[id]" />
    </Stack>
  );
}