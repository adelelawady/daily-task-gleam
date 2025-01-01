import { supabase } from '../lib/supabase';
import { TaskStatus } from '../types/task';

export const fetchTaskHistory = async (taskId?: string) => {
  let query = supabase
    .from('task_history')
    .select('*')
    .order('date', { ascending: false });

  if (taskId) {
    query = query.eq('task_id', taskId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
  const today = new Date().toISOString().split('T')[0];

  // First try to update existing status for today
  const { data: existing } = await supabase
    .from('task_history')
    .select()
    .eq('task_id', taskId)
    .eq('date', today)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('task_history')
      .update({ status })
      .eq('id', existing.id);
    
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('task_history')
      .insert([{ task_id: taskId, status, date: today }]);
    
    if (error) throw error;
  }
};