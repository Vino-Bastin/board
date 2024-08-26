"use client";

import { useCallback, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import {
  useHistory,
  useMutation,
  useOthersMapped,
  useSelf,
  useStorage,
} from "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";

import { useCanvasStore } from "@/store/use-canvas-store";
import {
  connectionIdToColor,
  findIntersectingLayersWithRectangle,
  penPointToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
  RGBToHex,
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
import { SelectionTools } from "./selection-tools";
import { Path } from "./layers/path";

const MAX_LAYERS = 100;

export function Board() {
  const layerIds = useStorage((root) => root.layerIds);
  const pencilDraft = useSelf((self) => self.presence.pencilDraft);
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

  // * multi selection
  const startMultiSelection = useCallback(
    (current: Point, origin: Point) => {
      if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
        setCanvasState({
          mode: CanvasMode.SelectionNext,
          origin,
          current,
        });
      }
    },
    [setCanvasState]
  );

  // * update the selection
  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toImmutable();
      setCanvasState({ mode: CanvasMode.SelectionNext, origin, current });
      const ids = findIntersectingLayersWithRectangle(
        layerIds,
        layers,
        origin,
        current
      );

      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  // * translate the selection (dragging)
  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) return;

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");
      for (const layerId of self.presence.selection) {
        const layer = liveLayers.get(layerId);
        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }

      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState]
  );

  // * start drawing
  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor,
      });
    },
    [lastUsedColor]
  );

  // * continue drawing and send the draft to self
  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;
      if (
        canvasState.mode !== CanvasMode.Pencil ||
        pencilDraft == null ||
        e.button !== -1
      ) {
        return;
      }
      console.log("point", pencilDraft);

      setMyPresence(
        {
          cursor: point,
          pencilDraft:
            pencilDraft.length === 1 &&
            pencilDraft[0][0] === point.x &&
            pencilDraft[0][1] === point.y
              ? pencilDraft
              : [...pencilDraft, [point.x, point.y, e.pressure]],
        },
        { addToHistory: true }
      );
    },
    [canvasState.mode]
  );

  // * insert the path into the layer
  const insertPath = useMutation(
    ({ self, storage, setMyPresence }) => {
      const { pencilDraft } = self.presence;
      const liveLayers = storage.get("layers");
      if (
        !pencilDraft ||
        pencilDraft.length < 2 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        setMyPresence({ pencilDraft: null });
        return;
      }

      const id = nanoid();
      liveLayers.set(
        id,
        new LiveObject(penPointToPathLayer(pencilDraft, lastUsedColor))
      );
      console.log(
        "insertPath",
        penPointToPathLayer(pencilDraft, lastUsedColor)
      );
      const liveLayerIds = storage.get("layerIds");
      liveLayerIds.push(id);

      setMyPresence({ pencilDraft: null }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.Pencil });
    },
    [lastUsedColor]
  );

  // * unselect all layers
  const unSelectLayers = useMutation(({ setMyPresence, self }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

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

      // * net selection
      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(cursor, canvasState.origin);
      }
      // * selection next
      else if (canvasState.mode === CanvasMode.SelectionNext) {
        updateSelectionNet(cursor, canvasState.origin);
      }
      // * moving the selection (dragging)
      else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(cursor);
      }
      // * resizing the selection
      else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(cursor);
      }
      // * drawing
      else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(cursor, e);
      }

      setMyPresence({ cursor });
    },
    [
      camera,
      canvasState,
      resizeSelectedLayer,
      translateSelectedLayers,
      continueDrawing,
      updateSelectionNet,
      startMultiSelection,
    ]
  );

  // * user left the canvas (moved to other tab)
  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  // * user clicked on the canvas
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);
      // * if we are inserting a new layer, we don't want deselection
      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }
      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }
      setCanvasState({ mode: CanvasMode.Pressing, origin: point });
    },
    [camera, canvasState.mode, setCanvasState, startDrawing]
  );

  // * user clicked on the canvas to create a new layer
  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unSelectLayers();
        setCanvasState({ mode: CanvasMode.None });
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.LayerType, point);
      } else {
        setCanvasState({ mode: CanvasMode.None });
      }

      history.resume();
    },
    [
      camera,
      canvasState,
      history,
      insertLayer,
      unSelectLayers,
      setCanvasState,
      insertPath,
    ]
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
    <>
      <SelectionTools camera={camera} setLastUsedColor={setLastUsedColor} />
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
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
          {canvasState.mode === CanvasMode.SelectionNext &&
            canvasState.current !== undefined && (
              <rect
                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              />
            )}

          {canvasState.mode === CanvasMode.Pencil &&
            pencilDraft != null &&
            pencilDraft.length > 0 && (
              <Path
                x={0}
                y={0}
                points={pencilDraft}
                fill={RGBToHex(lastUsedColor)}
              />
            )}
          <CursorsPresence />
        </g>
      </svg>
    </>
  );
}
