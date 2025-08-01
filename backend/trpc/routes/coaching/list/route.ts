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
  },
];

export const listCoachesRoute = publicProcedure
  .input(
    z.object({
      specialty: z.string().optional(),
      minRating: z.number().optional(),
      maxRate: z.number().optional(),
      featured: z.boolean().optional(),
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

    return {
      coaches: filteredCoaches,
      total: filteredCoaches.length,
    };
  });

export default listCoachesRoute;