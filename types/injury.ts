export interface Injury {
  id: string;
  name: string;
  type: 'acute' | 'chronic' | 'overuse';
  bodyPart: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  symptoms: string[];
  causes: string[];
  recoveryTime: string;
  imageUrl?: string;
}

export interface RehabExercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  targetInjuries: string[];
  bodyParts: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  sets?: number;
  reps?: string;
  holdTime?: number; // in seconds
  equipment: string[];
  videoUrl?: string;
  imageUrl?: string;
  precautions: string[];
  progressions: string[];
  modifications: string[];
}

export interface RehabProgram {
  id: string;
  name: string;
  description: string;
  injuryId: string;
  phase: 'acute' | 'subacute' | 'chronic' | 'maintenance';
  duration: number; // in weeks
  frequency: string; // e.g., "3x per week"
  exercises: RehabExerciseProgram[];
  goals: string[];
  precautions: string[];
  progressMarkers: string[];
}

export interface RehabExerciseProgram {
  exerciseId: string;
  week: number;
  sets: number;
  reps: string;
  holdTime?: number;
  restTime?: number;
  notes?: string;
}

export interface InjuryAssessment {
  id: string;
  userId: string;
  injuryId: string;
  assessmentDate: string;
  painLevel: number; // 1-10 scale
  functionalLevel: number; // 1-10 scale
  symptoms: string[];
  limitations: string[];
  notes?: string;
  recommendedProgram?: string;
}

export interface RehabProgress {
  id: string;
  userId: string;
  programId: string;
  exerciseId: string;
  date: string;
  completed: boolean;
  painLevel?: number;
  difficulty?: number;
  notes?: string;
  modifications?: string[];
}