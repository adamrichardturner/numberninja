import React from 'react'
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native'
import { colors } from '../colors'

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splash.png')}
        style={styles.splashImage}
      />
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.loader}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  splashImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  loader: {
    position: 'absolute',
    bottom: 50,
  },
})

export default LoadingScreen
