import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Scale, Target, TrendingDown, Calculator, Info } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface WeightPrediction {
  targetWeight: number;
  weightToLose: number;
  weeksNeeded: number;
  dailyCalorieDeficit: number;
  recommendedWeeklyLoss: number;
  bodyFatToLose: number;
  leanMassEstimate: number;
}

export default function StageWeightPredictorScreen() {
  const [currentWeight, setCurrentWeight] = useState('');
  const [currentBodyFat, setCurrentBodyFat] = useState('');
  const [targetBodyFat, setTargetBodyFat] = useState('');
  const [contestDate, setContestDate] = useState('');
  const [prediction, setPrediction] = useState<WeightPrediction | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateStageWeight = async () => {
    if (!currentWeight || !currentBodyFat || !targetBodyFat) {
      Alert.alert('Missing Information', 'Please fill in current weight, current body fat, and target body fat.');
      return;
    }

    const weight = parseFloat(currentWeight);
    const currentBF = parseFloat(currentBodyFat);
    const targetBF = parseFloat(targetBodyFat);

    if (weight <= 0 || currentBF <= 0 || targetBF <= 0 || targetBF >= currentBF) {
      Alert.alert('Invalid Input', 'Please enter valid numbers. Target body fat should be lower than current body fat.');
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Calculate lean body mass (assuming current body fat is accurate)
    const currentFatMass = weight * (currentBF / 100);
    const currentLeanMass = weight - currentFatMass;
    
    // Calculate target weight (assuming lean mass stays the same)
    const targetWeight = currentLeanMass / (1 - (targetBF / 100));
    const weightToLose = weight - targetWeight;
    const bodyFatToLose = currentFatMass - (targetWeight * (targetBF / 100));
    
    // Calculate timeline if contest date is provided
    let weeksNeeded = 0;
    let recommendedWeeklyLoss = 0.5; // kg per week (safe rate)
    
    if (contestDate) {
      const today = new Date();
      const contest = new Date(contestDate);
      const daysRemaining = Math.ceil((contest.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      weeksNeeded = Math.floor(daysRemaining / 7);
      
      if (weeksNeeded > 0) {
        recommendedWeeklyLoss = weightToLose / weeksNeeded;
      }
    } else {
      weeksNeeded = Math.ceil(weightToLose / recommendedWeeklyLoss);
    }
    
    // Calculate daily calorie deficit (1 kg fat ≈ 7700 calories)
    const dailyCalorieDeficit = (recommendedWeeklyLoss * 7700) / 7;

    const predictionResult: WeightPrediction = {
      targetWeight: Math.round(targetWeight * 10) / 10,
      weightToLose: Math.round(weightToLose * 10) / 10,
      weeksNeeded,
      dailyCalorieDeficit: Math.round(dailyCalorieDeficit),
      recommendedWeeklyLoss: Math.round(recommendedWeeklyLoss * 10) / 10,
      bodyFatToLose: Math.round(bodyFatToLose * 10) / 10,
      leanMassEstimate: Math.round(currentLeanMass * 10) / 10
    };

    setPrediction(predictionResult);
    setIsCalculating(false);
  };

  const getWeeklyLossColor = (weeklyLoss: number) => {
    if (weeklyLoss <= 0.5) return '#4CAF50'; // Green - safe
    if (weeklyLoss <= 0.8) return '#FF9800'; // Orange - moderate
    return '#F44336'; // Red - aggressive
  };

  const getWeeklyLossStatus = (weeklyLoss: number) => {
    if (weeklyLoss <= 0.5) return 'Safe & Sustainable';
    if (weeklyLoss <= 0.8) return 'Moderate - Monitor Closely';
    return 'Aggressive - Risk of Muscle Loss';
  };

  return (
    <View style={styles.container} testID="stage-weight-screen">
      <Stack.Screen options={{ title: 'Stage Weight Predictor' }} />
      
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card style={styles.inputCard}>
          <View style={styles.headerRow}>
            <Scale size={24} color={colors.accent.primary} />
            <Text style={styles.title}>Stage Weight Calculator</Text>
          </View>
          <Text style={styles.subtitle}>Calculate your target stage weight based on body fat goals and timeline.</Text>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Current Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={currentWeight}
              onChangeText={setCurrentWeight}
              placeholder="75.0"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Current Body Fat (%)</Text>
            <TextInput
              style={styles.input}
              value={currentBodyFat}
              onChangeText={setCurrentBodyFat}
              placeholder="12.0"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Target Body Fat (%)</Text>
            <TextInput
              style={styles.input}
              value={targetBodyFat}
              onChangeText={setTargetBodyFat}
              placeholder="6.0"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Contest Date (Optional)</Text>
            <TextInput
              style={styles.input}
              value={contestDate}
              onChangeText={setContestDate}
              placeholder="2024-12-15"
            />
          </View>
          
          <Button
            title={isCalculating ? 'Calculating...' : 'Calculate Stage Weight'}
            onPress={calculateStageWeight}
            disabled={isCalculating}
            testID="calculate-weight-btn"
          />
        </Card>

        {prediction && (
          <>
            <Card style={styles.resultCard}>
              <View style={styles.headerRow}>
                <Target size={20} color={colors.accent.primary} />
                <Text style={styles.sectionTitle}>Your Stage Weight Prediction</Text>
              </View>
              
              <View style={styles.mainResult}>
                <Text style={styles.targetWeightLabel}>Target Stage Weight</Text>
                <Text style={styles.targetWeightValue}>{prediction.targetWeight} kg</Text>
                <Text style={styles.weightDifference}>({prediction.weightToLose} kg to lose)</Text>
              </View>
            </Card>

            <Card style={styles.detailsCard}>
              <View style={styles.headerRow}>
                <Calculator size={20} color={colors.accent.primary} />
                <Text style={styles.sectionTitle}>Breakdown & Timeline</Text>
              </View>
              
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Lean Mass Estimate</Text>
                  <Text style={styles.detailValue}>{prediction.leanMassEstimate} kg</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Fat to Lose</Text>
                  <Text style={styles.detailValue}>{prediction.bodyFatToLose} kg</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Weeks Needed</Text>
                  <Text style={styles.detailValue}>{prediction.weeksNeeded} weeks</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Daily Calorie Deficit</Text>
                  <Text style={styles.detailValue}>{prediction.dailyCalorieDeficit} cal</Text>
                </View>
              </View>
              
              <View style={styles.weeklyLossSection}>
                <Text style={styles.weeklyLossLabel}>Required Weekly Loss</Text>
                <Text style={[styles.weeklyLossValue, { color: getWeeklyLossColor(prediction.recommendedWeeklyLoss) }]}>
                  {prediction.recommendedWeeklyLoss} kg/week
                </Text>
                <Text style={[styles.weeklyLossStatus, { color: getWeeklyLossColor(prediction.recommendedWeeklyLoss) }]}>
                  {getWeeklyLossStatus(prediction.recommendedWeeklyLoss)}
                </Text>
              </View>
            </Card>

            <Card style={styles.warningCard}>
              <View style={styles.headerRow}>
                <Info size={20} color={colors.accent.primary} />
                <Text style={styles.sectionTitle}>Important Notes</Text>
              </View>
              
              <Text style={styles.warningText}>• This calculation assumes lean mass preservation</Text>
              <Text style={styles.warningText}>• Actual results may vary based on genetics, training, and diet</Text>
              <Text style={styles.warningText}>• Weekly losses above 0.8kg may result in muscle loss</Text>
              <Text style={styles.warningText}>• Consider working with a coach for personalized guidance</Text>
              <Text style={styles.warningText}>• Regular body composition assessments are recommended</Text>
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  scroll: { flex: 1 },
  inputCard: { margin: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text.primary },
  subtitle: { fontSize: 14, color: colors.text.secondary, lineHeight: 20, marginBottom: 20 },
  inputSection: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: colors.text.primary, marginBottom: 6 },
  input: { backgroundColor: colors.background.secondary, borderRadius: 8, padding: 12, fontSize: 16, color: colors.text.primary },
  resultCard: { marginHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text.primary },
  mainResult: { alignItems: 'center', paddingVertical: 20 },
  targetWeightLabel: { fontSize: 16, color: colors.text.secondary, marginBottom: 8 },
  targetWeightValue: { fontSize: 36, fontWeight: 'bold', color: colors.accent.primary, marginBottom: 4 },
  weightDifference: { fontSize: 14, color: colors.text.secondary },
  detailsCard: { marginHorizontal: 20, marginBottom: 16 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  detailItem: { width: '50%', marginBottom: 16, paddingRight: 8 },
  detailLabel: { fontSize: 12, color: colors.text.secondary, marginBottom: 4 },
  detailValue: { fontSize: 16, fontWeight: '600', color: colors.text.primary },
  weeklyLossSection: { alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.background.secondary },
  weeklyLossLabel: { fontSize: 14, color: colors.text.secondary, marginBottom: 4 },
  weeklyLossValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  weeklyLossStatus: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  warningCard: { marginHorizontal: 20, marginBottom: 20 },
  warningText: { fontSize: 14, color: colors.text.secondary, marginBottom: 6, lineHeight: 20 },
});