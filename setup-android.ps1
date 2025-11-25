[CmdletBinding()]
param(
  [switch]$FullReset
)

$ErrorActionPreference = "Stop"

# --- Helper Functions ---
function Write-Info($msg)  { Write-Host "[INFO ] $msg" -ForegroundColor Cyan }
function Write-Warn($msg)  { Write-Host "[WARN ] $msg" -ForegroundColor Yellow }
function Write-Success($msg){ Write-Host "[OK   ] $msg" -ForegroundColor Green }
function Write-ErrMsg($msg){ Write-Host "[ERROR] $msg" -ForegroundColor Red }

# 0) Resolve paths
$projectRoot = $PSScriptRoot
if (-not $projectRoot) { $projectRoot = (Get-Location).Path }
$androidDir  = Join-Path $projectRoot "android"

Write-Info "Project root: $projectRoot"
Set-Location $projectRoot

# 1) Environment Checks
Write-Info "===== ENVIRONMENT CHECKS ====="
if (-not $env:JAVA_HOME) { 
    Write-ErrMsg "JAVA_HOME is not set. Android build will fail."
    exit 1 
}
if (-not $env:ANDROID_HOME) { 
    Write-ErrMsg "ANDROID_HOME is not set. Android build will fail."
    exit 1 
}
Write-Success "Environment variables found."

# 2) Config Checks
Write-Info "===== CONFIG CHECKS ====="
if (-not (Test-Path "tsconfig.json")) { Write-Warn "Missing tsconfig.json!" }
if (-not (Test-Path "babel.config.js")) { Write-Warn "Missing babel.config.js! Path aliases will fail." }

# 3) Full Reset & Cache Clearing
if ($FullReset) {
  Write-Info "Full reset requested..."
  
  # Aggressive Metro Cache Clearing
  Write-Info "Clearing Metro/Haste caches in TEMP..."
  Get-ChildItem $env:TEMP -Filter "metro-*" -Recurse -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
  Get-ChildItem $env:TEMP -Filter "haste-map-*" -Recurse -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
  
  # Remove project folders
  $dirsToRemove = @("node_modules", "android", "ios", ".expo")
  foreach ($d in $dirsToRemove) {
    if (Test-Path $d) { Remove-Item -Recurse -Force $d; Write-Info "Removed $d" }
  }
  
  # Remove locks
  foreach ($f in "package-lock.json","yarn.lock","pnpm-lock.yaml") {
    if (Test-Path $f) { Remove-Item -Force $f }
  }
}

# 4) Install Dependencies
Write-Info "Installing dependencies..."
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) { Write-ErrMsg "npm install failed."; exit 1 }

# 5) Fix Expo Dependencies
Write-Info "Aligning Expo dependencies..."
npx expo install --fix
if ($LASTEXITCODE -ne 0) { Write-ErrMsg "Expo dependency alignment failed."; exit 1 }

# 6) Prebuild (Regenerate Android folder)
Write-Info "Running Prebuild..."
npx expo prebuild --clean --platform android
if ($LASTEXITCODE -ne 0) { Write-ErrMsg "Prebuild failed."; exit 1 }

# 7) Verify and Fix build.gradle Configuration
Write-Info "===== VERIFYING BUILD.GRADLE ====="
$buildGradlePath = Join-Path $androidDir "app\build.gradle"

if (-not (Test-Path $buildGradlePath)) {
    Write-ErrMsg "build.gradle not found at $buildGradlePath"
    exit 1
}

Write-Info "Reading build.gradle..."
$buildGradleContent = Get-Content $buildGradlePath -Raw

# Check 1: Verify bundleCommand is set
if ($buildGradleContent -notmatch 'bundleCommand\s*=\s*"export:embed"') {
    Write-Warn "bundleCommand not set correctly. Fixing..."
    $buildGradleContent = $buildGradleContent -replace '(react\s*\{[^}]*)', "`$1`n    bundleCommand = `"export:embed`"`n"
    Set-Content $buildGradlePath -Value $buildGradleContent -NoNewline
    Write-Success "Fixed bundleCommand"
} else {
    Write-Success "bundleCommand is correctly set"
}

# Check 2: Verify release signing config exists
if ($buildGradleContent -notmatch 'signingConfigs\s*\{[^}]*release\s*\{') {
    Write-Warn "Release signing config missing. Adding..."
    
    # Add release signing config after debug config
    $releaseConfig = @"
        release {
            // Using debug keystore for testing (DO NOT USE IN PRODUCTION)
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
"@
    
    $buildGradleContent = $buildGradleContent -replace '(debug\s*\{[^}]*\})', "`$1`n$releaseConfig"
    Set-Content $buildGradlePath -Value $buildGradleContent -NoNewline
    Write-Success "Added release signing config"
} else {
    Write-Success "Release signing config exists"
}

# Check 3: Verify release buildType uses release signing
if ($buildGradleContent -notmatch 'release\s*\{[^}]*signingConfig\s+signingConfigs\.release') {
    Write-Warn "Release buildType not using release signing config. Fixing..."
    $buildGradleContent = $buildGradleContent -replace '(buildTypes\s*\{[^}]*release\s*\{)', "`$1`n            signingConfig signingConfigs.release"
    Set-Content $buildGradlePath -Value $buildGradleContent -NoNewline
    Write-Success "Fixed release buildType signing"
} else {
    Write-Success "Release buildType correctly configured"
}

# Check 4: Verify debug.keystore exists
$debugKeystore = Join-Path $androidDir "app\debug.keystore"
if (-not (Test-Path $debugKeystore)) {
    Write-Warn "debug.keystore not found. Generating..."
    
    # Generate debug keystore
    $keytoolCmd = "keytool"
    $keystoreDir = Join-Path $androidDir "app"
    
    & $keytoolCmd -genkeypair -v -keystore "$debugKeystore" -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Generated debug.keystore"
    } else {
        Write-Warn "Could not generate keystore. Build might fail."
    }
} else {
    Write-Success "debug.keystore exists"
}

Write-Success "===== BUILD.GRADLE VERIFICATION COMPLETE ====="

# 8) Build RELEASE APK (with bundled JavaScript)
Write-Info "Building Android RELEASE APK (this will take a few minutes)..."
Set-Location $androidDir
$gradleWrapper = ".\gradlew.bat"

# Clean and build release APK
& $gradleWrapper clean assembleRelease
if ($LASTEXITCODE -eq 0) {
  $apkPath = Join-Path $androidDir "app\build\outputs\apk\release\app-release.apk"
  Write-Success "BUILD SUCCESSFUL!"
  Write-Success "========================================="
  Write-Info "APK Location: $apkPath"
  Write-Success "========================================="
  Write-Info "You can now install this APK on any Android device!"
  Write-Info "To install via ADB: adb install -r `"$apkPath`""
  
  # Optional: Auto-install if device connected
  # & adb install -r $apkPath
} else {
  Write-ErrMsg "Android build failed."
  Write-Warn "Common issues:"
  Write-Warn "1. Make sure you have a keystore configured (see android/app/build.gradle)"
  Write-Warn "2. Check that all dependencies are installed correctly"
  Write-Warn "3. Ensure JAVA_HOME and ANDROID_HOME are set correctly"
  exit 1
}