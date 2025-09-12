import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Droplets,
  Utensils,
  Activity as ActivityIcon,
  Brain,
  AlertCircle,
  Paperclip,
  ExternalLink,
  PlayCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '@/store/userStore';

interface PeakWeekPlanItem {
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
  const insets = useSafeAreaInsets();
  const user = useUserStore((s) => s.user);

  const [showDate, setShowDate] = useState<string>('');
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [targetWeight, setTargetWeight] = useState<string>('');
  const [bodyFatPercentage, setBodyFatPercentage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPlan, setGeneratedPlan] = useState<PeakWeekPlanItem[] | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);

  const attachments = useMemo(() => user?.attachments ?? [], [user?.attachments]);

  const onOpenUrl = useCallback(async (url: string) => {
    try {
      console.log('[PeakWeekAI] open attachment', url);
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.warn('Cannot open URL:', url);
      }
    } catch (e) {
      console.error('Open URL error', e);
    }
  }, []);

  const generatePeakWeekPlan = useCallback(async () => {
    console.log('[PeakWeekAI] generatePeakWeekPlan pressed');
    if (!showDate || !currentWeight || !targetWeight) {
      setFormError('Please fill in Show Date, Current Weight, and Target Stage Weight.');
      return;
    }

    setFormError(null);
    setIsGenerating(true);

    setTimeout(() => {
      const mockPlan: PeakWeekPlanItem[] = [
        {
          day: 1,
          date: 'Monday',
          waterIntake: '2 gallons',
          carbIntake: '50g',
          sodiumIntake: '2000mg',
          training: 'Full Body (light pump focus)',
          cardio: '30 min LISS',
          supplements: ['Vitamin C', 'Dandelion Root', 'Potassium'],
          notes: 'Begin water loading phase',
        },
        {
          day: 2,
          date: 'Tuesday',
          waterIntake: '2.5 gallons',
          carbIntake: '50g',
          sodiumIntake: '1500mg',
          training: 'Upper Body (pump work)',
          cardio: '20 min LISS',
          supplements: ['Vitamin C', 'Dandelion Root', 'Potassium', 'Magnesium'],
          notes: 'Peak water intake day',
        },
        {
          day: 3,
          date: 'Wednesday',
          waterIntake: '2 gallons',
          carbIntake: '30g',
          sodiumIntake: '1000mg',
          training: 'Lower Body (pump work)',
          cardio: '20 min LISS',
          supplements: ['Vitamin C', 'Dandelion Root', 'Potassium'],
          notes: 'Begin sodium tapering',
        },
        {
          day: 4,
          date: 'Thursday',
          waterIntake: '1 gallon',
          carbIntake: '30g',
          sodiumIntake: '500mg',
          training: 'Full Body (circuits, low fatigue)',
          cardio: '—',
          supplements: ['Vitamin C', 'Potassium'],
          notes: 'Water taper continues',
        },
        {
          day: 5,
          date: 'Friday',
          waterIntake: '0.5 gallon',
          carbIntake: '20g',
          sodiumIntake: '250mg',
          training: 'Posing practice',
          cardio: '—',
          supplements: ['Vitamin C', 'Potassium'],
          notes: 'Final depletion day',
        },
        {
          day: 6,
          date: 'Saturday (Show Day)',
          waterIntake: 'Sips only',
          carbIntake: '300–400g',
          sodiumIntake: '100mg',
          training: 'None',
          cardio: 'None',
          supplements: ['Vitamin C'],
          notes: 'Carb up protocol – rice cakes, white rice, sweet potato',
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
          notes: 'Post-show recovery',
        },
      ];

      setGeneratedPlan(mockPlan);
      setIsGenerating(false);
      setSelectedDay(1);
    }, 1200);
  }, [showDate, currentWeight, targetWeight]);

  const renderDayPlan = useCallback((plan: PeakWeekPlanItem) => (
    <View key={plan.day} style={styles.dayCard} testID={`plan-day-${plan.day}`}>
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
          <Text style={styles.planLabel}>Water</Text>
          <Text style={styles.planValue}>{plan.waterIntake}</Text>
        </View>

        <View style={styles.planRow}>
          <Utensils size={18} color="#10B981" />
          <Text style={styles.planLabel}>Carbs</Text>
          <Text style={styles.planValue}>{plan.carbIntake}</Text>
        </View>

        <View style={styles.planRow}>
          <ActivityIcon size={18} color="#F59E0B" />
          <Text style={styles.planLabel}>Sodium</Text>
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
            <View key={`${plan.day}-${supp}`} style={styles.supplementChip}>
              <Text style={styles.supplementText}>{supp}</Text>
            </View>
          ))}
        </View>
      </View>

      {plan.notes ? (
        <View style={styles.notesSection}>
          <AlertCircle size={16} color="#6B7280" />
          <Text style={styles.notesText}>{plan.notes}</Text>
        </View>
      ) : null}
    </View>
  ), []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} testID="peak-week-ai-screen">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity accessibilityRole="button" testID="back-button" onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Peak Week AI</Text>
          <View style={styles.headerSpacer} />
        </View>

        <LinearGradient
          colors={["#111827", "#0B1220"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroRow}>
            <View style={styles.heroIconWrap}>
              <Brain size={32} color="#FFFFFF" />
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>AI-Powered Peak Week</Text>
              <Text style={styles.heroSubtitle}>
                Personalized water, sodium, carb and training protocol
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/contest/protocols')}
            style={styles.heroAction}
            testID="hero-guides-button"
          >
            <PlayCircle size={18} color="#0EA5E9" />
            <Text style={styles.heroActionText}>View Peak Week Guides</Text>
          </TouchableOpacity>
        </LinearGradient>

        {!generatedPlan ? (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Competition Details</Text>

            {formError ? (
              <View style={styles.errorBanner} testID="form-error">
                <AlertCircle size={18} color="#FCA5A5" />
                <Text style={styles.errorText}>{formError}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Show Date</Text>
              <TextInput
                testID="input-show-date"
                style={styles.input}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#6B7280"
                value={showDate}
                onChangeText={setShowDate}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.rowItem]}>
                <Text style={styles.inputLabel}>Current Weight (lbs)</Text>
                <TextInput
                  testID="input-current-weight"
                  style={styles.input}
                  placeholder="e.g., 185"
                  placeholderTextColor="#6B7280"
                  value={currentWeight}
                  onChangeText={setCurrentWeight}
                  keyboardType={Platform.OS === 'web' ? undefined : 'numeric'}
                />
              </View>
              <View style={[styles.inputGroup, styles.rowItem]}>
                <Text style={styles.inputLabel}>Target Stage Weight (lbs)</Text>
                <TextInput
                  testID="input-target-weight"
                  style={styles.input}
                  placeholder="e.g., 175"
                  placeholderTextColor="#6B7280"
                  value={targetWeight}
                  onChangeText={setTargetWeight}
                  keyboardType={Platform.OS === 'web' ? undefined : 'numeric'}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Body Fat % (optional)</Text>
              <TextInput
                testID="input-bodyfat"
                style={styles.input}
                placeholder="e.g., 6"
                placeholderTextColor="#6B7280"
                value={bodyFatPercentage}
                onChangeText={setBodyFatPercentage}
                keyboardType={Platform.OS === 'web' ? undefined : 'numeric'}
              />
            </View>

            <TouchableOpacity
              style={styles.generateButton}
              onPress={generatePeakWeekPlan}
              disabled={isGenerating}
              testID="generate-button"
            >
              {isGenerating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Brain size={20} color="#FFFFFF" />
                  <Text style={styles.generateButtonText}>Generate Plan</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.infoCard}>
              <AlertCircle size={20} color="#3B82F6" />
              <Text style={styles.infoText}>
                The AI will draft a 7-day protocol including water manipulation, carb
                depletion/loading, sodium tapering, training and cardio adjustments.
              </Text>
            </View>

            <View style={styles.attachmentsCard} testID="attachments-card">
              <View style={styles.attachmentsHeader}>
                <View style={styles.attachmentsTitleWrap}>
                  <Paperclip size={18} color="#93C5FD" />
                  <Text style={styles.attachmentsTitle}>Attachments</Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push('/profile/attachments')}
                  style={styles.manageAttachmentsBtn}
                  testID="manage-attachments-button"
                >
                  <Text style={styles.manageAttachmentsText}>Manage</Text>
                </TouchableOpacity>
              </View>
              {attachments.length === 0 ? (
                <Text style={styles.emptyAttachmentsText}>No attachments yet. Add bloodwork, protocols, or references.</Text>
              ) : (
                <View style={styles.attachmentList}>
                  {attachments.slice(0, 3).map((a) => (
                    <TouchableOpacity
                      key={a.id}
                      style={styles.attachmentItem}
                      onPress={() => onOpenUrl(a.url)}
                      testID={`attachment-${a.id}`}
                    >
                      <Text style={styles.attachmentTitle} numberOfLines={1}>{a.title}</Text>
                      <ExternalLink size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                  ))}
                  {attachments.length > 3 ? (
                    <Text style={styles.moreAttachmentsText}>
                      +{attachments.length - 3} more in Attachments
                    </Text>
                  ) : null}
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.planContainer}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Your Peak Week Protocol</Text>
              <TouchableOpacity
                style={styles.regenerateButton}
                onPress={() => setGeneratedPlan(null)}
                testID="regenerate-button"
              >
                <Text style={styles.regenerateText}>Start Over</Text>
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
                    selectedDay === plan.day ? styles.daySelectorButtonActive : undefined,
                  ]}
                  onPress={() => setSelectedDay(plan.day)}
                  testID={`select-day-${plan.day}`}
                >
                  <Text
                    style={[
                      styles.daySelectorText,
                      selectedDay === plan.day ? styles.daySelectorTextActive : undefined,
                    ]}
                  >
                    Day {plan.day}
                  </Text>
                  {plan.day === 6 ? <View style={styles.showDayDot} /> : null}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {generatedPlan.filter((p) => p.day === selectedDay).map((p) => renderDayPlan(p))}

            <View style={styles.disclaimerCard}>
              <AlertCircle size={20} color="#EF4444" />
              <Text style={styles.disclaimerText}>
                AI output is for educational purposes only. Consult your coach or a qualified
                professional before implementing any protocol.
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
    backgroundColor: '#0B0F1A',
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
  headerSpacer: {
    width: 40,
  },
  heroCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0EA5E920',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#93C5FD',
    marginTop: 2,
  },
  heroAction: {
    marginTop: 14,
    alignSelf: 'flex-start',
    backgroundColor: '#0EA5E910',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  heroActionText: {
    color: '#0EA5E9',
    fontWeight: '600',
    fontSize: 12,
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#7F1D1D',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  generateButton: {
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#0B1220',
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
    flexDirection: 'row',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  attachmentsCard: {
    backgroundColor: '#0B1220',
    borderWidth: 1,
    borderColor: '#1F2937',
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
  },
  attachmentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  attachmentsTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachmentsTitle: {
    fontSize: 14,
    color: '#93C5FD',
    fontWeight: '700',
  },
  manageAttachmentsBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#111827',
    borderRadius: 8,
  },
  manageAttachmentsText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyAttachmentsText: {
    color: '#6B7280',
    fontSize: 13,
  },
  attachmentList: {
    gap: 8,
  },
  attachmentItem: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  attachmentTitle: {
    color: '#E5E7EB',
    fontSize: 13,
    flex: 1,
    marginRight: 10,
  },
  moreAttachmentsText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
  planContainer: {
    padding: 20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  regenerateButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#111827',
    borderRadius: 8,
  },
  regenerateText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  daySelector: {
    marginBottom: 16,
    maxHeight: 50,
  },
  daySelectorButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#111827',
    borderRadius: 20,
    marginRight: 10,
    position: 'relative',
  },
  daySelectorButtonActive: {
    backgroundColor: '#7C3AED',
  },
  daySelectorText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
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
    backgroundColor: '#0B1220',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '700',
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
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planSection: {
    marginBottom: 12,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  planLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    width: 70,
  },
  planValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  trainingSection: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 6,
  },
  trainingText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardioText: {
    fontSize: 14,
    color: '#6B7280',
  },
  supplementSection: {
    marginBottom: 12,
  },
  supplementList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  supplementChip: {
    backgroundColor: '#111827',
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
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
  },
  notesText: {
    flex: 1,
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  disclaimerCard: {
    backgroundColor: '#7F1D1D',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#FCA5A5',
    lineHeight: 18,
  },
});
