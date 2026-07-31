# Curious Paisley – Shahmaran Mobile (Flutter)

**Languages/tools:** **Dart**, **Flutter** (see project root `TOOLS_AND_SERVICES.md`).

Shahmaran on **Android** and **iOS**, using the same Supabase backend as the web and admin.

## Prerequisites

- Install [Flutter](https://docs.flutter.dev/get-started/install) (includes Dart).
- Run `flutter doctor` and fix any issues.

## First-time setup

This folder has a minimal Flutter app (Dart + `pubspec.yaml` + `lib/main.dart`). You still need the platform projects:

```bash
cd /Users/nika/Desktop/CuriousPaisley/mobile
flutter create .
```

That generates `android/` and `ios/` and wires them to this app. Then:

```bash
flutter pub get
```

## Run

- **Android:** `flutter run` (with device or emulator).
- **iOS:** `flutter run` on macOS with Xcode installed.

## Supabase

Add your Supabase URL and anon key via:

- **Option A:** `--dart-define=SUPABASE_URL=...` and `SUPABASE_ANON_KEY=...` when running.
- **Option B:** A config file or env that you load in Dart (e.g. `dart-define-from-file`). Do not commit secrets.

Use the same Shahmaran API as the web: `topics`, `topic_translations`, `steps`, `step_translations`, `user_progress`.
