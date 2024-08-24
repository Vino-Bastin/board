"use client";

import { memo } from "react";
import { useStorage } from "@liveblocks/react";

import { LayerType } from "@/types/canvas";
import { Rectangle } from "./rectangle";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (event: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const LayerPreview = memo(
  ({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    const layer = useStorage((root) => root.layers.get(id));
    if (!layer) return null;

    switch (layer.type) {
      case LayerType.Rectangle:
        return (
          <Rectangle
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      default:
        console.warn(`Unsupported layer type: ${layer.type}`);
        return null;
    }
  }
);

LayerPreview.displayName = "LayerPreview";
