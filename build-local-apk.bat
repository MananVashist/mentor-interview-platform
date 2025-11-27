@echo off
setlocal EnableDelayedExpansion

REM ============================================
REM CrackJobs - Automated Android Build (Anti-Lock Version)
REM ============================================

echo.
echo ========================================
echo   Step 0: Force Clean Locks
echo ========================================
echo.
echo Killing lingering Java/Gradle processes to prevent EBUSY errors...
taskkill /F /IM java.exe >nul 2>nul
taskkill /F /IM openjdk.exe >nul 2>nul
taskkill /F /IM adb.exe >nul 2>nul
echo [OK] Locks released.

echo.
echo ========================================
echo   Step 1: Environment Check
echo ========================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found!
    pause
    exit /b 1
)
echo [OK] Node.js found

if "%JAVA_HOME%"=="" (
    echo [ERROR] JAVA_HOME not set!
    pause
    exit /b 1
)
echo [OK] JAVA_HOME set: %JAVA_HOME%

if "%ANDROID_HOME%"=="" (
    echo [ERROR] ANDROID_HOME not set!
    pause
    exit /b 1
)
REM Trim trailing backslash from ANDROID_HOME if present to be safe
if "%ANDROID_HOME:~-1%"=="\" set "ANDROID_HOME=%ANDROID_HOME:~0,-1%"
echo [OK] ANDROID_HOME set: %ANDROID_HOME%

echo.
echo ========================================
echo   Step 2: Install Dependencies
echo ========================================
echo.
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] NPM Install failed.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Step 3: Clean & Generate Android Project
echo ========================================
echo.
REM Force delete android folder if it exists to be safe
if exist "android" (
    rmdir /s /q "android"
)

call npx expo prebuild --clean --platform android
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Expo Prebuild failed.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Step 4: Manage Keystore
echo ========================================
echo.

set "KEYSTORE_NAME=crackjobs-release.keystore"
set "KEY_ALIAS=crackjobs-key"
set "KEY_PASS=crackjobs2024"

if not exist "%KEYSTORE_NAME%" (
    echo Generating new keystore in root...
    "%JAVA_HOME%\bin\keytool.exe" -genkeypair -v -keystore "%KEYSTORE_NAME%" -alias "%KEY_ALIAS%" -keyalg RSA -keysize 2048 -validity 10000 -storepass "%KEY_PASS%" -keypass "%KEY_PASS%" -dname "CN=CrackJobs, OU=Mobile, O=CrackJobs, L=Bengaluru, ST=Karnataka, C=IN"
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] Keystore generation failed.
        pause
        exit /b 1
    )
) else (
    echo [OK] Root keystore found.
)

copy /Y "%KEYSTORE_NAME%" "android\app\%KEYSTORE_NAME%" >nul
echo [OK] Keystore copied to android/app/

echo.
echo ========================================
echo   Step 5: Inject Signing Config
echo ========================================
echo.

powershell -Command ^
  "$gradleFile = 'android/app/build.gradle'; " ^
  "$content = Get-Content $gradleFile -Raw; " ^
  "$releaseConfig = 'signingConfigs { release { storeFile file(\"%KEYSTORE_NAME%\"); storePassword \"%KEY_PASS%\"; keyAlias \"%KEY_ALIAS%\"; keyPassword \"%KEY_PASS%\" }';" ^
  "$content = $content -replace 'signingConfigs\s*\{', $releaseConfig; " ^
  "$content = $content -replace 'buildTypes\s*\{\s*release\s*\{', 'buildTypes { release { signingConfig signingConfigs.release'; " ^
  "Set-Content $gradleFile $content"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to patch build.gradle.
    pause
    exit /b 1
)
echo [OK] build.gradle patched.

echo.
echo ========================================
echo   Step 6: Configure Gradle Properties
echo ========================================
echo.
(
echo org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
echo org.gradle.daemon=true
echo org.gradle.parallel=false
echo android.useAndroidX=true
echo android.enableJetifier=true
echo hermesEnabled=true
) > android\gradle.properties

set "SDK_DIR=%ANDROID_HOME:\=/%"
echo sdk.dir=%SDK_DIR%>android\local.properties

echo [OK] Config files created

echo.
echo ========================================
echo   Step 7: Build APK
echo ========================================
echo.
cd android
call gradlew.bat clean assembleRelease --stacktrace

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo   BUILD FAILED
    echo ========================================
    echo Check the error messages above.
    echo.
    cd ..
    pause
    exit /b 1
)

cd ..
echo.
echo ========================================
echo   BUILD SUCCESSFUL!
echo ========================================
echo.
echo APK Location:
echo android\app\build\outputs\apk\release\app-release.apk
echo.
echo To install:
echo adb install -r android\app\build\outputs\apk\release\app-release.apk
echo.
pause