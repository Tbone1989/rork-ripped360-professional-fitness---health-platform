import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Challenge, MembershipTier, BrandedGuide, ExclusiveGear, UserMembership } from '@/types/brand';
import { challenges, membershipTiers, brandedGuides, exclusiveGear } from '@/mocks/challenges';

interface BrandState {
  // Challenges
  challenges: Challenge[];
  userChallenges: string[];
  activeChallenges: Challenge[];
  
  // Membership
  membershipTiers: MembershipTier[];
  userMembership: UserMembership | null;
  
  // Guides
  brandedGuides: BrandedGuide[];
  purchasedGuides: string[];
  
  // Exclusive Gear
  exclusiveGear: ExclusiveGear[];
  
  // Actions
  joinChallenge: (challengeId: string) => void;
  leaveChallenge: (challengeId: string) => void;
  purchaseGuide: (guideId: string) => void;
  setUserMembership: (membership: UserMembership) => void;
  getActiveChallenges: () => Challenge[];
  getAvailableGuides: () => BrandedGuide[];
  getExclusiveGearForTier: (tier: string) => ExclusiveGear[];
  getMemberDiscount: () => number;
  canAccessChallenge: (challenge: Challenge) => boolean;
  canAccessGuide: (guide: BrandedGuide) => boolean;
}

export const useBrandStore = create<BrandState>()(persist(
  (set, get) => ({
    challenges,
    userChallenges: [],
    activeChallenges: [],
    membershipTiers,
    userMembership: null,
    brandedGuides,
    purchasedGuides: [],
    exclusiveGear,
    
    joinChallenge: (challengeId: string) => {
      const { userChallenges, challenges } = get();
      const challenge = challenges.find(c => c.id === challengeId);
      
      if (challenge && !userChallenges.includes(challengeId)) {
        set({
          userChallenges: [...userChallenges, challengeId],
          challenges: challenges.map(c => 
            c.id === challengeId 
              ? { ...c, participants: c.participants + 1 }
              : c
          )
        });
      }
    },
    
    leaveChallenge: (challengeId: string) => {
      const { userChallenges, challenges } = get();
      
      set({
        userChallenges: userChallenges.filter(id => id !== challengeId),
        challenges: challenges.map(c => 
          c.id === challengeId 
            ? { ...c, participants: Math.max(0, c.participants - 1) }
            : c
        )
      });
    },
    
    purchaseGuide: (guideId: string) => {
      const { purchasedGuides } = get();
      
      if (!purchasedGuides.includes(guideId)) {
        set({
          purchasedGuides: [...purchasedGuides, guideId]
        });
      }
    },
    
    setUserMembership: (membership: UserMembership) => {
      set({ userMembership: membership });
    },
    
    getActiveChallenges: () => {
      const { challenges } = get();
      return challenges.filter(c => c.status === 'active');
    },
    
    getAvailableGuides: () => {
      const { brandedGuides, userMembership } = get();
      
      return brandedGuides.filter(guide => {
        if (!guide.membershipRequired) return true;
        return userMembership && userMembership.status === 'active';
      });
    },
    
    getExclusiveGearForTier: (tier: string) => {
      const { exclusiveGear } = get();
      return exclusiveGear.filter(gear => gear.membershipTier === tier);
    },
    
    getMemberDiscount: () => {
      const { userMembership } = get();
      return userMembership?.tier.discountPercentage || 0;
    },
    
    canAccessChallenge: (challenge: Challenge) => {
      const { userMembership } = get();
      
      if (!challenge.membershipRequired) return true;
      if (!userMembership || userMembership.status !== 'active') return false;
      
      return userMembership.tier.challengeAccess.some(access => 
        challenge.type === access || access === 'public'
      );
    },
    
    canAccessGuide: (guide: BrandedGuide) => {
      const { userMembership, purchasedGuides } = get();
      
      if (purchasedGuides.includes(guide.id)) return true;
      if (!guide.membershipRequired) return true;
      
      return !!(userMembership && userMembership.status === 'active');
    },
  }),
  {
    name: 'brand-store',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
      userChallenges: state.userChallenges,
      userMembership: state.userMembership,
      purchasedGuides: state.purchasedGuides,
    }),
  }
));