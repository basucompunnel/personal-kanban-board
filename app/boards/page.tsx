"use client";

import { ProtectedRoute } from "@/components/common/protected-route";
import { BoardsContent } from "@/components/pages/boards-content";

export default function BoardsPage() {
  return (
    <ProtectedRoute>
      <BoardsContent />
    </ProtectedRoute>
  );
}
