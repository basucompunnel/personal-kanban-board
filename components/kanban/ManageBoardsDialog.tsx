"use client";

import { useState } from "react";
import { BoardData } from "./useBoard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";

interface ManageBoardsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boards: BoardData[];
  selectedBoardId?: string;
  onCreateBoard: (title: string) => Promise<void>;
  onSelectBoard: (board: BoardData) => void;
  onDeleteBoard: (boardId: string) => Promise<void>;
  isLoading: boolean;
}

export function ManageBoardsDialog({
  open,
  onOpenChange,
  boards,
  selectedBoardId,
  onCreateBoard,
  onSelectBoard,
  onDeleteBoard,
  isLoading,
}: Readonly<ManageBoardsDialogProps>) {
  const [boardTitle, setBoardTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateBoard = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!boardTitle.trim()) return;

    setIsCreating(true);
    try {
      await onCreateBoard(boardTitle);
      setBoardTitle("");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (!confirm("Are you sure you want to delete this board?")) return;

    setDeletingId(boardId);
    try {
      await onDeleteBoard(boardId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-sm">
        <DialogHeader>
          <DialogTitle>Manage Boards</DialogTitle>
          <DialogDescription>Create a new board or delete existing ones</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create Board Form */}
          <form onSubmit={handleCreateBoard} className="space-y-3 pb-4 border-b">
            <div>
              <Input
              className="rounded-xs"
                placeholder="Enter board name"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                disabled={isCreating}
              />
            </div>
            <Button
              type="submit"
              disabled={isCreating || !boardTitle.trim() || isLoading}
              className="w-full gap-2 rounded-sm"
            >
              <Plus className="w-4 h-4" />
              {isCreating ? "Creating..." : "Create New Board"}
            </Button>
          </form>

          {/* Boards List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {boards.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No boards yet
              </p>
            ) : (
              boards.map((board) => (
                <button
                  key={board.id}
                  type="button"
                  className={`flex w-full items-center justify-between p-3 rounded-xs border cursor-pointer transition-colors ${
                    selectedBoardId === board.id
                      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                      : "bg-card hover:bg-accent border-border"
                  }`}
                  onClick={() => {
                    onSelectBoard(board);
                    onOpenChange(false);
                  }}
                >
                  <span className="text-sm font-medium">{board.title}</span>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBoard(board.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        handleDeleteBoard(board.id);
                      }
                    }}
                    className={`text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer ${
                      deletingId === board.id || isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title="Delete board"
                  >
                    <Trash2 className="w-4 h-4" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
