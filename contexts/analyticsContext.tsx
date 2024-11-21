import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { logEvent } from '../utils/firebaseAnalytics'

interface AnalyticsContextType {
  analyticsEnabled: boolean
  toggleAnalytics: (value: boolean) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
)

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)

  useEffect(() => {
    AsyncStorage.getItem('analyticsEnabled').then((storedValue) => {
      if (storedValue !== null) {
        setAnalyticsEnabled(JSON.parse(storedValue))
      }
    })
  }, [])

  const toggleAnalytics = (value: boolean) => {
    setAnalyticsEnabled(value)
    AsyncStorage.setItem('analyticsEnabled', JSON.stringify(value))

    // Log the event when analytics preference changes
    logEvent('analytics_preference_changed', {
      analytics_enabled: value,
    })
  }

  return (
    <AnalyticsContext.Provider value={{ analyticsEnabled, toggleAnalytics }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export const useAnalytics = () => useContext(AnalyticsContext)
