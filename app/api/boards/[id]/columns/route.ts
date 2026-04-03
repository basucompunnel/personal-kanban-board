import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { Board } from "@/lib/models/board";
import { Column } from "@/lib/models/column";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: boardId } = await params;
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return NextResponse.json({ error: "Invalid board ID" }, { status: 400 });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    if (board.owner.toString() !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const columns = await Column.find({ boardId }).sort({ position: 1 });

    return NextResponse.json({
      columns: columns.map((col) => ({
        id: col._id,
        boardId: col.boardId,
        title: col.title,
        position: col.position,
      })),
    });
  } catch (error) {
    console.error("Fetch columns error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: boardId } = await params;
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return NextResponse.json({ error: "Invalid board ID" }, { status: 400 });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    if (board.owner.toString() !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const maxPosition = await Column.findOne({ boardId }).sort({ position: -1 });
    const position = maxPosition ? maxPosition.position + 1 : 0;

    const column = new Column({
      boardId: new mongoose.Types.ObjectId(boardId),
      title: title.trim(),
      position,
    });

    await column.save();

    return NextResponse.json(
      {
        id: column._id,
        boardId: column.boardId,
        title: column.title,
        position: column.position,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create column error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
