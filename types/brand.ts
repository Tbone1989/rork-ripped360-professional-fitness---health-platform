export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'workout' | 'nutrition' | 'lifestyle' | 'contest' | 'wellness' | 'community' | 'transformation';
  duration: number; // days
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  membershipRequired: boolean;
  membershipTiers: ('free' | 'basic' | 'elite' | 'champion')[];
  rewards: ChallengeReward[];
  participants: number;
  maxParticipants?: number;
  startDate: string;
  endDate: string;
  rules: string[];
  requirements: string[];
  dailyTasks: ChallengeTask[];
  weeklyGoals: string[];
  image: string;
  featured: boolean;
  createdBy: string;
  status: 'upcoming' | 'active' | 'completed';
  category: 'fitness' | 'nutrition' | 'wellness' | 'lifestyle' | 'community';
  tags: string[];
  leaderboard?: ChallengeLeaderboard[];
  communityFeatures: {
    forum: boolean;
    photoSharing: boolean;
    progressTracking: boolean;
    teamChallenges: boolean;
  };
}

export interface ChallengeReward {
  id: string;
  type: 'product' | 'discount' | 'badge' | 'points' | 'exclusive-access' | 'coaching-session';
  value: string | number;
  description: string;
  image?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockCondition: string;
}

export interface ChallengeTask {
  id: string;
  day: number;
  title: string;
  description: string;
  type: 'workout' | 'nutrition' | 'wellness' | 'education' | 'community';
  duration?: number; // in minutes
  completed: boolean;
  points: number;
}

export interface ChallengeLeaderboard {
  userId: string;
  username: string;
  avatar?: string;
  points: number;
  rank: number;
  completedTasks: number;
  streak: number;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  exclusiveProducts: string[];
  challengeAccess: string[];
  coachingAccess: boolean;
  discountPercentage: number;
  color: string;
  popular: boolean;
}

export interface AffiliateProgram {
  id: string;
  name: string;
  description: string;
  commissionRate: number;
  minimumPayout: number;
  cookieDuration: number; // days
  productCategories: string[];
  bonusStructure: CommissionBonus[];
  requirements: string[];
}

export interface CommissionBonus {
  threshold: number;
  bonusRate: number;
  description: string;
}

export interface BrandedGuide {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'training' | 'lifestyle' | 'contest-prep';
  membershipRequired: boolean;
  price?: number;
  pages: number;
  downloadCount: number;
  rating: number;
  reviewCount: number;
  image: string;
  previewImages: string[];
  tags: string[];
  author: string;
  publishedAt: string;
  featured: boolean;
}

export interface ExclusiveGear {
  id: string;
  productId: string;
  membershipTier: string;
  limitedEdition: boolean;
  quantityLimit?: number;
  releaseDate: string;
  exclusivityPeriod: number; // days
  memberPrice: number;
  regularPrice: number;
  description: string;
}

export interface UserMembership {
  id: string;
  userId: string;
  tier: MembershipTier;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  autoRenew: boolean;
  paymentMethod: string;
}