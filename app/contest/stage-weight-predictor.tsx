import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Scale } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';

export default function StageWeightPredictorScreen() {
  return (
    <View style={styles.container} testID="stage-weight-screen">
      <Stack.Screen options={{ title: 'Stage Weight Predictor' }} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <View style={styles.headerRow}>
            <Scale size={20} color={colors.accent.primary} />
            <Text style={styles.title}>Coming Soon</Text>
          </View>
          <Text style={styles.subtitle}>Enter target body fat and trend to estimate stage weight. Feature under construction.</Text>
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