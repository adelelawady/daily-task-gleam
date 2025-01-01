import { useEffect, useState } from 'react'
import TaskList from './TaskList'
import TaskDetail from './TaskDetail'
import { tasksService } from '@/lib/services/tasks'
import type { Task, TaskStatus } from '@/types/task'

export default function Tasks() {
  const [todayStatuses, setTodayStatuses] = useState<Record<string, TaskStatus | null>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    const fetchTodayStatuses = async () => {
      try {
        const tasks = await tasksService.getTasks()
        const statusPromises = tasks.map(task => tasksService.getTodayStatus(task.id))
        const statuses = await Promise.all(statusPromises)
        
        const statusMap = tasks.reduce((acc, task, index) => ({
          ...acc,
          [task.id]: statuses[index]?.status || null
        }), {} as Record<string, TaskStatus | null>)
        
        setTodayStatuses(statusMap)
      } catch (error) {
        console.error('Error fetching today statuses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodayStatuses()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <TaskList 
            todayStatuses={todayStatuses} 
            onTaskSelect={setSelectedTask}
            selectedTaskId={selectedTask?.id}
          />
        </div>
        {selectedTask && (
          <div>
            <TaskDetail 
              task={selectedTask} 
              onClose={() => setSelectedTask(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
} 