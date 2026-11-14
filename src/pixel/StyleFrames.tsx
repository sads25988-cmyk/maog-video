import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PixelCanvas } from "./PixelCanvas";
import { Caption } from "./Caption";
import { drawExterior } from "./scenes/exterior";
import { drawKitchen } from "./scenes/kitchen";
import { drawHero } from "./scenes/hero";
import { Gfx } from "./engine";

const kitchenBurning = (g: Gfx, f: number) => drawKitchen(g, f + 20, { burning: true, expr: "shock", pose: "panic" });

/** Style-test stills for the pixel-art direction. Frame N = still N+1. */
export const StyleFrames: React.FC = () => {
  const f = useCurrentFrame();
  if (f === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#070f1a" }}>
        <PixelCanvas draw={drawExterior} />
        <Caption top={470} lines={["كل جمعة…", "*حماتي* تتعشى عندنا."]} />
      </AbsoluteFill>
    );
  }
  if (f === 1) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <PixelCanvas draw={kitchenBurning} />
        <Caption top={150} lines={["قدر حماتي…", "اللي *ما يحترق* أبد."]} />
      </AbsoluteFill>
    );
  }
  if (f === 2) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <PixelCanvas draw={drawHero} />
        <Caption top={150} size={78} lines={["موج.", "يهتم باللي *يهمك.*"]} />
        <Caption top={1600} size={48} lines={["دوّرها على الرف"]} />
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill style={{ backgroundColor: "#000" }} />;
};
