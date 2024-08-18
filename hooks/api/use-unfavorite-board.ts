"use client";

import { useMutation } from "convex/react";
import { useState } from "react";

import { api } from "@/convex/_generated/api";

export function useUnFavoriteBoard() {
  const [isPending, setIsPending] = useState(false);
  const mutation = useMutation(api.board.unFavorite);

  const unFavorite = async (boardId: any) => {
    setIsPending(true);
    return mutation({ id: boardId })
      .catch((error) => {
        throw error;
      })
      .finally(() => setIsPending(false));
  };

  return { unFavorite, isPending };
}
