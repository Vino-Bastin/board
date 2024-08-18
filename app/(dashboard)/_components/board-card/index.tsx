import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/nextjs";

import { Overlay } from "./overlay";
import { Footer } from "./footer";
import { Actions } from "@/components/actions";

interface BoardCardProps {
  id: string;
  title: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  isFavorite: boolean;
}

export function BoardCard({
  id,
  title,
  imageUrl,
  authorId,
  authorName,
  createdAt,
  isFavorite,
}: BoardCardProps) {
  const { userId } = useAuth();

  const authorLabel = authorId === userId ? "You" : authorName;
  const createdAtLabel = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  return (
    <Link href={`/board/${id}`}>
      <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-blue-50">
          <Image src={imageUrl} alt="Placeholder" fill className="object-fit" />
          <Overlay />
          <Actions id={id} title={title} side="right">
            <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-2 outline-none">
              <MoreHorizontal className="text-white opacity-75 hover:opacity-75 transition-opacity" />
            </button>
          </Actions>
        </div>
        <Footer
          title={title}
          authorLabel={authorLabel}
          createdAtLabel={createdAtLabel}
          isFavorite={isFavorite}
          id={id}
        />
      </div>
    </Link>
  );
}
