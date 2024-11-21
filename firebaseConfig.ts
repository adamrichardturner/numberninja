import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

// Firebase configuration using the environment variables
const firebaseConfig = {
  apiKey: 'API_KEY',
  authDomain: 'AUTH_DOMAIN',
  projectId: 'PROJECT_ID',
  storageBucket: 'STORAGE_BUCKET',
  messagingSenderId: 'MESSAGING_SENDER_ID',
  appId: 'APP_ID',
  measurementId: 'MEASUREMENT_ID',
}

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const authExpo = firebase.auth()
