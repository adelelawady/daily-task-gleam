import { supabase } from '../supabase'
import type { Database } from '../database.types'
import { TaskStatus } from '../types/task'

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
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateTask(id: string, updates: TaskUpdate) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
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
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('task_history')
      .select('*')
      .eq('task_id', taskId)
      .eq('date', today)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
    return data
  },

  async updateTaskStatus(taskId: string, status: TaskStatus) {
    const user = await supabase.auth.getUser()
    if (!user.data.user) throw new Error('Not authenticated')

    const today = new Date().toISOString().split('T')[0]

    try {
      // First try to update if exists
      const { data: updatedData, error: updateError } = await supabase
        .from('task_history')
        .update({ 
          status,
          created_at: new Date().toISOString()
        })
        .eq('task_id', taskId)
        .eq('date', today)
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
          date: today
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
  }
} 