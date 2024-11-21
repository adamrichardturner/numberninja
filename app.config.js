import 'dotenv/config'

export default {
  expo: {
    name: 'Number Ninja',
    slug: 'numberninja',
    scheme: 'numberninja',
    version: '1.0.1',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    plugins: [
      'expo-router',
      '@react-native-firebase/app',
      '@react-native-firebase/auth',
      'react-native-email-link',
      'expo-system-ui',
      ['expo-build-properties', { ios: { useFrameworks: 'static' } }],
      [
        '@react-native-firebase/crashlytics',
        {
          stripPrefix: '~',
          uploadSymbols: true,
        },
      ],
    ],
    extra: {
      eas: {
        projectId: 'ffb6462b-8766-4a23-aa32-a7e3330d6506',
      },
      apiUrl: process.env.API_URL || 'https://your.backend.server',
    },
    android: {
      package: 'com.yourpackagename.numberninja',
      googleServicesFile: 'google-services.json',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#7148FC',
      },
      blockedPermissions: [
        'android.permission.ACCESS_ADSERVICES_AD_ID',
        'android.permission.ACCESS_ADSERVICES_AD_ID',
      ],
      versionCode: 11,
    },
    ios: {
      bundleIdentifier: 'com.yourpackagename.numberninja',
      buildNumber: process.env.EAS_BUILD_NUMBER || '8',
      config: {
        googleSignIn: {
          reservedClientId:
            'com.googleusercontent.apps.326326908458-a8hb89hnk7qrv2smv3jb9qg0ksr32lv4',
        },
      },
      googleServicesFile: './GoogleService-Info.plist',
    },
  },
}
