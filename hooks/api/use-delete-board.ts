"use client";

import { useMutation } from "convex/react";
import { useState } from "react";

import { api } from "@/convex/_generated/api";

export function useDeleteBoard() {
  const [isPending, setIsPending] = useState(false);
  const mutation = useMutation(api.board.remove);

  const remove = async (id: any) => {
    setIsPending(true);
    return mutation({ id })
      .catch((error) => {
        throw error;
      })
      .finally(() => setIsPending(false));
  };

  return { isPending, remove };
}
