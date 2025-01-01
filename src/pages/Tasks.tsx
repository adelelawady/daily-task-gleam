import React, { useState } from 'react';
import { Task, TaskStatus } from '../types/task';
import {
  getTasks,
  getDailyStatuses,
  saveDailyStatus,
  getTaskHistory,
  addTask,
  updateTask,
  deleteTask
} from '../data/tasks';
import TaskList from '../components/TaskList';
import TaskDetail from '../components/TaskDetail';
import AddTaskModal from '../components/AddTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import { Plus } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(getTasks());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dailyStatuses, setDailyStatuses] = useState<Record<string, TaskStatus | null>>(
    getDailyStatuses()
  );
  const [taskHistory, setTaskHistory] = useState(getTaskHistory());
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleStatusUpdate = (status: TaskStatus) => {
    if (!selectedTask) return;
    
    saveDailyStatus(selectedTask.id, status);
    setDailyStatuses(getDailyStatuses());
    setTaskHistory(getTaskHistory());
  };

  const handleAddTask = (title: string, description: string) => {
    const updatedTasks = addTask(title, description);
    setTasks(updatedTasks);
  };

  const handleUpdateTask = (taskId: string, title: string, description: string) => {
    const updatedTasks = updateTask(taskId, title, description);
    setTasks(updatedTasks);
    if (selectedTask?.id === taskId) {
      setSelectedTask(updatedTasks.find(t => t.id === taskId) || null);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = deleteTask(taskId);
    setTasks(updatedTasks);
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[calc(100vh-16rem)] overflow-y-auto">
          <TaskList
            tasks={tasks}
            dailyStatuses={dailyStatuses}
            onTaskSelect={setSelectedTask}
            onEditTask={setTaskToEdit}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        <div className="h-[calc(100vh-16rem)] overflow-y-auto bg-white p-6 rounded-lg shadow-sm">
          {selectedTask ? (
            <TaskDetail
              task={selectedTask}
              history={taskHistory}
              onStatusUpdate={handleStatusUpdate}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a task to view details
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddTask}
        />
      )}

      {taskToEdit && (
        <EditTaskModal
          task={taskToEdit}
          onClose={() => setTaskToEdit(null)}
          onUpdate={handleUpdateTask}
        />
      )}
    </div>
  );
}