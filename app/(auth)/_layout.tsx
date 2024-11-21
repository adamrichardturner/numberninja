import React from 'react'
import { Stack } from 'expo-router'
import { View } from 'react-native'
import { authStyles } from './authStyles'

export default function AuthLayout() {
  return (
    <View style={authStyles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: authStyles.contentContainer,
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="verifyEmail" />
        <Stack.Screen name="forgotPassword" />
      </Stack>
    </View>
  )
}
