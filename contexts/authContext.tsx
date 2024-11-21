import React, { createContext, useContext, useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import { authExpo } from '../firebaseConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirebaseErrorMessage } from '../utils/authErrorHandler'
import { useRouter, useSegments } from 'expo-router'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { logEvent, logError } from '../utils/firebaseAnalytics'

interface AuthContextType {
  user: FirebaseAuthTypes.User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  updateDisplayName: (newDisplayName: string) => Promise<void>
  resendVerificationEmail: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter()
  const segments = useSegments()
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)
  const [initializing, setInitializing] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    setUser(user)
    setIsLoading(false)
    if (initializing) {
      setInitializing(false)
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  useEffect(() => {
    if (initializing) {
      return
    }
    const inProtectedGroup = segments[0] === '(protected)'

    if (!user?.emailVerified && inProtectedGroup) {
      router.replace('/(auth)/login')
    }
  }, [user, initializing])

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      )

      if (!userCredential.user.emailVerified) {
        await auth().signOut()
        throw new Error('Please verify your email before logging in.')
      }

      setUser(userCredential.user)
      const token = await userCredential.user.getIdToken()
      await AsyncStorage.setItem('userToken', token)
      router.replace('/(protected)/home')
      logEvent('sign_in', { method: 'email' })
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error)
      logError(new Error(`Sign In Error: ${errorMessage}`))
      throw errorMessage
    }
  }

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      const userCredential = await authExpo.createUserWithEmailAndPassword(
        email,
        password
      )
      if (userCredential.user) {
        await userCredential.user.updateProfile({ displayName })
        await userCredential.user.sendEmailVerification({
          handleCodeInApp: true,
          url: 'https://numberninja.app/verify',
        })
        await AsyncStorage.setItem('emailForSignIn', email)
        logEvent('sign_up', { method: 'email' })
      } else {
        throw new Error('User not found')
      }
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error)
      logError(new Error(`Sign Up Error: ${errorMessage}`))
      throw errorMessage
    }
  }

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken')
      await auth().signOut()
      setUser(null)
      router.replace('/(auth)/login')
      logEvent('sign_out')
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error)
      logError(new Error(`Sign Out Error: ${errorMessage}`))
      throw errorMessage
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email)
      logEvent('password_reset_email_sent')
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error)
      logError(new Error(`Reset Password Error: ${errorMessage}`))
      throw errorMessage
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      if (auth().currentUser) {
        await auth().currentUser?.updatePassword(newPassword)
        logEvent('password_updated')
      } else {
        throw new Error('No user is currently signed in')
      }
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error)
      logError(new Error(`Update Password Error: ${errorMessage}`))
      throw errorMessage
    }
  }

  const updateDisplayName = async (newDisplayName: string) => {
    try {
      const user = auth().currentUser
      if (user) {
        await user.updateProfile({ displayName: newDisplayName })
        const updatedUser = auth().currentUser
        // Update the local user state
        setUser(updatedUser)
        logEvent('display_name_updated', { newDisplayName })
      } else {
        throw new Error('No user is currently signed in')
      }
    } catch (error) {
      console.error('Error updating display name:', error)
      throw error
    }
  }

  const resendVerificationEmail = async () => {
    try {
      const user = authExpo.currentUser
      if (user) {
        await user.sendEmailVerification({
          handleCodeInApp: true,
          url: 'https://numberninja.app/verify',
        })
        logEvent('verification_email_resent')
      } else {
        throw new Error('No user is currently signed in')
      }
    } catch (error) {
      const errorMessage = getFirebaseErrorMessage(error)
      logError(new Error(`Resend Verification Email Error: ${errorMessage}`))
      throw errorMessage
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        updateDisplayName,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
