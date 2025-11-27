#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Local Android Production Build Script for CrackJobs
    
.DESCRIPTION
    Builds a production-ready APK locally without EAS Build.
    Handles all prerequisites, configuration, and signing automatically.
    
.PARAMETER Clean
    Performs a clean build (removes android folder and rebuilds)
    
.PARAMETER SkipPrebuild
    Skips expo prebuild if android folder already exists
    
.EXAMPLE
    .\build-local-apk.ps1
    
.EXAMPLE
    .\build-local-apk.ps1 -Clean
#>

[CmdletBinding()]
param(
    [switch]$Clean,
    [switch]$SkipPrebuild
)

$ErrorActionPreference = "Stop"

# ============================================
# CONFIGURATION
# ============================================
$APP_NAME = "CrackJobs"
$PACKAGE_NAME = "com.crackjobs.app"
$VERSION_CODE = 1
$VERSION_NAME = "1.0.0"

# Keystore configuration (for production, use proper keystore)
$KEYSTORE_FILE = "crackjobs-release.keystore"
$KEYSTORE_ALIAS = "crackjobs-key"
$KEYSTORE_PASSWORD = "crackjobs2024"  # CHANGE THIS IN PRODUCTION!
$KEY_PASSWORD = "crackjobs2024"        # CHANGE THIS IN PRODUCTION!

# ============================================
# HELPER FUNCTIONS
# ============================================
function Write-Header($text) {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step($number, $total, $text) {
    Write-Host ""
    Write-Host "[$number/$total] $text" -ForegroundColor Yellow
    Write-Host ""
}

function Write-Success($text) {
    Write-Host "✓ $text" -ForegroundColor Green
}

function Write-Info($text) {
    Write-Host "ℹ $text" -ForegroundColor Cyan
}

function Write-Warning($text) {
    Write-Host "⚠ $text" -ForegroundColor Yellow
}

function Write-Error-Custom($text) {
    Write-Host "✗ $text" -ForegroundColor Red
}

function Test-Command($command) {
    try {
        Get-Command $command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# ============================================
# START BUILD PROCESS
# ============================================
Write-Header "LOCAL ANDROID PRODUCTION BUILD - $APP_NAME"

Write-Info "Build Configuration:"
Write-Host "  App Name:     $APP_NAME"
Write-Host "  Package:      $PACKAGE_NAME"
Write-Host "  Version Code: $VERSION_CODE"
Write-Host "  Version Name: $VERSION_NAME"
Write-Host ""

$projectRoot = $PSScriptRoot
if (-not $projectRoot) { $projectRoot = (Get-Location).Path }
$androidDir = Join-Path $projectRoot "android"
$keystorePath = Join-Path $androidDir "app" $KEYSTORE_FILE

Write-Info "Project Root: $projectRoot"
Set-Location $projectRoot

# ============================================
# STEP 1: PREREQUISITES CHECK
# ============================================
Write-Step 1 10 "Checking Prerequisites"

# Check Node.js
if (-not (Test-Command "node")) {
    Write-Error-Custom "Node.js not found!"
    Write-Info "Install Node.js 18+ from: https://nodejs.org/"
    exit 1
}
$nodeVersion = node --version
Write-Success "Node.js: $nodeVersion"

# Check Java (JDK)
if (-not $env:JAVA_HOME) {
    Write-Error-Custom "JAVA_HOME environment variable not set!"
    Write-Info "Install JDK 17 and set JAVA_HOME"
    Write-Info "Download: https://adoptium.net/"
    exit 1
}
Write-Success "JAVA_HOME: $env:JAVA_HOME"

# Verify Java executable
$javaExe = Join-Path $env:JAVA_HOME "bin\java.exe"
if (-not (Test-Path $javaExe)) {
    Write-Error-Custom "Java executable not found at: $javaExe"
    exit 1
}

try {
    $javaVersion = & $javaExe -version 2>&1 | Select-Object -First 1
    Write-Success "Java: $javaVersion"
} catch {
    Write-Error-Custom "Failed to run Java"
    exit 1
}

# Check Android SDK
if (-not $env:ANDROID_HOME) {
    Write-Error-Custom "ANDROID_HOME environment variable not set!"
    Write-Info "Install Android Studio and set ANDROID_HOME"
    Write-Info "Usually: C:\Users\<Username>\AppData\Local\Android\Sdk"
    exit 1
}
Write-Success "ANDROID_HOME: $env:ANDROID_HOME"

# Check keytool
$keytool = Join-Path $env:JAVA_HOME "bin\keytool.exe"
if (-not (Test-Path $keytool)) {
    Write-Error-Custom "keytool not found in JDK"
    exit 1
}
Write-Success "keytool found"

# ============================================
# STEP 2: CLEAN PREVIOUS BUILD (if requested)
# ============================================
if ($Clean) {
    Write-Step 2 10 "Cleaning Previous Build"
    
    if (Test-Path $androidDir) {
        Write-Info "Removing android folder..."
        Remove-Item $androidDir -Recurse -Force
        Write-Success "Cleaned android folder"
    }
    
    if (Test-Path ".expo") {
        Write-Info "Removing .expo folder..."
        Remove-Item ".expo" -Recurse -Force
        Write-Success "Cleaned .expo folder"
    }
    
    if (Test-Path "node_modules\.cache") {
        Write-Info "Removing node_modules cache..."
        Remove-Item "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Success "Cleaned cache"
    }
} else {
    Write-Step 2 10 "Clean Build (Skipped - use -Clean flag to enable)"
}

# ============================================
# STEP 3: INSTALL/UPDATE DEPENDENCIES
# ============================================
Write-Step 3 10 "Installing Dependencies"

Write-Info "Running npm install..."
npm install --legacy-peer-deps | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "npm install failed"
    exit 1
}
Write-Success "Dependencies installed"

# ============================================
# STEP 4: RUN EXPO PREBUILD
# ============================================
if (-not $SkipPrebuild -or -not (Test-Path $androidDir)) {
    Write-Step 4 10 "Running Expo Prebuild (Generating Android Project)"
    
    Write-Info "This will generate the native Android project..."
    npx expo prebuild --clean --platform android
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Expo prebuild failed"
        exit 1
    }
    
    if (-not (Test-Path $androidDir)) {
        Write-Error-Custom "Android folder not generated"
        exit 1
    }
    
    Write-Success "Android project generated"
} else {
    Write-Step 4 10 "Expo Prebuild (Skipped - android folder exists)"
    Write-Info "Use -Clean to force regeneration"
}

# ============================================
# STEP 5: GENERATE/VERIFY KEYSTORE
# ============================================
Write-Step 5 10 "Setting Up Release Keystore"

$keystoreDir = Join-Path $androidDir "app"
if (-not (Test-Path $keystoreDir)) {
    New-Item -ItemType Directory -Path $keystoreDir -Force | Out-Null
}

if (-not (Test-Path $keystorePath)) {
    Write-Info "Generating release keystore..."
    Write-Warning "IMPORTANT: For production, use a secure keystore and store credentials safely!"
    
    $dname = "CN=$APP_NAME, OU=Mobile, O=$APP_NAME, L=Bengaluru, ST=Karnataka, C=IN"
    
    & $keytool -genkeypair `
        -v `
        -keystore $keystorePath `
        -alias $KEYSTORE_ALIAS `
        -keyalg RSA `
        -keysize 2048 `
        -validity 10000 `
        -storepass $KEYSTORE_PASSWORD `
        -keypass $KEY_PASSWORD `
        -dname $dname
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Keystore generation failed"
        exit 1
    }
    
    Write-Success "Keystore generated: $KEYSTORE_FILE"
    Write-Warning "BACKUP THIS FILE! You need it for future updates!"
} else {
    Write-Success "Using existing keystore: $KEYSTORE_FILE"
}

# ============================================
# STEP 6: CONFIGURE BUILD.GRADLE
# ============================================
Write-Step 6 10 "Configuring build.gradle for Release"

$buildGradlePath = Join-Path $androidDir "app\build.gradle"
if (-not (Test-Path $buildGradlePath)) {
    Write-Error-Custom "build.gradle not found at: $buildGradlePath"
    exit 1
}

Write-Info "Reading build.gradle..."
$buildGradleContent = Get-Content $buildGradlePath -Raw

# Ensure signingConfigs section exists with release config
if ($buildGradleContent -notmatch 'signingConfigs\s*\{') {
    Write-Info "Adding signingConfigs section..."
    
    $signingConfigBlock = @"

    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            storeFile file('$KEYSTORE_FILE')
            storePassword '$KEYSTORE_PASSWORD'
            keyAlias '$KEYSTORE_ALIAS'
            keyPassword '$KEY_PASSWORD'
        }
    }
"@
    
    # Insert before buildTypes
    $buildGradleContent = $buildGradleContent -replace '(\s+buildTypes\s*\{)', "$signingConfigBlock`n`$1"
} else {
    # Update existing release config
    if ($buildGradleContent -notmatch 'signingConfigs\s*\{[^}]*release\s*\{') {
        Write-Info "Adding release signing config..."
        
        $releaseConfig = @"
        release {
            storeFile file('$KEYSTORE_FILE')
            storePassword '$KEYSTORE_PASSWORD'
            keyAlias '$KEYSTORE_ALIAS'
            keyPassword '$KEY_PASSWORD'
        }
"@
        $buildGradleContent = $buildGradleContent -replace '(signingConfigs\s*\{[^}]*)(debug\s*\{[^}]*\})', "`$1`$2`n$releaseConfig"
    } else {
        Write-Info "Updating existing release signing config..."
        $buildGradleContent = $buildGradleContent -replace "storeFile file\('.*?'\)", "storeFile file('$KEYSTORE_FILE')"
        $buildGradleContent = $buildGradleContent -replace "storePassword\s+'.*?'", "storePassword '$KEYSTORE_PASSWORD'"
        $buildGradleContent = $buildGradleContent -replace "keyAlias\s+'.*?'", "keyAlias '$KEYSTORE_ALIAS'"
        $buildGradleContent = $buildGradleContent -replace "keyPassword\s+'.*?'", "keyPassword '$KEY_PASSWORD'"
    }
}

# Ensure release buildType uses release signing
if ($buildGradleContent -notmatch 'buildTypes\s*\{[^}]*release\s*\{[^}]*signingConfig\s+signingConfigs\.release') {
    Write-Info "Configuring release buildType to use release signing..."
    $buildGradleContent = $buildGradleContent -replace '(buildTypes\s*\{[^}]*release\s*\{)', "`$1`n            signingConfig signingConfigs.release"
}

# Ensure minifyEnabled is set
if ($buildGradleContent -notmatch 'buildTypes\s*\{[^}]*release\s*\{[^}]*minifyEnabled') {
    Write-Info "Enabling minification for release..."
    $buildGradleContent = $buildGradleContent -replace '(buildTypes\s*\{[^}]*release\s*\{)', "`$1`n            minifyEnabled true"
}

# Set bundleCommand for Expo
if ($buildGradleContent -notmatch 'bundleCommand\s*=') {
    Write-Info "Setting bundle command for Expo..."
    $buildGradleContent = $buildGradleContent -replace '(project\.ext\.react\s*=\s*\[)', "`$1`n        bundleCommand: `"export:embed`","
}

Set-Content $buildGradlePath -Value $buildGradleContent -NoNewline
Write-Success "build.gradle configured for release"

# ============================================
# STEP 7: CONFIGURE GRADLE PROPERTIES
# ============================================
Write-Step 7 10 "Configuring Gradle Properties"

$gradlePropsPath = Join-Path $androidDir "gradle.properties"
$gradleProps = @"
# Project-wide Gradle settings
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.configureondemand=true

# AndroidX
android.useAndroidX=true
android.enableJetifier=true

# React Native
hermesEnabled=true

# Enable R8
android.enableR8=true
android.enableR8.fullMode=true
"@

Set-Content $gradlePropsPath -Value $gradleProps
Write-Success "gradle.properties configured"

# ============================================
# STEP 8: CREATE local.properties
# ============================================
Write-Step 8 10 "Creating local.properties"

$localPropsPath = Join-Path $androidDir "local.properties"
$localProps = "sdk.dir=$($env:ANDROID_HOME -replace '\\', '/')"
Set-Content $localPropsPath -Value $localProps
Write-Success "local.properties created"

# ============================================
# STEP 9: BUILD RELEASE APK
# ============================================
Write-Step 9 10 "Building Release APK"

Write-Info "This may take 5-10 minutes..."
Write-Info "Building with Gradle..."

Set-Location $androidDir

# Make gradlew executable (for cross-platform compatibility)
if (Test-Path ".\gradlew.bat") {
    $gradlewCmd = ".\gradlew.bat"
} else {
    $gradlewCmd = ".\gradlew"
}

# Clean first
Write-Info "Cleaning previous build artifacts..."
& $gradlewCmd clean
if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Gradle clean failed"
    Set-Location $projectRoot
    exit 1
}

# Build release APK
Write-Info "Building release APK (this takes time)..."
& $gradlewCmd assembleRelease --stacktrace

if ($LASTEXITCODE -ne 0) {
    Write-Error-Custom "Gradle build failed!"
    Write-Info "Check the error messages above for details"
    Set-Location $projectRoot
    exit 1
}

Set-Location $projectRoot

# ============================================
# STEP 10: VERIFY AND REPORT
# ============================================
Write-Step 10 10 "Build Complete!"

$apkPath = Join-Path $androidDir "app\build\outputs\apk\release\app-release.apk"

if (Test-Path $apkPath) {
    $apkSize = [math]::Round((Get-Item $apkPath).Length / 1MB, 2)
    
    Write-Header "SUCCESS!"
    
    Write-Success "APK built successfully!"
    Write-Host ""
    Write-Info "APK Details:"
    Write-Host "  Location: $apkPath"
    Write-Host "  Size:     $apkSize MB"
    Write-Host "  Version:  $VERSION_NAME ($VERSION_CODE)"
    Write-Host ""
    
    Write-Header "NEXT STEPS"
    
    Write-Host "1. TEST THE APK:" -ForegroundColor Cyan
    Write-Host "   adb install -r `"$apkPath`""
    Write-Host ""
    
    Write-Host "2. RENAME FOR DISTRIBUTION (Optional):" -ForegroundColor Cyan
    $outputName = "$APP_NAME-v$VERSION_NAME.apk"
    Write-Host "   Copy-Item `"$apkPath`" `"$outputName`""
    Write-Host ""
    
    Write-Host "3. FOR GOOGLE PLAY (You need AAB):" -ForegroundColor Cyan
    Write-Host "   .\gradlew bundleRelease"
    Write-Host "   Find AAB at: android\app\build\outputs\bundle\release\app-release.aab"
    Write-Host ""
    
    Write-Warning "IMPORTANT REMINDERS:"
    Write-Host "  • Backup your keystore file: $KEYSTORE_FILE"
    Write-Host "  • Store keystore credentials securely"
    Write-Host "  • For production, use strong passwords"
    Write-Host "  • Test APK thoroughly before distribution"
    Write-Host ""
    
} else {
    Write-Error-Custom "APK not found at expected location!"
    Write-Info "Expected: $apkPath"
    Write-Info "Check build logs for errors"
    exit 1
}

Write-Header "BUILD SCRIPT COMPLETED"