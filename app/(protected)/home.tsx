import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../../contexts/authContext'
import { colors } from '../../colors'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { useAnalytics } from '../../contexts/analyticsContext'
import { useLanguage } from '../../contexts/languageContext'
import LegalLinks from '../../components/LegalLinks'

const HomeBanner = require('../../assets/game-mode.png')

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const HomeScreen = () => {
  const router = useRouter()
  const { user } = useAuth()
  const scrollY = new Animated.Value(0)
  const { translations } = useLanguage()
  const { analyticsEnabled } = useAnalytics() || {}

  const handleModeSelection = (selectedMode: 'test' | 'practice') => {
    router.push(`/(protected)/selectOperation?mode=${selectedMode}`)
  }

  const handlePerformance = () => {
    router.push('/(protected)/performance')
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View style={styles.parallaxContainer}>
          <Animated.Image
            source={HomeBanner}
            style={[
              styles.parallaxImage,
              {
                transform: [
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [-SCREEN_HEIGHT / 4, 0, SCREEN_HEIGHT / 4],
                      outputRange: [-SCREEN_HEIGHT / 12, 0, SCREEN_HEIGHT / 12],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          />
          <View style={styles.userContainer}>
            <TouchableOpacity
              style={styles.accountButton}
              onPress={() => router.push('/(protected)/account')}
            >
              <FontAwesome6 name="user-large" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.content}>
          <Text style={styles.welcomeText}>
            {translations.welcome}, {user?.displayName || translations.player}!
            👋
          </Text>
          <Text style={styles.title}>{translations.chooseGameMode}</Text>

          <TouchableOpacity
            style={styles.option}
            onPress={() => handleModeSelection('practice')}
          >
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>
                {translations.practiceMode}
              </Text>
              <Text style={styles.optionSubtitle}>
                {translations.practiceMakesPerfect}
              </Text>
            </View>
            <FontAwesome6 name="user-ninja" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => handleModeSelection('test')}
          >
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>{translations.testMode}</Text>
              <Text style={styles.optionSubtitle}>
                {translations.getReadyForTheBigDay}
              </Text>
            </View>
            <FontAwesome6 name="clock" size={24} color="black" />
          </TouchableOpacity>

          {analyticsEnabled && (
            <TouchableOpacity style={styles.option} onPress={handlePerformance}>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>
                  {translations.performance}
                </Text>
                <Text style={styles.optionSubtitle}>
                  {translations.seeHowYouStackUp}
                </Text>
              </View>
              <FontAwesome6 name="chart-line" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.ScrollView>
      <View style={styles.legalLinksContainer}>
        <LegalLinks />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  scrollView: {
    flex: 1,
  },
  parallaxContainer: {
    height: SCREEN_HEIGHT / 4,
    backgroundColor: colors.primary,
    paddingTop: 20,
  },
  parallaxImage: {
    width: '100%',
    height: SCREEN_HEIGHT / 4,
    resizeMode: 'cover',
  },
  userContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  accountButton: {
    backgroundColor: colors.primary,
    padding: 20,
  },
  content: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 24,
  },
  logoutButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 14,
    color: 'black',
  },
  legalLinksContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
})

export default HomeScreen
