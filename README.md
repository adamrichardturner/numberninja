# Number Ninja

Number Ninja is an engaging math practice app for all ages built by [Adam Richard Turner](https://adamrichardturner.dev) using React Native, Expo and Express.

It is designed to help users improve their arithmetic skills through timed questioned based exercises, analytics and performance tracking.

This is the Frontend repository containing the React Native app. The backend is a custom REST API built with Express and PostgreSQL and can be found [here](https://github.com/adamrichardturner/numberninja-api).

## Preview

![Number Ninja Preview](./number-ninja.jpg)

It is currently available on the [Apple App Store](https://apps.apple.com/gb/app/number-ninja-math-game/id6670713997). Although it is fully functional and compatible for Android, it has not been published yet.

## 🎮 About the Game

Number Ninja offers two primary game modes:

- **Practice Mode**: A relaxed environment where users can practice math operations at their own pace
- **Test Mode**: Timed challenges to test mathematical proficiency under pressure

The game supports multiple operations:

- Addition
- Subtraction
- Multiplication
- Division

Users can select different difficulty levels or customise this themselves:

- Easy (5 minutes)
- Medium (3 minutes)
- Hard (2 minutes)

## 🛠 Tech Stack

- **Frontend**:

  - React Native
  - Expo Router
  - TypeScript
  - Firebase Authentication
  - Firebase Analytics
  - Firebase Crashlytics
  - React Native WebView
  - Expo Haptics
  - AsyncStorage

- **Backend**:
  - Custom REST API
  - PostgreSQL Database
  - Express
  - Node.js

## 📱 Features

- User authentication and account management
- Multiple language support (English, German)
- Performance tracking and analytics
- Offline support
- Haptic feedback
- Progressive difficulty levels
- Real-time scoring
- Detailed performance analytics

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account
- Backend server (separate repository)

### Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/numberninja.git
cd numberninja
```

2. Install dependencies:

```bash
npm install
```

3. Create a Firebase project and download the configuration files:

   - Create a new project in Firebase Console
   - Enable Authentication, Analytics, and Crashlytics
   - Download `google-services.json` for Android
   - Download `GoogleService-Info.plist` for iOS
   - Place these files in the project root

4. Create a `.env` file in the project root:

```bash
EXPO_FIREBASE_API_KEY=your_api_key
EXPO_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_FIREBASE_PROJECT_ID=your_project_id
EXPO_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_FIREBASE_APP_ID=your_app_id
EXPO_FIREBASE_MEASUREMENT_ID=your_measurement_id
API_URL=your_backend_server_url
```

5. Update the Firebase configuration in `firebaseConfig.ts` with your Firebase credentials.

### Running the App

For local development:

```bash
npm run start:local
```

For production:

```bash
npm run build:production
```

## 📦 Building for Production

### Android

```bash
eas build -p android --profile production
```

### iOS

```bash
eas build -p ios --profile production
```

## 🔧 Configuration

The app uses several configuration files:

- `app.config.js` - Expo configuration
- `eas.json` - EAS Build configuration
- `package.json` - Project dependencies and scripts

## 🌐 Backend Setup

The app requires a backend server for handling:

- Game sessions
- User progress tracking
- Analytics
- Performance metrics

Ensure your backend server implements the following endpoints:

- POST `/api/sessions/create`
- GET `/api/game-modes`
- GET `/api/ranges-and-difficulties`
- POST `/api/sessions/:sessionId/end`

## 🔒 Security

- Firebase Authentication for user management
- JWT tokens for API authentication
- Secure data transmission with HTTPS
- Client-side input validation
- Server-side request validation

## 📱 Supported Platforms

- iOS 13.0 and above
- Android API level 21 (Android 5.0) and above

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For support, please visit:

- Documentation: https://numberninja.app/docs
- Support Portal: https://numberninja.app/support
- Email: support@numberninja.app
