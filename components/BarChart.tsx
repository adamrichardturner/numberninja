import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { colors } from '../colors'
import { Translations } from '../contexts/languageContext'

type BarChartProps = {
  questions: {
    timeTaken: number
    isCorrect: boolean
  }[]
  translations: Translations
}

const BarChart: React.FC<BarChartProps> = ({ questions, translations }) => {
  const screenWidth = Dimensions.get('window').width
  const horizontalPadding = 40
  const chartWidth = screenWidth - horizontalPadding
  const chartHeight = 200
  const barPadding = 2
  const rightPadding = 20
  const leftPadding = 30

  const safeQuestions = questions.filter(
    (q) => q && typeof q.timeTaken === 'number'
  )
  const safeMaxTime = Math.max(...safeQuestions.map((q) => q.timeTaken), 1)

  const barWidth =
    (chartWidth - rightPadding - leftPadding) / safeQuestions.length -
    barPadding

  // Convert maxTime from ms to seconds
  const maxTimeSeconds = Math.ceil(safeMaxTime)

  // Calculate y-axis labels
  const yAxisLabels = [0, Math.ceil(maxTimeSeconds / 2), maxTimeSeconds]

  return (
    <View style={[styles.container, { width: chartWidth }]}>
      <Text style={styles.yAxisTitle}>{translations.timeTakenSeconds}</Text>
      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          {yAxisLabels.reverse().map((label, index) => (
            <Text key={index} style={styles.yAxisLabel}>
              {label.toString()}
            </Text>
          ))}
        </View>
        <View
          style={[
            styles.chart,
            { width: chartWidth - leftPadding, height: chartHeight },
          ]}
        >
          {safeQuestions.map((question, index) => {
            const barHeight = (question.timeTaken / safeMaxTime) * chartHeight
            return (
              <View
                key={index}
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    width: barWidth,
                    left: index * (barWidth + barPadding),
                    backgroundColor: question.isCorrect
                      ? colors.correctAnswer
                      : colors.wrongAnswer,
                  },
                ]}
              />
            )
          })}
        </View>
      </View>
      <View style={[styles.xAxis, { width: chartWidth - leftPadding }]}>
        {safeQuestions.map((_, index) => (
          <View key={index} style={{ width: barWidth + barPadding }}>
            <Text style={styles.xLabel}>{index + 1}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.xAxisTitle}>{translations.questionNumber}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    alignSelf: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  yAxis: {
    height: 200,
    justifyContent: 'space-between',
    marginRight: 5,
  },
  yAxisLabel: {
    textAlign: 'right',
    fontSize: 8,
  },
  yAxisTitle: {
    transform: [{ rotate: '-90deg' }],
    position: 'absolute',
    left: -100,
    top: 100,
    width: 200,
    textAlign: 'center',
    fontSize: 8,
  },
  chart: {
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'black',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  bar: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  xAxis: {
    flexDirection: 'row',
    width: '100%',
    paddingRight: 20,
    paddingLeft: 5,
  },
  xLabel: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 8,
  },
  xAxisTitle: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 8,
  },
})

export default BarChart
