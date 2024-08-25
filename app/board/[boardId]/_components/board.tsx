"use client";

import { useCallback, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import {
  useHistory,
  useMutation,
  useOthersMapped,
  useStorage,
} from "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";

import { useCanvasStore } from "@/store/use-canvas-store";
import {
  connectionIdToColor,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "@/lib/utils";
import {
  Camera,
  Color,
  Point,
  LayerType,
  CanvasMode,
  Side,
  XYWH,
} from "@/types/canvas";

import { CursorsPresence } from "./cursors-presence";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";

const MAX_LAYERS = 100;

export function Board() {
  const layerIds = useStorage((root) => root.layerIds);
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const { canvasState, setCanvasState } = useCanvasStore();
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });
  const history = useHistory();

  // * create a new layer
  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note,
      position: Point
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) return;

      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastUsedColor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    },
    [lastUsedColor]
  );

  // * resize the selection event handler
  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        corner,
        initialBounds,
      });
    },
    [history, setCanvasState]
  );

  // * resize the selection
  const resizeSelectedLayer = useMutation(
    ({ self, storage }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) return;
      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(self.presence.selection[0]);

      if (layer) layer.update(bounds);
    },
    [canvasState]
  );

  // * mouse scroll
  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  // * cursor tracking
  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const cursor = pointerEventToCanvasPoint(e, camera);
      // * resizing the selection
      if (canvasState.mode === CanvasMode.Resizing) resizeSelectedLayer(cursor);
      setMyPresence({ cursor });
    },
    [canvasState, resizeSelectedLayer, camera]
  );

  // * user left the canvas (moved to other tab)
  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  // * user clicked on the canvas to create a new layer
  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.LayerType, point);
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }

      history.resume();
    },
    [camera, canvasState, history, insertLayer]
  );

  // * listen to other users' selections
  const selections = useOthersMapped((other) => other.presence.selection);
  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};
    for (const user of selections) {
      const [connectionId, selection] = user;
      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }
    return layerIdsToColorSelection;
  }, [selections]);

  // * send my selection
  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }

      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, camera);
      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }

      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    []
  );

  return (
    <svg
      className="h-[100vh] w-[100vw]"
      onWheel={onWheel}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerUp={onPointerUp}
    >
      <g
        style={{
          transform: `translateX(${camera.x}px) translateY(${camera.y}px)`,
        }}
      >
        {layerIds?.map((layerId) => (
          <LayerPreview
            key={layerId}
            id={layerId}
            onLayerPointerDown={onLayerPointerDown}
            selectionColor={layerIdsToColorSelection[layerId]}
          />
        ))}
        <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
        <CursorsPresence />
      </g>
    </svg>
  );
}
