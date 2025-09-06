import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WorkoutStore {
  enrolledPlans: string[];
  currentPlan: string | null;
  completedWorkouts: Record<string, string[]>;
  enrollInPlan: (planId: string) => void;
  setCurrentPlan: (planId: string | null) => void;
  completeWorkout: (planId: string, workoutId: string) => void;
  loadEnrolledPlans: () => Promise<void>;
  saveEnrolledPlans: () => Promise<void>;
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  enrolledPlans: [],
  currentPlan: null,
  completedWorkouts: {},

  enrollInPlan: (planId: string) => {
    set((state) => {
      if (!state.enrolledPlans.includes(planId)) {
        const newPlans = [...state.enrolledPlans, planId];
        // Save to AsyncStorage
        AsyncStorage.setItem('enrolledPlans', JSON.stringify(newPlans));
        return { 
          enrolledPlans: newPlans,
          currentPlan: planId 
        };
      }
      return state;
    });
  },

  setCurrentPlan: (planId: string | null) => {
    set({ currentPlan: planId });
    if (planId) {
      AsyncStorage.setItem('currentPlan', planId);
    } else {
      AsyncStorage.removeItem('currentPlan');
    }
  },

  completeWorkout: (planId: string, workoutId: string) => {
    set((state) => {
      const planWorkouts = state.completedWorkouts[planId] || [];
      if (!planWorkouts.includes(workoutId)) {
        const updated = {
          ...state.completedWorkouts,
          [planId]: [...planWorkouts, workoutId],
        };
        AsyncStorage.setItem('completedWorkouts', JSON.stringify(updated));
        return { completedWorkouts: updated };
      }
      return state;
    });
  },

  loadEnrolledPlans: async () => {
    try {
      const [enrolledPlans, currentPlan, completedWorkouts] = await Promise.all([
        AsyncStorage.getItem('enrolledPlans'),
        AsyncStorage.getItem('currentPlan'),
        AsyncStorage.getItem('completedWorkouts'),
      ]);

      set({
        enrolledPlans: enrolledPlans ? JSON.parse(enrolledPlans) : [],
        currentPlan: currentPlan || null,
        completedWorkouts: completedWorkouts ? JSON.parse(completedWorkouts) : {},
      });
    } catch (error) {
      console.error('Failed to load workout data:', error);
    }
  },

  saveEnrolledPlans: async () => {
    const state = get();
    try {
      await Promise.all([
        AsyncStorage.setItem('enrolledPlans', JSON.stringify(state.enrolledPlans)),
        state.currentPlan 
          ? AsyncStorage.setItem('currentPlan', state.currentPlan)
          : AsyncStorage.removeItem('currentPlan'),
        AsyncStorage.setItem('completedWorkouts', JSON.stringify(state.completedWorkouts)),
      ]);
    } catch (error) {
      console.error('Failed to save workout data:', error);
    }
  },
}));

// Load data on app start
useWorkoutStore.getState().loadEnrolledPlans();