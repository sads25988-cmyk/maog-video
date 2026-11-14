import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { H, W, rand } from "./camera";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.13 }) => {
  const frame = useCurrentFrame();
  const sx = rand(frame * 1.7) > 0.5 ? -1 : 1;
  const sy = rand(frame * 2.3 + 9) > 0.5 ? -1 : 1;
  return (
    <Img
      src={staticFile(`thiqa/grain-${frame % 4}.png`)}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: W,
        height: H,
        opacity,
        mixBlendMode: "overlay",
        transform: `scale(${sx}, ${sy})`,
        pointerEvents: "none",
      }}
    />
  );
};

export const Flash: React.FC<{ t: number; at: number[]; peak?: number; len?: number; color?: string }> = ({
  t,
  at,
  peak = 0.6,
  len = 0.14,
  color = "#fff",
}) => {
  let o = 0;
  for (const a of at) {
    if (t >= a && t < a + len) o = Math.max(o, peak * (1 - (t - a) / len));
  }
  if (o <= 0.001) return null;
  return <AbsoluteFill style={{ background: color, opacity: o, pointerEvents: "none" }} />;
};

export const SpeedLines: React.FC<{ t: number; dur: number; inner?: number; color?: string; cy?: number }> = ({
  t,
  dur,
  inner = 360,
  color = "#ffffff",
  cy = H / 2,
}) => {
  const frame = useCurrentFrame();
  if (t < 0 || t > dur) return null;
  const env = clamp01(t / 0.04) * (1 - clamp01((t - dur * 0.5) / (dur * 0.5)));
  const cx = W / 2;
  const N = 96;
  const polys: string[] = [];
  for (let i = 0; i < N; i++) {
    const seed = i * 13.7 + frame * 3.1;
    if (rand(seed) < 0.3) continue;
    const a = (i / N) * Math.PI * 2 + (rand(i * 7.7) - 0.5) * 0.06;
    const r0 = inner + rand(seed + 1) * 300;
    const r1 = 1700;
    const hw = 0.004 + rand(seed + 2) * 0.013;
    polys.push(
      `${cx + Math.cos(a) * r0},${cy + Math.sin(a) * r0} ${cx + Math.cos(a + hw) * r1},${cy + Math.sin(a + hw) * r1} ${
        cx + Math.cos(a - hw) * r1
      },${cy + Math.sin(a - hw) * r1}`,
    );
  }
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: env * 0.9, pointerEvents: "none" }}>
      {polys.map((p, i) => (
        <polygon key={i} points={p} fill={color} />
      ))}
    </svg>
  );
};

export const Rain: React.FC<{ t: number; amount?: number; opacity?: number }> = ({ t, amount = 1, opacity = 1 }) => {
  const N = Math.round(190 * amount);
  const lines: React.ReactNode[] = [];
  const slant = -0.17;
  for (let i = 0; i < N; i++) {
    const near = rand(i * 9.1) > 0.78;
    const speed = (near ? 3600 : 2300) + rand(i * 3.3) * 900;
    const len = near ? 150 + rand(i * 4.4) * 120 : 60 + rand(i * 4.4) * 80;
    const span = H + 400;
    const y = ((rand(i * 2.17) * span + speed * t) % span) - 200;
    const x = rand(i * 1.31) * (W + 400) - 200 - y * slant;
    lines.push(
      <line
        key={i}
        x1={x}
        y1={y}
        x2={x + len * slant}
        y2={y - len}
        stroke={`rgba(205,222,255,${near ? 0.42 : 0.24 + rand(i * 6.6) * 0.18})`}
        strokeWidth={near ? 3.2 : 1.3 + rand(i * 5.5) * 1.1}
        strokeLinecap="round"
      />,
    );
  }
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity, pointerEvents: "none" }}>
      {lines}
    </svg>
  );
};

export const Dust: React.FC<{
  t: number;
  n?: number;
  color?: string;
  box?: [number, number, number, number];
  opacity?: number;
}> = ({ t, n = 40, color = "255,214,140", box = [0, 0, W, H], opacity = 1 }) => {
  const [bx, by, bw, bh] = box;
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const size = 2 + rand(i * 3.7) * 7;
        const rise = 18 + rand(i * 5.1) * 60;
        const x = bx + rand(i * 1.9) * bw + Math.sin(t * (0.6 + rand(i) * 0.8) + i) * 22;
        const y = by + (((rand(i * 2.3) * bh - t * rise) % bh) + bh) % bh;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * (1.4 + rand(i * 7) * 2.2) + i * 1.3));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `rgba(${color},${0.85 * tw})`,
              boxShadow: `0 0 ${size * 3}px rgba(${color},${0.6 * tw})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Golden light spilling through a door that opens toward camera; ends in a full white-gold flood.
export const DoorLight: React.FC<{ t: number; dur: number }> = ({ t, dur }) => {
  const open = Easing.inOut(Easing.cubic)(clamp01((t - 0.12) / 1.05));
  const flood = Easing.in(Easing.quad)(clamp01((t - (dur - 0.45)) / 0.45));
  const push = 1 + 0.22 * Easing.in(Easing.quad)(clamp01(t / dur));
  const gap = 8 + open * 560;
  const doorTop = 300;
  const doorBottom = 1540;
  const cx = W / 2;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 48%" }}>
        <AbsoluteFill
          style={{
            opacity: 0.25 + open * 0.75,
            background: `radial-gradient(ellipse ${260 + open * 520}px ${520 + open * 700}px at 50% 48%, rgba(255,196,96,0.55), rgba(255,170,60,0.12) 55%, rgba(0,0,0,0) 75%)`,
          }}
        />
        <AbsoluteFill
          style={{
            opacity: open * 0.75,
            background:
              "repeating-conic-gradient(from 0deg at 50% 48%, rgba(255,220,140,0) 0deg, rgba(255,220,140,0.2) 1.6deg, rgba(255,220,140,0) 5deg)",
            WebkitMaskImage: "radial-gradient(circle at 50% 48%, #000 0%, rgba(0,0,0,0.6) 30%, transparent 62%)",
            maskImage: "radial-gradient(circle at 50% 48%, #000 0%, rgba(0,0,0,0.6) 30%, transparent 62%)",
            transform: `rotate(${t * 5}deg)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: cx - gap / 2,
            top: doorTop,
            width: gap,
            height: doorBottom - doorTop,
            background:
              "linear-gradient(90deg, #ffae3c 0%, #ffe7b0 22%, #fffaf0 50%, #ffe7b0 78%, #ffae3c 100%)",
            boxShadow: `0 0 ${90 + open * 220}px ${30 + open * 90}px rgba(255,186,84,0.65)`,
          }}
        />
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <linearGradient id="leafL" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#3a2410" />
              <stop offset="0.25" stopColor="#1a1007" />
              <stop offset="1" stopColor="#050302" />
            </linearGradient>
            <linearGradient id="leafR" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#3a2410" />
              <stop offset="0.25" stopColor="#1a1007" />
              <stop offset="1" stopColor="#050302" />
            </linearGradient>
          </defs>
          {(() => {
            const leaf = 40 + open * 330;
            const flare = open * 150;
            const l = cx - gap / 2;
            const r = cx + gap / 2;
            return (
              <>
                <polygon
                  points={`${l},${doorTop} ${l - leaf},${doorTop - flare} ${l - leaf},${doorBottom + flare} ${l},${doorBottom}`}
                  fill="url(#leafL)"
                />
                <polygon
                  points={`${r},${doorTop} ${r + leaf},${doorTop - flare} ${r + leaf},${doorBottom + flare} ${r},${doorBottom}`}
                  fill="url(#leafR)"
                />
                <line x1={l} y1={doorTop} x2={l} y2={doorBottom} stroke="#ffcf7a" strokeWidth={4} opacity={0.9} />
                <line x1={r} y1={doorTop} x2={r} y2={doorBottom} stroke="#ffcf7a" strokeWidth={4} opacity={0.9} />
              </>
            );
          })()}
        </svg>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: doorBottom,
            width: W,
            height: H - doorBottom,
            background: "linear-gradient(180deg, rgba(255,214,140,0.85), rgba(255,170,70,0.0) 85%)",
            clipPath: `polygon(${cx - gap / 2}px 0px, ${cx + gap / 2}px 0px, ${cx + gap * 1.6 + 120}px ${H - doorBottom}px, ${
              cx - gap * 1.6 - 120
            }px ${H - doorBottom}px)`,
            opacity: open,
          }}
        />
        <Dust t={t} n={46} box={[cx - 420, doorTop - 80, 840, doorBottom - doorTop + 300]} opacity={open} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff6e2", opacity: flood }} />
    </AbsoluteFill>
  );
};

export const Waves: React.FC<{ t: number; opacity?: number }> = ({ t, opacity = 1 }) => {
  const path = (base: number, amp: number, k: number, ph: number) => {
    let d = `M 0 ${H}`;
    for (let x = 0; x <= W; x += 20) {
      const y = base + amp * Math.sin(x * k + ph) + amp * 0.35 * Math.sin(x * k * 2.3 - ph * 1.4);
      d += ` L ${x} ${y.toFixed(1)}`;
    }
    return `${d} L ${W} ${H} Z`;
  };
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity, pointerEvents: "none" }}>
      <defs>
        <linearGradient id="wv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4f86ff" stopOpacity="0.38" />
          <stop offset="1" stopColor="#0a1f6b" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={path(1560, 26, 0.0062, t * 1.5)} fill="url(#wv)" />
      <path d={path(1625, 22, 0.0081, -t * 1.9 + 1.7)} fill="url(#wv)" />
      <path d={path(1700, 18, 0.0105, t * 2.3 + 3.1)} fill="url(#wv)" />
    </svg>
  );
};
