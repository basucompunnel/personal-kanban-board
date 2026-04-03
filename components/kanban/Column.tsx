"use client";

import { ColumnData, TaskData } from "./useBoard";
import { TaskCard } from "./TaskCard";
import { Badge } from "@/components/ui/badge";
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
    <div className="bg-muted rounded-sm p-3 flex-1 flex flex-col gap-3 min-w-0 h-full">
      <div className="flex items-center gap-2 h-10 min-w-0">
        <h2 className="font-semibold text-sm truncate">{column.title}</h2>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 space-y-2 bg-background rounded p-2 flex flex-col"
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

        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
