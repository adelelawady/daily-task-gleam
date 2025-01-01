import { useEffect, useState } from 'react'
import { Task, TaskStatus } from '../types/task'
import { tasksService } from '../lib/services/tasks'
import CreateTaskForm from './CreateTaskForm'

interface TaskListProps {
  todayStatuses: Record<string, TaskStatus | null>
  onTaskSelect?: (task: Task) => void
  selectedTaskId?: string
}

export default function TaskList({ todayStatuses, onTaskSelect, selectedTaskId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

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

  const handleCreateTask = async (title: string, description?: string) => {
    try {
      const newTask = await tasksService.createTask({ title, description })
      setTasks(prev => [...prev, newTask])
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      await tasksService.deleteTask(taskId)
      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  if (isLoading) {
    return <div>Loading tasks...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 text-sm font-medium text-black bg-primary rounded-md hover:bg-primary-dark"
        >
          Add Task
        </button>
      </div>

      {showCreateForm && (
        <CreateTaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

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
          
          <div className="flex items-center gap-2">
            {todayStatuses && todayStatuses[task.id] !== undefined && (
              <div className={`${getStatusColor(todayStatuses[task.id])} text-white px-2.5 py-0.5 rounded-full text-xs font-semibold`}>
                {todayStatuses[task.id] || 'No Status'}
              </div>
            )}
            <button
              onClick={(e) => handleDeleteTask(task.id, e)}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}