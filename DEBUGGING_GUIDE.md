# 🐛 Comprehensive Debugging Guide

This guide covers ALL common errors, their causes, and step-by-step solutions.

---

## 🚨 Critical: Before You Start Debugging

**ALWAYS run these commands first:**
```bash
# 1. Clear all caches
rm -rf node_modules .expo package-lock.json

# 2. Reinstall clean
npm install --legacy-peer-deps

# 3. Start fresh
npm start --clear
```

---

## 📋 Table of Contents

1. [Setup & Installation Errors](#setup--installation-errors)
2. [Supabase Connection Errors](#supabase-connection-errors)
3. [React Native & Expo Errors](#react-native--expo-errors)
4. [Babel & Metro Bundler Errors](#babel--metro-bundler-errors)
5. [TypeScript Errors](#typescript-errors)
6. [NativeWind / Tailwind Errors](#nativewind--tailwind-errors)
7. [Authentication Errors](#authentication-errors)
8. [Database & Storage Errors](#database--storage-errors)
9. [Android-Specific Errors](#android-specific-errors)
10. [iOS-Specific Errors](#ios-specific-errors)
11. [Web-Specific Errors](#web-specific-errors)

---

## Setup & Installation Errors

### ❌ Error: "npm ERR! code ERESOLVE"

**Cause:** Dependency conflicts

**Solution:**
```bash
# Method 1: Use legacy peer deps
npm install --legacy-peer-deps

# Method 2: Force installation
npm install --force

# Method 3: Clean and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

**Debug Steps:**
1. Check Node version: `node --version` (must be 18+)
2. Check npm version: `npm --version` (must be 8+)
3. Delete `package-lock.json` and try again

---

### ❌ Error: "Module not found: @react-native-async-storage/async-storage"

**Cause:** Missing dependency

**Solution:**
```bash
npm install @react-native-async-storage/async-storage react-native-url-polyfill --legacy-peer-deps
```

**Debug Steps:**
1. Check if installed: `ls node_modules/@react-native-async-storage`
2. If missing, install manually
3. Clear metro cache: `npm start --clear`

---

### ❌ Error: "expo-router not found"

**Cause:** Expo router not properly installed

**Solution:**
```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

---

## Supabase Connection Errors

### ❌ Error: "Invalid API key" or "Unauthorized"

**Cause:** Wrong Supabase credentials

**Solution:**
1. Verify `.env` file exists and has correct values
2. Check Supabase Dashboard → Settings → API
3. Copy the exact values:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://rcbaaiiawrglvyzmawvr.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-actual-key
   ```
4. Restart server: `npm start --clear`

**Debug Steps:**
```bash
# Test connection
node << 'EOF'
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);
supabase.from('profiles').select('count').then(console.log);
EOF
```

---

### ❌ Error: "relation 'profiles' does not exist"

**Cause:** Database migration not run

**Solution:**
1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Copy entire content of `supabase/migrations/001_initial_schema.sql`
4. Paste and click "Run"
5. Verify tables created: Go to "Table Editor"

**Debug Steps:**
1. Check if tables exist in Table Editor
2. If not, run migration again
3. Check for errors in Supabase logs

---

### ❌ Error: "Row Level Security policy violation"

**Cause:** RLS policies blocking access

**Solution:**
1. Check if you're authenticated: `supabase.auth.getSession()`
2. Verify RLS policies in Supabase Dashboard → Authentication → Policies
3. For testing, temporarily disable RLS on a table (NOT for production!)

**Debug Steps:**
```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Temporarily disable for testing (CAREFUL!)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

---

## React Native & Expo Errors

### ❌ Error: "Unable to resolve module"

**Cause:** Metro bundler cache issue

**Solution:**
```bash
# Clear all caches
rm -rf node_modules .expo package-lock.json
npm install --legacy-peer-deps
npx expo start --clear
```

**Debug Steps:**
1. Check if file exists at the path shown in error
2. Check for typos in import statements
3. Verify `tsconfig.json` paths are correct

---

### ❌ Error: "Invariant Violation: requireNativeComponent"

**Cause:** Native module not linked

**Solution:**
```bash
# For Expo managed workflow (our case)
npx expo install [package-name]

# Clear and restart
rm -rf .expo node_modules
npm install --legacy-peer-deps
npm start --clear
```

---

## Babel & Metro Bundler Errors

### ❌ Error: "Babel plugin error" or "Transform error"

**Cause:** Babel misconfiguration

**Solution:**
1. Check `babel.config.js`:
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin', // Must be last!
    ],
  };
};
```

2. Clear babel cache:
```bash
rm -rf node_modules/.cache
npm start --clear
```

---

### ❌ Error: "Metro bundler failed to build"

**Cause:** Syntax error or circular dependency

**Solution:**
1. Check error message for file name
2. Look for syntax errors (missing braces, commas, etc.)
3. Check for circular imports
4. Clear cache: `npm start --clear`

**Debug Steps:**
```bash
# Check for circular dependencies
npx madge --circular --extensions ts,tsx app/
```

---

## TypeScript Errors

### ❌ Error: "Cannot find module" or "Could not find declaration file"

**Cause:** Missing type definitions

**Solution:**
```bash
npm install --save-dev @types/react @types/react-native
```

**For specific packages:**
```bash
npm install --save-dev @types/luxon
```

---

### ❌ Error: "Type 'X' is not assignable to type 'Y'"

**Cause:** Type mismatch

**Solution:**
1. Check `lib/types.ts` for correct type definitions
2. Use type assertions if needed: `as UserRole`
3. Update types to match actual data structure

**Debug Steps:**
1. Hover over variable in VS Code to see inferred type
2. Check API response structure
3. Update types accordingly

---

## NativeWind / Tailwind Errors

### ❌ Error: "className is not working" or "Styles not applied"

**Cause:** NativeWind not configured properly

**Solution:**
1. Verify `babel.config.js` has `'nativewind/babel'`
2. Check `tailwind.config.js` content paths:
```javascript
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  // ...
}
```
3. Ensure `global.css` is imported in `app/_layout.tsx`
4. Restart with cache clear: `npm start --clear`

---

### ❌ Error: "Tailwind colors not working"

**Cause:** Color format issue or typo

**Solution:**
1. Use only core Tailwind classes: `bg-blue-500` (not custom colors without config)
2. Check `tailwind.config.js` theme.extend.colors
3. For dynamic colors, use style prop:
```typescript
style={{ backgroundColor: '#2563eb' }}
```

---

## Authentication Errors

### ❌ Error: "User not authenticated" or "Session expired"

**Cause:** Auth session lost

**Solution:**
```typescript
// In your code, always check session:
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  // Redirect to login
}
```

**Debug Steps:**
1. Check if token is stored: 
   ```typescript
   import * as SecureStore from 'expo-secure-store';
   const token = await SecureStore.getItemAsync('supabase-auth-token');
   console.log('Token:', token);
   ```
2. Verify Supabase auth settings (disable email confirmation for testing)

---

### ❌ Error: "Email not confirmed"

**Cause:** Supabase requires email confirmation

**Solution:**
1. Go to Supabase Dashboard → Authentication → Settings
2. Disable "Enable email confirmations" for testing
3. OR check email for confirmation link

---

## Database & Storage Errors

### ❌ Error: "Failed to upload file" or "Storage bucket not found"

**Cause:** Storage bucket doesn't exist or wrong permissions

**Solution:**
1. Go to Supabase Dashboard → Storage
2. Create buckets:
   - Name: `documents` (for resumes)
   - Name: `recordings` (for session recordings)
3. Set buckets to public OR configure RLS policies
4. Test upload with simple file

**Debug Steps:**
```typescript
// Test storage connection
const { data, error } = await supabase.storage.getBucket('documents');
console.log('Bucket:', data, 'Error:', error);
```

---

### ❌ Error: "Foreign key constraint violation"

**Cause:** Trying to insert data with invalid references

**Solution:**
1. Check that referenced IDs exist
2. Ensure proper order of insertions (parent before child)
3. Verify foreign key relationships in schema

---

## Android-Specific Errors

### ❌ Error: "Gradle build failed"

**Cause:** Android SDK issues

**Solution:**
```bash
# Clean gradle cache
cd android
./gradlew clean

# Update gradle wrapper (if needed)
./gradlew wrapper --gradle-version=8.0.2

# Go back and rebuild
cd ..
npm start --clear
```

---

### ❌ Error: "SDK location not found"

**Cause:** Android SDK path not set

**Solution:**
1. Create `android/local.properties`:
```
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
# Or on Windows: C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
```

---

## iOS-Specific Errors

### ❌ Error: "CocoaPods not installed"

**Cause:** CocoaPods missing (Mac only)

**Solution:**
```bash
sudo gem install cocoapods
cd ios
pod install
cd ..
```

---

### ❌ Error: "Xcode build failed"

**Cause:** iOS build configuration

**Solution:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
npm start --clear
```

---

## Web-Specific Errors

### ❌ Error: "localStorage is not defined"

**Cause:** SSR/SSG issue with localStorage

**Solution:**
```typescript
// Always check if window exists
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value');
}

// Or use SecureStore which works everywhere
```

---

### ❌ Error: "Web bundle failed to load"

**Cause:** Metro config issue for web

**Solution:**
1. Clear web cache:
```bash
rm -rf web-build .expo
```

2. Rebuild:
```bash
npm start --clear
# Press 'w' for web
```

---

## 🔍 Advanced Debugging Techniques

### Enable Detailed Logging

**For Supabase:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key, {
  auth: {
    debug: true, // Enable auth debug logs
  },
});
```

**For Metro:**
```bash
EXPO_DEBUG=true npm start
```

**For React Native:**
```typescript
// In app/_layout.tsx
if (__DEV__) {
  console.log('Debug mode enabled');
  // Add any debug logging
}
```

---

### Network Request Debugging

```typescript
// Add to lib/supabase/client.ts
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Session:', session);
});

// Log all network requests
const originalFetch = global.fetch;
global.fetch = (...args) => {
  console.log('Fetch:', args[0]);
  return originalFetch(...args);
};
```

---

### Component Debugging

```typescript
// Add to any component
useEffect(() => {
  console.log('Component mounted');
  console.log('Props:', props);
  console.log('State:', state);
  
  return () => console.log('Component unmounted');
}, []);
```

---

## 🆘 Still Stuck? Escalation Path

1. **Check this guide** - Most issues are covered here
2. **Enable debug mode**: `DEBUG=true ./setup.sh`
3. **Check logs**:
   - Metro bundler logs in terminal
   - Browser console (for web)
   - `adb logcat` (for Android)
   - Xcode logs (for iOS)
4. **Read error carefully** - Often contains the solution
5. **Check Supabase logs** - Dashboard → Settings → Logs
6. **Google the exact error** - Usually someone faced it before
7. **Check GitHub issues** for Expo/Supabase/NativeWind

---

## 📊 Common Error Patterns

| Error Contains | Likely Cause | Quick Fix |
|----------------|--------------|-----------|
| "module not found" | Missing dependency | `npm install` |
| "cannot read property of undefined" | Null/undefined data | Add null checks |
| "network error" | API/internet issue | Check connection |
| "invalid credentials" | Wrong .env values | Verify Supabase keys |
| "relation does not exist" | Migration not run | Run SQL migration |
| "transform error" | Babel issue | Clear cache |
| "gradle failed" | Android build issue | Clean gradle |

---

## 💡 Pro Tips

1. **Always clear cache first** when debugging
2. **Read the full error message** - don't just skim
3. **Check the line number** in the error
4. **Use console.log liberally** during development
5. **Test one change at a time** - don't make multiple changes
6. **Keep .env in sync** - make sure it matches .env.example
7. **Restart the dev server** after env changes
8. **Check Supabase Dashboard** for database/auth issues

---

## 🎯 Prevention Checklist

Before deploying or making major changes:

- [ ] Run `npm start --clear` to ensure clean build
- [ ] Test on multiple platforms (web, iOS, Android)
- [ ] Verify all env variables are set
- [ ] Check Supabase connection
- [ ] Run TypeScript check: `npm run type-check`
- [ ] Test authentication flow
- [ ] Test database operations
- [ ] Test file uploads
- [ ] Check for console errors
- [ ] Verify RLS policies are correct

---

**Remember: 99% of errors are caused by:**
1. Cache issues (clear cache!)
2. Missing dependencies (reinstall!)
3. Wrong .env values (double-check!)
4. Typos in code (read carefully!)
5. Migration not run (run it!)

**When in doubt, start over:**
```bash
rm -rf node_modules .expo package-lock.json
npm install --legacy-peer-deps
npm start --clear
```

This solves most issues! 🎉
