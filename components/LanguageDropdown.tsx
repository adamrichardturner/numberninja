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
import { Language } from '../contexts/languageContext'
import { colors } from '../colors'
import { Ionicons } from '@expo/vector-icons'

interface LanguageDropdownProps {
  language: Language
  changeLanguage: (lang: Language) => void
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  language,
  changeLanguage,
}) => {
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
        <Text style={styles.buttonText}>
          {language === 'en' ? 'English' : 'Deutsch'}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Ionicons name="close" size={36} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Language</Text>
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
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    padding: 20,
    backgroundColor: colors.white,
  },
  buttonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: colors.white,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    height: 200,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
})

export default LanguageDropdown
