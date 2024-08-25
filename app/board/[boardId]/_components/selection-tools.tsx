"use client";

import { memo, useState } from "react";
import { useMutation, useSelf } from "@liveblocks/react";

import { useSelectionBounds } from "@/hooks/use-selection-bounds";

import { Camera, Color } from "@/types/canvas";
import { hexToRGB } from "@/lib/utils";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

export const SelectionTools = memo(
  ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    const [color, setColor] = useState("#000");
    const selection = useSelf((me) => me.presence.selection);
    const selectedBounds = useSelectionBounds();
    const setFill = useMutation(
      ({ storage }, e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
        const rgb = hexToRGB(e.target.value);

        setLastUsedColor(rgb);
        const liveLayers = storage.get("layers");
        selection?.forEach((layerId) => {
          liveLayers.get(layerId)?.set("fill", rgb);
        });
      },
      [selection, setLastUsedColor]
    );

    if (!selectedBounds) return null;

    const x = selectedBounds.width / 2 + selectedBounds.x + camera.x;
    const y = selectedBounds.y + camera.y;

    return (
      <div
        className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
        style={{
          transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`,
        }}
      >
        <div className="pr-2 mr-2 border-r border-neutral-200">
          <input
            className="h-8 w-8 items-center flex justify-center"
            type="color"
            value={color}
            onChange={setFill}
          />
        </div>
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";
