import { useStorage, useSelf, shallow } from "@liveblocks/react";

import { Layer, XYWH } from "@/types/canvas";

const boundingBox = (layers: Layer[]): XYWH | null => {
  const firstLayer = layers[0];
  if (!firstLayer) return null;

  let left = firstLayer.x;
  let right = firstLayer.x + firstLayer.width;
  let top = firstLayer.y;
  let bottom = firstLayer.y + firstLayer.height;

  for (const { x, y, width, height } of layers) {
    if (left > x) left = x;
    if (right < x + width) right = x + width;
    if (top > y) top = y;
    if (bottom < y + height) bottom = y + height;
  }

  return { x: left, y: top, width: right - left, height: bottom - top };
};

export function useSelectionBounds() {
  const selection = useSelf((self) => self.presence.selection);
  return useStorage((root) => {
    const selectedLayer = selection
      ?.map((layerId) => root.layers.get(layerId)!)
      .filter(Boolean) as Layer[];

    return boundingBox(selectedLayer);
  }, shallow);
}
