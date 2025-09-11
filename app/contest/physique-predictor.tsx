import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Brain, Camera, Scale, TrendingUp, Target, Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useContestStore } from '@/store/contestStore';

export default function PhysiquePredictorScreen() {
  const { currentPrep } = useContestStore();
  const canPredict = useMemo(() => Boolean(currentPrep), [currentPrep]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const runPrediction = async () => {
    if (!currentPrep) return;
    
    setIsAnalyzing(true);
    try {
      const daysRemaining = Math.ceil((new Date(currentPrep.contestDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const weeklyWeightLoss = 0.5; // kg per week
      const projectedWeight = currentPrep.progress.currentWeight - (weeklyWeightLoss * (daysRemaining / 7));
      const projectedBodyFat = Math.max(currentPrep.progress.currentBodyFat - (daysRemaining * 0.1), 6);
      
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const predictionData = {
        projectedWeight: Math.round(projectedWeight * 10) / 10,
        projectedBodyFat: Math.round(projectedBodyFat * 10) / 10,
        daysRemaining,
        confidence: 85,
        recommendations: [
          'Maintain current caloric deficit',
          'Increase cardio by 10 minutes daily',
          'Focus on posing practice 3x per week',
          'Consider carb cycling in final 2 weeks'
        ],
        stageReadiness: projectedBodyFat <= 8 ? 'Excellent' : projectedBodyFat <= 12 ? 'Good' : 'Needs Work'
      };
      
      setPrediction(predictionData);
    } catch (error) {
      Alert.alert('Prediction Error', 'Unable to generate prediction. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

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
                title={isAnalyzing ? 'Analyzing...' : 'Run Prediction'}
                onPress={runPrediction}
                disabled={isAnalyzing}
                testID="run-prediction-btn"
              />
              {isAnalyzing && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.accent.primary} />
                  <Text style={styles.loadingText}>Analyzing your progress data...</Text>
                </View>
              )}
            </Card>

            {prediction && (
              <>
                <Card style={styles.predictionCard}>
                  <View style={styles.predictionHeader}>
                    <Target size={20} color={colors.accent.primary} />
                    <Text style={styles.predictionTitle}>Stage Day Projection</Text>
                    <Text style={styles.confidence}>{prediction.confidence}% confidence</Text>
                  </View>
                  
                  <View style={styles.metricsGrid}>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>{prediction.projectedWeight} kg</Text>
                      <Text style={styles.metricLabel}>Projected Weight</Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>{prediction.projectedBodyFat}%</Text>
                      <Text style={styles.metricLabel}>Body Fat</Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={[styles.metricValue, { color: prediction.stageReadiness === 'Excellent' ? '#4CAF50' : prediction.stageReadiness === 'Good' ? '#FF9800' : '#F44336' }]}>
                        {prediction.stageReadiness}
                      </Text>
                      <Text style={styles.metricLabel}>Stage Readiness</Text>
                    </View>
                  </View>
                </Card>

                <Card style={styles.recommendationsCard}>
                  <View style={styles.row}>
                    <TrendingUp size={18} color={colors.text.secondary} />
                    <Text style={styles.blockTitle}>AI Recommendations</Text>
                  </View>
                  {prediction.recommendations.map((rec: string, index: number) => (
                    <Text key={index} style={styles.recommendation}>• {rec}</Text>
                  ))}
                </Card>
              </>
            )}

            <Card style={styles.block}>
              <View style={styles.row}>
                <Scale size={18} color={colors.text.secondary} />
                <Text style={styles.blockTitle}>Current Stats</Text>
              </View>
              <Text style={styles.blockText}>Contest: {new Date(currentPrep.contestDate).toLocaleDateString()}</Text>
              <Text style={styles.blockText}>Weight: {currentPrep.progress.currentWeight} kg</Text>
              <Text style={styles.blockText}>Body Fat: {currentPrep.progress.currentBodyFat}%</Text>
              <Text style={styles.blockText}>Days Remaining: {Math.ceil((new Date(currentPrep.contestDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}</Text>
            </Card>

            <Card style={styles.block}>
              <View style={styles.row}>
                <Camera size={18} color={colors.text.secondary} />
                <Text style={styles.blockTitle}>Tips for Better Predictions</Text>
              </View>
              <Text style={styles.tip}>• Take progress photos in consistent lighting</Text>
              <Text style={styles.tip}>• Log check-ins at the same time daily</Text>
              <Text style={styles.tip}>• Update weight and body fat regularly</Text>
              <Text style={styles.tip}>• Track training and cardio consistency</Text>
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
  loadingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  loadingText: { fontSize: 14, color: colors.text.secondary },
  predictionCard: { marginHorizontal: 20, marginBottom: 16 },
  predictionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  predictionTitle: { fontSize: 18, fontWeight: '600', color: colors.text.primary, flex: 1 },
  confidence: { fontSize: 12, color: colors.accent.primary, fontWeight: '600' },
  metricsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  metric: { alignItems: 'center', flex: 1 },
  metricValue: { fontSize: 20, fontWeight: 'bold', color: colors.accent.primary, marginBottom: 4 },
  metricLabel: { fontSize: 12, color: colors.text.secondary, textAlign: 'center' },
  recommendationsCard: { marginHorizontal: 20, marginBottom: 16 },
  recommendation: { fontSize: 14, color: colors.text.secondary, marginBottom: 6, lineHeight: 20 },
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