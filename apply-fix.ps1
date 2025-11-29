# Android Build Fix Script for PowerShell
# This script applies all the fixes for the Android build error

Write-Host ""
Write-Host "Starting Android Build Fix..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Backup existing files
Write-Host "Step 1/6: Creating backup of existing files..." -ForegroundColor Yellow

if (-not (Test-Path "backup")) {
    New-Item -ItemType Directory -Path "backup" | Out-Null
}

Copy-Item "package.json" "backup/package.json" -Force -ErrorAction SilentlyContinue
Copy-Item "app.json" "backup/app.json" -Force -ErrorAction SilentlyContinue
Copy-Item "eas.json" "backup/eas.json" -Force -ErrorAction SilentlyContinue
Copy-Item "metro.config.js" "backup/metro.config.js" -Force -ErrorAction SilentlyContinue

Write-Host "[OK] Backup created in .\backup\" -ForegroundColor Green
Write-Host ""

# Step 2: Check Node version
Write-Host "Step 2/6: Checking Node.js version..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js version: $nodeVersion" -ForegroundColor Green
    
    # Extract major version number
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 18) {
        Write-Host "[ERROR] Node.js version must be 18 or higher" -ForegroundColor Red
        Write-Host "Current version: $nodeVersion" -ForegroundColor Red
        Write-Host "Please upgrade Node.js: https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "[ERROR] Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js 18 or higher: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Step 3: Clean old installation
Write-Host "Step 3/6: Cleaning old dependencies..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Remove-Item "node_modules" -Recurse -Force
}

if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force
}

if (Test-Path ".expo") {
    Remove-Item ".expo" -Recurse -Force
}

Write-Host "[OK] Cleaned old dependencies" -ForegroundColor Green
Write-Host ""

# Step 4: Install dependencies
Write-Host "Step 4/6: Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray

$installResult = npm install --legacy-peer-deps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
    Write-Host $installResult -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Dependencies installed" -ForegroundColor Green
Write-Host ""

# Step 5: Install EAS CLI if not present
Write-Host "Step 5/6: Checking EAS CLI..." -ForegroundColor Yellow

$easInstalled = Get-Command eas -ErrorAction SilentlyContinue

if (-not $easInstalled) {
    Write-Host "Installing EAS CLI globally..." -ForegroundColor Gray
    npm install -g eas-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install EAS CLI" -ForegroundColor Red
        exit 1
    }
    Write-Host "[OK] EAS CLI installed" -ForegroundColor Green
} else {
    Write-Host "[OK] EAS CLI already installed" -ForegroundColor Green
}
Write-Host ""

# Step 6: Verify setup
Write-Host "Step 6/6: Verifying setup..." -ForegroundColor Yellow

$allGood = $true

$requiredFiles = @(
    "package.json",
    "app.json",
    "eas.json",
    "metro.config.js",
    "babel.config.js",
    "tsconfig.json"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "[OK] $file exists" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] $file missing" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host ""

if ($allGood) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "[SUCCESS] All files are in place!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Login to Expo:" -ForegroundColor White
    Write-Host "   eas login" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "2. Configure EAS for your project:" -ForegroundColor White
    Write-Host "   eas build:configure" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "3. Update the projectId in app.json with the ID from step 2" -ForegroundColor White
    Write-Host ""
    Write-Host "4. Test the development server:" -ForegroundColor White
    Write-Host "   npm start" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "5. Build for Android:" -ForegroundColor White
    Write-Host "   eas build --platform android --profile development" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "For detailed instructions, see BUILD_FIX.md" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "[ERROR] Some files are missing!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please make sure you have copied all the corrected files." -ForegroundColor Yellow
    Write-Host "See BUILD_FIX.md for the complete list." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}