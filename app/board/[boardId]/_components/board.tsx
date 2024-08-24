"use client";

import { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import { useHistory, useMutation, useStorage } from "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";

import { useCanvasStore } from "@/store/use-canvas-store";
import { Camera, Color, Point, LayerType, CanvasMode } from "@/types/canvas";
import { pointerEventToCanvasPoint } from "@/lib/utils";

import { CursorsPresence } from "./cursors-presence";
import { LayerPreview } from "./layer-preview";

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

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();
      const cursor = pointerEventToCanvasPoint(e, camera);
      setMyPresence({ cursor });
    },
    []
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

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
            onLayerPointerDown={() => {}}
            selectionColor="#000"
          />
        ))}
        <CursorsPresence />
      </g>
    </svg>
  );
}
