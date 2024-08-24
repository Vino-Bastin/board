import { RectangleLayer } from "@/types/canvas";

interface RectangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (event: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export function Rectangle({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: RectangleProps) {
  const { x, y, width, height, fill } = layer;
  return (
    <rect
      className="drop-shadow-md"
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      x={0}
      y={0}
      width={width}
      height={height}
      strokeWidth={1}
      fill="#000"
      stroke="transparent"
    />
  );
}
