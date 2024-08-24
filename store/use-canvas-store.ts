import { create } from "zustand";

import { CanvasMode, CanvasState } from "@/types/canvas";

interface useCanvasStore {
  canvasState: CanvasState;
  setCanvasState: (state: CanvasState) => void;
}

export const useCanvasStore = create<useCanvasStore>((set) => ({
  canvasState: {
    mode: CanvasMode.None,
  },
  setCanvasState: (state) => set({ canvasState: state }),
}));
