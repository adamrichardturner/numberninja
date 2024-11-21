import React from 'react'
import { View, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import { colors } from '../colors'
import BackButton from '../components/BackButton'
import { useRouter } from 'expo-router'

const SupportScreen = () => {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} color={colors.darkNavy} />
      </View>
      <WebView
        source={{ uri: 'https://numberninja.app/support' }}
        style={styles.webview}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 1,
    paddingHorizontal: 10,
  },
  webview: {
    flex: 1,
    marginTop: 100,
  },
})

export default SupportScreen
