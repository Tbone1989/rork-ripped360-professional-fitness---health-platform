import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserPreferences } from '@/types/user';

interface UserState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, role?: 'user' | 'coach') => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  grantUserAccess: (userId: string, accessLevel: 'free' | 'premium' | 'medical') => void;
  revokeUserAccess: (userId: string) => void;
  updateSubscription: (plan: 'free' | 'premium' | 'medical', billing?: 'monthly' | 'yearly') => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      hasHydrated: false,
      isAdmin: false,
      
      login: async (email, password, role = 'user') => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data
          const userData: User = {
            id: '1',
            email,
            name: 'John Doe',
            profileImageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=500',
            role: role,
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            preferences: {
              darkMode: true,
              notifications: {
                workoutReminders: true,
                coachMessages: true,
                progressUpdates: true,
                medicalAlerts: true,
              },
              measurementSystem: 'metric',
              language: 'en',
            },
            stats: {
              workoutsCompleted: 87,
              totalWorkoutTime: 4320,
              streakDays: 12,
              longestStreak: 30,
              lastWorkout: new Date().toISOString(),
              favoriteWorkouts: [],
              favoriteExercises: [],
            },
            subscription: {
              id: 'sub1',
              plan: 'free',
              startDate: '2023-01-01',
              endDate: '2024-01-01',
              autoRenew: true,
            },
          };
          
          set({ user: userData, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      adminLogin: async (email, password) => {
        set({ isLoading: true });
        
        try {
          // Check admin credentials
          if (email === 'admin@ripped360.com' && password === 'RippedAdmin2024!') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const adminData: User = {
              id: 'admin-1',
              email,
              name: 'System Administrator',
              profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500',
              role: 'admin',
              createdAt: new Date().toISOString(),
              lastActive: new Date().toISOString(),
              preferences: {
                darkMode: true,
                notifications: {
                  workoutReminders: true,
                  coachMessages: true,
                  progressUpdates: true,
                  medicalAlerts: true,
                },
                measurementSystem: 'metric',
                language: 'en',
              },
              stats: {
                workoutsCompleted: 0,
                totalWorkoutTime: 0,
                streakDays: 0,
                longestStreak: 0,
                lastWorkout: new Date().toISOString(),
                favoriteWorkouts: [],
                favoriteExercises: [],
              },
              subscription: {
                id: 'admin-sub',
                plan: 'admin',
                startDate: '2023-01-01',
                endDate: '2030-01-01',
                autoRenew: true,
              },
            };
            
            set({ user: adminData, isAuthenticated: true, isAdmin: true, isLoading: false });
          } else {
            throw new Error('Invalid admin credentials');
          }
        } catch (error) {
          console.error('Admin login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, isAdmin: false });
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
      
      updatePreferences: (preferences) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                preferences: {
                  ...state.user.preferences,
                  ...preferences,
                },
              }
            : null,
        }));
      },
      
      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },
      
      grantUserAccess: (userId, accessLevel) => {
        // In a real app, this would make an API call
        console.log(`Granting ${accessLevel} access to user ${userId}`);
      },
      
      revokeUserAccess: (userId) => {
        // In a real app, this would make an API call
        console.log(`Revoking access for user ${userId}`);
      },
      
      updateSubscription: (plan, billing = 'monthly') => {
        set((state) => {
          if (!state.user) return state;
          
          const now = new Date();
          const endDate = new Date();
          
          if (billing === 'yearly') {
            endDate.setFullYear(now.getFullYear() + 1);
          } else {
            endDate.setMonth(now.getMonth() + 1);
          }
          
          return {
            user: {
              ...state.user,
              subscription: {
                id: `sub-${Date.now()}`,
                plan,
                startDate: now.toISOString(),
                endDate: endDate.toISOString(),
                autoRenew: true,
              },
            },
          };
        });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);