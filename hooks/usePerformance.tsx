import { useState, useEffect, useMemo } from 'react'
import { performanceService } from '../services/performanceService'
import {
  OperationPerformance,
  PerformancePeriod,
  TotalStats,
  CommonWrongAnswer,
  OperationPerformanceResponse,
  TotalStatsResponse,
} from '../types/performanceStats'
import { Operation } from '../types/session'

export const usePerformance = () => {
  const [operationPerformance, setOperationPerformance] = useState<
    OperationPerformance[] | null
  >(null)
  const [totalStats, setTotalStats] = useState<TotalStats[] | null>(null)
  const [commonWrongAnswers, setCommonWrongAnswers] = useState<
    CommonWrongAnswer[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedPeriod, setSelectedPeriod] = useState<PerformancePeriod>('all')
  const [selectedOperation, setSelectedOperation] = useState<
    Operation | 'Summary'
  >('Summary')

  useEffect(() => {
    const fetchAllPerformanceData = async () => {
      try {
        setIsLoading(true)
        const [
          operationPerformanceResponse,
          totalStatsResponse,
          commonWrongAnswersResponse,
        ] = await Promise.all([
          performanceService.getOperationPerformance(),
          performanceService.getTotalStats(),
          performanceService.getCommonWrongAnswers(),
        ])

        setOperationPerformance(
          formatOperationPerformance(operationPerformanceResponse)
        )
        setTotalStats(formatTotalStats(totalStatsResponse))
        setCommonWrongAnswers(
          formatCommonWrongAnswers(commonWrongAnswersResponse)
        )
      } catch (err) {
        setError('Failed to fetch performance data')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllPerformanceData()
  }, [])

  const formatOperationPerformance = (
    data: OperationPerformanceResponse[]
  ): OperationPerformance[] | null => {
    if (!data || !Array.isArray(data)) return []
    return data.map((item) => ({
      operation: item.operation as Operation,
      totalQuestions: parseInt(item.total_questions) || 0,
      correctAnswers: parseInt(item.correct_answers) || 0,
      wrongAnswers: parseInt(item.wrong_answers) || 0,
      accuracy: parseFloat(item.percentage) || 0,
      date: item.date,
    }))
  }

  const formatTotalStats = (data: TotalStatsResponse): TotalStats[] | null => {
    if (!data || !Array.isArray(data)) return []
    return data.map((item) => ({
      totalQuestions: parseInt(item.total_questions) || 0,
      correctAnswers: parseInt(item.correct_answers) || 0,
      wrongAnswers: parseInt(item.wrong_answers) || 0,
      averageAccuracy: item.total_questions
        ? (parseInt(item.correct_answers) / parseInt(item.total_questions)) *
          100
        : 0,
      date: item.date,
    }))
  }

  const formatCommonWrongAnswers = (data: any[]): CommonWrongAnswer[] => {
    if (!data || !Array.isArray(data)) return []
    return data.map((item) => ({
      question: item.question,
      operation: item.operation,
      wrong_attempts: item.wrong_attempts,
      date: item.date,
    }))
  }

  const filterDataByPeriod = <T extends { date?: string }>(
    data: T[],
    period: PerformancePeriod
  ): T[] => {
    if (period === 'all') return data

    const now = new Date()
    const cutoffDate = new Date(now)

    switch (period) {
      case '6M':
        cutoffDate.setMonth(now.getMonth() - 6)
        break
      case '3M':
        cutoffDate.setMonth(now.getMonth() - 3)
        break
      case '1M':
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case '1W':
        cutoffDate.setDate(now.getDate() - 7)
        break
      case '1D':
        cutoffDate.setDate(now.getDate() - 1)
        break
    }

    return data.filter((item) => item.date && new Date(item.date) >= cutoffDate)
  }

  const filteredData = useMemo(() => {
    // Filtered operation performance data
    const filteredOperationPerformance =
      operationPerformance &&
      filterDataByPeriod(operationPerformance, selectedPeriod)

    const filteredTotalStats =
      totalStats && filterDataByPeriod(totalStats, selectedPeriod)

    const filteredCommonWrongAnswers = filterDataByPeriod(
      commonWrongAnswers,
      selectedPeriod
    )

    const aggregatedOperationPerformance: OperationPerformance[] =
      filteredOperationPerformance?.reduce((acc, item) => {
        // Find the index of the current operation in the accumulator array
        const existingOperationIndex = acc.findIndex(
          (op) => op.operation === item.operation
        )

        if (existingOperationIndex > -1) {
          // If the operation exists, update its values
          acc[existingOperationIndex].totalQuestions += item.totalQuestions
          acc[existingOperationIndex].correctAnswers += item.correctAnswers
          acc[existingOperationIndex].wrongAnswers += item.wrongAnswers
          acc[existingOperationIndex].accuracy =
            (acc[existingOperationIndex].correctAnswers /
              acc[existingOperationIndex].totalQuestions) *
            100
        } else {
          // If the operation does not exist, create a new entry
          acc.push({
            operation: item.operation,
            totalQuestions: item.totalQuestions,
            correctAnswers: item.correctAnswers,
            wrongAnswers: item.wrongAnswers,
            accuracy: (item.correctAnswers / item.totalQuestions) * 100,
          })
        }

        return acc
      }, [] as OperationPerformance[]) || []

    const aggregatedTotalStats: TotalStats = filteredTotalStats?.reduce(
      (acc, item) => {
        acc.totalQuestions += item.totalQuestions
        acc.correctAnswers += item.correctAnswers
        acc.wrongAnswers += item.wrongAnswers
        acc.averageAccuracy =
          acc.totalQuestions > 0
            ? (acc.correctAnswers / acc.totalQuestions) * 100
            : 0

        return acc
      },
      {
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        averageAccuracy: 0,
      } as TotalStats
    ) || {
      totalQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      averageAccuracy: 0,
    }

    return {
      operationPerformance: aggregatedOperationPerformance,
      totalStats: aggregatedTotalStats,
      commonWrongAnswers: filteredCommonWrongAnswers,
    }
  }, [operationPerformance, totalStats, commonWrongAnswers, selectedPeriod])

  return {
    ...filteredData,
    isLoading,
    error,
    selectedPeriod,
    setSelectedPeriod,
    selectedOperation,
    setSelectedOperation,
  }
}
