import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CommonWrongAnswer } from '../types/performanceStats'
import { colors } from '../colors'
import { Translations } from '../contexts/languageContext'

interface CommonWrongAnswersDropdownProps {
  commonWrongAnswers: CommonWrongAnswer[]
  translations: Translations
}

const CommonWrongAnswersDropdown: React.FC<CommonWrongAnswersDropdownProps> = ({
  commonWrongAnswers,
  translations,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (commonWrongAnswers.length === 0) {
    return null
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.headerText}>{translations.commonWrongAnswers}</Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={colors.black}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.content}>
          {commonWrongAnswers.map((answer, index) => (
            <View
              key={index}
              style={[
                styles.answerItem,
                index === commonWrongAnswers.length - 1 &&
                  styles.lastAnswerItem,
              ]}
            >
              <Text style={styles.questionText}>{answer.question}</Text>
              <Text style={styles.wrongAttemptsText}>
                {translations.wrongAttempts}: {answer.wrong_attempts}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
    marginHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: colors.lightGray,
    borderWidth: 0,
    marginTop: 0,
    padding: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  answerItem: {
    marginBottom: 10,
    backgroundColor: colors.white,
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 5,
  },
  lastAnswerItem: {
    marginBottom: 0,
  },
  questionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  wrongAttemptsText: {
    fontSize: 12,
    color: colors.darkGray,
  },
})

export default CommonWrongAnswersDropdown
