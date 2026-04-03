import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthTokenFromHeader, verifyToken } from "@/lib/auth";
import { Board } from "@/lib/models/board";
import { Column } from "@/lib/models/column";
import { Task } from "@/lib/models/task";
import mongoose from "mongoose";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    const { id: columnId } = await context.params;
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
    const { title, position } = body;

    if (title && typeof title === "string") {
      column.title = title.trim();
    }

    if (typeof position === "number") {
      column.position = position;
    }

    await column.save();

    return NextResponse.json({
      id: column._id,
      boardId: column.boardId,
      title: column.title,
      position: column.position,
    });
  } catch (error) {
    console.error("Update column error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
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

    const { id: columnId } = await context.params;
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

    // Delete all tasks in this column
    await Task.deleteMany({ columnId });
    await column.deleteOne();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete column error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
