/**
 * "CSI المطبخ: مسرح الجريمة — الإسفنجة"
 * 30-second antibacterial sponge ad.
 * Style: anime/cartoon (totofosh reference).
 * 900 frames @ 30 fps.
 */
import React from "react";
import { AbsoluteFill, Audio, interpolate, Easing, Sequence, staticFile, useCurrentFrame } from "remotion";
import { W, H } from "./AnimeCanvas";
import { Sara } from "./characters/Sara";
import { KitchenAnime } from "./scenes/KitchenAnime";
import { MicroWorld } from "./scenes/MicroWorld";
import { Caption } from "../pixel/Caption";

export const BACTERIA_FRAMES = 900; // 30 s

const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

// ── Caption helper (reuses existing Caption component) ────────────────────────
const Cap: React.FC<{
  from: number; to: number; lines: string[];
  top?: number; size?: number;
}> = ({ from, to, lines, top = 300, size = 70 }) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const inP  = interpolate(f, [from, from + 10], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const outP = interpolate(f, [to - 8, to], [1, 0], { extrapolateLeft: "clamp" });
  const ul   = interpolate(f, [from + 8, from + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - inP) * 20}px)` }}>
      <Caption lines={lines} top={top} size={size} opacity={Math.min(inP, outP)} underlineProgress={ul}/>
    </div>
  );
};

// ── Old sponge object ─────────────────────────────────────────────────────────
const OldSponge: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => (
  <svg viewBox="-60 -40 120 80" width={120} height={80}
    style={{ position: "absolute", left: x - 60, top: y - 40, transform: `rotate(${rot}deg)` }}>
    <rect x={-54} y={-34} width={108} height={68} rx={10}
      fill="#b8c840" stroke="#1a1008" strokeWidth={5} style={{ paintOrder: "stroke fill" }}/>
    {/* Scratched/worn top */}
    <rect x={-54} y={-34} width={108} height={24} rx={8}
      fill="#98a830" stroke="#1a1008" strokeWidth={4} style={{ paintOrder: "stroke fill" }}/>
    {/* Pores */}
    {Array.from({ length: 8 }, (_, i) => (
      <ellipse key={i} cx={-40 + i * 11} cy={-10 + (i % 2) * 14} rx={4} ry={3}
        fill="#708020" opacity={0.6}/>
    ))}
    {/* Stain */}
    <ellipse cx={12} cy={8} rx={18} ry={10} fill="#808820" opacity={0.4}/>
  </svg>
);

// ── Smell lines (stink waves) ────────────────────────────────────────────────
const StinkWaves: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => {
  const t = frame / 30;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      {[0, 1, 2].map(i => {
        const p  = ((t * 0.5 + i * 0.33) % 1);
        const dy = -p * 160;
        const sx = Math.sin(t * 3 + i * 1.2) * 20;
        return (
          <path key={i}
            d={`M${x + sx},${y + dy} Q${x + 25 + sx},${y - 30 + dy} ${x + sx},${y - 60 + dy}`}
            fill="none" stroke="#80b060" strokeWidth={3}
            opacity={(1 - p) * 0.7} strokeDasharray="6 4"/>
        );
      })}
    </svg>
  );
};

// ── Scene 1: Kitchen — Sara washing dishes ────────────────────────────────────
const SceneKitchen: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame() - from;
  if (f < 0) return null;
  const zoom = interpolate(f, [0, 90], [1, 1.05], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });

  return (
    <AbsoluteFill style={{ backgroundColor: "#f7f0e0", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 65%" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
          <KitchenAnime frame={f} withSink/>
          <Sara cx={W / 2} cy={700} expr="normal" pose="washDishes" frame={f}/>
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: Sara discovers — smells sponge ───────────────────────────────────
const SceneSmell: React.FC<{ from: number }> = ({ from }) => {
  const f   = useCurrentFrame() - from;
  if (f < 0) return null;
  const expr = f > 40 ? "disgusted" : "normal";
  const pose = f > 20 ? "smellSponge" : "stand";
  const startStink = f > 40;

  return (
    <AbsoluteFill style={{ backgroundColor: "#f7f0e0", overflow: "hidden" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
        <KitchenAnime frame={f} withSink={false}/>
        <Sara cx={W / 2} cy={700} expr={expr} pose={pose} frame={f}/>
      </svg>
      {/* Sponge in hand */}
      <OldSponge x={W / 2 + 220} y={580} rot={-10}/>
      {startStink && <StinkWaves x={W / 2 + 220} y={580} frame={f}/>}
    </AbsoluteFill>
  );
};

// ── Scene 3: Sara horror ──────────────────────────────────────────────────────
const SceneHorror: React.FC<{ from: number }> = ({ from }) => {
  const f    = useCurrentFrame() - from;
  if (f < 0) return null;
  const shakeX = f < 30 ? Math.sin(f * 2.3) * 8 : 0;
  const shakeY = f < 30 ? Math.cos(f * 3.1) * 5 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#f7f0e0", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${shakeX}px,${shakeY}px)` }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
          <KitchenAnime frame={f} withSink={false}/>
          <Sara cx={W / 2} cy={700} expr="shocked" pose="react" frame={f}/>
        </svg>
      </AbsoluteFill>
      <OldSponge x={W / 2 + 100} y={1000} rot={15}/>
      {/* Horror flash */}
      {f < 8 && (
        <AbsoluteFill style={{ backgroundColor: "#ff4040", opacity: (8 - f) / 8 * 0.5 }}/>
      )}
    </AbsoluteFill>
  );
};

// ── Scene 4: Bacteria world reveal ────────────────────────────────────────────
const SceneMicroWorld: React.FC<{ from: number; dur: number }> = ({ from, dur }) => {
  const f       = useCurrentFrame() - from;
  if (f < 0) return null;
  const revealP = cl(f / 30);
  // Panic starts at frame dur-100 (last ~3s)
  const panicF  = cl((f - (dur - 100)) / 80);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
        <MicroWorld frame={f} revealProgress={revealP} panic={panicF}/>
      </svg>
      {/* Sara face peeking from top during panic */}
      {panicF > 0 && (
        <div style={{
          position: "absolute", top: 0, left: 0, width: "100%",
          height: `${360 + panicF * 100}px`, overflow: "hidden",
        }}>
          <svg viewBox={`0 0 ${W} 540`} style={{ width: "100%", height: "100%" }}>
            <KitchenAnime frame={f} withSink={false}/>
            <Sara cx={W/2} cy={280} expr="worried" pose="stand" frame={f} scale={0.65}/>
          </svg>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ── Scene 5: Clean resolution ─────────────────────────────────────────────────
const SceneClean: React.FC<{ from: number }> = ({ from }) => {
  const f    = useCurrentFrame() - from;
  if (f < 0) return null;
  const zoom = interpolate(f, [0, 60], [1.1, 1.0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#f7f0e0", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
          <KitchenAnime frame={f} withSink/>
          <Sara cx={W / 2} cy={700} expr="happy" pose="stand" frame={f}/>
          {/* Clean dish sparkles */}
          {[380,540,700,860].map((x,i) => {
            const puls = Math.sin(f / 8 + i) > 0.6;
            return puls ? (
              <svg key={i} viewBox="0 0 20 20" width={28} height={28}
                style={{ position: "absolute", left: x, top: 980 }}>
                <path d="M10,2 L10,18 M2,10 L18,10 M4,4 L16,16 M16,4 L4,16"
                  stroke="#ffc820" strokeWidth={2.5} strokeLinecap="round"/>
              </svg>
            ) : null;
          })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 6: End card ─────────────────────────────────────────────────────────
const SceneEndCard: React.FC<{ from: number }> = ({ from }) => {
  const f   = useCurrentFrame() - from;
  if (f < 0) return null;
  const fadeIn = cl(f / 20);
  const logoY  = interpolate(f, [10, 40], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b3a85", opacity: fadeIn, overflow: "hidden" }}>
      {/* Background gradient */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="endBg" cx="50%" cy="40%">
            <stop offset="0%"   stopColor="#1e6fde"/>
            <stop offset="100%" stopColor="#061a50"/>
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="url(#endBg)"/>
        {/* Light rays */}
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i}
            d={`M${W/2},${H*0.3} L${W/2 + Math.cos(i/8*Math.PI*2)*900},${H*0.3 + Math.sin(i/8*Math.PI*2)*900}`}
            stroke="white" strokeWidth={40} opacity={0.04}/>
        ))}
        {/* Moaj sponge hero (large) */}
        <g transform={`translate(${W/2},${H * 0.38 + logoY})`}>
          <rect x={-220} y={-140} width={440} height={280} rx={30}
            fill="#0b3a85" stroke="white" strokeWidth={8}/>
          <rect x={-200} y={-120} width={400} height={240} rx={20}
            fill="#1557c0"/>
          <rect x={-200} y={-120} width={400} height={80}
            fill="#5faaf7" opacity={0.5}/>
          {/* Wire rows */}
          {[-20,0,20,40,60].map((yo,i) => (
            <path key={i} d={`M-200,${yo} Q0,${yo-15} 200,${yo}`}
              fill="none" stroke="#b0bcc8" strokeWidth={3} opacity={0.6}/>
          ))}
          {/* Gold glitter */}
          {Array.from({ length: 12 }, (_, i) => {
            const gx = -180 + i * 32;
            const gy = -80 + (i % 3) * 50;
            return (
              <path key={i} d={`M${gx},${gy-8} L${gx},${gy+8} M${gx-8},${gy} L${gx+8},${gy}`}
                stroke="#ffc820" strokeWidth={3} strokeLinecap="round"/>
            );
          })}
          {/* موج text on sponge */}
          <text x={0} y={20} textAnchor="middle" dominantBaseline="middle"
            fill="white" fontSize={72} fontWeight="bold"
            fontFamily="'MoajCairo', sans-serif"
            stroke="#0b3a85" strokeWidth={4} style={{ paintOrder: "stroke fill" }}>
            موج
          </text>
        </g>
        {/* Bacteria characters fleeing off screen (comedic) */}
        <g transform={`translate(${-100 - f * 8},${H * 0.68})`} opacity={0.6}>
          <circle cx={0} cy={0} r={40} fill="#5cb85c" stroke="white" strokeWidth={3}/>
          <circle cx={-15} cy={-10} r={10} fill="white"/>
          <circle cx={ 15} cy={-10} r={10} fill="white"/>
        </g>
      </svg>
      {/* Taglines */}
      <div style={{
        position: "absolute", bottom: 480, width: "100%", textAlign: "center",
        fontFamily: "'MoajNaskh', sans-serif", fontSize: 56,
        color: "white", fontWeight: "bold",
        textShadow: "0 4px 20px rgba(0,0,80,0.6)",
        opacity: cl((f - 20) / 15),
        transform: `translateY(${cl(1 - (f-20)/15) * 24}px)`,
      }}>
        مضادة للبكتيريا
      </div>
      <div style={{
        position: "absolute", bottom: 380, width: "100%", textAlign: "center",
        fontFamily: "'MoajNaskh', sans-serif", fontSize: 42,
        color: "#a9d3ff", fontWeight: "bold",
        opacity: cl((f - 30) / 15),
      }}>
        تبقى نظيفة أطول
      </div>
      <div style={{
        position: "absolute", bottom: 240, width: "100%", textAlign: "center",
        fontFamily: "'MoajNaskh', sans-serif", fontSize: 38,
        color: "#ffc820", fontWeight: "bold",
        opacity: cl((f - 42) / 15),
      }}>
        دوّرها على الرف
      </div>
    </AbsoluteFill>
  );
};

// ── Main composition ──────────────────────────────────────────────────────────
export const BacteriaAd: React.FC = () => {
  // Timeline
  const T = {
    kitchen:  [0,   120],  // 0–4s   : Sara washing, normal
    smell:    [100, 90],   // 3–6s   : Sara smells sponge
    horror:   [180, 60],   // 6–8s   : shock reaction
    micro:    [220, 360],  // 7–19s  : bacteria world (220→580)
    clean:    [570, 120],  // 19–23s : clean resolution
    endCard:  [660, 240],  // 22–30s : end card
  } as const;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>

      {/* Scene 1 */}
      <Sequence from={T.kitchen[0]} durationInFrames={T.kitchen[1]}>
        <SceneKitchen from={T.kitchen[0]}/>
        <Cap from={10} to={T.kitchen[1] - 4} lines={["سارة…", "تغسل الصحون."]} top={280} size={68}/>
      </Sequence>

      {/* Scene 2 */}
      <Sequence from={T.smell[0]} durationInFrames={T.smell[1]}>
        <SceneSmell from={T.smell[0]}/>
        <Cap from={30} to={T.smell[1] - 4} lines={["تمسك الإسفنجة…", "*تشمها.*"]} top={280} size={68}/>
      </Sequence>

      {/* Scene 3 */}
      <Sequence from={T.horror[0]} durationInFrames={T.horror[1]}>
        <SceneHorror from={T.horror[0]}/>
        <Cap from={6} to={T.horror[1] - 4} lines={["من إمتى…", "هذي *الإسفنجة؟!*"]} top={280} size={72}/>
      </Sequence>

      {/* Scene 4 — bacteria world */}
      <Sequence from={T.micro[0]} durationInFrames={T.micro[1]}>
        <SceneMicroWorld from={T.micro[0]} dur={T.micro[1]}/>
        {/* Captions */}
        <Cap from={10}  to={100} lines={["داخل إسفنجتك…", "*حضارة كاملة.*"]} top={120} size={68}/>
        <Cap from={110} to={200} lines={["بختاوي…", "يقيم فيها *٨ أشهر.*"]} top={120} size={64}/>
        <Cap from={210} to={300} lines={["ونوفة…", "*مستريحة* على الجوال."]} top={120} size={64}/>
        <Cap from={310} to={358} lines={["ثم…", "*جاء موج.*"]}  top={120} size={72}/>
      </Sequence>

      {/* Scene 5 */}
      <Sequence from={T.clean[0]} durationInFrames={T.clean[1]}>
        <SceneClean from={T.clean[0]}/>
        <Cap from={12} to={T.clean[1] - 4} lines={["إسفنجة *نظيفة.*", "صحون نظيفة."]} top={280} size={68}/>
      </Sequence>

      {/* Scene 6 — end card */}
      <Sequence from={T.endCard[0]} durationInFrames={T.endCard[1]}>
        <SceneEndCard from={T.endCard[0]}/>
      </Sequence>

      <Audio src={staticFile("audio/bacteria-ad.wav")}/>
    </AbsoluteFill>
  );
};
