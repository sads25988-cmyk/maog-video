/**
 * The sponge micro-world: a hidden civilization of bacteria living inside the kitchen sponge.
 * This is the creative heart of the ad.
 */
import React from "react";
import { OC, PO, SL, W, H } from "../AnimeCanvas";
import { Bacterium } from "../characters/Bacterium";

interface MicroWorldProps {
  frame: number;
  panic?: number; // 0..1 — when Moaj arrives
  revealProgress?: number; // 0..1 — initial reveal zoom-in
}

// ── Sponge surface terrain ────────────────────────────────────────────────────
const SpongeTerrain: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame / 30;
  return (
    <g>
      <defs>
        <radialGradient id="microSky" cx="50%" cy="30%">
          <stop offset="0%"   stopColor="#d4f084"/>
          <stop offset="60%"  stopColor="#a8e040"/>
          <stop offset="100%" stopColor="#6caa20"/>
        </radialGradient>
        <radialGradient id="sporePulse" cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#c8ff80" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#80c820" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Sky / atmosphere */}
      <rect x={0} y={0} width={W} height={H} fill="url(#microSky)"/>

      {/* Atmospheric haze */}
      <ellipse cx={W/2} cy={300} rx={600} ry={200} fill="#e8ff90" opacity={0.3}/>
      <ellipse cx={W/2} cy={H - 200} rx={700} ry={300} fill="#507820" opacity={0.25}/>

      {/* Floating spores */}
      {Array.from({ length: 18 }, (_, i) => {
        const sporeX = (W * 0.07 * i + t * 20 * (i % 3 === 0 ? 1 : -1)) % W;
        const sporeY = 100 + (H - 300) * ((i * 0.137) % 1) + Math.sin(t + i) * 30;
        const r = 4 + (i % 5) * 3;
        return (
          <circle key={i} cx={sporeX} cy={sporeY} r={r}
            fill="#b0e840" opacity={0.5 + 0.3 * Math.sin(t * 2 + i)}/>
        );
      })}

      {/* ── Ground / sponge surface ── */}
      {/* Main ground hill */}
      <path d="M-20,1500 Q200,1240 400,1300 Q600,1340 800,1260 Q950,1200 1100,1280 L1100,1920 L-20,1920 Z"
        fill="#7cb828" stroke="#4a9010" strokeWidth={6}/>
      {/* Ground texture - pores */}
      {Array.from({ length: 24 }, (_, i) => {
        const px = 50 + (i * 44) % 1000;
        const py = 1340 + (i * 37) % 160 + Math.floor(i / 10) * 60;
        const pr = 12 + (i % 5) * 8;
        return (
          <ellipse key={i} cx={px} cy={py} rx={pr} ry={pr * 0.6}
            fill="#4a8010" opacity={0.5}/>
        );
      })}
      {/* Ground highlight (dew) */}
      <path d="M50,1340 Q400,1200 750,1280 Q900,1220 1050,1250"
        fill="none" stroke="#c0ff60" strokeWidth={3} opacity={0.4}/>

      {/* ── Side hills / depth ── */}
      <path d="M-20,1700 Q100,1500 250,1560 L250,1920 L-20,1920 Z" fill="#5a9810" opacity={0.6}/>
      <path d="M850,1920 L850,1500 Q950,1420 1100,1480 L1100,1920 Z" fill="#5a9810" opacity={0.6}/>

      {/* ── Structures: food crumbs as "buildings" ── */}
      {/* بختاوي's throne area */}
      <ellipse cx={240} cy={1300} rx={80} ry={25} fill="#c8a040" opacity={0.7}/>
      <path d="M200,1300 L200,1240 L240,1210 L280,1240 L280,1300 Z"
        fill="#d8b050" stroke="#a07820" strokeWidth={4} style={PO}/>
      <path d="M200,1240 L240,1210 L280,1240" fill="#e8c060" stroke="#a07820" strokeWidth={3}/>
      {/* "throne" pillars */}
      <rect x={208} y={1240} width={12} height={60} fill="#b89040" stroke="#806820" strokeWidth={2}/>
      <rect x={260} y={1240} width={12} height={60} fill="#b89040" stroke="#806820" strokeWidth={2}/>
      {/* Crown decoration */}
      {[-20,-10,0,10,20].map((dx,i) => (
        <circle key={i} cx={240+dx} cy={1210} r={5}
          fill="#f0c820" stroke="#806820" strokeWidth={1.5}/>
      ))}

      {/* Teen "نوفة"  phone tower (a crumb stack) */}
      <rect x={560} y={1240} width={35} height={70} rx={4}
        fill="#8060a0" stroke="#4a3060" strokeWidth={3} style={PO}/>
      <rect x={555} y={1230} width={45} height={12} rx={3}
        fill="#a080c0" stroke="#4a3060" strokeWidth={2} style={PO}/>
      {/* Signal waves */}
      {[1,2,3].map(r => (
        <path key={r}
          d={`M${577-r*8},${1226-r*10} Q577,${1210-r*12} ${577+r*8},${1226-r*10}`}
          fill="none" stroke="#c0a0e0" strokeWidth={2} opacity={0.5 + 0.2*r}/>
      ))}

      {/* أم حارث  kitchen corner (a crumb) */}
      <ellipse cx={820} cy={1270} rx={60} ry={20} fill="#a06840" opacity={0.6}/>
      <rect x={785} y={1210} width={70} height={60} rx={6}
        fill="#b87840" stroke="#704820" strokeWidth={3} style={PO}/>
      {/* "Kitchen" window on crumb-house */}
      <rect x={800} y={1222} width={18} height={18} rx={2}
        fill="#ffe090" stroke="#704820" strokeWidth={2}/>
      <rect x={826} y={1222} width={18} height={18} rx={2}
        fill="#ffe090" stroke="#704820" strokeWidth={2}/>
      {/* Smoke from cooking */}
      {[0,1,2].map(i => {
        const sx = 820 + Math.sin(t * 2 + i) * 6;
        const sy = 1210 - i * 20 - t * 5 % 40;
        return (
          <circle key={i} cx={sx} cy={sy} r={6 + i * 3}
            fill="#b0a890" opacity={0.4 - i * 0.1}/>
        );
      })}

      {/* ── Tiny background bacteria (extras) ── */}
      {Array.from({ length: 8 }, (_, i) => {
        const bx = 100 + i * 115;
        const by = 1380 + Math.sin(i * 1.3) * 40;
        const r  = 10 + (i % 4) * 6;
        const c  = ["#5cb85c","#9b59b6","#e91e8c","#f1c40f","#3498db"][i % 5];
        return (
          <circle key={i} cx={bx} cy={by} r={r} fill={c} opacity={0.7}
            stroke={OC} strokeWidth={2.5}/>
        );
      })}
    </g>
  );
};

// ── "Warning" flash when Moaj arrives ────────────────────────────────────────
const PanicFlash: React.FC<{ frame: number; panic: number }> = ({ frame, panic }) => {
  if (panic < 0.1) return null;
  const flash = Math.sin(frame * 0.8) > 0 ? panic * 0.3 : 0;
  return (
    <rect x={0} y={0} width={W} height={H}
      fill="#ff4040" opacity={flash}/>
  );
};

// ── Moaj sponge descending ────────────────────────────────────────────────────
const MoajSpongeDescending: React.FC<{ progress: number }> = ({ progress }) => {
  if (progress <= 0) return null;
  const y = -300 + progress * 900;
  return (
    <g transform={`translate(540,${y})`}>
      {/* Glow aura */}
      <ellipse cx={0} cy={0} rx={200} ry={120} fill="#2060d0" opacity={0.2}/>
      <ellipse cx={0} cy={0} rx={140} ry={80}  fill="#4090f0" opacity={0.15}/>
      {/* Sponge body */}
      <rect x={-120} y={-80} width={240} height={160} rx={20}
        fill="#0b3a85" stroke={OC} strokeWidth={SL} style={PO}/>
      <rect x={-108} y={-68} width={216} height={136} rx={14}
        fill="#1e6fde"/>
      {/* Foam surface */}
      <rect x={-108} y={-68} width={216} height={40} rx={12}
        fill="#5faaf7" opacity={0.6}/>
      {/* Pores */}
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i}
          cx={-90 + (i % 4) * 55} cy={-30 + Math.floor(i / 4) * 36}
          rx={8} ry={5} fill="#0b3a85" opacity={0.5}/>
      ))}
      {/* Wire layer highlight */}
      <path d="M-108,32 Q-50,22 0,32 Q50,22 108,32"
        fill="none" stroke="#c0c8d0" strokeWidth={5}/>
      <path d="M-108,48 Q-50,38 0,48 Q50,38 108,48"
        fill="none" stroke="#a0a8b0" strokeWidth={3}/>
      {/* Gold glitter */}
      {Array.from({ length: 8 }, (_, i) => {
        const gx = -90 + i * 24;
        const gy = -50 + Math.sin(i * 1.3) * 30;
        return (
          <path key={i} d={`M${gx},${gy-6} L${gx},${gy+6} M${gx-6},${gy} L${gx+6},${gy}`}
            stroke="#ffc820" strokeWidth={2.5} strokeLinecap="round"/>
        );
      })}
      {/* موج label */}
      <text x={0} y={8} textAnchor="middle"
        fill="white" fontSize={36} fontWeight="bold"
        fontFamily="'MoajCairo', sans-serif"
        stroke={OC} strokeWidth={2} style={PO}>
        موج
      </text>
      {/* Light beam */}
      <path d={`M-80,80 L-160,500 M80,80 L160,500`}
        stroke="#80c0ff" strokeWidth={30} opacity={0.1}/>
    </g>
  );
};

// ── Main scene ────────────────────────────────────────────────────────────────
export const MicroWorld: React.FC<MicroWorldProps> = ({
  frame, panic = 0, revealProgress = 1,
}) => {
  const scale   = 0.3 + revealProgress * 0.7;
  const opacity = revealProgress;
  const moajY   = panic > 0.3 ? (panic - 0.3) / 0.7 : 0;

  return (
    <g style={{ opacity }}>
      <g transform={`scale(${scale}) translate(${W * (1 - scale) / (2 * scale)}, ${H * (1 - scale) / (2 * scale)})`}>
        <SpongeTerrain frame={frame}/>

        {/* Characters placed on the terrain */}
        <Bacterium x={180} y={1150} type="elder" frame={frame} panic={panic} scale={1.1}/>
        <Bacterium x={560} y={1200} type="teen"  frame={frame} panic={panic} scale={0.95}/>
        <Bacterium x={800} y={1150} type="mama"  frame={frame} panic={panic} scale={1.0}/>

        {/* Moaj descending during panic */}
        <MoajSpongeDescending progress={moajY}/>

        {/* Panic flash overlay */}
        <PanicFlash frame={frame} panic={panic}/>

        {/* ── Caption labels (fun name tags) ── */}
        {panic < 0.3 && (
          <>
            <g transform="translate(140,1098)">
              <rect x={-50} y={-22} width={100} height={28} rx={6}
                fill="white" stroke={OC} strokeWidth={3} opacity={0.9}/>
              <text x={0} y={0} textAnchor="middle" dominantBaseline="middle"
                fill={OC} fontSize={22} fontFamily="'MoajNaskh', sans-serif">
                بختاوي (٨ أشهر)
              </text>
            </g>
            <g transform="translate(560,1148)">
              <rect x={-50} y={-22} width={100} height={28} rx={6}
                fill="white" stroke={OC} strokeWidth={3} opacity={0.9}/>
              <text x={0} y={0} textAnchor="middle" dominantBaseline="middle"
                fill={OC} fontSize={22} fontFamily="'MoajNaskh', sans-serif">
                نوفة (جديدة)
              </text>
            </g>
            <g transform="translate(800,1098)">
              <rect x={-50} y={-22} width={100} height={28} rx={6}
                fill="white" stroke={OC} strokeWidth={3} opacity={0.9}/>
              <text x={0} y={0} textAnchor="middle" dominantBaseline="middle"
                fill={OC} fontSize={22} fontFamily="'MoajNaskh', sans-serif">
                أم حارث
              </text>
            </g>
          </>
        )}

        {/* Population count sign */}
        {panic < 0.5 && revealProgress > 0.8 && (
          <g transform="translate(540,180)">
            <rect x={-160} y={-40} width={320} height={80} rx={12}
              fill="#2a1a0a" stroke="#ffc820" strokeWidth={4} opacity={0.9}/>
            <text x={0} y={4} textAnchor="middle" dominantBaseline="middle"
              fill="white" fontSize={30} fontFamily="'MoajNaskh', sans-serif">
              🦠 تعداد السكان: ٣٢٧ نوع
            </text>
          </g>
        )}

        {/* Panic SOS signals */}
        {panic > 0.4 && (
          <>
            {[200,500,800].map((x,i) => (
              <g key={i} transform={`translate(${x},${900 + i * 100})`}>
                <rect x={-28} y={-18} width={56} height={36} rx={6}
                  fill="#ff2020" stroke="white" strokeWidth={3} opacity={0.9}/>
                <text x={0} y={0} textAnchor="middle" dominantBaseline="middle"
                  fill="white" fontSize={22} fontWeight="bold">
                  SOS
                </text>
              </g>
            ))}
          </>
        )}
      </g>
    </g>
  );
};
