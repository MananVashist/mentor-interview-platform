#!/usr/bin/env node

/**
 * PRE-FLIGHT CHECK
 * Runs before app starts to catch common issues early
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let errors = 0;
let warnings = 0;

function check(name, condition, errorMsg, isWarning = false) {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${name}`);
    return true;
  } else {
    if (isWarning) {
      console.log(`${colors.yellow}⚠${colors.reset} ${name}: ${errorMsg}`);
      warnings++;
    } else {
      console.log(`${colors.red}✗${colors.reset} ${name}: ${errorMsg}`);
      errors++;
    }
    return false;
  }
}

console.log(`\n${colors.blue}Pre-flight Checks${colors.reset}\n`);

// Check 1: Node version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
check('Node.js version', majorVersion >= 18, `Node 18+ required, found ${nodeVersion}`);

// Check 2: package.json exists
check('package.json', fs.existsSync('package.json'), 'package.json not found');

// Check 3: node_modules exists
check('Dependencies installed', fs.existsSync('node_modules'), 'Run: node setup.js', false);

// Check 4: .env file exists
check('.env file', fs.existsSync('.env'), 'Run: node setup.js to create .env');

// Check 5: Required directories
const requiredDirs = ['app', 'lib', 'services', 'components'];
requiredDirs.forEach(dir => {
  check(`Directory: ${dir}`, fs.existsSync(dir), `Missing ${dir} directory`);
});

// Check 6: Critical files
const criticalFiles = [
  'app/_layout.tsx',
  'lib/supabase/client.ts',
  'lib/types.ts',
  'global.css',
  'tailwind.config.js',
  'babel.config.js',
];
criticalFiles.forEach(file => {
  check(`File: ${file}`, fs.existsSync(file), `Missing ${file}`);
});

// Check 7: Environment variables
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  const hasSupabaseUrl = envContent.includes('EXPO_PUBLIC_SUPABASE_URL=https://');
  const hasSupabaseKey = envContent.includes('EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ');
  
  check('Supabase URL configured', hasSupabaseUrl, 'Update .env with Supabase URL');
  check('Supabase Key configured', hasSupabaseKey, 'Update .env with Supabase anon key');
}

// Check 8: Supabase migration file
check(
  'Database migration',
  fs.existsSync('supabase/migrations/001_initial_schema.sql'),
  'Migration file missing'
);

// Summary
console.log(`\n${colors.blue}Summary${colors.reset}`);
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}\n`);

if (errors > 0) {
  console.log(`${colors.red}❌ Pre-flight failed! Fix errors above before starting.${colors.reset}`);
  console.log(`${colors.yellow}Hint: Run 'node setup.js' to fix common issues${colors.reset}\n`);
  process.exit(1);
} else if (warnings > 0) {
  console.log(`${colors.yellow}⚠️  Pre-flight passed with warnings${colors.reset}`);
  console.log(`${colors.green}You can proceed but check warnings above${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.green}✅ All checks passed! Ready to start.${colors.reset}\n`);
  process.exit(0);
}
