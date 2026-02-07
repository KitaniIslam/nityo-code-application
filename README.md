# React Native Authentication System

A production-ready, interview-quality full-stack authentication system built with React Native CLI and Node.js, implementing Atomic Design principles and secure storage practices.

## 🏗️ Architecture Overview

This project demonstrates clean architecture patterns with clear separation of concerns:

- **Mobile**: React Native CLI with TypeScript, Atomic Design, and secure keychain storage
- **Backend**: Node.js with Express, SQLite, JWT authentication, and comprehensive validation
- **Security**: bcrypt password hashing, JWT tokens, and platform-secure credential storage

## 🎯 Architecture Decisions

### Atomic Design Implementation
- **Atoms**: Smallest reusable UI components (Button, Input, Text)
- **Molecules**: Combinations of atoms that form simple UI features (FormInput, ErrorMessage)
- **Organisms**: Complex UI components composed of molecules (LoginForm, SignupForm)
- **Templates**: Screen-level layouts that organize organisms
- **Pages**: Specific implementations with actual data

**Why Atomic Design?**
- Promotes reusability and consistency
- Creates clear component hierarchy
- Easier maintenance and scaling
- Better developer experience with predictable patterns

### Secure Storage Choice
**Why react-native-keychain over AsyncStorage?**
- Uses iOS Keychain and Android Keystore (hardware-backed security)
- Encrypted storage with platform-specific secure enclaves
- Survives app updates and device restarts
- Meets enterprise security requirements
- Protects against root/jailbreak attacks

### Database Selection
**Why SQLite over ORMs?**
- Transparent SQL operations for better understanding
- Zero configuration, file-based storage
- Excellent performance for mobile app backends
- Type-safe with TypeScript
- No hidden magic or abstraction layers

## 📱 Mobile App Structure

```
mobile/src/
├── atoms/           # Basic UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Text.tsx
├── molecules/       # Component combinations
│   ├── FormInput.tsx
│   ├── ErrorMessage.tsx
│   └── PasswordInput.tsx
├── organisms/       # Complex UI features
│   ├── LoginForm.tsx
│   └── SignupForm.tsx
├── screens/         # Screen components
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   └── HomeScreen.tsx
├── context/         # React Context for state
│   └── AuthContext.tsx
├── navigation/      # Navigation setup
│   └── RootNavigator.tsx
├── api/            # API layer
│   └── auth.api.ts
├── theme/          # Theme system
│   ├── colors.ts
│   ├── typography.ts
│   └── ThemeProvider.tsx
├── utils/          # Utility functions
│   └── secureStorage.ts
└── validation/     # Form validation schemas
    └── auth.schema.ts
```

## 🔧 Backend Structure

```
server/src/
├── routes/         # API routes
│   └── auth.routes.ts
├── controllers/    # Request handlers
│   └── auth.controller.ts
├── services/       # Business logic
│   └── auth.service.ts
├── db/            # Database setup
│   ├── sqlite.ts
│   └── schema.sql
├── schemas/       # Request validation
│   └── auth.schema.ts
├── middleware/    # Express middleware
│   └── auth.middleware.ts
└── index.ts       # Server entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- React Native CLI
- Xcode (iOS) or Android Studio (Android)

### Mobile App Setup

1. **Install dependencies**
```bash
cd mobile
npm install
```

2. **iOS Setup**
```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

3. **Run the app**
```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

### Server Setup

1. **Install dependencies**
```bash
cd server
npm install
```

2. **Start the server**
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

3. **Run tests**
```bash
npm test
```

## 🔐 Authentication Flow

### User Registration
1. Client validates form with Zod schemas
2. Password hashed with bcrypt (12 rounds)
3. User stored in SQLite database
4. JWT token generated and returned
5. Credentials securely stored in device keychain

### User Login
1. Client validates login form
2. Server verifies credentials
3. JWT token generated on success
4. Token and user ID stored in secure keychain
5. User redirected to home screen

### Session Management
- Tokens stored in iOS Keychain/Android Keystore
- Automatic session restoration on app launch
- Secure logout clears all stored credentials
- Token validation for protected endpoints

## 🛡️ Security Features

### Password Security
- bcrypt hashing with 12 salt rounds
- Minimum 6-character password requirement
- Password strength validation

### Token Security
- JWT tokens with 24-hour expiration
- Secure token generation and verification
- Protected routes require valid tokens

### Data Protection
- HTTPS recommended for production
- Input validation on all endpoints
- SQL injection prevention with parameterized queries
- CORS configuration for cross-origin requests

## 🧪 Testing

### Server Tests
Comprehensive test suite covering:
- User registration (success/duplicate email)
- User authentication (success/invalid credentials)
- Password updates (valid/invalid current password)
- Token protection for routes
- Input validation

Run tests:
```bash
cd server
npm test
```

## 📡 API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User authentication
- `POST /api/reset-password` - Password reset request
- `PUT /api/update-password` - Update password (protected)

### Utility
- `GET /health` - Health check endpoint

## 🎨 UI/UX Features

### Theme System
- Light and dark mode support
- System-aware theme detection
- Consistent color palette
- Accessible contrast ratios

### Component Design
- Atomic Design principles
- Reusable component library
- TypeScript for type safety
- Platform-specific styling

## 🔧 Configuration

### Environment Variables
Create `.env` file in server directory:
```
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
NODE_ENV=development
```

### Database
- SQLite database automatically created on first run
- Schema migrations handled automatically
- In-memory database for testing

## 🚀 Deployment

### Mobile App
- Build for iOS: `npx react-native run-ios --configuration Release`
- Build for Android: `npx react-native build-android --mode=release`

### Server
- Build TypeScript: `npm run build`
- Start production server: `npm start`
- Use PM2 for process management in production

## 🤝 Contributing

1. Follow the established Atomic Design patterns
2. Write tests for new features
3. Ensure TypeScript types are correct
4. Follow the existing code style
5. Update documentation for changes

## 📝 Security Considerations

### Production Checklist
- [ ] Use HTTPS for all API calls
- [ ] Set strong JWT secret
- [ ] Enable rate limiting
- [ ] Implement request logging
- [ ] Set up database backups
- [ ] Monitor for suspicious activity
- [ ] Regular security updates

### Known Limitations
- Password reset emails not implemented (placeholder)
- No account email verification
- No social login integration
- No two-factor authentication

## 📄 License

This project is for educational and interview purposes. Feel free to use and modify as needed.

---

**Built with ❤️ for demonstrating clean architecture and secure authentication practices**
