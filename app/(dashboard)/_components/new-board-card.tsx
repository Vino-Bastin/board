"use client";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useCreateBoard } from "@/hooks/api/use-create-board";
import { cn } from "@/lib/utils";

interface NewBoardCardProps {
  organizationId: string;
  disabled?: boolean;
}

export function NewBoardCard({ organizationId, disabled }: NewBoardCardProps) {
  const { isPending, createBoard } = useCreateBoard();
  const router = useRouter();

  const handleClick = () => {
    createBoard(organizationId, `untitled`)
      .then((boardId) => {
        toast.success("Board created");
        router.push(`/board/${boardId}`);
      })
      .catch(() => toast.error("Failed to create board"));
  };

  return (
    <button
      disabled={disabled || isPending}
      onClick={handleClick}
      className={cn(
        "col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6",
        (disabled || isPending) && "cursor-not-allowed opacity-75"
      )}
    >
      {isPending ? (
        <Loader2 className="animate-spin stroke-1 text-white h-12 w-12" />
      ) : (
        <>
          <Plus className="h-12 w-12 stroke-1 text-white" />
          <p className="text-sm text-white font-light">New Board</p>
        </>
      )}
    </button>
  );
}
