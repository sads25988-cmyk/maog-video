import React from "react";
import { C, SW } from "../theme";

const O = C.ink;

/** Reusable <defs> for kitchen patterns. Render once per <svg>. */
export const KitchenDefs: React.FC = () => (
  <defs>
    {/* mashrabiya lattice: square + rotated square = 8-point star grid */}
    <pattern id="mashrabiya" width="60" height="60" patternUnits="userSpaceOnUse">
      <rect width="60" height="60" fill={C.cream} />
      <rect x="12" y="12" width="36" height="36" fill="none" stroke={C.woodDark} strokeWidth="7" />
      <rect
        x="12"
        y="12"
        width="36"
        height="36"
        fill="none"
        stroke={C.woodDark}
        strokeWidth="7"
        transform="rotate(45 30 30)"
      />
      <circle cx="30" cy="30" r="5" fill={C.woodDark} />
      <path d="M0 0 L12 12 M60 0 L48 12 M0 60 L12 48 M60 60 L48 48" stroke={C.woodDark} strokeWidth="7" />
    </pattern>
    <pattern id="tiles" width="90" height="90" patternUnits="userSpaceOnUse">
      <rect width="90" height="90" fill={C.tile} />
      <rect width="90" height="90" fill="none" stroke={C.tileLine} strokeWidth="5" />
    </pattern>
    <pattern id="tilesAccent" width="180" height="90" patternUnits="userSpaceOnUse">
      <rect width="180" height="90" fill="url(#tiles)" />
      <g transform="translate(45 45)">
        <rect x="-16" y="-16" width="32" height="32" fill={C.tileAccent} transform="rotate(45)" />
        <circle r="7" fill={C.tile} />
      </g>
    </pattern>
    <radialGradient id="ovenGlow" cx="50%" cy="60%" r="60%">
      <stop offset="0%" stopColor="#FFD08A" />
      <stop offset="60%" stopColor="#F29A4A" />
      <stop offset="100%" stopColor="#B8552A" />
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
      <stop offset="60%" stopColor="#000" stopOpacity="0" />
      <stop offset="100%" stopColor="#2A1B12" stopOpacity="0.45" />
    </radialGradient>
  </defs>
);

const Cabinet: React.FC<{ x: number; y: number; w: number; h: number; doors?: number }> = ({
  x,
  y,
  w,
  h,
  doors = 2,
}) => {
  const dw = w / doors;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={C.wood} stroke={O} strokeWidth={SW} />
      {Array.from({ length: doors }).map((_, i) => (
        <g key={i}>
          <rect
            x={x + i * dw + 22}
            y={y + 22}
            width={dw - 44}
            height={h - 44}
            rx={10}
            fill={C.woodLight}
            stroke={O}
            strokeWidth={6}
          />
          <rect
            x={x + i * dw + (i % 2 === 0 ? dw - 52 : 34)}
            y={y + h / 2 - 34}
            width={14}
            height={68}
            rx={7}
            fill={C.copper}
            stroke={O}
            strokeWidth={5}
          />
        </g>
      ))}
    </g>
  );
};

const Dallah: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={O} strokeWidth={7} strokeLinejoin="round">
    {/* spout */}
    <path d="M-40 -70 Q-95 -95 -112 -150 L-96 -154 Q-80 -112 -38 -96 Z" fill={C.copper} />
    {/* handle */}
    <path d="M42 -120 Q92 -110 80 -40 Q74 -10 46 -6" fill="none" strokeWidth={12} strokeLinecap="round" />
    <path d="M42 -120 Q92 -110 80 -40 Q74 -10 46 -6" fill="none" stroke={C.copper} strokeWidth={4} strokeLinecap="round" />
    {/* body */}
    <path d="M-52 0 Q-62 -60 -34 -100 L-24 -128 L24 -128 L34 -100 Q62 -60 52 0 Z" fill={C.copperLight} />
    <path d="M-48 -40 L48 -40" strokeWidth={6} />
    {/* lid */}
    <path d="M-30 -128 Q0 -170 30 -128 Z" fill={C.copper} />
    <path d="M0 -158 L0 -186" strokeWidth={8} strokeLinecap="round" />
    <circle cx={0} cy={-190} r={7} fill={C.copper} />
  </g>
);

const Finjan: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <path
    d={`M${x - 22} ${y - 34} L${x + 22} ${y - 34} L${x + 14} ${y} L${x - 14} ${y} Z`}
    fill={C.cream}
    stroke={O}
    strokeWidth={6}
    strokeLinejoin="round"
  />
);

const DatesBowl: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g stroke={O} strokeWidth={6}>
    {[-34, -12, 10, 32, -22, 0, 22].map((dx, i) => (
      <ellipse
        key={i}
        cx={x + dx}
        cy={y - 30 - (i > 3 ? 18 : 0)}
        rx={15}
        ry={10}
        fill="#7A3E22"
      />
    ))}
    <path d={`M${x - 60} ${y - 30} Q${x} ${y + 30} ${x + 60} ${y - 30} Z`} fill={C.woodLight} />
  </g>
);

export type KitchenProps = {
  ovenOpen?: boolean;
  showOven?: boolean;
};

/** Wide shot of the Saudi kitchen (full 1080×1920). */
export const KitchenWide: React.FC<KitchenProps> = ({ ovenOpen, showOven = true }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={C.wall} />
    {/* soft wall bands */}
    <rect x={0} y={0} width={1080} height={120} fill={C.wallShade} />

    {/* mashrabiya window, arched */}
    <g>
      <path
        d="M70 1000 L70 640 Q70 470 270 450 Q470 470 470 640 L470 1000 Z"
        fill={C.woodDark}
        stroke={O}
        strokeWidth={SW}
      />
      <path
        d="M100 975 L100 650 Q100 500 270 482 Q440 500 440 650 L440 975 Z"
        fill="url(#mashrabiya)"
        stroke={O}
        strokeWidth={6}
      />
      <rect x={50} y={990} width={440} height={30} rx={6} fill={C.wood} stroke={O} strokeWidth={SW} />
    </g>

    {/* upper cabinets */}
    <Cabinet x={600} y={-20} w={480} h={500} />

    {/* shelf with dallah */}
    <g>
      <rect x={610} y={800} width={440} height={26} rx={6} fill={C.wood} stroke={O} strokeWidth={SW} />
      <DatesBowl x={700} y={800} />
      <Finjan x={850} y={800} />
      <Finjan x={900} y={800} />
      <Dallah x={990} y={800} s={0.9} />
    </g>

    {/* backsplash tiles */}
    <rect x={0} y={1040} width={1080} height={300} fill="url(#tilesAccent)" stroke={O} strokeWidth={SW} />

    {/* lower cabinets */}
    <rect x={0} y={1385} width={1080} height={560} fill={C.wood} stroke={O} strokeWidth={SW} />
    <Cabinet x={560} y={1420} w={500} h={480} />

    {showOven && (
      <g>
        <rect x={50} y={1420} width={470} height={470} rx={14} fill="#D9D2C6" stroke={O} strokeWidth={SW} />
        <rect x={70} y={1438} width={430} height={52} rx={8} fill="#B9B0A2" stroke={O} strokeWidth={6} />
        {[130, 200, 270].map((cx) => (
          <circle key={cx} cx={cx} cy={1464} r={14} fill={C.inkSoft} stroke={O} strokeWidth={5} />
        ))}
        <rect x={380} y={1452} width={90} height={24} rx={6} fill="#3A2E27" />
        {ovenOpen ? (
          <g>
            <rect x={80} y={1510} width={410} height={350} rx={12} fill="url(#ovenGlow)" stroke={O} strokeWidth={SW} />
            <path d="M100 1620 L470 1620" stroke="#8A3F1E" strokeWidth={6} />
            <path d="M100 1740 L470 1740" stroke="#8A3F1E" strokeWidth={6} />
          </g>
        ) : (
          <g>
            <rect x={80} y={1510} width={410} height={350} rx={12} fill="#3A2E27" stroke={O} strokeWidth={SW} />
            <rect x={110} y={1540} width={350} height={250} rx={10} fill="#4C3D33" />
            <rect x={150} y={1520} width={270} height={18} rx={9} fill="#B9B0A2" stroke={O} strokeWidth={5} />
          </g>
        )}
      </g>
    )}

    {/* countertop */}
    <rect x={-10} y={1330} width={1100} height={62} fill={C.counter} stroke={O} strokeWidth={SW} />
    <rect x={-10} y={1330} width={1100} height={16} fill="#EEDDBF" />
  </g>
);

/** Close shot: counter surface fills the bottom, tiles behind. */
export const KitchenClose: React.FC<{ counterY?: number }> = ({ counterY = 1180 }) => (
  <g>
    <rect x={0} y={0} width={1080} height={1920} fill={C.wall} />
    <rect x={0} y={0} width={1080} height={counterY} fill="url(#tilesAccent)" />
    <rect x={-10} y={counterY} width={1100} height={1920 - counterY + 10} fill={C.counter} stroke={O} strokeWidth={SW} />
    <rect x={-10} y={counterY} width={1100} height={26} fill="#EEDDBF" />
    {/* faint stone speckles */}
    {Array.from({ length: 40 }).map((_, i) => (
      <circle
        key={i}
        cx={(i * 263) % 1080}
        cy={counterY + 80 + ((i * 137) % (1920 - counterY - 100))}
        r={4 + (i % 3) * 2}
        fill={C.counterEdge}
        opacity={0.6}
      />
    ))}
  </g>
);
