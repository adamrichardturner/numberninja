import React, { useState, useCallback } from 'react'
import {
  View,
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
import { openInbox } from 'react-native-email-link'
import AuthFooter from '../../components/AuthFooter'

const Logo = require('../../assets/logo-vertical.png')

export default function VerifyEmailScreen() {
  const { resendVerificationEmail } = useAuth()
  const router = useRouter()
  const { translations } = useLanguage()
  const [isResendDisabled, setIsResendDisabled] = useState(false)

  const handleOpenEmailClient = () => {
    openInbox()
  }

  const handleResendEmail = useCallback(async () => {
    if (isResendDisabled) return

    try {
      setIsResendDisabled(true)
      await resendVerificationEmail()
      setTimeout(() => {
        setIsResendDisabled(false)
      }, 30000) // 30 seconds
    } catch (error) {
      console.error('Error resending verification email:', error)
      setIsResendDisabled(false)
    }
  }, [isResendDisabled, resendVerificationEmail])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={authStyles.container}
    >
      <ScrollView contentContainerStyle={authStyles.contentContainer}>
        <View style={authStyles.logoContainer}>
          <Image source={Logo} style={{ width: 300, height: 112.5 }} />
        </View>
        <Text style={authStyles.title}>{translations.emailVerification}</Text>
        <Text style={authStyles.subText}>
          {translations.checkEmailForVerification}
        </Text>
        <View style={authStyles.buttonContainer}>
          <CustomButton
            title={translations.openEmailClient}
            onPress={handleOpenEmailClient}
            backgroundColor={colors.secondary}
            titleColor="white"
            accessibilityLabel={translations.openEmailClient}
            padding={30}
            fontSize={20}
          />
          <CustomButton
            title={translations.resendVerificationEmail}
            onPress={handleResendEmail}
            backgroundColor={
              isResendDisabled ? colors.lightGray : colors.secondary
            }
            titleColor={isResendDisabled ? colors.darkGray : 'white'}
            disabled={isResendDisabled}
            accessibilityLabel={translations.resendVerificationEmail}
            padding={30}
            fontSize={20}
          />
        </View>
        <Text
          style={authStyles.link}
          onPress={() => router.push('/(auth)/login')}
        >
          {translations.alreadyVerified}
        </Text>
        <View style={authStyles.footer}>
          <AuthFooter />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
