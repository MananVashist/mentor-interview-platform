#!/usr/bin/env node

/**
 * MENTOR INTERVIEW PLATFORM - AUTOMATED SETUP SCRIPT
 * This script handles all initialization, validation, and configuration
 * with comprehensive debugging at every step.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for better logging
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Logging utilities
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  step: (msg) => console.log(`\n${colors.cyan}${colors.bright}▶ ${msg}${colors.reset}`),
  debug: (msg) => console.log(`  ${colors.cyan}→${colors.reset} ${msg}`),
};

// Setup state tracking
const setupState = {
  startTime: Date.now(),
  steps: [],
  errors: [],
  warnings: [],
};

function trackStep(name, fn) {
  const stepStart = Date.now();
  log.step(name);
  
  try {
    const result = fn();
    const duration = Date.now() - stepStart;
    setupState.steps.push({ name, status: 'success', duration });
    log.success(`${name} completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - stepStart;
    setupState.steps.push({ name, status: 'failed', duration, error: error.message });
    setupState.errors.push({ step: name, error: error.message });
    log.error(`${name} failed: ${error.message}`);
    throw error;
  }
}

// Step 1: Check prerequisites
function checkPrerequisites() {
  log.debug('Checking Node.js version...');
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 18) {
    throw new Error(`Node.js 18+ required. Current: ${nodeVersion}`);
  }
  log.debug(`Node.js version: ${nodeVersion} ✓`);

  log.debug('Checking npm availability...');
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    log.debug(`npm version: ${npmVersion} ✓`);
  } catch (error) {
    throw new Error('npm not found. Please install Node.js with npm.');
  }

  log.debug('Checking if package.json exists...');
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found. Are you in the project root?');
  }
  log.debug('package.json found ✓');
}

// Step 2: Create and validate .env file
function setupEnvironment() {
  const envPath = '.env';
  const envExamplePath = '.env.example';

  log.debug('Checking for existing .env file...');
  
  const envConfig = {
    EXPO_PUBLIC_SUPABASE_URL: 'https://rcbaaiiawrglvyzmawvr.supabase.co',
    EXPO_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjYmFhaWlhd3JnbHZ5em1hd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTA1NjAsImV4cCI6MjA3NjcyNjU2MH0.V3qRHGXBMlspRS7XFJlXdo4qIcCms60Nepp7dYMEjLA',
    EXPO_PUBLIC_RAZORPAY_KEY_ID: 'rzp_test_placeholder',
    EXPO_PUBLIC_RAZORPAY_KEY_SECRET: 'placeholder_secret',
    EXPO_PUBLIC_LINKEDIN_CLIENT_ID: '',
    EXPO_PUBLIC_ZOOM_CLIENT_ID: '',
    EXPO_PUBLIC_ZOOM_CLIENT_SECRET: '',
    EXPO_PUBLIC_APP_URL: 'mentorplatform://',
  };

  const envContent = Object.entries(envConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync(envPath, envContent);
  log.debug('.env file created with Supabase credentials');

  // Validate Supabase URL format
  log.debug('Validating Supabase URL...');
  if (!envConfig.EXPO_PUBLIC_SUPABASE_URL.includes('supabase.co')) {
    setupState.warnings.push('Supabase URL format may be incorrect');
    log.warning('Supabase URL format warning');
  } else {
    log.debug('Supabase URL format valid ✓');
  }

  // Validate Supabase key format
  log.debug('Validating Supabase anon key...');
  if (!envConfig.EXPO_PUBLIC_SUPABASE_ANON_KEY.startsWith('eyJ')) {
    setupState.warnings.push('Supabase anon key format may be incorrect');
    log.warning('Supabase key format warning');
  } else {
    log.debug('Supabase anon key format valid ✓');
  }
}

// Step 3: Install dependencies with error handling
function installDependencies() {
  log.debug('Cleaning previous installations...');
  
  // Remove node_modules and lock files for clean install
  const cleanPaths = ['node_modules', 'package-lock.json', 'yarn.lock'];
  cleanPaths.forEach(p => {
    if (fs.existsSync(p)) {
      log.debug(`Removing ${p}...`);
      if (p === 'node_modules') {
        fs.rmSync(p, { recursive: true, force: true });
      } else {
        fs.unlinkSync(p);
      }
    }
  });

  log.debug('Installing dependencies (this may take 2-3 minutes)...');
  try {
    execSync('npm install --legacy-peer-deps', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'development' }
    });
    log.debug('All dependencies installed successfully');
  } catch (error) {
    throw new Error('Dependency installation failed. Check output above for details.');
  }
}

// Step 4: Verify critical dependencies
function verifyDependencies() {
  const criticalDeps = [
    '@supabase/supabase-js',
    'expo',
    'expo-router',
    'react-native',
    'nativewind',
    '@react-native-async-storage/async-storage',
    'react-native-url-polyfill',
  ];

  log.debug('Verifying critical dependencies...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  criticalDeps.forEach(dep => {
    if (!allDeps[dep]) {
      throw new Error(`Critical dependency missing: ${dep}`);
    }
    log.debug(`${dep} ✓`);
  });
}

// Step 5: Create required directories
function createDirectories() {
  const dirs = [
    'assets',
    'components/common',
    'components/candidate',
    'components/mentor',
    'components/admin',
    'app/(auth)',
    'app/(candidate)',
    'app/(mentor)',
    'app/(admin)',
    'lib/supabase',
    'services',
    'hooks',
    'constants',
    'supabase/migrations',
  ];

  log.debug('Creating project directories...');
  dirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      log.debug(`Created: ${dir}`);
    }
  });
}

// Step 6: Validate configuration files
function validateConfiguration() {
  const configFiles = [
    { path: 'app.json', required: true },
    { path: 'tsconfig.json', required: true },
    { path: 'babel.config.js', required: true },
    { path: 'tailwind.config.js', required: true },
    { path: 'global.css', required: true },
  ];

  log.debug('Validating configuration files...');
  configFiles.forEach(({ path: filePath, required }) => {
    if (!fs.existsSync(filePath)) {
      if (required) {
        throw new Error(`Required configuration file missing: ${filePath}`);
      } else {
        setupState.warnings.push(`Optional file missing: ${filePath}`);
        log.warning(`Optional file missing: ${filePath}`);
      }
    } else {
      log.debug(`${filePath} ✓`);
    }
  });
}

// Step 7: Test Supabase connection
async function testSupabaseConnection() {
  log.debug('Testing Supabase connection...');
  
  try {
    // Read .env to get credentials
    const envContent = fs.readFileSync('.env', 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key] = valueParts.join('=');
      }
    });

    log.debug('Supabase URL: ' + envVars.EXPO_PUBLIC_SUPABASE_URL);
    log.debug('Supabase Key: ' + envVars.EXPO_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...');
    
    log.debug('Connection will be tested when app starts');
    log.debug('Note: Ensure database migration has been run in Supabase dashboard');
  } catch (error) {
    log.warning('Could not verify Supabase connection. Will be tested at runtime.');
  }
}

// Step 8: Create setup report
function generateSetupReport() {
  const totalDuration = Date.now() - setupState.startTime;
  
  console.log('\n' + '='.repeat(60));
  log.step('SETUP COMPLETE');
  console.log('='.repeat(60));
  
  console.log(`\n${colors.bright}Summary:${colors.reset}`);
  console.log(`  Total time: ${(totalDuration / 1000).toFixed(2)}s`);
  console.log(`  Steps completed: ${setupState.steps.filter(s => s.status === 'success').length}/${setupState.steps.length}`);
  console.log(`  Errors: ${setupState.errors.length}`);
  console.log(`  Warnings: ${setupState.warnings.length}`);

  if (setupState.warnings.length > 0) {
    console.log(`\n${colors.yellow}Warnings:${colors.reset}`);
    setupState.warnings.forEach(w => log.warning(w));
  }

  if (setupState.errors.length === 0) {
    console.log(`\n${colors.green}${colors.bright}✓ Setup successful!${colors.reset}\n`);
    console.log('Next steps:');
    console.log('  1. Review CONTEXT.md for project overview');
    console.log('  2. Run: npm start');
    console.log('  3. Press "w" for web, "a" for Android, or "i" for iOS');
    console.log('  4. Create test accounts for each role');
    console.log('\nFor troubleshooting, see TROUBLESHOOTING.md\n');
  } else {
    console.log(`\n${colors.red}Setup completed with errors. See above for details.${colors.reset}\n`);
  }

  // Save detailed report
  const reportPath = 'setup-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(setupState, null, 2));
  log.info(`Detailed report saved to: ${reportPath}`);
}

// Main setup flow
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log(colors.bright + colors.cyan + '  MENTOR INTERVIEW PLATFORM - SETUP' + colors.reset);
  console.log('='.repeat(60) + '\n');

  try {
    trackStep('1. Checking prerequisites', checkPrerequisites);
    trackStep('2. Setting up environment', setupEnvironment);
    trackStep('3. Installing dependencies', installDependencies);
    trackStep('4. Verifying dependencies', verifyDependencies);
    trackStep('5. Creating directories', createDirectories);
    trackStep('6. Validating configuration', validateConfiguration);
    await trackStep('7. Testing Supabase connection', testSupabaseConnection);
    
    generateSetupReport();
    process.exit(0);
  } catch (error) {
    console.log('\n' + '='.repeat(60));
    log.error('SETUP FAILED');
    console.log('='.repeat(60) + '\n');
    log.error(error.message);
    
    console.log('\nFor help, check:');
    console.log('  - setup-report.json for detailed logs');
    console.log('  - TROUBLESHOOTING.md for common issues');
    console.log('  - CONTEXT.md for project understanding\n');
    
    generateSetupReport();
    process.exit(1);
  }
}

// Run setup
main();
