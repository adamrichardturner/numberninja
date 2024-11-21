import React, { useState, useCallback, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../colors'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  useAnimatedScrollHandler,
  interpolate,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Extrapolation,
} from 'react-native-reanimated'
import BarChart from '../../components/BarChart'
import { formatTime } from '../../utils/timeFormatter'
import BackButton from '../../components/BackButton'
import { useLanguage } from '../../contexts/languageContext'

const FractalParallax = require('../../assets/fractal-parralax.png')

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')

const ResultsScreen: React.FC = () => {
  const { translations } = useLanguage()
  const router = useRouter()
  const params = useLocalSearchParams<{
    correctAnswers: string
    wrongAnswers: string
    totalTime: string
    questions: string
    mode: string
    operations: string
    timeLimit: string
    termA: string
    termB: string
  }>()

  type ParsedQuestion = {
    question: string
    correctAnswer: string
    userAnswer: string
    timeTaken: number
    isCorrect: boolean
  }

  const parsedQuestions: ParsedQuestion[] = params.questions
    ? (JSON.parse(params.questions) as ParsedQuestion[])
    : []
  const operations = params.operations ? JSON.parse(params.operations) : []
  const totalQuestions = parsedQuestions.length

  const scrollY = useSharedValue(0)
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const animatedValues = useRef(
    parsedQuestions.map(() => ({
      height: useSharedValue(0),
      opacity: useSharedValue(0),
    }))
  ).current

  const correctAnswers = parseInt(params.correctAnswers || '0', 10)
  const wrongAnswers = parseInt(params.wrongAnswers || '0', 10)
  const totalTime = parseInt(params.totalTime || '0', 10)
  const mode = params.mode || ''
  const termA = JSON.parse(params.termA || '[]')
  const termB = JSON.parse(params.termB || '[]')
  const timeLimit = parseInt(params.timeLimit || '0', 10)

  const accuracy =
    totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
  const formattedTotalTime = formatTime(totalTime)

  const handleStartOver = useCallback(() => {
    router.push({
      pathname: '/(protected)/game',
      params: {
        mode,
        operations: JSON.stringify(operations),
        termA: JSON.stringify(termA),
        termB: JSON.stringify(termB),
        timeLimit: JSON.stringify(timeLimit),
      },
    })
  }, [router, mode, operations, termA, termB, timeLimit])

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })

  const parallaxStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-SCREEN_HEIGHT / 4, 0, SCREEN_HEIGHT / 4],
            [-SCREEN_HEIGHT / 12, 0, SCREEN_HEIGHT / 12],
            Extrapolation.CLAMP
          ),
        },
      ],
    }
  })

  const toggleQuestion = (index: number) => {
    if (expandedQuestion === index) {
      // Close the current question
      animatedValues[index].height.value = withTiming(0)
      animatedValues[index].opacity.value = withTiming(0)
      setExpandedQuestion(null)
    } else {
      // Close the previously expanded question
      if (expandedQuestion !== null) {
        animatedValues[expandedQuestion].height.value = withTiming(0)
        animatedValues[expandedQuestion].opacity.value = withTiming(0)
      }
      // Open the new question
      animatedValues[index].height.value = withTiming(100)
      animatedValues[index].opacity.value = withTiming(1)
      setExpandedQuestion(index)
    }
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <BackButton
          color={colors.fadedWhite}
          onPress={() => router.replace('/home')}
        />
        <Animated.View style={styles.parallaxContainer}>
          <Animated.Image
            source={FractalParallax}
            style={[styles.parallaxImage, parallaxStyle]}
          />
          <View style={styles.headerContent}>
            <Text style={styles.title}>{translations.yourMathResults}</Text>
          </View>
        </Animated.View>

        <View style={styles.content}>
          <View style={styles.operationsContainer}>
            <Text style={styles.operationsTitle}>
              {translations.operationsTested}
            </Text>
            <View style={styles.badgeContainer}>
              {operations.map((op: string, index: number) => (
                <View key={index} style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {
                      translations[
                        op.toLowerCase() as keyof typeof translations
                      ]
                    }
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>
                {translations.totalQuestions}
              </Text>
              <Text style={styles.statValue}>{totalQuestions}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>
                {translations.correctAnswers}
              </Text>
              <Text style={styles.statValue}>{correctAnswers}</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.timeBox}>
              <Text style={styles.statLabel}>{translations.totalTime}</Text>
              <Text style={styles.statValue}>{formattedTotalTime}</Text>
            </View>

            <View style={styles.wrongAnswersBox}>
              <Text style={styles.statLabel}>{translations.wrongAnswers}</Text>
              <Text style={styles.statValue}>{wrongAnswers}</Text>
            </View>
          </View>

          <Text style={styles.accuracyLabel}>{translations.accuracy}</Text>
          <Text style={styles.accuracyValue}>{accuracy.toFixed(0)}%</Text>

          {mode === 'test' && (
            <>
              <Text style={styles.breakdownTitle}>
                {translations.timeBreakdown}
              </Text>
              <BarChart
                questions={parsedQuestions.map((q) => ({
                  timeTaken: q.timeTaken || 0,
                  isCorrect: q.isCorrect || false,
                }))}
                translations={translations}
              />
            </>
          )}

          <Text style={styles.breakdownTitle}>
            {translations.questionsBreakdown}
          </Text>
          <View style={styles.questionsContainer}>
            {parsedQuestions.map((q, index: number) => {
              const animatedStyle = {
                maxHeight: animatedValues[index].height,
                opacity: animatedValues[index].opacity,
                overflow: 'hidden' as const,
              }

              const isCorrect = q.userAnswer === q.correctAnswer.toString()

              return (
                <View key={index} style={styles.questionContainer}>
                  <TouchableOpacity
                    onPress={() => toggleQuestion(index)}
                    style={[
                      styles.questionItem,
                      isCorrect
                        ? styles.correctQuestionItem
                        : styles.incorrectQuestionItem,
                    ]}
                  >
                    <View style={styles.questionContent}>
                      <View style={styles.questionNumberCircle}>
                        <Text style={styles.questionNumberText}>
                          {index + 1}
                        </Text>
                      </View>
                      <Text style={styles.questionText}>{q.question}</Text>
                      <View style={styles.questionInfo}>
                        <Text style={styles.timeTaken}>
                          {formatTime(q.timeTaken)}
                        </Text>
                        <Ionicons
                          name={
                            expandedQuestion === index
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={24}
                          color="black"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Animated.View
                    style={[styles.answerBreakdown, animatedStyle]}
                  >
                    <View style={styles.answerContent}>
                      <View style={styles.answerColumn}>
                        <Text style={styles.answerText}>
                          {translations.yourAnswer}:{' '}
                          {q.userAnswer ? q.userAnswer : translations.noAnswer}
                        </Text>
                        <Text style={styles.answerText}>
                          {translations.correctAnswer}: {q.correctAnswer}
                        </Text>
                      </View>
                      <View style={styles.resultTextContainer}>
                        <Text
                          style={[
                            styles.resultText,
                            isCorrect
                              ? styles.correctText
                              : styles.incorrectText,
                          ]}
                        >
                          {isCorrect
                            ? translations.correct
                            : translations.incorrect}
                        </Text>
                      </View>
                    </View>
                  </Animated.View>
                </View>
              )
            })}
          </View>

          <View style={{ marginBottom: 20 }}>
            <CustomButton
              title={translations.startOver}
              onPress={handleStartOver}
              backgroundColor={colors.primary}
              titleColor="white"
              accessibilityLabel={translations.startOver}
              padding={30}
              fontSize={20}
            />
          </View>

          <View style={{ marginBottom: 40 }}>
            <CustomButton
              title={translations.backToHome}
              onPress={() => router.replace('/home')}
              backgroundColor={colors.gray}
              titleColor="black"
              accessibilityLabel={translations.backToHome}
              padding={30}
              fontSize={20}
            />
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  parallaxContainer: {
    height: SCREEN_HEIGHT / 4,
    overflow: 'hidden',
  },
  parallaxImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT / 4,
    resizeMode: 'cover',
    position: 'absolute',
  },
  headerContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
  content: {
    padding: 20,
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statBox: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 8,
    width: '48%',
  },
  timeBox: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '48%',
  },
  wrongAnswersBox: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '48%',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  accuracyLabel: {
    fontSize: 16,
    color: '#666',
  },
  accuracyValue: {
    fontSize: 36,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questionsContainer: {
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 5,
    flexGrow: 0,
    flexShrink: 1,
  },
  questionItem: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  questionContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  questionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeTaken: {
    marginRight: 10,
    fontSize: 14,
    color: colors.gray,
  },
  answerBreakdown: {
    backgroundColor: colors.primary,
    padding: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginBottom: 10,
  },
  answerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerColumn: {
    flex: 1,
  },
  answerText: {
    color: colors.white,
    fontSize: 14,
  },
  resultTextContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
    padding: 4,
  },
  resultText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  correctText: {
    color: colors.correctAnswer,
  },
  incorrectText: {
    color: colors.wrongAnswer,
  },
  correctQuestionItem: {
    backgroundColor: colors.correctAnswer + '20',
  },
  incorrectQuestionItem: {
    backgroundColor: colors.wrongAnswer + '20',
  },
  operationsContainer: {
    marginBottom: 20,
  },
  operationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  badgeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  questionNumberCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  questionNumberText: {
    color: colors.darkGray,
    fontWeight: 'bold',
    fontSize: 16,
  },
})

export default ResultsScreen
