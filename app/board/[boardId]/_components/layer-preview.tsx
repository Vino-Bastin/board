"use client";

import { memo } from "react";
import { useStorage } from "@liveblocks/react";

import { LayerType } from "@/types/canvas";
import { Rectangle } from "./layers/rectangle";
import { Ellipse } from "./layers/ellipse";
import { Text } from "./layers/text";
import { Note } from "./layers/note";

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
      case LayerType.Text:
        return (
          <Text
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Note:
        return (
          <Note
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Ellipse:
        return (
          <Ellipse
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
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
