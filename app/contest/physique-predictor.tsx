import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { Brain, Camera, Scale } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useContestStore } from '@/store/contestStore';

export default function PhysiquePredictorScreen() {
  const { currentPrep } = useContestStore();
  const canPredict = useMemo(() => Boolean(currentPrep), [currentPrep]);

  return (
    <View style={styles.container} testID="physique-predictor-screen">
      <Stack.Screen options={{ title: 'Physique Predictor' }} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} testID="physique-predictor-scroll">
        {currentPrep ? (
          <>
            <Card style={styles.heroCard}>
              <View style={styles.heroHeader}>
                <Brain size={24} color={colors.accent.primary} />
                <Text style={styles.heroTitle}>AI Physique Projection</Text>
              </View>
              <Text style={styles.heroSubtitle}>Estimate stage look based on current trends, target weight, and time remaining.</Text>
              <Button
                title="Run Prediction"
                onPress={() => {
                  console.log('[PhysiquePredictor] Run Prediction');
                  router.push('/contest/peak-week-ai');
                }}
                testID="run-prediction-btn"
              />
            </Card>

            <Card style={styles.block}>
              <View style={styles.row}>
                <Scale size={18} color={colors.text.secondary} />
                <Text style={styles.blockTitle}>Current Stats</Text>
              </View>
              <Text style={styles.blockText}>Contest: {new Date(currentPrep.contestDate).toLocaleDateString()}</Text>
              <Text style={styles.blockText}>Weight: {currentPrep.progress.currentWeight} kg</Text>
              <Text style={styles.blockText}>Body Fat: {currentPrep.progress.currentBodyFat}%</Text>
            </Card>

            <Card style={styles.block}>
              <View style={styles.row}>
                <Camera size={18} color={colors.text.secondary} />
                <Text style={styles.blockTitle}>Tips</Text>
              </View>
              <Text style={styles.tip}>• Consistent lighting and posing improves prediction quality</Text>
              <Text style={styles.tip}>• Log check-ins at the same time daily</Text>
            </Card>
          </>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No Contest Prep Active</Text>
            <Text style={styles.emptyDesc}>Create or select a contest prep to use the Physique Predictor.</Text>
            <TouchableOpacity onPress={() => router.push('/contest/create')} style={styles.cta} testID="create-prep-btn">
              <Text style={styles.ctaText}>Create Contest Prep</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  scroll: { flex: 1 },
  heroCard: { margin: 20 },
  heroHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  heroTitle: { fontSize: 20, fontWeight: '700', color: colors.text.primary },
  heroSubtitle: { fontSize: 14, color: colors.text.secondary, marginBottom: 12, lineHeight: 20 },
  block: { marginHorizontal: 20, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  blockTitle: { fontSize: 16, fontWeight: '600', color: colors.text.primary },
  blockText: { fontSize: 14, color: colors.text.secondary, marginBottom: 4 },
  tip: { fontSize: 14, color: colors.text.secondary, marginBottom: 6 },
  empty: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: colors.text.secondary, textAlign: 'center', marginBottom: 16 },
  cta: { backgroundColor: colors.background.secondary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  ctaText: { color: colors.accent.primary, fontWeight: '700' },
});