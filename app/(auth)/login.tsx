import React, { useState } from 'react'
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
import CustomButton from '../../components/CustomButton'
import { authStyles } from './authStyles'
import { colors } from '../../colors'
import { useLanguage } from '../../contexts/languageContext'
import AuthFooter from '../../components/AuthFooter'

const Logo = require('../../assets/logo-vertical.png')

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function LoginScreen() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { translations } = useLanguage()

  const handleLogin = async () => {
    setErrorMessage('')

    if (!isValidEmail(email)) {
      setErrorMessage(translations.invalidEmailFormat)
      return
    }

    setIsLoading(true)
    try {
      await signIn(email, password)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(translations.unexpectedError)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={authStyles.container}
    >
      <ScrollView contentContainerStyle={authStyles.contentContainer}>
        <View style={authStyles.logoContainer}>
          <Image source={Logo} style={{ width: 300, height: 112.5 }} />
        </View>
        <Text style={authStyles.title}>{translations.login}</Text>
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
        <View style={authStyles.errorContainer}>
          <Text style={authStyles.errorText}>{errorMessage}</Text>
        </View>
        <View style={authStyles.buttonContainer}>
          <CustomButton
            title={translations.login}
            onPress={handleLogin}
            backgroundColor={colors.secondary}
            titleColor="white"
            disabled={isLoading}
            isLoading={isLoading}
            accessibilityLabel={
              isLoading ? translations.loading : translations.login
            }
            padding={30}
            fontSize={20}
          />
        </View>
        <Text
          style={authStyles.registerLink}
          onPress={() => router.push('/(auth)/register')}
        >
          {translations.dontHaveAccount}
        </Text>
        <Text
          style={authStyles.subLink}
          onPress={() => router.push('/(auth)/forgotPassword')}
        >
          {translations.forgotPassword}
        </Text>
        <View style={authStyles.footer}>
          <AuthFooter />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
