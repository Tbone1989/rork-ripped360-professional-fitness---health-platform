import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Camera } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';

export default function VirtualPosingScreen() {
  return (
    <View style={styles.container} testID="virtual-posing-screen">
      <Stack.Screen options={{ title: 'Virtual Posing' }} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <View style={styles.headerRow}>
            <Camera size={20} color={colors.accent.primary} />
            <Text style={styles.title}>Coming Soon</Text>
          </View>
          <Text style={styles.subtitle}>Practice poses with guided timers and camera overlay. Releasing shortly.</Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  scroll: { flex: 1 },
  card: { margin: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
  subtitle: { fontSize: 14, color: colors.text.secondary, lineHeight: 20 },
});