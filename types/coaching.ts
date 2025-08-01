export interface Coach {
  id: string;
  userId: string;
  name: string;
  bio: string;
  specialties: string[];
  certifications: Certification[];
  experience: number; // in years
  rating: number; // 1-5
  reviewCount: number;
  hourlyRate: number;
  availability: Availability[];
  profileImageUrl: string;
  coverImageUrl?: string;
  featured?: boolean;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  year: number;
  verified: boolean;
}

export interface Availability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  slots: TimeSlot[];
}

export interface TimeSlot {
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  booked: boolean;
}

export interface CoachingSession {
  id: string;
  coachId: string;
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  videoCallUrl?: string;
  price: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface CoachingPlan {
  id: string;
  coachId: string;
  name: string;
  description: string;
  duration: number; // in weeks
  sessionsPerWeek: number;
  price: number;
  features: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachmentUrls?: string[];
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}