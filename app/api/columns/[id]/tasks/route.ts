import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthTokenFromHeader, verifyToken } from "@/lib/auth";
import { Board } from "@/lib/models/board";
import { Column } from "@/lib/models/column";
import { Task } from "@/lib/models/task";
import mongoose from "mongoose";

export async function GET(
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

    const { id: columnId } = await params;
    if (!mongoose.Types.ObjectId.isValid(columnId)) {
      return NextResponse.json({ error: "Invalid column ID" }, { status: 400 });
    }

    const column = await Column.findById(columnId);
    if (!column) {
      return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    // Verify board ownership
    const board = await Board.findById(column.boardId);
    if (!board || board.owner.toString() !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const tasks = await Task.find({ columnId }).sort({ position: 1 });

    return NextResponse.json({
      tasks: tasks.map((task) => ({
        id: task._id,
        title: task.title,
        description: task.description,
        boardId: task.boardId,
        columnId: task.columnId,
        priority: task.priority,
        dueDate: task.dueDate,
        position: task.position,
      })),
    });
  } catch (error) {
    console.error("Fetch tasks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
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

    const { id: columnId } = await params;
    if (!mongoose.Types.ObjectId.isValid(columnId)) {
      return NextResponse.json({ error: "Invalid column ID" }, { status: 400 });
    }

    const column = await Column.findById(columnId);
    if (!column) {
      return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    // Verify board ownership
    const board = await Board.findById(column.boardId);
    if (!board || board.owner.toString() !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, priority, dueDate } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const validPriorities = ["low", "medium", "high"];
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json({ error: "Invalid priority" }, { status: 400 });
    }

    const maxPosition = await Task.findOne({ columnId }).sort({ position: -1 });
    const position = maxPosition ? maxPosition.position + 1 : 0;

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || "",
      boardId: column.boardId,
      columnId: new mongoose.Types.ObjectId(columnId),
      priority: priority || "low",
      dueDate: dueDate || null,
      position,
    });

    await task.save();

    return NextResponse.json(
      {
        id: task._id,
        title: task.title,
        description: task.description,
        boardId: task.boardId,
        columnId: task.columnId,
        priority: task.priority,
        dueDate: task.dueDate,
        position: task.position,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create task error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
