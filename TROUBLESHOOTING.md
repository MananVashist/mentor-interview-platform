# TROUBLESHOOTING.md - Complete Error Resolution Guide

> **Quick Navigation**: Use Ctrl+F to find your error message

---

## 🆘 QUICK FIXES (Try These First)

### 1. Clear Everything and Restart
```bash
# Stop the dev server (Ctrl+C)
npm start -- --clear
```

### 2. Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
node setup.js
```

### 3. Check Environment Variables
```bash
cat .env
# Verify EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are present
```

---

## 📱 EXPO & REACT NATIVE ERRORS

### Error: "Unable to resolve module"
```
Error: Unable to resolve module @react-native-async-storage/async-storage
```

**Cause**: Missing or improperly installed dependency

**Solutions**:
```bash
# Solution 1: Install missing package
npm install @react-native-async-storage/async-storage

# Solution 2: Clear cache and reinstall
rm -rf node_modules
npm install --legacy-peer-deps
npm start -- --clear

# Solution 3: If still failing
npm install --legacy-peer-deps --force
```

**Debug Steps**:
1. Check if package exists in node_modules
2. Verify package.json includes the dependency
3. Check for typos in import statement

---

### Error: "Invariant Violation: Failed to call into JavaScript module method AppRegistry.runApplication()"

**Cause**: Metro bundler cache or JavaScript error in entry file

**Solutions**:
```bash
# Clear Metro cache
npm start -- --reset-cache

# Or use clear flag
npm start -- --clear

# Or manually clear
rm -rf .expo
rm -rf node_modules/.cache
```

---

### Error: "expo-router: No routes found"

**Cause**: Expo Router not finding app directory or _layout.tsx missing

**Solutions**:
1. Verify app/_layout.tsx exists
2. Check app.json has correct main entry:
```json
{
  "expo": {
    "main": "expo-router/entry"
  }
}
```

3. Restart dev server completely

---

### Error: "Error: expo-router is not installed"

**Cause**: Package not installed or wrong version

**Solutions**:
```bash
npm install expo-router@~3.4.0
npm start -- --clear
```

---

## 🎨 NATIVEWIND / TAILWIND ERRORS

### Error: "Tailwind classes not working"

**Cause**: NativeWind not properly configured or global.css not imported

**Solutions**:

1. **Verify babel.config.js**:
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',  // This line is critical
      'react-native-reanimated/plugin',
    ],
  };
};
```

2. **Verify global.css imported in app/_layout.tsx**:
```typescript
import '../global.css'; // Must be at top
```

3. **Check tailwind.config.js paths**:
```javascript
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  // ...
}
```

4. **Restart with cache clear**:
```bash
npm start -- --clear
```

---

### Error: "className is not working on native"

**Cause**: Using className on non-NativeWind components

**Solutions**:
```typescript
// ❌ Wrong
<View className="bg-blue-500">

// ✅ Correct (ensure NativeWind is setup)
import { View } from 'react-native';
// With NativeWind babel plugin, this works:
<View className="bg-blue-500">

// If still not working, check global.css is imported
```

---

## 🔐 SUPABASE & AUTH ERRORS

### Error: "Invalid API key" or "Failed to fetch"

**Cause**: Wrong Supabase credentials or network issue

**Solutions**:

1. **Verify .env file**:
```bash
cat .env
# Should show:
# EXPO_PUBLIC_SUPABASE_URL=https://rcbaaiiawrglvyzmawvr.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

2. **Check for spaces/typos**:
```bash
# No spaces around =
# No quotes around values
# No trailing newlines
```

3. **Restart dev server** (environment variables only load on start):
```bash
# Press Ctrl+C
npm start
```

4. **Verify Supabase project is active**:
- Go to supabase.com dashboard
- Check project status (should be green)

---

### Error: "Failed to sign up: User already registered"

**Cause**: Email already exists in Supabase

**Solutions**:

1. Use different email
2. Or delete user from Supabase Dashboard:
   - Authentication → Users
   - Find user → Delete

3. Or sign in instead of signing up

---

### Error: "Failed to create profile: null value in column"

**Cause**: RLS policies blocking insert or missing required fields

**Solutions**:

1. **Check if database migration was run**:
   - Go to Supabase Dashboard → SQL Editor
   - Run: `SELECT * FROM profiles LIMIT 1;`
   - If table doesn't exist, run migration

2. **Temporarily disable RLS for testing**:
   - Supabase Dashboard → Authentication → Policies
   - Check "Disable RLS" (for testing only!)

3. **Verify user ID is being used correctly**:
```typescript
// Should match auth.uid()
const { data: { user } } = await supabase.auth.getUser();
await supabase.from('profiles').insert({
  id: user.id, // Must match auth.users.id
  email: user.email,
  role: 'candidate'
});
```

---

### Error: "row-level security policy for table violated"

**Cause**: RLS policies preventing operation

**Solutions**:

1. **Check if user is authenticated**:
```typescript
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  // User not logged in
}
```

2. **Verify policy allows operation**:
   - Supabase Dashboard → Table Editor → Select table
   - Check "Policies" tab
   - Ensure policy exists for the operation

3. **Common policy issue - user trying to access others' data**:
```sql
-- Profiles table policy
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- If policy missing, add it in SQL Editor
```

---

### Error: "Cannot read property 'id' of null" (auth context)

**Cause**: Trying to access user before auth is initialized

**Solutions**:

1. **Add loading state**:
```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    setLoading(false);
  };
  checkAuth();
}, []);

if (loading) return <LoadingScreen />;
```

2. **Use optional chaining**:
```typescript
const userId = user?.id; // Safe
```

---

## 💾 DATABASE & STORAGE ERRORS

### Error: "The resource you are looking for could not be found" (404 from Supabase)

**Cause**: Database tables don't exist or bucket not created

**Solutions**:

1. **Run database migration**:
   - Supabase Dashboard → SQL Editor
   - Copy content from `supabase/migrations/001_initial_schema.sql`
   - Click "Run"

2. **Create storage buckets**:
   - Supabase Dashboard → Storage
   - Create bucket: `documents` (public)
   - Create bucket: `recordings` (public)

3. **Verify table exists**:
```sql
-- Run in SQL Editor
SELECT * FROM profiles LIMIT 1;
```

---

### Error: "No bucket found with id: documents"

**Cause**: Storage bucket doesn't exist

**Solutions**:

1. Create bucket in Supabase Dashboard:
   - Storage → New Bucket
   - Name: `documents`
   - Public: Yes (or setup RLS policies)

2. Do same for `recordings` bucket

---

### Error: "new row violates check constraint"

**Cause**: Data doesn't meet database constraints

**Solutions**:

1. **Check what constraint failed** (in error message)
2. **Common constraints**:
   - session_price_inr must be > 0
   - rating must be 1-5
   - day_of_week must be 0-6

3. **Validate data before insert**:
```typescript
if (rating < 1 || rating > 5) {
  throw new Error('Rating must be between 1 and 5');
}
```

---

## 📦 DEPENDENCY & BUILD ERRORS

### Error: "UNMET PEER DEPENDENCY"

**Cause**: Package version mismatch

**Solutions**:
```bash
# Always use legacy-peer-deps with Expo
npm install --legacy-peer-deps

# If that fails
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

---

### Error: "Cannot find module 'react-native-url-polyfill/auto'"

**Cause**: Missing polyfill for Supabase

**Solutions**:
```bash
npm install react-native-url-polyfill
```

Then verify import in `lib/supabase/client.ts`:
```typescript
import 'react-native-url-polyfill/auto';
```

---

### Error: "Gradle build failed" (Android)

**Cause**: Android build configuration issue

**Solutions**:

1. **Clear gradle cache**:
```bash
cd android
./gradlew clean
cd ..
```

2. **Update gradle version** (if needed):
```bash
# In android/gradle/wrapper/gradle-wrapper.properties
distributionUrl=https\://services.gradle.org/distributions/gradle-7.6.1-all.zip
```

3. **Increase heap size**:
```bash
# In android/gradle.properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m
```

---

### Error: "CocoaPods could not find compatible versions" (iOS)

**Cause**: iOS dependencies out of sync

**Solutions**:
```bash
cd ios
pod install --repo-update
cd ..
```

Or:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

---

## 🌐 WEB-SPECIFIC ERRORS

### Error: "window is not defined"

**Cause**: Using web-only APIs in React Native code

**Solutions**:

```typescript
import { Platform } from 'react-native';

// Conditional execution
if (Platform.OS === 'web') {
  // Use window API
  window.localStorage.setItem('key', 'value');
}

// Or use Platform-specific imports
import Storage from './storage.web'; // for web
import Storage from './storage.native'; // for mobile
```

---

### Error: "localStorage is not defined"

**Cause**: Running on web without polyfill or using in React Native

**Solutions**:

For Supabase auth, use our configured adapter:
```typescript
// Already handled in lib/supabase/client.ts
// Uses AsyncStorage for mobile, localStorage for web
```

If you need it elsewhere:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use AsyncStorage instead of localStorage
await AsyncStorage.setItem('key', 'value');
```

---

## 🔄 NAVIGATION & ROUTING ERRORS

### Error: "No route named X found"

**Cause**: Route doesn't exist or typo in path

**Solutions**:

1. **Check file exists**:
```bash
# For route: /(candidate)/mentors
# File should be: app/(candidate)/mentors.tsx
ls app/\(candidate\)/mentors.tsx
```

2. **Use correct Link syntax**:
```typescript
// ✅ Correct
<Link href="/(candidate)/mentors">Go to Mentors</Link>

// ❌ Wrong
<Link href="/candidate/mentors">Go to Mentors</Link>
```

---

### Error: "Rendered more hooks than during the previous render"

**Cause**: Conditional hook usage or component re-rendering issue

**Solutions**:

1. **Never use hooks conditionally**:
```typescript
// ❌ Wrong
if (user) {
  const [state, setState] = useState();
}

// ✅ Correct
const [state, setState] = useState();
if (user) {
  // use state
}
```

2. **Check for infinite loops**:
```typescript
// ❌ Wrong - causes infinite loop
useEffect(() => {
  setData([...data, newItem]);
}, [data]); // Depends on data which changes in effect

// ✅ Correct
useEffect(() => {
  setData([...data, newItem]);
}, []); // Empty deps or use functional update
```

---

## 🎯 TYPESCRIPT ERRORS

### Error: "Property does not exist on type"

**Cause**: TypeScript type mismatch

**Solutions**:

1. **Check types in lib/types.ts**
2. **Use correct type**:
```typescript
// If error says "Property 'foo' does not exist"
// Add it to the type definition

interface Mentor {
  id: string;
  // ... other props
  foo?: string; // Add missing property
}
```

3. **Use type assertion if you're sure**:
```typescript
const mentor = data as Mentor;
```

---

### Error: "Cannot find name 'process'"

**Cause**: process.env used without declaration (web)

**Solutions**:

1. **Use proper env variable format**:
```typescript
// ✅ Correct (Expo format)
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;

// ❌ Wrong
const url = process.env.SUPABASE_URL;
```

2. **Variables must start with EXPO_PUBLIC_** for client access

---

## 🧪 RUNTIME ERRORS

### Error: "Cannot access X before initialization"

**Cause**: Circular dependency or hoisting issue

**Solutions**:

1. **Check for circular imports**:
```typescript
// file A imports file B
// file B imports file A
// = Circular dependency
```

2. **Restructure to remove circles**:
   - Create shared types file
   - Extract common utilities

---

### Error: "Maximum update depth exceeded"

**Cause**: setState being called repeatedly, usually in render

**Solutions**:

```typescript
// ❌ Wrong - causes infinite loop
function Component() {
  const [state, setState] = useState(0);
  setState(state + 1); // Called every render
  return <View />;
}

// ✅ Correct
function Component() {
  const [state, setState] = useState(0);
  
  useEffect(() => {
    setState(state + 1);
  }, []); // Only once
  
  return <View />;
}
```

---

## 🔍 DEBUGGING STRATEGIES

### Strategy 1: Isolate the Problem

1. Comment out code until error goes away
2. Add back code piece by piece
3. Find the exact line causing issue

### Strategy 2: Check the Console

**Web**: Press F12, check Console tab  
**Mobile**: Check terminal running `npm start`  
**Supabase**: Dashboard → Logs tab

### Strategy 3: Add Debug Logs

```typescript
console.log('DEBUG: Current user:', user);
console.log('DEBUG: About to call API');
console.error('ERROR: API call failed:', error);
```

### Strategy 4: Isolate API Calls

```typescript
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .single();
    
    console.log('Connection success:', data);
  } catch (error) {
    console.error('Connection failed:', error);
  }
}
```

---

## 📋 ERROR CHECKLIST

When you encounter an error:

- [ ] Read the complete error message
- [ ] Check which file/line number
- [ ] Google the exact error message
- [ ] Check if it's in this troubleshooting guide
- [ ] Try the quick fixes at the top
- [ ] Check relevant console (browser/terminal/Supabase)
- [ ] Add debug logs around the problematic code
- [ ] Try on different platform (web vs mobile)
- [ ] Check CONTEXT.md for known issues
- [ ] Ask for help with complete error message

---

## 🆘 NUCLEAR OPTIONS (Last Resort)

### If Nothing Else Works

```bash
# 1. Complete Clean
rm -rf node_modules
rm -rf .expo
rm -rf package-lock.json
rm -rf ios/Pods ios/Podfile.lock
npm cache clean --force

# 2. Fresh Install
node setup.js

# 3. Start Fresh
npm start -- --clear --reset-cache
```

### If Database is Corrupted

1. Go to Supabase Dashboard
2. SQL Editor → New Query
3. Drop all tables (CAUTION!):
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
4. Re-run migration from `supabase/migrations/001_initial_schema.sql`

---

## 📞 GETTING HELP

### Information to Provide

When asking for help, include:

1. **Complete error message** (not just "it doesn't work")
2. **Platform**: Web, Android, or iOS
3. **What you tried**: List of solutions attempted
4. **Code snippet**: Relevant code causing issue
5. **setup-report.json**: If setup related
6. **Console output**: Copy full error stack

### Useful Commands for Debugging

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check Expo version
npx expo --version

# List installed packages
npm list --depth=0

# Check for outdated packages
npm outdated

# Verify Supabase connection
curl https://rcbaaiiawrglvyzmawvr.supabase.co/rest/v1/
```

---

## ✅ PREVENTION TIPS

### Before Making Changes

1. Create a git commit (or backup files)
2. Test on one platform first
3. Read CONTEXT.md for known issues
4. Check this guide for related errors

### Best Practices

- Always use `--legacy-peer-deps` with npm install
- Clear cache when things seem weird: `npm start -- --clear`
- Restart dev server after .env changes
- Check Supabase dashboard regularly
- Keep dependencies up to date (but test thoroughly)

---

**REMEMBER**: 90% of errors are:
1. Missing dependencies → Run `node setup.js`
2. Cache issues → Run `npm start -- --clear`
3. Environment variables → Check `.env` and restart server
4. Database not setup → Run migration in Supabase
5. Auth not initialized → Check for null user

Read error messages carefully - they usually tell you exactly what's wrong!
