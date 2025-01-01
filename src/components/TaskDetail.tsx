import { useState, useEffect } from 'react'
import type { Database } from '../lib/database.types'
import { STATUS_OPTIONS, TaskStatus } from '../types/task'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskHistory = Database['public']['Tables']['task_history']['Row']

interface TaskDetailProps {
  task: Task
  history: TaskHistory[]
  onStatusUpdate: (status: TaskStatus) => Promise<void>
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

export default function TaskDetail({ task, history, onStatusUpdate }: TaskDetailProps) {
  const [todayStatus, setTodayStatus] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  // Find today's status on component mount or when history changes
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayEntry = history.find(
      h => h.date.split('T')[0] === today
    )
    setTodayStatus(todayEntry?.status ?? null)
  }, [history])

  async function handleStatusClick(status: TaskStatus) {
    if (updating) return
    
    setUpdating(true)
    try {
      await onStatusUpdate(status)
      setTodayStatus(status)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
        {task.description && (
          <p className="text-gray-600">{task.description}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Today's Status</h3>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusClick(status)}
              disabled={updating}
              className={`px-4 py-2 rounded-full ${getStatusColor(status)} 
                ${todayStatus === status ? 'ring-2 ring-offset-2 ring-primary' : ''}
                hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200`}
            >
              {status}
              {todayStatus === status && (
                <span className="ml-2">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">History</h3>
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-gray-500">No history available</p>
          ) : (
            <div className="bg-white rounded-lg divide-y">
              {history
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3"
                  >
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}