import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthTokenFromHeader, verifyToken } from "@/lib/auth";
import { Board } from "@/lib/models/board";
import { Column } from "@/lib/models/column";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ error: "Board title is required" }, { status: 400 });
    }

    const board = await Board.create({
      title: title.trim(),
      owner: payload.userId,
    });

    // Create default columns for new board
    const defaultColumns = [
      { title: "To Do", position: 0 },
      { title: "In Progress", position: 1 },
      { title: "Done", position: 2 },
    ];

    await Column.insertMany(
      defaultColumns.map((col) => ({
        ...col,
        boardId: board._id,
      }))
    );

    return NextResponse.json(
      {
        id: board._id,
        title: board.title,
        owner: board.owner,
        createdAt: board.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create board error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
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

    const boards = await Board.find({ owner: payload.userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      boards: boards.map((board) => ({
        id: board._id,
        title: board.title,
        owner: board.owner,
        createdAt: board.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get boards error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
