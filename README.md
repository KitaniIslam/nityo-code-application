# React Native Authentication App

## Tech Stack Choices

As the requirment very simple, I choose the following tech stack:

- **Mobile**: Expo React Native with TypeScript (Could be React Native CLI if Native Modules are needed or any specific customization required as I'm experienced in that too )
- **Backend**: Node.js with Express and SQLite (easy quick setup to get started, could be dockerized for production and a different database choice like postgrsql, but for the sake of simplicity and save you the hustle to setup your local machine this should goes smooth)
- **Authentication**: JWT tokens with bcrypt password hashing

## Features

- User registration and login
- Secure session persistence
- JWT authentication
- Atomic Design components
- Form validation with Zod and @tanstack/react-form
- Custom UI components (no external UI library)
- light/dark theme following the system default

## Feature imporovment

I choosed to not use any `UI Library` to keep the app simple and focused on the core functionality.
also demonstrite the `atomic design pattern`. and the eas of theming.

## Quick Start

### Prerequisites

- Node.js 16+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on phone or iOS Simulator/Android Emulator

### Server Setup

```bash
cd server

# Using npm
npm install
npm run dev

# Using yarn
yarn install
yarn dev
```

Server runs on http://localhost:3000

### Mobile App Setup

```bash
cd mobile

# Using npm
npm install
npm start

# Using yarn
yarn install
yarn start
```

Then run the app:

- **Phone**: Scan QR code with Expo Go app
- **iOS Simulator**: Press `i` in terminal
- **Android Emulator**: Press `a` in terminal

## Project Structure

- `server/` - Node.js/Express backend with SQLite
- `mobile/` - Expo React Native app with TypeScript
