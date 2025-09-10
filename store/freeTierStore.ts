import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DailyReward {
  day: number;
  claimed: boolean;
  reward: string;
  icon: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  reward: string;
  icon: string;
}

interface FreeTierLimits {
  workoutsPerWeek: number;
  workoutsUsed: number;
  aiRequestsPerDay: number;
  aiRequestsUsed: number;
  coachMessagesPerMonth: number;
  coachMessagesUsed: number;
  mealPlansPerWeek: number;
  mealPlansUsed: number;
  supplementScansPerDay: number;
  supplementScansUsed: number;
  resetDate: string;
}

interface FreeTierStore {
  // Daily Check-in System
  lastCheckIn: string | null;
  currentStreak: number;
  longestStreak: number;
  dailyRewards: DailyReward[];
  
  // Points & Rewards
  points: number;
  totalPointsEarned: number;
  
  // Achievements
  achievements: Achievement[];
  
  // Usage Limits
  limits: FreeTierLimits;
  
  // Trial Features
  trialFeatures: {
    feature: string;
    expiresAt: string;
    used: boolean;
  }[];
  
  // Referral System
  referralCode: string;
  referrals: number;
  referralRewards: string[];
  
  // Actions
  checkIn: () => Promise<void>;
  addPoints: (amount: number, reason: string) => Promise<void>;
  updateAchievement: (id: string, progress: number) => Promise<void>;
  useFeature: (feature: keyof FreeTierLimits) => Promise<boolean>;
  resetDailyLimits: () => Promise<void>;
  resetWeeklyLimits: () => Promise<void>;
  activateTrialFeature: (feature: string, days: number) => Promise<void>;
  addReferral: () => Promise<void>;
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
}

const STORAGE_KEY = 'free_tier_data';

const initialAchievements: Achievement[] = [
  {
    id: 'first_workout',
    title: 'First Steps',
    description: 'Complete your first workout',
    progress: 0,
    target: 1,
    completed: false,
    reward: '50 points + 1 day premium trial',
    icon: '🏃'
  },
  {
    id: 'week_streak',
    title: 'Consistent Week',
    description: 'Check in for 7 days straight',
    progress: 0,
    target: 7,
    completed: false,
    reward: '100 points + AI Form Check trial',
    icon: '🔥'
  },
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Share 5 achievements',
    progress: 0,
    target: 5,
    completed: false,
    reward: '75 points + Extra workout slot',
    icon: '🦋'
  },
  {
    id: 'meal_logger',
    title: 'Nutrition Tracker',
    description: 'Log 10 meals',
    progress: 0,
    target: 10,
    completed: false,
    reward: '60 points + Meal plan template',
    icon: '🥗'
  },
  {
    id: 'community_helper',
    title: 'Community Helper',
    description: 'Answer 5 community questions',
    progress: 0,
    target: 5,
    completed: false,
    reward: '80 points + Coach message credit',
    icon: '💬'
  },
  {
    id: 'referral_master',
    title: 'Referral Master',
    description: 'Refer 3 friends',
    progress: 0,
    target: 3,
    completed: false,
    reward: '200 points + 1 week premium',
    icon: '👥'
  }
];

const generateDailyRewards = (): DailyReward[] => {
  return [
    { day: 1, claimed: false, reward: '10 points', icon: '⭐' },
    { day: 2, claimed: false, reward: '15 points', icon: '⭐' },
    { day: 3, claimed: false, reward: '20 points + Extra workout', icon: '💪' },
    { day: 4, claimed: false, reward: '25 points', icon: '⭐' },
    { day: 5, claimed: false, reward: '30 points + AI request', icon: '🤖' },
    { day: 6, claimed: false, reward: '35 points', icon: '⭐' },
    { day: 7, claimed: false, reward: '50 points + 1 day premium trial', icon: '👑' }
  ];
};

export const useFreeTierStore = create<FreeTierStore>((set, get) => ({
  lastCheckIn: null,
  currentStreak: 0,
  longestStreak: 0,
  dailyRewards: generateDailyRewards(),
  points: 0,
  totalPointsEarned: 0,
  achievements: initialAchievements,
  limits: {
    workoutsPerWeek: 3,
    workoutsUsed: 0,
    aiRequestsPerDay: 2,
    aiRequestsUsed: 0,
    coachMessagesPerMonth: 1,
    coachMessagesUsed: 0,
    mealPlansPerWeek: 1,
    mealPlansUsed: 0,
    supplementScansPerDay: 3,
    supplementScansUsed: 0,
    resetDate: new Date().toISOString()
  },
  trialFeatures: [],
  referralCode: '',
  referrals: 0,
  referralRewards: [],

  checkIn: async () => {
    const today = new Date().toDateString();
    const state = get();
    
    if (state.lastCheckIn === today) {
      return; // Already checked in today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasYesterday = state.lastCheckIn === yesterday.toDateString();

    const newStreak = wasYesterday ? state.currentStreak + 1 : 1;
    const dayIndex = (newStreak - 1) % 7;
    const rewards = [...state.dailyRewards];
    
    if (dayIndex < rewards.length) {
      rewards[dayIndex].claimed = true;
      
      // Parse and add points from reward
      const pointsMatch = rewards[dayIndex].reward.match(/(\d+) points/);
      if (pointsMatch) {
        const points = parseInt(pointsMatch[1]);
        await get().addPoints(points, 'Daily check-in');
      }
      
      // Handle special rewards
      if (rewards[dayIndex].reward.includes('Extra workout')) {
        set(state => ({
          limits: { ...state.limits, workoutsPerWeek: state.limits.workoutsPerWeek + 1 }
        }));
      }
      if (rewards[dayIndex].reward.includes('AI request')) {
        set(state => ({
          limits: { ...state.limits, aiRequestsPerDay: state.limits.aiRequestsPerDay + 1 }
        }));
      }
      if (rewards[dayIndex].reward.includes('premium trial')) {
        await get().activateTrialFeature('premium', 1);
      }
    }

    // Reset rewards if completed a week
    if (newStreak % 7 === 0) {
      rewards.forEach(r => r.claimed = false);
    }

    set({
      lastCheckIn: today,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, state.longestStreak),
      dailyRewards: rewards
    });

    // Update streak achievement
    if (newStreak >= 7) {
      await get().updateAchievement('week_streak', newStreak);
    }

    await get().saveData();
  },

  addPoints: async (amount: number, reason: string) => {
    set(state => ({
      points: state.points + amount,
      totalPointsEarned: state.totalPointsEarned + amount
    }));
    await get().saveData();
  },

  updateAchievement: async (id: string, progress: number) => {
    const achievements = [...get().achievements];
    const achievement = achievements.find(a => a.id === id);
    
    if (achievement && !achievement.completed) {
      achievement.progress = Math.min(progress, achievement.target);
      
      if (achievement.progress >= achievement.target) {
        achievement.completed = true;
        
        // Parse and add points from reward
        const pointsMatch = achievement.reward.match(/(\d+) points/);
        if (pointsMatch) {
          const points = parseInt(pointsMatch[1]);
          await get().addPoints(points, `Achievement: ${achievement.title}`);
        }
      }
      
      set({ achievements });
      await get().saveData();
    }
  },

  useFeature: async (feature: keyof FreeTierLimits) => {
    const limits = { ...get().limits };
    const now = new Date();
    
    // Check if limits need reset
    const resetDate = new Date(limits.resetDate);
    const daysDiff = Math.floor((now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Reset daily limits
    if (daysDiff >= 1 && (feature === 'aiRequestsPerDay' || feature === 'supplementScansPerDay')) {
      limits.aiRequestsUsed = 0;
      limits.supplementScansUsed = 0;
      limits.resetDate = now.toISOString();
    }
    
    // Reset weekly limits
    if (daysDiff >= 7 && (feature === 'workoutsPerWeek' || feature === 'mealPlansPerWeek')) {
      limits.workoutsUsed = 0;
      limits.mealPlansUsed = 0;
      limits.resetDate = now.toISOString();
    }
    
    // Reset monthly limits
    if (daysDiff >= 30 && feature === 'coachMessagesPerMonth') {
      limits.coachMessagesUsed = 0;
      limits.resetDate = now.toISOString();
    }
    
    // Check if feature can be used
    const limitKey = feature.replace('Used', '') as keyof FreeTierLimits;
    const usedKey = feature.includes('Used') ? feature : `${feature}Used` as keyof FreeTierLimits;
    
    if ((limits[usedKey] as number) < (limits[limitKey] as number)) {
      (limits[usedKey] as number)++;
      set({ limits });
      await get().saveData();
      return true;
    }
    
    return false;
  },

  resetDailyLimits: async () => {
    set(state => ({
      limits: {
        ...state.limits,
        aiRequestsUsed: 0,
        supplementScansUsed: 0,
        resetDate: new Date().toISOString()
      }
    }));
    await get().saveData();
  },

  resetWeeklyLimits: async () => {
    set(state => ({
      limits: {
        ...state.limits,
        workoutsUsed: 0,
        mealPlansUsed: 0,
        resetDate: new Date().toISOString()
      }
    }));
    await get().saveData();
  },

  activateTrialFeature: async (feature: string, days: number) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
    
    set(state => ({
      trialFeatures: [
        ...state.trialFeatures,
        {
          feature,
          expiresAt: expiresAt.toISOString(),
          used: false
        }
      ]
    }));
    await get().saveData();
  },

  addReferral: async () => {
    const referrals = get().referrals + 1;
    const rewards = [...get().referralRewards];
    
    // Add rewards based on referral count
    if (referrals === 1) {
      rewards.push('50 points + 3 day premium trial');
      await get().addPoints(50, 'First referral');
      await get().activateTrialFeature('premium', 3);
    } else if (referrals === 3) {
      rewards.push('200 points + 1 week premium');
      await get().addPoints(200, 'Referral milestone');
      await get().activateTrialFeature('premium', 7);
      await get().updateAchievement('referral_master', 3);
    } else if (referrals === 5) {
      rewards.push('500 points + 1 month 50% off');
      await get().addPoints(500, 'Super referrer');
    }
    
    set({ referrals, referralRewards: rewards });
    await get().saveData();
  },

  loadData: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set(parsed);
      } else {
        // Generate unique referral code for new users
        const code = `FIT${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        set({ referralCode: code });
      }
    } catch (error) {
      console.error('Error loading free tier data:', error);
    }
  },

  saveData: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        lastCheckIn: state.lastCheckIn,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        dailyRewards: state.dailyRewards,
        points: state.points,
        totalPointsEarned: state.totalPointsEarned,
        achievements: state.achievements,
        limits: state.limits,
        trialFeatures: state.trialFeatures,
        referralCode: state.referralCode,
        referrals: state.referrals,
        referralRewards: state.referralRewards
      }));
    } catch (error) {
      console.error('Error saving free tier data:', error);
    }
  }
}));