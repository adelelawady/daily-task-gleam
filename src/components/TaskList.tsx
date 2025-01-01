import { useEffect, useState } from 'react'
import { tasksService } from '../lib/services/tasks'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'
import CreateTaskForm from './CreateTaskForm'

type Task = Database['public']['Tables']['tasks']['Row']

interface TaskListProps {
  onTaskSelect: (task: Task) => void
  selectedTaskId?: string
}

export default function TaskList({ onTaskSelect, selectedTaskId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    try {
      const data = await tasksService.getTasks()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load tasks'))
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTask(title: string, description?: string) {
    try {
      const user = await supabase.auth.getUser()
      if (!user.data.user) throw new Error('Not authenticated')

      const newTask = await tasksService.createTask({
        user_id: user.data.user.id,
        title,
        description
      })
      setTasks(prev => [newTask, ...prev])
      setShowCreateForm(false)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create task'))
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="space-y-4">
      {!showCreateForm ? (
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full p-4 text-left text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors"
        >
          + Add new task
        </button>
      ) : (
        <CreateTaskForm 
          onSubmit={handleCreateTask}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="space-y-2">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => onTaskSelect(task)}
            className={`w-full p-4 text-left bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
              task.id === selectedTaskId ? 'ring-2 ring-primary' : ''
            }`}
          >
            <h3 className="font-medium">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}