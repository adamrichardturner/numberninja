import analytics from '@react-native-firebase/analytics'
import crashlytics from '@react-native-firebase/crashlytics'

export const logEvent = async (eventName: string, params?: object) => {
  await analytics().logEvent(eventName, params)
}

export const logError = (error: Error) => {
  crashlytics().recordError(error)
}

export const setUserProperties = async (properties: {
  [key: string]: string
}) => {
  for (const [key, value] of Object.entries(properties)) {
    await analytics().setUserProperty(key, value)
  }
}
