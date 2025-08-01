import { Coach } from '@/types/coaching';

export const featuredCoaches: Coach[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Michael Johnson',
    bio: 'Former Olympic athlete with 15+ years of coaching experience. Specializing in strength and conditioning for athletes of all levels.',
    specialties: ['Strength Training', 'Athletic Performance', 'Olympic Lifting'],
    certifications: [
      {
        id: 'cert1',
        name: 'NSCA Certified Strength and Conditioning Specialist',
        organization: 'National Strength and Conditioning Association',
        year: 2010,
        verified: true,
      },
      {
        id: 'cert2',
        name: 'USA Weightlifting Level 3 Coach',
        organization: 'USA Weightlifting',
        year: 2012,
        verified: true,
      },
    ],
    experience: 15,
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 120,
    availability: [
      {
        day: 'monday',
        slots: [
          { startTime: '09:00', endTime: '10:00', booked: false },
          { startTime: '10:30', endTime: '11:30', booked: true },
          { startTime: '13:00', endTime: '14:00', booked: false },
        ],
      },
      {
        day: 'wednesday',
        slots: [
          { startTime: '09:00', endTime: '10:00', booked: true },
          { startTime: '10:30', endTime: '11:30', booked: false },
          { startTime: '13:00', endTime: '14:00', booked: false },
        ],
      },
      {
        day: 'friday',
        slots: [
          { startTime: '09:00', endTime: '10:00', booked: false },
          { startTime: '10:30', endTime: '11:30', booked: false },
          { startTime: '13:00', endTime: '14:00', booked: true },
        ],
      },
    ],
    profileImageUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=500',
    coverImageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000',
    featured: true,
  },
  {
    id: '2',
    userId: 'user2',
    name: 'Sarah Williams',
    bio: 'CrossFit Games athlete and certified nutrition coach. Passionate about helping clients achieve their fitness goals through functional training and proper nutrition.',
    specialties: ['CrossFit', 'Nutrition', 'Functional Training'],
    certifications: [
      {
        id: 'cert1',
        name: 'CrossFit Level 4 Coach',
        organization: 'CrossFit Inc.',
        year: 2015,
        verified: true,
      },
      {
        id: 'cert2',
        name: 'Precision Nutrition Level 2 Certified',
        organization: 'Precision Nutrition',
        year: 2017,
        verified: true,
      },
    ],
    experience: 8,
    rating: 4.8,
    reviewCount: 93,
    hourlyRate: 100,
    availability: [
      {
        day: 'tuesday',
        slots: [
          { startTime: '07:00', endTime: '08:00', booked: false },
          { startTime: '08:30', endTime: '09:30', booked: true },
          { startTime: '17:00', endTime: '18:00', booked: false },
        ],
      },
      {
        day: 'thursday',
        slots: [
          { startTime: '07:00', endTime: '08:00', booked: true },
          { startTime: '08:30', endTime: '09:30', booked: false },
          { startTime: '17:00', endTime: '18:00', booked: false },
        ],
      },
      {
        day: 'saturday',
        slots: [
          { startTime: '10:00', endTime: '11:00', booked: false },
          { startTime: '11:30', endTime: '12:30', booked: false },
        ],
      },
    ],
    profileImageUrl: 'https://images.unsplash.com/photo-1609952542840-df54cfddc3fb?q=80&w=500',
    coverImageUrl: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=1000',
    featured: true,
  },
  {
    id: '3',
    userId: 'user3',
    name: 'David Chen',
    bio: 'Physical therapist and corrective exercise specialist. Focuses on injury prevention and rehabilitation through proper movement patterns and targeted exercises.',
    specialties: ['Rehabilitation', 'Corrective Exercise', 'Mobility'],
    certifications: [
      {
        id: 'cert1',
        name: 'Doctor of Physical Therapy',
        organization: 'University of California',
        year: 2014,
        verified: true,
      },
      {
        id: 'cert2',
        name: 'Functional Movement Screen Certified',
        organization: 'Functional Movement Systems',
        year: 2016,
        verified: true,
      },
    ],
    experience: 9,
    rating: 4.9,
    reviewCount: 78,
    hourlyRate: 130,
    availability: [
      {
        day: 'monday',
        slots: [
          { startTime: '14:00', endTime: '15:00', booked: false },
          { startTime: '15:30', endTime: '16:30', booked: true },
          { startTime: '17:00', endTime: '18:00', booked: false },
        ],
      },
      {
        day: 'wednesday',
        slots: [
          { startTime: '14:00', endTime: '15:00', booked: false },
          { startTime: '15:30', endTime: '16:30', booked: false },
          { startTime: '17:00', endTime: '18:00', booked: true },
        ],
      },
      {
        day: 'friday',
        slots: [
          { startTime: '14:00', endTime: '15:00', booked: true },
          { startTime: '15:30', endTime: '16:30', booked: false },
          { startTime: '17:00', endTime: '18:00', booked: false },
        ],
      },
    ],
    profileImageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=500',
    coverImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000',
    featured: true,
  },
];

export const coaches: Coach[] = [
  ...featuredCoaches,
];

export const allCoaches: Coach[] = [
  ...featuredCoaches,
  {
    id: '4',
    userId: 'user4',
    name: 'Emily Rodriguez',
    bio: 'Yoga instructor and mindfulness coach with a focus on holistic wellness. Helps clients find balance through movement, breath, and meditation.',
    specialties: ['Yoga', 'Meditation', 'Stress Management'],
    certifications: [
      {
        id: 'cert1',
        name: '500-Hour Registered Yoga Teacher',
        organization: 'Yoga Alliance',
        year: 2018,
        verified: true,
      },
      {
        id: 'cert2',
        name: 'Mindfulness-Based Stress Reduction Instructor',
        organization: 'Center for Mindfulness',
        year: 2019,
        verified: true,
      },
    ],
    experience: 6,
    rating: 4.7,
    reviewCount: 62,
    hourlyRate: 90,
    availability: [
      {
        day: 'tuesday',
        slots: [
          { startTime: '10:00', endTime: '11:00', booked: false },
          { startTime: '11:30', endTime: '12:30', booked: false },
          { startTime: '16:00', endTime: '17:00', booked: true },
        ],
      },
      {
        day: 'thursday',
        slots: [
          { startTime: '10:00', endTime: '11:00', booked: true },
          { startTime: '11:30', endTime: '12:30', booked: false },
          { startTime: '16:00', endTime: '17:00', booked: false },
        ],
      },
      {
        day: 'sunday',
        slots: [
          { startTime: '09:00', endTime: '10:00', booked: false },
          { startTime: '10:30', endTime: '11:30', booked: false },
        ],
      },
    ],
    profileImageUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=500',
    coverImageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=1000',
  },
  {
    id: '5',
    userId: 'user5',
    name: 'James Wilson',
    bio: 'Bodybuilding coach and competition prep specialist. Expert in physique transformation and contest preparation for natural bodybuilders.',
    specialties: ['Bodybuilding', 'Contest Prep', 'Hypertrophy Training'],
    certifications: [
      {
        id: 'cert1',
        name: 'IFBB Professional Bodybuilder',
        organization: 'International Federation of Bodybuilding',
        year: 2013,
        verified: true,
      },
      {
        id: 'cert2',
        name: 'NASM Certified Personal Trainer',
        organization: 'National Academy of Sports Medicine',
        year: 2011,
        verified: true,
      },
    ],
    experience: 12,
    rating: 4.8,
    reviewCount: 85,
    hourlyRate: 110,
    availability: [
      {
        day: 'monday',
        slots: [
          { startTime: '06:00', endTime: '07:00', booked: false },
          { startTime: '07:30', endTime: '08:30', booked: true },
          { startTime: '18:00', endTime: '19:00', booked: false },
        ],
      },
      {
        day: 'wednesday',
        slots: [
          { startTime: '06:00', endTime: '07:00', booked: true },
          { startTime: '07:30', endTime: '08:30', booked: false },
          { startTime: '18:00', endTime: '19:00', booked: false },
        ],
      },
      {
        day: 'friday',
        slots: [
          { startTime: '06:00', endTime: '07:00', booked: false },
          { startTime: '07:30', endTime: '08:30', booked: false },
          { startTime: '18:00', endTime: '19:00', booked: true },
        ],
      },
    ],
    profileImageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=500',
    coverImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000',
  },
];