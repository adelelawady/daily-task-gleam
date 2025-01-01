import { supabase } from '../supabase'
import type { Database } from '../database.types'
import { TaskStatus } from '../types/task'
import { dateUtils } from '../utils/dateUtils'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']
type TaskUpdate = Database['public']['Tables']['tasks']['Update']

type TaskHistory = Database['public']['Tables']['task_history']['Row']
type TaskHistoryInsert = Database['public']['Tables']['task_history']['Insert']
type TaskHistoryUpdate = Database['public']['Tables']['task_history']['Update']

export const tasksService = {
  // Tasks CRUD
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getTask(id: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createTask(task: TaskInsert) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...task,
        user_id: user.data.user.id
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateTask(id: string, updates: TaskUpdate, date?: string) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Not authenticated')

    // Use provided date or default to today
    const targetDate = date || new Date().toISOString().split('T')[0]

    // Start a transaction using supabase
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (taskError) throw taskError

    try {
      // First check if there's already a history record for this date
      const { data: existingHistory, error: checkError } = await supabase
        .from('task_history')
        .select('*')
        .eq('task_id', id)
        .eq('date', targetDate)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      if (existingHistory) {
        // Update existing history record
        const { data: updatedHistory, error: updateError } = await supabase
          .from('task_history')
          .update({ 
            status: updates.status,
            created_at: new Date().toISOString()
          })
          .eq('id', existingHistory.id)
          .select()
          .single()

        if (updateError) throw updateError
        return { task, history: updatedHistory }
      } else {
        // Create new history record for this date
        const { data: newHistory, error: insertError } = await supabase
          .from('task_history')
          .insert({
            task_id: id,
            user_id: user.data.user.id,
            status: updates.status,
            date: targetDate,
            created_at: new Date().toISOString()
          })
          .select()
          .single()

        if (insertError) throw insertError
        return { task, history: newHistory }
      }
    } catch (error) {
      console.error('Error updating task history:', error)
      throw error
    }
  },

  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Task History CRUD
  async getTaskHistory(taskId: string) {
    const { data, error } = await supabase
      .from('task_history')
      .select('*')
      .eq('task_id', taskId)
      .order('date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createTaskHistory(history: TaskHistoryInsert) {
    const { data, error } = await supabase
      .from('task_history')
      .insert(history)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateTaskHistory(id: string, updates: TaskHistoryUpdate) {
    const { data, error } = await supabase
      .from('task_history')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteTaskHistory(id: string) {
    const { error } = await supabase
      .from('task_history')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async getAllTaskHistory() {
    const { data, error } = await supabase
      .from('task_history')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getTodayStatus(taskId: string) {
    const today = dateUtils.getTodayDate()
    
    const { data, error } = await supabase
      .from('task_history')
      .select('*')
      .eq('task_id', taskId)
      .eq('date', today)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
    return data
  },

  async updateTaskStatus(taskId: string, status: TaskStatus, date?: string) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Not authenticated')

    const targetDate = date || dateUtils.getTodayDate()

    try {
      // First try to update if exists
      const { data: updatedData, error: updateError } = await supabase
        .from('task_history')
        .update({ 
          status,
          created_at: new Date().toISOString()
        })
        .eq('task_id', taskId)
        .eq('date', targetDate)
        .select()
        .single()

      if (!updateError && updatedData) {
        return updatedData
      }

      // If no existing record, create new one
      const { data: insertedData, error: insertError } = await supabase
        .from('task_history')
        .insert({
          task_id: taskId,
          user_id: user.data.user.id,
          status,
          date: targetDate,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (insertError) throw insertError
      return insertedData
    } catch (error) {
      console.error('Error updating task status:', error)
      throw error
    }
  },

  async getTaskHistoryWithinDates(taskId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('task_history')
      .select('*')
      .eq('task_id', taskId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getAllTaskHistoryWithTasks() {
    const { data, error } = await supabase
      .from('task_history')
      .select(`
        *,
        task:tasks(*)
      `)
      .order('date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getTodayStatuses(date?: string) {
    const targetDate = date || dateUtils.getTodayDate()
    
    // Get all tasks first
    const tasks = await this.getTasks()
    
    // Get statuses for the target date
    const { data, error } = await supabase
      .from('task_history')
      .select('*')
      .eq('date', targetDate)
    
    if (error) throw error

    // Create a map of task_id to status
    const statusMap: Record<string, TaskStatus | null> = {}
    tasks.forEach(task => {
      const dateStatus = data?.find(h => h.task_id === task.id)
      statusMap[task.id] = dateStatus?.status || null
    })

    return statusMap
  },

  // Add a new method to reset task history for a new day
  async resetTaskHistory(taskId: string, date: string) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Not authenticated')

    try {
      // Create a new history record with default status
      const { data: newHistory, error: insertError } = await supabase
        .from('task_history')
        .insert({
          task_id: taskId,
          user_id: user.data.user.id,
          status: TaskStatus.PENDING, // Default status for new day
          date: date,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (insertError) throw insertError
      return newHistory
    } catch (error) {
      console.error('Error resetting task history:', error)
      throw error
    }
  }
} 