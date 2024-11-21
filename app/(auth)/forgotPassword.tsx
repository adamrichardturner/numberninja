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
import { useLanguage } from '../../contexts/languageContext'
import CustomButton from '../../components/CustomButton'
import { authStyles } from './authStyles'
import { colors } from '../../colors'
import AuthFooter from '../../components/AuthFooter'

const Logo = require('../../assets/logo-vertical.png')

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth()
  const router = useRouter()
  const { translations } = useLanguage()
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleResetPassword = async () => {
    setErrorMessage('')
    setSuccessMessage('')
    setIsLoading(true)
    try {
      await resetPassword(email)
      setSuccessMessage(translations.passwordResetEmailSent)
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
        <Text style={authStyles.title}>{translations.resetPassword}</Text>
        <TextInput
          placeholder={translations.email}
          value={email}
          onChangeText={setEmail}
          style={authStyles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.darkGray}
        />
        <View style={authStyles.errorContainer}>
          <Text style={authStyles.errorText}>{errorMessage}</Text>
          <Text style={[authStyles.errorText, { color: 'green' }]}>
            {successMessage}
          </Text>
        </View>
        <View style={authStyles.buttonContainer}>
          <CustomButton
            title={translations.sendResetEmail}
            onPress={handleResetPassword}
            backgroundColor={colors.secondary}
            titleColor="white"
            disabled={isLoading}
            isLoading={isLoading}
            accessibilityLabel={translations.sendResetEmail}
            padding={30}
            fontSize={20}
          />
        </View>
        <Text
          style={authStyles.link}
          onPress={() => router.push('/(auth)/login')}
        >
          {translations.backToLogin}
        </Text>
      </ScrollView>
      <View style={authStyles.footer}>
        <AuthFooter />
      </View>
    </KeyboardAvoidingView>
  )
}
