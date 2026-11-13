import React from "react";
import { C, SW } from "../theme";

const O = C.ink;

export type Expression =
  | "neutral"
  | "proud"
  | "shocked"
  | "annoyed"
  | "determined"
  | "defeated"
  | "suspicious"
  | "panic"
  | "happy"
  | "amazed";

type EyeSpec = {
  mode: "open" | "happy" | "closed";
  ry?: number; // eye height
  lid?: number; // 0..1 upper-lid coverage
  pr?: number; // pupil radius
  sparkle?: boolean;
};
type BrowSpec = { inner: number; outer: number; arch?: number };
type ExprSpec = {
  eyeL: EyeSpec;
  eyeR: EyeSpec;
  browL: BrowSpec;
  browR: BrowSpec;
  look: [number, number];
  sweat?: boolean;
  blush?: number;
};

// browL = viewer-left brow. inner/outer = vertical offsets (negative = up)
const EXPR: Record<Expression, ExprSpec> = {
  neutral: {
    eyeL: { mode: "open" },
    eyeR: { mode: "open" },
    browL: { inner: 0, outer: 0, arch: 8 },
    browR: { inner: 0, outer: 0, arch: 8 },
    look: [0, 0],
  },
  proud: {
    eyeL: { mode: "happy" },
    eyeR: { mode: "happy" },
    browL: { inner: -20, outer: -8, arch: 14 },
    browR: { inner: -20, outer: -8, arch: 14 },
    look: [0, 0],
    blush: 0.8,
  },
  shocked: {
    eyeL: { mode: "open", ry: 33, pr: 8 },
    eyeR: { mode: "open", ry: 33, pr: 8 },
    browL: { inner: -34, outer: -24, arch: 16 },
    browR: { inner: -34, outer: -24, arch: 16 },
    look: [0, 2],
  },
  annoyed: {
    eyeL: { mode: "open", lid: 0.5 },
    eyeR: { mode: "open", lid: 0.5 },
    browL: { inner: 12, outer: -6, arch: 2 },
    browR: { inner: 12, outer: -6, arch: 2 },
    look: [0, 6],
  },
  determined: {
    eyeL: { mode: "open", lid: 0.35, pr: 13 },
    eyeR: { mode: "open", lid: 0.35, pr: 13 },
    browL: { inner: 18, outer: -12, arch: 0 },
    browR: { inner: 18, outer: -12, arch: 0 },
    look: [0, 8],
  },
  defeated: {
    eyeL: { mode: "open", lid: 0.55 },
    eyeR: { mode: "open", lid: 0.55 },
    browL: { inner: -18, outer: 12, arch: 4 },
    browR: { inner: -18, outer: 12, arch: 4 },
    look: [0, 10],
  },
  suspicious: {
    eyeL: { mode: "open", lid: 0.45 },
    eyeR: { mode: "open", ry: 28, lid: 0.1 },
    browL: { inner: 14, outer: 2, arch: 2 },
    browR: { inner: -26, outer: -18, arch: 14 },
    look: [10, 12],
  },
  panic: {
    eyeL: { mode: "open", ry: 32, pr: 7 },
    eyeR: { mode: "open", ry: 32, pr: 7 },
    browL: { inner: -30, outer: 8, arch: 6 },
    browR: { inner: -30, outer: 8, arch: 6 },
    look: [-8, 0],
    sweat: true,
  },
  happy: {
    eyeL: { mode: "happy" },
    eyeR: { mode: "happy" },
    browL: { inner: -14, outer: -6, arch: 12 },
    browR: { inner: -14, outer: -6, arch: 12 },
    look: [0, 0],
    blush: 1,
  },
  amazed: {
    eyeL: { mode: "open", ry: 32, pr: 15, sparkle: true },
    eyeR: { mode: "open", ry: 32, pr: 15, sparkle: true },
    browL: { inner: -30, outer: -22, arch: 18 },
    browR: { inner: -30, outer: -22, arch: 18 },
    look: [0, -4],
    blush: 0.9,
  },
};

const EYE_RX = 29;

const Eye: React.FC<{ cx: number; cy: number; spec: EyeSpec; look: [number, number]; side: -1 | 1 }> = ({
  cx,
  cy,
  spec,
  look,
  side,
}) => {
  if (spec.mode === "happy") {
    return (
      <path
        d={`M${cx - 27} ${cy + 8} Q${cx} ${cy - 26} ${cx + 27} ${cy + 8}`}
        fill="none"
        stroke={O}
        strokeWidth={12}
        strokeLinecap="round"
      />
    );
  }
  if (spec.mode === "closed") {
    return (
      <path
        d={`M${cx - 26} ${cy} Q${cx} ${cy + 14} ${cx + 26} ${cy}`}
        fill="none"
        stroke={O}
        strokeWidth={11}
        strokeLinecap="round"
      />
    );
  }
  const ry = spec.ry ?? 25;
  const pr = spec.pr ?? 12;
  const lid = spec.lid ?? 0;
  const px = cx + look[0];
  const py = cy + look[1] * 0.8;
  // lid covers ellipse area above line y = L
  const L = -ry + 2 * ry * lid;
  const xi = EYE_RX * Math.sqrt(Math.max(0, 1 - (L / ry) ** 2));
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={EYE_RX} ry={ry} fill={C.white} stroke={O} strokeWidth={7} />
      <circle cx={px} cy={py} r={pr} fill={O} />
      <circle cx={px + pr * 0.35} cy={py - pr * 0.4} r={Math.max(3, pr * 0.32)} fill={C.white} />
      {spec.sparkle && (
        <path
          d={`M${px - 4} ${py + 2} l3 -9 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3 z`}
          fill={C.white}
          transform={`translate(${-pr * 0.2} ${pr * 0.25})`}
        />
      )}
      {lid > 0 && (
        <g>
          <path
            d={`M${cx - xi} ${cy + L} A${EYE_RX} ${ry} 0 ${L > 0 ? 1 : 0} 1 ${cx + xi} ${cy + L} Z`}
            fill={C.skin}
            stroke={O}
            strokeWidth={7}
          />
          <path
            d={`M${cx - xi - 4} ${cy + L} L${cx + xi + 4} ${cy + L}`}
            stroke={O}
            strokeWidth={10}
            strokeLinecap="round"
          />
        </g>
      )}
      {/* lash flick at outer corner */}
      <path
        d={`M${cx + side * (EYE_RX - 4)} ${cy - ry * 0.55 + (lid > 0 ? 2 * ry * lid * 0.6 : 0)} l${side * 16} -12`}
        stroke={O}
        strokeWidth={7}
        strokeLinecap="round"
      />
    </g>
  );
};

const Brow: React.FC<{ cx: number; by: number; spec: BrowSpec; side: -1 | 1 }> = ({ cx, by, spec, side }) => {
  // side -1 = viewer-left: inner end is to the right (+x)
  const ix = cx - side * 22;
  const ox = cx + side * 34;
  const iy = by + spec.inner;
  const oy = by + spec.outer;
  const mx = (ix + ox) / 2;
  const my = (iy + oy) / 2 - (spec.arch ?? 6);
  return (
    <path
      d={`M${ix} ${iy} Q${mx} ${my} ${ox} ${oy}`}
      fill="none"
      stroke={C.brow}
      strokeWidth={17}
      strokeLinecap="round"
    />
  );
};

// ---------------------------------------------------------------- arms (2-bone IK)
const L1 = 175;
const L2 = 170;

type Pt = [number, number];

export const solveIK = (s: Pt, t: Pt, bend: 1 | -1): { e: Pt; t: Pt } => {
  const dx = t[0] - s[0];
  const dy = t[1] - s[1];
  let d = Math.hypot(dx, dy);
  const maxD = L1 + L2 - 2;
  let tt: Pt = t;
  if (d > maxD) {
    tt = [s[0] + (dx / d) * maxD, s[1] + (dy / d) * maxD];
    d = maxD;
  }
  d = Math.max(d, 40);
  const th = Math.atan2(tt[1] - s[1], tt[0] - s[0]);
  const a = Math.acos(Math.min(1, Math.max(-1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const ang = th + bend * a;
  return { e: [s[0] + L1 * Math.cos(ang), s[1] + L1 * Math.sin(ang)], t: tt };
};

export type HandPose = "open" | "fist" | "mitt" | "point";

export type ArmSpec = {
  hand: Pt; // wrist target, character-local coords
  bend?: 1 | -1;
  pose?: HandPose;
  handAngle?: number; // override hand direction (deg, 0 = pointing +x)
  item?: React.ReactNode; // drawn in hand-local coords (x along fingers)
  itemOver?: boolean; // draw item above the hand
};

const quad = (a: Pt, b: Pt, wa: number, wb: number) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  const nx = -dy / l;
  const ny = dx / l;
  return [
    [a[0] + (nx * wa) / 2, a[1] + (ny * wa) / 2],
    [b[0] + (nx * wb) / 2, b[1] + (ny * wb) / 2],
    [b[0] - (nx * wb) / 2, b[1] - (ny * wb) / 2],
    [a[0] - (nx * wa) / 2, a[1] - (ny * wa) / 2],
  ]
    .map((p) => p.join(","))
    .join(" ");
};

export const Hand: React.FC<{ pose: HandPose; mirror: boolean }> = ({ pose, mirror }) => {
  // hand-local: wrist at 0,0, fingers toward +x
  const fill = pose === "mitt" ? C.mitt : C.skin;
  const sy = mirror ? -1 : 1;
  if (pose === "mitt") {
    return (
      <g transform={`scale(1 ${sy})`} stroke={O} strokeWidth={7} strokeLinejoin="round">
        <path d="M-6 -40 Q70 -52 82 -6 Q86 34 30 40 L-6 40 Z" fill={fill} />
        <ellipse cx={26} cy={-40} rx={18} ry={14} fill={fill} transform="rotate(-25 26 -40)" />
        <path d="M14 -30 L60 26 M40 -38 L74 4 M4 -6 L34 34" stroke={C.tileAccent} strokeWidth={5} />
      </g>
    );
  }
  if (pose === "fist") {
    return (
      <g transform={`scale(1 ${sy})`} stroke={O} strokeWidth={7}>
        <ellipse cx={30} cy={0} rx={38} ry={34} fill={fill} />
        <path d="M44 -20 Q58 -10 46 4" fill="none" strokeWidth={5} />
        <ellipse cx={22} cy={-30} rx={16} ry={11} fill={fill} />
      </g>
    );
  }
  if (pose === "point") {
    return (
      <g transform={`scale(1 ${sy})`} stroke={O} strokeWidth={7}>
        <rect x={34} y={-12} width={54} height={22} rx={11} fill={fill} />
        <ellipse cx={26} cy={4} rx={34} ry={30} fill={fill} />
      </g>
    );
  }
  const fingers: [number, number][] = [
    [-21, 30],
    [-7, 37],
    [7, 35],
    [21, 27],
  ];
  return (
    <g transform={`scale(1 ${sy})`} strokeLinecap="round">
      {fingers.map(([fy, len], i) => (
        <line key={i} x1={44} y1={fy} x2={44 + len} y2={fy} stroke={O} strokeWidth={27} />
      ))}
      <line x1={22} y1={-24} x2={50} y2={-50} stroke={O} strokeWidth={29} />
      <rect x={-6} y={-34} width={62} height={68} rx={26} fill={fill} stroke={O} strokeWidth={7} />
      <line x1={22} y1={-24} x2={50} y2={-50} stroke={fill} strokeWidth={15} />
      {fingers.map(([fy, len], i) => (
        <line key={i} x1={40} y1={fy} x2={44 + len} y2={fy} stroke={fill} strokeWidth={13} />
      ))}
    </g>
  );
};

const Arm: React.FC<{ shoulder: Pt; spec: ArmSpec; side: -1 | 1 }> = ({ shoulder, spec, side }) => {
  const { e, t } = solveIK(shoulder, spec.hand, spec.bend ?? (side === 1 ? -1 : 1));
  const fdx = t[0] - e[0];
  const fdy = t[1] - e[1];
  const fl = Math.hypot(fdx, fdy) || 1;
  const fang = (Math.atan2(fdy, fdx) * 180) / Math.PI;
  const hAng = spec.handAngle ?? fang;
  // cuff band
  const cuffA: Pt = [t[0] - (fdx / fl) * 34, t[1] - (fdy / fl) * 34];
  const pose = spec.pose ?? "open";
  const mirror = side === -1;
  return (
    <g>
      {/* upper sleeve (capsule) */}
      <line x1={shoulder[0]} y1={shoulder[1]} x2={e[0]} y2={e[1]} stroke={O} strokeWidth={96 + SW * 2} strokeLinecap="round" />
      <line x1={shoulder[0]} y1={shoulder[1]} x2={e[0]} y2={e[1]} stroke={C.darraa} strokeWidth={96} strokeLinecap="round" />
      {/* forearm sleeve flares to cuff */}
      <circle cx={e[0]} cy={e[1]} r={48 + SW} fill={O} />
      <polygon points={quad(e, t, 96, 128)} fill={C.darraa} stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <circle cx={e[0]} cy={e[1]} r={44} fill={C.darraa} />
      <polygon points={quad(cuffA, t, 122, 128)} fill={C.trim} stroke={O} strokeWidth={6} strokeLinejoin="round" />
      <g transform={`translate(${t[0]} ${t[1]}) rotate(${hAng})`}>
        {!spec.itemOver && spec.item}
        <Hand pose={pose} mirror={mirror} />
        {spec.itemOver && spec.item}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- character

export type UmmFahadProps = {
  x: number;
  y: number;
  scale?: number;
  expression?: Expression;
  armL?: ArmSpec; // viewer-left arm
  armR?: ArmSpec; // viewer-right arm
  held?: React.ReactNode; // drawn between body and arms (character-local coords)
  heldScene?: React.ReactNode; // same layer, but in scene coords (e.g. counter + pot in front of her)
  headTilt?: number;
  wet?: boolean;
  bodyOnly?: boolean;
};

export const SHOULDER_L: Pt = [-188, 292];
export const SHOULDER_R: Pt = [188, 292];

export const DEFAULT_ARM_L: ArmSpec = { hand: [-230, 560], pose: "open" };
export const DEFAULT_ARM_R: ArmSpec = { hand: [230, 560], pose: "open" };

export const Head: React.FC<{ expression: Expression; tilt?: number }> = ({ expression, tilt = 0 }) => {
  const ex = EXPR[expression];
  return (
    <g transform={`rotate(${tilt} 0 40)`}>
      {/* scarf back + chest drape */}
      <path
        d="M0 -182 C128 -182 184 -96 180 14 C178 112 204 172 244 226 Q214 350 116 378 Q0 404 -116 378 Q-214 350 -244 226 C-204 172 -178 112 -180 14 C-184 -96 -128 -182 0 -182 Z"
        fill={C.scarf}
        stroke={O}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path d="M-150 250 Q-80 300 -20 300" fill="none" stroke={C.scarfShade} strokeWidth={8} strokeLinecap="round" />
      <path d="M160 200 Q120 300 40 330" fill="none" stroke={C.scarfShade} strokeWidth={8} strokeLinecap="round" />
      {/* face */}
      <ellipse cx={0} cy={18} rx={104} ry={126} fill={C.skin} stroke={O} strokeWidth={SW} />
      {/* hood edge framing the face */}
      <path
        d="M-120 40 C-124 -88 -64 -128 0 -128 C64 -128 124 -88 120 40 L142 40 C148 -112 74 -166 0 -166 C-74 -166 -148 -112 -142 40 Z"
        fill={C.scarf}
        stroke={O}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path d="M-128 -10 C-118 -100 -56 -140 0 -140" fill="none" stroke={C.scarfShade} strokeWidth={7} strokeLinecap="round" />
      {/* cheeks */}
      <ellipse cx={-70} cy={62} rx={24} ry={14} fill={C.blush} opacity={0.35 + 0.4 * (ex.blush ?? 0)} />
      <ellipse cx={70} cy={62} rx={24} ry={14} fill={C.blush} opacity={0.35 + 0.4 * (ex.blush ?? 0)} />
      {/* nose */}
      <path d="M-2 40 Q6 64 18 54" fill="none" stroke="#8A5236" strokeWidth={7} strokeLinecap="round" />
      {/* eyes & brows */}
      <Eye cx={-46} cy={6} spec={ex.eyeL} look={ex.look} side={-1} />
      <Eye cx={46} cy={6} spec={ex.eyeR} look={ex.look} side={1} />
      <Brow cx={-46} by={-50} spec={ex.browL} side={-1} />
      <Brow cx={46} by={-50} spec={ex.browR} side={1} />
      {ex.sweat && (
        <path
          d="M118 -40 Q100 -6 112 8 Q126 18 136 4 Q142 -14 118 -40 Z"
          fill={C.water}
          stroke={O}
          strokeWidth={6}
        />
      )}
    </g>
  );
};

export const UmmFahad: React.FC<UmmFahadProps> = ({
  x,
  y,
  scale = 1,
  expression = "neutral",
  armL = DEFAULT_ARM_L,
  armR = DEFAULT_ARM_R,
  held,
  heldScene,
  headTilt = 0,
  wet,
}) => {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* darraa body */}
      <path
        d="M-205 232 Q-262 248 -268 345 L-315 1200 L315 1200 L268 345 Q262 248 205 232 Z"
        fill={C.darraa}
        stroke={O}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path d="M-120 420 L-150 1200" stroke={C.darraaShade} strokeWidth={10} />
      <path d="M130 440 L160 1200" stroke={C.darraaShade} strokeWidth={10} />
      {/* center embroidery panel */}
      <path d="M-34 360 L34 360 L46 1200 L-46 1200 Z" fill={C.trim} stroke={O} strokeWidth={6} />
      {Array.from({ length: 9 }).map((_, i) => (
        <g key={i} transform={`translate(0 ${420 + i * 90})`}>
          <rect x={-12} y={-12} width={24} height={24} fill={C.darraa} transform="rotate(45)" stroke={O} strokeWidth={4} />
        </g>
      ))}
      {wet && (
        <g stroke={O} strokeWidth={6}>
          <path d="M-160 520 Q-120 470 -60 500 Q-10 470 40 520 Q90 500 120 560 Q60 620 -20 600 Q-100 640 -160 590 Z" fill={C.darraaShade} />
          {[
            [-150, 640, 14],
            [-60, 660, 10],
            [60, 650, 12],
            [110, 610, 8],
          ].map(([cx, cy, r], i) => (
            <path key={i} d={`M${cx} ${cy - r * 2} Q${cx - r} ${cy} ${cx} ${cy + r} Q${cx + r} ${cy} ${cx} ${cy - r * 2} Z`} fill={C.water} />
          ))}
        </g>
      )}
      <Head expression={expression} tilt={headTilt} />
      {heldScene && <g transform={`scale(${1 / scale}) translate(${-x} ${-y})`}>{heldScene}</g>}
      {held}
      <Arm shoulder={SHOULDER_L} spec={armL} side={-1} />
      <Arm shoulder={SHOULDER_R} spec={armR} side={1} />
    </g>
  );
};
