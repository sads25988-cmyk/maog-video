import React from "react";
import { C } from "./theme";
import { FONT } from "./fonts";

/** Placeholder MOAJ wordmark — swap with the official logo file when available. */
export const MoajLogo: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 260, style }) => {
  const w = size * 2.3;
  const h = size * 1.5;
  const text = (props: React.SVGProps<SVGTextElement>) => (
    <text
      x={w / 2}
      y={size * 1.02}
      textAnchor="middle"
      direction="rtl"
      fontFamily={FONT}
      fontWeight={900}
      fontSize={size}
      strokeLinejoin="round"
      paintOrder="stroke fill"
      {...props}
    >
      موج
    </text>
  );
  const wave = `M${w * 0.1} ${h * 0.86} Q${w * 0.2} ${h * 0.74} ${w * 0.3} ${h * 0.86} T${w * 0.5} ${h * 0.86} T${w * 0.7} ${h * 0.86} T${w * 0.9} ${h * 0.84}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible", ...style }}>
      {text({ fill: C.ink, stroke: C.ink, strokeWidth: size * 0.2, transform: `translate(0 ${size * 0.05})` })}
      {text({ fill: C.blue, stroke: C.white, strokeWidth: size * 0.1 })}
      <path d={wave} fill="none" stroke={C.ink} strokeWidth={size * 0.11} strokeLinecap="round" />
      <path d={wave} fill="none" stroke={C.yellow} strokeWidth={size * 0.055} strokeLinecap="round" />
    </svg>
  );
};
