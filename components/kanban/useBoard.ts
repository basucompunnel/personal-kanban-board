import { useState, useCallback } from "react";

export interface BoardData {
  id: string;
  title: string;
  owner: string;
  createdAt: string;
}

export interface ColumnData {
  id: string;
  boardId: string;
  title: string;
  position: number;
}

export interface TaskData {
  id: string;
  title: string;
  description?: string;
  boardId: string;
  columnId: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  position: number;
}

// Helper function to get auth headers with JWT token
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Failed to parse auth data:", error);
      }
    }
  }
  return headers;
}

export function useBoard() {
  const [boards, setBoards] = useState<BoardData[]>([]);
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all boards for current user
  const fetchBoards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/boards", { headers: getAuthHeaders(), credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch boards");
      const data = await res.json();
      setBoards(data.boards);
      return data.boards;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch columns for a board
  const fetchColumns = useCallback(async (boardId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/boards/${boardId}/columns`, { headers: getAuthHeaders(), credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch columns");
      const data = await res.json();
      setColumns(data.columns);
      return data.columns;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch tasks for all columns (or specific column)
  const fetchTasks = useCallback(async (columnIds: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const allTasks: TaskData[] = [];
      for (const columnId of columnIds) {
        const res = await fetch(`/api/columns/${columnId}/tasks`, { headers: getAuthHeaders(), credentials: "include" });
        if (!res.ok) throw new Error(`Failed to fetch tasks for column ${columnId}`);
        const data = await res.json();
        allTasks.push(...data.tasks);
      }
      setTasks(allTasks);
      return allTasks;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new board
  const createBoard = useCallback(async (title: string) => {
    setError(null);
    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create board");
      const board = await res.json();
      setBoards((prev) => [board, ...prev]);
      return board;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    }
  }, []);

  // Update a board
  const updateBoard = useCallback(async (boardId: string, title: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/boards/${boardId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update board");
      const updated = await res.json();
      setBoards((prev) =>
        prev.map((b) => (b.id === boardId ? updated : b))
      );
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    }
  }, []);

  // Delete a board
  const deleteBoard = useCallback(async (boardId: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/boards/${boardId}`, { method: "DELETE", headers: getAuthHeaders(), credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete board");
      setBoards((prev) => prev.filter((b) => b.id !== boardId));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(
    async (columnId: string, task: Omit<TaskData, "id" | "boardId" | "columnId" | "position">) => {
      setError(null);
      try {
        const res = await fetch(`/api/columns/${columnId}/tasks`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(task),
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to create task");
        const newTask = await res.json();
        setTasks((prev) => [...prev, newTask]);
        return newTask;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      }
    },
    []
  );

  // Update a task
  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Omit<TaskData, "id" | "boardId" | "columnId" | "position">>) => {
      setError(null);
      try {
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(updates),
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to update task");
        const updated = await res.json();
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? updated : t))
        );
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      }
    },
    []
  );

  // Delete a task
  const deleteTask = useCallback(async (taskId: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE", headers: getAuthHeaders(), credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    }
  }, []);

  // Move a task to a different column or position
  const moveTask = useCallback(
    async (taskId: string, targetColumnId: string, targetPosition: number) => {
      setError(null);
      try {
        const res = await fetch(`/api/tasks/${taskId}/move`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ targetColumnId, targetPosition }),
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to move task");
        const updated = await res.json();
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? updated : t))
        );
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      }
    },
    []
  );

  return {
    boards,
    columns,
    tasks,
    isLoading,
    error,
    fetchBoards,
    fetchColumns,
    fetchTasks,
    createBoard,
    updateBoard,
    deleteBoard,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
  };
}
