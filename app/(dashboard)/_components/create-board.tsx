"use client";

import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";

import { useCreateBoard } from "@/hooks/api/use-create-board";
import { Button } from "@/components/ui/button";

export function CreateBoard() {
  const { organization } = useOrganization();
  const { isPending, createBoard } = useCreateBoard();

  const handleClick = () => {
    if (!organization) return;
    createBoard(organization.id, `untitled`)
      .then((board) => {
        toast.success("Board created");
      })
      .catch((error) => toast.error("Failed to create board"));
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
