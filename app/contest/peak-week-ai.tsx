import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';

export default function PeakWeekAIPredictorScreen() {
  return (
    <View style={styles.container} testID="peak-week-ai-screen">
      <Stack.Screen options={{ title: 'Peak Week AI' }} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <View style={styles.headerRow}>
            <Sparkles size={20} color={colors.accent.primary} />
            <Text style={styles.title}>Coming Soon</Text>
          </View>
          <Text style={styles.subtitle}>We are building personalized peak week predictions. Check back shortly.</Text>
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