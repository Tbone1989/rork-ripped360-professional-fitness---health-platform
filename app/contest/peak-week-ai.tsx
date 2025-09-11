import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Sparkles, Droplets, Utensils, Dumbbell, Calendar, Target, TrendingUp } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface PeakWeekPlan {
  day: number;
  date: string;
  water: string;
  carbs: string;
  sodium: string;
  training: string;
  cardio: string;
  notes: string;
}

export default function PeakWeekAIPredictorScreen() {
  console.log('[PeakWeekAIPredictorScreen] Component mounted');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [contestDate, setContestDate] = useState('');
  const [plan, setPlan] = useState<PeakWeekPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePlan = async () => {
    if (!currentWeight || !targetWeight || !bodyFat || !contestDate) {
      Alert.alert('Missing Information', 'Please fill in all fields to generate your peak week plan.');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const contestDateObj = new Date(contestDate);
    const peakWeekPlan: PeakWeekPlan[] = [];
    
    for (let i = 7; i >= 1; i--) {
      const dayDate = new Date(contestDateObj);
      dayDate.setDate(dayDate.getDate() - i);
      
      let dayPlan: PeakWeekPlan;
      
      if (i === 7) { // 7 days out
        dayPlan = {
          day: 8 - i,
          date: dayDate.toLocaleDateString(),
          water: '4-5L',
          carbs: '2g/kg bodyweight',
          sodium: 'Normal (2-3g)',
          training: 'Light full body',
          cardio: '20min steady state',
          notes: 'Begin carb depletion phase'
        };
      } else if (i === 6) { // 6 days out
        dayPlan = {
          day: 8 - i,
          date: dayDate.toLocaleDateString(),
          water: '4-5L',
          carbs: '1g/kg bodyweight',
          sodium: 'Normal (2-3g)',
          training: 'Upper body pump',
          cardio: '15min HIIT',
          notes: 'Continue depletion, monitor energy'
        };
      } else if (i === 5) { // 5 days out
        dayPlan = {
          day: 8 - i,
          date: dayDate.toLocaleDateString(),
          water: '3-4L',
          carbs: '0.5g/kg bodyweight',
          sodium: 'Reduce (1-2g)',
          training: 'Lower body pump',
          cardio: '10min walk',
          notes: 'Minimal carbs, start sodium reduction'
        };
      } else if (i === 4) { // 4 days out
        dayPlan = {
          day: 8 - i,
          date: dayDate.toLocaleDateString(),
          water: '2-3L',
          carbs: 'Minimal (vegetables only)',
          sodium: 'Low (0.5-1g)',
          training: 'Posing practice only',
          cardio: 'None',
          notes: 'Depletion complete, begin water manipulation'
        };
      } else if (i === 3) { // 3 days out
        dayPlan = {
          day: 8 - i,
          date: dayDate.toLocaleDateString(),
          water: '1-2L',
          carbs: 'Begin carb load (4-6g/kg)',
          sodium: 'Very low (<0.5g)',
          training: 'Light posing',
          cardio: 'None',
          notes: 'Start carb loading, reduce water'
        };
      } else if (i === 2) { // 2 days out
        dayPlan = {
          day: 8 - i,
          date: dayDate.toLocaleDateString(),
          water: '0.5-1L',
          carbs: 'Continue loading (6-8g/kg)',
          sodium: 'Minimal',
          training: 'Posing only',
          cardio: 'None',
          notes: 'Peak carb loading, minimal water'
        };
      } else { // 1 day out
        dayPlan = {
          day: 8 - i,
          date: dayDate.toLocaleDateString(),
          water: '0.25-0.5L (sips only)',
          carbs: 'Reduce to 2-3g/kg',
          sodium: 'None',
          training: 'Rest completely',
          cardio: 'None',
          notes: 'Final prep, minimal intake, rest'
        };
      }
      
      peakWeekPlan.push(dayPlan);
    }
    
    setPlan(peakWeekPlan);
    setIsGenerating(false);
  };

  return (
    <View style={styles.container} testID="peak-week-ai-screen">
      <Stack.Screen options={{ title: 'Peak Week AI Planner' }} />
      
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card style={styles.inputCard}>
          <View style={styles.headerRow}>
            <Sparkles size={24} color={colors.accent.primary} />
            <Text style={styles.title}>AI Peak Week Planner</Text>
          </View>
          <Text style={styles.subtitle}>Get a personalized peak week protocol based on your current stats and contest date.</Text>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Current Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={currentWeight}
              onChangeText={setCurrentWeight}
              placeholder="75"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Target Stage Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={targetWeight}
              onChangeText={setTargetWeight}
              placeholder="72"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Current Body Fat (%)</Text>
            <TextInput
              style={styles.input}
              value={bodyFat}
              onChangeText={setBodyFat}
              placeholder="8"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Contest Date</Text>
            <TextInput
              style={styles.input}
              value={contestDate}
              onChangeText={setContestDate}
              placeholder="2024-12-15"
            />
          </View>
          
          <Button
            title={isGenerating ? 'Generating Plan...' : 'Generate Peak Week Plan'}
            onPress={generatePlan}
            disabled={isGenerating}
            testID="generate-plan-btn"
          />
        </Card>

        {plan.length > 0 && (
          <>
            <Card style={styles.overviewCard}>
              <View style={styles.headerRow}>
                <Target size={20} color={colors.accent.primary} />
                <Text style={styles.sectionTitle}>Your Peak Week Overview</Text>
              </View>
              <Text style={styles.overviewText}>This plan is customized for your stats and contest date. Follow it closely and adjust based on how you respond.</Text>
              
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>⚠️ This is a general protocol. Consult with your coach and adjust based on your individual response.</Text>
              </View>
            </Card>

            {plan.map((dayPlan) => (
              <Card key={dayPlan.day} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <Calendar size={18} color={colors.accent.primary} />
                  <Text style={styles.dayTitle}>Day {dayPlan.day} - {dayPlan.date}</Text>
                </View>
                
                <View style={styles.protocolGrid}>
                  <View style={styles.protocolItem}>
                    <Droplets size={16} color={colors.text.secondary} />
                    <Text style={styles.protocolLabel}>Water</Text>
                    <Text style={styles.protocolValue}>{dayPlan.water}</Text>
                  </View>
                  
                  <View style={styles.protocolItem}>
                    <Utensils size={16} color={colors.text.secondary} />
                    <Text style={styles.protocolLabel}>Carbs</Text>
                    <Text style={styles.protocolValue}>{dayPlan.carbs}</Text>
                  </View>
                  
                  <View style={styles.protocolItem}>
                    <Text style={styles.saltIcon}>🧂</Text>
                    <Text style={styles.protocolLabel}>Sodium</Text>
                    <Text style={styles.protocolValue}>{dayPlan.sodium}</Text>
                  </View>
                  
                  <View style={styles.protocolItem}>
                    <Dumbbell size={16} color={colors.text.secondary} />
                    <Text style={styles.protocolLabel}>Training</Text>
                    <Text style={styles.protocolValue}>{dayPlan.training}</Text>
                  </View>
                </View>
                
                <View style={styles.cardioSection}>
                  <Text style={styles.cardioLabel}>Cardio: {dayPlan.cardio}</Text>
                </View>
                
                <View style={styles.notesSection}>
                  <Text style={styles.notesLabel}>Notes:</Text>
                  <Text style={styles.notesText}>{dayPlan.notes}</Text>
                </View>
              </Card>
            ))}

            <Card style={styles.tipsCard}>
              <View style={styles.headerRow}>
                <TrendingUp size={20} color={colors.accent.primary} />
                <Text style={styles.sectionTitle}>Peak Week Success Tips</Text>
              </View>
              <Text style={styles.tip}>• Monitor your body's response daily and adjust if needed</Text>
              <Text style={styles.tip}>• Take progress photos at the same time each day</Text>
              <Text style={styles.tip}>• Practice posing daily, especially during depletion</Text>
              <Text style={styles.tip}>• Get adequate sleep (7-9 hours) throughout the week</Text>
              <Text style={styles.tip}>• Stay calm and trust the process</Text>
              <Text style={styles.tip}>• Have a backup plan if you're not responding as expected</Text>
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
  overviewCard: { marginHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text.primary },
  overviewText: { fontSize: 14, color: colors.text.secondary, lineHeight: 20, marginBottom: 12 },
  warningBox: { backgroundColor: '#FFF3CD', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#FF9800' },
  warningText: { fontSize: 13, color: '#856404', lineHeight: 18 },
  dayCard: { marginHorizontal: 20, marginBottom: 16 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  dayTitle: { fontSize: 16, fontWeight: '600', color: colors.text.primary },
  protocolGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  protocolItem: { width: '50%', marginBottom: 12, paddingRight: 8 },
  protocolLabel: { fontSize: 12, color: colors.text.secondary, marginTop: 4, marginBottom: 2 },
  protocolValue: { fontSize: 14, fontWeight: '500', color: colors.text.primary },
  saltIcon: { fontSize: 16 },
  cardioSection: { marginBottom: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.background.secondary },
  cardioLabel: { fontSize: 14, fontWeight: '500', color: colors.text.primary },
  notesSection: { paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.background.secondary },
  notesLabel: { fontSize: 14, fontWeight: '600', color: colors.text.primary, marginBottom: 4 },
  notesText: { fontSize: 14, color: colors.text.secondary, lineHeight: 20 },
  tipsCard: { marginHorizontal: 20, marginBottom: 20 },
  tip: { fontSize: 14, color: colors.text.secondary, marginBottom: 6, lineHeight: 20 },
});