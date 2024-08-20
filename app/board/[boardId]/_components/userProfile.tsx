import { Hint } from "@/components/hint";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserProfileProps {
  borderColor?: string;
  avatar?: string;
  fallback?: string;
  label?: string;
}

export function UserProfile({
  label,
  avatar,
  fallback,
  borderColor,
}: UserProfileProps) {
  return (
    <Hint label={label || "Anonymous"} side="bottom" sideOffset={18}>
      <Avatar className="h-8 w-8 border-2" style={{ borderColor }}>
        <AvatarImage src={avatar} />
        <AvatarFallback className="text-xs font-semibold">
          {fallback || "A"}
        </AvatarFallback>
      </Avatar>
    </Hint>
  );
}
