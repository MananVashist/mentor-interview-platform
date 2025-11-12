# Quick Setup Guide

Follow these steps to get your Mentor Interview Platform up and running.

## Step 1: Install Dependencies

\`\`\`bash
cd mentor-interview-platform
npm install
\`\`\`

## Step 2: Setup Supabase

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose organization and set project name
4. Set a strong database password (save it!)
5. Choose region (closest to your target users - India region recommended)
6. Wait for project to be created (~2 minutes)

### 2.2 Get API Credentials
1. In your Supabase project, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under Project URL)
   - **anon public** key (under Project API keys)

### 2.3 Run Database Migration
1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Open `supabase/migrations/001_initial_schema.sql` from your project
4. Copy entire content and paste into SQL Editor
5. Click "Run" - this creates all tables, functions, and policies
6. You should see "Success. No rows returned"

### 2.4 Setup Storage Buckets
1. Go to **Storage** in Supabase Dashboard
2. Click "New bucket"
3. Create bucket named: `documents`
   - Set as **Public bucket** (for now - you can adjust policies later)
4. Create another bucket named: `recordings`
   - Set as **Public bucket**

### 2.5 Configure Environment Variables
1. Copy `.env.example` to `.env`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Edit `.env` and add your Supabase credentials:
   \`\`\`env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-step-2.2
   \`\`\`

## Step 3: Start Development Server

\`\`\`bash
npm start
\`\`\`

This will start the Expo development server. You'll see options to:
- Press `w` to open in web browser
- Press `a` to open on Android (requires emulator or device)
- Press `i` to open on iOS (requires Mac + simulator)

## Step 4: Test the Application

### 4.1 Create Test Accounts

**Candidate Account:**
1. Click "Sign Up"
2. Select "Candidate" role
3. Enter details:
   - Name: Test Candidate
   - Email: candidate@test.com
   - Password: test123
4. Click Sign Up

**Mentor Account:**
1. Sign out and go back to sign up
2. Select "Mentor" role
3. Enter details:
   - Name: Test Mentor
   - Email: mentor@test.com
   - Password: test123
4. Click Sign Up

**Admin Account:**
1. You can create an admin account or manually update a user's role:
   - Go to Supabase → Table Editor → profiles
   - Find a user and change role to 'admin'

### 4.2 Test Core Flows

**As Candidate:**
1. Login with candidate@test.com
2. Complete your profile (add target profile)
3. Upload a resume (use any PDF file for testing)
4. Browse mentors (initially empty - you need to approve mentors)
5. Book an interview package

**As Mentor:**
1. Login with mentor@test.com
2. Complete mentor profile:
   - Add bio
   - Set expertise profiles
   - Set session price (e.g., 500 INR)
   - Set availability
3. Wait for admin approval

**As Admin:**
1. Login with admin account
2. Approve pending mentors
3. View all packages and sessions
4. Handle disputes if any

## Step 5: Optional Integrations

### LinkedIn OAuth (Optional)
1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create an app
3. Add OAuth 2.0 redirect URL: `mentorplatform://linkedin-callback`
4. Get Client ID and add to `.env`

### Razorpay (For Production)
1. Sign up at [razorpay.com](https://razorpay.com)
2. Get test API keys from Dashboard
3. Add keys to `.env`
4. Implement actual payment flow in `services/payment.service.ts`

### Zoom Integration (Optional)
1. Create Zoom app at [marketplace.zoom.us](https://marketplace.zoom.us)
2. Get OAuth credentials
3. Implement meeting creation in session service

## Common Issues & Solutions

### Issue: "Cannot find module '@react-native-async-storage/async-storage'"
**Solution:** Install missing dependency:
\`\`\`bash
npm install @react-native-async-storage/async-storage react-native-url-polyfill
\`\`\`

### Issue: Database migration fails
**Solution:** 
- Check if tables already exist (drop them if testing)
- Ensure you're using the correct SQL file
- Check Supabase logs for specific error

### Issue: "Supabase client error"
**Solution:**
- Verify .env variables are correct
- Restart Expo server: `npm start --clear`
- Check if Supabase project is active

### Issue: Can't upload files
**Solution:**
- Verify storage buckets exist
- Check bucket policies in Supabase
- Ensure buckets are set to public or have appropriate RLS policies

### Issue: Authentication not working
**Solution:**
- Clear browser cache/cookies
- Check Supabase Auth settings
- Verify email confirmation is disabled in Auth settings (for testing)

## Production Checklist

Before deploying to production:

- [ ] Change Supabase to production instance
- [ ] Setup proper RLS policies for storage
- [ ] Implement real Razorpay integration
- [ ] Add proper error tracking (Sentry)
- [ ] Setup email templates in Supabase
- [ ] Configure proper LinkedIn OAuth
- [ ] Add meeting integration (Zoom/Meet)
- [ ] Setup analytics
- [ ] Configure proper domain and SSL
- [ ] Add rate limiting
- [ ] Setup backups
- [ ] Add proper logging
- [ ] Test on real devices
- [ ] Security audit

## Next Steps

1. Customize the UI/branding
2. Add more interview profiles
3. Implement remaining features from PRD
4. Add tests
5. Deploy to production

## Support

If you encounter issues:
1. Check this guide
2. Review README.md
3. Check Supabase documentation
4. Check Expo documentation

Happy building! 🚀
