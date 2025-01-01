import { TaskHistory, TaskStatus } from '../types/task';

export interface DailyStats {
  date: string;
  Success: number;
  High: number;
  Medium: number;
  Low: number;
  Failed: number;
}

export interface MonthlyStats {
  month: string;
  completionRate: number;
  totalTasks: number;
  successfulTasks: number;
}

export const calculateDailyStats = (history: TaskHistory[]): DailyStats[] => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  return last7Days.map(date => {
    const dayStats = history.filter(h => h.date.startsWith(date));
    return {
      date,
      Success: dayStats.filter(h => h.status === 'Success').length,
      High: dayStats.filter(h => h.status === 'High').length,
      Medium: dayStats.filter(h => h.status === 'Medium').length,
      Low: dayStats.filter(h => h.status === 'Low').length,
      Failed: dayStats.filter(h => h.status === 'Failed').length,
    };
  });
};

export const calculateMonthlyStats = (history: TaskHistory[]): MonthlyStats[] => {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toISOString().slice(0, 7);
  }).reverse();

  return last6Months.map(monthStr => {
    const monthHistory = history.filter(h => h.date.startsWith(monthStr));
    const totalTasks = monthHistory.length;
    const successfulTasks = monthHistory.filter(h => h.status === 'Success').length;

    return {
      month: new Date(monthStr).toLocaleString('default', { month: 'short' }),
      completionRate: totalTasks ? (successfulTasks / totalTasks) * 100 : 0,
      totalTasks,
      successfulTasks,
    };
  });
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('default', { 
    month: 'short', 
    day: 'numeric' 
  });
};