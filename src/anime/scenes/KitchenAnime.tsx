import React from "react";
import { OC, PO, SL, W, H } from "../AnimeCanvas";

interface KitchenProps { frame: number; withSink?: boolean; }

export const KitchenAnime: React.FC<KitchenProps> = ({ frame, withSink = true }) => {
  const t = frame / 30;

  return (
    <g>
      {/* ── Background gradient ── */}
      <defs>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f7f0e0"/>
          <stop offset="100%" stopColor="#ede0c4"/>
        </linearGradient>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#c8b898"/>
          <stop offset="100%" stopColor="#b0a080"/>
        </linearGradient>
      </defs>

      {/* Wall */}
      <rect x={0} y={0} width={W} height={H} fill="url(#wallGrad)"/>

      {/* Ceiling band */}
      <rect x={0} y={0} width={W} height={60} fill="#d4c8a8"/>

      {/* ── Tiles backsplash ── */}
      <rect x={0} y={1050} width={W} height={280} fill="#ede6d2"/>
      {Array.from({ length: 15 }, (_, xi) =>
        Array.from({ length: 5 }, (_, yi) => (
          <rect key={`t${xi}-${yi}`}
            x={xi * 72} y={1056 + yi * 54}
            width={70} height={52} rx={3}
            fill="none" stroke="#c8bda0" strokeWidth={1.5}/>
        ))
      )}
      {/* Tile accent */}
      {Array.from({ length: 15 }, (_, xi) =>
        Array.from({ length: 5 }, (_, yi) => (
          <circle key={`td${xi}-${yi}`}
            cx={xi * 72 + 36} cy={1056 + yi * 54 + 26} r={5}
            fill="#c8a870" opacity={0.4}/>
        ))
      )}

      {/* ── Window ── */}
      <rect x={180} y={520} width={280} height={380} rx={8}
        fill="#2a3850" stroke={OC} strokeWidth={SL} style={PO}/>
      {/* Window sky */}
      <rect x={188} y={528} width={264} height={364} rx={4} fill="#c8ddf4"/>
      {/* Window grill */}
      <rect x={319} y={528} width={4} height={364} fill="#e8d8b4" stroke={OC} strokeWidth={2}/>
      <rect x={188} y={710} width={264} height={4} fill="#e8d8b4" stroke={OC} strokeWidth={2}/>
      {/* Outside scene */}
      <rect x={188} y={800} width={264} height={92} rx={2} fill="#94c4a8"/>
      {/* Palm silhouette */}
      <rect x={295} y={620} width={6} height={130} fill="#2a3820"/>
      {[[-28,20],[-20,-10],[4,-18],[20,-8],[22,18]].map(([dx,dy],i) => (
        <path key={i}
          d={`M299,660 Q${299+dx/2},${656} ${299+dx},${660+dy}`}
          fill="none" stroke="#2a3820" strokeWidth={4}/>
      ))}

      {/* ── Upper cabinets ── */}
      <rect x={620} y={380} width={460} height={320} rx={6}
        fill="#c8a878" stroke={OC} strokeWidth={SL} style={PO}/>
      {/* Cabinet panels */}
      {[620, 850].map(cx => (
        <g key={cx}>
          <rect x={cx+8} y={396} width={214} height={292} rx={4}
            fill="#b89060" stroke={OC} strokeWidth={3} style={PO}/>
          <rect x={cx+16} y={404} width={198} height={276} rx={2}
            fill="#c8a870" stroke={OC} strokeWidth={2.5} style={PO}/>
        </g>
      ))}
      {/* Cabinet handles */}
      <rect x={690} y={520} width={6} height={40} rx={3} fill="#888" stroke={OC} strokeWidth={2} style={PO}/>
      <rect x={920} y={520} width={6} height={40} rx={3} fill="#888" stroke={OC} strokeWidth={2} style={PO}/>

      {/* ── Counter top ── */}
      <rect x={0} y={1050} width={W} height={28} rx={4}
        fill="#d8c8a0" stroke={OC} strokeWidth={SL} style={PO}/>
      <rect x={0} y={1050} width={W} height={6} fill="#e8d8b8"/>

      {/* ── Lower cabinets ── */}
      <rect x={0} y={1078} width={W} height={480} fill="#c8a870" stroke={OC} strokeWidth={SL} style={PO}/>
      {[20, 290, 560, 830].map(cx => (
        <g key={cx}>
          <rect x={cx} y={1090} width={250} height={440} rx={5}
            fill="#b89050" stroke={OC} strokeWidth={3} style={PO}/>
          <rect x={cx+10} y={1100} width={230} height={420} rx={3}
            fill="#c8a060" stroke={OC} strokeWidth={2} style={PO}/>
          <rect x={cx+112} y={1300} width={28} height={8} rx={4}
            fill="#888" stroke={OC} strokeWidth={2} style={PO}/>
        </g>
      ))}

      {/* ── Floor ── */}
      <rect x={0} y={1558} width={W} height={362} fill="url(#floorGrad)"/>
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={`f${i}`} x={i * 155} y={1558} width={2} height={362} fill="#b8a888" opacity={0.5}/>
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={`fh${i}`} x={0} y={1558 + i * 90} width={W} height={2} fill="#b8a888" opacity={0.5}/>
      ))}

      {/* ── Sink (if shown) ── */}
      {withSink && (
        <g>
          <rect x={320} y={1038} width={440} height={28} rx={6}
            fill="#d0d8e0" stroke={OC} strokeWidth={SL} style={PO}/>
          <rect x={340} y={1066} width={400} height={30} rx={4}
            fill="#b8c4cc" stroke={OC} strokeWidth={4} style={PO}/>
          {/* Faucet */}
          <rect x={520} y={950} width={40} height={102} rx={8}
            fill="#c0c8d0" stroke={OC} strokeWidth={SL} style={PO}/>
          <ellipse cx={540} cy={950} rx={22} ry={10}
            fill="#d0d8e0" stroke={OC} strokeWidth={4} style={PO}/>
          {/* Running water */}
          {Array.from({ length: 3 }, (_, i) => (
            <path key={i}
              d={`M${530 + i * 5},960 Q${528 + i * 5},${1000 + i * 8} ${530 + i * 5},1038`}
              fill="none" stroke="#b0d8f0" strokeWidth={2.5} opacity={0.7}/>
          ))}
          {/* Water sparkle */}
          <circle cx={540} cy={1030 + (Math.floor(t * 10) % 5) * 2}
            r={3} fill="white" opacity={0.8}/>
        </g>
      )}

      {/* ── Pendant lamp ── */}
      <rect x={W/2 - 2} y={0} width={4} height={160}
        fill="#888" stroke={OC} strokeWidth={2}/>
      <path d={`M${W/2 - 60},170 L${W/2 - 40},160 L${W/2 + 40},160 L${W/2 + 60},170 Z`}
        fill="#c8a860" stroke={OC} strokeWidth={SL} style={PO}/>
      <rect x={W/2 - 38} y={170} width={76} height={60} rx={6}
        fill="#ffe8a0" stroke={OC} strokeWidth={SL} style={PO}/>
      {/* Lamp glow */}
      <ellipse cx={W/2} cy={240} rx={280} ry={120} fill="#fff8d0" opacity={0.18}/>
      <ellipse cx={W/2} cy={240} rx={140} ry={60}  fill="#fff8d0" opacity={0.18}/>

      {/* ── Dallah on counter ── */}
      <g transform="translate(850,1020)">
        <path d="M0,0 C-16,-4 -24,-20 -22,-38 C-20,-54 -8,-60 0,-58 C8,-60 20,-54 22,-38 C24,-20 16,-4 0,0 Z"
          fill="#c8a040" stroke={OC} strokeWidth={3} style={PO}/>
        <rect x={-6} y={-62} width={12} height={6} rx={3}
          fill="#c8a040" stroke={OC} strokeWidth={2} style={PO}/>
        <path d="M22,-36 Q32,-20 24,-10" fill="none" stroke={OC} strokeWidth={2.5}/>
      </g>

      {/* ── Spice jars ── */}
      {[720, 760, 800].map((x, i) => (
        <g key={i} transform={`translate(${x},1012)`}>
          <rect x={-10} y={-36} width={20} height={36} rx={4}
            fill={["#e06040","#d0b040","#60a040"][i]} stroke={OC} strokeWidth={2.5} style={PO}/>
          <rect x={-7} y={-40} width={14} height={6} rx={2}
            fill="#888" stroke={OC} strokeWidth={2} style={PO}/>
        </g>
      ))}
    </g>
  );
};
