"use client";

import { Column } from "./Column";
import { ColumnData, TaskData } from "./useBoard";
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

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    // Find the task being dragged
    const draggedTask = tasks.find((t) => t.id === active.id);
    if (!draggedTask) return;

    const targetColumnId = over.id as string;
    const columnTasks = getTasksByColumn(targetColumnId);

    // Calculate target position
    let targetPosition = columnTasks.length;
    if (over.data?.current?.type === "Task") {
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) {
        const overIndex = columnTasks.findIndex((t) => t.id === over.id);
        targetPosition = overIndex >= 0 ? overIndex : columnTasks.length;
      }
    }

    // Only move if the target is different or position is different
    if (
      draggedTask.columnId !== targetColumnId ||
      draggedTask.position !== targetPosition
    ) {
      await onMoveTask(draggedTask.id, targetColumnId, targetPosition);
    }
  };

  const activeDraggedTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={(event: DragStartEvent) => setActiveId(event.active.id as string)}
    >
      <div className="flex gap-1 overflow-x-auto pb-4">
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
          <div className="bg-white border rounded-lg p-3 shadow-xl opacity-80">
            <p className="font-medium text-sm max-w-xs">{activeDraggedTask.title}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
