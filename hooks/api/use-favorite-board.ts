"use client";

import { useMutation } from "convex/react";
import { useState } from "react";

import { api } from "@/convex/_generated/api";

export function useFavoriteBoard() {
  const [isPending, setIsPending] = useState(false);
  const mutation = useMutation(api.board.favorite);

  const favorite = async (boardId: any) => {
    setIsPending(true);
    return mutation({ id: boardId })
      .catch((error) => {
        throw error;
      })
      .finally(() => setIsPending(false));
  };

  return { favorite, isPending };
}
