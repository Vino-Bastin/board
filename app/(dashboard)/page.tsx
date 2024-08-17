"use client";

import { useOrganization } from "@clerk/nextjs";

import { EmptyOrganization } from "./_components/empty-organization";
import { BoardList } from "./_components/board-list";

interface Props {
  searchParams: {
    search?: string;
    favorite?: string;
  };
}

export default function Page({ searchParams }: Props) {
  const { organization } = useOrganization();
  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyOrganization />
      ) : (
        <BoardList organizationId={organization.id} query={searchParams} />
      )}
    </div>
  );
}
