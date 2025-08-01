import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  ContestPrep, 
  PeakWeekProtocol, 
  PosingSession, 
  DehydrationLog, 
  PosingTimer,
  ContestPhase,
  PeakWeekDay,
  AutomatedProtocol,
  CalorieCycleDay,
  CardioSession,
  SupplementReminder,
  ProgressPhotoReminder
} from '@/types/contest';

interface ContestState {
  contestPreps: ContestPrep[];
  currentPrep: ContestPrep | null;
  posingTimers: PosingTimer[];
  automatedProtocols: AutomatedProtocol[];
  calorieCycleDays: CalorieCycleDay[];
  cardioSessions: CardioSession[];
  supplementReminders: SupplementReminder[];
  progressPhotoReminders: ProgressPhotoReminder[];
  isLoading: boolean;
  
  // Contest Prep Management
  createContestPrep: (prep: Omit<ContestPrep, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContestPrep: (id: string, updates: Partial<ContestPrep>) => void;
  deleteContestPrep: (id: string) => void;
  setCurrentPrep: (prep: ContestPrep | null) => void;
  
  // Peak Week Management
  updatePeakWeekProtocol: (contestPrepId: string, protocol: PeakWeekProtocol) => void;
  updatePeakWeekDay: (contestPrepId: string, dayUpdate: Partial<PeakWeekDay> & { day: number }) => void;
  
  // Posing Practice
  addPosingSession: (session: Omit<PosingSession, 'id'>) => void;
  updatePosingSession: (id: string, updates: Partial<PosingSession>) => void;
  deletePosingSession: (id: string) => void;
  
  // Dehydration Tracking
  addDehydrationLog: (log: Omit<DehydrationLog, 'id'>) => void;
  updateDehydrationLog: (id: string, updates: Partial<DehydrationLog>) => void;
  deleteDehydrationLog: (id: string) => void;
  
  // Posing Timers
  createPosingTimer: (timer: Omit<PosingTimer, 'id'>) => void;
  updatePosingTimer: (id: string, updates: Partial<PosingTimer>) => void;
  deletePosingTimer: (id: string) => void;
  
  // Progress Tracking
  updateProgress: (contestPrepId: string, progress: Partial<ContestPrep['progress']>) => void;
  addProgressPhoto: (contestPrepId: string, photos: { front: string; side: string; back: string; poses?: string[] }) => void;
  addMilestone: (contestPrepId: string, milestone: { achievement: string; notes: string }) => void;
  
  // Automated Protocols
  createAutomatedProtocol: (protocol: Omit<AutomatedProtocol, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAutomatedProtocol: (id: string, updates: Partial<AutomatedProtocol>) => void;
  deleteAutomatedProtocol: (id: string) => void;
  toggleProtocol: (id: string) => void;
  executeProtocol: (id: string) => void;
  
  // Calorie Cycling
  generateCalorieCycle: (protocolId: string, weeks: number) => void;
  updateCalorieCycleDay: (id: string, updates: Partial<CalorieCycleDay>) => void;
  
  // Cardio Programming
  generateCardioSessions: (protocolId: string, weeks: number) => void;
  updateCardioSession: (id: string, updates: Partial<CardioSession>) => void;
  
  // Supplement Reminders
  generateSupplementReminders: (protocolId: string, days: number) => void;
  updateSupplementReminder: (id: string, updates: Partial<SupplementReminder>) => void;
  
  // Progress Photo Reminders
  generateProgressPhotoReminders: (protocolId: string, weeks: number) => void;
  updateProgressPhotoReminder: (id: string, updates: Partial<ProgressPhotoReminder>) => void;
}

// Mock data
const mockContestPreps: ContestPrep[] = [
  {
    id: '1',
    userId: '1',
    coachId: 'coach-1',
    contestName: 'NPC Regional Championships',
    contestDate: '2024-06-15',
    category: 'mens-physique',
    status: 'prep',
    startDate: '2024-01-01',
    weeksOut: 12,
    currentPhase: {
      id: 'phase-1',
      name: 'Cutting Phase',
      startDate: '2024-03-01',
      endDate: '2024-05-01',
      weeksOut: 12,
      goals: ['Reduce body fat to 8%', 'Maintain muscle mass', 'Improve conditioning'],
      macros: {
        calories: 2200,
        protein: 180,
        carbs: 150,
        fat: 80
      },
      cardio: {
        type: 'mixed',
        duration: 45,
        frequency: 6
      },
      supplements: ['Whey Protein', 'Creatine', 'Multivitamin', 'Fish Oil']
    },
    phases: [],
    posingPractice: [],
    dehydrationTracking: [],
    stageReadyNutrition: {
      id: 'nutrition-1',
      contestPrepId: '1',
      contestDay: {
        preShow: [
          {
            time: '6:00 AM',
            food: 'Rice cakes with honey',
            amount: '2 cakes',
            macros: { calories: 120, protein: 2, carbs: 28, fat: 0, sodium: 50 },
            purpose: 'Quick energy and muscle fullness'
          }
        ],
        postShow: [
          {
            time: 'Immediately after',
            food: 'Chocolate and pizza',
            amount: 'As desired',
            macros: { calories: 800, protein: 20, carbs: 80, fat: 40, sodium: 1200 },
            purpose: 'Celebration and recovery'
          }
        ]
      },
      backupPlans: {
        flatMuscles: [],
        spillover: [],
        lowEnergy: []
      },
      emergencyProtocols: []
    },
    progress: {
      startWeight: 185,
      currentWeight: 172,
      targetWeight: 168,
      startBodyFat: 15,
      currentBodyFat: 10,
      targetBodyFat: 6,
      measurements: [],
      photos: [],
      milestones: []
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z'
  }
];

const mockPosingTimers: PosingTimer[] = [
  {
    id: '1',
    name: 'Men\'s Physique Mandatory',
    poses: [
      { name: 'Front Relaxed', duration: 15, rest: 5 },
      { name: 'Quarter Turn Right', duration: 10, rest: 5 },
      { name: 'Back Relaxed', duration: 15, rest: 5 },
      { name: 'Quarter Turn Left', duration: 10, rest: 5 }
    ],
    totalDuration: 80,
    rounds: 3
  },
  {
    id: '2',
    name: 'Individual Routine Practice',
    poses: [
      { name: 'Opening Pose', duration: 8, rest: 2 },
      { name: 'Transition 1', duration: 5, rest: 2 },
      { name: 'Side Chest', duration: 8, rest: 2 },
      { name: 'Transition 2', duration: 5, rest: 2 },
      { name: 'Back Double Bicep', duration: 8, rest: 2 },
      { name: 'Transition 3', duration: 5, rest: 2 },
      { name: 'Most Muscular', duration: 8, rest: 2 },
      { name: 'Closing Pose', duration: 8, rest: 0 }
    ],
    totalDuration: 120,
    rounds: 2
  }
];

export const useContestStore = create<ContestState>()((set, get) => ({
  contestPreps: mockContestPreps,
  currentPrep: mockContestPreps[0],
  posingTimers: mockPosingTimers,
  automatedProtocols: [],
  calorieCycleDays: [],
  cardioSessions: [],
  supplementReminders: [],
  progressPhotoReminders: [],
  isLoading: false,

  createContestPrep: (prep) => {
    const newPrep: ContestPrep = {
      ...prep,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    set((state) => ({
      contestPreps: [...state.contestPreps, newPrep]
    }));
  },

  updateContestPrep: (id, updates) => {
    set((state) => ({
      contestPreps: state.contestPreps.map(prep =>
        prep.id === id
          ? { ...prep, ...updates, updatedAt: new Date().toISOString() }
          : prep
      ),
      currentPrep: state.currentPrep?.id === id
        ? { ...state.currentPrep, ...updates, updatedAt: new Date().toISOString() }
        : state.currentPrep
    }));
  },

  deleteContestPrep: (id) => {
    set((state) => ({
      contestPreps: state.contestPreps.filter(prep => prep.id !== id),
      currentPrep: state.currentPrep?.id === id ? null : state.currentPrep
    }));
  },

  setCurrentPrep: (prep) => {
    set({ currentPrep: prep });
  },

  updatePeakWeekProtocol: (contestPrepId, protocol) => {
    set((state) => ({
      contestPreps: state.contestPreps.map(prep =>
        prep.id === contestPrepId
          ? { ...prep, peakWeekProtocol: protocol, updatedAt: new Date().toISOString() }
          : prep
      )
    }));
  },

  updatePeakWeekDay: (contestPrepId, dayUpdate) => {
    set((state) => ({
      contestPreps: state.contestPreps.map(prep => {
        if (prep.id !== contestPrepId || !prep.peakWeekProtocol) return prep;
        
        return {
          ...prep,
          peakWeekProtocol: {
            ...prep.peakWeekProtocol,
            days: prep.peakWeekProtocol.days.map(day =>
              day.day === dayUpdate.day
                ? { ...day, ...dayUpdate }
                : day
            ),
            updatedAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        };
      })
    }));
  },

  addPosingSession: (session) => {
    const newSession: PosingSession = {
      ...session,
      id: Date.now().toString()
    };

    set((state) => ({
      contestPreps: state.contestPreps.map(prep =>
        prep.id === session.contestPrepId
          ? {
              ...prep,
              posingPractice: [...prep.posingPractice, newSession],
              updatedAt: new Date().toISOString()
            }
          : prep
      )
    }));
  },

  updatePosingSession: (id, updates) => {
    set((state) => ({
      contestPreps: state.contestPreps.map(prep => ({
        ...prep,
        posingPractice: prep.posingPractice.map(session =>
          session.id === id ? { ...session, ...updates } : session
        ),
        updatedAt: prep.posingPractice.some(s => s.id === id) ? new Date().toISOString() : prep.updatedAt
      }))
    }));
  },

  deletePosingSession: (id) => {
    set((state) => ({
      contestPreps: state.contestPreps.map(prep => ({
        ...prep,
        posingPractice: prep.posingPractice.filter(session => session.id !== id),
        updatedAt: prep.posingPractice.some(s => s.id === id) ? new Date().toISOString() : prep.updatedAt
      }))
    }));
  },

  addDehydrationLog: (log) => {
    const newLog: DehydrationLog = {
      ...log,
      id: Date.now().toString()
    };

    set((state) => ({
      contestPreps: state.contestPreps.map(prep =>
        prep.id === log.contestPrepId
          ? {
              ...prep,
              dehydrationTracking: [...prep.dehydrationTracking, newLog],
              updatedAt: new Date().toISOString()
            }
          : prep
      )
    }));
  },

  updateDehydrationLog: (id, updates) => {
    set((state) => ({
      contestPreps: state.contestPreps.map(prep => ({
        ...prep,
        dehydrationTracking: prep.dehydrationTracking.map(log =>
          log.id === id ? { ...log, ...updates } : log
        ),
        updatedAt: prep.dehydrationTracking.some(l => l.id === id) ? new Date().toISOString() : prep.updatedAt
      }))
    }));
  },

  deleteDehydrationLog: (id) => {
    set((state) => ({
      contestPreps: state.contestPreps.map(prep => ({
        ...prep,
        dehydrationTracking: prep.dehydrationTracking.filter(log => log.id !== id),
        updatedAt: prep.dehydrationTracking.some(l => l.id === id) ? new Date().toISOString() : prep.updatedAt
      }))
    }));
  },

  createPosingTimer: (timer) => {
    const newTimer: PosingTimer = {
      ...timer,
      id: Date.now().toString()
    };
    
    set((state) => ({
      posingTimers: [...state.posingTimers, newTimer]
    }));
  },

  updatePosingTimer: (id, updates) => {
    set((state) => ({
      posingTimers: state.posingTimers.map(timer =>
        timer.id === id ? { ...timer, ...updates } : timer
      )
    }));
  },

  deletePosingTimer: (id) => {
    set((state) => ({
      posingTimers: state.posingTimers.filter(timer => timer.id !== id)
    }));
  },

  updateProgress: (contestPrepId, progress) => {
    set((state) => ({
      contestPreps: state.contestPreps.map(prep =>
        prep.id === contestPrepId
          ? {
              ...prep,
              progress: { ...prep.progress, ...progress },
              updatedAt: new Date().toISOString()
            }
          : prep
      )
    }));
  },

  addProgressPhoto: (contestPrepId, photos) => {
    const photoEntry = {
      date: new Date().toISOString(),
      ...photos
    };

    set((state) => ({
      contestPreps: state.contestPreps.map(prep =>
        prep.id === contestPrepId
          ? {
              ...prep,
              progress: {
                ...prep.progress,
                photos: [...prep.progress.photos, photoEntry]
              },
              updatedAt: new Date().toISOString()
            }
          : prep
      )
    }));
  },

  addMilestone: (contestPrepId, milestone) => {
    const milestoneEntry = {
      date: new Date().toISOString(),
      ...milestone
    };

    set((state) => ({
      contestPreps: state.contestPreps.map(prep =>
        prep.id === contestPrepId
          ? {
              ...prep,
              progress: {
                ...prep.progress,
                milestones: [...prep.progress.milestones, milestoneEntry]
              },
              updatedAt: new Date().toISOString()
            }
          : prep
      )
    }));
  },

  // Automated Protocols
  createAutomatedProtocol: (protocol) => {
    const newProtocol: AutomatedProtocol = {
      ...protocol,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    set((state) => ({
      automatedProtocols: [...state.automatedProtocols, newProtocol]
    }));
  },

  updateAutomatedProtocol: (id, updates) => {
    set((state) => ({
      automatedProtocols: state.automatedProtocols.map(protocol =>
        protocol.id === id
          ? { ...protocol, ...updates, updatedAt: new Date().toISOString() }
          : protocol
      )
    }));
  },

  deleteAutomatedProtocol: (id) => {
    set((state) => ({
      automatedProtocols: state.automatedProtocols.filter(protocol => protocol.id !== id)
    }));
  },

  toggleProtocol: (id) => {
    set((state) => ({
      automatedProtocols: state.automatedProtocols.map(protocol =>
        protocol.id === id
          ? { ...protocol, isActive: !protocol.isActive, updatedAt: new Date().toISOString() }
          : protocol
      )
    }));
  },

  executeProtocol: (id) => {
    const state = get();
    const protocol = state.automatedProtocols.find(p => p.id === id);
    if (!protocol || !protocol.isActive) return;

    const execution = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: protocol.type,
      parameters: protocol.parameters,
      result: 'success' as const,
      autoGenerated: true
    };

    set((state) => ({
      automatedProtocols: state.automatedProtocols.map(p =>
        p.id === id
          ? {
              ...p,
              history: [...p.history, execution],
              updatedAt: new Date().toISOString()
            }
          : p
      )
    }));
  },

  // Calorie Cycling
  generateCalorieCycle: (protocolId, weeks) => {
    const state = get();
    const protocol = state.automatedProtocols.find(p => p.id === protocolId);
    if (!protocol || protocol.type !== 'calorie-cycling') return;

    const { calorieRange, cyclePattern } = protocol.parameters;
    if (!calorieRange || !cyclePattern) return;

    const days: CalorieCycleDay[] = [];
    const startDate = new Date();
    
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (week * 7) + day);
        
        const cycleIndex = day % cyclePattern.length;
        const cycleType = cyclePattern[cycleIndex];
        
        let calories: number;
        let type: 'high' | 'medium' | 'low';
        
        switch (cycleType) {
          case 1:
            calories = calorieRange.high;
            type = 'high';
            break;
          case 2:
            calories = calorieRange.medium;
            type = 'medium';
            break;
          default:
            calories = calorieRange.low;
            type = 'low';
        }
        
        // Calculate macros (example ratios)
        const protein = Math.round(calories * 0.3 / 4);
        const fat = Math.round(calories * 0.25 / 9);
        const carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);
        
        days.push({
          date: date.toISOString().split('T')[0],
          calories,
          macros: { protein, carbs, fat },
          type,
          completed: false
        });
      }
    }
    
    set((state) => ({
      calorieCycleDays: [...state.calorieCycleDays, ...days]
    }));
  },

  updateCalorieCycleDay: (date, updates) => {
    set((state) => ({
      calorieCycleDays: state.calorieCycleDays.map(day =>
        day.date === date ? { ...day, ...updates } : day
      )
    }));
  },

  // Cardio Programming
  generateCardioSessions: (protocolId, weeks) => {
    const state = get();
    const protocol = state.automatedProtocols.find(p => p.id === protocolId);
    if (!protocol || protocol.type !== 'cardio-programming') return;

    const { cardioProgression } = protocol.parameters;
    if (!cardioProgression) return;

    const sessions: CardioSession[] = [];
    const startDate = new Date();
    
    for (let week = 0; week < weeks; week++) {
      const weeklyDuration = Math.min(
        cardioProgression.startDuration + (week * cardioProgression.weeklyIncrease),
        cardioProgression.maxDuration
      );
      
      // Generate 5 sessions per week (Mon-Fri)
      for (let day = 0; day < 5; day++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (week * 7) + day);
        
        const intensityIndex = day % cardioProgression.intensityLevels.length;
        const intensity = cardioProgression.intensityLevels[intensityIndex];
        
        sessions.push({
          id: `${protocolId}-${week}-${day}`,
          date: date.toISOString().split('T')[0],
          type: intensity === 'high' ? 'hiit' : 'steady-state',
          duration: weeklyDuration,
          intensity,
          completed: false
        });
      }
    }
    
    set((state) => ({
      cardioSessions: [...state.cardioSessions, ...sessions]
    }));
  },

  updateCardioSession: (id, updates) => {
    set((state) => ({
      cardioSessions: state.cardioSessions.map(session =>
        session.id === id ? { ...session, ...updates } : session
      )
    }));
  },

  // Supplement Reminders
  generateSupplementReminders: (protocolId, days) => {
    const state = get();
    const protocol = state.automatedProtocols.find(p => p.id === protocolId);
    if (!protocol || protocol.type !== 'supplement-timing') return;

    const { supplementSchedule } = protocol.parameters;
    if (!supplementSchedule) return;

    const reminders: SupplementReminder[] = [];
    const startDate = new Date();
    
    for (let day = 0; day < days; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);
      const dateStr = date.toISOString().split('T')[0];
      
      supplementSchedule.forEach((supplement, index) => {
        supplement.timing.forEach((time, timeIndex) => {
          reminders.push({
            id: `${protocolId}-${day}-${index}-${timeIndex}`,
            name: supplement.name,
            dosage: supplement.dosage,
            time,
            taken: false,
            date: dateStr
          });
        });
      });
    }
    
    set((state) => ({
      supplementReminders: [...state.supplementReminders, ...reminders]
    }));
  },

  updateSupplementReminder: (id, updates) => {
    set((state) => ({
      supplementReminders: state.supplementReminders.map(reminder =>
        reminder.id === id ? { ...reminder, ...updates } : reminder
      )
    }));
  },

  // Progress Photo Reminders
  generateProgressPhotoReminders: (protocolId, weeks) => {
    const state = get();
    const protocol = state.automatedProtocols.find(p => p.id === protocolId);
    if (!protocol || protocol.type !== 'progress-photos') return;

    const { photoSettings } = protocol.parameters;
    if (!photoSettings) return;

    const reminders: ProgressPhotoReminder[] = [];
    const startDate = new Date();
    
    for (let week = 0; week < weeks; week++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + (week * 7));
      
      reminders.push({
        id: `${protocolId}-${week}`,
        date: date.toISOString().split('T')[0],
        time: photoSettings.reminderTime,
        poses: photoSettings.poses,
        completed: false
      });
    }
    
    set((state) => ({
      progressPhotoReminders: [...state.progressPhotoReminders, ...reminders]
    }));
  },

  updateProgressPhotoReminder: (id, updates) => {
    set((state) => ({
      progressPhotoReminders: state.progressPhotoReminders.map(reminder =>
        reminder.id === id ? { ...reminder, ...updates } : reminder
      )
    }));
  }
}));