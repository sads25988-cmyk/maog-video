import React from "react";
import { OC, PO, SL } from "../AnimeCanvas";

export type BacteriumType = "elder" | "teen" | "mama";

interface BacteriumProps {
  x: number; y: number;
  type: BacteriumType;
  frame: number;
  panic?: number; // 0..1 — when 1 they're fleeing
  scale?: number;
}

// ── Elder "بختاوي" — fat green blob in mini thobe ──────────────────────────
const Elder: React.FC<{ f: number; panic: number }> = ({ f, panic }) => {
  const bob  = Math.sin(f / 20) * 3;
  const runX = panic * 300;
  const runY = panic * -80;
  const rot  = panic * -25;

  return (
    <g transform={`translate(${runX},${runY + bob}) rotate(${rot})`}>
      {/* Body blob */}
      <path d="M0,-70 C52,-70 80,-44 80,8 C80,62 54,90 0,90 C-54,90 -80,62 -80,8 C-80,-44 -52,-70 0,-70 Z"
        fill="#5cb85c" stroke={OC} strokeWidth={SL} style={PO}/>
      {/* Thobe texture */}
      <path d="M-50,20 C-30,-5 30,-5 50,20 L50,88 L-50,88 Z"
        fill="#e8f4e8" stroke={OC} strokeWidth={3} style={PO}/>
      <path d="M-5,-10 L5,-10 L5,88 L-5,88 Z" fill="#c8e8c8" opacity={0.6}/>
      {/* Eyes */}
      <circle cx={-22} cy={-10} r={14} fill="white" stroke={OC} strokeWidth={3} style={PO}/>
      <circle cx={ 22} cy={-10} r={14} fill="white" stroke={OC} strokeWidth={3} style={PO}/>
      {panic > 0.3 ? (
        <>
          <circle cx={-22} cy={-10} r={9}  fill="#1a1a1a"/>
          <circle cx={ 22} cy={-10} r={9}  fill="#1a1a1a"/>
        </>
      ) : (
        <>
          <circle cx={-22} cy={-10} r={7}  fill="#1a1a1a"/>
          <circle cx={ 22} cy={-10} r={7}  fill="#1a1a1a"/>
        </>
      )}
      <circle cx={-25} cy={-13} r={3} fill="white"/>
      <circle cx={ 19} cy={-13} r={3} fill="white"/>
      {/* Mouth */}
      {panic > 0.3
        ? <path d="M-18,30 L-10,22 L0,30 L10,22 L18,30" stroke={OC} fill="none" strokeWidth={3}/>
        : <path d="M-18,26 Q0,38 18,26" stroke={OC} fill="none" strokeWidth={3}/>}
      {/* Coffee cup */}
      {panic < 0.2 && (
        <g transform="translate(-60,40)">
          <rect x={-10} y={0} width={20} height={16} rx={3} fill="#c8a060" stroke={OC} strokeWidth={2} style={PO}/>
          <path d="M10,4 Q20,8 10,12" fill="none" stroke={OC} strokeWidth={2}/>
          <path d="M-6,-4 Q0,-12 6,-4" fill="none" stroke="#888" strokeWidth={1.5} opacity={0.6}/>
        </g>
      )}
    </g>
  );
};

// ── Teen "نوفة" — purple blob with phone ─────────────────────────────────────
const Teen: React.FC<{ f: number; panic: number }> = ({ f, panic }) => {
  const bob  = Math.sin(f / 16) * 4;
  const runX = panic * -260;
  const rot  = panic * 20;
  const tilt = Math.sin(f / 12) * (panic > 0.3 ? 0 : 8); // phone-tilt when calm

  return (
    <g transform={`translate(${runX},${bob}) rotate(${rot})`}>
      {/* Body blob */}
      <path d="M0,-55 C40,-55 65,-34 65,10 C65,52 42,72 0,72 C-42,72 -65,52 -65,10 C-65,-34 -40,-55 0,-55 Z"
        fill="#9b59b6" stroke={OC} strokeWidth={SL} style={PO}/>
      {/* Hoodie style */}
      <path d="M-40,20 C-20,8 20,8 40,20 L40,70 L-40,70 Z"
        fill="#c39bd3" stroke={OC} strokeWidth={2.5} style={PO}/>
      {/* Eyes */}
      <circle cx={-18} cy={-6} r={11} fill="white" stroke={OC} strokeWidth={2.5} style={PO}/>
      <circle cx={ 18} cy={-6} r={11} fill="white" stroke={OC} strokeWidth={2.5} style={PO}/>
      {panic > 0.3 ? (
        <>
          <circle cx={-18} cy={-6} r={8}  fill="#1a1a1a"/>
          <circle cx={ 18} cy={-6} r={8}  fill="#1a1a1a"/>
        </>
      ) : (
        <>
          {/* Half-closed, bored eyes */}
          <circle cx={-18} cy={-4} r={6}  fill="#1a1a1a"/>
          <circle cx={ 18} cy={-4} r={6}  fill="#1a1a1a"/>
          <path d="M-30,-10 L-6,-10" stroke={OC} strokeWidth={4} fill="none"/>
          <path d="M  6,-10 L 30,-10" stroke={OC} strokeWidth={4} fill="none"/>
        </>
      )}
      <circle cx={-20} cy={-9} r={2.5} fill="white"/>
      <circle cx={ 16} cy={-9} r={2.5} fill="white"/>
      {panic > 0.3
        ? <ellipse cx={0} cy={28} rx={12} ry={10} fill="#2a1a0a"/>
        : <path d="M-10,24 Q0,32 10,24" stroke={OC} fill="none" strokeWidth={2.5}/>}
      {/* Phone */}
      {panic < 0.3 && (
        <g transform={`translate(52,10) rotate(${tilt})`}>
          <rect x={-8} y={-16} width={16} height={28} rx={3} fill="#1a1a1a" stroke={OC} strokeWidth={2} style={PO}/>
          <rect x={-6} y={-14} width={12} height={22} rx={1.5} fill="#4fc3f7" opacity={0.9}/>
          {/* Screen glow */}
          <rect x={-5} y={-13} width={10} height={6} rx={1} fill="#fff" opacity={0.5}/>
        </g>
      )}
      {/* Panic — dropped phone */}
      {panic > 0.4 && (
        <g transform={`translate(80,100) rotate(45)`}>
          <rect x={-6} y={-12} width={12} height={22} rx={2} fill="#1a1a1a" opacity={0.6}/>
        </g>
      )}
    </g>
  );
};

// ── Mama "أم حارث" — pink blob cooking ────────────────────────────────────────
const Mama: React.FC<{ f: number; panic: number }> = ({ f, panic }) => {
  const bob  = Math.sin(f / 22) * 2.5;
  const runX = panic * -200;
  const runY = panic * -60;
  const rot  = panic * 30;
  const stir = Math.sin(f / 10) * (panic > 0.2 ? 0 : 15);

  return (
    <g transform={`translate(${runX},${runY + bob}) rotate(${rot})`}>
      {/* Body */}
      <path d="M0,-60 C44,-60 70,-38 70,12 C70,56 46,78 0,78 C-46,78 -70,56 -70,12 C-70,-38 -44,-60 0,-60 Z"
        fill="#e91e8c" stroke={OC} strokeWidth={SL} style={PO}/>
      {/* Apron */}
      <path d="M-36,16 C-18,4 18,4 36,16 L36,76 L-36,76 Z"
        fill="#f8d0d0" stroke={OC} strokeWidth={2.5} style={PO}/>
      {/* Headscarf hint */}
      <path d="M-40,-30 C-20,-58 20,-58 40,-30 L35,-20 L-35,-20 Z"
        fill="#c0164e" stroke={OC} strokeWidth={3} style={PO}/>
      {/* Eyes */}
      <circle cx={-18} cy={-8} r={12} fill="white" stroke={OC} strokeWidth={2.5} style={PO}/>
      <circle cx={ 18} cy={-8} r={12} fill="white" stroke={OC} strokeWidth={2.5} style={PO}/>
      {panic > 0.3 ? (
        <>
          <circle cx={-18} cy={-8} r={9} fill="#1a1a1a"/>
          <circle cx={ 18} cy={-8} r={9} fill="#1a1a1a"/>
        </>
      ) : (
        <>
          <circle cx={-18} cy={-8} r={7} fill="#1a1a1a"/>
          <circle cx={ 18} cy={-8} r={7} fill="#1a1a1a"/>
        </>
      )}
      <circle cx={-20} cy={-11} r={3} fill="white"/>
      <circle cx={ 16} cy={-11} r={3} fill="white"/>
      {panic > 0.3
        ? <ellipse cx={0} cy={26} rx={14} ry={12} fill="#2a1a0a"/>
        : <path d="M-14,22 Q0,30 14,22" stroke={OC} fill="none" strokeWidth={2.5}/>}
      {/* Mini cooking pot */}
      {panic < 0.3 && (
        <g transform="translate(55,25)">
          <ellipse cx={0} cy={-4} rx={18} ry={5} fill="#888" stroke={OC} strokeWidth={2} style={PO}/>
          <path d="M-18,-2 L-18,20 Q0,28 18,20 L18,-2 Z" fill="#666" stroke={OC} strokeWidth={2} style={PO}/>
          {/* Steam */}
          <path d={`M-6,${-10 + Math.sin(f/8)*3} Q-10,${-20+Math.sin(f/8)*3} -6,-28`}
            stroke="#ccc" fill="none" strokeWidth={2} opacity={0.7}/>
          {/* Spoon */}
          <g transform={`rotate(${stir},0,10)`}>
            <path d="M0,-6 L0,20" stroke={OC} strokeWidth={3} strokeLinecap="round"/>
            <ellipse cx={0} cy={-10} rx={5} ry={6} fill={OC}/>
          </g>
        </g>
      )}
      {/* Panic — pot spilled */}
      {panic > 0.4 && (
        <g transform="translate(90,80) rotate(-20)">
          <path d="M-16,-2 L-16,16 Q0,22 16,16 L16,-2 Z" fill="#666" opacity={0.5}/>
          <path d="M-16,-2 Q0,-10 16,-2" fill="#888" opacity={0.5}/>
        </g>
      )}
    </g>
  );
};

// ── Main export ───────────────────────────────────────────────────────────────
export const Bacterium: React.FC<BacteriumProps> = ({
  x, y, type, frame: f, panic = 0, scale = 1,
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    {type === "elder" && <Elder f={f} panic={panic}/>}
    {type === "teen"  && <Teen  f={f} panic={panic}/>}
    {type === "mama"  && <Mama  f={f} panic={panic}/>}
  </g>
);
