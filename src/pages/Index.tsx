import { useState } from "react";
import { AddTask } from "@/components/AddTask";
import { TaskList } from "@/components/TaskList";
import { Task } from "@/components/TaskItem";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const handleAddTask = (newTask: {
    title: string;
    category: string;
    priority: "high" | "medium" | "low";
  }) => {
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      ...newTask,
      completed: false,
    };
    setTasks((prev) => [task, ...prev]);
    toast({
      title: "Task added",
      description: "Your new task has been added successfully.",
    });
  };

  const handleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been removed.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Daily Tasks</h1>
          <p className="text-gray-600">
            Keep track of your tasks and stay organized
          </p>
        </div>
        <AddTask onAdd={handleAddTask} />
        <TaskList
          tasks={tasks}
          onComplete={handleComplete}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Index;