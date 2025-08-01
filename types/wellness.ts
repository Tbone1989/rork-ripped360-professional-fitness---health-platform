export interface SleepData {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  duration: number; // in minutes
  quality: 1 | 2 | 3 | 4 | 5;
  deepSleep: number; // percentage
  remSleep: number; // percentage
  lightSleep: number; // percentage
  awakenings: number;
  notes?: string;
}

export interface StressData {
  id: string;
  date: string;
  time: string;
  level: 1 | 2 | 3 | 4 | 5;
  triggers: string[];
  symptoms: string[];
  copingStrategies: string[];
  notes?: string;
}

export interface RecoveryMetrics {
  id: string;
  date: string;
  heartRateVariability: number;
  restingHeartRate: number;
  bodyTemperature: number;
  muscleStiffness: 1 | 2 | 3 | 4 | 5;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  motivation: 1 | 2 | 3 | 4 | 5;
  overallRecovery: 1 | 2 | 3 | 4 | 5;
}

export interface HormoneTracking {
  id: string;
  date: string;
  testType: 'blood' | 'saliva' | 'urine';
  hormones: {
    testosterone?: number;
    cortisol?: number;
    thyroid?: {
      tsh?: number;
      t3?: number;
      t4?: number;
    };
    insulin?: number;
    growth_hormone?: number;
    estrogen?: number;
    progesterone?: number;
  };
  symptoms: string[];
  notes?: string;
}

export interface SupplementInteraction {
  id: string;
  supplement1: string;
  supplement2: string;
  interactionType: 'positive' | 'negative' | 'neutral';
  severity: 'low' | 'moderate' | 'high';
  description: string;
  recommendation: string;
}

export interface WellnessGoals {
  sleepHours: number;
  stressLevel: number;
  recoveryScore: number;
  hydration: number; // ml per day
  steps: number;
  meditation: number; // minutes per day
}

export interface GymTestingScenario {
  id: string;
  name: string;
  description: string;
  environment: 'bright' | 'dim' | 'outdoor' | 'indoor';
  temperature: 'cold' | 'normal' | 'hot';
  humidity: 'low' | 'normal' | 'high';
  noiseLevel: 'quiet' | 'moderate' | 'loud';
  testCases: TestCase[];
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  expectedBehavior: string;
  actualBehavior?: string;
  status: 'pending' | 'passed' | 'failed';
  notes?: string;
}

export interface NutritionTestScenario {
  id: string;
  name: string;
  scenario: 'meal_prep' | 'restaurant' | 'supplement_timing' | 'hydration';
  testCases: TestCase[];
}