@echo off
setlocal EnableDelayedExpansion

:: ========================================================
::  CRACKJOBS PRODUCTION BUILD SCRIPT (FINAL FIX)
:: ========================================================

:: Setup Log File
set LOGFILE=build_log.txt
if exist %LOGFILE% del %LOGFILE%

echo.
echo  [INFO] Logs will be saved to %LOGFILE%
echo.

:: Function to log and echo
call :Log "Starting Build Process..."

:: ---------------------------------------------------------
:: 1. CLEANUP (CRITICAL for fixing the corrupted file)
:: ---------------------------------------------------------
call :Log "[1/7] Cleaning up previous builds..."

taskkill /f /im node.exe >nul 2>&1
taskkill /f /im java.exe >nul 2>&1

if exist "android" (
    call :Log "   - Removing android folder..."
    rmdir /s /q "android" || goto :Error
)
if exist "node_modules" (
    call :Log "   - Removing node_modules..."
    rmdir /s /q "node_modules" || goto :Error
)
if exist ".expo" rmdir /s /q ".expo"
if exist "package-lock.json" del /f /q "package-lock.json"
if exist "yarn.lock" del /f /q "yarn.lock"

:: ---------------------------------------------------------
:: 2. INSTALL DEPENDENCIES
:: ---------------------------------------------------------
call :Log "[2/7] Installing Dependencies..."
call npm install --legacy-peer-deps >> %LOGFILE% 2>&1
if %ERRORLEVEL% NEQ 0 goto :Error

:: ---------------------------------------------------------
:: 3. FIX EXPO
:: ---------------------------------------------------------
call :Log "[3/7] Aligning Expo Dependencies..."
call npx expo install --fix >> %LOGFILE% 2>&1
if %ERRORLEVEL% NEQ 0 goto :Error

:: ---------------------------------------------------------
:: 4. PREBUILD
:: ---------------------------------------------------------
call :Log "[4/7] Running Prebuild (Android)..."
call npx expo prebuild --clean --platform android >> %LOGFILE% 2>&1
if %ERRORLEVEL% NEQ 0 goto :Error

:: ---------------------------------------------------------
:: 5. KEYSTORE GENERATION
:: ---------------------------------------------------------
call :Log "[5/7] Generating Production Keystore..."

set KEYSTORE_PATH=android\app\prod.keystore
if not exist "android\app" mkdir "android\app"

if exist "%KEYSTORE_PATH%" del "%KEYSTORE_PATH%"

keytool -genkeypair -v -keystore "%KEYSTORE_PATH%" -storepass android -alias prodkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=CrackJobs, OU=Mobile, O=CrackJobs, L=City, S=State, C=US" >> %LOGFILE% 2>&1

if %ERRORLEVEL% NEQ 0 (
    call :Log "[WARN] Keytool command failed. Check JAVA_HOME in build_log.txt."
    goto :Error
) else (
    call :Log "   - Keystore generated successfully."
)

:: ---------------------------------------------------------
:: 6. GRADLE CONFIGURATION (FIXED)
:: ---------------------------------------------------------
call :Log "[6/7] Injecting Signing Config..."

:: Create a temporary PowerShell script
set PS_SCRIPT=inject_gradle.ps1
echo $gradlePath = 'android\app\build.gradle' > %PS_SCRIPT%
echo $content = Get-Content $gradlePath -Raw >> %PS_SCRIPT%

:: --- THE FIX IS HERE: Only ONE closing brace '}' for the release block ---
echo $signingConfig = '    signingConfigs { release { storeFile file(''prod.keystore''); storePassword ''android''; keyAlias ''prodkey''; keyPassword ''android'' }' >> %PS_SCRIPT%

echo $content = $content -replace 'signingConfigs\s*\{', $signingConfig >> %PS_SCRIPT%
echo $content = $content -replace 'signingConfig\s+signingConfigs.debug', 'signingConfig signingConfigs.release' >> %PS_SCRIPT%
echo Set-Content $gradlePath $content >> %PS_SCRIPT%

:: Run the temporary script
powershell -ExecutionPolicy Bypass -File %PS_SCRIPT% >> %LOGFILE% 2>&1
if %ERRORLEVEL% NEQ 0 (
    del %PS_SCRIPT%
    goto :Error
)

:: Cleanup temp script
del %PS_SCRIPT%
call :Log "   - build.gradle updated successfully."

:: ---------------------------------------------------------
:: 7. BUILD APK
:: ---------------------------------------------------------
call :Log "[7/7] Building Release APK..."
cd android
call gradlew.bat assembleRelease >> ..\%LOGFILE% 2>&1
if %ERRORLEVEL% NEQ 0 (
    cd ..
    goto :Error
)
cd ..

:: ---------------------------------------------------------
:: SUCCESS
:: ---------------------------------------------------------
call :Log "========================================================"
call :Log " BUILD SUCCESSFUL!"
call :Log "========================================================"
echo.
echo APK Location: android\app\build\outputs\apk\release\app-release.apk
if exist "android\app\build\outputs\apk\release\app-release.apk" (
    explorer "android\app\build\outputs\apk\release"
)
pause
exit /b 0

:: ---------------------------------------------------------
:: ERROR HANDLER
:: ---------------------------------------------------------
:Error
echo.
echo ========================================================
echo [ERROR] BUILD FAILED!
echo ========================================================
echo Please check 'build_log.txt' for the specific error message.
echo.
pause
exit /b 1

:: ---------------------------------------------------------
:: LOGGING HELPER
:: ---------------------------------------------------------
:Log
echo %~1
echo %~1 >> %LOGFILE%
exit /b 0