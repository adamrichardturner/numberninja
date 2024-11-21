import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native'
import { colors } from '../colors'
import { useLanguage, Translations } from '../contexts/languageContext'

interface ConfirmationModalProps {
  isVisible: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  confirmColor?: string
  cancelColor?: string
  onConfirm: () => Promise<void>
  onCancel: () => void
  children?: React.ReactNode
  isConfirmDisabled?: boolean
  translationKeys?: {
    title?: keyof Translations
    message?: keyof Translations
    confirmText?: keyof Translations
    cancelText?: keyof Translations
  }
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  title,
  message,
  confirmText,
  cancelText,
  confirmColor = colors.error,
  cancelColor = colors.gray,
  onConfirm,
  onCancel,
  children,
  isConfirmDisabled = false,
  translationKeys,
}) => {
  const [animation] = React.useState(new Animated.Value(0))
  const [isLoading, setIsLoading] = useState(false)
  const [resultMessage, setResultMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { translations } = useLanguage()

  useEffect(() => {
    if (isVisible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
      }).start()
    }
  }, [isVisible])

  const modalStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
    opacity: animation,
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      await onConfirm()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Error completing operation'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, modalStyle]}>
          <Text style={styles.title}>
            {translationKeys?.title
              ? translations[translationKeys.title]
              : title}
          </Text>
          {isLoading ? (
            <ActivityIndicator size="large" color={confirmColor} />
          ) : (
            <>
              <Text style={styles.message}>
                {translationKeys?.message
                  ? translations[translationKeys.message]
                  : message}
              </Text>
              {children}
              {errorMessage && (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              )}
              {resultMessage ? (
                <Text style={styles.resultMessage}>{resultMessage}</Text>
              ) : (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.cancelButton,
                      { backgroundColor: cancelColor || colors.gray },
                    ]}
                    onPress={onCancel}
                  >
                    <Text style={styles.buttonText}>
                      {translationKeys?.cancelText
                        ? translations[translationKeys.cancelText]
                        : cancelText}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      { backgroundColor: confirmColor || colors.error },
                      isConfirmDisabled && styles.disabledButton,
                    ]}
                    onPress={handleConfirm}
                    disabled={isConfirmDisabled}
                  >
                    <Text style={styles.buttonText}>
                      {translationKeys?.confirmText
                        ? translations[translationKeys.confirmText]
                        : confirmText}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: colors.gray,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  confirmButton: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  resultMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorMessage: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: 10,
  },
})

export default ConfirmationModal
