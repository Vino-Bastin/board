"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useDeleteBoard } from "@/hooks/api/use-delete-board";
import { useBoardRenameModal } from "@/store/use-board-rename-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "./confirm-modal";
import { Button } from "./ui/button";

interface ActionsProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}

export function Actions({
  children,
  side,
  sideOffset,
  id,
  title,
}: ActionsProps) {
  const { isPending, remove } = useDeleteBoard();
  const { open } = useBoardRenameModal();

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Failed to copy link to clipboard"));
  };

  const onDelete = () => {
    remove(id)
      .then(() => toast.success("Board deleted"))
      .catch(() => toast.error("Failed to delete board"));
  };

  const onRename = () => {
    open(id, title);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        sideOffset={sideOffset}
        onClick={(event) => event.stopPropagation()}
        className="w-60"
      >
        <DropdownMenuItem className="p-3 cursor-pointer" onClick={onCopyLink}>
          <Link2 className="mr-2 w-4 h-4" />
          Copy board link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-3 cursor-pointer" onClick={onRename}>
          <Pencil className="mr-2 w-4 h-4" />
          Rename board
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ConfirmModal
          header="Delete board?"
          description="This will delete the board and all of its contents."
          onConfirm={onDelete}
          disabled={isPending}
        >
          <Button
            variant="ghost"
            className="p-3 cursor-pointer w-full justify-start font-normal items-center"
          >
            <Trash2 className="mr-2 w-4 h-4" />
            Delete board
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
