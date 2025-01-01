import { useEffect, useState } from 'react'
import { Task, TaskStatus } from '../types/task'
import { tasksService } from '../lib/services/tasks'

interface TaskListProps {
  todayStatuses: Record<string, TaskStatus | null>
  onTaskSelect?: (task: Task) => void
  selectedTaskId?: string
}

export default function TaskList({ todayStatuses, onTaskSelect, selectedTaskId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await tasksService.getTasks()
        setTasks(data)
      } catch (error) {
        console.error('Error loading tasks:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  const getStatusColor = (status: TaskStatus | null) => {
    if (!status) return 'bg-gray-500'
    
    const colors: Record<TaskStatus, string> = {
      Success: 'bg-green-500',
      High: 'bg-blue-500',
      Medium: 'bg-yellow-500',
      Low: 'bg-orange-500',
      Failed: 'bg-red-500'
    }
    return colors[status]
  }

  if (isLoading) {
    return <div>Loading tasks...</div>
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          onClick={() => onTaskSelect?.(task)}
          className={`flex items-center justify-between p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow ${
            task.id === selectedTaskId ? 'ring-2 ring-primary' : ''
          }`}
        >
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="font-medium">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-500">{task.description}</p>
              )}
            </div>
          </div>
          
          {todayStatuses && todayStatuses[task.id] !== undefined && (
            <div className={`${getStatusColor(todayStatuses[task.id])} text-white px-2.5 py-0.5 rounded-full text-xs font-semibold`}>
              {todayStatuses[task.id] || 'No Status'}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}