import type { Database } from '../lib/database.types'

type TaskHistory = Database['public']['Tables']['task_history']['Row']
type Task = Database['public']['Tables']['tasks']['Row']

interface HistoryWithTask extends TaskHistory {
  task: Task
}

export interface DailyStats {
  date: string
  Success: number
  High: number
  Medium: number
  Low: number
  Failed: number
}

export interface MonthlyStats {
  month: string
  completionRate: number
  totalTasks: number
  successfulTasks: number
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}

export function calculateDailyStats(history: HistoryWithTask[]): DailyStats[] {
  const dailyMap = new Map<string, DailyStats>()

  history.forEach(record => {
    const date = record.date.split('T')[0]
    const current = dailyMap.get(date) || {
      date,
      Success: 0,
      High: 0,
      Medium: 0,
      Low: 0,
      Failed: 0
    }

    current[record.status as keyof Omit<DailyStats, 'date'>]++
    dailyMap.set(date, current)
  })

  return Array.from(dailyMap.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14) // Last 14 days
}

export function calculateMonthlyStats(history: HistoryWithTask[]): MonthlyStats[] {
  const monthlyMap = new Map<string, {
    total: number
    successful: number
  }>()

  history.forEach(record => {
    const date = new Date(record.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    const current = monthlyMap.get(monthKey) || { total: 0, successful: 0 }
    current.total++
    if (record.status === 'Success') {
      current.successful++
    }
    monthlyMap.set(monthKey, current)
  })

  return Array.from(monthlyMap.entries())
    .map(([month, stats]) => ({
      month,
      completionRate: (stats.successful / stats.total) * 100,
      totalTasks: stats.total,
      successfulTasks: stats.successful
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6) // Last 6 months
}