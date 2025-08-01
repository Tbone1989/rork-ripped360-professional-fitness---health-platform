export interface User {
  id: string;
  email: string;
  name: string;
  profileImageUrl?: string;
  role: 'user' | 'coach' | 'medical' | 'admin';
  createdAt: string;
  lastActive: string;
  preferences: UserPreferences;
  stats: UserStats;
  subscription?: Subscription;
}

export interface UserPreferences {
  darkMode: boolean;
  notifications: {
    workoutReminders: boolean;
    coachMessages: boolean;
    progressUpdates: boolean;
    medicalAlerts: boolean;
  };
  measurementSystem: 'metric' | 'imperial';
  language: string;
}

export interface UserStats {
  workoutsCompleted: number;
  totalWorkoutTime: number; // in minutes
  streakDays: number;
  longestStreak: number;
  lastWorkout?: string; // date
  favoriteWorkouts: string[]; // workout ids
  favoriteExercises: string[]; // exercise ids
}

export interface Subscription {
  id: string;
  plan: 'free' | 'premium' | 'medical' | 'admin';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod?: string;
}

export interface UserGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetDate?: string;
  progress: number; // 0-1
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;
  updatedAt: string;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
}