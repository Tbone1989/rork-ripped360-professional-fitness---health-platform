import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const mockCoaches = [
  {
    id: '1',
    userId: 'user-1',
    name: 'Sarah Johnson',
    bio: 'Certified personal trainer with 8+ years of experience in strength training and nutrition coaching.',
    specialties: ['Strength Training', 'Nutrition', 'Weight Loss'],
    certifications: [
      {
        id: 'cert-1',
        name: 'NASM-CPT',
        organization: 'National Academy of Sports Medicine',
        year: 2018,
        verified: true,
      },
    ],
    experience: 8,
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 85,
    availability: [],
    profileImageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?q=80&w=500',
    featured: true,
    pricingVisibility: 'upfront' as const, // 'upfront' | 'after_engagement' | 'consultation_required'
    pricingNote: 'Transparent pricing - no hidden fees',
    packages: [
      {
        id: 'pkg-1',
        name: '1-on-1 Training Session',
        price: 85,
        duration: 60,
        description: 'Personalized training session with nutrition guidance'
      },
      {
        id: 'pkg-2',
        name: '4-Week Program',
        price: 300,
        duration: 2880, // 4 weeks in minutes
        description: 'Complete 4-week transformation program with meal plans'
      }
    ]
  },
  {
    id: '2',
    userId: 'user-2',
    name: 'Mike Rodriguez',
    bio: 'Former competitive bodybuilder turned coach. Specializing in muscle building and contest prep.',
    specialties: ['Bodybuilding', 'Contest Prep', 'Muscle Building'],
    certifications: [
      {
        id: 'cert-2',
        name: 'IFBB Pro Card',
        organization: 'International Federation of Bodybuilding',
        year: 2015,
        verified: true,
      },
    ],
    experience: 12,
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 120,
    availability: [],
    profileImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=500',
    featured: true,
    pricingVisibility: 'after_engagement' as const,
    pricingNote: 'Pricing discussed after initial consultation to ensure best fit',
    packages: [
      {
        id: 'pkg-3',
        name: 'Contest Prep Consultation',
        price: 0, // Free consultation
        duration: 30,
        description: 'Free 30-minute consultation to discuss your goals'
      }
    ]
  },
  {
    id: '3',
    userId: 'user-3',
    name: 'Jessica Chen',
    bio: 'Registered Dietitian and Certified Strength Coach. Expert in sports nutrition and performance optimization.',
    specialties: ['Sports Nutrition', 'Performance', 'Meal Planning'],
    certifications: [
      {
        id: 'cert-3',
        name: 'RD',
        organization: 'Academy of Nutrition and Dietetics',
        year: 2019,
        verified: true,
      },
      {
        id: 'cert-4',
        name: 'CSCS',
        organization: 'National Strength and Conditioning Association',
        year: 2020,
        verified: true,
      },
    ],
    experience: 6,
    rating: 4.9,
    reviewCount: 156,
    hourlyRate: 95,
    availability: [],
    profileImageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=500',
    featured: false,
    pricingVisibility: 'consultation_required' as const,
    pricingNote: 'Custom pricing based on individual needs and goals',
    packages: [
      {
        id: 'pkg-4',
        name: 'Nutrition Assessment',
        price: 75,
        duration: 45,
        description: 'Comprehensive nutrition assessment and goal setting'
      }
    ]
  },
  {
    id: '4',
    userId: 'user-4',
    name: 'David Thompson',
    bio: 'CrossFit Level 3 Trainer and former military fitness instructor. Specializing in functional fitness and HIIT.',
    specialties: ['CrossFit', 'HIIT', 'Functional Fitness', 'Military Fitness'],
    certifications: [
      {
        id: 'cert-5',
        name: 'CF-L3',
        organization: 'CrossFit Inc.',
        year: 2017,
        verified: true,
      },
    ],
    experience: 10,
    rating: 4.7,
    reviewCount: 203,
    hourlyRate: 75,
    availability: [],
    profileImageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51cd?q=80&w=500',
    featured: true,
    pricingVisibility: 'upfront' as const,
    pricingNote: 'Group and individual rates available',
    packages: [
      {
        id: 'pkg-5',
        name: 'CrossFit Personal Training',
        price: 75,
        duration: 60,
        description: 'One-on-one CrossFit coaching session'
      },
      {
        id: 'pkg-6',
        name: 'Small Group Training (2-4 people)',
        price: 45,
        duration: 60,
        description: 'Per person rate for small group CrossFit sessions'
      }
    ]
  }
];

export const listCoachesRoute = publicProcedure
  .input(
    z.object({
      specialty: z.string().optional(),
      minRating: z.number().optional(),
      maxRate: z.number().optional(),
      featured: z.boolean().optional(),
      pricingVisibility: z.enum(['upfront', 'after_engagement', 'consultation_required']).optional(),
      showPricing: z.boolean().optional(), // For client view - whether they've engaged with coach
    })
  )
  .query(async ({ input }) => {
    let filteredCoaches = [...mockCoaches];

    if (input.specialty) {
      filteredCoaches = filteredCoaches.filter(coach =>
        coach.specialties.some(s => 
          s.toLowerCase().includes(input.specialty!.toLowerCase())
        )
      );
    }

    if (input.minRating) {
      filteredCoaches = filteredCoaches.filter(coach => 
        coach.rating >= input.minRating!
      );
    }

    if (input.maxRate) {
      filteredCoaches = filteredCoaches.filter(coach => 
        coach.hourlyRate <= input.maxRate!
      );
    }

    if (input.featured !== undefined) {
      filteredCoaches = filteredCoaches.filter(coach => 
        coach.featured === input.featured
      );
    }

    if (input.pricingVisibility) {
      filteredCoaches = filteredCoaches.filter(coach => 
        coach.pricingVisibility === input.pricingVisibility
      );
    }

    // Process coaches based on pricing visibility and client engagement
    const processedCoaches = filteredCoaches.map(coach => {
      const shouldShowPricing = 
        coach.pricingVisibility === 'upfront' || 
        (input.showPricing && coach.pricingVisibility === 'after_engagement');

      return {
        ...coach,
        // Hide pricing details if not appropriate to show
        hourlyRate: shouldShowPricing ? coach.hourlyRate : undefined,
        packages: shouldShowPricing ? coach.packages : coach.packages.map(pkg => ({
          ...pkg,
          price: pkg.price === 0 ? 0 : undefined // Keep free consultations visible
        })),
        pricingHidden: !shouldShowPricing,
      };
    });

    return {
      coaches: processedCoaches,
      total: processedCoaches.length,
    };
  });

export default listCoachesRoute;