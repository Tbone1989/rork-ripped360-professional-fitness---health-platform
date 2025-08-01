export interface ContestPrep {
  id: string;
  userId: string;
  coachId?: string;
  contestName: string;
  contestDate: string;
  category: 'mens-physique' | 'classic-physique' | 'bodybuilding' | 'bikini' | 'figure' | 'wellness';
  status: 'planning' | 'prep' | 'peak-week' | 'post-contest';
  startDate: string;
  weeksOut: number;
  currentPhase: ContestPhase;
  phases: ContestPhase[];
  peakWeekProtocol?: PeakWeekProtocol;
  posingPractice: PosingSession[];
  dehydrationTracking: DehydrationLog[];
  stageReadyNutrition: StageNutritionPlan;
  progress: ContestProgress;
  createdAt: string;
  updatedAt: string;
}

export interface ContestPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  weeksOut: number;
  goals: string[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  cardio: {
    type: 'steady-state' | 'hiit' | 'mixed';
    duration: number; // minutes per day
    frequency: number; // days per week
  };
  supplements: string[];
  notes?: string;
}

export interface PeakWeekProtocol {
  id: string;
  contestPrepId: string;
  days: PeakWeekDay[];
  waterIntake: WaterProtocol[];
  sodiumManipulation: SodiumProtocol[];
  carbLoading: CarbLoadingProtocol[];
  supplementProtocol: SupplementProtocol[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PeakWeekDay {
  day: number; // 1-7 (7 days out to contest day)
  date: string;
  weight?: number;
  bodyFat?: number;
  photos: string[]; // photo URLs
  energy: 1 | 2 | 3 | 4 | 5;
  fullness: 1 | 2 | 3 | 4 | 5;
  vascularity: 1 | 2 | 3 | 4 | 5;
  conditioning: 1 | 2 | 3 | 4 | 5;
  notes: string;
  completed: boolean;
}

export interface WaterProtocol {
  day: number;
  amount: number; // in liters
  timing: string[];
  notes?: string;
}

export interface SodiumProtocol {
  day: number;
  amount: number; // in mg
  sources: string[];
  timing: string;
  notes?: string;
}

export interface CarbLoadingProtocol {
  day: number;
  amount: number; // in grams
  sources: string[];
  timing: string[];
  notes?: string;
}

export interface SupplementProtocol {
  day: number;
  supplements: {
    name: string;
    dosage: string;
    timing: string;
  }[];
  notes?: string;
}

export interface PosingSession {
  id: string;
  contestPrepId: string;
  date: string;
  duration: number; // in minutes
  poses: PosingPose[];
  videoUrl?: string;
  coachFeedback?: string;
  selfRating: 1 | 2 | 3 | 4 | 5;
  notes: string;
  completed: boolean;
}

export interface PosingPose {
  name: string;
  category: 'mandatory' | 'individual';
  duration: number; // seconds held
  repetitions: number;
  feedback?: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface DehydrationLog {
  id: string;
  contestPrepId: string;
  date: string;
  time: string;
  waterIntake: number; // ml
  urineColor: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // hydration scale
  weight: number;
  bodyTemp?: number;
  symptoms: string[];
  notes: string;
}

export interface StageNutritionPlan {
  id: string;
  contestPrepId: string;
  contestDay: {
    preShow: NutritionTiming[];
    postShow: NutritionTiming[];
  };
  backupPlans: {
    flatMuscles: NutritionTiming[];
    spillover: NutritionTiming[];
    lowEnergy: NutritionTiming[];
  };
  emergencyProtocols: EmergencyProtocol[];
}

export interface NutritionTiming {
  time: string;
  food: string;
  amount: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sodium: number;
  };
  purpose: string;
}

export interface EmergencyProtocol {
  scenario: string;
  action: string;
  foods: string[];
  timing: string;
  notes: string;
}

export interface ContestProgress {
  startWeight: number;
  currentWeight: number;
  targetWeight: number;
  startBodyFat: number;
  currentBodyFat: number;
  targetBodyFat: number;
  measurements: {
    date: string;
    chest: number;
    waist: number;
    arms: number;
    thighs: number;
    shoulders: number;
  }[];
  photos: {
    date: string;
    front: string;
    side: string;
    back: string;
    poses?: string[];
  }[];
  milestones: {
    date: string;
    achievement: string;
    notes: string;
  }[];
}

export interface PosingTimer {
  id: string;
  name: string;
  poses: {
    name: string;
    duration: number; // seconds
    rest: number; // seconds
  }[];
  totalDuration: number;
  rounds: number;
}

export const POSING_CATEGORIES = {
  'mens-physique': [
    'Front Relaxed',
    'Quarter Turn Right',
    'Back Relaxed',
    'Quarter Turn Left',
    'Individual Routine'
  ],
  'classic-physique': [
    'Front Double Bicep',
    'Quarter Turn Right',
    'Side Chest',
    'Back Double Bicep',
    'Quarter Turn Left',
    'Abdominals & Thigh',
    'Individual Routine'
  ],
  'bodybuilding': [
    'Front Double Bicep',
    'Front Lat Spread',
    'Side Chest',
    'Back Double Bicep',
    'Back Lat Spread',
    'Side Tricep',
    'Abdominals & Thigh',
    'Most Muscular',
    'Individual Routine'
  ],
  'bikini': [
    'Front Pose',
    'Quarter Turn Right',
    'Back Pose',
    'Quarter Turn Left',
    'Individual Routine'
  ],
  'figure': [
    'Front Pose',
    'Quarter Turn Right',
    'Side Pose',
    'Back Pose',
    'Quarter Turn Left',
    'Individual Routine'
  ],
  'wellness': [
    'Front Pose',
    'Quarter Turn Right',
    'Side Pose',
    'Back Pose',
    'Quarter Turn Left',
    'Individual Routine'
  ]
};

// Automated Protocol Types
export interface AutomatedProtocol {
  id: string;
  contestPrepId: string;
  name: string;
  type: 'calorie-cycling' | 'macro-adjustment' | 'cardio-programming' | 'supplement-timing' | 'progress-photos';
  isActive: boolean;
  schedule: ProtocolSchedule;
  parameters: ProtocolParameters;
  history: ProtocolExecution[];
  createdAt: string;
  updatedAt: string;
}

export interface ProtocolSchedule {
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'custom';
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  timeOfDay?: string; // HH:MM format
  customDates?: string[]; // ISO date strings
  duration?: number; // weeks
}

export interface ProtocolParameters {
  // Calorie Cycling
  calorieRange?: {
    high: number;
    medium: number;
    low: number;
  };
  cyclePattern?: number[]; // e.g., [1, 2, 1, 3] for high, medium, high, low
  
  // Macro Adjustments
  macroTargets?: {
    protein: { min: number; max: number };
    carbs: { min: number; max: number };
    fat: { min: number; max: number };
  };
  adjustmentTriggers?: {
    weightLoss: number; // kg per week
    bodyFatChange: number; // % change
    energyLevel: number; // 1-5 scale
  };
  
  // Cardio Programming
  cardioProgression?: {
    startDuration: number; // minutes
    maxDuration: number; // minutes
    weeklyIncrease: number; // minutes
    intensityLevels: ('low' | 'moderate' | 'high')[];
  };
  
  // Supplement Timing
  supplementSchedule?: {
    name: string;
    dosage: string;
    timing: string[];
    conditions?: string; // e.g., "with meals", "on empty stomach"
  }[];
  
  // Progress Photos
  photoSettings?: {
    poses: string[];
    lighting: string;
    timeOfDay: string;
    reminderTime: string;
  };
}

export interface ProtocolExecution {
  id: string;
  date: string;
  type: string;
  parameters: any;
  result: 'success' | 'failed' | 'skipped';
  notes?: string;
  autoGenerated: boolean;
}

export interface CalorieCycleDay {
  date: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  type: 'high' | 'medium' | 'low';
  completed: boolean;
  actualIntake?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface CardioSession {
  id: string;
  date: string;
  type: 'steady-state' | 'hiit' | 'liss';
  duration: number;
  intensity: 'low' | 'moderate' | 'high';
  heartRate?: {
    avg: number;
    max: number;
  };
  caloriesBurned?: number;
  completed: boolean;
  notes?: string;
}

export interface SupplementReminder {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  date: string;
  notes?: string;
}

export interface ProgressPhotoReminder {
  id: string;
  date: string;
  time: string;
  poses: string[];
  completed: boolean;
  photos?: string[];
  notes?: string;
}

export const AUTOMATED_PROTOCOL_TEMPLATES = {
  'aggressive-cut': {
    name: 'Aggressive Cut Protocol',
    description: 'High deficit with strategic refeeds',
    calorieRange: { high: 2200, medium: 1800, low: 1400 },
    cyclePattern: [3, 3, 1], // 3 low, 3 medium, 1 high
    cardioProgression: {
      startDuration: 20,
      maxDuration: 60,
      weeklyIncrease: 5,
      intensityLevels: ['moderate', 'high']
    }
  },
  'moderate-cut': {
    name: 'Moderate Cut Protocol',
    description: 'Sustainable deficit with regular refeeds',
    calorieRange: { high: 2400, medium: 2000, low: 1600 },
    cyclePattern: [2, 2, 1], // 2 low, 2 medium, 1 high
    cardioProgression: {
      startDuration: 15,
      maxDuration: 45,
      weeklyIncrease: 3,
      intensityLevels: ['low', 'moderate']
    }
  },
  'contest-prep': {
    name: 'Contest Prep Protocol',
    description: 'Periodized approach for competition',
    calorieRange: { high: 2000, medium: 1600, low: 1200 },
    cyclePattern: [5, 1, 1], // 5 low, 1 medium, 1 high
    cardioProgression: {
      startDuration: 30,
      maxDuration: 90,
      weeklyIncrease: 5,
      intensityLevels: ['moderate', 'high']
    }
  }
};

export const PEAK_WEEK_TEMPLATES = {
  'water-depletion': {
    name: 'Water Depletion Protocol',
    description: 'Gradual water reduction for final week',
    waterProtocol: [
      { day: 7, amount: 6.0, timing: ['Morning', 'Pre-workout', 'Post-workout', 'Evening'] },
      { day: 6, amount: 5.0, timing: ['Morning', 'Pre-workout', 'Post-workout', 'Evening'] },
      { day: 5, amount: 4.0, timing: ['Morning', 'Pre-workout', 'Post-workout'] },
      { day: 4, amount: 3.0, timing: ['Morning', 'Pre-workout', 'Post-workout'] },
      { day: 3, amount: 2.0, timing: ['Morning', 'Post-workout'] },
      { day: 2, amount: 1.0, timing: ['Morning'] },
      { day: 1, amount: 0.5, timing: ['Morning'] }
    ]
  },
  'carb-cycling': {
    name: 'Carb Cycling Protocol',
    description: 'Strategic carb manipulation for fullness',
    carbProtocol: [
      { day: 7, amount: 50, sources: ['Rice', 'Sweet potato'], timing: ['Post-workout'] },
      { day: 6, amount: 30, sources: ['Rice'], timing: ['Post-workout'] },
      { day: 5, amount: 20, sources: ['Rice'], timing: ['Post-workout'] },
      { day: 4, amount: 10, sources: ['Rice'], timing: ['Post-workout'] },
      { day: 3, amount: 150, sources: ['Rice', 'Sweet potato', 'Banana'], timing: ['Morning', 'Post-workout', 'Evening'] },
      { day: 2, amount: 200, sources: ['Rice', 'Sweet potato', 'Banana'], timing: ['Morning', 'Pre-workout', 'Post-workout', 'Evening'] },
      { day: 1, amount: 100, sources: ['Rice', 'Banana'], timing: ['Morning', 'Pre-show'] }
    ]
  }
};