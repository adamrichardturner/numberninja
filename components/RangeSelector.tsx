import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { colors } from '../colors'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SLIDER_PADDING = 20
const SLIDER_WIDTH = SCREEN_WIDTH - SLIDER_PADDING * 2

interface RangeSelectorProps {
  onRangeChange: (min: number, max: number) => void
  min: number
  max: number
  initialMin: number
  initialMax: number
  values: number[]
  onValuesChange: (values: number[]) => void
  onRangeSelectingChange: (isSelecting: boolean) => void
  translations: {
    minimumValue: string
    maximumValue: string
  }
  accessibilityLabel?: string
}

const RangeSelector: React.FC<RangeSelectorProps> = ({
  onRangeChange,
  min,
  max,
  initialMin,
  initialMax,
  values,
  onValuesChange,
  onRangeSelectingChange,
  translations,
  accessibilityLabel,
}) => {
  const [range, setRange] = useState<number[]>(
    values || [initialMin, initialMax]
  )
  const [isRangeSelecting, setIsRangeSelecting] = useState(false)

  useEffect(() => {
    onRangeSelectingChange(isRangeSelecting)
  }, [isRangeSelecting, onRangeSelectingChange])

  const handleValuesChange = (newValues: number[]) => {
    setIsRangeSelecting(true)
    let [newMin, newMax] = newValues

    // Enforce minimum distance of 10
    if (newMax - newMin < 10) {
      if (newMin === range[0]) {
        newMax = newMin + 10
      } else {
        newMin = newMax - 10
      }
    }

    // Respect min and max constraints
    newMin = Math.max(min, newMin)
    newMax = Math.min(max, newMax)

    setRange([newMin, newMax])
    onValuesChange([newMin, newMax])
  }

  const handleValuesChangeFinish = (values: number[]) => {
    let [newMin, newMax] = values

    // Enforce minimum distance of 10
    if (newMax - newMin < 10) {
      if (newMin === range[0]) {
        newMax = newMin + 10
      } else {
        newMin = newMax - 10
      }
    }

    // Respect min and max constraints
    newMin = Math.max(min, newMin)
    newMax = Math.min(max, newMax)

    setRange([newMin, newMax])
    onRangeChange(newMin, newMax)
    setIsRangeSelecting(false)
  }

  return (
    <View style={styles.container}>
      <MultiSlider
        values={range}
        sliderLength={SLIDER_WIDTH - SLIDER_PADDING}
        onValuesChange={handleValuesChange}
        onValuesChangeFinish={handleValuesChangeFinish}
        min={min}
        max={max}
        step={1}
        allowOverlap={false}
        snapped
        containerStyle={styles.sliderContainer}
        selectedStyle={styles.selectedTrack}
        unselectedStyle={styles.unselectedTrack}
        markerStyle={styles.marker}
        minMarkerOverlapDistance={10}
        customMarkerLeft={(e) => (
          <View
            style={styles.marker}
            accessibilityLabel={
              accessibilityLabel
                ? `${accessibilityLabel}: ${e.currentValue}`
                : `${translations.minimumValue}: ${e.currentValue}`
            }
          />
        )}
        customMarkerRight={(e) => (
          <View
            style={styles.marker}
            accessibilityLabel={
              accessibilityLabel
                ? `${accessibilityLabel}: ${e.currentValue}`
                : `${translations.maximumValue}: ${e.currentValue}`
            }
          />
        )}
      />
      <View style={styles.labelContainer}>
        <View style={styles.labelWrapperA}>
          <Text style={styles.labelInfo}>Min</Text>
          <Text style={styles.label}>{range[0]}</Text>
        </View>

        <View style={styles.labelWrapperB}>
          <Text style={styles.labelInfo}>Max</Text>
          <Text style={styles.label}>{range[1]}</Text>
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
  marker: {
    backgroundColor: colors.primary,
    height: 25,
    width: 25,
    borderRadius: 25,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
    width: '100%',
    padding: 0,
    margin: 0,
  },
  labelWrapperA: {
    alignItems: 'flex-start',
  },
  labelWrapperB: {
    alignItems: 'flex-end',
  },
  labelInfo: {
    fontSize: 8,
    fontWeight: 'bold',
    marginRight: 0,
    color: colors.darkGray,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default RangeSelector
