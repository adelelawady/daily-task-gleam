import { useState } from 'react'
import TaskList from '../components/TaskList'
import TaskDetail from '../components/TaskDetail'
import { tasksService } from '../lib/services/tasks'
import type { Database } from '../lib/database.types'
import { TaskStatus } from '../types/task'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskHistory = Database['public']['Tables']['task_history']['Row']

export default function Tasks() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([])

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
      const updatedHistory = await tasksService.updateTaskStatus(selectedTask.id, status)
      
      setTaskHistory(prev => {
        const filtered = prev.filter(h => 
          h.date.split('T')[0] !== new Date().toISOString().split('T')[0]
        )
        return [updatedHistory, ...filtered]
      })
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  return (
    <div className="flex gap-8">
      <div className="w-1/3">
        <TaskList onTaskSelect={handleTaskSelect} selectedTaskId={selectedTask?.id} />
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
  )
}