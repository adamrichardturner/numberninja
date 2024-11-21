import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { useAuth } from '../../contexts/authContext'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../colors'
import { useLanguage, Language } from '../../contexts/languageContext'
import { useAnalytics } from '../../contexts/analyticsContext'
import { router } from 'expo-router'
import ConfirmationModal from '../../components/ConfirmationModal'
import auth from '@react-native-firebase/auth'
import BackButton from '../../components/BackButton'
import LanguageDropdown from '../../components/LanguageDropdown'
import CustomSwitch from '../../components/CustomSwitch'

const FractalParallax = require('../../assets/fractal-parralax.png')
const SCREEN_HEIGHT = Dimensions.get('window').height

const AccountScreen = () => {
  const { user, updatePassword, updateDisplayName, signOut } = useAuth()
  const { language, changeLanguage, translations } = useLanguage()
  const { analyticsEnabled, toggleAnalytics } = useAnalytics()!
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '')
  const [message, setMessage] = useState('')
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false)
  const [isDisplayNameModalVisible, setIsDisplayNameModalVisible] =
    useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const scrollY = new Animated.Value(0)

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleUpdatePassword = () => {
    if (!validatePassword(newPassword)) {
      setMessage(translations.passwordValidationError)
    } else if (newPassword !== confirmNewPassword) {
      setMessage(translations.passwordMismatchError)
    } else {
      setMessage('')
      setIsPasswordModalVisible(true)
    }
  }

  const confirmUpdatePassword = async () => {
    try {
      const credential = auth.EmailAuthProvider.credential(
        user?.email || '',
        oldPassword
      )
      await user?.reauthenticateWithCredential(credential)
      await updatePassword(newPassword)
      setNewPassword('')
      setConfirmNewPassword('')
      setOldPassword('')
      setIsPasswordModalVisible(false)
      // Set success message with timeout
      setMessage(translations.passwordUpdateSuccess)
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setIsPasswordModalVisible(false)
      if ((error as { code?: string }).code === 'auth/wrong-password') {
        setMessage(
          translations.oldPasswordIncorrect || translations.passwordUpdateError
        )
      } else {
        setMessage(translations.passwordUpdateError)
      }
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleUpdateDisplayName = () => {
    if (newDisplayName.length < 3) {
      setMessage(translations.displayNameValidationError)
    } else if (newDisplayName === user?.displayName) {
      setMessage(translations.displayNameUnchanged)
    } else {
      setMessage('')
      setIsDisplayNameModalVisible(true)
    }
  }

  const confirmUpdateDisplayName = async () => {
    try {
      await updateDisplayName(newDisplayName)
      setIsDisplayNameModalVisible(false)
      // Update the user object in local state
      if (user) {
        setNewDisplayName(newDisplayName)
      }
      // Set success message with timeout
      setMessage(translations.displayNameUpdateSuccess)
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setIsDisplayNameModalVisible(false)
      setMessage(translations.displayNameUpdateError)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.replace('/(auth)/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleLanguageChange = (lang: Language) => {
    changeLanguage(lang)
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <BackButton color={colors.fadedWhite} />
        <Animated.View style={styles.parallaxContainer}>
          <Animated.Image
            source={FractalParallax}
            style={[
              styles.parallaxImage,
              {
                transform: [
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [-SCREEN_HEIGHT / 4, 0, SCREEN_HEIGHT / 4],
                      outputRange: [-SCREEN_HEIGHT / 12, 0, SCREEN_HEIGHT / 12],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {translations.accountSettings}
            </Text>
          </View>
        </Animated.View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>{translations.changePassword}</Text>
          <TextInput
            placeholder={translations.oldPassword}
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor={colors.darkGray}
          />
          <TextInput
            placeholder={translations.newPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor={colors.darkGray}
          />
          <TextInput
            placeholder={translations.confirmNewPassword}
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor={colors.darkGray}
          />

          <CustomButton
            title={translations.updatePassword}
            onPress={handleUpdatePassword}
            backgroundColor={colors.secondary}
            titleColor="white"
            accessibilityLabel={translations.updatePassword}
          />

          <View style={styles.messageContainer}>
            {message === translations.passwordValidationError && (
              <Text style={styles.validationText}>
                {translations.passwordRequirements}
              </Text>
            )}
            {message === translations.passwordMismatchError && (
              <Text style={styles.validationText}>
                {translations.passwordMismatchError}
              </Text>
            )}
          </View>

          <Text style={styles.sectionTitle}>
            {translations.updateDisplayName}
          </Text>
          <TextInput
            placeholder={translations.newDisplayName}
            value={newDisplayName}
            onChangeText={setNewDisplayName}
            style={styles.input}
            placeholderTextColor={colors.darkGray}
          />

          <CustomButton
            title={translations.updateDisplayName}
            onPress={handleUpdateDisplayName}
            backgroundColor={colors.secondary}
            titleColor="white"
            accessibilityLabel={translations.updateDisplayName}
          />

          <View style={styles.messageContainer}>
            {message === translations.displayNameValidationError && (
              <Text style={styles.validationText}>
                {translations.displayNameRequirements}
              </Text>
            )}
            {message === translations.displayNameUnchanged && (
              <Text style={styles.validationText}>
                {translations.displayNameUnchanged}
              </Text>
            )}
          </View>

          <Text style={styles.sectionTitle}>
            {translations.displayAnalytics}
          </Text>
          <View style={styles.switchContainer}>
            <Text>
              {analyticsEnabled
                ? translations.analyticsEnabled
                : translations.analyticsDisabled}
            </Text>
            <CustomSwitch
              thumbColor={analyticsEnabled ? colors.white : colors.lightGray}
              onValueChange={toggleAnalytics}
              value={analyticsEnabled}
              accessibilityLabel={
                analyticsEnabled
                  ? translations.analyticsEnabled
                  : translations.analyticsDisabled
              }
            />
          </View>

          <Text style={styles.sectionTitle}>{translations.language}</Text>
          <LanguageDropdown
            language={language}
            changeLanguage={handleLanguageChange}
          />

          <Text style={styles.sectionTitle}>{translations.manageAccount}</Text>
          <View style={styles.buttonContainer}>
            <CustomButton
              title={translations.logout}
              onPress={handleLogout}
              backgroundColor={colors.secondary}
              titleColor="white"
              accessibilityLabel={translations.logout}
            />
            <TouchableOpacity
              style={styles.deleteAccountButton}
              onPress={() => router.push('/support')}
            >
              <Text style={styles.deleteAccountText}>
                {translations.deleteAccountAndData}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>

      <ConfirmationModal
        isVisible={isPasswordModalVisible}
        title={translations.updatePasswordTitle}
        message={translations.updatePasswordMessage}
        confirmText={translations.confirm}
        cancelText={translations.cancel}
        onConfirm={confirmUpdatePassword}
        onCancel={() => setIsPasswordModalVisible(false)}
        confirmColor={colors.correctAnswer}
      />

      <ConfirmationModal
        isVisible={isDisplayNameModalVisible}
        title={translations.updateDisplayNameTitle}
        message={translations.updateDisplayNameMessage}
        confirmText={translations.confirm}
        cancelText={translations.cancel}
        onConfirm={confirmUpdateDisplayName}
        onCancel={() => setIsDisplayNameModalVisible(false)}
        confirmColor={colors.correctAnswer}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.darkGray,
    padding: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  messageContainer: {
    minHeight: 40,
    marginTop: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
  },
  message: {
    marginTop: 20,
    color: colors.primary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  parallaxContainer: {
    height: SCREEN_HEIGHT / 4,
    overflow: 'hidden',
    alignItems: 'flex-end',
  },
  parallaxImage: {
    width: '100%',
    height: SCREEN_HEIGHT / 4,
    resizeMode: 'cover',
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 20,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 15,
    marginTop: 20,
  },
  validationText: {
    color: colors.wrongAnswer,
    fontSize: 12,
  },
  deleteAccountText: {
    color: colors.wrongAnswer,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    height: 50,
  },
  errorMessage: {
    color: colors.wrongAnswer,
    fontSize: 12,
    marginTop: 10,
  },
  deleteAccountButton: {
    marginTop: 20,
    alignItems: 'center',
  },
})

export default AccountScreen
