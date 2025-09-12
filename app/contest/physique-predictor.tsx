import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function PhysiquePredictorComingSoonScreen() {
  return (
    <View style={styles.container} testID="physique-predictor-coming-soon">
      <Stack.Screen options={{ title: 'Physique Predictor' }} />
      <View style={styles.center}>
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.subtitle}>Physique Predictor is under construction.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text.primary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.text.secondary, textAlign: 'center' },
});