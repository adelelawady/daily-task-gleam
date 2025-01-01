import { useState, useEffect } from 'react'
import TaskList from '../components/TaskList'
import TaskDetail from '../components/TaskDetail'
import { tasksService } from '../lib/services/tasks'
import { dateUtils } from '../lib/utils/dateUtils'
import type { Database } from '../lib/database.types'
import { TaskStatus } from '../types/task'
import CreateTaskForm from '../components/CreateTaskForm'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskHistory = Database['public']['Tables']['task_history']['Row']

export default function Tasks() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([])
  const [todayStatuses, setTodayStatuses] = useState<Record<string, TaskStatus | null>>({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(dateUtils.getTodayDate())

  useEffect(() => {
    loadTodayStatuses()
  }, [selectedDate])

  async function loadTodayStatuses() {
    try {
      const statuses = await tasksService.getTodayStatuses(selectedDate)
      setTodayStatuses(statuses)
    } catch (error) {
      console.error('Failed to load statuses:', error)
    }
  }

  async function handleTaskSelect(task: Task) {
    setSelectedTask(task)
    try {
      const history = await tasksService.getTaskHistory(task.id)
      setTaskHistory(history)
    } catch (error) {
      console.error('Failed to load task history:', error)
    }
  }

  async function handleStatusUpdate(status: TaskStatus) {
    if (!selectedTask) return

    try {
      const updatedHistory = await tasksService.updateTaskStatus(
        selectedTask.id, 
        status,
        selectedDate
      )
      
      setTaskHistory(prev => {
        const filtered = prev.filter(h => h.date !== selectedDate)
        return [updatedHistory, ...filtered]
      })

      // Update status in the list
      setTodayStatuses(prev => ({
        ...prev,
        [selectedTask.id]: status
      }))
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  const handleCreateTask = async (title: string, description?: string) => {
    try {
      await tasksService.createTask({ title, description })
      await loadTodayStatuses() // Refresh the task list
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  return (
    <div className="space-y-6">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          New Task
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <CreateTaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      <div className="flex gap-8">
        <div className="w-1/3">
          <TaskList
            todayStatuses={todayStatuses}
            onTaskSelect={handleTaskSelect}
            selectedTaskId={selectedTask?.id}
          />
        </div>
        {selectedTask && (
          <div className="w-2/3">
            <TaskDetail
              task={selectedTask}
              history={taskHistory}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
        )}
      </div>
    </div>
  )
}