import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { colors } from '../colors'
import { useLanguage } from '../contexts/languageContext'

interface MultipleSelectorProps {
  title: string
  selectedValue: number
  maxValue: number
  onValueChange: (value: number) => void
}

const MultipleSelector: React.FC<MultipleSelectorProps> = ({
  title,
  selectedValue,
  maxValue,
  onValueChange,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { translations } = useLanguage()

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}: {selectedValue}
      </Text>
      <TouchableOpacity onPress={toggleModal} style={styles.button}>
        <Text style={styles.buttonText}>{translations.selectMultiple}</Text>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {translations.selectMultiple}
                </Text>
                <Picker
                  selectedValue={selectedValue}
                  onValueChange={(itemValue) => {
                    onValueChange(itemValue)
                    toggleModal()
                  }}
                  style={styles.picker}
                >
                  {Array.from({ length: maxValue - 1 }, (_, i) => i + 1).map(
                    (value) => (
                      <Picker.Item
                        key={value}
                        label={value.toString()}
                        value={value}
                      />
                    )
                  )}
                </Picker>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'regular',
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    width: '100%',
  },
})

export default MultipleSelector
