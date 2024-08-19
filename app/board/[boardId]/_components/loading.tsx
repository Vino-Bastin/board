import { Loader } from "lucide-react";

import { Info } from "@/app/board/[boardId]/_components/info";
import { Participants } from "@/app/board/[boardId]/_components/participants";
import { Toolbar } from "@/app/board/[boardId]/_components/toolbar";

export function Loading() {
  return (
    <main className="relative w-full h-full flex items-center justify-center">
      <Loader className="animate-spin h-6 w-6 text-muted-foreground" />
      <Info.Skeleton />
      <Participants.Skeleton />
      <Toolbar.Skeleton />
    </main>
  );
}
