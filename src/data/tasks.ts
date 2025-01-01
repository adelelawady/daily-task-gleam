import { Task, TaskHistory, TaskStatus } from '../types/task';

// Initial tasks data
export const initialTasks: Task[] = [
  { id: '1', title: 'Morning Exercise', description: '30 minutes workout' },
  { id: '2', title: 'Read Book', description: 'Read for 20 minutes' },
  { id: '3', title: 'Meditation', description: '10 minutes mindfulness' },
];

// Get tasks from localStorage or use initial data
export const getTasks = (): Task[] => {
  const stored = localStorage.getItem('tasks');
  return stored ? JSON.parse(stored) : initialTasks;
};

// Save tasks to localStorage
export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Add new task
export const addTask = (title: string, description: string): Task[] => {
  const tasks = getTasks();
  const newTask = {
    id: crypto.randomUUID(),
    title,
    description
  };
  const updatedTasks = [...tasks, newTask];
  saveTasks(updatedTasks);
  return updatedTasks;
};

// Update task
export const updateTask = (taskId: string, title: string, description: string): Task[] => {
  const tasks = getTasks();
  const updatedTasks = tasks.map(task =>
    task.id === taskId ? { ...task, title, description } : task
  );
  saveTasks(updatedTasks);
  return updatedTasks;
};

// Delete task
export const deleteTask = (taskId: string): Task[] => {
  const tasks = getTasks();
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  saveTasks(updatedTasks);
  
  // Clean up related data
  const history = getTaskHistory();
  const updatedHistory = history.filter(h => h.taskId !== taskId);
  saveTaskHistory(updatedHistory);
  
  const today = new Date().toISOString().split('T')[0];
  const dailyStatuses = JSON.parse(localStorage.getItem(`dailyStatus_${today}`) || '{}');
  delete dailyStatuses[taskId];
  localStorage.setItem(`dailyStatus_${today}`, JSON.stringify(dailyStatuses));
  
  return updatedTasks;
};

// Get task history from localStorage
export const getTaskHistory = (): TaskHistory[] => {
  const stored = localStorage.getItem('taskHistory');
  return stored ? JSON.parse(stored) : [];
};

// Save task history to localStorage
export const saveTaskHistory = (history: TaskHistory[]) => {
  localStorage.setItem('taskHistory', JSON.stringify(history));
};

// Get today's task statuses
export const getDailyStatuses = (): Record<string, TaskStatus | null> => {
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem(`dailyStatus_${today}`);
  return stored ? JSON.parse(stored) : {};
};

// Save today's task status
export const saveDailyStatus = (taskId: string, status: TaskStatus) => {
  const today = new Date().toISOString().split('T')[0];
  const currentStatuses = getDailyStatuses();
  
  // Update daily status
  const newStatuses = { ...currentStatuses, [taskId]: status };
  localStorage.setItem(`dailyStatus_${today}`, JSON.stringify(newStatuses));
  
  // Update history - remove any existing entry for today and add new one
  const history = getTaskHistory();
  const updatedHistory = history.filter(h => 
    !(h.taskId === taskId && h.date.startsWith(today))
  );
  
  updatedHistory.push({
    id: crypto.randomUUID(),
    taskId,
    status,
    date: new Date().toISOString(),
  });
  
  saveTaskHistory(updatedHistory);
};