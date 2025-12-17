# Quick search script
Write-Host "Searching for Ionicons..." -ForegroundColor Cyan
$ionicons = Select-String -Path "app\**\*.tsx","app\**\*.ts","lib\**\*.tsx","lib\**\*.ts" -Pattern "@expo/vector-icons" -ErrorAction SilentlyContinue
if ($ionicons) {
    Write-Host "Found Ionicons in:" -ForegroundColor Red
    $ionicons.Path | Select-Object -Unique | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "✅ No Ionicons found" -ForegroundColor Green
}

Write-Host "`nSearching for luxon..." -ForegroundColor Cyan
$luxon = Select-String -Path "app\**\*.tsx","app\**\*.ts","lib\**\*.tsx","lib\**\*.ts" -Pattern "from 'luxon'" -ErrorAction SilentlyContinue
if ($luxon) {
    Write-Host "Found luxon in:" -ForegroundColor Red
    $luxon.Path | Select-Object -Unique | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "✅ No luxon found" -ForegroundColor Green
}

Write-Host "`nChecking package.json..." -ForegroundColor Cyan
$pkg = Get-Content package.json -Raw
if ($pkg -match "@expo/vector-icons") { Write-Host "❌ @expo/vector-icons in package.json" -ForegroundColor Red } else { Write-Host "✅ @expo/vector-icons removed" -ForegroundColor Green }
if ($pkg -match '"luxon"') { Write-Host "❌ luxon in package.json" -ForegroundColor Red } else { Write-Host "✅ luxon removed" -ForegroundColor Green }