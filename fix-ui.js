#!/usr/bin/env node

/**
 * AUTOMATED UI FIX SCRIPT
 * Diagnoses and fixes NativeWind/Tailwind UI issues
 */

const fs = require('fs');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log(`\n${colors.blue}🎨 UI FIX UTILITY${colors.reset}\n`);

let fixes = [];
let issues = [];

// Check 1: global.css exists
console.log('Checking global.css...');
if (!fs.existsSync('global.css')) {
  issues.push('global.css missing');
  console.log(`${colors.red}✗${colors.reset} global.css not found`);
  
  // Create it
  fs.writeFileSync('global.css', '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
  fixes.push('Created global.css');
  console.log(`${colors.green}✓${colors.reset} Created global.css`);
} else {
  console.log(`${colors.green}✓${colors.reset} global.css exists`);
}

// Check 2: global.css imported in _layout.tsx
console.log('\nChecking _layout.tsx...');
if (fs.existsSync('app/_layout.tsx')) {
  const layoutContent = fs.readFileSync('app/_layout.tsx', 'utf8');
  
  if (!layoutContent.includes("import '../global.css'") && 
      !layoutContent.includes('import "../global.css"')) {
    issues.push('global.css not imported');
    console.log(`${colors.red}✗${colors.reset} global.css not imported`);
    
    // Add import at top
    const lines = layoutContent.split('\n');
    lines.splice(0, 0, "import '../global.css';");
    fs.writeFileSync('app/_layout.tsx', lines.join('\n'));
    fixes.push('Added global.css import to _layout.tsx');
    console.log(`${colors.green}✓${colors.reset} Added global.css import`);
  } else {
    console.log(`${colors.green}✓${colors.reset} global.css imported`);
  }
} else {
  issues.push('_layout.tsx missing');
  console.log(`${colors.red}✗${colors.reset} _layout.tsx not found`);
}

// Check 3: babel.config.js has nativewind plugin
console.log('\nChecking babel.config.js...');
if (fs.existsSync('babel.config.js')) {
  const babelContent = fs.readFileSync('babel.config.js', 'utf8');
  
  if (!babelContent.includes('nativewind/babel')) {
    issues.push('NativeWind babel plugin missing');
    console.log(`${colors.red}✗${colors.reset} NativeWind babel plugin missing`);
    
    // Fix babel config
    const correctBabelConfig = `module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin',
    ],
  };
};
`;
    fs.writeFileSync('babel.config.js', correctBabelConfig);
    fixes.push('Fixed babel.config.js');
    console.log(`${colors.green}✓${colors.reset} Fixed babel.config.js`);
  } else {
    console.log(`${colors.green}✓${colors.reset} NativeWind babel plugin present`);
  }
} else {
  issues.push('babel.config.js missing');
  console.log(`${colors.red}✗${colors.reset} babel.config.js not found`);
}

// Check 4: tailwind.config.js has correct content paths
console.log('\nChecking tailwind.config.js...');
if (fs.existsSync('tailwind.config.js')) {
  const tailwindContent = fs.readFileSync('tailwind.config.js', 'utf8');
  
  if (!tailwindContent.includes('./app/**/*.{js,jsx,ts,tsx}')) {
    issues.push('Tailwind content paths incorrect');
    console.log(`${colors.yellow}⚠${colors.reset} Tailwind paths may be incorrect`);
  } else {
    console.log(`${colors.green}✓${colors.reset} Tailwind content paths correct`);
  }
} else {
  issues.push('tailwind.config.js missing');
  console.log(`${colors.red}✗${colors.reset} tailwind.config.js not found`);
}

// Check 5: NativeWind installed
console.log('\nChecking NativeWind installation...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!packageJson.dependencies.nativewind && !packageJson.devDependencies?.nativewind) {
    issues.push('NativeWind not installed');
    console.log(`${colors.red}✗${colors.reset} NativeWind not in package.json`);
  } else {
    console.log(`${colors.green}✓${colors.reset} NativeWind in package.json`);
    
    // Check if actually installed
    if (!fs.existsSync('node_modules/nativewind')) {
      issues.push('NativeWind not in node_modules');
      console.log(`${colors.yellow}⚠${colors.reset} NativeWind not in node_modules (run npm install)`);
    }
  }
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} Could not read package.json`);
}

// Summary
console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}Summary${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`);
console.log(`Issues found: ${issues.length}`);
console.log(`Fixes applied: ${fixes.length}\n`);

if (fixes.length > 0) {
  console.log(`${colors.green}Fixes Applied:${colors.reset}`);
  fixes.forEach(fix => console.log(`  ${colors.green}✓${colors.reset} ${fix}`));
  console.log();
}

if (issues.length > 0) {
  console.log(`${colors.yellow}Issues Remaining:${colors.reset}`);
  issues.forEach(issue => console.log(`  ${colors.yellow}⚠${colors.reset} ${issue}`));
  console.log();
}

// Recommendations
console.log(`${colors.cyan}Next Steps:${colors.reset}\n`);

if (fixes.length > 0 || issues.length > 0) {
  console.log(`${colors.yellow}1. Clear cache and restart:${colors.reset}`);
  console.log(`   rm -rf .expo`);
  console.log(`   npm start -- --clear\n`);
  
  if (issues.some(i => i.includes('not installed'))) {
    console.log(`${colors.yellow}2. Reinstall dependencies:${colors.reset}`);
    console.log(`   npm install --legacy-peer-deps\n`);
  }
  
  console.log(`${colors.yellow}3. Test on web:${colors.reset}`);
  console.log(`   Press 'w' when Expo starts\n`);
} else {
  console.log(`${colors.green}✓ All checks passed!${colors.reset}`);
  console.log(`\nIf UI still broken, try:`);
  console.log(`1. npm start -- --clear`);
  console.log(`2. Check browser console (F12) for errors`);
  console.log(`3. Try incognito/private window\n`);
}

console.log(`${colors.blue}For more help, see UI_FIX.md${colors.reset}\n`);

// Exit code
process.exit(issues.length > 0 ? 1 : 0);
