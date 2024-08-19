export const Participants = () => {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md shadow-md p-3 flex items-center">
      Participants
    </div>
  );
};

export function ParticipantsSkeleton() {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md shadow-md p-3 flex items-center w-[100px]" />
  );
}
