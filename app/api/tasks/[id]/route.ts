import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthTokenFromHeader, verifyToken } from "@/lib/auth";
import { Board } from "@/lib/models/board";
import { Task, TaskPriority, ITask } from "@/lib/models/task";
import mongoose from "mongoose";

function updateTaskFields(task: ITask, updates: Record<string, any>) {
  const { title, description, priority, dueDate } = updates;

  if (title && typeof title === "string") {
    task.title = title.trim();
  }

  if (description !== undefined) {
    task.description = description ? String(description).trim() : undefined;
  }

  if (priority && ["low", "medium", "high"].includes(priority)) {
    task.priority = priority as TaskPriority;
  }

  if (dueDate !== undefined) {
    task.dueDate = dueDate ? new Date(dueDate) : undefined;
  }
}

function formatTaskResponse(task: ITask) {
  return {
    id: task._id,
    title: task.title,
    description: task.description,
    boardId: task.boardId,
    columnId: task.columnId,
    priority: task.priority,
    dueDate: task.dueDate,
    position: task.position,
  };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const token = getAuthTokenFromHeader(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Verify board ownership
    const board = await Board.findById(task.boardId);
    if (!board || board.owner.toString() !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    updateTaskFields(task, body);
    await task.save();

    return NextResponse.json(formatTaskResponse(task));
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const token = getAuthTokenFromHeader(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Verify board ownership
    const board = await Board.findById(task.boardId);
    if (!board || board.owner.toString() !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await task.deleteOne();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
