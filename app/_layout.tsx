import React from 'react'
import { Stack } from 'expo-router'
import { AuthProvider } from '../contexts/authContext'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import ErrorBoundary from 'react-native-error-boundary'
import { View, Text } from 'react-native'
import { LanguageProvider } from '../contexts/languageContext'
import { AnalyticsProvider } from '../contexts/analyticsContext'

const ErrorFallback = ({ error }: { error: Error }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>An unexpected error occurred: {error.toString()}</Text>
  </View>
)

export default function Layout() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <LanguageProvider>
        <AuthProvider>
          <AnalyticsProvider>
            <SafeAreaProvider>
              <Stack>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(protected)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="terms" options={{ headerShown: false }} />
                <Stack.Screen name="privacy" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="support" options={{ headerShown: false }} />
              </Stack>
            </SafeAreaProvider>
          </AnalyticsProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}
