import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FRAMES } from "./storyboard/Frames";
import { C } from "./theme";

/** 10-frame storyboard: frame N of this composition = storyboard panel N+1. */
export const Storyboard: React.FC = () => {
  const frame = useCurrentFrame();
  const F = FRAMES[Math.min(frame, FRAMES.length - 1)];
  return (
    <AbsoluteFill style={{ backgroundColor: C.wall }}>
      <F />
    </AbsoluteFill>
  );
};
