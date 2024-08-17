import { EmptySearch } from "./empty-search";

interface BoardListProps {
  organizationId: string;
  query: {
    search?: string;
    favorite?: string;
  };
}

export function BoardList({ organizationId, query }: BoardListProps) {
  const data = [];

  if (!data.length && query.search)
    return (
      <EmptySearch
        title="No boards found"
        description="Try searching for something else"
      />
    );

  if (!data.length && query.favorite)
    return (
      <EmptySearch
        title="No favorite found"
        description="Try adding some boards to your favorites"
      />
    );

  if (!data.length)
    return (
      <EmptySearch
        title="No boards found"
        description="Try creating a new board"
      />
    );

  return <div>{JSON.stringify(query)}</div>;
}
