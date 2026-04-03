"use client";

import { TaskData } from "./useBoard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface TaskCardProps {
  task: TaskData;
  onEdit: (task: TaskData) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  isDragging,
}: Readonly<TaskCardProps>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 cursor-grab active:cursor-grabbing transition-opacity ${
        isSortableDragging ? "opacity-50" : "opacity-100"
      } hover:shadow-md`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm flex-1 wrap-break-word">{task.title}</h3>
          <button
            onClick={() => onDelete(task.id)}
            className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2 flex-wrap">
            <Badge className={`text-xs ${priorityColors[task.priority]}`}>
              {task.priority}
            </Badge>
            {formattedDate && (
              <Badge variant="outline" className="text-xs">
                {formattedDate}
              </Badge>
            )}
          </div>
          <button
            onClick={() => onEdit(task)}
            className="text-muted-foreground hover:text-primary transition-colors p-1"
            title="Edit task"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
