"use client";

import { Column } from "./Column";
import { ColumnData, TaskData } from "./useBoard";
import { Card } from "@/components/ui/card";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React, { useState, useCallback } from "react";

interface BoardGridProps {
  columns: ColumnData[];
  tasks: TaskData[];
  onAddTask: (columnId: string) => void;
  onEditTask: (task: TaskData) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onMoveTask: (taskId: string, targetColumnId: string, targetPosition: number) => Promise<void>;
}

export function BoardGrid({
  columns,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDeleteColumn,
  onMoveTask,
}: Readonly<BoardGridProps>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getTasksByColumn = useCallback(
    (columnId: string) => tasks.filter((t) => t.columnId === columnId),
    [tasks]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    // Find the task being dragged
    const draggedTask = tasks.find((t) => t.id === active.id);
    if (!draggedTask) return;

    let targetColumnId: string;
    let targetPosition: number;

    if (over.data?.current?.type === "Task") {
      // Dropping over a task - get the column from the task
      const overTask = tasks.find((t) => t.id === over.id);
      if (!overTask) return;

      targetColumnId = overTask.columnId;
      const columnTasks = getTasksByColumn(targetColumnId);
      const overIndex = columnTasks.findIndex((t) => t.id === over.id);
      targetPosition = overIndex >= 0 ? overIndex : columnTasks.length;
    } else {
      // Dropping over a column
      targetColumnId = over.id as string;
      const columnTasks = getTasksByColumn(targetColumnId);
      targetPosition = columnTasks.length;
    }

    // Only move if the target is different or position is different
    if (
      draggedTask.columnId !== targetColumnId ||
      draggedTask.position !== targetPosition
    ) {
      // Non-blocking: fire API call in background without awaiting
      onMoveTask(draggedTask.id, targetColumnId, targetPosition);
    }
  };

  const activeDraggedTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={(event: DragStartEvent) => setActiveId(event.active.id as string)}
    >
      <div className="flex gap-2 h-full overflow-auto">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={getTasksByColumn(column.id)}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onDeleteColumn={onDeleteColumn}
          />
        ))}
      </div>

      <DragOverlay>
        {activeDraggedTask && (
          <Card className="p-3 shadow-xl opacity-90 max-w-xs rounded-sm">
            <p className="font-medium text-sm">{activeDraggedTask.title}</p>
          </Card>
        )}
      </DragOverlay>
    </DndContext>
  );
}
