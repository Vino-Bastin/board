"use client";

import { useMutation } from "convex/react";
import { useState } from "react";

import { api } from "@/convex/_generated/api";

export function useCreateBoard() {
  const [isPending, setIsPending] = useState(false);
  const mutation = useMutation(api.board.create);

  const createBoard = (organizationId: string, title: string) => {
    setIsPending(true);
    return mutation({
      organizationId,
      title,
    })
      .then((board) => board)
      .catch((error) => {
        throw error;
      })
      .finally(() => setIsPending(false));
  };

  return {
    isPending,
    createBoard,
  };
}
