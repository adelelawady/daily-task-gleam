export type TaskStatus = 'Success' | 'High' | 'Medium' | 'Low' | 'Failed';

export interface Task {
  id: string;
  title: string;
  description?: string;
}

export interface TaskHistory {
  id: string;
  taskId: string;
  status: TaskStatus;
  date: string; // ISO string
}

export interface DailyTaskStatus {
  taskId: string;
  status: TaskStatus | null;
}