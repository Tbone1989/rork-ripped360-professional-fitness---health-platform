export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  instructions: string[];
  tips: string[];
}

export interface WorkoutCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  workoutCount: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  workouts: Workout[];
  createdBy: string;
  createdAt: string;
  isFeatured?: boolean;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  exercises: Exercise[]; // Changed to use Exercise[] instead of WorkoutExercise[]
  equipment: string[];
  targetMuscles: string[];
  calories: number;
  createdBy: string;
  rating: number;
  completions: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps?: number;
  duration?: number; // in seconds
  restTime: number; // in seconds
  weight?: number;
  notes?: string;
}

export interface WorkoutProgress {
  id: string;
  workoutId: string;
  userId: string;
  date: string;
  duration: number; // in minutes
  exercises: ExerciseProgress[];
  notes?: string;
  rating?: number; // 1-5
}

export interface ExerciseProgress {
  exerciseId: string;
  sets: SetProgress[];
}

export interface SetProgress {
  reps?: number;
  weight?: number;
  duration?: number; // in seconds
  completed: boolean;
}

export interface GroupWorkout {
  id: string;
  name: string;
  description: string;
  coachId: string;
  classType: 'group' | 'team' | 'bootcamp' | 'circuit';
  maxParticipants: number;
  currentParticipants: number;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  exercises: GroupExercise[];
  equipment: string[];
  targetMuscles: string[];
  scheduledDates: string[];
  participants: string[]; // user IDs
  modifications: ExerciseModification[];
  progressTracking: GroupProgressTracking;
  createdAt: string;
  updatedAt: string;
}

export interface GroupExercise {
  exerciseId: string;
  name: string;
  description: string;
  sets: number;
  reps?: number;
  duration?: number; // in seconds
  restTime: number; // in seconds
  intensity: 'low' | 'moderate' | 'high';
  modifications: ExerciseModification[];
  equipment: string[];
  instructions: string[];
  coachingCues: string[];
  safetyNotes: string[];
}

export interface ExerciseModification {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  name: string;
  description: string;
  equipment?: string[];
  repsModifier?: number; // multiplier for reps
  weightModifier?: number; // multiplier for weight
  alternativeExercise?: string;
}

export interface GroupProgressTracking {
  averageIntensity: number;
  completionRate: number;
  participantFeedback: ParticipantFeedback[];
  commonModifications: string[];
  injuryReports: InjuryReport[];
}

export interface ParticipantFeedback {
  userId: string;
  rating: number; // 1-5
  difficulty: number; // 1-5
  enjoyment: number; // 1-5
  comments?: string;
  suggestedModifications?: string[];
}

export interface InjuryReport {
  userId: string;
  exerciseId: string;
  type: 'minor' | 'moderate' | 'severe';
  description: string;
  date: string;
  resolved: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  coachId: string;
  category: 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'sports-specific' | 'rehabilitation';
  classType: 'group' | 'team' | 'bootcamp' | 'circuit';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  maxParticipants: number;
  exercises: GroupExercise[];
  equipment: string[];
  spaceRequirements: string[];
  tags: string[];
  isPublic: boolean;
  usageCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface BulkWorkoutGeneration {
  coachId: string;
  teamIds: string[];
  generationType: 'weekly' | 'monthly' | 'program';
  preferences: BulkGenerationPreferences;
  schedule: WorkoutSchedule[];
  variations: boolean; // Generate variations for different skill levels
  progressiveOverload: boolean;
  equipmentRotation: boolean;
}

export interface BulkGenerationPreferences {
  primaryGoals: string[];
  secondaryGoals: string[];
  availableEquipment: string[];
  spaceConstraints: string[];
  sessionDuration: number;
  participantLevels: ('beginner' | 'intermediate' | 'advanced')[];
  injuryConsiderations: string[];
  specialRequirements: string[];
}

export interface WorkoutSchedule {
  day: string;
  time: string;
  duration: number;
  classType: 'group' | 'team' | 'bootcamp' | 'circuit';
  focus: string; // e.g., 'upper body', 'cardio', 'full body'
  intensity: 'low' | 'moderate' | 'high';
  maxParticipants: number;
}

export interface TeamManagement {
  id: string;
  name: string;
  coachId: string;
  members: TeamMember[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  sport?: string;
  season: 'preseason' | 'inseason' | 'postseason' | 'offseason';
  goals: string[];
  trainingPhase: string;
  meetingSchedule: WorkoutSchedule[];
  equipment: string[];
  facility: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  userId: string;
  name: string;
  position?: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  injuries: string[];
  limitations: string[];
  goals: string[];
  attendance: number; // percentage
  performance: TeamMemberPerformance;
}

export interface TeamMemberPerformance {
  strength: number; // 1-10
  endurance: number; // 1-10
  flexibility: number; // 1-10
  technique: number; // 1-10
  consistency: number; // 1-10
  improvement: number; // percentage
  lastAssessment: string;
}