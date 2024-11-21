import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Switch } from 'react-native-switch'
import { colors } from '../colors'

interface CustomSwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  thumbColor?: string
  style?: ViewStyle
  accessibilityLabel?: string
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
  thumbColor,
  style,
  accessibilityLabel,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Switch
        barHeight={48}
        circleSize={40}
        switchWidthMultiplier={2}
        switchLeftPx={3}
        switchRightPx={3}
        renderActiveText={false}
        renderInActiveText={false}
        value={value}
        backgroundActive={colors.primary}
        backgroundInactive={colors.darkGray}
        onValueChange={onValueChange}
        circleActiveColor={thumbColor}
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default CustomSwitch
