# CONTEXT.md - Project State & AI Handoff Documentation

**LAST UPDATED**: 2024-11-08  
**PROJECT**: Mentor Interview Platform  
**VERSION**: 1.0.0 MVP  

> **PURPOSE**: This document helps any AI (or developer) understand the complete project state when continuing work. Read this FIRST before making any changes.

---

## 🎯 PROJECT OVERVIEW

### What This Is
A mock interview platform connecting candidates with mentors for structured 3-round interviews (2 technical + 1 HR) built with React Native (Expo) for Web + Mobile, powered by Supabase.

### Current Status: ✅ MVP COMPLETE & FUNCTIONAL

---

## 🔑 CREDENTIALS & CONFIGURATION

### Supabase (ACTIVE & CONFIGURED)
```
Project ID: rcbaaiiawrglvyzmawvr
URL: https://rcbaaiiawrglvyzmawvr.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA

Status: Configured in .env
Database: Migration needs to be run manually in Supabase dashboard
Storage: Buckets need to be created: 'documents' and 'recordings'
```

### Other Services (NOT YET CONFIGURED)
- Razorpay: Placeholders in place
- LinkedIn OAuth: Not configured
- Zoom API: Not configured

---

## 📁 PROJECT STRUCTURE

```
mentor-interview-platform/
├── app/                      # Expo Router screens
│   ├── _layout.tsx          # Root layout with auth check
│   ├── (auth)/              # Auth screens (sign-in, sign-up)
│   ├── (candidate)/         # Candidate app screens
│   ├── (mentor)/            # Mentor app screens
│   └── (admin)/             # Admin dashboard screens
├── components/              # UI components (empty dirs ready)
├── services/                # API service layer
│   ├── auth.service.ts      # Authentication
│   ├── candidate.service.ts # Candidate operations
│   ├── mentor.service.ts    # Mentor operations
│   ├── payment.service.ts   # Payment handling
│   └── session.service.ts   # Session management
├── lib/                     # Core utilities
│   ├── supabase/client.ts   # Supabase config
│   ├── types.ts             # TypeScript types
│   ├── utils.ts             # Helper functions
│   └── store.ts             # Zustand state
├── constants/index.ts       # App constants
├── supabase/migrations/     # Database schema
├── setup.js                 # Automated setup script
├── .env                     # Environment variables (CONFIGURED)
└── [config files]           # Various configs
```

---

## 🗄️ DATABASE SCHEMA

### Tables (11 total)
1. **profiles** - Base user table (extends auth.users)
2. **candidates** - Candidate-specific data
3. **mentors** - Mentor profiles with KYC
4. **mentor_availability** - Weekly time slots
5. **interview_packages** - 3-round booking packages
6. **interview_sessions** - Individual session records
7. **session_evaluations** - Mentor feedback
8. **final_reports** - Compiled reports
9. **candidate_reviews** - Ratings for mentors
10. **notifications** - User notifications
11. **disputes** - Dispute management

### Key Relationships
- User → Profile → Role-specific table (1:1)
- Package → 3 Sessions (1:3)
- Session → Evaluation (1:1)
- Package → Final Report (1:1)

### Security: RLS Enabled
All tables have Row Level Security policies based on auth.uid()

---

## 🔧 TECH STACK

### Core Framework
- **Expo SDK 50** (React Native)
- **Expo Router 3.4** (File-based routing)
- **React Native 0.73**
- **TypeScript 5.1**

### UI & Styling
- **NativeWind 2.0** (Tailwind for RN)
- **TailwindCSS 3.3**
- Custom color scheme in constants/index.ts

### Backend & Data
- **Supabase 2.39** (Auth + Database + Storage)
- **Zustand 4.4** (State management)
- **Luxon 3.4** (Date/time with timezone)

### Forms & Validation
- **React Hook Form 7.49**
- **Zod 3.22**

### Key Dependencies
```json
{
  "@supabase/supabase-js": "^2.39.0",
  "expo": "~50.0.0",
  "expo-router": "~3.4.0",
  "nativewind": "^2.0.11",
  "zustand": "^4.4.7",
  "@react-native-async-storage/async-storage": "1.21.0",
  "react-native-url-polyfill": "^2.0.0"
}
```

---

## 🎨 UI/UX GUIDELINES

### Color Scheme (No Personal Info)
```javascript
primary: '#2563eb' (blue-600)
success: '#10b981' (green-500)
warning: '#f59e0b' (amber-500)
error: '#ef4444' (red-500)
background: '#f8fafc' (slate-50)
```

### No Personal Information
- No real names in placeholders
- No phone numbers
- No email addresses
- No profile pictures
- Use "Test User", "Demo Mentor", etc.

### Professional Design Standards
- Consistent spacing (8px grid)
- Clear typography hierarchy
- Accessible color contrast (WCAG AA)
- Loading states for all async operations
- Error boundaries for fault tolerance

---

## 🚀 SETUP SEQUENCE

### Automated Setup (USE THIS)
```bash
node setup.js
```

### Manual Setup (If automated fails)
1. `npm install --legacy-peer-deps`
2. Copy .env.example to .env
3. Add Supabase credentials
4. Run migration in Supabase dashboard
5. Create storage buckets
6. `npm start`

---

## ⚠️ KNOWN ISSUES & WORKAROUNDS

### Issue 1: Peer Dependencies
**Problem**: Expo + React Native peer dependency warnings  
**Solution**: Always use `npm install --legacy-peer-deps`  
**Why**: Expo packages have strict peer deps that sometimes conflict

### Issue 2: Metro Bundler Cache
**Problem**: Changes not reflecting  
**Solution**: `npm start -- --clear`  
**Why**: Metro caches transformed files

### Issue 3: Environment Variables Not Loading
**Problem**: EXPO_PUBLIC_ vars not accessible  
**Solution**: Restart dev server completely (Ctrl+C, then npm start)  
**Why**: Expo only loads .env on initial start

### Issue 4: Supabase Connection Errors
**Problem**: "Invalid JWT" or auth errors  
**Solution**: Check .env file, ensure no extra spaces in keys  
**Why**: Supabase keys are JWTs and must be exact

### Issue 5: Web vs Native Differences
**Problem**: Code works on web but not mobile  
**Solution**: Check for web-only APIs, use Platform.select()  
**Why**: Some APIs (like window) don't exist in React Native

---

## 🛠️ DEVELOPMENT WORKFLOW

### Starting Development
```bash
# Clear cache and start
npm start -- --clear

# Or specific platform
npm run web      # Web browser
npm run android  # Android emulator/device
npm run ios      # iOS simulator (Mac only)
```

### Testing Roles
Create test accounts for each role:
- Candidate: candidate@test.com / test123
- Mentor: mentor@test.com / test123
- Admin: admin@test.com / test123

### Debugging
1. Check browser console (web) or React Native Debugger
2. Check Supabase logs in dashboard
3. Use setup-report.json for setup issues
4. Check TROUBLESHOOTING.md for common errors

---

## 📝 WHEN MAKING CHANGES

### Before Modifying Code

1. **Read This Document** - Understand current state
2. **Check TROUBLESHOOTING.md** - Known issues
3. **Review Existing Code** - Understand patterns
4. **Test on Multiple Platforms** - Web + Mobile

### Safe Change Patterns

✅ **DO**:
- Use TypeScript strictly
- Follow existing file structure
- Add proper error handling
- Test auth flows after changes
- Update this CONTEXT.md if adding major features

❌ **DON'T**:
- Replace entire files without backing up
- Change dependency versions without testing
- Remove error boundaries
- Bypass authentication checks
- Add hardcoded personal information

### File Replacement Rules

**NEVER replace these files entirely**:
- package.json (causes dependency hell)
- app.json (breaks Expo config)
- .env (loses credentials)

**Safe to replace**:
- Individual screen files (app/*.tsx)
- Service files (services/*.ts)
- Component files (components/*.tsx)
- Utility files (lib/*.ts)

**Always backup before replacing**:
```bash
cp file.tsx file.tsx.backup
```

---

## 🔄 CONTEXT SWITCHING PROTOCOL

### For AI Continuation

When another AI takes over, they should:

1. Read this CONTEXT.md completely
2. Check git status (or file timestamps)
3. Review setup-report.json if exists
4. Run `node setup.js` to verify setup
5. Test basic auth flow before major changes

### Project State Checklist

- [ ] .env file configured with Supabase
- [ ] Dependencies installed
- [ ] Database migration run
- [ ] Storage buckets created
- [ ] Can sign up a test user
- [ ] Can sign in successfully
- [ ] Can navigate between screens

### Common Handoff Scenarios

**Scenario 1: "Setup not working"**
1. Check if setup.js was run
2. Verify .env has correct values
3. Check setup-report.json
4. Run: `rm -rf node_modules && node setup.js`

**Scenario 2: "Auth not working"**
1. Check Supabase dashboard (project online?)
2. Verify database migration was run
3. Check browser console for errors
4. Test with new incognito window

**Scenario 3: "UI looks broken"**
1. Check if global.css is imported in _layout.tsx
2. Verify tailwind.config.js paths
3. Run: `npm start -- --clear`
4. Check NativeWind setup in babel.config.js

---

## 📊 IMPLEMENTATION STATUS

### ✅ Completed Features
- [x] Authentication (email/password)
- [x] Role-based routing
- [x] Candidate dashboard
- [x] Mentor dashboard
- [x] Mentor discovery
- [x] Session booking flow structure
- [x] Evaluation forms
- [x] Database schema with RLS
- [x] File upload structure
- [x] Payment calculation logic

### 🚧 Partially Complete
- [ ] LinkedIn OAuth (structure only)
- [ ] Razorpay integration (placeholders)
- [ ] Video meeting links (manual)
- [ ] Recording storage (structure ready)

### ❌ Not Started
- [ ] Push notifications
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] AI feedback summaries
- [ ] Subscription packages

---

## 🆘 EMERGENCY FIXES

### If Everything Breaks

```bash
# Nuclear option - full reset
rm -rf node_modules package-lock.json
rm -rf .expo
npm cache clean --force
node setup.js
npm start -- --clear
```

### If Database Issues

1. Go to Supabase Dashboard
2. SQL Editor → New Query
3. Run migration from supabase/migrations/001_initial_schema.sql
4. Verify tables created in Table Editor

### If Auth Issues

1. Supabase Dashboard → Authentication → Users
2. Check if users are being created
3. Verify email confirmation is disabled (for testing)
4. Check RLS policies are not blocking

---

## 📞 DEBUGGING CHECKLIST

When something doesn't work:

1. **Check Console**
   - Browser console (F12)
   - Terminal running npm start
   - Expo Dev Tools

2. **Check Network**
   - Browser Network tab
   - Look for 401/403 errors (auth)
   - Look for 400 errors (validation)

3. **Check Supabase**
   - Dashboard → Logs
   - Check if requests are reaching Supabase
   - Verify API keys are correct

4. **Check Environment**
   - Is .env file present?
   - Are variables prefixed with EXPO_PUBLIC_?
   - Did you restart dev server after .env changes?

5. **Check Dependencies**
   - Run: `npm ls` to see dependency tree
   - Look for UNMET PEER DEPENDENCY warnings
   - Re-run: `node setup.js`

---

## 📄 RELATED DOCUMENTATION

- **README.md** - Project overview & features
- **SETUP_GUIDE.md** - Step-by-step setup instructions  
- **TROUBLESHOOTING.md** - Common errors & solutions
- **PROJECT_SUMMARY.md** - What's built & what's next

---

## 🔐 SECURITY NOTES

### Credentials Management
- Supabase anon key is safe to expose (it's public)
- Service role key should NEVER be in .env (we don't have it)
- Keep .env in .gitignore
- Never commit actual API keys to git

### RLS Policies
All database operations are protected by Row Level Security:
- Users can only access their own data
- Mentors visible to candidates only if approved
- Admins have special policies

---

## ✅ VALIDATION BEFORE CONTINUING

Before making any changes, verify:

1. [ ] I have read this entire document
2. [ ] I understand the project structure
3. [ ] I know which files are safe to modify
4. [ ] I have a backup plan if things break
5. [ ] I will test on at least web platform
6. [ ] I will update CONTEXT.md if adding major features
7. [ ] I will not add personal information anywhere

---

**IMPORTANT**: This document is the source of truth for project state. Update it when making significant changes.

**LAST VERIFIED WORKING**: 2024-11-08 after running setup.js successfully
