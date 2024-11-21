import React, { useState, useRef } from 'react'
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
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { useLanguage } from '../../contexts/languageContext'
import RangeSelector from '../../components/RangeSelector'
import MultipleSelector from '../../components/MultipleSelector'
import InfoTooltip from '../../components/InfoTooltip'
import CustomSwitch from '../../components/CustomSwitch'

const HomeBanner = require('../../assets/game-mode.png')

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const SelectOperationScreen = () => {
  const router = useRouter()
  const { mode } = useLocalSearchParams<{ mode: string }>()
  const [selectedOperations, setSelectedOperations] = useState<string[]>([])
  const { translations } = useLanguage()
  const scrollY = useRef(new Animated.Value(0)).current
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [termA, setTermA] = useState({ min: 1, max: 50, multiple: 1 })
  const [termB, setTermB] = useState({ min: 1, max: 50, multiple: 1 })
  const [isRangeSelecting, setIsRangeSelecting] = useState(false)
  const [isRangeSelected, setIsRangeSelected] = useState(false)
  const [selectedBasicRange, setSelectedBasicRange] = useState<{
    min: number
    max: number
  } | null>(null)

  const BASIC_RANGES = [
    { min: 1, max: 10 },
    { min: 1, max: 20 },
    { min: 1, max: 100 },
    { min: 1, max: 110 },
    { min: 1, max: 120 },
    { min: 1, max: 200 },
  ]

  const handleOperationSelection = (operation: string) => {
    if (
      ['addition', 'subtraction', 'multiplication', 'division'].includes(
        operation
      )
    ) {
      setSelectedOperations((prev) => {
        if (prev.includes(operation)) {
          return prev.filter((op) => op !== operation)
        } else {
          return [...prev, operation]
        }
      })
    }
  }

  const handleRangeSelection = (min: number, max: number) => {
    setTermA({ min, max, multiple: 1 })
    setTermB({ min, max, multiple: 1 })
    setIsRangeSelected(true)
    setSelectedBasicRange({ min, max })
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
        scrollEnabled={!isRangeSelecting}
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
          <Text style={styles.sectionTitle}>
            {translations.selectOperation}
          </Text>
          <View style={styles.operationsContainer}>
            <TouchableOpacity
              style={[
                styles.operationButton,
                selectedOperations.includes('addition') &&
                  styles.selectedOperation,
              ]}
              onPress={() => handleOperationSelection('addition')}
            >
              <FontAwesome6
                name="plus"
                size={18}
                color={
                  selectedOperations.includes('addition')
                    ? colors.white
                    : colors.black
                }
              />
              <Text
                style={[
                  styles.operationName,
                  selectedOperations.includes('addition') &&
                    styles.selectedOperationText,
                ]}
              >
                {translations.addition}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.operationButton,
                selectedOperations.includes('subtraction') &&
                  styles.selectedOperation,
              ]}
              onPress={() => handleOperationSelection('subtraction')}
            >
              <FontAwesome6
                name="minus"
                size={18}
                color={
                  selectedOperations.includes('subtraction')
                    ? colors.white
                    : colors.black
                }
              />
              <Text
                style={[
                  styles.operationName,
                  selectedOperations.includes('subtraction') &&
                    styles.selectedOperationText,
                ]}
              >
                {translations.subtraction}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.operationButton,
                selectedOperations.includes('multiplication') &&
                  styles.selectedOperation,
              ]}
              onPress={() => handleOperationSelection('multiplication')}
            >
              <FontAwesome6
                name="xmark"
                size={18}
                color={
                  selectedOperations.includes('multiplication')
                    ? colors.white
                    : colors.black
                }
              />
              <Text
                style={[
                  styles.operationName,
                  selectedOperations.includes('multiplication') &&
                    styles.selectedOperationText,
                ]}
              >
                {translations.multiplication}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.operationButton,
                selectedOperations.includes('division') &&
                  styles.selectedOperation,
              ]}
              onPress={() => handleOperationSelection('division')}
            >
              <FontAwesome6
                name="divide"
                size={18}
                color={
                  selectedOperations.includes('division')
                    ? colors.white
                    : colors.black
                }
              />
              <Text
                style={[
                  styles.operationName,
                  selectedOperations.includes('division') &&
                    styles.selectedOperationText,
                ]}
              >
                {translations.division}
              </Text>
            </TouchableOpacity>
          </View>

          {selectedOperations.length > 0 && (
            <View style={styles.advancedOptionsContainer}>
              <Text style={styles.switchLabel}>
                {translations.advancedOptions}
              </Text>
              <CustomSwitch
                value={isAdvancedMode}
                onValueChange={(value) => {
                  setIsAdvancedMode(value)
                  if (value) {
                    setTermA({ min: 1, max: 50, multiple: 1 })
                    setTermB({ min: 1, max: 50, multiple: 1 })
                  } else {
                    setTermA({ min: 1, max: 10, multiple: 1 })
                    setTermB({ min: 1, max: 10, multiple: 1 })
                    setSelectedBasicRange(null)
                    setIsRangeSelected(false)
                  }
                }}
                thumbColor={isAdvancedMode ? colors.white : colors.gray}
                accessibilityLabel={
                  isAdvancedMode
                    ? translations.advancedOptionsEnabled
                    : translations.advancedOptionsDisabled
                }
              />
            </View>
          )}

          {selectedOperations.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>
                {translations.selectRange}
              </Text>

              {isAdvancedMode ? (
                <>
                  <View style={styles.termLabelContainer}>
                    <Text style={styles.termLabel}>{translations.termA}</Text>
                    <InfoTooltip
                      title={translations.termASelectionTitle}
                      content={translations.termASelectionContent}
                    />
                  </View>
                  <RangeSelector
                    translations={translations}
                    min={1}
                    max={200}
                    initialMin={1}
                    initialMax={200}
                    values={[termA.min, termA.max]}
                    onValuesChange={(values) =>
                      setTermA({ ...termA, min: values[0], max: values[1] })
                    }
                    onRangeChange={(min, max) =>
                      setTermA({ ...termA, min, max })
                    }
                    onRangeSelectingChange={setIsRangeSelecting}
                    accessibilityLabel={translations.termASelectionTitle}
                  />
                  <MultipleSelector
                    title={translations.termAMultiple}
                    selectedValue={termA.multiple}
                    maxValue={termA.max}
                    onValueChange={(value) =>
                      setTermA({ ...termA, multiple: value })
                    }
                  />

                  <View style={styles.termLabelContainer}>
                    <Text style={styles.termLabel}>{translations.termB}</Text>
                    <InfoTooltip
                      title={translations.termBSelectionTitle}
                      content={translations.termBSelectionContent}
                    />
                  </View>
                  <RangeSelector
                    translations={translations}
                    min={1}
                    max={200}
                    initialMin={1}
                    initialMax={200}
                    values={[termB.min, termB.max]}
                    onValuesChange={(values) =>
                      setTermB({ ...termB, min: values[0], max: values[1] })
                    }
                    onRangeChange={(min, max) =>
                      setTermB({ ...termB, min, max })
                    }
                    onRangeSelectingChange={setIsRangeSelecting}
                    accessibilityLabel={translations.termBSelectionTitle}
                  />
                  <MultipleSelector
                    title={translations.termBMultiple}
                    selectedValue={termB.multiple}
                    maxValue={termB.max}
                    onValueChange={(value) =>
                      setTermB({ ...termB, multiple: value })
                    }
                  />
                </>
              ) : (
                <View style={styles.basicRangeContainer}>
                  {BASIC_RANGES.map(({ min, max }) => (
                    <TouchableOpacity
                      key={`${min}-${max}`}
                      style={[
                        styles.basicRangeButton,
                        selectedBasicRange?.min === min &&
                          selectedBasicRange?.max === max &&
                          styles.selectedRange,
                      ]}
                      onPress={() => handleRangeSelection(min, max)}
                    >
                      <Text
                        style={[
                          styles.rangeText,
                          selectedBasicRange?.min === min &&
                            selectedBasicRange?.max === max &&
                            styles.selectedRangeText,
                        ]}
                      >{`${min} - ${max}`}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </Animated.ScrollView>
      <View style={styles.startButtonContainer}>
        <CustomButton
          accessibilityLabel={translations.selectDifficulty}
          title={translations.selectDifficulty}
          onPress={() => {
            router.push({
              pathname: '/(protected)/selectDifficulty',
              params: {
                mode,
                operations: JSON.stringify(selectedOperations),
                termA: JSON.stringify(termA),
                termB: JSON.stringify(termB),
              },
            })
          }}
          backgroundColor={colors.black}
          titleColor="white"
          disabled={
            selectedOperations.length === 0 ||
            (!isAdvancedMode && !isRangeSelected)
          }
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
    backgroundColor: '#fff',
    paddingBottom: 100,
  },
  scrollView: {
    flex: 1,
  },
  parallaxContainer: {
    height: SCREEN_HEIGHT / 4,
    backgroundColor: colors.primary,
    paddingTop: 20,
  },
  parallaxImage: {
    width: '100%',
    height: SCREEN_HEIGHT / 4,
    resizeMode: 'cover',
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 5,
  },
  operationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  operationButton: {
    width: '48%',
    aspectRatio: 2.5,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  operationSymbol: {
    fontSize: 32,
    fontWeight: 'regular',
    marginRight: 20,
    color: colors.black,
  },
  operationName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
    marginLeft: 10,
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  rangeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rangeContainer: {
    marginBottom: 20,
  },
  rangeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  rangeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoMessage: {
    fontSize: 10,
    color: colors.darkGray,
  },
  optionMessage: {
    fontSize: 11,
    color: colors.darkGray,
    marginBottom: 20,
  },
  selectedOperation: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  selectedOperationText: {
    color: colors.white,
  },
  selectedRange: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  selectedRangeText: {
    color: colors.white,
  },
  termsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  termInputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  termLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  termInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  advancedOptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginVertical: 10,
  },
  basicRangeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  basicRangeButton: {
    width: '48%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  basicRangeText: {
    textAlign: 'center',
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 14,
    color: colors.darkGray,
  },
  multipleInputContainer: {
    marginBottom: 0,
    marginTop: 0,
  },
  multipleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  multipleInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
  },
  multiplesContainer: {
    marginTop: 20,
  },
  multipleButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  multipleButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  selectedMultiple: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  multipleText: {
    fontSize: 16,
    color: colors.black,
  },
  selectedMultipleText: {
    color: colors.white,
  },
  startButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  advancedOptionsContent: {
    marginTop: 20,
    marginBottom: 100,
  },
  numberPatternsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  numberPatternButton: {
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '48%',
  },
  selectedNumberPattern: {
    backgroundColor: colors.primary,
  },
  numberPatternText: {
    fontSize: 14,
    textAlign: 'center',
  },
  termLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
})

export default SelectOperationScreen
