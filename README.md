# Mentor Interview Platform - React Native + Supabase

A comprehensive mock interview platform built with React Native (Web + Mobile) and Supabase, enabling candidates to book structured interviews with vetted mentors.

## 🚀 Features

### For Candidates
- Browse and book mentors based on expertise
- 3-round interview package (2 technical + 1 HR)
- LinkedIn profile import
- Resume upload
- Session recordings and feedback
- Final compiled report after all sessions

### For Mentors
- Set availability and pricing
- Manage interview sessions
- Provide structured evaluations
- Earn based on completed sessions
- Level progression system (Bronze/Silver/Gold)
- Recognition badges

### For Admins
- Approve mentors
- Handle disputes
- Manage payouts
- View analytics

## 📋 Tech Stack

- **Framework**: Expo (React Native for Web + Mobile)
- **UI**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payment**: Razorpay (Placeholder integration)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Date/Time**: Luxon
- **Navigation**: Expo Router (File-based routing)

## 🛠️ Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account (free tier)
- Razorpay account (for payments - optional for MVP)
- LinkedIn Developer App (for OAuth - optional for MVP)

## 📦 Installation

### 1. Clone and Install Dependencies

\`\`\`bash
cd mentor-interview-platform
npm install
\`\`\`

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API to get your credentials
3. Run the database migration:
   - Go to SQL Editor in Supabase Dashboard
   - Copy content from `supabase/migrations/001_initial_schema.sql`
   - Execute the SQL

4. Setup Storage Buckets:
   - Go to Storage in Supabase Dashboard
   - Create three buckets:
     - `documents` (for resumes)
     - `recordings` (for session recordings)
     - Make both buckets public or set appropriate policies

### 3. Environment Variables

Create a `.env` file in the root directory:

\`\`\`env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay (Optional - use placeholders for MVP)
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
EXPO_PUBLIC_RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# LinkedIn OAuth (Optional)
EXPO_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id
\`\`\`

### 4. Update Supabase Client

Edit `lib/supabase/client.ts` and replace placeholder values with your actual Supabase credentials (or they'll be loaded from .env)

## 🏃 Running the App

### Development

\`\`\`bash
# Start Expo development server
npm start

# Run on specific platform
npm run web      # Run on web browser
npm run android  # Run on Android
npm run ios      # Run on iOS
\`\`\`

### Building for Production

\`\`\`bash
# Web build
npx expo export --platform web

# Mobile builds (requires EAS)
eas build --platform android
eas build --platform ios
\`\`\`

## 📁 Project Structure

\`\`\`
mentor-interview-platform/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Authentication screens
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── (candidate)/              # Candidate screens
│   │   ├── index.tsx             # Dashboard
│   │   ├── mentors.tsx           # Browse mentors
│   │   ├── sessions.tsx          # View sessions
│   │   └── packages.tsx          # Interview packages
│   ├── (mentor)/                 # Mentor screens
│   │   ├── index.tsx             # Dashboard
│   │   ├── availability.tsx      # Set availability
│   │   ├── sessions.tsx          # Manage sessions
│   │   └── evaluations.tsx       # Submit evaluations
│   ├── (admin)/                  # Admin screens
│   │   ├── index.tsx             # Admin dashboard
│   │   ├── mentors.tsx           # Approve mentors
│   │   └── disputes.tsx          # Handle disputes
│   └── _layout.tsx               # Root layout with auth
├── components/                   # Reusable components
│   ├── common/                   # Shared components
│   ├── candidate/                # Candidate-specific
│   ├── mentor/                   # Mentor-specific
│   └── admin/                    # Admin-specific
├── services/                     # API services
│   ├── auth.service.ts           # Authentication
│   ├── candidate.service.ts      # Candidate operations
│   ├── mentor.service.ts         # Mentor operations
│   ├── payment.service.ts        # Payment handling
│   └── session.service.ts        # Session management
├── lib/                          # Core utilities
│   ├── supabase/
│   │   └── client.ts             # Supabase client
│   ├── types.ts                  # TypeScript types
│   ├── utils.ts                  # Utility functions
│   └── store.ts                  # Zustand state management
├── constants/                    # App constants
│   └── index.ts
├── supabase/
│   └── migrations/               # Database migrations
│       └── 001_initial_schema.sql
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind config
└── babel.config.js               # Babel config
\`\`\`

## 🔐 Authentication Flow

1. **Sign Up**: Users register with email/password and select their role (Candidate/Mentor/Admin)
2. **Profile Setup**: After signup, users are redirected to complete their profile
3. **Role-based Access**: Each role has dedicated screens and permissions
4. **Session Management**: Handled automatically via Supabase Auth

## 💳 Payment Integration (Razorpay)

The payment integration is currently using placeholders. To integrate Razorpay:

1. Sign up at [razorpay.com](https://razorpay.com)
2. Get your API keys from Dashboard
3. Update `services/payment.service.ts`:
   - Implement `createRazorpayOrder()`
   - Implement signature verification
4. Add Razorpay SDK to your app
5. Update environment variables

## 🎯 MVP Features Implemented

✅ Email/Password Authentication  
✅ Role-based access (Candidate, Mentor, Admin)  
✅ Mentor discovery with filters  
✅ Interview package booking flow  
✅ Session scheduling  
✅ Evaluation forms for mentors  
✅ Basic payment structure (escrow model)  
✅ Resume upload  
✅ Supabase database with RLS  
✅ Responsive design (Web + Mobile)  

## 🚧 Post-MVP Enhancements

- [ ] LinkedIn OAuth integration
- [ ] Actual Razorpay payment flow
- [ ] Zoom/Google Meet API integration
- [ ] AI-powered feedback summaries
- [ ] Advanced search and filters
- [ ] In-app notifications
- [ ] Analytics dashboard
- [ ] Mentor badges and leaderboards
- [ ] Subscription packages
- [ ] Recording storage and playback

## 🔧 Configuration

### LinkedIn OAuth Setup

1. Create an app at [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Add redirect URI: `mentorplatform://linkedin-callback`
3. Get Client ID and add to `.env`
4. Implement OAuth flow using `expo-auth-session`

### Razorpay Setup

1. Enable Razorpay in test mode
2. Configure webhooks for payment status
3. Implement escrow release logic after all sessions complete

### Meeting Links

Currently using placeholder meeting links. To integrate:

**Zoom**:
- Get Zoom OAuth credentials
- Use Zoom SDK or API to create meetings
- Store meeting IDs in database

**Google Meet**:
- Use Google Calendar API
- Generate Meet links automatically
- Store in meeting_link field

## 📊 Database Schema

The database includes:
- `profiles` - User base table
- `candidates` - Candidate-specific data
- `mentors` - Mentor profiles and stats
- `mentor_availability` - Time slots
- `interview_packages` - Booking packages
- `interview_sessions` - Individual sessions
- `session_evaluations` - Mentor feedback
- `final_reports` - Compiled reports
- `candidate_reviews` - Candidate ratings
- `notifications` - User notifications
- `disputes` - Dispute management

All tables have Row Level Security (RLS) policies enabled.

## 🛡️ Security

- Row Level Security (RLS) enabled on all tables
- Secure token storage using `expo-secure-store`
- Environment variables for sensitive data
- Payment verification and escrow model
- KYC verification for mentors

## 🤝 Contributing

This is an MVP implementation. To extend:

1. Add new screens in appropriate role folders
2. Create services for new features
3. Update database schema with migrations
4. Add proper error handling and loading states
5. Implement comprehensive tests

## 📝 License

MIT License - feel free to use this as a starting point for your project!

## 🆘 Support

For issues or questions:
1. Check Supabase logs in Dashboard
2. Review Expo logs: `npx expo start --clear`
3. Ensure all environment variables are set
4. Verify database migrations ran successfully

## 🎉 Getting Started Checklist

- [ ] Install dependencies
- [ ] Setup Supabase project
- [ ] Run database migrations
- [ ] Create storage buckets
- [ ] Add environment variables
- [ ] Start development server
- [ ] Create test accounts for each role
- [ ] Test core flows

---

Built with ❤️ using Expo, React Native, and Supabase
