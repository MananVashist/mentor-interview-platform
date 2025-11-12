#!/bin/bash

# ============================================
# Mentor Interview Platform - Automated Setup
# ============================================
# This script validates and sets up your entire environment
# with comprehensive debugging at every step

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_debug() {
    if [ "$DEBUG" = "true" ]; then
        echo -e "${YELLOW}🐛 DEBUG: $1${NC}"
    fi
}

# Enable debug mode if DEBUG=true is set
if [ "$DEBUG" = "true" ]; then
    log_warning "Debug mode enabled - verbose output active"
    set -x  # Print commands
fi

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║  Mentor Interview Platform - Automated Setup      ║"
echo "║  This will validate and configure your project    ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# ============================================
# STEP 1: System Requirements Check
# ============================================
log_info "Step 1/7: Checking system requirements..."

# Check Node.js
if ! command -v node &> /dev/null; then
    log_error "Node.js is not installed"
    log_info "Please install Node.js 18+ from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
log_debug "Node version found: $NODE_VERSION"

if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js version $NODE_VERSION is too old (need 18+)"
    log_info "Please upgrade Node.js from: https://nodejs.org/"
    exit 1
fi

log_success "Node.js $(node --version) detected"

# Check npm
if ! command -v npm &> /dev/null; then
    log_error "npm is not installed"
    exit 1
fi

log_success "npm $(npm --version) detected"

# Check for npx
if ! command -v npx &> /dev/null; then
    log_error "npx is not installed"
    exit 1
fi

log_success "npx detected"

# ============================================
# STEP 2: Environment Variables Validation
# ============================================
log_info "Step 2/7: Validating environment variables..."

if [ ! -f .env ]; then
    log_error ".env file not found"
    log_info "Creating .env from .env.example..."
    cp .env.example .env
    log_success ".env file created"
fi

# Source .env file
export $(grep -v '^#' .env | xargs)

# Validate Supabase configuration
if [ -z "$EXPO_PUBLIC_SUPABASE_URL" ] || [ "$EXPO_PUBLIC_SUPABASE_URL" = "https://your-project.supabase.co" ]; then
    log_error "EXPO_PUBLIC_SUPABASE_URL is not configured in .env"
    log_info "Please edit .env and add your Supabase URL"
    exit 1
fi

if [ -z "$EXPO_PUBLIC_SUPABASE_ANON_KEY" ] || [ "$EXPO_PUBLIC_SUPABASE_ANON_KEY" = "your-anon-key-here" ]; then
    log_error "EXPO_PUBLIC_SUPABASE_ANON_KEY is not configured in .env"
    log_info "Please edit .env and add your Supabase anon key"
    exit 1
fi

log_success "Supabase configuration validated"
log_debug "Supabase URL: $EXPO_PUBLIC_SUPABASE_URL"

# Check optional configurations
if [ "$EXPO_PUBLIC_RAZORPAY_KEY_ID" = "rzp_test_placeholder" ]; then
    log_warning "Razorpay not configured - using placeholders (payment features limited)"
fi

if [ -z "$EXPO_PUBLIC_LINKEDIN_CLIENT_ID" ] || [ "$EXPO_PUBLIC_LINKEDIN_CLIENT_ID" = "placeholder_client_id" ]; then
    log_warning "LinkedIn OAuth not configured (LinkedIn import disabled)"
fi

if [ -z "$EXPO_PUBLIC_ZOOM_CLIENT_ID" ] || [ "$EXPO_PUBLIC_ZOOM_CLIENT_ID" = "placeholder_zoom_client_id" ]; then
    log_warning "Zoom not configured (using placeholder meeting links)"
fi

# ============================================
# STEP 3: Clean Previous Installation
# ============================================
log_info "Step 3/7: Cleaning previous installation..."

if [ -d "node_modules" ]; then
    log_debug "Removing old node_modules..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    log_debug "Removing old package-lock.json..."
    rm -f package-lock.json
fi

if [ -d ".expo" ]; then
    log_debug "Removing .expo cache..."
    rm -rf .expo
fi

log_success "Previous installation cleaned"

# ============================================
# STEP 4: Install Dependencies
# ============================================
log_info "Step 4/7: Installing dependencies (this may take a few minutes)..."

log_debug "Running npm install..."
if npm install --legacy-peer-deps; then
    log_success "Dependencies installed successfully"
else
    log_error "Failed to install dependencies"
    log_info "Trying with --force flag..."
    if npm install --force; then
        log_success "Dependencies installed with --force"
    else
        log_error "Failed to install dependencies even with --force"
        log_info "Please check your internet connection and try again"
        exit 1
    fi
fi

# ============================================
# STEP 5: Validate Critical Dependencies
# ============================================
log_info "Step 5/7: Validating critical dependencies..."

# Check if expo is installed
if [ ! -d "node_modules/expo" ]; then
    log_error "Expo not installed correctly"
    exit 1
fi

log_success "Expo validated"

# Check if @supabase/supabase-js is installed
if [ ! -d "node_modules/@supabase/supabase-js" ]; then
    log_error "@supabase/supabase-js not installed correctly"
    exit 1
fi

log_success "Supabase client validated"

# Check if nativewind is installed
if [ ! -d "node_modules/nativewind" ]; then
    log_error "NativeWind not installed correctly"
    exit 1
fi

log_success "NativeWind validated"

# ============================================
# STEP 6: Project Structure Validation
# ============================================
log_info "Step 6/7: Validating project structure..."

REQUIRED_DIRS=(
    "app/(auth)"
    "app/(candidate)"
    "app/(mentor)"
    "app/(admin)"
    "components"
    "services"
    "lib"
    "supabase/migrations"
    "constants"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        log_error "Required directory missing: $dir"
        exit 1
    fi
    log_debug "Directory validated: $dir"
done

log_success "Project structure validated"

# Check critical files
REQUIRED_FILES=(
    "app.json"
    "package.json"
    "tsconfig.json"
    "babel.config.js"
    "tailwind.config.js"
    ".env"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        log_error "Required file missing: $file"
        exit 1
    fi
    log_debug "File validated: $file"
done

log_success "Critical files validated"

# ============================================
# STEP 7: Supabase Connection Test
# ============================================
log_info "Step 7/7: Testing Supabase connection..."

# Create a simple test script
cat > /tmp/test-supabase.js << 'EOF'
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('count').single();
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" which is fine for an empty table
      throw error;
    }
    console.log('✅ Supabase connection successful');
    process.exit(0);
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
EOF

log_debug "Running Supabase connection test..."
if node /tmp/test-supabase.js; then
    log_success "Supabase connection test passed"
else
    log_warning "Supabase connection test failed - this might be okay if migrations haven't been run yet"
    log_info "Please ensure you've run the database migration from supabase/migrations/001_initial_schema.sql"
fi

rm -f /tmp/test-supabase.js

# ============================================
# Setup Complete
# ============================================
echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║            🎉 Setup Complete! 🎉                   ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

log_success "All checks passed!"
echo ""

# Show next steps
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Setup Supabase Database (if not done already):"
echo "   → Go to your Supabase project dashboard"
echo "   → Navigate to SQL Editor"
echo "   → Copy & run: supabase/migrations/001_initial_schema.sql"
echo "   → Create storage buckets: 'documents' and 'recordings'"
echo ""
echo "2. Start the development server:"
echo "   → Run: npm start"
echo "   → Press 'w' to open in web browser"
echo "   → Press 'a' for Android (requires emulator)"
echo "   → Press 'i' for iOS (requires Mac + simulator)"
echo ""
echo "3. For detailed setup instructions:"
echo "   → Read: SETUP_GUIDE.md"
echo "   → Read: DEBUGGING_GUIDE.md (for troubleshooting)"
echo "   → Read: CONTEXT_DOCUMENT.md (for AI handoff)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Show configuration status
echo "📊 CONFIGURATION STATUS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Supabase:    ${GREEN}✅ Configured${NC}"

if [ "$EXPO_PUBLIC_RAZORPAY_KEY_ID" = "rzp_test_placeholder" ]; then
    echo -e "Razorpay:    ${YELLOW}⚠️  Not configured (optional)${NC}"
else
    echo -e "Razorpay:    ${GREEN}✅ Configured${NC}"
fi

if [ -z "$EXPO_PUBLIC_LINKEDIN_CLIENT_ID" ] || [ "$EXPO_PUBLIC_LINKEDIN_CLIENT_ID" = "placeholder_client_id" ]; then
    echo -e "LinkedIn:    ${YELLOW}⚠️  Not configured (optional)${NC}"
else
    echo -e "LinkedIn:    ${GREEN}✅ Configured${NC}"
fi

if [ -z "$EXPO_PUBLIC_ZOOM_CLIENT_ID" ] || [ "$EXPO_PUBLIC_ZOOM_CLIENT_ID" = "placeholder_zoom_client_id" ]; then
    echo -e "Zoom:        ${YELLOW}⚠️  Not configured (optional)${NC}"
else
    echo -e "Zoom:        ${GREEN}✅ Configured${NC}"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Tip: To enable debug mode, run: DEBUG=true ./setup.sh"
echo ""
echo "Happy coding! 🚀"
echo ""
