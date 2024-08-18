"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { useRenameBoard } from "@/hooks/api/use-rename-board";
import { useBoardRenameModal } from "@/store/use-board-rename-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const RenameBoardModal = () => {
  const { isOpen, initialValues, close } = useBoardRenameModal();
  const [title, setTitle] = useState(initialValues.title);
  const { isPending, rename } = useRenameBoard();

  useEffect(() => {
    setTitle(initialValues.title);
  }, [initialValues.title]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    rename(initialValues.id, title)
      .then(() => {
        toast.success("Board title updated");
        close();
      })
      .catch(() => toast.error("Failed to update board title"));
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Edit board title </DialogTitle>
          <DialogDescription>Change the title of your board</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Board title"
            autoFocus
            disabled={isPending}
            required
            maxLength={60}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={close}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
