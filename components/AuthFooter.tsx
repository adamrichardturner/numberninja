import React from 'react'
import { View, StyleSheet } from 'react-native'
import LegalLinks from './LegalLinks'
import LanguageSelector from './LanguageSelector'

const AuthFooter = () => {
  return (
    <View style={styles.container}>
      <LegalLinks />
      <LanguageSelector />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 0,
  },
})

export default AuthFooter
