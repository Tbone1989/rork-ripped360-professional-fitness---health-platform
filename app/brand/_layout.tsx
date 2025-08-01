import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function BrandLayout() {
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
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="challenges"
        options={{
          title: 'Member Challenges',
        }}
      />
      <Stack.Screen
        name="membership"
        options={{
          title: 'Membership Plans',
        }}
      />
      <Stack.Screen
        name="guides"
        options={{
          title: 'Branded Guides',
        }}
      />
      <Stack.Screen
        name="exclusive-gear"
        options={{
          title: 'Exclusive Gear',
        }}
      />
      <Stack.Screen
        name="affiliate"
        options={{
          title: 'Affiliate Program',
        }}
      />
    </Stack>
  );
}