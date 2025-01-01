import { Trash2, CheckCircle } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ task, onComplete, onDelete }: TaskItemProps) => {
  const priorityColors = {
    high: "border-l-taskPriority-high",
    medium: "border-l-taskPriority-medium",
    low: "border-l-taskPriority-low",
  };

  return (
    <div
      className={cn(
        "group flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border-l-4 transition-all hover:shadow-md",
        priorityColors[task.priority],
        task.completed && "opacity-50"
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => onComplete(task.id)}
          className={cn(
            "text-gray-400 hover:text-primary transition-colors",
            task.completed && "text-primary"
          )}
        >
          <CheckCircle className="h-5 w-5" />
        </button>
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              "text-sm font-medium",
              task.completed && "line-through"
            )}
          >
            {task.title}
          </span>
          <CategoryBadge category={task.category} />
        </div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};