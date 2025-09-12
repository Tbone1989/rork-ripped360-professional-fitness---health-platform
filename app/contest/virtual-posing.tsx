import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';

export default function VirtualPosingComingSoonScreen() {
  return (
    <SafeAreaView style={styles.container} testID="virtual-posing-coming-soon">
      <Stack.Screen options={{ title: 'Virtual Posing' }} />
      <View style={styles.center}>
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.subtitle}>Virtual Posing Practice is under construction.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text.primary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.text.secondary, textAlign: 'center' },
});