export interface BloodworkResult {
  id: string;
  userId: string;
  date: string;
  labName: string;
  doctorId?: string;
  markers: BloodMarker[];
  notes?: string;
  attachmentUrls?: string[];
}

export interface BloodMarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  referenceRangeLow: number;
  referenceRangeHigh: number;
  status: 'normal' | 'low' | 'high' | 'critical';
  previousValue?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface MedicalProfile {
  userId: string;
  height?: number; // in cm
  weight?: number; // in kg
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string[];
  medications: Medication[];
  conditions: MedicalCondition[];
  familyHistory: string[];
  lastUpdated: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  notes?: string;
}

export interface MedicalCondition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: 'active' | 'managed' | 'resolved';
  notes?: string;
}

export interface SupplementInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  sideEffects: string[];
  dosage: string;
  interactions: string[];
  warnings: string[];
  researchUrls: string[];
  imageUrl?: string;
}

export interface MedicineInfo {
  id: string;
  name: string;
  genericName: string;
  category: string;
  description: string;
  usedFor: string[];
  sideEffects: string[];
  dosage: string;
  interactions: string[];
  warnings: string[];
  prescriptionRequired: boolean;
  imageUrl?: string;
}

export interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  interactionType: 'major' | 'moderate' | 'minor';
  severity: 'contraindicated' | 'serious' | 'significant' | 'minor';
  description: string;
  mechanism: string;
  clinicalEffects: string[];
  management: string;
  references: string[];
  lastUpdated: string;
}

export interface SupplementInteraction {
  id: string;
  supplement: string;
  interactsWith: string;
  interactionType: 'drug' | 'supplement' | 'food' | 'herb';
  severity: 'high' | 'moderate' | 'low';
  description: string;
  effects: string[];
  recommendations: string[];
  timing?: string;
  dosageAdjustment?: string;
}

export interface HerbalInteraction {
  id: string;
  herb: string;
  commonName: string;
  scientificName: string;
  interactsWith: string[];
  contraindications: string[];
  warnings: string[];
  pregnancySafety: 'safe' | 'caution' | 'avoid' | 'unknown';
  breastfeedingSafety: 'safe' | 'caution' | 'avoid' | 'unknown';
  dosageGuidelines: string;
  qualityStandards: string[];
}

export interface InteractionAlert {
  id: string;
  userId: string;
  type: 'drug-drug' | 'drug-supplement' | 'supplement-supplement' | 'herb-drug' | 'herb-supplement';
  severity: 'critical' | 'major' | 'moderate' | 'minor';
  substances: string[];
  description: string;
  recommendation: string;
  acknowledged: boolean;
  createdAt: string;
  dismissedAt?: string;
}

export interface MedicalScreening {
  id: string;
  userId: string;
  completedAt: string;
  allergies: string[];
  currentMedications: Medication[];
  supplements: UserSupplement[];
  medicalConditions: MedicalCondition[];
  familyHistory: string[];
  lifestyle: {
    smoking: boolean;
    alcohol: 'none' | 'occasional' | 'moderate' | 'heavy';
    exercise: 'none' | 'light' | 'moderate' | 'intense';
    diet: 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'other';
  };
  riskFactors: string[];
  interactions: InteractionAlert[];
}

export interface UserSupplement {
  id: string;
  supplementId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  purpose: string;
  notes?: string;
  interactions?: SupplementInteraction[];
}