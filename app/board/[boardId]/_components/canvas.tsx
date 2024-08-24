"use client";

import { Info } from "@/app/board/[boardId]/_components/info";
import { Participants } from "@/app/board/[boardId]/_components/participants";
import { Toolbar } from "@/app/board/[boardId]/_components/toolbar";
import { Board } from "./board";

interface CanvasProps {
  boardId: string;
}

export function Canvas({ boardId }: CanvasProps) {
  return (
    <main className="h-full w-full relative bg-neutral-50 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar />
      <Board />
    </main>
  );
}
