import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function AdminLayout() {
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
      }}
    >
      <Stack.Screen name="dashboard" options={{ title: 'Admin Dashboard' }} />
      <Stack.Screen name="database" options={{ title: 'Database Management' }} />
      <Stack.Screen name="login" options={{ title: 'Admin Login' }} />
      <Stack.Screen name="messages" options={{ title: 'Message Management' }} />
      <Stack.Screen name="reports" options={{ title: 'Reports' }} />
      <Stack.Screen name="settings" options={{ title: 'Admin Settings' }} />
      <Stack.Screen name="testing" options={{ title: 'Testing Suite' }} />
    </Stack>
  );
}