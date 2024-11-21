import React, { useCallback, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../colors'
import BackButton from '../../components/BackButton'
import { useGame } from '../../hooks/useGame'
import CountdownTimer from '../../components/CountdownTimer'
import LoadingScreen from '../../components/LoadingScreen'
import { SessionConfig } from '../../types/session'
import { useRouter } from 'expo-router'
import { useLanguage } from '../../contexts/languageContext'
import LostConnectionScreen from '../../components/LostConnectionScreen'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import ConfirmationModal from '../../components/ConfirmationModal'
import { useAuth } from '../../contexts/authContext'

const GameScreen: React.FC = () => {
  const { translations } = useLanguage()
  const router = useRouter()
  const { user } = useAuth()

  const { mode, operations, termA, termB, timeLimit } = useLocalSearchParams<{
    mode: string
    operations: string
    termA: string
    termB: string
    timeLimit: string
  }>()

  const parsedOperations = JSON.parse(operations) as SessionConfig['operations']

  const sessionConfig: SessionConfig = {
    mode: mode.toLowerCase() as SessionConfig['mode'],
    operations: parsedOperations,
    termA: JSON.parse(termA),
    termB: JSON.parse(termB),
    firebaseUid: user?.uid ?? '',
    timeLimit: parseInt(timeLimit, 10),
  }

  const {
    session,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    message,
    isAnswerSubmitted,
    isLoading,
    error,
    handleAnswerSelection,
    handleSubmitAnswer,
    handleNextQuestion,
    isNavigatingToResults,
    cancelGame,
    isConfirmModalVisible,
    setIsConfirmModalVisible,
  } = useGame(sessionConfig)

  const handleBackPress = useCallback(() => {
    setIsConfirmModalVisible(true)
  }, [])

  const handleConfirmCancel = useCallback(() => {
    setIsConfirmModalVisible(false)
    cancelGame()
    setTimeout(() => {
      router.replace('/home')
    }, 5)
  }, [cancelGame, router])

  useEffect(() => {
    if (isNavigatingToResults) {
      setIsConfirmModalVisible(false)
    }
  }, [isNavigatingToResults])

  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0

  if (isLoading || isNavigatingToResults) {
    return <LoadingScreen />
  }

  if (error) {
    return <LostConnectionScreen message={error} translations={translations} />
  }

  const currentQuestion = questions[currentQuestionIndex]

  if (!currentQuestion) {
    return <LostConnectionScreen translations={translations} />
  }

  return (
    <View style={styles.container}>
      <BackButton onPress={handleBackPress} color={colors.darkNavy} />
      <Text style={styles.question}>{currentQuestion.question}</Text>
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === option && styles.selectedOption,
              isAnswerSubmitted &&
                selectedAnswer === option &&
                (option === currentQuestion.correctAnswer.toString()
                  ? styles.correctOption
                  : styles.wrongOption),
              isAnswerSubmitted &&
                selectedAnswer !== option &&
                option === currentQuestion.correctAnswer.toString() &&
                styles.correctOptionBorder,
            ]}
            onPress={() => handleAnswerSelection(option)}
            disabled={isAnswerSubmitted}
          >
            <Text
              style={[
                styles.optionText,
                selectedAnswer === option && styles.selectedOptionText,
                isAnswerSubmitted &&
                  selectedAnswer === option &&
                  (option === currentQuestion.correctAnswer.toString()
                    ? styles.correctOptionText
                    : styles.wrongOptionText),
              ]}
            >
              {option}
            </Text>
            {isAnswerSubmitted &&
              (option === currentQuestion.correctAnswer.toString() ? (
                <FontAwesome6
                  name="circle-check"
                  size={24}
                  color={
                    selectedAnswer === option
                      ? colors.white
                      : colors.correctAnswer
                  }
                />
              ) : (
                selectedAnswer === option && (
                  <FontAwesome6
                    name="circle-xmark"
                    size={24}
                    color={colors.wrongAnswer}
                  />
                )
              ))}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.questionNumberContainer}>
        <Text style={styles.questionNumber}>
          {translations.question} {currentQuestionIndex + 1}/{questions.length}
        </Text>
        {mode === 'test' && (
          <CountdownTimer timeLimit={session?.timeLimit || 0} />
        )}
      </View>
      <View style={styles.progressBarContainer}>
        <ProgressBar progress={progress} />
      </View>

      <View style={styles.messageContainer}>
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title={
            isAnswerSubmitted
              ? translations.nextQuestion
              : translations.submitAnswer
          }
          onPress={isAnswerSubmitted ? handleNextQuestion : handleSubmitAnswer}
          backgroundColor={
            isAnswerSubmitted ? colors.primary : colors.secondary
          }
          titleColor="white"
          disabled={!selectedAnswer && !isAnswerSubmitted}
          fullWidth
          padding={30}
          fontSize={20}
          accessibilityLabel={
            isAnswerSubmitted
              ? translations.nextQuestion
              : translations.submitAnswer
          }
        />
      </View>
      <ConfirmationModal
        isVisible={isConfirmModalVisible}
        title={translations.confirmExit}
        message={translations.confirmExitMessage}
        confirmText={translations.yes}
        cancelText={translations.no}
        onConfirm={() => {
          handleConfirmCancel()
          return Promise.resolve()
        }}
        onCancel={() => {
          setIsConfirmModalVisible(false)
          return Promise.resolve()
        }}
        translationKeys={{
          title: 'confirmExit',
          message: 'confirmExitMessage',
          confirmText: 'yes',
          cancelText: 'no',
        }}
      />
    </View>
  )
}

const ProgressBar = ({ progress }: { progress: number }) => (
  <View style={styles.progressBarContainer}>
    <View style={[styles.progressBar, { width: `${progress}%` }]} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  question: {
    marginTop: 40,
    fontSize: 52,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    // Add shadow properties
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1, // for Android
  },
  optionsContainer: {
    marginBottom: 40,
    width: '100%',
    gap: 10,
  },
  optionButton: {
    height: 80,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    padding: 24,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    // Add shadow properties
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 0.5, // for Android
  },
  correctOption: {
    backgroundColor: colors.correctAnswer,
    borderColor: 'transparent',
    borderWidth: 2,
    // Add shadow properties
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  wrongOption: {
    backgroundColor: colors.white,
    borderColor: colors.wrongAnswer,
    borderWidth: 2,
    // Add shadow properties
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  correctOptionBorder: {
    borderColor: colors.correctAnswer,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 18,
  },
  correctOptionText: {
    color: colors.white,
  },
  wrongOptionText: {
    color: colors.black,
  },
  messageContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  selectedOptionText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
  },
  questionNumberContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.correctAnswer,
    borderRadius: 5,
  },
})

export default GameScreen
