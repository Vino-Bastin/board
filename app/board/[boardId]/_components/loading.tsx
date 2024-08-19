import { Loader } from "lucide-react";

import { InfoSkeleton } from "@/app/board/[boardId]/_components/info";
import { ParticipantsSkeleton } from "@/app/board/[boardId]/_components/participants";
import { ToolbarSkeleton } from "@/app/board/[boardId]/_components/toolbar";

export function Loading() {
  return (
    <main className="relative w-full h-full flex items-center justify-center">
      <Loader className="animate-spin h-6 w-6 text-muted-foreground" />
      <InfoSkeleton />
      <ParticipantsSkeleton />
      <ToolbarSkeleton />
    </main>
  );
}
