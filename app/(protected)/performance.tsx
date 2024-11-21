import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native'
import { OperationPerformance } from '../../types/performanceStats'
import { Operation } from '../../types/session'
import { TotalStats } from '../../types/performanceStats'
import { usePerformance } from '../../hooks/usePerformance'
import { useRouter } from 'expo-router'
import LoadingScreen from '../../components/LoadingScreen'
import TimePeriodSelector from '../../components/TimePeriodSelector'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../colors'
import CommonWrongAnswersDropdown from '../../components/CommonWrongAnswersDropdown'
import { useAuth } from '../../contexts/authContext'
import BackButton from '../../components/BackButton'
import { Translations, useLanguage } from '../../contexts/languageContext'
import LostConnectionScreen from '../../components/LostConnectionScreen'

const FractalParallax = require('../../assets/fractal-parralax.png')

type CommonWrongAnswer = {
  operation?: string
  question: string
  wrong_attempts: string
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')

const PerformanceScreen = () => {
  const { translations } = useLanguage()
  const router = useRouter()
  const {
    operationPerformance,
    totalStats,
    commonWrongAnswers,
    isLoading,
    error,
    selectedPeriod,
    setSelectedPeriod,
    selectedOperation,
    setSelectedOperation,
  } = usePerformance()

  const { user } = useAuth()

  const filteredCommonWrongAnswers = (commonWrongAnswers as CommonWrongAnswer[])
    .filter(
      (answer) =>
        selectedOperation === 'Summary' ||
        (answer?.operation?.toLowerCase() ?? '') ===
          (selectedOperation?.toLowerCase() ?? '')
    )
    .slice(0, 10)

  const scrollY = useRef<Animated.Value>(new Animated.Value(0))

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    return <LostConnectionScreen translations={translations} />
  }

  const tabs = [
    translations.summary,
    translations.addition,
    translations.subtraction,
    translations.multiplication,
    translations.division,
  ]

  const getOperationKey = (
    translatedOperation: string
  ): Operation | 'Summary' => {
    if (translatedOperation === translations.summary) return 'Summary'
    if (translatedOperation === translations.addition) return 'addition'
    if (translatedOperation === translations.subtraction) return 'subtraction'
    if (translatedOperation === translations.multiplication)
      return 'multiplication'
    if (translatedOperation === translations.division) return 'division'
    return 'Summary'
  }

  return (
    <View style={styles.mainContainer}>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY.current } } }],
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
                    translateY: scrollY.current.interpolate({
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
            <Text style={styles.title}>{translations.performance}</Text>
            <Text style={styles.subtitle}>
              {translations.performanceSubtitle.replace(
                '{name}',
                user?.displayName || translations.player
              )}
            </Text>
          </View>
        </Animated.View>

        <FlatList
          data={tabs}
          renderItem={({ item: tab }) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                getOperationKey(tab) === selectedOperation &&
                  styles.selectedTab,
              ]}
              onPress={() => setSelectedOperation(getOperationKey(tab))}
              accessibilityLabel={`${tab}`}
              accessibilityRole="tab"
              accessibilityState={{
                selected: getOperationKey(tab) === selectedOperation,
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  getOperationKey(tab) === selectedOperation &&
                    styles.selectedTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
        />

        <TimePeriodSelector
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
        />

        {selectedOperation === 'Summary' ? (
          <SummaryView
            totalStats={totalStats as TotalStats & { wrongAnswers: number }}
            operationPerformance={operationPerformance || []}
            commonWrongAnswers={filteredCommonWrongAnswers}
            translations={translations}
          />
        ) : (
          <OperationView
            operation={selectedOperation as Exclude<OperationType, 'Summary'>}
            operationPerformance={operationPerformance?.find(
              (op) =>
                (op?.operation?.toLowerCase() ?? '') ===
                (selectedOperation?.toLowerCase() ?? '')
            )}
            commonWrongAnswers={filteredCommonWrongAnswers}
            translations={translations}
          />
        )}

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
      <View style={styles.buttonContainer}>
        <CustomButton
          title={translations.goBack}
          onPress={() => router.push('/home')}
          backgroundColor={colors.black}
          titleColor="white"
          accessibilityLabel={translations.goBack}
          padding={30}
          fontSize={20}
        />
      </View>
    </View>
  )
}

interface SummaryViewProps {
  totalStats: TotalStats | null
  operationPerformance: OperationPerformance[]
  commonWrongAnswers: CommonWrongAnswer[]
  translations: Translations
}

const SummaryView = ({
  totalStats,
  operationPerformance,
  commonWrongAnswers,
  translations,
}: SummaryViewProps) => (
  <View>
    <Text style={styles.sectionTitle}>{translations.summary}</Text>
    {totalStats ? (
      <View style={styles.statsContainer}>
        <StatBox
          label={translations.totalQuestions}
          value={totalStats.totalQuestions || 0}
        />
        <StatBox
          label={translations.correctAnswers}
          value={totalStats.correctAnswers || 0}
        />
        <StatBox
          label={translations.wrongAnswers}
          value={totalStats.wrongAnswers || 0}
        />
        <StatBox
          label={translations.accuracy}
          value={`${(totalStats.averageAccuracy || 0).toFixed(0)}%`}
        />
      </View>
    ) : (
      <Text style={styles.noDataText}>{translations.noPerformanceData}</Text>
    )}

    <Text style={styles.sectionTitle}>{translations.yourPerformance}</Text>
    {operationPerformance.length > 0 ? (
      operationPerformance.map((op) => (
        <OperationPerformanceBar
          key={op.operation}
          {...op}
          translations={translations}
        />
      ))
    ) : (
      <Text style={styles.noDataText}>{translations.comeBackSoon}</Text>
    )}

    {commonWrongAnswers.length > 0 ? (
      <CommonWrongAnswersDropdown
        commonWrongAnswers={commonWrongAnswers}
        translations={translations}
      />
    ) : null}
  </View>
)

type OperationType =
  | 'Addition'
  | 'Subtraction'
  | 'Multiplication'
  | 'Division'
  | 'Summary'

interface OperationViewProps {
  operation?: OperationType
  operationPerformance: OperationPerformance | undefined
  commonWrongAnswers: CommonWrongAnswer[]
  translations: Translations
}

const OperationView = ({
  operation,
  operationPerformance,
  commonWrongAnswers,
  translations,
}: OperationViewProps) => (
  <View>
    <Text style={styles.sectionTitle}>
      {translations[operation?.toLowerCase() as keyof typeof translations] ||
        operation ||
        translations.unknownOperation}
    </Text>
    {operationPerformance ? (
      <View style={styles.statsContainer}>
        <StatBox
          label={translations.totalQuestions}
          value={operationPerformance.totalQuestions || 0}
        />
        <StatBox
          label={translations.accuracy}
          value={`${(operationPerformance.accuracy || 0).toFixed(0)}%`}
        />
        <StatBox
          label={translations.correct}
          value={operationPerformance.correctAnswers || 0}
        />
        <StatBox
          label={translations.wrong}
          value={operationPerformance.wrongAnswers || 0}
        />
      </View>
    ) : (
      <>
        <Text style={styles.noDataText}>
          {translations.noPerformanceData}{' '}
          {translations[
            operation?.toLowerCase() as keyof typeof translations
          ] ||
            operation ||
            translations.unknownOperation}
          .{' '}
        </Text>
        <Text style={styles.noDataText}>
          {translations.playToSeePerformance}
        </Text>
      </>
    )}

    {commonWrongAnswers.length > 0 ? (
      <CommonWrongAnswersDropdown
        commonWrongAnswers={commonWrongAnswers}
        translations={translations}
      />
    ) : null}
  </View>
)

const StatBox = ({
  label,
  value,
}: {
  label: string
  value: number | string
}) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
)

const OperationPerformanceBar = ({
  operation,
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  accuracy,
  translations,
}: OperationPerformance) => {
  const animatedWidth = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: accuracy,
      duration: 1000,
      useNativeDriver: false,
    }).start()
  }, [accuracy])

  return (
    <View style={styles.operationPerformance}>
      <Text style={styles.operationTitle}>
        {(translations &&
          translations[operation.toLowerCase() as keyof typeof translations]) ||
          operation}
      </Text>
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text
        style={styles.accuracyText}
      >{`${(Math.round(accuracy) || 0).toFixed(0)}%`}</Text>
      <Text style={styles.answersText}>
        {correctAnswers} {translations?.correct} | {wrongAnswers}{' '}
        {translations?.wrong} | {totalQuestions} {translations?.answered}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 0,
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
  contentContainer: {
    padding: 0,
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  tabContainer: {
    marginBottom: 15,
    marginHorizontal: 20,
    paddingHorizontal: 0,
    height: 50,
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginRight: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.darkGray,
  },
  selectedTabText: {
    color: colors.primary,
    fontWeight: 'semibold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  statBox: {
    width: '48%',
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: colors.darkGray,
    marginTop: 5,
    textAlign: 'center',
  },
  operationPerformance: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  operationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingHorizontal: 0,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  accuracyText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  answersText: {
    fontSize: 12,
    color: colors.darkGray,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  noDataText: {
    fontSize: 14,
    color: colors.darkGray,
    textAlign: 'left',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  bottomPadding: {
    height: 80,
  },
  subtitle: {
    fontSize: 12,
    color: colors.white,
    textAlign: 'left',
  },
})

export default PerformanceScreen
