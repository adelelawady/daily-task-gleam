import { supabase } from '../lib/supabase';
import { Task, TaskStatus } from '../types/task';

export const fetchTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createTask = async (title: string, description?: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title, description }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateTask = async (id: string, title: string, description?: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ title, description })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteTask = async (id: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};