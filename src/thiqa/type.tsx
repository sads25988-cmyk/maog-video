import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { F } from "./fonts";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const GOLD: React.CSSProperties = {
  background: "linear-gradient(180deg, #fff7da 0%, #f6d67a 34%, #cf9431 60%, #f8e09a 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

const SUB_SHADOW = "0 3px 0 rgba(0,0,0,0.55), 0 0 22px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.9)";

export const Sub: React.FC<{
  a: number;
  b: number;
  children: React.ReactNode;
  y?: number;
  size?: number;
  punch?: boolean;
}> = ({ a, b, children, y = 1455, size = 68, punch }) => {
  const t = useT();
  if (t < a || t > b) return null;
  const pin = Easing.out(Easing.cubic)(clamp01((t - a) / 0.2));
  const pout = clamp01((b - t) / 0.15);
  const scale = punch ? interpolate(t - a, [0, 0.09, 0.22], [1.45, 0.95, 1], CL) : 1;
  const blur = (1 - pin) * 7;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        padding: "0 70px",
        textAlign: "center",
        direction: "rtl",
        fontFamily: `${F.naskh}, ${F.cairo}, sans-serif`,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.55,
        color: "#fff",
        opacity: Math.min(pin, pout),
        transform: `translateY(${(1 - pin) * 16}px) scale(${scale})`,
        filter: blur > 0.25 ? `blur(${blur.toFixed(2)}px)` : undefined,
        textShadow: SUB_SHADOW,
      }}
    >
      {children}
    </div>
  );
};

export const Slam: React.FC<{
  a: number;
  b: number;
  text: string;
  size?: number;
  y?: number;
  family?: string;
}> = ({ a, b, text, size = 250, y = 820, family = F.cairo }) => {
  const t = useT();
  if (t < a || t > b) return null;
  const d = t - a;
  const scale = interpolate(d, [0, 0.08, 0.18], [1.9, 0.94, 1], CL);
  const ca = 18 * Math.max(0, 1 - d / 0.4) + 2;
  const o = Math.min(clamp01(d / 0.05), clamp01((b - t) / 0.12));
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        textAlign: "center",
        direction: "rtl",
        fontFamily: `${family}, sans-serif`,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.2,
        color: "#fff",
        opacity: o,
        transform: `scale(${scale})`,
        textShadow: `${ca}px 0 0 rgba(255,32,72,0.8), ${-ca}px 0 0 rgba(0,214,255,0.7), 0 0 50px rgba(0,0,0,0.9)`,
      }}
    >
      {text}
    </div>
  );
};

export const Label: React.FC<{ a: number; b: number; text: string }> = ({ a, b, text }) => {
  const t = useT();
  if (t < a || t > b) return null;
  const p = Easing.inOut(Easing.cubic)(clamp01((t - a) / 0.5));
  const bar = Easing.out(Easing.cubic)(clamp01((t - a) / 0.25));
  const o = clamp01((b - t) / 0.25);
  return (
    <div
      style={{
        position: "absolute",
        top: 170,
        right: 72,
        display: "flex",
        alignItems: "center",
        gap: 18,
        direction: "rtl",
        opacity: o,
      }}
    >
      <div style={{ width: 6, height: 50, background: "#f2c45a", transform: `scaleY(${bar})`, borderRadius: 2 }} />
      <div
        style={{
          fontFamily: `${F.cairo}, sans-serif`,
          fontWeight: 700,
          fontSize: 38,
          color: "rgba(255,255,255,0.94)",
          textShadow: "0 2px 14px rgba(0,0,0,0.85)",
          clipPath: `inset(-20px -20px -20px ${(1 - p) * 100}%)`,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const Footnote: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => {
  const t = useT();
  if (t < a || t > b) return null;
  const o = Math.min(clamp01((t - a) / 0.3), clamp01((b - t) / 0.15));
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1800,
        padding: "0 80px",
        textAlign: "center",
        direction: "rtl",
        fontFamily: `${F.naskh}, ${F.cairo}, sans-serif`,
        fontWeight: 700,
        fontSize: 24,
        lineHeight: 1.5,
        color: "rgba(255,255,255,0.72)",
        textShadow: "0 1px 6px rgba(0,0,0,0.9)",
        opacity: o,
      }}
    >
      {children}
    </div>
  );
};
