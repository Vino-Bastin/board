"use client";

import { useCallback, useState } from "react";
import { useMutation } from "@liveblocks/react";

import { Camera } from "@/types/canvas";
import { pointerEventToCanvasPoint } from "@/lib/utils";

import { CursorsPresence } from "./cursors-presence";

const MAX_LAYERS = 100;

export function Board() {
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });

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

  return (
    <svg
      className="h-[100vh] w-[100vw]"
      onWheel={onWheel}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <g
        style={{
          transform: `translateX(${camera.x}px) translateY(${camera.y}px)`,
        }}
      >
        <CursorsPresence />
      </g>
    </svg>
  );
}
