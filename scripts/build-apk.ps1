# Reusable VocaLink APK build (Windows PowerShell 5.1+).
# Prereqs (one-time, see Docs/ANDROID_APK.md):
#   %LOCALAPPDATA%\VocaLinkBuild\jdk-17, android-sdk, gradle-8.7
# Usage: powershell -ExecutionPolicy Bypass -File scripts\build-apk.ps1
$ErrorActionPreference = "Stop"
$Base = "$env:LOCALAPPDATA\VocaLinkBuild"
$env:JAVA_HOME = "$Base\jdk-17"
$env:ANDROID_HOME = "$Base\android-sdk"
$env:ANDROID_SDK_ROOT = "$Base\android-sdk"
$env:Path = "$env:JAVA_HOME\bin;$Base\gradle-8.7\bin;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools;" + $env:Path

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$AppDir = Join-Path $ProjectRoot "android-app"
if (-not (Test-Path -LiteralPath (Join-Path $AppDir "local.properties"))) {
    "sdk.dir=$($env:ANDROID_HOME -replace '\\','\\')" | Set-Content -LiteralPath (Join-Path $AppDir "local.properties") -Encoding ASCII
}

Push-Location $AppDir
try {
    & gradle assembleDebug --console=plain
    $apk = Join-Path $AppDir "app\build\outputs\apk\debug\app-debug.apk"
    if (-not (Test-Path -LiteralPath $apk)) { throw "APK not produced at $apk" }
    $OutDir = Join-Path $AppDir "apks"
    New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
    $Out = Join-Path $OutDir "VocaLink-debug-v1.0.0.apk"
    Copy-Item -LiteralPath $apk -Destination $Out -Force
    $h = (Get-FileHash -LiteralPath $Out -Algorithm SHA256).Hash
    $size = (Get-Item -LiteralPath $Out).Length
    Write-Output "APK : $Out"
    Write-Output ("Size: {0:N1} MB" -f ($size / 1MB))
    Write-Output "SHA256: $h"
    $bt = Join-Path $env:ANDROID_HOME "build-tools\34.0.0"
    & "$bt\apksigner.bat" verify --print-certs --verbose $Out
    & "$bt\aapt.exe" dump badging $Out | Select-String "package:","launchable-activity:","sdkVersion:","targetSdkVersion:"
} finally {
    Pop-Location
}
