import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Workout, WorkoutProgress } from '@/types/workout';

interface WorkoutState {
  currentWorkout: Workout | null;
  workoutHistory: WorkoutProgress[];
  favoriteWorkouts: string[];
  isLoading: boolean;
  
  setCurrentWorkout: (workout: Workout | null) => void;
  addWorkoutToHistory: (progress: WorkoutProgress) => void;
  toggleFavoriteWorkout: (workoutId: string) => void;
  clearWorkoutHistory: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      currentWorkout: null,
      workoutHistory: [],
      favoriteWorkouts: [],
      isLoading: false,
      
      setCurrentWorkout: (workout) => {
        set({ currentWorkout: workout });
      },
      
      addWorkoutToHistory: (progress) => {
        set((state) => ({
          workoutHistory: [progress, ...state.workoutHistory],
        }));
      },
      
      toggleFavoriteWorkout: (workoutId) => {
        set((state) => {
          const isFavorite = state.favoriteWorkouts.includes(workoutId);
          
          return {
            favoriteWorkouts: isFavorite
              ? state.favoriteWorkouts.filter((id) => id !== workoutId)
              : [...state.favoriteWorkouts, workoutId],
          };
        });
      },
      
      clearWorkoutHistory: () => {
        set({ workoutHistory: [] });
      },
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);