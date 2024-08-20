"use client";

import { useOthers, useSelf } from "@liveblocks/react";

import { connectionIdToColor } from "@/lib/utils";
import { UserProfile } from "./userProfile";

const MAX_SHOWN_OTHER_USERS = 1;

export const Participants = () => {
  const users = useOthers();
  const currentUser = useSelf();

  if (!currentUser) return <ParticipantsSkeleton />;

  const hasOthers = users.length > MAX_SHOWN_OTHER_USERS;

  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md shadow-md p-3 flex items-center">
      <div className="flex gap-x-2">
        {users.slice(0, MAX_SHOWN_OTHER_USERS).map(({ connectionId, info }) => (
          <UserProfile
            key={connectionId}
            avatar={info.picture}
            label={info.name}
            fallback={info.name?.[0]}
            borderColor={connectionIdToColor(connectionId)}
          />
        ))}
        <UserProfile
          avatar={currentUser?.info.picture}
          label={`${currentUser?.info.name} you`}
          fallback={currentUser?.info.name?.[0]}
          borderColor={connectionIdToColor(currentUser?.connectionId)}
        />
        {hasOthers && (
          <UserProfile
            label={`+${users.length - MAX_SHOWN_OTHER_USERS} more`}
            fallback={`+${users.length - MAX_SHOWN_OTHER_USERS}`}
          />
        )}
      </div>
    </div>
  );
};

export function ParticipantsSkeleton() {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md shadow-md p-3 flex items-center w-[100px]" />
  );
}
