import Image from "next/image";

interface EmptySearchProps {
  title: string;
  description: string;
  imageUrl: string;
  children?: React.ReactNode;
}

export function EmptySearch({
  title,
  description,
  children,
  imageUrl,
}: EmptySearchProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src={imageUrl} alt="Empty Search" width={160} height={160} />
      <h2 className="text-2xl font-semibold mt-6">{title}</h2>
      <p className="text-muted-foreground text-sm mt-2">{description}</p>
      {children}
    </div>
  );
}
