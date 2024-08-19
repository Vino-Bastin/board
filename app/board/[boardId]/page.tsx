import { Canvas } from "@/app/board/[boardId]/_components/canvas";
import { Room } from "@/components/room";
import { Loading } from "@/app/board/[boardId]/_components/loading";

interface BoardDetailsPageProps {
  params: {
    boardId: string;
  };
}

export default function BoardDetailsPage({ params }: BoardDetailsPageProps) {
  return (
    <Room roomId={params.boardId} fallback={<Loading />}>
      <Canvas boardId={params.boardId} />
    </Room>
  );
}
