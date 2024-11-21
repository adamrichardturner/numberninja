import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import CustomButton from '../../components/CustomButton'
import BackButton from '../../components/BackButton'
import { colors } from '../../colors'
import { useLanguage } from '../../contexts/languageContext'
import { TIME_LIMITS } from '../../constants/gameLimits'
import TimePicker from '../../components/TimePicker'
import CustomSwitch from '../../components/CustomSwitch'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const difficulties = ['Easy', 'Medium', 'Hard']

const HomeBanner = require('../../assets/game-mode.png')

const SelectDifficultyScreen = () => {
  const router = useRouter()
  const { translations } = useLanguage()
  const { mode, operations, termA, termB } = useLocalSearchParams<{
    mode: string
    operations: string
    termA: string
    termB: string
  }>()

  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  )
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [customTimeLimit, setCustomTimeLimit] = useState(600)
  const scrollY = new Animated.Value(0)
  const [isTimePickerActive, setIsTimePickerActive] = useState(false)

  const handleDifficultySelection = (difficulty: string) => {
    setSelectedDifficulty(difficulty)
  }

  const handleStart = useCallback(() => {
    if (selectedDifficulty || isAdvancedMode) {
      let timeLimit: number

      if (isAdvancedMode) {
        timeLimit = customTimeLimit
      } else {
        timeLimit =
          TIME_LIMITS[
            selectedDifficulty!.toUpperCase() as keyof typeof TIME_LIMITS
          ]
      }

      router.push({
        pathname: '/(protected)/game',
        params: {
          mode,
          operations,
          termA,
          termB,
          timeLimit,
        },
      })
    }
  }, [isAdvancedMode, selectedDifficulty, customTimeLimit, router])

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        scrollEnabled={!isTimePickerActive}
      >
        <BackButton color={colors.fadedWhite} />
        <Animated.View style={styles.parallaxContainer}>
          <Animated.Image
            source={HomeBanner}
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
        </Animated.View>
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>
              {isAdvancedMode
                ? translations.selectTime
                : translations.selectDifficulty}
            </Text>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>
              {translations.advancedOptions}
            </Text>
            <CustomSwitch
              value={isAdvancedMode}
              onValueChange={setIsAdvancedMode}
              thumbColor={isAdvancedMode ? colors.white : colors.gray}
              accessibilityLabel={
                isAdvancedMode
                  ? translations.advancedOptionsEnabled
                  : translations.advancedOptionsDisabled
              }
            />
          </View>

          {isAdvancedMode ? (
            <TimePicker
              value={customTimeLimit}
              onChange={setCustomTimeLimit}
              minValue={30}
              maxValue={1800}
              step={30}
              onSliderActive={setIsTimePickerActive}
            />
          ) : (
            <View style={styles.difficultiesContainer}>
              {difficulties.map((difficulty) => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.difficultyButton,
                    selectedDifficulty === difficulty &&
                      styles.selectedDifficulty,
                  ]}
                  onPress={() => handleDifficultySelection(difficulty)}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      selectedDifficulty === difficulty &&
                        styles.selectedDifficultyText,
                    ]}
                  >
                    {
                      translations[
                        difficulty.toLowerCase() as keyof typeof translations
                      ]
                    }
                  </Text>
                  {selectedDifficulty === difficulty && (
                    <View style={styles.selectedCircle} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </Animated.ScrollView>

      <View style={styles.startButtonContainer}>
        <CustomButton
          title={translations.startGame}
          onPress={handleStart}
          backgroundColor={colors.primary}
          titleColor="white"
          disabled={!selectedDifficulty && !isAdvancedMode}
          accessibilityLabel={translations.startGame}
          padding={30}
          fontSize={20}
        />
      </View>
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
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingBottom: 20,
  },
  parallaxImage: {
    width: '100%',
    height: SCREEN_HEIGHT / 4,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  difficultiesContainer: {
    marginBottom: 20,
  },
  difficultyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  selectedDifficulty: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  difficultyText: {
    fontSize: 18,
  },
  selectedDifficultyText: {
    color: colors.white,
  },
  selectedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  startButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 14,
    color: colors.darkGray,
  },
})

export default SelectDifficultyScreen
