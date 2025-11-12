#!/usr/bin/env node

/**
 * COMPREHENSIVE UI DIAGNOSTIC
 * Checks everything related to UI styling and provides detailed report
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
};

console.log(`\n${colors.cyan}${colors.bright}═══════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}${colors.bright}  UI COMPREHENSIVE DIAGNOSTIC${colors.reset}`);
console.log(`${colors.cyan}${colors.bright}═══════════════════════════════════════${colors.reset}\n`);

const report = {
  checks: [],
  issues: [],
  fixes: [],
  warnings: [],
};

function check(name, condition, details) {
  const result = { name, passed: condition, details };
  report.checks.push(result);
  
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${name}`);
  } else {
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    report.issues.push({ name, details });
  }
  
  if (details) {
    console.log(`  ${colors.cyan}→${colors.reset} ${details}`);
  }
}

function warn(message) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
  report.warnings.push(message);
}

console.log(`${colors.blue}[1] Checking Files...${colors.reset}\n`);

// Check 1: Critical files exist
check('global.css exists', fs.existsSync('global.css'), 
  'Required for Tailwind base styles');

check('babel.config.js exists', fs.existsSync('babel.config.js'),
  'Required for NativeWind transformation');

check('tailwind.config.js exists', fs.existsSync('tailwind.config.js'),
  'Required for Tailwind configuration');

check('app/_layout.tsx exists', fs.existsSync('app/_layout.tsx'),
  'Root layout file');

check('app/(auth)/sign-in.tsx exists', fs.existsSync('app/(auth)/sign-in.tsx'),
  'Sign in screen');

console.log(`\n${colors.blue}[2] Checking File Contents...${colors.reset}\n`);

// Check 2: global.css content
if (fs.existsSync('global.css')) {
  const globalCssContent = fs.readFileSync('global.css', 'utf8');
  check('global.css has Tailwind directives', 
    globalCssContent.includes('@tailwind'),
    globalCssContent.includes('@tailwind') ? 'Found @tailwind directives' : 'Missing @tailwind directives');
} else {
  check('global.css has Tailwind directives', false, 'File does not exist');
}

// Check 3: _layout.tsx imports global.css
if (fs.existsSync('app/_layout.tsx')) {
  const layoutContent = fs.readFileSync('app/_layout.tsx', 'utf8');
  const hasImport = layoutContent.includes("import '../global.css'") || 
                    layoutContent.includes('import "../global.css"');
  check('_layout.tsx imports global.css', hasImport,
    hasImport ? 'Import found' : 'Import missing - this is critical!');
  
  if (hasImport) {
    const lines = layoutContent.split('\n');
    const importLine = lines.findIndex(line => line.includes('global.css'));
    if (importLine > 5) {
      warn('global.css import is not at the top of the file (line ' + (importLine + 1) + ')');
    }
  }
} else {
  check('_layout.tsx imports global.css', false, 'File does not exist');
}

// Check 4: babel.config.js has nativewind plugin
if (fs.existsSync('babel.config.js')) {
  const babelContent = fs.readFileSync('babel.config.js', 'utf8');
  check('babel.config.js has nativewind/babel plugin',
    babelContent.includes('nativewind/babel'),
    babelContent.includes('nativewind/babel') ? 'Plugin configured' : 'Plugin missing - UI will not work!');
} else {
  check('babel.config.js has nativewind/babel plugin', false, 'File does not exist');
}

// Check 5: tailwind.config.js has correct paths
if (fs.existsSync('tailwind.config.js')) {
  const tailwindContent = fs.readFileSync('tailwind.config.js', 'utf8');
  const hasAppPath = tailwindContent.includes('./app/**/*.{js,jsx,ts,tsx}');
  const hasComponentsPath = tailwindContent.includes('./components/**/*.{js,jsx,ts,tsx}');
  
  check('tailwind.config.js has app/** path', hasAppPath,
    hasAppPath ? 'Path configured' : 'Path missing');
  
  check('tailwind.config.js has components/** path', hasComponentsPath,
    hasComponentsPath ? 'Path configured' : 'Path may be missing');
} else {
  check('tailwind.config.js has paths', false, 'File does not exist');
}

console.log(`\n${colors.blue}[3] Checking Dependencies...${colors.reset}\n`);

// Check 6: package.json dependencies
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  check('nativewind installed', !!allDeps.nativewind,
    allDeps.nativewind ? `Version: ${allDeps.nativewind}` : 'Not in package.json');
  
  check('tailwindcss installed', !!allDeps.tailwindcss,
    allDeps.tailwindcss ? `Version: ${allDeps.tailwindcss}` : 'Not in package.json');
  
  check('expo-router installed', !!allDeps['expo-router'],
    allDeps['expo-router'] ? `Version: ${allDeps['expo-router']}` : 'Not in package.json');
} else {
  check('Dependencies check', false, 'package.json does not exist');
}

// Check 7: node_modules presence
check('node_modules/nativewind exists', 
  fs.existsSync('node_modules/nativewind'),
  fs.existsSync('node_modules/nativewind') ? 'Installed' : 'Run npm install');

check('node_modules/tailwindcss exists',
  fs.existsSync('node_modules/tailwindcss'),
  fs.existsSync('node_modules/tailwindcss') ? 'Installed' : 'Run npm install');

console.log(`\n${colors.blue}[4] Checking Sign-In Screen...${colors.reset}\n`);

// Check 8: Sign-in screen type
if (fs.existsSync('app/(auth)/sign-in.tsx')) {
  const signInContent = fs.readFileSync('app/(auth)/sign-in.tsx', 'utf8');
  const usesClassName = signInContent.includes('className=');
  const usesStyleSheet = signInContent.includes('StyleSheet.create');
  
  if (usesStyleSheet) {
    console.log(`${colors.green}✓${colors.reset} Sign-in uses StyleSheet (React Native styles)`);
    console.log(`  ${colors.green}→${colors.reset} This will ALWAYS work!`);
  } else if (usesClassName) {
    console.log(`${colors.yellow}⚠${colors.reset} Sign-in uses className (NativeWind/Tailwind)`);
    console.log(`  ${colors.yellow}→${colors.reset} Requires all checks above to pass`);
  } else {
    console.log(`${colors.red}✗${colors.reset} Sign-in has no styling`);
  }
}

// Check 9: Backups exist
const hasStylesheetBackup = fs.existsSync('app/(auth)/sign-in-stylesheet.tsx');
const hasTailwindBackup = fs.existsSync('app/(auth)/sign-in-tailwind.tsx.backup');

if (hasStylesheetBackup) {
  console.log(`${colors.green}✓${colors.reset} StyleSheet version available: sign-in-stylesheet.tsx`);
}
if (hasTailwindBackup) {
  console.log(`${colors.green}✓${colors.reset} Tailwind backup exists: sign-in-tailwind.tsx.backup`);
}

// Summary
console.log(`\n${colors.cyan}${colors.bright}═══════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}${colors.bright}  DIAGNOSTIC SUMMARY${colors.reset}`);
console.log(`${colors.cyan}${colors.bright}═══════════════════════════════════════${colors.reset}\n`);

console.log(`Total Checks: ${report.checks.length}`);
console.log(`${colors.green}Passed: ${report.checks.filter(c => c.passed).length}${colors.reset}`);
console.log(`${colors.red}Failed: ${report.issues.length}${colors.reset}`);
console.log(`${colors.yellow}Warnings: ${report.warnings.length}${colors.reset}\n`);

// Recommendations
console.log(`${colors.cyan}${colors.bright}RECOMMENDATIONS:${colors.reset}\n`);

if (report.issues.length === 0) {
  console.log(`${colors.green}✓ All checks passed!${colors.reset}`);
  console.log(`\nIf UI still broken:`);
  console.log(`1. Clear cache: ${colors.cyan}npm start -- --clear${colors.reset}`);
  console.log(`2. Try browser: Press F12, check console for errors`);
  console.log(`3. Use fallback: ${colors.cyan}cp app/(auth)/sign-in-stylesheet.tsx app/(auth)/sign-in.tsx${colors.reset}\n`);
} else {
  console.log(`${colors.red}Issues found. Solutions:${colors.reset}\n`);
  
  if (report.issues.some(i => i.name.includes('nativewind'))) {
    console.log(`${colors.yellow}1. NativeWind issue detected:${colors.reset}`);
    console.log(`   ${colors.cyan}npm install nativewind@^2.0.11 --legacy-peer-deps${colors.reset}`);
    console.log(`   ${colors.cyan}npm start -- --clear${colors.reset}\n`);
  }
  
  if (report.issues.some(i => i.name.includes('global.css'))) {
    console.log(`${colors.yellow}2. global.css issue detected:${colors.reset}`);
    console.log(`   ${colors.cyan}node fix-ui.js${colors.reset} (auto-fix)\n`);
  }
  
  console.log(`${colors.yellow}IMMEDIATE FIX (works 100%):${colors.reset}`);
  console.log(`   ${colors.green}cp app/(auth)/sign-in-stylesheet.tsx app/(auth)/sign-in.tsx${colors.reset}`);
  console.log(`   ${colors.green}cp app/(auth)/sign-up-stylesheet.tsx app/(auth)/sign-up.tsx${colors.reset}`);
  console.log(`   ${colors.green}npm start -- --clear${colors.reset}\n`);
}

// Save report
const reportPath = 'ui-diagnostic-report.json';
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`${colors.blue}Detailed report saved: ${reportPath}${colors.reset}\n`);

process.exit(report.issues.length > 0 ? 1 : 0);
