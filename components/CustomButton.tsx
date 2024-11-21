import React from 'react'
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native'
import { colors } from '../colors'

interface CustomButtonProps {
  title: string
  onPress: () => void
  backgroundColor?: string
  titleColor?: string
  disabled?: boolean
  isLoading?: boolean
  loadingText?: string
  fullWidth?: boolean
  padding?: number
  accessibilityLabel?: string
  fontSize?: number
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  backgroundColor = colors.secondary,
  titleColor = '#fff',
  disabled = false,
  isLoading = false,
  loadingText,
  fullWidth = false,
  padding = 20,
  accessibilityLabel,
  fontSize = 16,
}) => {
  const buttonStyle: ViewStyle = {
    backgroundColor: disabled ? '#ccc' : backgroundColor,
    padding: padding,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: fullWidth ? '100%' : 'auto',
  }

  const textStyle: TextStyle = {
    color: disabled ? '#666' : titleColor,
    fontSize: fontSize,
    fontWeight: 'bold',
    marginRight: isLoading ? 10 : 0,
  }

  const buttonText = isLoading ? loadingText || title : title
  const buttonAccessibilityLabel = accessibilityLabel || buttonText

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || isLoading}
      accessibilityLabel={buttonAccessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || isLoading }}
    >
      <Text style={textStyle}>{buttonText}</Text>
      {isLoading && <ActivityIndicator color={titleColor} />}
    </TouchableOpacity>
  )
}

export default CustomButton
