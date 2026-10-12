# VocaLink Android APK — build & install notes

## What this is
Native WebView wrapper (`android-app/`, package `com.vocalink.app.debug`)
loading the live production site `https://vocalink-skills.netlify.app`.
Chosen because the Expo shell in `apps/mobile/` has no features; the real
product is the deployed web app (verified live).

## Requirements (all need internet)
- Internet connection (UI, Neon database, Gemini AI are all network-hosted).
- Android 7.0+ (minSdk 24).

## One-time toolchain setup (user-local, no admin)
1. Eclipse Temurin JDK 17 → `%LOCALAPPDATA%\VocaLinkBuild\jdk-17`
   (https://adoptium.net, Windows x64 .zip — extract, folder contains `bin\java.exe`).
2. Android cmdline-tools → `%LOCALAPPDATA%\VocaLinkBuild\android-sdk\cmdline-tools\latest`
   (https://developer.android.com/studio#command-line-tools-only, zip → extract
   `cmdline-tools/` → rename inner folder to `latest`).
3. SDK packages (accept licences first):
   `sdkmanager --licenses` (answer y), then
   `sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"`.
4. Gradle 8.7 → `%LOCALAPPDATA%\VocaLinkBuild\gradle-8.7`
   (https://services.gradle.org/distributions/gradle-8.7-bin.zip).

## Build
```powershell
powershell -ExecutionPolicy Bypass -File scripts\build-apk.ps1
```
Output: `android-app/apks/VocaLink-debug-v1.0.0.apk` (+ SHA-256 printed).

## Install on phone
1. Copy the APK to the phone (USB/Bluetooth/Drive).
2. Tap it → allow “Install unknown apps” for the file manager → Install.
3. Debug-signed TEST build: cannot later update to a Play/release-signed
   build without uninstalling first. Provide your release keystore to ship
   a release-signed APK (no release key exists for this first-project app).

## Verified (see build output)
- `apksigner verify` signature, `aapt dump badging` package/activity/SDK.
- SHA-256 recorded at build time.
- Not tested: physical-device run (no device/emulator available here).
