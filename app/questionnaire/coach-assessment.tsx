import React from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CoachAssessmentForm from '@/components/questionnaire/CoachAssessmentForm';
import { CoachAssessmentForm as CoachAssessmentFormType, ClientQuestionnaire } from '@/types/questionnaire';

// Mock client questionnaire data - in a real app, this would come from your backend
const mockClientQuestionnaire: ClientQuestionnaire = {
  id: 'questionnaire_123',
  clientId: 'client_456',
  coachId: 'coach_789',
  completedAt: '2024-01-15T10:30:00Z',
  personalInfo: {
    age: 28,
    gender: 'female',
    height: 165,
    weight: 68,
    bodyFatPercentage: 22,
    activityLevel: 'moderately-active',
    occupation: 'Software Developer',
    stressLevel: 4,
  },
  healthHistory: {
    chronicConditions: ['Mild Asthma'],
    pastSurgeries: [],
    familyHistory: [
      { condition: 'Type 2 Diabetes', relation: 'mother', ageOfOnset: 45 },
      { condition: 'Hypertension', relation: 'father', ageOfOnset: 50 }
    ],
    allergies: [
      { allergen: 'Shellfish', severity: 'moderate', reaction: 'Hives and swelling' }
    ],
    bloodPressure: '125/80',
    restingHeartRate: 72,
    smokingStatus: 'never',
    alcoholConsumption: 'occasional',
    sleepHours: 7,
    sleepQuality: 'fair',
  },
  currentMedications: [
    {
      name: 'Albuterol Inhaler',
      dosage: '90mcg',
      frequency: 'As needed',
      prescribedBy: 'Dr. Smith',
      startDate: '2023-06-01',
      purpose: 'Asthma management',
      sideEffects: ['Mild tremors when used frequently']
    }
  ],
  supplements: [
    {
      name: 'Whey Protein',
      dosage: '25g',
      frequency: 'Daily',
      brand: 'Optimum Nutrition',
      purpose: 'Muscle recovery and growth',
      duration: '6 months'
    },
    {
      name: 'Vitamin D3',
      dosage: '2000 IU',
      frequency: 'Daily',
      brand: 'Nature Made',
      purpose: 'Bone health and immune support',
      duration: '1 year'
    }
  ],
  injuries: [
    {
      bodyPart: 'Lower Back',
      injuryType: 'Muscle strain',
      dateOccurred: '2023-08-15',
      treatment: 'Physical therapy and rest',
      currentStatus: 'mostly-healed',
      limitations: ['Avoid heavy deadlifts', 'No twisting movements under load'],
      painLevel: 2,
      triggerActivities: ['Prolonged sitting', 'Heavy lifting']
    }
  ],
  lifestyle: {
    workSchedule: 'regular-hours',
    travelFrequency: 'rarely',
    gymAccess: 'commercial-gym',
    availableEquipment: ['Full gym access', 'Home resistance bands'],
    workoutExperience: 'intermediate',
    previousTrainingTypes: ['Weight training', 'Yoga', 'Running'],
    nutritionKnowledge: 'intermediate',
    cookingSkills: 'good',
    dietaryRestrictions: ['Shellfish allergy'],
    foodAllergies: ['Shellfish']
  },
  fitnessGoals: {
    primaryGoal: 'muscle-gain',
    secondaryGoals: ['Improve strength', 'Better posture'],
    targetWeight: 72,
    targetBodyFat: 18,
    timeframe: '6 months',
    motivation: 'Want to feel stronger and more confident',
    previousAttempts: 'Tried various programs but struggled with consistency',
    obstacles: ['Long work hours', 'Stress eating', 'Lower back issues'],
    successMeasures: ['Increased strength', 'Better body composition', 'Improved energy levels']
  },
  emergencyContact: {
    name: 'Sarah Johnson',
    relationship: 'Sister',
    phoneNumber: '+1-555-0123',
    email: 'sarah.johnson@email.com'
  },
  consent: {
    medicalClearance: true,
    riskAcknowledgment: true,
    dataSharing: true,
    photographyConsent: true,
    communicationConsent: true,
    signedDate: '2024-01-15T10:30:00Z'
  }
};

export default function CoachAssessmentPage() {
  const router = useRouter();
  const { questionnaireId } = useLocalSearchParams();

  const handleSubmit = (assessment: CoachAssessmentFormType) => {
    console.log('Coach assessment submitted:', assessment);
    
    // Here you would typically save to your backend/database
    // For now, we'll just show a success message
    
    const statusMessage = assessment.clearanceStatus === 'cleared' 
      ? 'Client has been cleared for training.'
      : assessment.clearanceStatus === 'conditional'
      ? 'Client has been given conditional clearance with restrictions.'
      : 'Client requires medical referral before training can begin.';
    
    Alert.alert(
      'Assessment Complete',
      `Your assessment has been submitted successfully. ${statusMessage}`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <CoachAssessmentForm 
      questionnaire={mockClientQuestionnaire}
      onSubmit={handleSubmit}
    />
  );
}