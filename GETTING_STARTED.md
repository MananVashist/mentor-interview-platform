# GETTING STARTED - Complete Setup Guide

**READ THIS FIRST** before running any commands!

---

## 📋 What You Need

✅ **Computer Requirements:**
- macOS, Windows, or Linux
- 8GB+ RAM recommended
- Stable internet connection

✅ **Software Requirements:**
- Node.js 18+ ([Download](https://nodejs.org))
- npm (comes with Node.js)
- Code editor (VS Code recommended)

✅ **Accounts Needed:**
- Supabase account (✅ Already configured!)
- Optional: Razorpay, LinkedIn, Zoom (for production)

---

## 🚀 SETUP IN 3 STEPS

### Step 1: Extract and Navigate

```bash
# Extract the zip file
# Then navigate to the folder
cd mentor-interview-platform
```

### Step 2: Run Automated Setup

```bash
# This will:
# - Check prerequisites
# - Install dependencies
# - Create .env file with Supabase credentials
# - Validate configuration
node setup.js
```

**Expected output:** Green checkmarks for all steps (takes 2-3 minutes)

### Step 3: Setup Supabase Database

1. Go to [supabase.com](https://supabase.com)
2. Sign in (use any email)
3. You'll see project **rcbaaiiawrglvyzmawvr** (already created)
4. Click on the project

#### 3a. Run Database Migration

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `supabase/migrations/001_initial_schema.sql` from your project folder
4. Copy ALL the content (it's long - about 400 lines)
5. Paste into SQL Editor
6. Click **Run** (bottom right)
7. Wait for "Success. No rows returned" message

#### 3b. Create Storage Buckets

1. In Supabase dashboard, click **Storage** (left sidebar)
2. Click **New Bucket**
3. Name: `documents`
4. Check **Public bucket**
5. Click **Create bucket**
6. Repeat for bucket named: `recordings`

---

## ▶️ START THE APP

```bash
npm start
```

This will:
1. Run pre-flight checks
2. Start Expo development server
3. Show QR code and options

**Choose your platform:**
- Press **`w`** for web (easiest to test)
- Press **`a`** for Android (requires emulator or device)
- Press **`i`** for iOS (Mac only, requires simulator)

**First time? Choose web!**

---

## ✅ VERIFY IT'S WORKING

### Test 1: Sign Up Works

1. App should open in your browser
2. You should see a "Create Account" or "Sign Up" screen
3. Try creating an account:
   - Email: test@example.com
   - Password: test123
   - Role: Candidate
   - Click "Sign Up"

**Expected:** Success message or redirect to profile setup

### Test 2: Sign In Works

1. Use the credentials you just created
2. You should see the candidate dashboard

### Test 3: Navigation Works

1. Try clicking different tabs/buttons
2. App should navigate smoothly without errors

---

## 🐛 IF SOMETHING GOES WRONG

### Problem: "Cannot find module"

```bash
# Solution:
rm -rf node_modules
node setup.js
```

### Problem: "Supabase connection error"

**Check these:**
1. Is `.env` file present? Run: `cat .env`
2. Does it have Supabase credentials?
3. Did you run the database migration in Supabase?

**Try:**
```bash
# Restart the dev server
# Press Ctrl+C to stop
npm start
```

### Problem: "Tables don't exist" error

**You forgot to run the database migration!**
- Go back to Step 3a above
- Run the SQL migration in Supabase dashboard

### Problem: "Metro bundler issues"

```bash
# Clear cache and restart
npm start -- --clear
```

### Still stuck?

1. Check **TROUBLESHOOTING.md** for your specific error
2. Check **CONTEXT.md** for project understanding
3. Look at `setup-report.json` if setup failed

---

## 📚 PROJECT STRUCTURE

```
mentor-interview-platform/
├── app/                    # All screens
│   ├── (auth)/            # Login, signup
│   ├── (candidate)/       # Candidate screens
│   ├── (mentor)/          # Mentor screens
│   └── (admin)/           # Admin screens
├── services/              # API calls
├── lib/                   # Utilities
├── components/            # Reusable UI
├── .env                   # Config (created by setup)
└── supabase/migrations/   # Database schema
```

---

## 👥 CREATE TEST ACCOUNTS

### Candidate Account
```
Email: candidate@test.com
Password: test123
Role: Candidate
```

### Mentor Account  
```
Email: mentor@test.com
Password: test123
Role: Mentor
```

### Admin Account
```
Email: admin@test.com
Password: test123
Role: Admin
```

Create these through the Sign Up screen to test all flows!

---

## 🎯 WHAT TO TEST

### As Candidate:
1. ✅ Sign up / Sign in
2. ✅ Complete profile
3. ✅ Upload resume
4. ✅ Browse mentors
5. ✅ Book interview package

### As Mentor:
1. ✅ Sign up / Sign in
2. ✅ Complete mentor profile
3. ✅ Set availability
4. ✅ View session requests
5. ✅ Submit evaluations

### As Admin:
1. ✅ Sign in
2. ✅ View pending mentors
3. ✅ Approve/reject mentors
4. ✅ View all packages

---

## 🔧 DEVELOPMENT TIPS

### Hot Reload
Code changes auto-reload in the app. No need to restart!

### Console Logs
- **Web**: Press F12 to see console
- **Terminal**: Check the terminal running `npm start`

### Debug Mode
In development, you'll see helpful debug info and error details.

### Clear Cache
If things seem weird:
```bash
npm start -- --clear
```

---

## 📖 NEXT STEPS

1. **Customize branding**: Edit `constants/index.ts` for colors
2. **Add features**: Follow patterns in existing code
3. **Deploy web**: Run `npx expo export --platform web`
4. **Build mobile**: Use EAS Build ([docs](https://docs.expo.dev))

---

## 📞 HELP & DOCUMENTATION

| Document | Purpose |
|----------|---------|
| **README.md** | Project overview & features |
| **CONTEXT.md** | Detailed project state (for AI) |
| **TROUBLESHOOTING.md** | Error solutions |
| **SETUP_GUIDE.md** | Detailed setup instructions |
| **PROJECT_SUMMARY.md** | What's built & roadmap |

---

## ✨ FEATURES READY TO USE

- ✅ User authentication (3 roles)
- ✅ Candidate dashboard
- ✅ Mentor discovery
- ✅ Session booking structure
- ✅ Profile management
- ✅ Resume upload
- ✅ Evaluation forms
- ✅ Admin dashboard

---

## 🎉 SUCCESS CHECKLIST

- [ ] Extracted project files
- [ ] Ran `node setup.js` successfully
- [ ] Ran database migration in Supabase
- [ ] Created storage buckets
- [ ] Started app with `npm start`
- [ ] Created test account
- [ ] Logged in successfully
- [ ] Navigated between screens

**All checked?** You're ready to build! 🚀

---

## ⚡ QUICK REFERENCE

| Command | Purpose |
|---------|---------|
| `node setup.js` | Run setup/reinstall |
| `npm start` | Start development server |
| `npm run web` | Start for web only |
| `npm run preflight` | Check if setup is valid |
| `npm start -- --clear` | Clear cache and start |

---

**IMPORTANT NOTES:**

1. **Don't delete .env** - Contains your Supabase credentials
2. **Run migration once** - Only needs to run in Supabase once
3. **Storage buckets** - Create both: documents and recordings
4. **Test on web first** - Easiest platform to debug
5. **Check docs** - All errors covered in TROUBLESHOOTING.md

---

**Need help?** Check TROUBLESHOOTING.md or CONTEXT.md

**Ready to code?** The project is fully functional - just add your features!

---

Last updated: 2024-11-08
Project version: 1.0.0 MVP
