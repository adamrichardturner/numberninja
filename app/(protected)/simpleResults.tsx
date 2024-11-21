import React, { useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { useLanguage } from '../../contexts/languageContext'
import { colors } from '../../colors'
import LostConnectionScreen from '../../components/LostConnectionScreen'
import { router, useLocalSearchParams } from 'expo-router'
import BackButton from '../../components/BackButton'
import CustomButton from '../../components/CustomButton'

const NinjaGraphic = require('../../assets/ninja.png')

const SimpleResultsScreen = () => {
  const { translations } = useLanguage()
  const params = useLocalSearchParams()
  const correctAnswers = Number(params.correctAnswers)
  const totalQuestions = JSON.parse(params.questions as string).length
  const timeTaken = Number(params.totalTime)

  // Add error state
  const [error, setError] = useState<string | null>(null)

  if (!params) {
    return <LostConnectionScreen translations={translations} />
  }

  if (error) {
    return <LostConnectionScreen translations={translations} />
  }

  const handleStartOver = () => {
    router.push({
      pathname: '/(protected)/game',
      params: {
        ...params,
      },
    })
  }

  return (
    <View style={styles.container}>
      <BackButton
        color={colors.darkGray}
        onPress={() => router.replace('/home')}
      />
      <Image source={NinjaGraphic} style={styles.ninjaGraphic} />
      <Text style={styles.title}>{translations.gameResults}</Text>
      <Text style={styles.stat}>
        {translations.score}: {correctAnswers}/{totalQuestions}
      </Text>
      <Text style={styles.stat}>
        {translations.timeTaken}: {timeTaken} {translations.seconds}
      </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <CustomButton
            title={translations.startOver}
            onPress={handleStartOver}
            backgroundColor={colors.primary}
            titleColor="white"
            fullWidth
            accessibilityLabel={translations.startOver}
          />
        </View>
        <View style={styles.button}>
          <CustomButton
            title={translations.backToHome}
            onPress={() => router.replace('/home')}
            backgroundColor={colors.black}
            titleColor="white"
            fullWidth
            accessibilityLabel={translations.backToHome}
            padding={30}
            fontSize={20}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  ninjaGraphic: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
  },
  stat: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  button: {
    marginBottom: 10,
  },
})

export default SimpleResultsScreen
