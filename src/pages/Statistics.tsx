import { useEffect, useState } from 'react'
import { tasksService } from '../lib/services/tasks'
import type { Database } from '../lib/database.types'
import { calculateDailyStats, calculateMonthlyStats } from '../utils/statistics'
import DailyStatusChart from '../components/charts/DailyStatusChart'
import MonthlyCompletionChart from '../components/charts/MonthlyCompletionChart'

type TaskHistory = Database['public']['Tables']['task_history']['Row']
type Task = Database['public']['Tables']['tasks']['Row']

interface HistoryWithTask extends TaskHistory {
  task: Task
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Success':
      return 'bg-green-100 text-green-800'
    case 'High':
      return 'bg-yellow-100 text-yellow-800'
    case 'Medium':
      return 'bg-blue-100 text-blue-800'
    case 'Low':
      return 'bg-gray-100 text-gray-800'
    case 'Failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function Statistics() {
  const [history, setHistory] = useState<HistoryWithTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await tasksService.getAllTaskHistoryWithTasks()
        setHistory(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load history'))
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="text-gray-600">Loading history...</div>
    </div>
  )
  
  if (error) return (
    <div className="bg-red-50 text-red-800 p-4 rounded-lg">
      Error: {error.message}
    </div>
  )

  const dailyStats = calculateDailyStats(history)
  const monthlyStats = calculateMonthlyStats(history)

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Daily Task Status Distribution</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <DailyStatusChart data={dailyStats} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Monthly Completion Rate</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <MonthlyCompletionChart data={monthlyStats} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Recent History</h2>
        <div className="bg-white shadow rounded-lg p-6">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No task history available</p>
          ) : (
            <div className="space-y-4">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{record.task.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}