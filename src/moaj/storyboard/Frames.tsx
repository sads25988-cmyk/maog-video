import React from "react";
import { AbsoluteFill } from "remotion";
import { C, SW } from "../theme";
import { KineticText } from "../KineticText";
import { KitchenClose, KitchenDefs, KitchenWide } from "../art/Kitchen";
import { UmmFahad, Head, Hand } from "../art/UmmFahad";
import { PotOpen, PotSide, Sparkle } from "../art/Pot";
import { Crumbs, Doorbell, FrontDoor, Kabsa, MoajSponge, OldSponge, Towel } from "../art/Props";
import { MoajLogo } from "../Logo";
import { FONT } from "../fonts";

const O = C.ink;

const Stage: React.FC<{ children: React.ReactNode; filter?: string }> = ({ children, filter }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter }}>
    <KitchenDefs />
    {children}
  </svg>
);

const MotionLines: React.FC<{ x: number; y: number; rot?: number; n?: number; len?: number }> = ({
  x,
  y,
  rot = 0,
  n = 3,
  len = 90,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={O} strokeWidth={10} strokeLinecap="round">
    {Array.from({ length: n }).map((_, i) => (
      <line key={i} x1={0} y1={i * 34} x2={len - i * 18} y2={i * 34} />
    ))}
  </g>
);

// ---------------------------------------------------------------- 01  0–3s
export const F01: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <KitchenWide ovenOpen />
      <UmmFahad
        x={600}
        y={760}
        scale={0.9}
        expression="proud"
        held={<PotSide x={0} y={470} s={0.72} lid steam steamPhase={1} />}
        armL={{ hand: [-262, 520], pose: "mitt", handAngle: -20 }}
        armR={{ hand: [262, 520], pose: "mitt", handAngle: 200 }}
      />
    </Stage>
    <KineticText still lines={[{ sentence: "أم فهد… وقِدر *الكبسة.*" }]} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- 02  3–6s
export const F02: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <KitchenWide />
      <UmmFahad
        x={680}
        y={800}
        scale={0.85}
        expression="shocked"
        held={<PotOpen id="f2pot" x={0} y={420} r={230} />}
        armL={{ hand: [-300, 400], pose: "open", handAngle: 10 }}
        armR={{ hand: [300, 400], pose: "open", handAngle: 170 }}
      />
      <Kabsa x={250} y={1350} s={0.62} sparkle />
    </Stage>
    <KineticText still lines={[{ sentence: "الكبسة؟ *تحفة.*" }, { sentence: "القدر؟ *لزق.*" }]} gap={0} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- 03  6–12s
const ShrinkStrip: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-240} y={-95} width={480} height={190} rx={34} fill={C.cream} stroke={O} strokeWidth={SW} />
    {/* RTL: biggest on the right, shrinking to the left */}
    <g transform="translate(140 0)">
      <OldSponge s={0.55} />
    </g>
    <g transform="translate(-10 6)">
      <OldSponge s={0.38} />
    </g>
    <g transform="translate(-150 12)">
      <OldSponge s={0.2} />
    </g>
    {[60, -80].map((ax) => (
      <path key={ax} d={`M${ax + 14} 0 L${ax - 14} 0 M${ax - 2} -12 L${ax - 14} 0 L${ax - 2} 12`} fill="none" stroke={O} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    ))}
  </g>
);

export const F03: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <KitchenClose counterY={1100} />
      <UmmFahad
        x={330}
        y={800}
        scale={0.95}
        expression="determined"
        heldScene={
          <g>
            <rect x={-10} y={1100} width={1100} height={830} fill={C.counter} stroke={O} strokeWidth={SW} />
            <rect x={-10} y={1100} width={1100} height={26} fill="#EEDDBF" />
            <PotOpen id="f3pot" x={600} y={1480} r={400} />
            <Crumbs x={720} y={1470} n={11} seed={4} />
          </g>
        }
        armL={{ hand: [-80, 470], pose: "open", handAngle: 70 }}
        armR={{ hand: [300, 640], pose: "fist", item: <g transform="translate(55 6) rotate(90)"><OldSponge s={0.8} /></g> }}
      />
      <MotionLines x={860} y={1480} rot={-20} />
      <MotionLines x={500} y={1640} rot={160} />
      <ShrinkStrip x={760} y={830} />
    </Stage>
    <KineticText still lines={[{ sentence: "فركة… فركتين… *ثلاث.*" }]} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- 04  12–16s
export const F04: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <KitchenClose counterY={1150} />
      <UmmFahad
        x={560}
        y={820}
        scale={1}
        expression="suspicious"
        heldScene={
          <g>
            <rect x={-10} y={1260} width={1100} height={700} fill={C.counter} stroke={O} strokeWidth={SW} />
            <PotOpen id="f4pot" x={540} y={1700} r={420}>
              <g transform="translate(-30 20)">
                <OldSponge s={0.9} half="right" rot={-12} />
              </g>
            </PotOpen>
          </g>
        }
        armL={{ hand: [-170, 640], pose: "open", handAngle: 80 }}
        armR={{ hand: [250, 240], pose: "fist", handAngle: -100, item: <g transform="translate(70 0) rotate(100)"><OldSponge s={0.85} half="left" /></g> }}
      />
    </Stage>
    <KineticText still size={96} lines={[{ sentence: "نص الإسفنجة بالقدر،" }, { sentence: "ونصها *بيدها.*" }]} gap={0} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- 05  16–22s  (montage)
const Panel: React.FC<{ x: number; y: number; w: number; h: number; vb: string; children: React.ReactNode; rot?: number }> = ({
  x,
  y,
  w,
  h,
  vb,
  children,
  rot = 0,
}) => (
  <g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
    <rect x={x + 10} y={y + 14} width={w} height={h} rx={26} fill={O} />
    <svg x={x} y={y} width={w} height={h} viewBox={vb} preserveAspectRatio="xMidYMid slice">
      {children}
    </svg>
    <rect x={x} y={y} width={w} height={h} rx={26} fill="none" stroke={O} strokeWidth={14} />
  </g>
);

const BrokenNail: React.FC = () => (
  <g>
    <rect x={0} y={0} width={500} height={600} fill={C.wallShade} />
    <g transform="translate(250 330) rotate(-20)" stroke={O} strokeWidth={SW} strokeLinejoin="round">
      <rect x={-90} y={-60} width={180} height={420} rx={90} fill={C.skin} />
      <path d="M-58 -10 Q-60 -84 0 -88 Q60 -84 58 -10 L58 40 L-58 40 Z" fill="#F2D8C8" />
      <path d="M-58 -36 L-20 -10 L-34 20 L6 34 L-6 60" fill="none" strokeWidth={8} />
      <path d="M-20 70 Q0 90 20 70" fill="none" stroke={C.skinShade} strokeWidth={7} />
    </g>
    {/* chip flying off */}
    <path d="M360 120 L410 110 L400 150 Z" fill="#F2D8C8" stroke={O} strokeWidth={7} strokeLinejoin="round" />
    <g stroke={O} strokeWidth={10} strokeLinecap="round">
      <path d="M120 120 L160 160 M90 200 L140 210 M170 80 L180 130" />
      <path d="M430 210 L470 190 M440 260 L490 262" />
    </g>
  </g>
);

const SplashPanel: React.FC = () => (
  <g>
    <rect x={0} y={0} width={500} height={600} fill="url(#tilesAccent)" />
    <UmmFahad x={250} y={200} scale={0.62} expression="shocked" wet armL={{ hand: [-400, 120], pose: "open", bend: -1 }} armR={{ hand: [400, 120], pose: "open", bend: 1 }} />
    <g stroke={O} strokeWidth={7} strokeLinejoin="round">
      <path d="M90 600 Q60 470 140 420 Q120 500 190 470 Q200 400 260 380 Q260 470 320 450 Q350 400 400 420 Q440 480 410 600 Z" fill={C.water} />
      {[
        [110, 360, 18],
        [200, 320, 14],
        [330, 340, 20],
        [420, 380, 12],
        [60, 430, 12],
      ].map(([cx, cy, r], i) => (
        <path key={i} d={`M${cx} ${cy - r * 2} Q${cx - r} ${cy} ${cx} ${cy + r} Q${cx + r} ${cy} ${cx} ${cy - r * 2} Z`} fill={C.water} />
      ))}
    </g>
  </g>
);

const BellPanel: React.FC = () => (
  <g>
    <rect x={0} y={0} width={500} height={600} fill={C.wall} />
    <Doorbell x={230} y={300} s={1.05} ringing />
    {/* guest's finger pressing the bell */}
    <rect x={330} y={262} width={220} height={84} rx={30} fill={C.white} stroke={O} strokeWidth={SW} />
    <g transform="translate(340 304) rotate(180)">
      <Hand pose="point" mirror={false} />
    </g>
  </g>
);

const GuestsPanel: React.FC = () => (
  <g>
    <rect x={0} y={0} width={500} height={600} fill={C.wallShade} />
    <FrontDoor x={250} y={-20} s={0.62} guests />
  </g>
);

export const F05: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <rect x={0} y={0} width={1080} height={1920} fill={C.wall} />
      <rect x={0} y={0} width={1080} height={1920} fill="url(#tilesAccent)" opacity={0.5} />
      <Panel x={40} y={700} w={485} h={540} vb="0 0 500 600" rot={-2}>
        <BrokenNail />
      </Panel>
      <Panel x={555} y={690} w={485} h={540} vb="0 0 500 600" rot={2}>
        <SplashPanel />
      </Panel>
      <Panel x={40} y={1270} w={485} h={540} vb="0 0 500 600" rot={1.5}>
        <BellPanel />
      </Panel>
      <Panel x={555} y={1280} w={485} h={540} vb="0 0 500 600" rot={-1.5}>
        <GuestsPanel />
      </Panel>
    </Stage>
    <KineticText
      still
      size={88}
      top={150}
      gap={0}
      lines={[{ sentence: "الأظافر راحت،" }, { sentence: "الموية طشّت…" }, { sentence: "والضيوف؟ *يدقّون.*" }]}
    />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- 06  22–25s
const PotCloseScene: React.FC<{ id: string }> = ({ id }) => (
  <g>
    <KitchenClose counterY={420} />
    <PotOpen id={id} x={540} y={1180} r={480} />
    {/* peeking face, bottom-left */}
    <g transform="translate(120 1830) scale(0.95) rotate(12)">
      <Head expression="defeated" />
    </g>
    <rect x={0} y={0} width={1080} height={1920} fill="url(#vignette)" />
  </g>
);

export const F06: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <PotCloseScene id="f6pot" />
    </Stage>
    <KineticText still lines={[{ sentence: "والقدر… *محلّه.*" }]} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- 07  25–27s  (freeze)
export const F07: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#111" }}>
    <Stage filter="grayscale(1) contrast(1.05) brightness(0.8)">
      <PotCloseScene id="f7pot" />
    </Stage>
    {/* freeze frame border */}
    <div style={{ position: "absolute", inset: 28, border: `10px solid ${C.white}`, borderRadius: 24, opacity: 0.85 }} />
    <KineticText still center size={190} lines={[{ sentence: "*لحظة.*" }]} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- 08  27–33s  (MOAJ reveal)
export const F08: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <KitchenClose counterY={640} />
      <PotOpen id="f8pot" x={540} y={1440} r={430} split={60} shine />
      <g transform="translate(560 1000)">
        <MoajSponge s={1.15} rot={-8} glow />
      </g>
      <g stroke={O} strokeWidth={10} strokeLinecap="round">
        <line x1={420} y1={700} x2={420} y2={800} />
        <line x1={560} y1={660} x2={560} y2={780} />
        <line x1={700} y1={700} x2={700} y2={800} />
      </g>
      <g transform="translate(940 1760) scale(0.8) rotate(-14)">
        <Head expression="amazed" />
      </g>
      <Sparkle x={220} y={820} s={0.9} color={C.goldLight} />
      <Sparkle x={880} y={900} s={0.6} color={C.white} />
      <Sparkle x={300} y={1120} s={0.5} color={C.goldLight} />
    </Stage>
    <KineticText
      still
      size={80}
      top={140}
      gap={0}
      lines={[
        { sentence: "سلك إيطالي يحكّ" },
        { sentence: "بس *ما يخرّش؟*" },
        { sentence: "وجليتر ذهبي يشيل" },
        { sentence: "الحرقة من *أول فركة؟*" },
      ]}
    />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- 09  33–38s  (happy replay)
export const F09: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <rect x={0} y={0} width={1080} height={1920} fill={C.wall} />
      <rect x={0} y={1180} width={1080} height={740} fill={C.wallShade} />
      <FrontDoor x={790} y={590} s={0.88} guests open={0.72} />
      <rect x={-10} y={1690} width={1100} height={240} fill={C.woodLight} stroke={O} strokeWidth={SW} />
      <Doorbell x={420} y={800} s={0.55} ringing />
      <UmmFahad
        x={330}
        y={1050}
        scale={0.82}
        expression="happy"
        held={
          <g transform="translate(-205 260) rotate(8)">
            <Towel />
          </g>
        }
        armL={{ hand: [-250, 600], pose: "open", handAngle: 95 }}
        armR={{ hand: [420, 400], pose: "open", handAngle: -10 }}
      />
      {/* replay inset: the pot now shines */}
      <g transform="translate(150 1720)">
        <circle r={150} fill={C.cream} stroke={O} strokeWidth={12} />
        <clipPath id="insetClip">
          <circle r={140} />
        </clipPath>
        <g clipPath="url(#insetClip)">
          <PotOpen id="f9pot" x={0} y={16} r={130} clean shine />
        </g>
      </g>
    </Stage>
    <KineticText still size={92} gap={0} lines={[{ sentence: "وتفتح الباب" }, { sentence: "قبل ما يخلص *الجرس؟*" }]} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------- 10  38–45s  (end card)
export const F10: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <KitchenClose counterY={1500} />
      <rect x={0} y={0} width={1080} height={1920} fill={C.cream} opacity={0.45} />
      <ellipse cx={540} cy={1560} rx={360} ry={46} fill={O} opacity={0.15} />
      <PotSide x={540} y={1210} s={1.0} shiny />
      <g transform="translate(640 1124)">
        <MoajSponge s={0.88} rot={-6} />
      </g>
      <Sparkle x={860} y={960} s={0.8} color={C.goldLight} />
      <Sparkle x={240} y={1060} s={1} color={C.white} />
    </Stage>
    <div style={{ position: "absolute", top: 210, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <MoajLogo size={250} />
    </div>
    <KineticText still top={640} size={84} maxWidth={1040} lines={[{ sentence: "موج. يهتم باللي *يهمك.*" }]} />
    <div
      dir="rtl"
      style={{
        position: "absolute",
        bottom: 170,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 64,
          color: C.white,
          background: C.blue,
          border: `8px solid ${C.ink}`,
          borderRadius: 999,
          padding: "6px 56px 14px",
          boxShadow: `0 10px 0 ${C.ink}`,
        }}
      >
        دوّرها على الرف
      </div>
    </div>
  </AbsoluteFill>
);

export const FRAMES = [F01, F02, F03, F04, F05, F06, F07, F08, F09, F10];
