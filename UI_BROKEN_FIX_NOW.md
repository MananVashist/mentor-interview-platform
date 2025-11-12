# ⚡ UI BROKEN? DO THIS NOW!

## 🚨 IMMEDIATE FIX (30 Seconds)

```bash
# Stop the server if running (press Ctrl+C)

# Then run this:
npm start -- --clear

# When it starts, press 'w' for web
```

**That's it!** This fixes 90% of UI issues.

---

## Still Broken? Try This (1 Minute)

```bash
# Run the auto-fix script:
node fix-ui.js

# Then restart:
npm start -- --clear
```

---

## Still Broken? Nuclear Option (2 Minutes)

```bash
# Complete clean:
rm -rf .expo
rm -rf node_modules/.cache

# Restart:
npm start -- --clear
```

---

## What Should You See?

### ✅ WORKING UI:
- **Blue buttons** (not gray/black)
- **Proper spacing** between elements
- **Rounded corners** on buttons and inputs
- **Role selector** with visible borders
- **Readable text sizes**
- **White input fields** with borders

### ❌ BROKEN UI:
- Everything black and white
- No borders visible
- Text too small
- Elements overlapping
- No spacing/padding

---

## Why Does This Happen?

**Metro Bundler Cache Issue:**
- Expo/Metro caches transformed files
- NativeWind transforms `className` to styles
- If cache is stale, no styles apply
- Clearing cache fixes it

---

## Platform Specific

### On WEB (Recommended for Testing):
```bash
npm start
# Press 'w'
# Open browser console (F12) to see any errors
```

### On ANDROID:
```bash
npm run android
# If styles missing, rebuild app
```

### On iOS:
```bash
npm run ios
# If styles missing, rebuild app
```

**Always test on WEB first!** It's easiest to debug.

---

## Browser Issues?

If web looks broken:

1. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E

2. **Try incognito/private window**

3. **Check console (F12)** for errors

---

## Debug Commands

```bash
# Check if NativeWind is installed:
npm list nativewind

# Should show: nativewind@2.0.11

# Check if global.css exists:
cat global.css

# Should show Tailwind directives

# Run UI validation:
node fix-ui.js
```

---

## Common Error Messages

### "className is not defined"
```bash
npm install nativewind@^2.0.11 --legacy-peer-deps
npm start -- --clear
```

### "Failed to resolve nativewind/babel"
```bash
npm install nativewind@^2.0.11 --legacy-peer-deps
npm start -- --clear
```

### "Tailwind CSS not working"
```bash
node fix-ui.js
npm start -- --clear
```

---

## Verification Checklist

After fixing, check:
- [ ] Sign-in screen has blue buttons
- [ ] Input fields have visible borders
- [ ] Text is readable size
- [ ] Proper spacing everywhere
- [ ] Role selector looks clean
- [ ] No elements overlapping

---

## Files That Matter for UI

1. **global.css** - Must exist with Tailwind directives
2. **app/_layout.tsx** - Must import global.css at top
3. **babel.config.js** - Must have nativewind/babel plugin
4. **tailwind.config.js** - Must have correct content paths

All checked by: `node fix-ui.js`

---

## Emergency Contact Info

If NOTHING works:

1. **Check UI_FIX.md** - Comprehensive solutions
2. **Run:** `node fix-ui.js` - Auto-diagnosis
3. **Check:** Browser console (F12) - See actual errors
4. **Try:** Different browser
5. **Provide:** Screenshot + console errors for help

---

## Success Looks Like This

**Sign In Screen:**
```
┌──────────────────────────────┐
│  Welcome Back                │
│  Sign in to continue         │
│                              │
│  Select Your Role            │
│  ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ C   │ │ M   │ │ A   │   │ ← Blue border when selected
│  └─────┘ └─────┘ └─────┘   │
│                              │
│  Email Address               │
│  ┌──────────────────────┐   │ ← Border visible
│  │                      │   │
│  └──────────────────────┘   │
│                              │
│  Password                    │
│  ┌──────────────────────┐   │ ← Border visible
│  │                      │   │
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │    SIGN IN (blue)    │   │ ← Blue button
│  └──────────────────────┘   │
└──────────────────────────────┘
```

---

## TL;DR - Just Do This

```bash
npm start -- --clear
```

Press `w` for web.

If that doesn't work:
```bash
node fix-ui.js
npm start -- --clear
```

**90% of the time, the first command fixes everything!**

---

## More Help

- Full guide: **UI_FIX.md**
- Auto-fix: **node fix-ui.js**
- All errors: **TROUBLESHOOTING.md**
