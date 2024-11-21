import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import en from '../translations/en.json'
import de from '../translations/de.json'

export type Translations = typeof en

export type Language = 'en' | 'de'

type LanguageContextType = {
  language: Language
  changeLanguage: (newLanguage: Language) => void
  translations: Translations
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  changeLanguage: () => {},
  translations: en,
})

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [language, setLanguage] = useState<Language>('en')
  const [translations, setTranslations] = useState<Translations>(en)

  const initializeLanguage = useCallback(async () => {
    const storedLanguage = await AsyncStorage.getItem('language')
    if (
      storedLanguage &&
      (storedLanguage === 'en' || storedLanguage === 'de')
    ) {
      setLanguage(storedLanguage)
      setTranslations(storedLanguage === 'de' ? de : en)
    }
  }, [])

  useEffect(() => {
    initializeLanguage()
  }, [initializeLanguage])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setTranslations(newLanguage === 'de' ? de : en)
    AsyncStorage.setItem('language', newLanguage)
  }

  return (
    <LanguageContext.Provider
      value={{ language, changeLanguage, translations }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  return useContext(LanguageContext)
}
