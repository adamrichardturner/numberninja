import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

interface BackButtonProps {
  onPress?: () => void
  color?: string
}

const BackButton: React.FC<BackButtonProps> = ({ onPress, color }) => {
  const navigation = useNavigation()

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      navigation.goBack()
    }
  }

  return (
    <TouchableOpacity style={styles.backButton} onPress={handlePress}>
      <Ionicons name="arrow-back" size={26} color={color || 'black'} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 40,
    left: 0,
    zIndex: 10,
    padding: 20,
  },
})

export default BackButton
