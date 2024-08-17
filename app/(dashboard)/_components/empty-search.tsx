import { OctagonAlert } from "lucide-react";

interface EmptySearchProps {
  title: string;
  description: string;
}

export function EmptySearch({ title, description }: EmptySearchProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <OctagonAlert className="w-16 h-16 text-muted-foreground" />
      <h2 className="text-2xl font-semibold mt-6">{title}</h2>
      <p className="text-muted-foreground text-sm mt-2">{description}</p>
    </div>
  );
}
