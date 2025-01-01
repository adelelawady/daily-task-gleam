export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          created_at?: string
        }
      }
      task_history: {
        Row: {
          id: string
          task_id: string
          user_id: string
          status: 'Success' | 'High' | 'Medium' | 'Low' | 'Failed'
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          status: 'Success' | 'High' | 'Medium' | 'Low' | 'Failed'
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          status?: 'Success' | 'High' | 'Medium' | 'Low' | 'Failed'
          date?: string
          created_at?: string
        }
      }
    }
  }
} 