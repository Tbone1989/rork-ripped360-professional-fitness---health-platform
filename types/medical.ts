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
  digestiveHealth: DigestiveHealthProfile;
  detoxProfile: DetoxProfile;
  healthIssues: HealthIssue[];
  lastUpdated: string;
}

export interface DigestiveHealthProfile {
  id: string;
  userId: string;
  symptoms: DigestiveSymptom[];
  foodIntolerances: string[];
  digestiveConditions: string[];
  bowelMovementFrequency: 'less-than-daily' | 'daily' | 'multiple-daily' | 'irregular';
  bloatingFrequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  heartburnFrequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  stressImpact: 'none' | 'mild' | 'moderate' | 'severe';
  dietaryRestrictions: string[];
  probioticUse: boolean;
  lastUpdated: string;
}

export interface DigestiveSymptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  frequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  triggers: string[];
  notes?: string;
}

export interface DetoxProfile {
  id: string;
  userId: string;
  liverHealth: LiverHealthMarkers;
  kidneyHealth: KidneyHealthMarkers;
  toxinExposure: ToxinExposure[];
  detoxSymptoms: DetoxSymptom[];
  detoxGoals: string[];
  currentDetoxProgram?: DetoxProgram;
  lastDetox?: string;
  lastUpdated: string;
}

export interface LiverHealthMarkers {
  alt?: number; // ALT (Alanine Transaminase)
  ast?: number; // AST (Aspartate Transaminase)
  bilirubin?: number;
  albumin?: number;
  alkalinePhosphatase?: number;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
}

export interface KidneyHealthMarkers {
  creatinine?: number;
  bun?: number; // Blood Urea Nitrogen
  gfr?: number; // Glomerular Filtration Rate
  proteinInUrine?: boolean;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
}

export interface ToxinExposure {
  id: string;
  type: 'environmental' | 'dietary' | 'occupational' | 'lifestyle';
  source: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  severity: 'low' | 'moderate' | 'high';
  notes?: string;
}

export interface DetoxSymptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  frequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  relatedToDetox: boolean;
}

export interface DetoxProgram {
  id: string;
  name: string;
  duration: number; // in days
  type: 'liver' | 'kidney' | 'full-body' | 'gentle' | 'intensive';
  phases: DetoxPhase[];
  supplements: string[];
  dietaryGuidelines: string[];
  restrictions: string[];
  expectedBenefits: string[];
}

export interface DetoxPhase {
  id: string;
  name: string;
  duration: number; // in days
  focus: string;
  activities: string[];
  supplements: string[];
  dietGuidelines: string[];
}

export interface HealthIssue {
  id: string;
  name: string;
  category: 'digestive' | 'metabolic' | 'hormonal' | 'immune' | 'cardiovascular' | 'neurological' | 'other';
  severity: 'mild' | 'moderate' | 'severe';
  symptoms: string[];
  triggers: string[];
  duration: string;
  treatment: string[];
  status: 'active' | 'improving' | 'resolved' | 'chronic';
  notes?: string;
  diagnosedDate?: string;
  lastUpdated: string;
}

export interface BloodTypeProfile {
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  dietaryRecommendations: BloodTypeDiet;
  supplementRecommendations: BloodTypeSupplements;
  exerciseRecommendations: BloodTypeExercise;
  healthRisks: string[];
  beneficialFoods: string[];
  avoidFoods: string[];
  neutralFoods: string[];
}

export interface BloodTypeDiet {
  proteinSources: string[];
  grains: string[];
  vegetables: string[];
  fruits: string[];
  dairy: string[];
  oils: string[];
  beverages: string[];
  spices: string[];
  avoidFoods: string[];
  mealTiming: string[];
  portionGuidelines: string[];
}

export interface BloodTypeSupplements {
  essential: SupplementRecommendation[];
  beneficial: SupplementRecommendation[];
  avoid: string[];
  timing: string[];
}

export interface SupplementRecommendation {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  timing: string;
  notes?: string;
}

export interface BloodTypeExercise {
  recommendedTypes: string[];
  intensity: 'low' | 'moderate' | 'high' | 'mixed';
  frequency: string;
  duration: string;
  avoidExercises: string[];
  benefits: string[];
}

export interface AIBloodworkAnalysis {
  id: string;
  userId: string;
  bloodworkId: string;
  analysisDate: string;
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  keyFindings: AIFinding[];
  nutritionalDeficiencies: NutritionalDeficiency[];
  supplementRecommendations: AISupplementRecommendation[];
  dietaryRecommendations: AIDietaryRecommendation[];
  lifestyleRecommendations: string[];
  followUpRecommendations: string[];
  riskAssessment: RiskAssessment[];
  trendAnalysis?: TrendAnalysis;
  confidence: number; // 0-1
  disclaimer: string;
}

export interface AIFinding {
  marker: string;
  value: number;
  unit: string;
  status: 'optimal' | 'normal' | 'borderline' | 'abnormal' | 'critical';
  interpretation: string;
  clinicalSignificance: string;
  recommendations: string[];
  relatedMarkers: string[];
}

export interface NutritionalDeficiency {
  nutrient: string;
  severity: 'mild' | 'moderate' | 'severe';
  symptoms: string[];
  foodSources: string[];
  supplementForm: string;
  dosageRecommendation: string;
  duration: string;
  monitoringMarkers: string[];
}

export interface AISupplementRecommendation {
  name: string;
  purpose: string;
  dosage: string;
  timing: string;
  duration: string;
  form: string;
  priority: 'high' | 'medium' | 'low';
  interactions: string[];
  contraindications: string[];
  expectedBenefits: string[];
  monitoringRequired: boolean;
}

export interface AIDietaryRecommendation {
  category: string;
  recommendation: string;
  foods: string[];
  avoidFoods: string[];
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  duration: string;
  expectedOutcome: string;
}

export interface RiskAssessment {
  condition: string;
  risk: 'low' | 'moderate' | 'high' | 'very-high';
  factors: string[];
  prevention: string[];
  monitoring: string[];
  timeframe: string;
}

export interface TrendAnalysis {
  period: string;
  improvingMarkers: string[];
  decliningMarkers: string[];
  stableMarkers: string[];
  overallTrend: 'improving' | 'stable' | 'declining';
  recommendations: string[];
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
  aiRecommended?: boolean;
  bloodworkBased?: boolean;
  effectivenessRating?: number; // 1-5
  sideEffects?: string[];
}