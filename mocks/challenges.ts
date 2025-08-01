import { Challenge, MembershipTier, BrandedGuide, ExclusiveGear, AffiliateProgram } from '@/types/brand';

export const membershipTiers: MembershipTier[] = [
  {
    id: 'basic',
    name: 'Ripped City Basic',
    price: 19.99,
    billingCycle: 'monthly',
    features: [
      'Access to basic workout plans',
      'Nutrition tracking',
      'Community forum access',
      '5% discount on all products'
    ],
    exclusiveProducts: [],
    challengeAccess: ['public'],
    coachingAccess: false,
    discountPercentage: 5,
    color: '#4CAF50',
    popular: false,
  },
  {
    id: 'elite',
    name: 'Ripped City Elite',
    price: 39.99,
    billingCycle: 'monthly',
    features: [
      'All Basic features',
      'Exclusive member challenges',
      'Premium workout plans',
      'Direct coach messaging',
      '15% discount on all products',
      'Early access to new gear',
      'Monthly exclusive content'
    ],
    exclusiveProducts: ['elite-gear'],
    challengeAccess: ['public', 'elite'],
    coachingAccess: true,
    discountPercentage: 15,
    color: '#E53935',
    popular: true,
  },
  {
    id: 'champion',
    name: 'Ripped City Champion',
    price: 79.99,
    billingCycle: 'monthly',
    features: [
      'All Elite features',
      'Contest prep coaching',
      'Personalized meal plans',
      '1-on-1 video calls with coaches',
      '25% discount on all products',
      'Limited edition gear access',
      'Priority customer support',
      'Exclusive events access'
    ],
    exclusiveProducts: ['elite-gear', 'champion-exclusive'],
    challengeAccess: ['public', 'elite', 'champion'],
    coachingAccess: true,
    discountPercentage: 25,
    color: '#FFD700',
    popular: false,
  },
];

export const challenges: Challenge[] = [
  {
    id: '1',
    title: '30-Day Ripped Transformation',
    description: 'Transform your physique in 30 days with our signature workout and nutrition protocol. Exclusive to Elite and Champion members.',
    type: 'transformation',
    duration: 30,
    difficulty: 'intermediate',
    membershipRequired: true,
    membershipTiers: ['elite', 'champion'],
    rewards: [
      {
        id: '1',
        type: 'product',
        value: 'Exclusive Ripped City Champion T-Shirt',
        description: 'Limited edition t-shirt for challenge completers',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=300',
        tier: 'gold',
        unlockCondition: 'Complete 100% of daily tasks'
      },
      {
        id: '2',
        type: 'discount',
        value: 30,
        description: '30% off next purchase',
        tier: 'silver',
        unlockCondition: 'Complete 80% of daily tasks'
      }
    ],
    participants: 1247,
    maxParticipants: 2000,
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-03-02T23:59:59Z',
    rules: [
      'Complete daily workout assignments',
      'Log meals in the app daily',
      'Submit weekly progress photos',
      'Participate in community discussions'
    ],
    requirements: [
      'Elite or Champion membership',
      'Complete health screening',
      'Commit to daily check-ins'
    ],
    dailyTasks: [
      {
        id: 't1',
        day: 1,
        title: 'Foundation Workout',
        description: 'Complete the baseline strength assessment workout',
        type: 'workout',
        duration: 45,
        completed: false,
        points: 100
      },
      {
        id: 't2',
        day: 1,
        title: 'Nutrition Setup',
        description: 'Log your first day of meals and set macro targets',
        type: 'nutrition',
        completed: false,
        points: 50
      }
    ],
    weeklyGoals: [
      'Complete 6/7 daily workouts',
      'Hit macro targets 5/7 days',
      'Submit progress photos',
      'Engage in community forum'
    ],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500',
    featured: true,
    createdBy: 'Ripped City Coaching Team',
    status: 'active',
    category: 'fitness',
    tags: ['transformation', 'strength', 'nutrition', 'community'],
    communityFeatures: {
      forum: true,
      photoSharing: true,
      progressTracking: true,
      teamChallenges: false
    }
  },
  {
    id: '2',
    title: 'Contest Prep Intensive',
    description: 'Elite 12-week contest preparation program. Champion members only. Includes personalized coaching and peak week protocols.',
    type: 'contest',
    duration: 84,
    difficulty: 'advanced',
    membershipRequired: true,
    membershipTiers: ['champion'],
    rewards: [
      {
        id: '3',
        type: 'product',
        value: 'Contest Prep Survival Kit',
        description: 'Complete kit with posing trunks, tanning supplies, and more',
        tier: 'platinum',
        unlockCondition: 'Complete full 12-week program'
      },
      {
        id: '4',
        type: 'badge',
        value: 'Contest Ready Champion',
        description: 'Exclusive digital badge and certificate',
        tier: 'gold',
        unlockCondition: 'Complete peak week protocol'
      }
    ],
    participants: 89,
    maxParticipants: 100,
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-04-08T23:59:59Z',
    rules: [
      'Champion membership required',
      'Weekly check-ins with assigned coach',
      'Follow prescribed nutrition and training plan',
      'Submit weekly progress photos and measurements'
    ],
    requirements: [
      'Champion membership active',
      'Previous contest experience preferred',
      'Medical clearance required',
      'Commit to 12-week timeline'
    ],
    dailyTasks: [
      {
        id: 't3',
        day: 1,
        title: 'Contest Prep Assessment',
        description: 'Complete comprehensive body composition and strength assessment',
        type: 'education',
        duration: 60,
        completed: false,
        points: 150
      }
    ],
    weeklyGoals: [
      'Complete all prescribed workouts',
      'Hit precise macro targets daily',
      'Weekly coach check-in',
      'Progress photo submission'
    ],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500',
    featured: true,
    createdBy: 'Contest Prep Specialists',
    status: 'active',
    category: 'fitness',
    tags: ['contest-prep', 'advanced', 'coaching', 'competition'],
    communityFeatures: {
      forum: true,
      photoSharing: true,
      progressTracking: true,
      teamChallenges: false
    }
  },
  {
    id: '3',
    title: 'Nutrition Mastery Challenge',
    description: 'Learn to master your nutrition with our 21-day intensive program. Open to all members.',
    type: 'nutrition',
    duration: 21,
    difficulty: 'beginner',
    membershipRequired: false,
    membershipTiers: ['free', 'basic', 'elite', 'champion'],
    rewards: [
      {
        id: '5',
        type: 'product',
        value: 'Ripped City Meal Prep Containers Set',
        description: 'Premium glass meal prep containers',
        tier: 'gold',
        unlockCondition: 'Complete all 21 days'
      },
      {
        id: '6',
        type: 'discount',
        value: 20,
        description: '20% off nutrition supplements',
        tier: 'silver',
        unlockCondition: 'Complete 15+ days'
      }
    ],
    participants: 2156,
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-21T23:59:59Z',
    rules: [
      'Log all meals daily',
      'Complete daily nutrition lessons',
      'Share one healthy recipe per week',
      'Participate in weekly group discussions'
    ],
    requirements: [
      'Download the Ripped City app',
      'Create nutrition profile',
      'Commit to daily logging'
    ],
    dailyTasks: [
      {
        id: 't4',
        day: 1,
        title: 'Nutrition Fundamentals',
        description: 'Learn about macronutrients and set your daily targets',
        type: 'education',
        duration: 20,
        completed: false,
        points: 75
      }
    ],
    weeklyGoals: [
      'Log meals 6/7 days',
      'Complete educational modules',
      'Share healthy recipe',
      'Engage in community discussions'
    ],
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=500',
    featured: false,
    createdBy: 'Ripped City Nutritionists',
    status: 'completed',
    category: 'nutrition',
    tags: ['nutrition', 'education', 'meal-prep', 'community'],
    communityFeatures: {
      forum: true,
      photoSharing: true,
      progressTracking: true,
      teamChallenges: true
    }
  },
  {
    id: '4',
    title: 'Beginner Fitness Journey',
    description: 'Perfect for fitness newcomers! 14-day introduction to exercise and healthy habits. Free for all users.',
    type: 'workout',
    duration: 14,
    difficulty: 'beginner',
    membershipRequired: false,
    membershipTiers: ['free', 'basic', 'elite', 'champion'],
    rewards: [
      {
        id: '7',
        type: 'badge',
        value: 'Fitness Starter',
        description: 'Your first step into fitness excellence',
        tier: 'bronze',
        unlockCondition: 'Complete 10+ daily tasks'
      },
      {
        id: '8',
        type: 'points',
        value: 500,
        description: '500 bonus points for completion',
        tier: 'bronze',
        unlockCondition: 'Complete all 14 days'
      }
    ],
    participants: 5432,
    startDate: '2024-02-15T00:00:00Z',
    endDate: '2024-02-28T23:59:59Z',
    rules: [
      'Complete daily 15-minute workouts',
      'Track water intake',
      'Log basic meals',
      'Read daily fitness tips'
    ],
    requirements: [
      'Create free account',
      'Complete basic health questionnaire'
    ],
    dailyTasks: [
      {
        id: 't5',
        day: 1,
        title: 'Welcome Workout',
        description: 'Gentle 15-minute full-body introduction',
        type: 'workout',
        duration: 15,
        completed: false,
        points: 25
      },
      {
        id: 't6',
        day: 1,
        title: 'Hydration Goal',
        description: 'Drink 8 glasses of water today',
        type: 'wellness',
        completed: false,
        points: 15
      }
    ],
    weeklyGoals: [
      'Complete 5/7 daily workouts',
      'Track meals 4/7 days',
      'Meet hydration goals',
      'Read all educational content'
    ],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500',
    featured: true,
    createdBy: 'Ripped City Beginner Team',
    status: 'active',
    category: 'fitness',
    tags: ['beginner', 'introduction', 'habits', 'free'],
    communityFeatures: {
      forum: true,
      photoSharing: false,
      progressTracking: true,
      teamChallenges: true
    }
  },
  {
    id: '5',
    title: 'Wellness Warriors',
    description: '30-day holistic wellness challenge focusing on sleep, stress, and recovery. All levels welcome.',
    type: 'wellness',
    duration: 30,
    difficulty: 'all-levels',
    membershipRequired: false,
    membershipTiers: ['free', 'basic', 'elite', 'champion'],
    rewards: [
      {
        id: '9',
        type: 'exclusive-access',
        value: 'Wellness Masterclass Series',
        description: 'Access to 6-part wellness masterclass',
        tier: 'gold',
        unlockCondition: 'Complete 25+ days'
      },
      {
        id: '10',
        type: 'product',
        value: 'Wellness Tracking Journal',
        description: 'Premium wellness and recovery journal',
        tier: 'silver',
        unlockCondition: 'Complete 20+ days'
      }
    ],
    participants: 3421,
    startDate: '2024-03-01T00:00:00Z',
    endDate: '2024-03-30T23:59:59Z',
    rules: [
      'Track sleep quality daily',
      'Complete stress management activities',
      'Log recovery metrics',
      'Practice mindfulness exercises'
    ],
    requirements: [
      'Commit to daily wellness tracking',
      'Complete wellness assessment'
    ],
    dailyTasks: [
      {
        id: 't7',
        day: 1,
        title: 'Sleep Optimization',
        description: 'Set up your sleep environment and track tonight\'s sleep',
        type: 'wellness',
        duration: 10,
        completed: false,
        points: 40
      },
      {
        id: 't8',
        day: 1,
        title: 'Stress Check-in',
        description: 'Complete stress level assessment and breathing exercise',
        type: 'wellness',
        duration: 15,
        completed: false,
        points: 35
      }
    ],
    weeklyGoals: [
      'Track sleep 6/7 nights',
      'Complete stress activities daily',
      'Log recovery metrics',
      'Practice mindfulness 5/7 days'
    ],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=500',
    featured: false,
    createdBy: 'Ripped City Wellness Team',
    status: 'upcoming',
    category: 'wellness',
    tags: ['wellness', 'sleep', 'stress', 'recovery', 'mindfulness'],
    communityFeatures: {
      forum: true,
      photoSharing: false,
      progressTracking: true,
      teamChallenges: true
    }
  },
  {
    id: '6',
    title: 'Community Strength Challenge',
    description: 'Team-based strength building challenge. Form teams of 4 and compete together!',
    type: 'community',
    duration: 21,
    difficulty: 'intermediate',
    membershipRequired: false,
    membershipTiers: ['free', 'basic', 'elite', 'champion'],
    rewards: [
      {
        id: '11',
        type: 'product',
        value: 'Team Champion Gear Set',
        description: 'Matching team t-shirts and accessories',
        tier: 'platinum',
        unlockCondition: 'Top 3 teams overall'
      },
      {
        id: '12',
        type: 'coaching-session',
        value: 'Group Coaching Session',
        description: '60-minute team coaching session',
        tier: 'gold',
        unlockCondition: 'Complete as a full team'
      }
    ],
    participants: 1876,
    maxParticipants: 2000,
    startDate: '2024-04-01T00:00:00Z',
    endDate: '2024-04-21T23:59:59Z',
    rules: [
      'Form teams of exactly 4 members',
      'All team members must complete daily workouts',
      'Support teammates in community forum',
      'Submit team progress photos weekly'
    ],
    requirements: [
      'Find 3 teammates to join your team',
      'All team members must be active users',
      'Commit to team accountability'
    ],
    dailyTasks: [
      {
        id: 't9',
        day: 1,
        title: 'Team Formation',
        description: 'Create or join a team and introduce yourselves',
        type: 'community',
        duration: 20,
        completed: false,
        points: 60
      },
      {
        id: 't10',
        day: 1,
        title: 'Baseline Strength Test',
        description: 'Complete team strength assessment',
        type: 'workout',
        duration: 30,
        completed: false,
        points: 80
      }
    ],
    weeklyGoals: [
      'All team members complete 6/7 workouts',
      'Team check-in and motivation',
      'Submit team progress photo',
      'Support other teams in forum'
    ],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500',
    featured: true,
    createdBy: 'Ripped City Community Team',
    status: 'upcoming',
    category: 'community',
    tags: ['community', 'teams', 'strength', 'accountability'],
    leaderboard: [
      {
        userId: 'team1',
        username: 'Iron Warriors',
        points: 2450,
        rank: 1,
        completedTasks: 84,
        streak: 21
      },
      {
        userId: 'team2',
        username: 'Strength Squad',
        points: 2380,
        rank: 2,
        completedTasks: 82,
        streak: 19
      }
    ],
    communityFeatures: {
      forum: true,
      photoSharing: true,
      progressTracking: true,
      teamChallenges: true
    }
  },
  {
    id: '7',
    title: 'Advanced Athlete Protocol',
    description: 'Elite 8-week training protocol for experienced athletes. Push your limits with advanced techniques.',
    type: 'workout',
    duration: 56,
    difficulty: 'advanced',
    membershipRequired: true,
    membershipTiers: ['elite', 'champion'],
    rewards: [
      {
        id: '13',
        type: 'exclusive-access',
        value: 'Elite Athlete Mentorship',
        description: '3-month mentorship with pro athlete',
        tier: 'platinum',
        unlockCondition: 'Complete full 8-week program with 95%+ compliance'
      },
      {
        id: '14',
        type: 'product',
        value: 'Advanced Training Equipment Kit',
        description: 'Professional-grade training accessories',
        tier: 'gold',
        unlockCondition: 'Complete 7+ weeks'
      }
    ],
    participants: 234,
    maxParticipants: 300,
    startDate: '2024-05-01T00:00:00Z',
    endDate: '2024-06-25T23:59:59Z',
    rules: [
      'Elite or Champion membership required',
      'Complete advanced fitness assessment',
      'Follow precise training protocols',
      'Weekly performance metrics submission'
    ],
    requirements: [
      'Minimum 2 years training experience',
      'Pass advanced fitness assessment',
      'Medical clearance for high-intensity training',
      'Elite or Champion membership'
    ],
    dailyTasks: [
      {
        id: 't11',
        day: 1,
        title: 'Advanced Assessment',
        description: 'Complete comprehensive fitness and movement assessment',
        type: 'education',
        duration: 90,
        completed: false,
        points: 200
      },
      {
        id: 't12',
        day: 1,
        title: 'Protocol Customization',
        description: 'Work with coach to customize your 8-week protocol',
        type: 'education',
        duration: 45,
        completed: false,
        points: 150
      }
    ],
    weeklyGoals: [
      'Complete all prescribed training sessions',
      'Hit performance benchmarks',
      'Submit detailed progress metrics',
      'Attend weekly coaching calls'
    ],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500',
    featured: false,
    createdBy: 'Ripped City Elite Coaches',
    status: 'upcoming',
    category: 'fitness',
    tags: ['advanced', 'elite', 'performance', 'coaching'],
    communityFeatures: {
      forum: true,
      photoSharing: true,
      progressTracking: true,
      teamChallenges: false
    }
  }
];

export const brandedGuides: BrandedGuide[] = [
  {
    id: '1',
    title: 'The Ripped City Elite Training Manual',
    description: 'Comprehensive 180-page training guide featuring advanced techniques used by our champion athletes. Includes video demonstrations and progressive programs.',
    category: 'training',
    membershipRequired: true,
    pages: 180,
    downloadCount: 3247,
    rating: 4.9,
    reviewCount: 456,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=500',
    previewImages: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=300',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300'
    ],
    tags: ['advanced', 'training', 'elite', 'progressive'],
    author: 'Ripped City Master Trainers',
    publishedAt: '2024-01-10T00:00:00Z',
    featured: true,
  },
  {
    id: '2',
    title: 'Contest Prep Nutrition Bible',
    description: 'The ultimate guide to contest preparation nutrition. 120 pages of meal plans, timing strategies, and peak week protocols used by winning competitors.',
    category: 'contest-prep',
    membershipRequired: true,
    price: 29.99,
    pages: 120,
    downloadCount: 1876,
    rating: 4.8,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=500',
    previewImages: [
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=300'
    ],
    tags: ['contest-prep', 'nutrition', 'meal-plans', 'peak-week'],
    author: 'Ripped City Contest Prep Team',
    publishedAt: '2024-01-05T00:00:00Z',
    featured: true,
  },
  {
    id: '3',
    title: 'Ripped City Lifestyle Optimization',
    description: 'Beyond the gym - optimize your entire lifestyle for maximum results. Covers sleep, stress management, supplementation, and daily habits.',
    category: 'lifestyle',
    membershipRequired: false,
    price: 19.99,
    pages: 95,
    downloadCount: 5432,
    rating: 4.7,
    reviewCount: 678,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=500',
    previewImages: [],
    tags: ['lifestyle', 'optimization', 'habits', 'wellness'],
    author: 'Ripped City Wellness Team',
    publishedAt: '2023-12-15T00:00:00Z',
    featured: false,
  },
];

export const exclusiveGear: ExclusiveGear[] = [
  {
    id: '1',
    productId: 'exclusive-1',
    membershipTier: 'elite',
    limitedEdition: true,
    quantityLimit: 500,
    releaseDate: '2024-02-01T00:00:00Z',
    exclusivityPeriod: 30,
    memberPrice: 45.99,
    regularPrice: 65.99,
    description: 'Limited edition Elite member hoodie with premium embroidery and exclusive colorway.',
  },
  {
    id: '2',
    productId: 'exclusive-2',
    membershipTier: 'champion',
    limitedEdition: true,
    quantityLimit: 100,
    releaseDate: '2024-01-15T00:00:00Z',
    exclusivityPeriod: 60,
    memberPrice: 89.99,
    regularPrice: 129.99,
    description: 'Champion-exclusive training jacket with advanced moisture-wicking technology.',
  },
];

export const affiliateProgram: AffiliateProgram = {
  id: '1',
  name: 'Ripped City Partner Program',
  description: 'Earn commissions by promoting Ripped City Inc. products and services. Perfect for fitness influencers, trainers, and brand ambassadors.',
  commissionRate: 15,
  minimumPayout: 50,
  cookieDuration: 30,
  productCategories: ['clothing', 'accessories', 'ebooks', 'memberships'],
  bonusStructure: [
    {
      threshold: 1000,
      bonusRate: 2,
      description: '2% bonus for $1000+ monthly sales'
    },
    {
      threshold: 2500,
      bonusRate: 5,
      description: '5% bonus for $2500+ monthly sales'
    },
    {
      threshold: 5000,
      bonusRate: 10,
      description: '10% bonus for $5000+ monthly sales'
    }
  ],
  requirements: [
    'Active social media presence',
    'Alignment with Ripped City brand values',
    'Minimum 1000 followers/subscribers',
    'Regular content creation'
  ]
};