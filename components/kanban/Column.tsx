"use client";

import { ColumnData, TaskData } from "./useBoard";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";

interface ColumnProps {
  column: ColumnData;
  tasks: TaskData[];
  onAddTask: (columnId: string) => void;
  onEditTask: (task: TaskData) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

export function Column({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDeleteColumn,
}: Readonly<ColumnProps>) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div className="bg-muted rounded-sm p-3 w-80 flex flex-col gap-3 max-h-[calc(100vh-300px)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold text-sm">{column.title}</h2>
        <div className="flex items-center gap-1">
          <Badge variant="secondary">{tasks.length}</Badge>          
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto space-y-2 bg-background rounded p-2 min-h-50"
      >
        <SortableContext
          items={taskIds}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>
      </div>

      <Button
        onClick={() => onAddTask(column.id)}
        variant="outline"
        // size="sm"
        className="w-full gap-2 rounded-xs"
      >
        <Plus className="w-4 h-4" />
        Add Task
      </Button>
    </div>
  );
}
