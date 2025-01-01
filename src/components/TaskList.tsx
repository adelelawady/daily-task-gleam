import React from 'react';
import { Task, TaskStatus } from '../types/task';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import TaskActions from './TaskActions';

interface TaskListProps {
  tasks: Task[];
  dailyStatuses: Record<string, TaskStatus | null>;
  onTaskSelect: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const getStatusIcon = (status: TaskStatus | null) => {
  switch (status) {
    case 'Success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'Failed':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'High':
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case 'Medium':
      return <AlertCircle className="w-5 h-5 text-blue-500" />;
    case 'Low':
      return <AlertCircle className="w-5 h-5 text-gray-500" />;
    default:
      return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
  }
};

export default function TaskList({ tasks, dailyStatuses, onTaskSelect, onEditTask, onDeleteTask }: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div
            onClick={() => onTaskSelect(task)}
            className="flex-1 flex items-center gap-3 cursor-pointer"
          >
            {getStatusIcon(dailyStatuses[task.id])}
            <div>
              <h3 className="font-medium">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-600">{task.description}</p>
              )}
            </div>
          </div>
          <TaskActions
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        </div>
      ))}
    </div>
  );
}