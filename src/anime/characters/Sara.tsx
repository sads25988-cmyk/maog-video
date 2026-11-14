import React from "react";
import { OC, PO, SL } from "../AnimeCanvas";

export type SaraExpr = "normal" | "shocked" | "disgusted" | "happy" | "worried";
export type SaraPose = "stand" | "washDishes" | "holdSponge" | "smellSponge" | "react";

const SK  = "#f5c89a"; // skin
const SKS = "#e0a070"; // skin shadow
const HR  = "#2e1a0c"; // hair dark
const HRH = "#5a3520"; // hair highlight
const CL  = "#8ab4cc"; // clothes (light blue abaya)
const CLS = "#6090aa"; // clothes shadow
const CLH = "#b8d4e8"; // clothes highlight

interface SaraProps { cx: number; cy: number; expr?: SaraExpr; pose?: SaraPose; frame?: number; scale?: number; }

// ── Eyes ─────────────────────────────────────────────────────────────────────
const Eye: React.FC<{ x: number; y: number; expr: SaraExpr; blink: boolean; flip?: boolean }> = ({ x, y, expr, blink, flip }) => {
  const scaleY = blink ? 0.08 : 1;
  const irisH  = expr === "shocked" ? 17 : expr === "disgusted" ? 10 : 14;
  const lidOff = expr === "disgusted" ? 8 : 0;
  return (
    <g transform={`translate(${x},${y})${flip ? " scale(-1,1)" : ""}`}>
      {/* White */}
      <ellipse cx={0} cy={0} rx={22} ry={18 * scaleY} fill="white" stroke={OC} strokeWidth={SL - 1} style={PO} />
      {/* Iris */}
      <ellipse cx={0} cy={2} rx={13} ry={Math.min(irisH, 18 * scaleY)} fill={HR} />
      <ellipse cx={0} cy={2} rx={9}  ry={Math.min(irisH - 2, 16 * scaleY)} fill="#5a3012" />
      {/* Highlights */}
      {!blink && <circle cx={-5} cy={-3} r={4} fill="white" />}
      {!blink && <circle cx={6}  cy={3}  r={2} fill="white" opacity={0.6} />}
      {/* Top lash line */}
      <path d={`M-22,${-5 + lidOff} C-10,${-14 + lidOff} 10,${-14 + lidOff} 22,${-5 + lidOff}`}
        stroke={OC} strokeWidth={4} fill="none" strokeLinecap="round"/>
      {/* Corner lashes */}
      <path d={`M-21,${-6 + lidOff} L-30,${-16 + lidOff}`} stroke={OC} strokeWidth={2.5} strokeLinecap="round"/>
      <path d={`M 19,${-10 + lidOff} L 27,${-19 + lidOff}`} stroke={OC} strokeWidth={2.5} strokeLinecap="round"/>
    </g>
  );
};

// ── Mouth ─────────────────────────────────────────────────────────────────────
const Mouth: React.FC<{ expr: SaraExpr }> = ({ expr }) => {
  if (expr === "shocked")
    return <ellipse cx={0} cy={58} rx={18} ry={16} fill="#7a2c2c" stroke={OC} strokeWidth={3} style={PO}/>;
  if (expr === "happy")
    return <path d="M-22,52 Q0,72 22,52" stroke="#b06060" fill="#f8baba" strokeWidth={3} style={PO}/>;
  if (expr === "disgusted")
    return <path d="M-18,58 Q-6,50 0,52 Q6,50 18,58 Q6,66 0,64 Q-6,66 -18,58 Z" fill="#a05050" stroke={OC} strokeWidth={2.5} style={PO}/>;
  if (expr === "worried")
    return <path d="M-16,58 Q0,52 16,58" stroke="#a07060" fill="none" strokeWidth={3}/>;
  return <path d="M-16,52 Q0,62 16,52" stroke="#b06060" fill="none" strokeWidth={3}/>;
};

// ── Hair ──────────────────────────────────────────────────────────────────────
const Hair: React.FC<{ layer: "back" | "front"; frame: number }> = ({ layer, frame }) => {
  const bob = Math.sin(frame / 24) * 1.5;
  if (layer === "back")
    return (
      <g transform={`translateY(${bob})`}>
        {/* Back hair mass */}
        <ellipse cx={0} cy={-30} rx={100} ry={125} fill={HR} stroke={OC} strokeWidth={SL} style={PO}/>
        {/* Low ponytail or loose end */}
        <path d="M-80,60 C-100,110 -90,180 -70,200 C-50,220 -40,210 -35,185 C-30,165 -60,140 -80,60 Z"
          fill={HR} stroke={OC} strokeWidth={SL - 1} style={PO}/>
        <path d="M 80,60 C 100,110  90,180  70,200 C 50,220  40,210  35,185 C 30,165  60,140  80,60 Z"
          fill={HR} stroke={OC} strokeWidth={SL - 1} style={PO}/>
        {/* Hair highlight */}
        <path d="M-30,-130 C0,-135 40,-128 60,-110" stroke={HRH} strokeWidth={3} fill="none" strokeLinecap="round"/>
      </g>
    );
  // Front/bangs
  return (
    <g transform={`translateY(${bob})`}>
      <path d={`M-88,-10 C-85,-85 -50,-100 0,-102 C50,-100 85,-85 88,-10
                C60,-44 25,-52 0,-50 C-25,-52 -60,-44 -88,-10 Z`}
        fill={HR} stroke={OC} strokeWidth={SL} style={PO}/>
      {/* Side bang (left) */}
      <path d="M-88,-10 C-96,-30 -92,-52 -86,-52 C-78,-50 -74,-30 -88,-10 Z"
        fill={HR} />
    </g>
  );
};

// ── Blush ─────────────────────────────────────────────────────────────────────
const Blush: React.FC<{ expr: SaraExpr }> = ({ expr }) => {
  if (expr !== "happy" && expr !== "worried") return null;
  return (
    <>
      <ellipse cx={-56} cy={16} rx={16} ry={8} fill="#f0a080" opacity={0.45}/>
      <ellipse cx={ 56} cy={16} rx={16} ry={8} fill="#f0a080" opacity={0.45}/>
    </>
  );
};

// ── Eyebrows ──────────────────────────────────────────────────────────────────
const Brows: React.FC<{ expr: SaraExpr }> = ({ expr }) => {
  const lY = expr === "shocked" ? -68 : expr === "worried" ? -62 : -60;
  const rY = expr === "shocked" ? -68 : expr === "worried" ? -62 : -60;
  const lA = expr === "worried" ? 8 : 0;
  const rA = expr === "worried" ? -8 : 0;
  return (
    <>
      <path d={`M-50,${lY + lA} C-36,${lY - 7 + lA} -20,${lY - 7} -18,${lY}`}
        stroke={HR} strokeWidth={5} fill="none" strokeLinecap="round"/>
      <path d={`M 18,${rY} C  20,${rY - 7} 36,${rY - 7 + rA}  50,${rY + rA}`}
        stroke={HR} strokeWidth={5} fill="none" strokeLinecap="round"/>
    </>
  );
};

// ── Arms / Poses ──────────────────────────────────────────────────────────────
const Arms: React.FC<{ pose: SaraPose; frame: number }> = ({ pose, frame }) => {
  const sw = SL + 1;
  const hand = (cx: number, cy: number) =>
    <circle cx={cx} cy={cy} r={22} fill={SK} stroke={OC} strokeWidth={sw} style={PO}/>;

  if (pose === "washDishes") {
    // Both arms forward/down over sink
    const sway = Math.sin(frame / 8) * 5;
    return (
      <>
        <path d={`M-105,160 C-120,220 -110,310 -90,${360 + sway}`}
          stroke={CL} fill="none" strokeWidth={62} strokeLinecap="round" style={PO}/>
        <path d={`M-105,160 C-120,220 -110,310 -90,${360 + sway}`}
          stroke={OC} fill="none" strokeWidth={66} strokeLinecap="round"/>
        {hand(-90, 376 + sway)}
        <path d={`M 105,160 C 120,220  110,310  90,${360 - sway}`}
          stroke={CL} fill="none" strokeWidth={62} strokeLinecap="round" style={PO}/>
        <path d={`M 105,160 C 120,220  110,310  90,${360 - sway}`}
          stroke={OC} fill="none" strokeWidth={66} strokeLinecap="round"/>
        {hand(90, 376 - sway)}
      </>
    );
  }
  if (pose === "holdSponge") {
    // Right arm raised, holding sponge
    return (
      <>
        {/* Left arm natural */}
        <path d="M-105,160 C-118,230 -115,310 -108,370"
          stroke={CL} fill="none" strokeWidth={62} strokeLinecap="round" style={PO}/>
        <path d="M-105,160 C-118,230 -115,310 -108,370"
          stroke={OC} fill="none" strokeWidth={66} strokeLinecap="round"/>
        {hand(-108, 386)}
        {/* Right arm raised */}
        <path d="M 105,160 C 128,110 140,60 130,20"
          stroke={CL} fill="none" strokeWidth={62} strokeLinecap="round" style={PO}/>
        <path d="M 105,160 C 128,110 140,60 130,20"
          stroke={OC} fill="none" strokeWidth={66} strokeLinecap="round"/>
        {hand(130, 10)}
      </>
    );
  }
  if (pose === "smellSponge") {
    // Right arm raised holding sponge near face
    return (
      <>
        <path d="M-105,160 C-118,230 -115,310 -108,370"
          stroke={CL} fill="none" strokeWidth={62} strokeLinecap="round" style={PO}/>
        <path d="M-105,160 C-118,230 -115,310 -108,370"
          stroke={OC} fill="none" strokeWidth={66} strokeLinecap="round"/>
        {hand(-108, 386)}
        {/* Right arm up, sponge near face */}
        <path d="M 105,160 C 130,100 140,50 115,-30"
          stroke={CL} fill="none" strokeWidth={62} strokeLinecap="round" style={PO}/>
        <path d="M 105,160 C 130,100 140,50 115,-30"
          stroke={OC} fill="none" strokeWidth={66} strokeLinecap="round"/>
        {hand(115, -42)}
      </>
    );
  }
  if (pose === "react") {
    // Both arms up, shocked
    return (
      <>
        <path d="M-105,160 C-130,100 -140,50 -125,-20"
          stroke={CL} fill="none" strokeWidth={62} strokeLinecap="round" style={PO}/>
        <path d="M-105,160 C-130,100 -140,50 -125,-20"
          stroke={OC} fill="none" strokeWidth={66} strokeLinecap="round"/>
        {hand(-125, -32)}
        <path d="M 105,160 C 130,100  140,50  125,-20"
          stroke={CL} fill="none" strokeWidth={62} strokeLinecap="round" style={PO}/>
        <path d="M 105,160 C 130,100  140,50  125,-20"
          stroke={OC} fill="none" strokeWidth={66} strokeLinecap="round"/>
        {hand(125, -32)}
      </>
    );
  }
  // stand - arms hanging
  return (
    <>
      <path d="M-105,160 C-120,250 -118,340 -112,400"
        stroke={CL} fill="none" strokeWidth={62} strokeLinecap="round" style={PO}/>
      <path d="M-105,160 C-120,250 -118,340 -112,400"
        stroke={OC} fill="none" strokeWidth={66} strokeLinecap="round"/>
      {hand(-112, 414)}
      <path d="M 105,160 C 120,250  118,340  112,400"
        stroke={CL} fill="none" strokeWidth={62} strokeLinecap="round" style={PO}/>
      <path d="M 105,160 C 120,250  118,340  112,400"
        stroke={OC} fill="none" strokeWidth={66} strokeLinecap="round"/>
      {hand(112, 414)}
    </>
  );
};

// ── Main character ────────────────────────────────────────────────────────────
export const Sara: React.FC<SaraProps> = ({
  cx, cy, expr = "normal", pose = "stand", frame = 0, scale = 1,
}) => {
  const breath = Math.sin(frame / 28) * 2.5;
  const blink  = frame % 110 < 5;

  return (
    <g transform={`translate(${cx},${cy}) scale(${scale})`}>
      <g transform={`translate(0,${breath})`}>
        {/* ── BODY (behind face) ── */}
        {/* Neck */}
        <rect x={-24} y={94} width={48} height={50} rx={10}
          fill={SK} stroke={OC} strokeWidth={SL} style={PO}/>
        {/* Neck shadow */}
        <rect x={8} y={100} width={12} height={40} rx={6} fill={SKS} opacity={0.4}/>

        {/* Abaya body */}
        <path d="M-115,148 C-90,138 90,138 115,148 L130,660 L-130,660 Z"
          fill={CL} stroke={OC} strokeWidth={SL} style={PO}/>
        {/* Collar */}
        <path d="M-32,142 L0,160 L32,142" fill={CL} stroke={OC} strokeWidth={4} style={PO}/>
        {/* Clothes shading */}
        <path d="M20,160 L30,660" stroke={CLS} strokeWidth={4} fill="none" opacity={0.5}/>
        <path d="M-15,160 L-22,660" stroke={CLS} strokeWidth={3} fill="none" opacity={0.4}/>
        {/* Clothes highlight */}
        <path d="M-80,155 L-90,420" stroke={CLH} strokeWidth={4} fill="none" opacity={0.4}/>

        {/* Arms (behind body) */}
        <Arms pose={pose} frame={frame} />

        {/* ── HAIR BACK ── */}
        <Hair layer="back" frame={frame}/>

        {/* ── FACE ── */}
        {/* Face shape */}
        <path d="M0,-96 C52,-96 88,-74 88,-16 C88,52 64,90 0,90 C-64,90 -88,52 -88,-16 C-88,-74 -52,-96 0,-96 Z"
          fill={SK} stroke={OC} strokeWidth={SL} style={PO}/>
        {/* Cheek shadow */}
        <ellipse cx={-66} cy={18} rx={18} ry={28} fill={SKS} opacity={0.25}/>
        <ellipse cx={ 66} cy={18} rx={18} ry={28} fill={SKS} opacity={0.25}/>

        {/* Ear left */}
        <ellipse cx={-90} cy={6} rx={12} ry={16} fill={SK} stroke={OC} strokeWidth={SL - 1} style={PO}/>
        {/* Ear right */}
        <ellipse cx={ 90} cy={6} rx={12} ry={16} fill={SK} stroke={OC} strokeWidth={SL - 1} style={PO}/>

        {/* Eyebrows */}
        <Brows expr={expr}/>

        {/* Eyes */}
        <Eye x={-48} y={-24} expr={expr} blink={blink}/>
        <Eye x={ 48} y={-24} expr={expr} blink={blink} flip/>

        {/* Nose */}
        <ellipse cx={-6} cy={18} rx={4} ry={3} fill={SKS} opacity={0.7}/>
        <ellipse cx={ 6} cy={18} rx={4} ry={3} fill={SKS} opacity={0.7}/>

        {/* Mouth */}
        <Mouth expr={expr}/>

        {/* Blush */}
        <Blush expr={expr}/>

        {/* ── HAIR FRONT (bangs, over face) ── */}
        <Hair layer="front" frame={frame}/>
      </g>
    </g>
  );
};
