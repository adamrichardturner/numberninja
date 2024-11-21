import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors } from '../colors'
import { PerformancePeriod } from '../types/performanceStats'
import { useLanguage } from '../contexts/languageContext'

type TimePeriodSelectorProps = {
  selectedPeriod: string
  onSelectPeriod: (period: PerformancePeriod) => void
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  selectedPeriod,
  onSelectPeriod,
}) => {
  const { translations } = useLanguage()
  const periods: PerformancePeriod[] = ['all', '6M', '3M', '1M', '1W', '1D']

  return (
    <View style={styles.container}>
      {periods.map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            styles.periodButton,
            selectedPeriod === period && styles.selectedPeriod,
          ]}
          onPress={() => onSelectPeriod(period)}
        >
          <Text
            style={[
              styles.periodText,
              selectedPeriod === period && styles.selectedPeriodText,
            ]}
          >
            {period === 'all' ? translations.allTime : period}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    paddingVertical: 5,
    marginBottom: 5,
    marginHorizontal: 20,
    paddingHorizontal: 0,
  },
  periodButton: {
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  selectedPeriod: {
    backgroundColor: colors.white,
  },
  periodText: {
    color: colors.darkGray,
    fontSize: 12,
  },
  selectedPeriodText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
})

export default TimePeriodSelector
