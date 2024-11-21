import { useState, useEffect, useCallback, useRef } from 'react'
import { sessionService } from '../services/sessionService'
import { questionService } from '../services/questionService'
import { formatQuestions } from '../utils/questionUtils'
import { Question } from '../types/question'
import { SessionConfig } from '../types/session'
import { useAnalytics } from '../contexts/analyticsContext'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { useLanguage } from '../contexts/languageContext'
import auth from '@react-native-firebase/auth'
import { Operation } from '../types/session'
import { logEvent, logError } from '../utils/firebaseAnalytics'

export const useGame = (config: SessionConfig) => {
  const analytics = useAnalytics()
  const router = useRouter()
  const { translations } = useLanguage()
  const [session, setSession] = useState<{
    sessionId: string
    timeLimit: number
  } | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gameStartTime, setGameStartTime] = useState<number | null>(null)
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState<
    number | null
  >(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isNavigatingToResults, setIsNavigatingToResults] = useState(false)
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)
  const [isGameFullyCancelled, setIsGameFullyCancelled] = useState(false)

  const hasNavigatedToResults = useRef(false)
  const timer = useRef<number | null>(null)

  const endGame = useCallback(async () => {
    try {
      if (!session) return null

      const totalElapsedTime = Date.now() - gameStartTime!
      const answeredQuestions = questions.filter(
        (q) => q.userAnswer !== undefined
      )
      const totalAnsweredTime = answeredQuestions.reduce(
        (total, q) => total + (q.timeTaken || 0),
        0
      )
      const averageTimePerQuestion =
        totalAnsweredTime / answeredQuestions.length || 0

      const updatedQuestions = questions.map((q, index) => {
        if (q.userAnswer !== undefined) {
          return {
            ...q,
            isCorrect: q.userAnswer === q.correctAnswer.toString(),
          }
        } else if (index === currentQuestionIndex && selectedAnswer) {
          // Handle the last question if it's answered but not yet updated
          return {
            ...q,
            userAnswer: selectedAnswer,
            timeTaken: Math.round(
              (Date.now() - currentQuestionStartTime!) / 1000
            ),
            isCorrect: selectedAnswer === q.correctAnswer.toString(),
          }
        } else {
          return {
            ...q,
            userAnswer: '',
            timeTaken: Math.round(averageTimePerQuestion),
            isCorrect: false,
          }
        }
      })

      const answersToSubmit = updatedQuestions.map((q, index) => ({
        questionIndex: index,
        selectedAnswer: q.userAnswer || '',
        isCorrect: q.isCorrect,
        timeTaken: q.timeTaken || 0,
        numberA: q.numberA,
        numberB: q.numberB,
        operation: q.operation as Operation,
      }))

      await questionService.submitAnswers(session.sessionId, answersToSubmit)

      return {
        correctAnswers: updatedQuestions.filter((q) => q.isCorrect).length,
        wrongAnswers: updatedQuestions.filter((q) => !q.isCorrect).length,
        mode: config.mode,
        totalTime: Math.round(totalElapsedTime / 1000),
        questions: updatedQuestions,
      }
    } catch (err) {
      const errorMessage = 'Failed to submit answers'
      setError(errorMessage)
      console.error(err)
      logError(err instanceof Error ? err : new Error(errorMessage))
      return null
    }
  }, [
    session,
    questions,
    config.mode,
    gameStartTime,
    currentQuestionIndex,
    selectedAnswer,
    currentQuestionStartTime,
  ])

  const finalizeGame = useCallback(async () => {
    if (hasNavigatedToResults.current || isCancelled) return
    setIsNavigatingToResults(true)
    setIsConfirmModalVisible(false)

    const submissionTimeout = setTimeout(() => {
      setError('Failed to submit answers within the time limit')
      setIsNavigatingToResults(false)
    }, 10000)

    const results = await endGame()

    clearTimeout(submissionTimeout)

    if (results && !hasNavigatedToResults.current) {
      hasNavigatedToResults.current = true
      const params = {
        correctAnswers: results.correctAnswers.toString(),
        wrongAnswers: results.wrongAnswers.toString(),
        totalTime: results.totalTime.toString(),
        questions: JSON.stringify(results.questions),
        mode: config.mode,
        operations: JSON.stringify(config.operations),
        termA: JSON.stringify(config.termA),
        termB: JSON.stringify(config.termB),
        timeLimit: config.timeLimit.toString(),
      }

      if (analytics?.analyticsEnabled) {
        router.replace({
          pathname: '/results',
          params,
        })
      } else {
        router.replace({
          pathname: '/simpleResults',
          params,
        })
      }

      logEvent('game_completed', {
        mode: config.mode,
        operations: config.operations,
        correctAnswers: results.correctAnswers,
        wrongAnswers: results.wrongAnswers,
        totalTime: results.totalTime,
      })
    } else {
      setIsNavigatingToResults(false)
    }
  }, [endGame, config, analytics?.analyticsEnabled, isCancelled, router])

  useEffect(() => {
    const initializeGame = async () => {
      try {
        setIsLoading(true)
        setError(null)

        let parsedConfig
        try {
          parsedConfig =
            typeof config === 'string' ? JSON.parse(config) : config
        } catch (parseError) {
          throw new Error('Invalid configuration data')
        }

        const validOperations = parsedConfig.operations.filter((op: string) =>
          ['addition', 'subtraction', 'multiplication', 'division'].includes(op)
        )
        if (validOperations.length === 0) {
          throw new Error('No valid operations selected')
        }
        const validConfig = { ...parsedConfig, operations: validOperations }

        const user = auth().currentUser
        if (!user) {
          throw new Error('No authenticated user found')
        }

        const sessionId = await sessionService.createSession({
          ...validConfig,
          firebaseUid: user.uid,
          timeLimit: validConfig.timeLimit,
        })

        if (!sessionId) {
          throw new Error('Invalid session data received')
        }

        setSession({ sessionId, timeLimit: validConfig.timeLimit })

        const questionsData = await questionService.getQuestions(sessionId)

        if (!questionsData || questionsData.length === 0) {
          throw new Error('No questions received')
        }

        const formattedQuestions = formatQuestions(questionsData)
        setQuestions(formattedQuestions)
        setGameStartTime(Date.now())
        setCurrentQuestionStartTime(Date.now())

        logEvent('game_started', {
          mode: validConfig.mode,
          operations: validConfig.operations,
          timeLimit: validConfig.timeLimit,
        })
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to initialize game. Please check your internet connection.'
        setError(errorMessage)
        console.error('Game initialization error:', err)
        logError(err instanceof Error ? err : new Error(errorMessage))
      } finally {
        setIsLoading(false)
      }
    }

    initializeGame()
  }, [])

  useEffect(() => {
    if (gameStartTime && session && !isCancelled && !isGameOver) {
      const updateTimer = () => {
        const now = Date.now()
        const elapsed = Math.min(
          Math.floor((now - gameStartTime) / 1000),
          session.timeLimit
        )
        setElapsedTime(elapsed)
        setTotalTime(elapsed)
        if (elapsed >= session.timeLimit) {
          if (timer.current !== null) {
            clearTimeout(timer.current)
            timer.current = null
          }
          setIsGameOver(true)
          finalizeGame()
        } else if (!isCancelled) {
          timer.current = setTimeout(updateTimer, 1000) as unknown as number
        }
      }

      updateTimer()

      return () => {
        if (timer.current !== null) {
          clearTimeout(timer.current)
          timer.current = null
        }
      }
    }
  }, [gameStartTime, finalizeGame, session, isCancelled, isGameOver])

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = useCallback(() => {
    if (isGameOver || !selectedAnswer) return

    setIsAnswerSubmitted(true)
    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect =
      selectedAnswer === currentQuestion.correctAnswer.toString()
    const timeTaken = Math.round(
      (Date.now() - currentQuestionStartTime!) / 1000
    )

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      setMessage(
        translations.success[
          Math.floor(Math.random() * translations.success.length)
        ]
      )
    } else {
      setMessage(
        translations.encouragement[
          Math.floor(Math.random() * translations.encouragement.length)
        ]
      )
    }

    const updatedQuestions = [...questions]
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      userAnswer: selectedAnswer,
      timeTaken,
      timestamp: Date.now(),
    }
    setQuestions(updatedQuestions)

    if (currentQuestionIndex >= questions.length - 1) {
      setIsGameOver(true)
      finalizeGame()
    }
  }, [
    selectedAnswer,
    questions,
    currentQuestionIndex,
    isGameOver,
    currentQuestionStartTime,
    finalizeGame,
    translations,
  ])

  const handleNextQuestion = useCallback(() => {
    if (isGameOver) return

    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)
    setMessage(null)
    setCurrentQuestionStartTime(Date.now())
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
    }
  }, [currentQuestionIndex, questions.length, isGameOver])

  const cancelGame = useCallback(() => {
    if (session) {
      sessionService.endSession(session.sessionId).catch(console.error)
    }
    setIsGameOver(true)
    setIsCancelled(true)
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
    setIsNavigatingToResults(false)
    hasNavigatedToResults.current = true
    setIsGameFullyCancelled(true)

    logEvent('game_cancelled', {
      mode: config.mode,
      operations: config.operations,
      questionsAnswered: currentQuestionIndex,
      totalQuestions: questions.length,
      elapsedTime,
    })
  }, [
    session,
    config.mode,
    config.operations,
    currentQuestionIndex,
    questions.length,
    elapsedTime,
  ])

  return {
    session,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    message,
    isAnswerSubmitted,
    isLoading,
    error,
    isGameOver,
    elapsedTime,
    handleAnswerSelection,
    handleSubmitAnswer,
    handleNextQuestion,
    totalTime,
    isNavigatingToResults,
    cancelGame,
    isConfirmModalVisible,
    setIsConfirmModalVisible,
    isGameFullyCancelled,
  }
}
