import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthTokenFromHeader, verifyToken } from "@/lib/auth";
import { Board } from "@/lib/models/board";
import { Task } from "@/lib/models/task";
import mongoose from "mongoose";

export async function PATCH(
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

    const { id } = await params;
    const taskId = id;
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
    const { targetColumnId, targetPosition } = body;

    if (!mongoose.Types.ObjectId.isValid(targetColumnId)) {
      return NextResponse.json({ error: "Invalid target column ID" }, { status: 400 });
    }

    if (typeof targetPosition !== "number" || targetPosition < 0) {
      return NextResponse.json({ error: "Invalid target position" }, { status: 400 });
    }

    const sourceColumnId = task.columnId;
    const sourcePosition = task.position;

    // If moving within the same column
    if (sourceColumnId.toString() === targetColumnId) {
      if (sourcePosition < targetPosition) {
        // Moving down, shift tasks above target up
        await Task.updateMany(
          {
            columnId: sourceColumnId,
            position: { $gt: sourcePosition, $lte: targetPosition },
          },
          { $inc: { position: -1 } }
        );
      } else if (sourcePosition > targetPosition) {
        // Moving up, shift tasks below target down
        await Task.updateMany(
          {
            columnId: sourceColumnId,
            position: { $gte: targetPosition, $lt: sourcePosition },
          },
          { $inc: { position: 1 } }
        );
      }
    } else {
      // Moving to a different column
      // Remove from source column - shift all tasks after this one up
      await Task.updateMany(
        {
          columnId: sourceColumnId,
          position: { $gt: sourcePosition },
        },
        { $inc: { position: -1 } }
      );

      // Shift tasks in target column at or after target position down
      await Task.updateMany(
        {
          columnId: targetColumnId,
          position: { $gte: targetPosition },
        },
        { $inc: { position: 1 } }
      );
    }

    // Update the task
    task.columnId = new mongoose.Types.ObjectId(targetColumnId);
    task.position = targetPosition;
    await task.save();

    return NextResponse.json({
      id: task._id,
      title: task.title,
      description: task.description,
      boardId: task.boardId,
      columnId: task.columnId,
      priority: task.priority,
      dueDate: task.dueDate,
      position: task.position,
    });
  } catch (error) {
    console.error("Move task error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
