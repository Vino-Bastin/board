"use client";

import { useMutation } from "convex/react";
import { useState } from "react";

import { api } from "@/convex/_generated/api";

export function useRenameBoard() {
  const [isPending, setIsPending] = useState(false);
  const mutation = useMutation(api.board.update);

  const rename = (id: any, title: string) => {
    setIsPending(true);
    return mutation({
      id,
      title,
    })
      .catch((error) => {
        throw error;
      })
      .finally(() => setIsPending(false));
  };

  return { isPending, rename };
}
