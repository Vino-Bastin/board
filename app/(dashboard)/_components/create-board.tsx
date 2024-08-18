"use client";

import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useCreateBoard } from "@/hooks/api/use-create-board";
import { Button } from "@/components/ui/button";

export function CreateBoard() {
  const router = useRouter();
  const { organization } = useOrganization();
  const { isPending, createBoard } = useCreateBoard();

  const handleClick = () => {
    if (!organization) return;
    createBoard(organization.id, `untitled`)
      .then((boardId) => {
        toast.success("Board created");
        router.push(`/board/${boardId}`);
      })
      .catch(() => toast.error("Failed to create board"));
  };

  return (
    <Button
      disabled={isPending}
      className="mt-2"
      size="lg"
      onClick={handleClick}
    >
      Create Board
    </Button>
  );
}
