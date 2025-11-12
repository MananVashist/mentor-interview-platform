export type UserRole = 'candidate' | 'mentor' | 'admin';
export type MentorLevel = 'bronze' | 'silver' | 'gold';
export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'pending' | 'held_in_escrow' | 'completed' | 'refunded' | 'partial_refund';
export type InterviewRound = 'round_1' | 'round_2' | 'hr_round';

export interface Profile {
  id: string;
  role: UserRole;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface LinkedInExperience {
  title: string;
  company: string;
  duration: string;
  description?: string;
}

export interface LinkedInEducation {
  school: string;
  degree: string;
  field?: string;
  year?: string;
}

export interface Candidate {
  id: string;
  linkedin_headline?: string;
  linkedin_skills?: string[];
  linkedin_experience?: LinkedInExperience[];
  linkedin_education?: LinkedInEducation[];
  resume_url?: string;
  target_profile?: string;
  created_at: string;
  updated_at: string;
}

export interface Mentor {
  id: string;
  linkedin_data?: any;
  bio?: string;
  expertise_profiles: string[];
  is_hr_mentor: boolean;
  session_price_inr: number;
  total_sessions: number;
  average_rating: number;
  mentor_level: MentorLevel;
  is_approved: boolean;
  kyc_verified: boolean;
  kyc_document_url?: string;
  bank_details?: {
    account_number: string;
    ifsc_code: string;
    account_holder_name: string;
    bank_name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface MentorAvailability {
  id: string;
  mentor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}

export interface InterviewPackage {
  id: string;
  candidate_id: string;
  mentor_id: string;
  target_profile: string;
  total_amount_inr: number;
  platform_fee_inr: number;
  mentor_payout_inr: number;
  payment_status: PaymentStatus;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface InterviewSession {
  id: string;
  package_id: string;
  round: InterviewRound;
  mentor_id: string;
  candidate_id: string;
  scheduled_at?: string;
  duration_minutes: number;
  status: SessionStatus;
  meeting_link?: string;
  recording_url?: string;
  interview_guide_url?: string;
  reschedule_count: number;
  created_at: string;
  updated_at: string;
}

export interface SessionEvaluation {
  id: string;
  session_id: string;
  communication_score?: number;
  problem_solving_score?: number;
  technical_depth_score?: number;
  overall_score?: number;
  strengths?: string;
  areas_for_improvement?: string;
  detailed_feedback?: string;
  created_at: string;
}

export interface FinalReport {
  id: string;
  package_id: string;
  overall_assessment?: string;
  key_strengths?: string[];
  improvement_areas?: string[];
  recommendation?: string;
  generated_at: string;
}

export interface CandidateReview {
  id: string;
  package_id: string;
  candidate_id: string;
  mentor_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  metadata?: any;
  created_at: string;
}

export interface Dispute {
  id: string;
  session_id: string;
  raised_by: string;
  dispute_type: string;
  description: string;
  status: string;
  resolution?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

// Form types
export interface SignUpForm {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
}

export interface SignInForm {
  email: string;
  password: string;
  role: UserRole;
}

export interface CandidateProfileForm {
  linkedin_headline?: string;
  linkedin_skills?: string[];
  target_profile?: string;
}

export interface MentorProfileForm {
  bio?: string;
  expertise_profiles: string[];
  is_hr_mentor: boolean;
  session_price_inr: number;
}

// Combined types for views
export interface MentorWithProfile extends Mentor {
  profile: Profile;
}

export interface SessionWithDetails extends InterviewSession {
  candidate: Candidate & { profile: Profile };
  mentor: Mentor & { profile: Profile };
  evaluation?: SessionEvaluation;
}

export interface PackageWithDetails extends InterviewPackage {
  candidate: Candidate & { profile: Profile };
  mentor: Mentor & { profile: Profile };
  sessions: InterviewSession[];
}
