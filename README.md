# App-React-Native-Supabase

## Table of Contents

1. [Description](#description)
2. [Technologies used](#technologies-used)
3. [Installation](#installation)
4. [Run](#run)
5. [Contributing](#contributing)
6. [License](#license)

## Description

A cross-platform application for students and chartered accountants, built with React Native, Expo, and Supabase.

Students can create an account, describe a topic they need help with, search for chartered accountants, book meetings, and upload a résumé. Chartered accountants can manage their availability, review student résumés, and meet students through Jitsi Meet. Accountant accounts require administrator approval.

The app also includes authentication and email verification, password reset, meeting management, profile management, and account deletion.

## Technologies used

- **React Native** - Cross-platform application UI
- **Supabase** — authentication, PostgreSQL database, storage, row-level security, and Edge Functions
- **Jitsi Meet** — video meetings

## Challenges and Future Features

Discovering Supabase, row-level security (RLS), and Edge Functions was one of the main challenges. Another was finding packages that work on both web and mobile. For example, there does not seem to be package that supports displaying PDF on both platforms, so the code is a little messy and imports two packages depending on the platform.

Deep linking was another challenge that took some time to understand. Testing it in the iOS simulator was confusing.

The last challenge was converting a vibecoded HTML/CSS design into React Native styles and animations.

## Installation

Install [Node.js](https://nodejs.org/) and npm. For native development, install Xcode for iOS or Android Studio for Android.

Clone the repository and install dependencies:

```bash
git clone https://github.com/Vpekdas/App-React-Native-Supabase.git
cd App-React-Native-Supabase
npm install
```

Create a Supabase project. Add the project URL and anon key to a `.env` file at the repository root:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Configure the database schema, storage buckets, authentication settings, and row-level security policies for your Supabase project using [`RLS.sql`](RLS.sql). Set the required secrets for Supabase Edge Functions in your Supabase project before deploying them. Keep the service role key secret.

## Run

Start Expo:

```bash
npm start
```

Then use the Expo terminal shortcuts or Expo Go to open the app.

### iOS

Requires macOS and Xcode:

```bash
npm run ios
```

### Android

Requires Android Studio and a configured emulator or connected device:

```bash
npm run android
```

### Web

```bash
npm run web
```

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for contribution steps.

## License

This project is licensed under the [MIT License](LICENSE).
