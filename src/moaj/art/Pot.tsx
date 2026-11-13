import React from "react";
import { C, SW } from "../theme";

const O = C.ink;

// deterministic pseudo-random
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const blobPath = (cx: number, cy: number, rx: number, ry: number, seed: number, n = 22, jag = 0.12) => {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 - jag + rand(seed + i) * jag * 2;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  // smooth closed path via midpoints
  let d = "";
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % n];
    const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    if (i === 0) {
      const prev = pts[n - 1];
      d += `M${(prev[0] + p[0]) / 2} ${(prev[1] + p[1]) / 2} `;
    }
    d += `Q${p[0]} ${p[1]} ${m[0]} ${m[1]} `;
  }
  return d + "Z";
};

export const Sparkle: React.FC<{ x: number; y: number; s?: number; color?: string; rot?: number }> = ({
  x,
  y,
  s = 1,
  color = C.white,
  rot = 0,
}) => (
  <path
    transform={`translate(${x} ${y}) scale(${s}) rotate(${rot})`}
    d="M0 -40 Q6 -6 40 0 Q6 6 0 40 Q-6 6 -40 0 Q-6 -6 0 -40 Z"
    fill={color}
    stroke={O}
    strokeWidth={5 / s}
    strokeLinejoin="round"
  />
);

export const Steam: React.FC<{ x: number; y: number; s?: number; phase?: number }> = ({ x, y, s = 1, phase = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeLinecap="round">
    {[-120, 0, 120].map((dx, i) => {
      const off = Math.sin(phase + i * 2) * 16;
      const d = `M${dx} 0 C${dx - 50 + off} -70 ${dx + 50 - off} -130 ${dx + off} -200 C${dx - 40} -250 ${dx + 30} -300 ${dx - 10} -350`;
      return (
        <g key={i}>
          <path d={d} stroke={O} strokeWidth={40} opacity={0.18} />
          <path d={d} stroke={C.white} strokeWidth={26} opacity={0.9} />
        </g>
      );
    })}
  </g>
);

/** Side view. Origin = rim centre. Width ≈ 560, height ≈ 340. */
export const PotSide: React.FC<{
  x: number;
  y: number;
  s?: number;
  lid?: boolean;
  steam?: boolean;
  steamPhase?: number;
  soot?: boolean;
  shiny?: boolean;
  rot?: number;
}> = ({ x, y, s = 1, lid, steam, steamPhase = 0, soot, shiny, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {steam && <Steam x={0} y={-30} phase={steamPhase} />}
    {/* handles */}
    {[-1, 1].map((sd) => (
      <path
        key={sd}
        d={`M${sd * 250} 40 Q${sd * 330} 30 ${sd * 330} 80 Q${sd * 330} 120 ${sd * 250} 110`}
        fill="none"
        stroke={O}
        strokeWidth={34}
        strokeLinecap="round"
      />
    ))}
    {[-1, 1].map((sd) => (
      <path
        key={sd}
        d={`M${sd * 250} 40 Q${sd * 330} 30 ${sd * 330} 80 Q${sd * 330} 120 ${sd * 250} 110`}
        fill="none"
        stroke={C.aluShade}
        strokeWidth={16}
        strokeLinecap="round"
      />
    ))}
    {/* body */}
    <path
      d="M-270 0 L-250 280 Q-246 330 -190 334 L190 334 Q246 330 250 280 L270 0 Z"
      fill={C.alu}
      stroke={O}
      strokeWidth={SW}
      strokeLinejoin="round"
    />
    <path d="M-200 30 L-188 300" stroke={C.aluLight} strokeWidth={30} strokeLinecap="round" />
    <path d="M-140 30 L-134 300" stroke={C.aluLight} strokeWidth={10} strokeLinecap="round" />
    <path d="M200 30 L190 300" stroke={C.aluShade} strokeWidth={34} strokeLinecap="round" />
    {soot && (
      <path
        d={`M-252 250 Q-180 210 -100 240 Q0 200 100 236 Q180 206 252 250 L250 280 Q246 330 190 334 L-190 334 Q-246 330 -250 280 Z`}
        fill={C.burnt}
        stroke={O}
        strokeWidth={SW}
      />
    )}
    {/* rim */}
    <ellipse cx={0} cy={0} rx={286} ry={42} fill={C.aluLight} stroke={O} strokeWidth={SW} />
    {lid ? (
      <g>
        <path d="M-262 0 Q-240 -120 0 -126 Q240 -120 262 0 Z" fill={C.alu} stroke={O} strokeWidth={SW} />
        <path d="M-180 -40 Q-120 -100 -20 -108" fill="none" stroke={C.aluLight} strokeWidth={16} strokeLinecap="round" />
        <rect x={-50} y={-166} width={100} height={44} rx={20} fill={C.woodDark} stroke={O} strokeWidth={SW} />
      </g>
    ) : (
      <ellipse cx={0} cy={2} rx={256} ry={28} fill="#5B636D" stroke={O} strokeWidth={6} />
    )}
    {shiny && (
      <g>
        <Sparkle x={-190} y={150} s={1.1} />
        <Sparkle x={120} y={90} s={0.7} />
        <Sparkle x={210} y={-70} s={0.9} />
      </g>
    )}
  </g>
);

type OpenProps = {
  x: number;
  y: number;
  r?: number;
  burnt?: boolean;
  /** x (pot-local) of the cleaning wave front; area with x > split is clean. */
  split?: number | null;
  clean?: boolean;
  id: string;
  shine?: boolean;
  children?: React.ReactNode; // drawn above the bottom (pot-local)
};

/** Looking into the pot (close-up). Origin = centre of opening. */
export const PotOpen: React.FC<OpenProps> = ({ x, y, r = 360, burnt = true, split = null, clean, id, shine, children }) => {
  const ry = r * 0.9;
  const ir = r - 34;
  const iry = ry - 34;
  const br = r * 0.74;
  const bry = ry * 0.7;
  const by = 36;
  const crust = blobPath(0, by, br * 0.98, bry * 0.98, 7, 26, 0.08);
  const crustInner = [
    blobPath(-90, by - 40, 90, 60, 21),
    blobPath(110, by + 50, 110, 70, 33),
    blobPath(-40, by + 110, 70, 40, 45),
    blobPath(150, by - 90, 60, 40, 57),
    blobPath(-170, by + 60, 60, 46, 69),
  ];
  const grains = Array.from({ length: 26 }).map((_, i) => {
    const a = rand(i + 100) * Math.PI * 2;
    const rr = Math.sqrt(rand(i + 200)) * 0.85;
    return {
      cx: Math.cos(a) * br * rr,
      cy: by + Math.sin(a) * bry * rr,
      rot: rand(i + 300) * 180,
    };
  });
  const wave =
    split === null
      ? ""
      : `M${split} ${-ry - 40} ` +
        Array.from({ length: 8 })
          .map((_, i) => {
            const y0 = -ry - 40 + ((i + 1) * (2 * ry + 80)) / 8;
            const ym = y0 - (2 * ry + 80) / 16;
            return `Q${split + (i % 2 === 0 ? 60 : -60)} ${ym} ${split} ${y0}`;
          })
          .join(" ");
  const showCrust = burnt && !clean;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={`${id}-inner`}>
          <ellipse cx={0} cy={0} rx={ir} ry={iry} />
        </clipPath>
        {split !== null && (
          <clipPath id={`${id}-dirty`}>
            <path d={`${wave} L${-r - 100} ${ry + 40} L${-r - 100} ${-ry - 40} Z`} />
          </clipPath>
        )}
        <radialGradient id={`${id}-wall`} cx="45%" cy="40%" r="70%">
          <stop offset="0%" stopColor={C.aluLight} />
          <stop offset="70%" stopColor={C.alu} />
          <stop offset="100%" stopColor={C.aluDark} />
        </radialGradient>
      </defs>
      {/* side handles */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <rect
            x={sd === -1 ? -r - 80 : r - 10}
            y={-40}
            width={90}
            height={80}
            rx={34}
            fill={C.aluShade}
            stroke={O}
            strokeWidth={SW}
          />
        </g>
      ))}
      {/* rim */}
      <ellipse cx={0} cy={0} rx={r} ry={ry} fill={C.aluLight} stroke={O} strokeWidth={SW} />
      <ellipse cx={0} cy={0} rx={ir} ry={iry} fill={`url(#${id}-wall)`} stroke={O} strokeWidth={7} />
      <g clipPath={`url(#${id}-inner)`}>
        {/* bottom disc */}
        <ellipse cx={0} cy={by} rx={br} ry={bry} fill={C.alu} stroke={C.aluShade} strokeWidth={8} />
        {/* clean shine */}
        <path d={`M${-br * 0.6} ${by - bry * 0.3} Q${-br * 0.2} ${by - bry * 0.75} ${br * 0.35} ${by - bry * 0.62}`} fill="none" stroke={C.white} strokeWidth={26} strokeLinecap="round" opacity={0.9} />
        <path d={`M${-br * 0.4} ${by + bry * 0.4} Q${0} ${by + bry * 0.6} ${br * 0.4} ${by + bry * 0.35}`} fill="none" stroke={C.white} strokeWidth={12} strokeLinecap="round" opacity={0.7} />
        {showCrust && (
          <g clipPath={split !== null ? `url(#${id}-dirty)` : undefined}>
            <path d={crust} fill={C.burnt} stroke={O} strokeWidth={7} />
            {crustInner.map((d, i) => (
              <path key={i} d={d} fill={i % 2 ? "#120B08" : "#2B1E17"} />
            ))}
            {/* char cracks + greasy glints */}
            <path
              d={`M${-br * 0.7} ${by - 10} l60 -20 l40 30 l70 -24 M${br * 0.1} ${by - bry * 0.6} l20 50 l-30 40 l26 46 M${br * 0.2} ${by + bry * 0.3} l70 10 l40 -30 l60 16`}
              fill="none"
              stroke="#4E3B2F"
              strokeWidth={6}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {[
              [-0.45, -0.35, 40],
              [0.35, 0.05, 30],
              [-0.1, 0.55, 24],
            ].map(([fx, fy, l], i) => (
              <path
                key={i}
                d={`M${br * fx} ${by + bry * fy} q${l / 2} -10 ${l} 0`}
                fill="none"
                stroke="#6A5A50"
                strokeWidth={8}
                strokeLinecap="round"
              />
            ))}
            {grains.map((g, i) => (
              <ellipse
                key={i}
                cx={g.cx}
                cy={g.cy}
                rx={13}
                ry={6}
                fill={i % 3 === 0 ? "#5A3F2C" : "#38271C"}
                transform={`rotate(${g.rot} ${g.cx} ${g.cy})`}
              />
            ))}
          </g>
        )}
        {split !== null && showCrust && (
          <g>
            <path d={wave} fill="none" stroke={C.white} strokeWidth={58} strokeLinecap="round" />
            <path d={wave} fill="none" stroke={C.blue} strokeWidth={36} strokeLinecap="round" />
            <path d={wave} fill="none" stroke={C.blueLight} strokeWidth={12} strokeLinecap="round" transform="translate(10 0)" />
            {[-200, -90, 30, 150, 240].map((yy, i) => (
              <circle key={i} cx={split + 40 + (i % 2) * 20} cy={yy} r={14 + (i % 3) * 6} fill={C.white} stroke={C.blue} strokeWidth={6} />
            ))}
          </g>
        )}
        {children}
      </g>
      {shine && (
        <g>
          <Sparkle x={-ir * 0.45} y={-iry * 0.35} s={1.3} />
          <Sparkle x={ir * 0.5} y={iry * 0.25} s={0.9} />
          <Sparkle x={ir * 0.1} y={iry * 0.55} s={0.6} />
          <Sparkle x={r * 0.85} y={-ry * 0.7} s={1.1} color={C.goldLight} />
        </g>
      )}
    </g>
  );
};
