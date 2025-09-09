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
      <Stack.Screen name="volume-tracking" options={{ title: 'User Volume Tracking' }} />
      <Stack.Screen name="user-issues" options={{ title: 'User Issues & Requests' }} />
      <Stack.Screen name="sales" options={{ title: 'Sales Analytics' }} />
      <Stack.Screen name="marketing" options={{ title: 'Marketing Center' }} />
      <Stack.Screen name="api-status" options={{ title: 'API Status', headerShown: false }} />
      <Stack.Screen name="api-test" options={{ title: 'API Connection Test', headerShown: false }} />
    </Stack>
  );
}