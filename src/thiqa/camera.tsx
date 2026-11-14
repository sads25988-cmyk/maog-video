import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const W = 1080;
export const H = 1920;
// Key-visual coordinates are authored on the 941x1672 originals; files on disk are 4x upscales.
export const SRC_W = 941;
export const SRC_H = 1672;
const NAT_W = 3764;
const NAT_H = 6688;
const COVER = Math.max(W / NAT_W, H / NAT_H);

export const NIGHT = "thiqa/night.jpg";
export const LAB = "thiqa/lab.jpg";

export type Ease = "io" | "out" | "in" | "lin" | "snap";
export type Key = { t: number; x: number; y: number; z: number; r?: number; e?: Ease };
export type Shake = { t0: number; t1: number; amp: number };

const easeFn = (e: Ease | undefined, p: number) => {
  switch (e) {
    case "lin":
      return p;
    case "out":
      return Easing.out(Easing.cubic)(p);
    case "in":
      return Easing.in(Easing.cubic)(p);
    case "snap":
      return Easing.out(Easing.exp)(p);
    default:
      return Easing.inOut(Easing.cubic)(p);
  }
};

export const camAt = (keys: Key[], t: number) => {
  const first = keys[0];
  if (t <= first.t) return { x: first.x, y: first.y, z: first.z, r: first.r ?? 0 };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (t <= b.t) {
      const p = easeFn(b.e, (t - a.t) / Math.max(1e-6, b.t - a.t));
      const lerp = (u: number, v: number) => u + (v - u) * p;
      return {
        x: lerp(a.x, b.x),
        y: lerp(a.y, b.y),
        z: Math.exp(lerp(Math.log(a.z), Math.log(b.z))),
        r: lerp(a.r ?? 0, b.r ?? 0),
      };
    }
  }
  const last = keys[keys.length - 1];
  return { x: last.x, y: last.y, z: last.z, r: last.r ?? 0 };
};

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
export const rand = hash;
export const noise1 = (x: number) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return (hash(i) * (1 - u) + hash(i + 1) * u) * 2 - 1;
};

export const shakeAt = (shakes: Shake[] | undefined, t: number) => {
  let dx = 0;
  let dy = 0;
  let dr = 0;
  for (const s of shakes ?? []) {
    if (t < s.t0 || t > s.t1) continue;
    const k = 1 - (t - s.t0) / (s.t1 - s.t0);
    const a = s.amp * k * k;
    dx += noise1(t * 38 + 3) * a;
    dy += noise1(t * 41 + 57) * a;
    dr += noise1(t * 29 + 91) * a * 0.035;
  }
  return { dx, dy, dr };
};

export const placement = (x: number, y: number, z: number) => {
  const s = COVER * z;
  const iw = NAT_W * s;
  const ih = NAT_H * s;
  const left = Math.min(0, Math.max(W - iw, W / 2 - (x / SRC_W) * iw));
  const top = Math.min(0, Math.max(H - ih, H / 2 - (y / SRC_H) * ih));
  return { left, top, iw, ih };
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.6 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 75% 62% at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

export const BottomShade: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(0,0,0,0.62) 100%)",
    }}
  />
);

export const Shot: React.FC<{
  src: string;
  keys: Key[];
  shakes?: Shake[];
  filter?: string;
  vignette?: number;
  shade?: boolean;
  children?: React.ReactNode;
}> = ({ src, keys, shakes, filter, vignette = 0.55, shade = true, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const c = camAt(keys, t);
  const p = camAt(keys, t - 1 / fps);
  const sh = shakeAt(shakes, t);
  const rot = c.r + sh.dr;
  const over = 1 + Math.abs(rot) * 0.036 + (Math.abs(sh.dx) + Math.abs(sh.dy)) / 650;
  const cur = placement(c.x, c.y, c.z);
  const prev = placement(p.x, p.y, p.z);
  const speed = Math.hypot(cur.left - prev.left, cur.top - prev.top) + Math.abs(cur.iw - prev.iw) * 0.6;
  const mb = Math.min(8, Math.max(0, (speed - 8) * 0.045));
  const filters = [filter, mb > 0.35 ? `blur(${mb.toFixed(2)}px)` : ""].filter(Boolean).join(" ");
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${sh.dx}px, ${sh.dy}px) rotate(${rot}deg) scale(${over})` }}>
        <Img
          src={staticFile(src)}
          style={{
            position: "absolute",
            left: cur.left,
            top: cur.top,
            width: cur.iw,
            height: cur.ih,
            maxWidth: "none",
            filter: filters || undefined,
          }}
        />
      </AbsoluteFill>
      {vignette > 0 ? <Vignette strength={vignette} /> : null}
      {shade ? <BottomShade /> : null}
      {children}
    </AbsoluteFill>
  );
};

// A manga panel lifted out of the key visual: clipped to its polygon, framed in white, floating over a blurred plate.
export const PanelShot: React.FC<{
  src: string;
  poly: [number, number][];
  width: number;
  rot: number;
  centerY?: number;
}> = ({ src, poly, width, rot, centerY = 840 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const k = width / (maxX - minX);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const iw = SRC_W * k;
  const ih = iw * (NAT_H / NAT_W);
  const left = W / 2 - cx * k;
  const top = centerY - cy * (ih / SRC_H);
  const ky = ih / SRC_H;
  const enter = Easing.out(Easing.cubic)(Math.min(1, t / 0.22));
  const drift = t / (durationInFrames / fps);
  const scale = 1.16 - 0.16 * enter + 0.035 * drift;
  const flash = Math.max(0, 1 - t / 0.16);
  const clip = `polygon(${poly.map(([x, y]) => `${(x * k).toFixed(1)}px ${(y * ky).toFixed(1)}px`).join(", ")})`;
  const pts = poly.map(([x, y]) => `${(left + x * k).toFixed(1)},${(top + y * ky).toFixed(1)}`).join(" ");
  const bg = placement(470, 900, 1.25 + drift * 0.06);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          left: bg.left,
          top: bg.top,
          width: bg.iw,
          height: bg.ih,
          maxWidth: "none",
          filter: "blur(28px) brightness(0.3) saturate(0.55)",
        }}
      />
      <AbsoluteFill
        style={{
          transform: `rotate(${rot}deg) scale(${scale})`,
          transformOrigin: `${W / 2}px ${centerY}px`,
          opacity: enter,
          filter: "drop-shadow(0 26px 40px rgba(0,0,0,0.75))",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            position: "absolute",
            left,
            top,
            width: iw,
            height: ih,
            maxWidth: "none",
            clipPath: clip,
            filter: "contrast(1.05) brightness(1.06)",
          }}
        />
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <polygon points={pts} fill="none" stroke="#f4f1ea" strokeWidth={9} strokeLinejoin="miter" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.85, pointerEvents: "none" }} />
      <Vignette strength={0.5} />
      <BottomShade />
    </AbsoluteFill>
  );
};
