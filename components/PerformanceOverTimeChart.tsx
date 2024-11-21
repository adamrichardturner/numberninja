import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { colors } from '../colors'

type PerformanceOverTimeChartProps = {
  performanceData: {
    date: string
    accuracy: number
  }[]
}

const PerformanceOverTimeChart: React.FC<PerformanceOverTimeChartProps> = ({
  performanceData,
}) => {
  const screenWidth = Dimensions.get('window').width
  const horizontalPadding = 40
  const chartWidth = screenWidth - horizontalPadding
  const chartHeight = 200
  const leftPadding = 30
  const bottomPadding = 30

  const maxAccuracy = 100
  const minAccuracy = 0

  // Calculate x and y positions for each data point
  const dataPoints = performanceData.map((item, index) => ({
    x: (index / (performanceData.length - 1)) * (chartWidth - leftPadding),
    y:
      chartHeight -
      ((item.accuracy - minAccuracy) / (maxAccuracy - minAccuracy)) *
        chartHeight,
  }))

  // Calculate y-axis labels
  const yAxisLabels = [0, 25, 50, 75, 100]

  return (
    <View style={[styles.container, { width: chartWidth }]}>
      <Text style={styles.title}>Performance Over Time</Text>
      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          {yAxisLabels.reverse().map((label, index) => (
            <Text key={index} style={styles.yAxisLabel}>
              {label}%
            </Text>
          ))}
        </View>
        <View
          style={[
            styles.chart,
            { width: chartWidth - leftPadding, height: chartHeight },
          ]}
        >
          <View style={styles.lineChart}>
            {dataPoints.map((point, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <View
                    style={[
                      styles.line,
                      {
                        left: dataPoints[index - 1].x,
                        top: dataPoints[index - 1].y,
                        width: point.x - dataPoints[index - 1].x,
                        height: point.y - dataPoints[index - 1].y,
                      },
                    ]}
                  />
                )}
                <View
                  style={[
                    styles.dataPoint,
                    {
                      left: point.x - 3,
                      top: point.y - 3,
                    },
                  ]}
                />
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>
      <View style={[styles.xAxis, { width: chartWidth - leftPadding }]}>
        {performanceData.map((item, index) => (
          <View
            key={index}
            style={{
              width: (chartWidth - leftPadding) / performanceData.length,
            }}
          >
            <Text style={styles.xLabel}>{item.date}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.xAxisTitle}>Date</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
    fontSize: 10,
  },
  chart: {
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'black',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  lineChart: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  line: {
    position: 'absolute',
    backgroundColor: colors.primary,
    height: 2,
  },
  dataPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  xAxis: {
    flexDirection: 'row',
    width: '100%',
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
    fontSize: 10,
  },
})

export default PerformanceOverTimeChart
