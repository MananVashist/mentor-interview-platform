export const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RiJIzZKnnM179K';

export const COLORS = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryLight: '#3b82f6',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f8fafc',
  card: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const INTERVIEW_PROFILES = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'DevOps Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'Business Analyst',
  'QA Engineer',
];

export const MENTOR_LEVELS = {
  bronze: {
    label: 'Bronze',
    color: '#cd7f32',
    minSessions: 0,
    maxSessions: 10,
  },
  silver: {
    label: 'Silver',
    color: '#c0c0c0',
    minSessions: 11,
    maxSessions: 50,
  },
  gold: {
    label: 'Gold',
    color: '#ffd700',
    minSessions: 51,
    minRating: 4.5,
  },
};

export const SESSION_DURATION = 45; // minutes
export const FEEDBACK_DURATION = 15; // minutes
export const TOTAL_ROUNDS = 3;
export const MAX_RESCHEDULES = 1;
export const PLATFORM_FEE_PERCENTAGE = 50;

export const DEFAULT_AVAILABILITY = [
  // Weekdays: 8-10 PM
  { day: 1, start: '20:00', end: '22:00' },
  { day: 2, start: '20:00', end: '22:00' },
  { day: 3, start: '20:00', end: '22:00' },
  { day: 4, start: '20:00', end: '22:00' },
  { day: 5, start: '20:00', end: '22:00' },
  // Weekends: 12-5 PM
  { day: 0, start: '12:00', end: '17:00' },
  { day: 6, start: '12:00', end: '17:00' },
];

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const EVALUATION_CRITERIA = [
  {
    key: 'communication_score',
    label: 'Communication',
    description: 'Clarity of expression and articulation',
  },
  {
    key: 'problem_solving_score',
    label: 'Problem Solving',
    description: 'Approach to solving problems',
  },
  {
    key: 'technical_depth_score',
    label: 'Technical Depth',
    description: 'Technical knowledge and understanding',
  },
  {
    key: 'overall_score',
    label: 'Overall',
    description: 'Overall performance',
  },
];

export const APP_CONFIG = {
  supportEmail: 'support@mentorplatform.com',
  linkedInClientId: process.env.EXPO_PUBLIC_LINKEDIN_CLIENT_ID || '',
  linkedInRedirectUri: 'mentorplatform://linkedin-callback',
};
