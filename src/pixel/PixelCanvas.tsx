import React, { useLayoutEffect, useRef } from "react";
import { useCurrentFrame } from "remotion";
import { Gfx, quantize } from "./engine";

export const LW = 270; // low-res width
export const LH = 480; // low-res height (×4 = 1080×1920)

type Props = {
  draw: (g: Gfx, frame: number) => void;
  dither?: number;
  raw?: boolean; // skip palette snap (debug)
};

/** Drawing is synchronous inside a layout effect, so the frame is complete before capture.
 * Draws a low-res scene, palette-snaps it, and upscales it crisply to fill the frame. */
export const PixelCanvas: React.FC<Props> = ({ draw, dither = 1, raw }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, LW, LH);
    draw(new Gfx(ctx, LW, LH), frame);
    if (!raw) quantize(ctx, LW, LH, dither);
  }, [draw, frame, dither, raw]);
  return (
    <canvas
      ref={ref}
      width={LW}
      height={LH}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", imageRendering: "pixelated" }}
    />
  );
};
