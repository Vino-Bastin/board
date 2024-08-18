import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUnFavoriteBoard } from "@/hooks/api/use-unfavorite-board";
import { useFavoriteBoard } from "@/hooks/api/use-favorite-board";
import { toast } from "sonner";

interface FooterProps {
  title: string;
  authorLabel: string;
  createdAtLabel: string;
  isFavorite: boolean;
  id: string;
}

export function Footer({
  title,
  authorLabel,
  createdAtLabel,
  isFavorite,
  id,
}: FooterProps) {
  const { favorite, isPending: favoritePending } = useFavoriteBoard();
  const { unFavorite, isPending: unFavoritePending } = useUnFavoriteBoard();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();

    if (isFavorite)
      unFavorite(id).catch(() => toast.error("Failed to unfavorite board"));
    else favorite(id).catch(() => toast.error("Failed to favorite board"));
  };

  return (
    <div className="relative bg-white p-3">
      <p className="text-[13px] truncate max-w-[calc(100%-20px)]">{title}</p>
      <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate">
        {authorLabel}, {createdAtLabel}
      </p>
      <button
        disabled={favoritePending || unFavoritePending}
        onClick={handleClick}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-blue-600",
          (favoritePending || unFavoritePending) &&
            "cursor-not-allowed opacity-75"
        )}
      >
        <Star
          className={cn("h-4 w-4", isFavorite && "fill-blue-600 text-blue-600")}
        />
      </button>
    </div>
  );
}
