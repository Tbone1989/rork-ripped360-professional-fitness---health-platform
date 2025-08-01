import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BloodworkResult, MedicalProfile } from '@/types/medical';

interface MedicalState {
  medicalProfile: MedicalProfile | null;
  bloodworkResults: BloodworkResult[];
  isLoading: boolean;
  
  setMedicalProfile: (profile: MedicalProfile) => void;
  updateMedicalProfile: (data: Partial<MedicalProfile>) => void;
  addBloodworkResult: (result: BloodworkResult) => void;
  clearBloodworkResults: () => void;
}

export const useMedicalStore = create<MedicalState>()(
  persist(
    (set) => ({
      medicalProfile: null,
      bloodworkResults: [],
      isLoading: false,
      
      setMedicalProfile: (profile) => {
        set({ medicalProfile: profile });
      },
      
      updateMedicalProfile: (data) => {
        set((state) => ({
          medicalProfile: state.medicalProfile
            ? { ...state.medicalProfile, ...data }
            : null,
        }));
      },
      
      addBloodworkResult: (result) => {
        set((state) => ({
          bloodworkResults: [result, ...state.bloodworkResults],
        }));
      },
      
      clearBloodworkResults: () => {
        set({ bloodworkResults: [] });
      },
    }),
    {
      name: 'medical-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);