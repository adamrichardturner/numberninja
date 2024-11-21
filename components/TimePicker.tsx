import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { colors } from '../colors'
import { useLanguage } from '../contexts/languageContext'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SLIDER_PADDING = 20
const SLIDER_WIDTH = SCREEN_WIDTH - SLIDER_PADDING * 2

interface TimePickerProps {
  value: number
  onChange: (value: number) => void
  minValue: number
  maxValue: number
  step: number
  onSliderActive: (active: boolean) => void
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  minValue,
  maxValue,
  step,
  onSliderActive,
}) => {
  const { translations } = useLanguage()

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <View style={styles.container}>
      <MultiSlider
        values={[value]}
        sliderLength={SLIDER_WIDTH}
        onValuesChange={(values) => onChange(values[0])}
        min={minValue}
        max={maxValue}
        step={step}
        selectedStyle={styles.selectedTrack}
        unselectedStyle={styles.unselectedTrack}
        containerStyle={styles.sliderContainer}
        trackStyle={styles.track}
        markerStyle={styles.marker}
        touchDimensions={{
          height: 40,
          width: 40,
          borderRadius: 20,
          slipDisplacement: 40,
        }}
        onValuesChangeStart={() => onSliderActive(true)}
        onValuesChangeFinish={() => onSliderActive(false)}
        customMarkerLeft={(e) => (
          <View
            style={styles.marker}
            accessibilityLabel={`${translations.minimumValue}: ${e.currentValue}`}
          />
        )}
        customMarkerRight={(e) => (
          <View
            style={styles.marker}
            accessibilityLabel={`${translations.maximumValue}: ${e.currentValue}`}
          />
        )}
      />
      <View style={styles.labelContainer}>
        <View style={styles.labelWrapper}>
          <Text style={styles.labelInfo}>{translations.time}</Text>
          <Text style={styles.label}>{formatTime(value)}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sliderContainer: {
    height: 40,
  },
  selectedTrack: {
    backgroundColor: colors.primary,
  },
  unselectedTrack: {
    backgroundColor: colors.gray,
  },
  track: {
    height: 4,
  },
  marker: {
    backgroundColor: colors.primary,
    height: 25,
    width: 25,
    borderRadius: 25,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
  },
  labelWrapper: {
    alignItems: 'center',
  },
  labelInfo: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default TimePicker
