import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Camera, Color, Point, Side, XYWH } from "@/types/canvas";

const colors = [
  "#DC2626",
  "#D97706",
  "#059669",
  "#7C3AED",
  "#DB2777",
  "#2196f3",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function connectionIdToColor(connectionId: number): string {
  return colors[connectionId % colors.length];
}

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera
) {
  return {
    x: Math.round(e.clientX - camera.x),
    y: Math.round(e.clientY - camera.y),
  };
}

export function RGBToHex(color: Color): string {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}

export function hexToRGB(hex: string): Color {
  const hexValue = hex.replace("#", "");
  return {
    r: parseInt(hexValue.substring(0, 2), 16),
    g: parseInt(hexValue.substring(2, 4), 16),
    b: parseInt(hexValue.substring(4, 6), 16),
  };
}

export function resizeBounds(bounds: XYWH, corner: Side, point: Point): XYWH {
  const { x, y, width, height } = bounds;
  const result = { x, y, width, height };

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, x + width);
    result.width = Math.abs(x + width - point.x);
  }
  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(x, point.x);
    result.width = Math.abs(point.x - x);
  }
  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, y + height);
    result.height = Math.abs(y + height - point.y);
  }
  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(y, point.y);
    result.height = Math.abs(point.y - y);
  }

  return result;
}
