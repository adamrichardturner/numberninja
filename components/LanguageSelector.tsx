import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Dimensions,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { useLanguage, Language } from '../contexts/languageContext'
import { colors } from '../colors'
import { Ionicons } from '@expo/vector-icons'

const LanguageSelector: React.FC = () => {
  const { language, changeLanguage, translations } = useLanguage()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  const handleLanguageChange = (itemValue: Language) => {
    changeLanguage(itemValue)
    toggleModal()
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal} style={styles.button}>
        <Text style={styles.buttonText}>{translations.changeLanguage}</Text>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Ionicons name="close" size={36} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{translations.selectLanguage}</Text>
            <Picker
              selectedValue={language}
              onValueChange={handleLanguageChange}
              style={styles.picker}
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Deutsch" value="de" />
            </Picker>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  )
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 5,
    borderRadius: 5,
  },
  button: {
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: colors.primary,
    height: 48,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.7,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.black,
  },
  picker: {
    width: '100%',
    height: 200,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 20,
  },
})

export default LanguageSelector
