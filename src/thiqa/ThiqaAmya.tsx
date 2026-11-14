import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import beats from "./beats.json";
import { F } from "./fonts";
import { H, Key, LAB, NIGHT, PanelShot, Shot, W, noise1, rand } from "./camera";
import { DoorLight, Dust, Flash, Grain, Rain, SpeedLines, Waves } from "./fx";
import { Footnote, GOLD, Label, Slam, Sub } from "./type";

export const THIQA_FPS = 30;
export const THIQA_FRAMES = Math.round(beats.total * THIQA_FPS);

const B = beats;
const fr = (s: number) => Math.round(s * THIQA_FPS);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

const Seq: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b) - fr(a)}>
    {children}
  </Sequence>
);

// Manga panels inside the night key visual (authored on the 941x1672 original).
const KIDS: [number, number][] = [
  [0, 0],
  [458, 0],
  [448, 545],
  [0, 545],
];
const HUSBAND: [number, number][] = [
  [474, 0],
  [941, 0],
  [941, 302],
  [498, 392],
];
const GRANNY: [number, number][] = [
  [518, 404],
  [941, 322],
  [941, 586],
  [598, 692],
];

/* ─────────────────────────────── COLD OPEN ─────────────────────────────── */

const ColdOpen: React.FC = () => {
  const t = useT();
  const C = B.cold;
  const flicker = t < C.disclaimerIn + 0.4 ? 0.45 + 0.55 * rand(Math.floor(t * 30) * 3.3) : 1;
  const dO = Math.min(clamp01((t - C.disclaimerIn) / 0.25), clamp01((C.disclaimerOut - t) / 0.15)) * flicker;
  const words = ["في", "كل", "بيت.."];
  const fade = 1 - clamp01((t - C.fade) / 0.2);
  const hit = t - C.slam;
  const shake = hit >= 0 && hit < 0.45 ? (1 - hit / 0.45) ** 2 * 22 : 0;
  return (
    <AbsoluteFill style={{ background: "#000", opacity: fade }}>
      <AbsoluteFill style={{ transform: `translate(${noise1(t * 40) * shake}px, ${noise1(t * 43 + 9) * shake}px)` }}>
        {dO > 0.01 ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 915,
              textAlign: "center",
              direction: "rtl",
              fontFamily: `${F.cairo}, sans-serif`,
              fontWeight: 700,
              fontSize: 40,
              color: "#a9a9a9",
              opacity: dO,
            }}
          >
            مبنية على أحداث حقيقية
          </div>
        ) : null}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 700,
            display: "flex",
            justifyContent: "center",
            gap: 28,
            direction: "rtl",
            fontFamily: `${F.amiri}, serif`,
            fontWeight: 700,
            fontSize: 104,
            color: "#efefef",
          }}
        >
          {words.map((w, i) => {
            const p = Easing.out(Easing.cubic)(clamp01((t - C.line - i * 0.16) / 0.38));
            return (
              <span
                key={w}
                style={{
                  display: "inline-block",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 14}px)`,
                  filter: p < 0.98 ? `blur(${(1 - p) * 12}px)` : undefined,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        <Slam a={C.slam} b={C.end} text="خاين." size={290} y={880} />
      </AbsoluteFill>
      <Flash t={t} at={[C.slam]} peak={0.32} len={0.2} />
    </AbsoluteFill>
  );
};

/* ─────────────────────────────── TITLE ─────────────────────────────── */

const Ornament: React.FC<{ y: number; p: number }> = ({ y, p }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "center" }}>
    <div
      style={{
        width: 560 * p,
        height: 2,
        background: "linear-gradient(90deg, rgba(240,200,110,0), #f0c86e 30%, #fff1c8 50%, #f0c86e 70%, rgba(240,200,110,0))",
      }}
    />
    <div
      style={{
        position: "absolute",
        width: 14,
        height: 14,
        background: "#f6d98c",
        transform: `rotate(45deg) scale(${p})`,
        boxShadow: "0 0 14px rgba(246,217,140,0.8)",
      }}
    />
  </div>
);

const TitleCard: React.FC = () => {
  const t = useT();
  const T = B.title;
  const d = T.end - T.start;
  const tin = T.textIn - T.start;
  const tout = T.textOut - T.start;
  const p = Easing.inOut(Easing.cubic)(clamp01((t - tin) / 0.75));
  const out = clamp01((t - tout) / 0.3);
  const line = Easing.out(Easing.cubic)(clamp01((t - tin - 0.15) / 0.7));
  const shine = clamp01((t - tin - 0.6) / 0.95);
  const titleStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: 760,
    textAlign: "center",
    direction: "rtl",
    fontFamily: `${F.ruqaa}, ${F.amiri}, serif`,
    fontWeight: 700,
    fontSize: 214,
    lineHeight: 1.6,
    clipPath: `inset(-80px -80px -80px ${(1 - p) * 100}%)`,
  };
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Shot
        src={NIGHT}
        keys={[
          { t: 0, x: 380, y: 1000, z: 1.3 },
          { t: d, x: 380, y: 990, z: 1.42, e: "lin" },
        ]}
        filter="blur(26px) brightness(0.3) saturate(0.6)"
        vignette={0.85}
        shade={false}
      />
      <Dust t={t} n={38} opacity={0.75} />
      <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0.02 ? `blur(${out * 12}px)` : undefined }}>
        <Ornament y={800} p={line} />
        <div style={{ ...titleStyle, ...GOLD, filter: "drop-shadow(0 0 22px rgba(240,190,80,0.45)) drop-shadow(0 8px 10px rgba(0,0,0,0.7))" }}>
          ثقة عمياء
        </div>
        <div
          style={{
            ...titleStyle,
            background: `linear-gradient(100deg, rgba(255,255,255,0) ${shine * 140 - 30}%, rgba(255,255,255,0.95) ${shine * 140 - 18}%, rgba(255,255,255,0) ${shine * 140 - 6}%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            mixBlendMode: "screen",
          }}
        >
          ثقة عمياء
        </div>
        <Ornament y={1150} p={line} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ─────────────────────────────── ACT 1 · الشك ─────────────────────────────── */

const SpongeToFace: React.FC = () => (
  <Shot
    src={NIGHT}
    keys={[
      { t: 0, x: 603, y: 1128, z: 2.9 },
      { t: 1.9, x: 598, y: 1110, z: 3.35, e: "lin" },
      { t: 2.55, x: 388, y: 992, z: 2.35, e: "io" },
      { t: 3.5, x: 380, y: 985, z: 2.5, e: "lin" },
    ]}
  />
);

const TripleZoom: React.FC = () => {
  const t = useT();
  const z = B.act1.zoom.map((v) => v - B.act1.zoom[0]);
  const keys: Key[] = [
    { t: 0, x: 378, y: 986, z: 2.45, r: 0 },
    { t: 0.07, x: 372, y: 980, z: 2.85, r: -1.6, e: "snap" },
    { t: z[1], x: 372, y: 980, z: 2.95, r: -1.6, e: "lin" },
    { t: z[1] + 0.07, x: 370, y: 977, z: 3.75, r: 1.3, e: "snap" },
    { t: z[2], x: 370, y: 977, z: 3.88, r: 1.3, e: "lin" },
    { t: z[2] + 0.08, x: 366, y: 972, z: 5.0, r: 0, e: "snap" },
    { t: 1.4, x: 366, y: 972, z: 5.35, r: 0, e: "lin" },
  ];
  return (
    <Shot
      src={NIGHT}
      keys={keys}
      shakes={[
        { t0: 0, t1: 0.22, amp: 10 },
        { t0: z[1], t1: z[1] + 0.22, amp: 15 },
        { t0: z[2], t1: z[2] + 0.38, amp: 24 },
      ]}
    >
      <SpeedLines t={t - z[2]} dur={0.62} inner={330} />
      <Flash t={t} at={z} peak={0.42} len={0.12} />
    </Shot>
  );
};

const Accuse: React.FC = () => {
  const t = useT();
  const a = B.act1.accuse - B.act1.wide;
  return (
    <Shot
      src={NIGHT}
      keys={[
        { t: 0, x: 470, y: 836, z: 1.15 },
        { t: a, x: 470, y: 836, z: 1.0, e: "out" },
        { t: a + 0.08, x: 602, y: 1118, z: 2.3, e: "snap" },
        { t: 2.75, x: 604, y: 1124, z: 2.6, e: "lin" },
      ]}
      shakes={[{ t0: a, t1: a + 0.42, amp: 20 }]}
    >
      <SpeedLines t={t - a} dur={0.6} inner={440} />
      <Flash t={t} at={[a]} peak={0.5} len={0.12} />
    </Shot>
  );
};

/* ─────────────────────────────── ACT 2 · نتيجة التحليل ─────────────────────────────── */

const LabTension: React.FC = () => (
  <Shot
    src={LAB}
    keys={[
      { t: 0, x: 690, y: 1238, z: 2.95 },
      { t: 1.6, x: 690, y: 1214, z: 3.15, e: "lin" },
      { t: 2.3, x: 688, y: 908, z: 2.5, e: "io" },
      { t: 2.9, x: 688, y: 905, z: 2.55, e: "lin" },
      { t: B.act2.slam - B.act2.start, x: 690, y: 912, z: 2.98, e: "in" },
    ]}
  />
);

const SlamShot: React.FC = () => {
  const t = useT();
  return (
    <Shot
      src={LAB}
      keys={[
        { t: 0, x: 690, y: 915, z: 3.75 },
        { t: 0.1, x: 690, y: 915, z: 3.2, e: "snap" },
        { t: 1.1, x: 690, y: 915, z: 3.32, e: "lin" },
      ]}
      shakes={[{ t0: 0, t1: 0.65, amp: 26 }]}
    >
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.32)" }} />
      <SpeedLines t={t} dur={0.95} inner={420} />
      <Flash t={t} at={[0]} peak={0.92} len={0.2} />
    </Shot>
  );
};

const Reaction: React.FC<{ x: number; y: number; z: number; r: number }> = ({ x, y, z, r }) => {
  const t = useT();
  return (
    <Shot
      src={LAB}
      keys={[
        { t: 0, x, y, z: z * 1.2, r },
        { t: 0.12, x, y, z, r, e: "snap" },
        { t: 0.55, x, y, z: z * 1.04, r, e: "lin" },
      ]}
      shakes={[{ t0: 0, t1: 0.3, amp: 14 }]}
    >
      <Flash t={t} at={[0]} peak={0.3} len={0.08} />
    </Shot>
  );
};

/* ─────────────────────────────── ACT 3 · المواجهة ─────────────────────────────── */

const lightningAt = (t: number, strikes: number[]) => {
  let v = 0;
  for (const s of strikes) {
    const d = t - s;
    if (d < 0 || d > 0.5) continue;
    const a = d < 0.05 ? 1 : d < 0.09 ? 0.15 : d < 0.14 ? 0.75 : 0.75 * Math.max(0, 1 - (d - 0.14) / 0.36);
    v = Math.max(v, a);
  }
  return v;
};

const Confront: React.FC = () => {
  const t = useT();
  const strikes = B.act3.thunder.map((v) => v - B.act3.start);
  const L = lightningAt(t, strikes);
  return (
    <Shot
      src={NIGHT}
      keys={[
        { t: 0, x: 376, y: 992, z: 2.25 },
        { t: 2.7, x: 372, y: 986, z: 2.62, e: "lin" },
      ]}
      filter={`saturate(0.6) contrast(1.08) brightness(${(0.72 + L * 1.3).toFixed(3)})`}
      shakes={strikes.map((s) => ({ t0: s, t1: s + 0.45, amp: 9 }))}
    >
      <AbsoluteFill style={{ background: "rgba(12,28,78,0.34)" }} />
      <Rain t={t} />
      <AbsoluteFill style={{ background: "#dfe8ff", opacity: L * 0.42 }} />
    </Shot>
  );
};

const FlyingSponge: React.FC<{ t: number }> = ({ t }) => {
  const dur = 0.66;
  if (t < 0 || t > dur) return null;
  const p = t / dur;
  const x = interpolate(p, [0, 1], [560, 640], CL);
  const y = interpolate(Easing.out(Easing.cubic)(p), [0, 1], [1780, 720], CL);
  const s = interpolate(Easing.in(Easing.cubic)(p), [0, 1], [2.3, 0.06], CL);
  const r = -30 + p * 680;
  const o = p > 0.82 ? (1 - p) / 0.18 : 1;
  return (
    <Img
      src={staticFile("thiqa/sponge-cut.png")}
      style={{
        position: "absolute",
        left: x - 213,
        top: y - 150,
        width: 426,
        height: 300,
        transform: `rotate(${r}deg) scale(${s})`,
        filter: `blur(${(1.2 + (1 - p) * 4).toFixed(2)}px) drop-shadow(0 18px 24px rgba(0,0,0,0.6))`,
        opacity: o,
      }}
    />
  );
};

const WindowNight: React.FC = () => {
  const t = useT();
  const s = B.act3.throw;
  const bell = B.act3.bell[0] - s;
  const warm = Easing.inOut(Easing.cubic)(clamp01((t - bell) / 1.0));
  const dur = B.act3.door - s;
  return (
    <Shot
      src={NIGHT}
      keys={[
        { t: 0, x: 852, y: 862, z: 4.45 },
        { t: dur, x: 846, y: 850, z: 4.85, e: "lin" },
      ]}
      filter="saturate(0.6) brightness(0.66) contrast(1.06)"
      vignette={0.7}
    >
      <AbsoluteFill style={{ background: "rgba(10,24,70,0.3)" }} />
      <Rain t={t + 2.7} amount={1} opacity={1 - 0.55 * clamp01((t - 0.9) / 1.2)} />
      <FlyingSponge t={t} />
      <AbsoluteFill
        style={{
          background: "linear-gradient(90deg, rgba(255,186,90,0.55) 0%, rgba(255,186,90,0.12) 45%, rgba(255,186,90,0) 70%)",
          opacity: warm,
          mixBlendMode: "screen",
        }}
      />
    </Shot>
  );
};

const Door: React.FC = () => {
  const t = useT();
  return <DoorLight t={t} dur={B.act3.end - B.act3.door} />;
};

/* ─────────────────────────────── BRAND ─────────────────────────────── */

const Brand: React.FC = () => {
  const t = useT();
  const s = B.brand.start;
  const logo = B.brand.logo - s;
  const line = B.brand.line - s;
  const claim = B.brand.claim - s;
  const handle = B.brand.handle - s;
  const shineT = B.brand.shine - s;
  const fromWhite = 1 - clamp01(t / 0.4);
  const pl = Easing.out(Easing.cubic)(clamp01((t - logo) / 0.7));
  const pli = Easing.out(Easing.cubic)(clamp01((t - line) / 0.6));
  const pc = Easing.out(Easing.cubic)(clamp01((t - claim) / 0.5));
  const ph = Easing.out(Easing.cubic)(clamp01((t - handle) / 0.5));
  const sh = clamp01((t - shineT) / 0.9);
  const logoStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: 430,
    textAlign: "center",
    direction: "rtl",
    fontFamily: `${F.cairo}, sans-serif`,
    fontWeight: 900,
    fontSize: 340,
    lineHeight: 1.25,
  };
  return (
    <AbsoluteFill
      style={{ background: "radial-gradient(ellipse 95% 70% at 50% 40%, #2d5fe6 0%, #173aa8 46%, #091a58 100%)", overflow: "hidden" }}
    >
      <Waves t={t} />
      <Dust t={t} n={34} opacity={0.8} />
      <div
        style={{
          ...logoStyle,
          ...GOLD,
          opacity: pl,
          transform: `scale(${1.14 - 0.14 * pl})`,
          filter: `blur(${((1 - pl) * 10).toFixed(2)}px) drop-shadow(0 10px 18px rgba(0,0,0,0.45)) drop-shadow(0 0 26px rgba(255,205,90,0.35))`,
        }}
      >
        موج
      </div>
      <div
        style={{
          ...logoStyle,
          background: `linear-gradient(100deg, rgba(255,255,255,0) ${sh * 140 - 30}%, rgba(255,255,255,0.95) ${sh * 140 - 18}%, rgba(255,255,255,0) ${sh * 140 - 6}%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          mixBlendMode: "screen",
          opacity: pl,
        }}
      >
        موج
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 945,
          textAlign: "center",
          direction: "rtl",
          fontFamily: `${F.ruqaa}, ${F.amiri}, serif`,
          fontWeight: 700,
          fontSize: 112,
          lineHeight: 1.6,
          color: "#ffffff",
          opacity: pli,
          transform: `translateY(${(1 - pli) * 24}px)`,
          textShadow: "0 6px 22px rgba(0,0,0,0.45)",
        }}
      >
        إسفنجة ما تخون.
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1196, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 380 * pc, height: 3, background: "linear-gradient(90deg, rgba(246,214,122,0), #f6d67a, rgba(246,214,122,0))" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1222,
          textAlign: "center",
          direction: "rtl",
          fontFamily: `${F.cairo}, sans-serif`,
          fontWeight: 700,
          fontSize: 50,
          color: "#dbe6ff",
          opacity: pc,
        }}
      >
        مضادة للبكتيريا والروائح
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1520,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: ph,
          transform: `translateY(${(1 - ph) * 18}px)`,
        }}
      >
        <div style={{ ...GOLD, fontFamily: `${F.cairo}, sans-serif`, fontWeight: 900, fontSize: 64, letterSpacing: 24, paddingLeft: 24 }}>MAOG</div>
        <div style={{ fontFamily: `${F.cairo}, sans-serif`, fontWeight: 900, fontSize: 36, color: "rgba(255,255,255,0.82)" }}>@maogsa</div>
      </div>
      <AbsoluteFill style={{ background: "#fff6e2", opacity: fromWhite }} />
    </AbsoluteFill>
  );
};

/* ─────────────────────────────── EPISODE ─────────────────────────────── */

export const ThiqaAmya: React.FC = () => {
  const A1 = B.act1;
  const A2 = B.act2;
  const A3 = B.act3;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Seq a={0} b={B.cold.end}>
        <ColdOpen />
      </Seq>
      <Seq a={B.title.start} b={B.title.end}>
        <TitleCard />
      </Seq>

      <Seq a={A1.sponge} b={A1.zoom[0]}>
        <SpongeToFace />
      </Seq>
      <Seq a={A1.zoom[0]} b={A1.flash[0]}>
        <TripleZoom />
      </Seq>
      <Seq a={A1.flash[0]} b={A1.flash[1]}>
        <PanelShot src={NIGHT} poly={KIDS} width={980} rot={-2.2} />
      </Seq>
      <Seq a={A1.flash[1]} b={A1.flash[2]}>
        <PanelShot src={NIGHT} poly={HUSBAND} width={990} rot={1.6} />
      </Seq>
      <Seq a={A1.flash[2]} b={A1.wide}>
        <PanelShot src={NIGHT} poly={GRANNY} width={1000} rot={-1.3} />
      </Seq>
      <Seq a={A1.wide} b={A1.end}>
        <Accuse />
      </Seq>

      <Seq a={A2.start} b={A2.slam}>
        <LabTension />
      </Seq>
      <Seq a={A2.slam} b={A2.react[0]}>
        <SlamShot />
      </Seq>
      <Seq a={A2.react[0]} b={A2.react[1]}>
        <Reaction x={792} y={425} z={2.95} r={-2.2} />
      </Seq>
      <Seq a={A2.react[1]} b={A2.react[2]}>
        <Reaction x={580} y={368} z={2.95} r={2} />
      </Seq>
      <Seq a={A2.react[2]} b={A2.react[3]}>
        <Reaction x={338} y={585} z={2.6} r={-1.5} />
      </Seq>
      <Seq a={A2.react[3]} b={A2.wide}>
        <Reaction x={160} y={430} z={2.95} r={1.6} />
      </Seq>
      <Seq a={A2.wide} b={A2.mil}>
        <Shot
          src={LAB}
          keys={[
            { t: 0, x: 470, y: 836, z: 1.24 },
            { t: A2.mil - A2.wide, x: 470, y: 836, z: 1.02, e: "out" },
          ]}
        />
      </Seq>
      <Seq a={A2.mil} b={A2.end}>
        <Shot
          src={LAB}
          keys={[
            { t: 0, x: 800, y: 432, z: 2.55 },
            { t: 0.1, x: 800, y: 432, z: 2.85, e: "snap" },
            { t: A2.end - A2.mil, x: 800, y: 432, z: 2.95, e: "lin" },
          ]}
          shakes={[{ t0: 0.05, t1: 0.35, amp: 8 }]}
        />
      </Seq>

      <Seq a={A3.start} b={A3.throw}>
        <Confront />
      </Seq>
      <Seq a={A3.throw} b={A3.door}>
        <WindowNight />
      </Seq>
      <Seq a={A3.door} b={A3.end}>
        <Door />
      </Seq>
      <Seq a={B.brand.start} b={B.total}>
        <Brand />
      </Seq>

      <Label a={A1.label} b={A1.zoom[0] - 0.2} text="الساعة ٢:١٤ فجراً" />
      <Sub a={A1.subSmell} b={A1.zoom[0] - 0.05}>
        هالريحة.. من وين؟
      </Sub>
      <Sub a={A1.flash[0] + 0.1} b={A1.flash[1] - 0.05}>
        صحون عيالي..
      </Sub>
      <Sub a={A1.flash[1] + 0.1} b={A1.flash[2] - 0.05}>
        فنجال زوجي..
      </Sub>
      <Sub a={A1.flash[2] + 0.1} b={A1.wide - 0.05}>
        استكانة خالتي..
      </Sub>
      <Sub a={A1.subNo} b={A1.accuse - 0.1}>
        لا.. مستحيل..
      </Sub>
      <Sub a={A1.accuse} b={A1.end - 0.05} size={104} y={1400} punch>
        أنتي؟!
      </Sub>

      <Label a={A2.label} b={A2.subMadam + 0.4} text="المختبر · صباح اليوم التالي" />
      <Sub a={A2.subMadam} b={A2.hush - 0.05}>
        مدام نورة..
      </Sub>
      <Sub a={A2.subSponge} b={A2.slam - 0.03}>
        الإسفنجة..
      </Sub>
      <Slam a={A2.slam} b={A2.react[0] - 0.04} text="حاملة." size={280} y={1250} />
      <Sub a={A2.subCount} b={A2.mil - 0.05} size={72}>
        حاملة لـ<span style={{ color: "#ffd84d", fontSize: "1.3em" }}> ٥٤ مليار </span>بكتيريا!
      </Sub>
      <Footnote a={A2.subCount + 0.15} b={A2.mil - 0.05}>
        * حتى ٥٤ مليار بكتيريا في السنتيمتر المكعب من إسفنج المطبخ المستعمل · Scientific Reports, 2017
      </Footnote>
      <Sub a={A2.mil + 0.05} b={A2.end - 0.05} punch>
        قلت لك من أول!
      </Sub>

      <Sub a={A3.sub1} b={A3.sub2 - 0.1}>
        ثلاث شهور..
      </Sub>
      <Sub a={A3.sub2} b={A3.throw - 0.05} size={78} punch>
        وأنا واثقة فيك!
      </Sub>

      <Grain />
      <Audio src={staticFile("audio/thiqa.wav")} />
    </AbsoluteFill>
  );
};

export const THIQA_SIZE = { W, H };
