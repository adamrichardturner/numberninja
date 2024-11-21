import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useLanguage } from '../contexts/languageContext'
import { colors } from '../colors'

const LegalLinks = () => {
  const router = useRouter()
  const { translations } = useLanguage()

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/terms')}>
        <Text style={styles.link}>{translations.terms}</Text>
      </TouchableOpacity>
      <Text style={styles.separator}>|</Text>
      <TouchableOpacity onPress={() => router.push('/privacy')}>
        <Text style={styles.link}>{translations.privacy}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  link: {
    color: colors.primary,
    fontSize: 16,
    height: 48,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  separator: {
    color: colors.darkGray,
    marginHorizontal: 5,
    height: 48,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
})

export default LegalLinks
