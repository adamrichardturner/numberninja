import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../colors'

interface CountdownTimerProps {
  timeLimit: number // in seconds
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ timeLimit }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 5,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: 'monospace',
  },
})

export default CountdownTimer
