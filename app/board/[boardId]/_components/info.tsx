"use client";

import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useQuery } from "convex/react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useBoardRenameModal } from "@/store/use-board-rename-modal";

import { Actions } from "@/components/actions";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface InfoProps {
  boardId: String;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const Info = ({ boardId }: InfoProps) => {
  const data = useQuery(api.board.get, { id: boardId as Id<"board"> });
  const { open } = useBoardRenameModal();
  if (!data) return <InfoSkeleton />;

  return (
    <div className="absolute h-12 top-2 left-2 bg-white rounded-md px-1.5 flex items-center shadow-md">
      <Hint label="Go to boards" side="bottom" sideOffset={10}>
        <Button asChild variant="board" className="px-2">
          <Link href="/">
            <Image src="/logo.svg" alt="board logo" width={40} height={40} />
            <span
              className={cn(
                "ml-2 font-semibold text-xl text-black",
                font.className,
              )}
            >
              Board
            </span>
          </Link>
        </Button>
      </Hint>
      <div className="px-1.5 text-neutral-300">|</div>
      <Hint label="Edit title" side="bottom" sideOffset={10}>
        <Button
          className="text-base font-normal px-2"
          variant="board"
          onClick={() => open(data._id, data.title)}
        >
          {data.title}
        </Button>
      </Hint>
      <div className="px-1.5 text-neutral-300">|</div>
      <Actions id={data._id} title={data.title}>
        <Hint label="Main menu" side="bottom" sideOffset={10}>
          <Button variant="board" className="px-2">
            <Menu />
          </Button>
        </Hint>
      </Actions>
    </div>
  );
};

export function InfoSkeleton() {
  return (
    <div className="absolute h-12 top-2 left-2 bg-white rounded-md px-1.5 flex items-center shadow-md w-[300px]" />
  );
}
