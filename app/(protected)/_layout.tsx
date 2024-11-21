import { Stack } from 'expo-router'

export default function ProtectedLayout() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="selectOperation" options={{ headerShown: false }} />
      <Stack.Screen name="selectDifficulty" options={{ headerShown: false }} />
      <Stack.Screen name="game" options={{ headerShown: false }} />
      <Stack.Screen name="results" options={{ headerShown: false }} />
      <Stack.Screen name="performance" options={{ headerShown: false }} />
      <Stack.Screen name="account" options={{ headerShown: false }} />
      <Stack.Screen name="simpleResults" options={{ headerShown: false }} />
    </Stack>
  )
}
