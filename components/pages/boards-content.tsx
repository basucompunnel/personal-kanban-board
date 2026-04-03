"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { useBoard, BoardData, TaskData } from "@/components/kanban/useBoard";
import { BoardGrid } from "@/components/kanban/BoardGrid";
import { ManageBoardsDialog } from "@/components/kanban/ManageBoardsDialog";
import { TaskDialog } from "@/components/kanban/TaskDialog";
import { Settings, Loader2, Plus } from "lucide-react";

export function BoardsContent() {
  const {
    boards,
    columns,
    tasks,
    isLoading,
    fetchBoards,
    fetchColumns,
    fetchTasks,
    createBoard: createBoardMutation,
    createTask: createTaskMutation,
    updateTask: updateTaskMutation,
    deleteTask: deleteTaskMutation,
    deleteBoard: deleteBoardMutation,
    moveTask: moveTaskMutation,
  } = useBoard();

  const [selectedBoard, setSelectedBoard] = useState<BoardData | null>(null);
  const [showManageBoardsDialog, setShowManageBoardsDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);
  const [currentTaskColumnId, setCurrentTaskColumnId] = useState<string | null>(
    null,
  );

  // Load boards on mount
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // Load columns and tasks when board is selected
  useEffect(() => {
    if (selectedBoard) {
      fetchColumns(selectedBoard.id);
    }
  }, [selectedBoard, fetchColumns]);

  // Load tasks when columns change
  useEffect(() => {
    if (columns.length > 0) {
      fetchTasks(columns.map((c) => c.id));
    }
  }, [columns, fetchTasks]);

  const handleCreateBoard = async (title: string) => {
    const newBoard = await createBoardMutation(title);
    if (newBoard) {
      setSelectedBoard(newBoard);
      await fetchBoards();
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    await deleteBoardMutation(boardId);
    if (selectedBoard?.id === boardId) {
      setSelectedBoard(null);
    }
    await fetchBoards();
  };

  const handleAddTask = (columnId: string) => {
    setCurrentTaskColumnId(columnId);
    setEditingTask(null);
    setShowTaskDialog(true);
  };

  const handleEditTask = (task: TaskData) => {
    setEditingTask(task);
    setCurrentTaskColumnId(task.columnId);
    setShowTaskDialog(true);
  };

  const handleSaveTask = async (taskData: Partial<TaskData>) => {
    if (editingTask) {
      await updateTaskMutation(editingTask.id, taskData);
    }
  };

  const handleCreateTask = async (
    taskData: Omit<TaskData, "id" | "boardId" | "columnId" | "position">,
  ) => {
    if (currentTaskColumnId) {
      await createTaskMutation(currentTaskColumnId, taskData);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskMutation(taskId);
  };

  const handleDeleteColumn = async (columnId: string) => {
    const res = await fetch(`/api/columns/${columnId}`, { method: "DELETE" });
    if (res.ok && selectedBoard) {
      fetchColumns(selectedBoard.id);
    }
  };

  const handleMoveTask = async (
    taskId: string,
    targetColumnId: string,
    targetPosition: number,
  ) => {
    // Find the task to check if move is necessary
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Skip API call if task is dropped in the same column at the same position
    if (task.columnId === targetColumnId && task.position === targetPosition) {
      return;
    }

    await moveTaskMutation(taskId, targetColumnId, targetPosition);
  };

  const pluralize = (count: number, singular: string) => {
    if (count === 1) {
      return singular;
    }
    return `${singular}s`;
  };

  const headerSubtitle = selectedBoard
    ? `${columns.length} ${pluralize(columns.length, "column")} • ${tasks.length} ${pluralize(tasks.length, "task")}`
    : "Manage your tasks efficiently";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {selectedBoard ? selectedBoard.title : "Kanban Board"}
            </h1>
            <p className="text-sm text-muted-foreground">{headerSubtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button
              onClick={() => selectedBoard && handleAddTask(columns[0]?.id || "")}
              variant="outline"
              size="sm"
              className="gap-2 rounded-xs"
              disabled={!selectedBoard || columns.length === 0}
              title="Add task to first column"
            >
              <Plus className="w-4 h-4" />
            </Button> */}
            <Button
              onClick={() =>
                selectedBoard && handleAddTask(columns[0]?.id || "")
              }
              variant="outline"
              // size="sm"
              className="gap-2 rounded-xs"
              disabled={!selectedBoard || columns.length === 0}
            >
              <Plus className="w-4 h-4" />
              Create Task
            </Button>
            <Button
              onClick={() => setShowManageBoardsDialog(true)}
              variant="outline"
              // size="sm"
              className="gap-2 rounded-xs"
            >
              <Settings className="w-4 h-4" />
              Manage Boards
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-2 mt-12">
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            <p className="text-muted-foreground">Loading boards...</p>
          </div>
        )}

        {!isLoading && boards.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 mt-12">
            <p className="text-muted-foreground">No boards yet</p>
            <Button onClick={() => setShowManageBoardsDialog(true)}>
              Create Your First Board
            </Button>
          </div>
        )}

        {!isLoading && !selectedBoard && boards.length > 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 mt-12">
            <p className="text-muted-foreground">
              Select board from Manage Board
            </p>
          </div>
        )}

        {!isLoading && selectedBoard && columns.length > 0 && (
          <div className="px-6 py-6 h-full overflow-auto">
            <div className="max-w-5xl mx-auto h-full">
              <BoardGrid
                columns={columns}
                tasks={tasks}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onDeleteColumn={handleDeleteColumn}
                onMoveTask={handleMoveTask}
              />
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ManageBoardsDialog
        open={showManageBoardsDialog}
        onOpenChange={setShowManageBoardsDialog}
        boards={boards}
        selectedBoardId={selectedBoard?.id}
        onCreateBoard={handleCreateBoard}
        onSelectBoard={setSelectedBoard}
        onDeleteBoard={handleDeleteBoard}
        isLoading={isLoading}
      />

      <TaskDialog
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        task={editingTask}
        onSave={handleSaveTask}
        onCreate={handleCreateTask}
        isLoading={isLoading}
      />
    </div>
  );
}
