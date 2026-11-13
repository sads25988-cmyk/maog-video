import React from "react";
import { C, SW } from "../theme";
import { rand, Sparkle } from "./Pot";

const O = C.ink;

/** Kabsa on a round serving tray. Origin = tray centre. */
export const Kabsa: React.FC<{ x: number; y: number; s?: number; sparkle?: boolean }> = ({ x, y, s = 1, sparkle }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* tray */}
    <ellipse cx={0} cy={30} rx={330} ry={92} fill={C.copper} stroke={O} strokeWidth={SW} />
    <ellipse cx={0} cy={16} rx={300} ry={74} fill={C.copperLight} stroke={O} strokeWidth={6} />
    {/* rice dome (shaped like the pot it came out of) */}
    <path
      d="M-250 20 Q-260 -120 -200 -190 Q-100 -250 0 -252 Q100 -250 200 -190 Q260 -120 250 20 Q0 60 -250 20 Z"
      fill={C.rice}
      stroke={O}
      strokeWidth={SW}
      strokeLinejoin="round"
    />
    <path d="M-200 -150 Q-120 -215 -20 -222" fill="none" stroke={C.riceLight} strokeWidth={24} strokeLinecap="round" />
    {Array.from({ length: 40 }).map((_, i) => {
      const gx = -210 + rand(i + 1) * 420;
      const gy = -200 + rand(i + 50) * 200;
      return (
        <ellipse
          key={i}
          cx={gx}
          cy={gy}
          rx={9}
          ry={4}
          fill={i % 4 === 0 ? C.riceLight : "#D3913F"}
          transform={`rotate(${rand(i + 9) * 180} ${gx} ${gy})`}
        />
      );
    })}
    {/* chicken pieces */}
    {[
      [-80, -250, -20],
      [70, -258, 18],
    ].map(([cx, cy, r], i) => (
      <g key={i} transform={`translate(${cx} ${cy}) rotate(${r})`}>
        <path d="M-80 10 Q-90 -60 -10 -70 Q70 -72 82 -10 Q86 30 0 34 Q-60 36 -80 10 Z" fill={C.chicken} stroke={O} strokeWidth={SW} />
        <path d="M-50 -30 Q-10 -56 40 -44" fill="none" stroke={C.chickenLight} strokeWidth={14} strokeLinecap="round" />
      </g>
    ))}
    {/* toppings */}
    {[
      [-150, -120],
      [-40, -150],
      [140, -110],
      [30, -90],
      [-120, -40],
      [170, -30],
    ].map(([cx, cy], i) => (
      <ellipse key={i} cx={cx} cy={cy} rx={16} ry={9} fill={C.almond} stroke={O} strokeWidth={4} transform={`rotate(${i * 30} ${cx} ${cy})`} />
    ))}
    {[
      [-90, -90],
      [90, -150],
      [0, -40],
      [-180, -70],
      [120, -60],
      [-20, -190],
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r={9} fill={C.raisin} stroke={O} strokeWidth={3} />
    ))}
    {sparkle && (
      <g>
        <Sparkle x={-280} y={-200} s={1.2} color={C.white} />
        <Sparkle x={270} y={-260} s={0.9} color={C.white} />
        <Sparkle x={200} y={-60} s={0.6} color={C.white} />
        <Sparkle x={-30} y={-330} s={0.8} color={C.white} />
      </g>
    )}
  </g>
);

/** Cheap old sponge. size = 1 (new) … 0.3 (worn); half = only one torn half. Origin = centre. */
export const OldSponge: React.FC<{ s?: number; half?: "left" | "right"; rot?: number }> = ({ s = 1, half, rot = 0 }) => {
  const w = 210;
  const h = 130;
  const tornEdge = "L18 -70 L-6 -40 L14 -10 L-10 22 L12 52 L-4 70";
  const body =
    half === "left"
      ? `M${-w / 2} ${-h / 2 + 30} Q${-w / 2} ${-h / 2} ${-w / 2 + 26} ${-h / 2} L10 -65 ${tornEdge} L${-w / 2 + 20} ${h / 2} Q${-w / 2} ${h / 2} ${-w / 2} ${h / 2 - 24} Z`
      : half === "right"
        ? `M${w / 2} ${-h / 2 + 30} Q${w / 2} ${-h / 2} ${w / 2 - 26} ${-h / 2} L10 -65 ${tornEdge} L${w / 2 - 20} ${h / 2} Q${w / 2} ${h / 2} ${w / 2} ${h / 2 - 24} Z`
        : `M${-w / 2 + 20} ${-h / 2} L${w / 2 - 20} ${-h / 2} Q${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + 22} L${w / 2 - 6} ${h / 2 - 20} Q${w / 2 - 8} ${h / 2} ${w / 2 - 30} ${h / 2} L${-w / 2 + 26} ${h / 2} Q${-w / 2 + 4} ${h / 2} ${-w / 2 + 6} ${h / 2 - 22} L${-w / 2} ${-h / 2 + 22} Q${-w / 2} ${-h / 2} ${-w / 2 + 20} ${-h / 2} Z`;
  const holes = Array.from({ length: 14 }).map((_, i) => [
    -w / 2 + 20 + rand(i + 3) * (w - 40),
    -h / 2 + 40 + rand(i + 33) * (h - 60),
    4 + rand(i + 66) * 6,
  ]);
  const clipId = `os-${half ?? "full"}`;
  return (
    <g transform={`rotate(${rot}) scale(${s})`}>
      <defs>
        <clipPath id={clipId}>
          <path d={body} />
        </clipPath>
      </defs>
      <path d={body} fill={C.oldSponge} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <g clipPath={`url(#${clipId})`}>
        <rect x={-w / 2 - 10} y={-h / 2 - 10} width={w + 20} height={42} fill={C.oldScour} />
        <path d={`M${-w / 2} ${-h / 2 + 32} L${w / 2} ${-h / 2 + 32}`} stroke={O} strokeWidth={6} />
        {holes.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={C.oldSpongeShade} />
        ))}
        <rect x={-w / 2 - 10} y={h / 2 - 26} width={w + 20} height={40} fill={C.oldSpongeShade} opacity={0.6} />
      </g>
    </g>
  );
};

/** Crumbs flying off the old sponge. */
export const Crumbs: React.FC<{ x: number; y: number; n?: number; seed?: number }> = ({ x, y, n = 9, seed = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: n }).map((_, i) => {
      const a = rand(seed + i) * Math.PI * 2;
      const d = 60 + rand(seed + i + 40) * 120;
      const cx = Math.cos(a) * d;
      const cy = Math.sin(a) * d * 0.7;
      const r = 8 + rand(seed + i + 80) * 10;
      return (
        <rect
          key={i}
          x={cx - r}
          y={cy - r}
          width={r * 2}
          height={r * 1.6}
          rx={4}
          fill={i % 3 === 0 ? C.oldScour : C.oldSponge}
          stroke={O}
          strokeWidth={4}
          transform={`rotate(${rand(seed + i + 9) * 90} ${cx} ${cy})`}
        />
      );
    })}
  </g>
);

/** MOAJ sponge: blue foam block + wave-cut Italian wire scourer layer with gold glitter. Origin = centre. */
export const MoajSponge: React.FC<{ s?: number; rot?: number; glow?: boolean }> = ({ s = 1, rot = 0, glow }) => {
  const w = 300;
  const top = -100;
  const bot = 92;
  const seam = -22; // wave seam between wire layer and foam
  const wave = `M${-w / 2} ${seam} Q${-w * 0.375} ${seam - 26} ${-w / 4} ${seam} T0 ${seam} T${w / 4} ${seam} T${w / 2} ${seam}`;
  const glitter = Array.from({ length: 30 }).map((_, i) => ({
    x: -w / 2 + 22 + rand(i + 900) * (w - 44),
    y: top + 16 + rand(i + 950) * (seam - top - 34),
    r: 3.5 + rand(i + 990) * 4.5,
  }));
  return (
    <g transform={`rotate(${rot}) scale(${s})`}>
      <defs>
        <pattern id="wireMesh" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
          <rect width="20" height="20" fill={C.wire} />
          <path d="M0 5 Q5 0 10 5 T20 5 M0 15 Q5 10 10 15 T20 15" fill="none" stroke={C.wireShade} strokeWidth="3" />
          <path d="M0 8 Q5 3 10 8 T20 8" fill="none" stroke={C.white} strokeWidth="2" />
        </pattern>
        <linearGradient id="moajFoam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.blueLight} />
          <stop offset="60%" stopColor={C.blue} />
          <stop offset="100%" stopColor={C.blueDeep} />
        </linearGradient>
      </defs>
      {glow && (
        <g>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <path
                key={i}
                d={`M${Math.cos(a - 0.09) * 190} ${Math.sin(a - 0.09) * 150} L${Math.cos(a) * 420} ${Math.sin(a) * 360} L${Math.cos(a + 0.09) * 190} ${Math.sin(a + 0.09) * 150} Z`}
                fill={C.goldLight}
                opacity={0.6}
              />
            );
          })}
          <ellipse cx={0} cy={0} rx={250} ry={200} fill={C.white} opacity={0.4} />
        </g>
      )}
      {/* whole silhouette (outline) */}
      <rect x={-w / 2} y={top} width={w} height={bot - top} rx={30} fill="url(#moajFoam)" stroke={C.ink} strokeWidth={SW} />
      {/* thickness band */}
      <path d={`M${-w / 2 + 4} ${bot - 30} L${w / 2 - 4} ${bot - 30} L${w / 2 - 4} ${bot - 26} Q${w / 2 - 6} ${bot - 4} ${w / 2 - 30} ${bot - 4} L${-w / 2 + 30} ${bot - 4} Q${-w / 2 + 6} ${bot - 4} ${-w / 2 + 4} ${bot - 26} Z`} fill={C.blueDeep} />
      {/* foam pores */}
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx={-w / 2 + 30 + rand(i + 500) * (w - 60)} cy={seam + 30 + rand(i + 600) * 50} r={4 + rand(i + 700) * 4} fill={C.blueDeep} opacity={0.5} />
      ))}
      {/* white wave mark */}
      <path d={`M${-w / 2 + 50} ${bot - 50} Q${-w / 4 + 10} ${bot - 76} 0 ${bot - 50} T${w / 2 - 50} ${bot - 50}`} fill="none" stroke={C.white} strokeWidth={11} strokeLinecap="round" />
      {/* wire layer */}
      <path
        d={`${wave} L${w / 2} ${top + 30} Q${w / 2} ${top} ${w / 2 - 30} ${top} L${-w / 2 + 30} ${top} Q${-w / 2} ${top} ${-w / 2} ${top + 30} Z`}
        fill="url(#wireMesh)"
        stroke={C.ink}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path d={`M${-w / 2 + 34} ${top + 14} L${w / 2 - 70} ${top + 14}`} stroke={C.white} strokeWidth={8} strokeLinecap="round" opacity={0.9} />
      {glitter.map((g, i) => (
        <circle key={i} cx={g.x} cy={g.y} r={g.r} fill={i % 5 === 0 ? C.goldLight : C.gold} stroke={i % 3 === 0 ? "#B07A10" : "none"} strokeWidth={1.5} />
      ))}
      <Sparkle x={-90} y={top + 22} s={0.4} color={C.goldLight} />
      <Sparkle x={60} y={top + 40} s={0.3} color={C.white} />
      <Sparkle x={118} y={top + 14} s={0.25} color={C.goldLight} />
      {/* outline redraw on top */}
      <rect x={-w / 2} y={top} width={w} height={bot - top} rx={30} fill="none" stroke={C.ink} strokeWidth={SW} />
    </g>
  );
};

/** Wooden front door with frosted glass; optional guest silhouettes; open = ajar amount 0..1 */
export const FrontDoor: React.FC<{ x: number; y: number; s?: number; guests?: boolean; open?: number }> = ({
  x,
  y,
  s = 1,
  guests,
  open = 0,
}) => {
  const dw = 520 * (1 - open * 0.75);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* frame */}
      <rect x={-300} y={-40} width={600} height={1300} fill={C.woodDark} stroke={O} strokeWidth={SW} />
      {/* outside light */}
      <rect x={-260} y={0} width={520} height={1260} fill="#FFF4DA" stroke={O} strokeWidth={6} />
      {open > 0 && guests && (
        <g>
          <Guest x={-40} y={400} />
          <Guest x={150} y={430} s={0.95} woman />
        </g>
      )}
      {/* door leaf */}
      <g>
        <rect x={-260} y={0} width={dw} height={1260} fill={C.wood} stroke={O} strokeWidth={SW} />
        <rect x={-260 + dw * 0.17} y={70} width={dw * 0.66} height={620} rx={14} fill="#E7E4DA" stroke={O} strokeWidth={SW} />
        {guests && open === 0 && (
          <g opacity={0.75}>
            <clipPath id="doorGlass">
              <rect x={-260 + dw * 0.17} y={70} width={dw * 0.66} height={620} rx={14} />
            </clipPath>
            <g clipPath="url(#doorGlass)">
              <Shadow x={-110} y={300} />
              <Shadow x={60} y={330} woman />
              <Shadow x={190} y={360} s={0.85} />
            </g>
          </g>
        )}
        {/* frosted streaks */}
        <path d={`M${-260 + dw * 0.25} 140 L${-260 + dw * 0.5} 100 M${-260 + dw * 0.22} 220 L${-260 + dw * 0.6} 150`} stroke={C.white} strokeWidth={12} strokeLinecap="round" opacity={0.8} />
        <rect x={-260 + dw * 0.17} y={760} width={dw * 0.66} height={420} rx={14} fill={C.woodLight} stroke={O} strokeWidth={6} />
        <circle cx={-260 + dw - 50} cy={720} r={22} fill={C.copper} stroke={O} strokeWidth={6} />
      </g>
    </g>
  );
};

const Shadow: React.FC<{ x: number; y: number; s?: number; woman?: boolean }> = ({ x, y, s = 1, woman }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#4E3F3A">
    {woman ? (
      <g>
        <ellipse cx={0} cy={-90} rx={62} ry={74} />
        <path d="M-70 -60 Q-80 20 -120 60 L-140 420 L140 420 L120 60 Q80 20 70 -60 Z" />
      </g>
    ) : (
      <g>
        <ellipse cx={0} cy={-90} rx={58} ry={70} />
        {/* ghutra peak + drape */}
        <path d="M0 -190 Q90 -180 92 -90 L118 50 L-118 50 L-92 -90 Q-90 -180 0 -190 Z" />
        <rect x={-150} y={30} width={300} height={400} rx={70} />
      </g>
    )}
  </g>
);

const Guest: React.FC<{ x: number; y: number; s?: number; woman?: boolean }> = ({ x, y, s = 1, woman }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={O} strokeWidth={SW} strokeLinejoin="round">
    {woman ? (
      <g>
        <path d="M-120 60 L-140 900 L140 900 L120 60 Q0 20 -120 60 Z" fill="#3B302C" />
        <path d="M0 -170 Q80 -168 84 -70 Q86 10 120 60 L-120 60 Q-86 10 -84 -70 Q-80 -168 0 -170 Z" fill="#3B302C" />
        <ellipse cx={0} cy={-60} rx={58} ry={70} fill={C.skin} />
        <path d="M-26 -70 Q-18 -84 -8 -70 M8 -70 Q18 -84 26 -70" fill="none" strokeWidth={8} strokeLinecap="round" />
      </g>
    ) : (
      <g>
        <path d="M-140 70 L-160 900 L160 900 L140 70 Q0 30 -140 70 Z" fill={C.white} />
        <ellipse cx={0} cy={-60} rx={62} ry={74} fill={C.skin} />
        <path d="M-26 -66 Q-18 -80 -8 -66 M8 -66 Q18 -80 26 -66" fill="none" strokeWidth={8} strokeLinecap="round" />
        {/* shemagh */}
        <path d="M0 -168 Q84 -160 90 -90 L120 80 L70 60 L56 -100 Q0 -120 -56 -100 L-70 60 L-120 80 L-90 -90 Q-84 -160 0 -168 Z" fill="#E9E2DA" />
        <path d="M-60 -118 Q0 -140 60 -118" fill="none" stroke={O} strokeWidth={16} />
      </g>
    )}
  </g>
);

export const Doorbell: React.FC<{ x: number; y: number; s?: number; ringing?: boolean }> = ({ x, y, s = 1, ringing }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {ringing &&
      [1, 2, 3].map((k) => (
        <g key={k} fill="none" stroke={O} strokeWidth={14} strokeLinecap="round">
          <path d={`M${-90 - k * 46} ${-70 - k * 20} Q${-130 - k * 56} 0 ${-90 - k * 46} ${70 + k * 20}`} />
          <path d={`M${90 + k * 46} ${-70 - k * 20} Q${130 + k * 56} 0 ${90 + k * 46} ${70 + k * 20}`} />
        </g>
      ))}
    <rect x={-80} y={-120} width={160} height={240} rx={26} fill={C.cream} stroke={O} strokeWidth={SW} />
    <circle cx={0} cy={0} r={46} fill={C.copper} stroke={O} strokeWidth={SW} />
    <circle cx={-10} cy={-12} r={12} fill={C.copperLight} />
  </g>
);

/** Kitchen towel (held). Origin = top centre. */
export const Towel: React.FC<{ x?: number; y?: number; rot?: number }> = ({ x = 0, y = 0, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={O} strokeWidth={7} strokeLinejoin="round">
    <path d="M-60 0 L60 0 Q70 90 50 180 L-50 180 Q-70 90 -60 0 Z" fill={C.cream} />
    <path d="M-62 40 L62 40 M-64 60 L64 60" stroke={C.tileAccent} strokeWidth={10} />
  </g>
);
