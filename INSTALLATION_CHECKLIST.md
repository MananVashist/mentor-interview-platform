# ✅ INSTALLATION CHECKLIST

Print this or keep it open while setting up!

---

## ⚡ QUICK START (5 Minutes)

### ☐ Step 1: Extract & Navigate
```bash
cd mentor-interview-platform
```

### ☐ Step 2: Run Setup
```bash
node setup.js
```
**Wait for:** All green checkmarks ✓

### ☐ Step 3: Setup Supabase

**A. Database Migration**
1. Open [supabase.com](https://supabase.com)
2. Go to project **rcbaaiiawrglvyzmawvr**
3. Click **SQL Editor**
4. Copy from: `supabase/migrations/001_initial_schema.sql`
5. Paste and click **Run**
6. See: "Success. No rows returned"

**B. Storage Buckets**
1. Click **Storage** in sidebar
2. Create bucket: `documents` (Public ✓)
3. Create bucket: `recordings` (Public ✓)

### ☐ Step 4: Start App
```bash
npm start
```
Press **`w`** for web

### ☐ Step 5: Test
1. Create account: test@example.com / test123
2. Login successfully
3. See dashboard

---

## 🐛 IF ERRORS

### "Cannot find module"
```bash
rm -rf node_modules
node setup.js
```

### "Supabase connection error"
- Check: `.env` file exists
- Check: Database migration was run
- Try: Restart (`npm start`)

### "Tables don't exist"
- You forgot Step 3A!
- Go back and run the migration

---

## 📋 VERIFICATION

After setup, verify:
- [ ] `.env` file exists with Supabase credentials
- [ ] `node_modules/` folder exists
- [ ] Can run `npm start` without errors
- [ ] Database has tables (check Supabase Table Editor)
- [ ] Storage has `documents` and `recordings` buckets
- [ ] Can create test account
- [ ] Can login
- [ ] Can navigate app

---

## 📖 FULL DOCS

| Issue | Document |
|-------|----------|
| Getting started | GETTING_STARTED.md |
| Errors/Fixes | TROUBLESHOOTING.md |
| Project understanding | CONTEXT.md |
| Features & roadmap | PROJECT_SUMMARY.md |

---

## 🎯 SUCCESS = All ✓

When everything above is checked, you're ready to build!

---

**REMEMBER:**
- Web is easiest for testing (press `w`)
- Supabase URL/Key already configured
- Database migration only needs to run ONCE
- Check TROUBLESHOOTING.md for all errors

---

**Need Help?** Check GETTING_STARTED.md for detailed instructions!
