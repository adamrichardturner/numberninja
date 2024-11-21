import React, { useState, useCallback, useMemo } from 'react'
import {
  View,
  TextInput,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../../contexts/authContext'
import { useLanguage } from '../../contexts/languageContext'
import CustomButton from '../../components/CustomButton'
import { authStyles } from './authStyles'
import { colors } from '../../colors'
import { Checkbox } from 'expo-checkbox'
import { FirebaseError } from 'firebase/app'
import AuthFooter from '../../components/AuthFooter'
const Logo = require('../../assets/logo-vertical.png')

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const getFirebaseErrorMessage = (error: FirebaseError) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please use a different email or try logging in.'
    case 'auth/invalid-email':
      return 'The email address is not valid. Please enter a valid email address.'
    case 'auth/weak-password':
      return 'The password is too weak. Please use a stronger password.'
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}

export default function RegisterScreen() {
  const { signUp } = useAuth()
  const router = useRouter()
  const { translations } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const isFormValid = useMemo(() => {
    return (
      isValidEmail(email) &&
      password.length >= 6 &&
      password === confirmPassword &&
      agreedToTerms &&
      displayName.trim() !== ''
    )
  }, [email, password, confirmPassword, agreedToTerms, displayName])

  const handleRegister = useCallback(async () => {
    if (!isFormValid) {
      setErrorMessage(translations.fillAllFieldsCorrectly)
      return
    }

    setErrorMessage('')
    setIsLoading(true)
    try {
      await signUp(email, password, displayName)
      router.push('/(auth)/verifyEmail')
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(getFirebaseErrorMessage(error))
      } else if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(translations.unexpectedError)
      }
    } finally {
      setIsLoading(false)
    }
  }, [email, password, displayName, signUp, router, isFormValid, translations])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={authStyles.container}
    >
      <ScrollView contentContainerStyle={authStyles.contentContainer}>
        <View style={authStyles.logoContainer}>
          <Image source={Logo} style={{ width: 300, height: 112.5 }} />
        </View>
        <Text style={authStyles.title}>{translations.createAccount}</Text>
        <TextInput
          placeholder={translations.email}
          value={email}
          onChangeText={setEmail}
          style={authStyles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.darkGray}
        />
        <TextInput
          placeholder={translations.password}
          value={password}
          onChangeText={setPassword}
          style={authStyles.input}
          secureTextEntry
          placeholderTextColor={colors.darkGray}
        />
        <TextInput
          placeholder={translations.confirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={authStyles.input}
          secureTextEntry
          placeholderTextColor={colors.darkGray}
        />
        <TextInput
          placeholder={translations.displayName}
          value={displayName}
          onChangeText={setDisplayName}
          style={authStyles.input}
          placeholderTextColor={colors.darkGray}
        />
        <View style={authStyles.errorContainer}>
          <Text style={authStyles.errorText}>{errorMessage}</Text>
        </View>
        <View style={authStyles.checkboxContainer}>
          <Checkbox
            value={agreedToTerms}
            onValueChange={setAgreedToTerms}
            color={agreedToTerms ? colors.primary : undefined}
          />
          <Text style={authStyles.checkboxLabel}>
            {translations.agreeToTerms}{' '}
            <Text style={authStyles.link} onPress={() => router.push('/terms')}>
              {translations.termsAndConditions}
            </Text>{' '}
            {translations.and}{' '}
            <Text
              style={authStyles.link}
              onPress={() => router.push('/privacy')}
            >
              {translations.privacyPolicy}
            </Text>
          </Text>
        </View>
        <View style={authStyles.buttonContainer}>
          <CustomButton
            title={translations.register}
            onPress={handleRegister}
            backgroundColor={colors.secondary}
            titleColor="white"
            disabled={!isFormValid || isLoading}
            isLoading={isLoading}
            loadingText={translations.registering}
            accessibilityLabel={translations.register}
            padding={30}
            fontSize={20}
          />
        </View>
        <Text
          style={authStyles.link}
          onPress={() => router.push('/(auth)/login')}
        >
          {translations.alreadyHaveAccount}
        </Text>
        <AuthFooter />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
