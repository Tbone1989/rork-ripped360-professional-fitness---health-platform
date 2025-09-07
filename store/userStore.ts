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
  login: (email: string, password: string, role?: 'user' | 'coach' | 'medical') => Promise<void>;
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
      
      login: async (email, password, role: 'user' | 'coach' | 'medical' = 'user') => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data
          const nowIso = new Date().toISOString();
          const userData: User = {
            id: '1',
            email,
            name: 'John Doe',
            profileImageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=500',
            role: 'admin', // Temporarily set to admin for testing
            createdAt: nowIso,
            lastActive: nowIso,
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
              lastWorkout: nowIso,
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
            attachments: [
              {
                id: 'att-1',
                title: 'Blood Panel - Comprehensive',
                url: 'https://www.hhs.texas.gov/sites/default/files/documents/laws-regulations/forms/hhs-1100.pdf',
                createdAt: nowIso,
                visibleToCoaches: false,
              },
              {
                id: 'att-2',
                title: 'MRI Report - Left Knee',
                url: 'https://www.massgeneral.org/assets/mgh/pdf/imaging/radiology-report-example.pdf',
                createdAt: nowIso,
                visibleToCoaches: true,
              },
              {
                id: 'att-3',
                title: 'Supplement Protocol',
                url: 'https://files.nccih.nih.gov/s3fs-public/media_files/Herbal_Supplements_At_A_Glance.pdf',
                createdAt: nowIso,
                visibleToCoaches: true,
              },
            ],
            verificationStatus: {
              identity: 'verified',
              email: 'verified',
              phone: 'verified',
              professional: 'not_applicable',
            },
            legalAgreements: [
              {
                id: 'legal-1',
                type: 'terms_of_service',
                version: '1.0',
                acceptedAt: nowIso,
                ipAddress: '127.0.0.1',
                userAgent: 'Test User Agent',
              },
            ],
          };
          
          set({ user: userData, isAuthenticated: true, isAdmin: true, isLoading: false }); // Set admin for testing
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
            
            const nowIsoAdmin = new Date().toISOString();
            const adminData: User = {
              id: 'admin-1',
              email,
              name: 'System Administrator',
              profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500',
              role: 'admin',
              createdAt: nowIsoAdmin,
              lastActive: nowIsoAdmin,
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
                lastWorkout: nowIsoAdmin,
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
              attachments: [
                {
                  id: 'att-admin-1',
                  title: 'Policy: PHI Handling',
                  url: 'https://www.hhs.gov/sites/default/files/ocr/privacy/hipaa/understanding/summary/privacysummary.pdf',
                  createdAt: nowIsoAdmin,
                  visibleToCoaches: false,
                },
              ],
              verificationStatus: {
                identity: 'verified',
                email: 'verified',
                phone: 'verified',
                professional: 'verified',
              },
              legalAgreements: [
                {
                  id: 'legal-admin-1',
                  type: 'terms_of_service',
                  version: '1.0',
                  acceptedAt: nowIsoAdmin,
                  ipAddress: '127.0.0.1',
                  userAgent: 'Admin User Agent',
                },
              ],
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
        console.log('[UserStore] updateUser', userData);
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
      
      updatePreferences: (preferences) => {
        console.log('[UserStore] updatePreferences', preferences);
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