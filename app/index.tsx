import React, { useEffect, useState } from 'react'
import { View, Image, Animated, Linking } from 'react-native'
import { Redirect, router } from 'expo-router'
import { useAuth } from '../contexts/authContext'
import LoadingScreen from '../components/LoadingScreen'
import * as SplashScreen from 'expo-splash-screen'
import analytics from '@react-native-firebase/analytics'
import crashlytics from '@react-native-firebase/crashlytics'
import { logEvent } from '../utils/firebaseAnalytics'
import AsyncStorage from '@react-native-async-storage/async-storage'

SplashScreen.preventAutoHideAsync()

export default function Index() {
  const { user, isLoading } = useAuth()
  const [isSplashHidden, setIsSplashHidden] = useState(false)

  useEffect(() => {
    async function hideSplashScreen() {
      await SplashScreen.hideAsync()
      setIsSplashHidden(true)
    }

    if (!isLoading) {
      hideSplashScreen()
    }
  }, [isLoading])

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      if (event.url.includes('numberninja://verified')) {
        router.replace('/(auth)/login')
      }
    }

    Linking.addEventListener('url', handleDeepLink)

    return () => {
      Linking.removeAllListeners('url')
    }
  }, [])

  useEffect(() => {
    // Initialize Firebase Analytics
    analytics().setAnalyticsCollectionEnabled(true)

    // Initialize Firebase Crashlytics
    crashlytics().setCrashlyticsCollectionEnabled(true)

    // Log analytics status periodically
    const logAnalyticsStatus = async () => {
      const analyticsEnabled = await AsyncStorage.getItem('analyticsEnabled')
      logEvent('analytics_status', {
        analytics_enabled: analyticsEnabled === 'true',
      })
    }

    // Log initially and then every 24 hours
    logAnalyticsStatus()
    const intervalId = setInterval(logAnalyticsStatus, 24 * 60 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  if (isLoading || !isSplashHidden) {
    return null // Return null to keep showing the native splash screen
  }

  return user?.emailVerified ? (
    <Redirect href="/(protected)/home" />
  ) : (
    <Redirect href="/(auth)/login" />
  )
}
