"use client";

import { memo } from "react";

import { EllipseLayer } from "@/types/canvas";
import { RGBToHex } from "@/lib/utils";

interface EllipseProps {
  id: string;
  layer: EllipseLayer;
  onPointerDown: (event: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const Ellipse = memo(
  ({ id, layer, onPointerDown, selectionColor }: EllipseProps) => {
    const { x, y, width, height, fill } = layer;
    return (
      <ellipse
        className="drop-shadow-md"
        onPointerDown={(e) => onPointerDown(e, id)}
        style={{
          transform: `translateX(${x}px) translateY(${y}px)`,
        }}
        cx={width / 2}
        cy={height / 2}
        rx={width / 2}
        ry={height / 2}
        fill={fill ? RGBToHex(fill) : "#CCC"}
        stroke={selectionColor || "transparent"}
        strokeWidth={1}
      />
    );
  }
);

Ellipse.displayName = "Ellipse";
