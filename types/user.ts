export interface User {
  id: string;
  email: string;
  name: string;
  profileImageUrl?: string;
  role: 'user' | 'coach' | 'medical' | 'admin';
  createdAt: string;
  lastActive: string;
  preferences: UserPreferences;
  stats: UserStats;
  subscription?: Subscription;
  attachments?: Attachment[];
  coachStatus?: CoachStatus;
  verificationStatus: VerificationStatus;
  legalAgreements: LegalAgreement[];
  productSellingPermission?: ProductSellingPermission;
}

export interface UserPreferences {
  darkMode: boolean;
  notifications: {
    workoutReminders: boolean;
    coachMessages: boolean;
    progressUpdates: boolean;
    medicalAlerts: boolean;
  };
  measurementSystem: 'metric' | 'imperial';
  language: string;
}

export interface UserStats {
  workoutsCompleted: number;
  totalWorkoutTime: number; // in minutes
  streakDays: number;
  longestStreak: number;
  lastWorkout?: string; // date
  favoriteWorkouts: string[]; // workout ids
  favoriteExercises: string[]; // exercise ids
}

export interface Subscription {
  id: string;
  plan: 'free' | 'premium' | 'medical' | 'admin';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod?: string;
}

export interface Attachment {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  visibleToCoaches: boolean;
}

export interface UserGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetDate?: string;
  progress: number; // 0-1
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;
  updatedAt: string;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
}

export interface CoachStatus {
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  applicationDate: string;
  approvalDate?: string;
  monthlyFee: number;
  feeStatus: 'current' | 'overdue' | 'suspended';
  lastPayment?: string;
  nextPayment: string;
  certifications: Certification[];
  backgroundCheck: BackgroundCheck;
  insuranceInfo?: InsuranceInfo;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  verificationStatus: 'pending' | 'verified' | 'expired' | 'invalid';
  documentUrl?: string;
}

export interface BackgroundCheck {
  status: 'pending' | 'passed' | 'failed' | 'expired';
  completedDate?: string;
  expiryDate?: string;
  provider: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  expiryDate: string;
  coverageAmount: number;
  documentUrl?: string;
}

export interface VerificationStatus {
  identity: 'pending' | 'verified' | 'rejected';
  email: 'pending' | 'verified';
  phone: 'pending' | 'verified';
  professional: 'pending' | 'verified' | 'rejected' | 'not_applicable';
}

export interface LegalAgreement {
  id: string;
  type: 'terms_of_service' | 'privacy_policy' | 'medical_disclaimer' | 'coach_agreement' | 'product_selling_agreement';
  version: string;
  acceptedAt: string;
  ipAddress: string;
  userAgent: string;
}

export interface ProductSellingPermission {
  status: 'none' | 'pending' | 'approved' | 'rejected' | 'suspended';
  applicationDate?: string;
  approvalDate?: string;
  monthlyFee: number;
  feeStatus: 'current' | 'overdue' | 'suspended';
  lastPayment?: string;
  nextPayment?: string;
  allowedCategories: string[];
  restrictions: string[];
}

export interface UserIssueReport {
  id: string;
  userId: string;
  type: 'bug' | 'feature_request' | 'content_violation' | 'harassment' | 'spam' | 'other';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: string;
}

export interface VolumeTracking {
  id: string;
  userId: string;
  date: string;
  workoutCount: number;
  messageCount: number;
  uploadCount: number;
  apiCallCount: number;
  sessionDuration: number;
  features: string[];
}