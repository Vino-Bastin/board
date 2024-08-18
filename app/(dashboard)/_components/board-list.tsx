import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { CreateBoard } from "./create-board";
import { EmptySearch } from "./empty-search";
import { BoardCard } from "./board-card";
import { NewBoardCard } from "./new-board-card";
import { BoardSkeleton } from "./board-card/board-skeleton";

interface BoardListProps {
  organizationId: string;
  query: {
    search?: string;
    favorite?: string;
  };
}

export function BoardList({ organizationId, query }: BoardListProps) {
  const data = useQuery(api.boards.get, { organizationId });

  if (data === undefined)
    return (
      <div>
        <h2 className="text-2xl font-medium">
          {query.favorite ? "Favorite Boards" : "Team Boards"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 pt-5">
          <NewBoardCard organizationId={organizationId} disabled />
          <BoardSkeleton />
          <BoardSkeleton />
          <BoardSkeleton />
        </div>
      </div>
    );

  if (!data.length && query.search)
    return (
      <EmptySearch
        imageUrl="/empty-search.svg"
        title="No boards found"
        description="Try searching for something else"
      />
    );

  if (!data.length && query.favorite)
    return (
      <EmptySearch
        imageUrl="/empty-favorites.svg"
        title="No favorite found"
        description="Try adding some boards to your favorites"
      />
    );

  if (!data.length)
    return (
      <EmptySearch
        imageUrl="/note.svg"
        title="No boards found"
        description="Try creating a new board"
      >
        <CreateBoard />
      </EmptySearch>
    );

  return (
    <div>
      <h2 className="text-2xl font-medium">
        {query.favorite ? "Favorite Boards" : "Team Boards"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 pt-5">
        <NewBoardCard organizationId={organizationId} />
        {data?.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            organizationId={board.organizationId}
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
}
