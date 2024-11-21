import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { colors } from '../colors'
import CustomButton from './CustomButton'
import { useRouter } from 'expo-router'

const LostConnectionImage = require('../assets/lost-connection.png')

const LostConnectionScreen: React.FC<{
  message?: string
  translations: any
}> = ({ message, translations }) => {
  const router = useRouter()

  const handleRetry = () => {
    router.push('/home')
  }

  return (
    <View style={styles.container}>
      <Image source={LostConnectionImage} style={styles.image} />
      <Text style={styles.title}>Lost Connection</Text>
      <Text style={styles.message}>
        {message ||
          'Please check your internet connection or contact us for support.'}
      </Text>
      <CustomButton
        title="Return to Home"
        onPress={handleRetry}
        backgroundColor={colors.primary}
        titleColor="white"
        fullWidth
        accessibilityLabel={translations.returnToHome}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.black,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: colors.gray,
  },
})

export default LostConnectionScreen
