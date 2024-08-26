"use client";

import { memo } from "react";
import { useMutation } from "@liveblocks/react";
import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { NoteLayer } from "@/types/canvas";
import { cn, getContrastingTextColor, RGBToHex } from "@/lib/utils";

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

interface NoteProps {
  id: string;
  layer: NoteLayer;
  onPointerDown: (event: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

const MAX_FONT_SIZE = 96;
const SCALE_FACTOR = 0.15;
const calculateFontSize = (width: number, height: number) => {
  const fontSizeBasedOnWidth = width * SCALE_FACTOR;
  const fontSizeBasedOnHeight = height * SCALE_FACTOR;
  return Math.min(fontSizeBasedOnWidth, fontSizeBasedOnHeight, MAX_FONT_SIZE);
};

export const Note = memo(
  ({ id, layer, onPointerDown, selectionColor }: NoteProps) => {
    const { x, y, value, height, width, fill } = layer;

    const updateValue = useMutation(({ storage }, newValue) => {
      const liveLayers = storage.get("layers");
      liveLayers.get(id)?.update({ value: newValue });
    }, []);

    const handleContentEditableChange = (e: ContentEditableEvent) => {
      updateValue(e.target.value);
    };

    return (
      <foreignObject
        x={x}
        y={y}
        width={width}
        height={height}
        onPointerDown={(e) => onPointerDown(e, id)}
        style={{
          outline: selectionColor ? `1px solid ${selectionColor}` : "none",
          backgroundColor: fill ? RGBToHex(fill) : "#CCC",
        }}
        className="shadow-md drop-shadow-xl"
      >
        <ContentEditable
          html={value || "text"}
          onChange={handleContentEditableChange}
          className={cn(
            "h-full w-full flex items-center justify-center outline-none",
            font.className
          )}
          style={{
            color: fill ? getContrastingTextColor(fill) : "#000",
            fontSize: calculateFontSize(width, height),
          }}
        />
      </foreignObject>
    );
  }
);

Note.displayName = "Text";
