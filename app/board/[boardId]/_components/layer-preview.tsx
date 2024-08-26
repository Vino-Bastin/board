"use client";

import { memo } from "react";
import { useStorage } from "@liveblocks/react";

import { RGBToHex } from "@/lib/utils";
import { LayerType } from "@/types/canvas";

import { Rectangle } from "./layers/rectangle";
import { Ellipse } from "./layers/ellipse";
import { Text } from "./layers/text";
import { Note } from "./layers/note";
import { Path } from "./layers/path";

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
      case LayerType.Path:
        return (
          <Path
            x={layer.x}
            y={layer.y}
            points={layer.points}
            fill={layer.fill ? RGBToHex(layer.fill) : "#000"}
            onPointerDown={(e) => onLayerPointerDown(e, id)}
            stroke={selectionColor}
          />
        );
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
        return null;
    }
  }
);

LayerPreview.displayName = "LayerPreview";
