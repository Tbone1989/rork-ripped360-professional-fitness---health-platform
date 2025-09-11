import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Droplets, Utensils, Activity, Brain, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PeakWeekPlan {
  day: number;
  date: string;
  waterIntake: string;
  carbIntake: string;
  sodiumIntake: string;
  training: string;
  cardio: string;
  supplements: string[];
  notes: string;
}

export default function PeakWeekAI() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showDate, setShowDate] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [bodyFatPercentage, setBodyFatPercentage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<PeakWeekPlan[] | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const generatePeakWeekPlan = async () => {
    if (!showDate || !currentWeight || !targetWeight) {
      // For web compatibility, we'll just set an error state instead of using Alert
      console.log('Missing Information: Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockPlan: PeakWeekPlan[] = [
        {
          day: 1,
          date: 'Monday',
          waterIntake: '2 gallons',
          carbIntake: '50g',
          sodiumIntake: '2000mg',
          training: 'Full Body - Light',
          cardio: '30 min LISS',
          supplements: ['Vitamin C', 'Dandelion Root', 'Potassium'],
          notes: 'Begin water loading phase'
        },
        {
          day: 2,
          date: 'Tuesday',
          waterIntake: '2.5 gallons',
          carbIntake: '50g',
          sodiumIntake: '1500mg',
          training: 'Upper Body - Pump',
          cardio: '20 min LISS',
          supplements: ['Vitamin C', 'Dandelion Root', 'Potassium', 'Magnesium'],
          notes: 'Peak water intake day'
        },
        {
          day: 3,
          date: 'Wednesday',
          waterIntake: '2 gallons',
          carbIntake: '30g',
          sodiumIntake: '1000mg',
          training: 'Lower Body - Pump',
          cardio: '20 min LISS',
          supplements: ['Vitamin C', 'Dandelion Root', 'Potassium'],
          notes: 'Begin sodium tapering'
        },
        {
          day: 4,
          date: 'Thursday',
          waterIntake: '1 gallon',
          carbIntake: '30g',
          sodiumIntake: '500mg',
          training: 'Full Body - Circuit',
          cardio: 'None',
          supplements: ['Vitamin C', 'Potassium'],
          notes: 'Water tapering begins'
        },
        {
          day: 5,
          date: 'Friday',
          waterIntake: '0.5 gallon',
          carbIntake: '20g',
          sodiumIntake: '250mg',
          training: 'Posing Practice',
          cardio: 'None',
          supplements: ['Vitamin C', 'Potassium'],
          notes: 'Final depletion day'
        },
        {
          day: 6,
          date: 'Saturday (Show Day)',
          waterIntake: 'Sips only',
          carbIntake: '300-400g',
          sodiumIntake: '100mg',
          training: 'None',
          cardio: 'None',
          supplements: ['Vitamin C'],
          notes: 'Carb up protocol - Rice cakes, white rice, sweet potato'
        },
        {
          day: 7,
          date: 'Sunday (Recovery)',
          waterIntake: '1 gallon',
          carbIntake: '200g',
          sodiumIntake: 'Normal',
          training: 'Rest',
          cardio: 'None',
          supplements: ['Multivitamin', 'Omega-3'],
          notes: 'Post-show recovery'
        }
      ];
      
      setGeneratedPlan(mockPlan);
      setIsGenerating(false);
    }, 2000);
  };

  const renderDayPlan = (plan: PeakWeekPlan) => (
    <View style={styles.dayCard}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>Day {plan.day}: {plan.date}</Text>
        {plan.day === 6 && (
          <View style={styles.showDayBadge}>
            <Text style={styles.showDayText}>SHOW DAY</Text>
          </View>
        )}
      </View>

      <View style={styles.planSection}>
        <View style={styles.planRow}>
          <Droplets size={18} color="#3B82F6" />
          <Text style={styles.planLabel}>Water:</Text>
          <Text style={styles.planValue}>{plan.waterIntake}</Text>
        </View>

        <View style={styles.planRow}>
          <Utensils size={18} color="#10B981" />
          <Text style={styles.planLabel}>Carbs:</Text>
          <Text style={styles.planValue}>{plan.carbIntake}</Text>
        </View>

        <View style={styles.planRow}>
          <Activity size={18} color="#F59E0B" />
          <Text style={styles.planLabel}>Sodium:</Text>
          <Text style={styles.planValue}>{plan.sodiumIntake}</Text>
        </View>
      </View>

      <View style={styles.trainingSection}>
        <Text style={styles.sectionTitle}>Training</Text>
        <Text style={styles.trainingText}>{plan.training}</Text>
        <Text style={styles.cardioText}>Cardio: {plan.cardio}</Text>
      </View>

      <View style={styles.supplementSection}>
        <Text style={styles.sectionTitle}>Supplements</Text>
        <View style={styles.supplementList}>
          {plan.supplements.map((supp) => (
            <View key={supp} style={styles.supplementChip}>
              <Text style={styles.supplementText}>{supp}</Text>
            </View>
          ))}
        </View>
      </View>

      {plan.notes && (
        <View style={styles.notesSection}>
          <AlertCircle size={16} color="#6B7280" />
          <Text style={styles.notesText}>{plan.notes}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Peak Week AI</Text>
          <View style={styles.headerSpacer} />
        </View>

        <LinearGradient
          colors={['#FF6B6B', '#FF8E53']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Brain size={40} color="#FFFFFF" />
          <Text style={styles.heroTitle}>AI-Powered Peak Week Protocol</Text>
          <Text style={styles.heroSubtitle}>
            Get a personalized peak week plan optimized for your physique
          </Text>
        </LinearGradient>

        {!generatedPlan ? (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Enter Your Competition Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Show Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#6B7280"
                value={showDate}
                onChangeText={setShowDate}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Weight (lbs)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 185"
                placeholderTextColor="#6B7280"
                value={currentWeight}
                onChangeText={setCurrentWeight}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Target Stage Weight (lbs)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 175"
                placeholderTextColor="#6B7280"
                value={targetWeight}
                onChangeText={setTargetWeight}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Body Fat % (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 6"
                placeholderTextColor="#6B7280"
                value={bodyFatPercentage}
                onChangeText={setBodyFatPercentage}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={styles.generateButton}
              onPress={generatePeakWeekPlan}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Brain size={20} color="#FFFFFF" />
                  <Text style={styles.generateButtonText}>Generate Peak Week Plan</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.infoCard}>
              <AlertCircle size={20} color="#3B82F6" />
              <Text style={styles.infoText}>
                The AI will create a customized 7-day protocol including water manipulation, 
                carb depletion/loading, sodium tapering, and training adjustments.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.planContainer}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Your Peak Week Protocol</Text>
              <TouchableOpacity
                style={styles.regenerateButton}
                onPress={() => setGeneratedPlan(null)}
              >
                <Text style={styles.regenerateText}>Generate New Plan</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.daySelector}
            >
              {generatedPlan.map((plan) => (
                <TouchableOpacity
                  key={plan.day}
                  style={[
                    styles.daySelectorButton,
                    selectedDay === plan.day && styles.daySelectorButtonActive
                  ]}
                  onPress={() => setSelectedDay(plan.day)}
                >
                  <Text style={[
                    styles.daySelectorText,
                    selectedDay === plan.day && styles.daySelectorTextActive
                  ]}>
                    Day {plan.day}
                  </Text>
                  {plan.day === 6 && (
                    <View style={styles.showDayDot} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {generatedPlan
              .filter(plan => plan.day === selectedDay)
              .map(plan => renderDayPlan(plan))}

            <View style={styles.disclaimerCard}>
              <AlertCircle size={20} color="#EF4444" />
              <Text style={styles.disclaimerText}>
                This is an AI-generated suggestion. Always consult with your coach or a 
                qualified professional before implementing any peak week protocol.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroCard: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#374151',
  },
  generateButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    flexDirection: 'row',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  planContainer: {
    padding: 20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  regenerateButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  regenerateText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  daySelector: {
    marginBottom: 20,
    maxHeight: 50,
  },
  daySelectorButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1F2937',
    borderRadius: 20,
    marginRight: 10,
    position: 'relative',
  },
  daySelectorButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  daySelectorText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  daySelectorTextActive: {
    color: '#FFFFFF',
  },
  showDayDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  dayCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  showDayBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  showDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  planSection: {
    marginBottom: 16,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  planLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    width: 60,
  },
  planValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  trainingSection: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  trainingText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardioText: {
    fontSize: 14,
    color: '#6B7280',
  },
  supplementSection: {
    marginBottom: 16,
  },
  supplementList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  supplementChip: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  supplementText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  notesSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  notesText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  disclaimerCard: {
    backgroundColor: '#7F1D1D',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#FCA5A5',
    lineHeight: 18,
  },
  headerSpacer: {
    width: 40,
  },
});