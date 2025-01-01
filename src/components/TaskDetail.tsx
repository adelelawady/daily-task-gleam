import React from 'react';
import { Task, TaskHistory, TaskStatus } from '../types/task';

interface TaskDetailProps {
  task: Task;
  history: TaskHistory[];
  onStatusUpdate: (status: TaskStatus) => void;
}

const STATUS_OPTIONS: TaskStatus[] = ['Success', 'High', 'Medium', 'Low', 'Failed'];

const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case 'Success': return 'bg-green-100 text-green-800';
    case 'High': return 'bg-yellow-100 text-yellow-800';
    case 'Medium': return 'bg-blue-100 text-blue-800';
    case 'Low': return 'bg-gray-100 text-gray-800';
    case 'Failed': return 'bg-red-100 text-red-800';
  }
};

export default function TaskDetail({ task, history, onStatusUpdate }: TaskDetailProps) {
  const taskHistory = history.filter(h => h.taskId === task.id);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
        {task.description && (
          <p className="text-gray-600">{task.description}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Today's Status</h3>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => onStatusUpdate(status)}
              className={`px-4 py-2 rounded-full ${getStatusColor(status)} hover:opacity-90`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">History</h3>
        <div className="space-y-2">
          {taskHistory.length === 0 ? (
            <p className="text-gray-500">No history available</p>
          ) : (
            taskHistory
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(entry.status)}`}>
                    {entry.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}