export interface ClientQuestionnaire {
  id: string;
  clientId: string;
  coachId?: string;
  completedAt?: string;
  personalInfo: PersonalInfo;
  healthHistory: HealthHistory;
  currentMedications: CurrentMedication[];
  supplements: CurrentSupplement[];
  injuries: InjuryHistory[];
  lifestyle: LifestyleInfo;
  fitnessGoals: FitnessGoals;
  emergencyContact: EmergencyContact;
  consent: ConsentInfo;
}

export interface PersonalInfo {
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  height: number; // in cm
  weight: number; // in kg
  bodyFatPercentage?: number;
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active';
  occupation: string;
  stressLevel: 1 | 2 | 3 | 4 | 5; // 1 = very low, 5 = very high
  profileImageUrl?: string;
}

export interface HealthHistory {
  chronicConditions: string[];
  pastSurgeries: Surgery[];
  familyHistory: FamilyHistoryItem[];
  allergies: Allergy[];
  bloodPressure?: string;
  restingHeartRate?: number;
  smokingStatus: 'never' | 'former' | 'current';
  alcoholConsumption: 'none' | 'occasional' | 'moderate' | 'heavy';
  sleepHours: number;
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface Surgery {
  procedure: string;
  date: string;
  complications?: string;
  recoveryNotes?: string;
}

export interface FamilyHistoryItem {
  condition: string;
  relation: string; // mother, father, sibling, etc.
  ageOfOnset?: number;
}

export interface Allergy {
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  reaction: string;
}

export interface CurrentMedication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
  purpose: string;
  sideEffects?: string[];
}

export interface CurrentSupplement {
  name: string;
  dosage: string;
  frequency: string;
  brand?: string;
  purpose: string;
  duration: string; // how long they've been taking it
}

export interface InjuryHistory {
  bodyPart: string;
  injuryType: string;
  dateOccurred: string;
  treatment: string;
  currentStatus: 'fully-healed' | 'mostly-healed' | 'ongoing-issues' | 'chronic-pain';
  limitations?: string[];
  painLevel?: 1 | 2 | 3 | 4 | 5; // current pain level
  triggerActivities?: string[];
}

export interface LifestyleInfo {
  workSchedule: 'regular-hours' | 'shift-work' | 'irregular' | 'work-from-home';
  travelFrequency: 'never' | 'rarely' | 'monthly' | 'weekly' | 'daily';
  gymAccess: 'home-gym' | 'commercial-gym' | 'both' | 'none';
  availableEquipment: string[];
  workoutExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  previousTrainingTypes: string[];
  nutritionKnowledge: 'basic' | 'intermediate' | 'advanced';
  cookingSkills: 'minimal' | 'basic' | 'good' | 'excellent';
  dietaryRestrictions: string[];
  foodAllergies: string[];
  trainingFocus?: string; // e.g., hypertrophy, strength, endurance
  preferredTrainingDays?: string[];
  preferredTrainingTimes?: string[]; // e.g., morning, afternoon, evening
  experienceYears?: number;
}

export interface FitnessGoals {
  primaryGoal: 'weight-loss' | 'muscle-gain' | 'strength' | 'endurance' | 'general-fitness' | 'sport-specific' | 'rehabilitation';
  secondaryGoals: string[];
  targetWeight?: number;
  targetBodyFat?: number;
  timeframe: string;
  motivation: string;
  previousAttempts: string;
  obstacles: string[];
  successMeasures: string[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}

export interface ConsentInfo {
  medicalClearance: boolean;
  riskAcknowledgment: boolean;
  dataSharing: boolean;
  photographyConsent: boolean;
  communicationConsent: boolean;
  signedDate: string;
}

export interface CoachAssessmentForm {
  id: string;
  coachId: string;
  clientId: string;
  questionnaireId: string;
  createdAt: string;
  updatedAt?: string;
  riskAssessment: RiskAssessment;
  recommendations: Recommendation[];
  clearanceStatus: 'cleared' | 'conditional' | 'medical-referral-required';
  notes: string;
  followUpRequired: boolean;
  followUpDate?: string;
}

export interface RiskAssessment {
  overallRisk: 'low' | 'moderate' | 'high';
  medicalRisks: string[];
  injuryRisks: string[];
  medicationInteractions: string[];
  supplementConcerns: string[];
  exerciseRestrictions: string[];
  monitoringRequired: string[];
}

export interface Recommendation {
  category: 'medical' | 'nutrition' | 'training' | 'lifestyle' | 'supplement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recommendation: string;
  rationale: string;
  timeframe?: string;
}

export interface QuestionnaireTemplate {
  id: string;
  name: string;
  description: string;
  category: 'general' | 'sport-specific' | 'medical' | 'rehabilitation';
  questions: QuestionTemplate[];
  createdBy: string;
  isPublic: boolean;
}

export interface QuestionTemplate {
  id: string;
  question: string;
  type: 'text' | 'number' | 'select' | 'multi-select' | 'boolean' | 'date' | 'scale';
  required: boolean;
  options?: string[]; // for select/multi-select
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  category: string;
  helpText?: string;
}