import React from "react";
import { AbsoluteFill, Audio, interpolate, Easing, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PixelCanvas } from "./PixelCanvas";
import { Caption } from "./Caption";
import { Gfx } from "./engine";
import { drawKitchen } from "./scenes/kitchen";
import { drawExterior } from "./scenes/exterior";
import { drawWedding } from "./scenes/wedding";
import { drawPotClose } from "./scenes/potClose";
import { drawHero } from "./scenes/hero";
import { drawFahad, drawWoman } from "./scenes/ummFahad";

// ------------------------------------------------------------------ timeline (30 fps)
export const STORY = {
  hook: [0, 135],
  wedding: [135, 180],
  night: [315, 120],
  scrub: [435, 150],
  floor: [585, 120],
  arrive: [705, 90],
  fahad: [795, 90],
  magic: [885, 150],
  reunion: [1035, 180],
  hero: [1215, 135],
} as const;
export const STORY_FRAMES = 1350;

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

// ------------------------------------------------------------------ helpers
const Cap: React.FC<{ from: number; to: number; lines: string[]; top?: number; size?: number }> = ({
  from,
  to,
  lines,
  top = 150,
  size = 64,
}) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const inP = interpolate(f, [from, from + 10], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const outP = interpolate(f, [to - 8, to], [1, 0], { extrapolateLeft: "clamp" });
  const ul = interpolate(f, [from + 8, from + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - inP) * 18}px)` }}>
      <Caption lines={lines} top={top} size={size} opacity={Math.min(inP, outP)} underlineProgress={ul} />
    </div>
  );
};

/** pixel scene with a slow camera move (crisp nearest-neighbour scaling) */
const Shot: React.FC<{
  draw: (g: Gfx, f: number) => void;
  dur: number;
  zoom?: [number, number];
  origin?: string;
  shake?: number;
  fadeIn?: number;
  fadeOut?: number;
  flashIn?: number;
  children?: React.ReactNode;
}> = ({ draw, dur, zoom = [1, 1], origin = "50% 50%", shake = 0, fadeIn = 0, fadeOut = 0, flashIn = 0, children }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], zoom, { easing: Easing.inOut(Easing.sin) });
  const sx = shake ? Math.round(Math.sin(f * 2.7) * shake) : 0;
  const sy = shake ? Math.round(Math.cos(f * 3.1) * shake) : 0;
  const black = Math.max(
    fadeIn ? interpolate(f, [0, fadeIn], [1, 0], { extrapolateRight: "clamp" }) : 0,
    fadeOut ? interpolate(f, [dur - fadeOut, dur], [0, 1], { extrapolateLeft: "clamp" }) : 0,
  );
  const white = flashIn ? interpolate(f, [0, flashIn], [1, 0], { extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${sx * 4}px, ${sy * 4}px) scale(${z})`, transformOrigin: origin }}>
        <PixelCanvas draw={draw} />
      </AbsoluteFill>
      {children}
      {black > 0 && <AbsoluteFill style={{ backgroundColor: "#000", opacity: black }} />}
      {white > 0 && <AbsoluteFill style={{ backgroundColor: "#fff6e4", opacity: white }} />}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ scene draw functions (local frame)
const drawHook = (g: Gfx, f: number) =>
  drawKitchen(g, f + 20, { burning: true, expr: "shock", pose: "panic", clockMin: 45 });

const drawFlashback = (g: Gfx, f: number) => drawWedding(g, f);

const drawNight = (g: Gfx, f: number) => drawExterior(g, f);

const drawScrub = (g: Gfx, f: number) => drawPotClose(g, f, { mode: "old", scrubPhase: f * 0.42 });

const drawFloor = (g: Gfx, f: number) =>
  drawKitchen(g, f, {
    burning: true,
    hidePot: true,
    smoke: 0.2,
    flame: false,
    clockMin: 52 + (f / 120) * 6,
    actors: (gg) => {
      // the burnt pot on the floor beside her
      gg.ellipse(110, 462, 30, 3, "k0");
      gg.rect(84, 428, 52, 34, "m1");
      gg.rect(86, 430, 8, 30, "m3");
      gg.rect(124, 430, 10, 30, "m0");
      gg.rect(80, 424, 60, 6, "m2");
      gg.rect(84, 425, 52, 3, "k0");
      gg.rect(84, 452, 52, 10, "k1");
      const breath = Math.round(Math.sin(f / 12) * 1);
      drawWoman(gg, 186, 356, { expr: "sad", pose: "sit", look: "red", bob: breath });
    },
  });

const drawArrive = (g: Gfx, f: number) => drawExterior(g, f + 120, { arrival: f / 60 });

const drawFahadIn = (g: Gfx, f: number) => {
  const run = clamp(f / 45);
  const fx = -30 + run * 128;
  drawKitchen(g, f, {
    burning: true,
    smoke: 0.35,
    flame: false,
    clockMin: 59,
    actors: (gg) => {
      drawWoman(gg, 214, 278, { expr: f > 30 ? "shock" : "sad", pose: "stand", look: "red" });
      const sponge = (hx: number, hy: number) => {
        gg.rect(hx - 6, hy - 18, 13, 16, "b0");
        gg.rect(hx - 5, hy - 17, 11, 14, "b2");
        gg.rect(hx - 5, hy - 17, 11, 5, "m3");
        gg.px(hx - 3, hy - 15, "y1");
        gg.px(hx + 1, hy - 16, "y2");
        gg.px(hx + 3, hy - 14, "y1");
        if (Math.floor(f / 4) % 2 === 0) {
          gg.rect(hx + 6, hy - 22, 5, 1, "y2");
          gg.rect(hx + 8, hy - 24, 1, 5, "y2");
        }
      };
      gg.flipX(fx, () =>
        drawFahad(gg, fx, 359, {
          expr: "excited",
          pose: run < 1 ? "run" : "offer",
          step: Math.floor(f / 4),
          item: run < 1 ? sponge : undefined,
        }),
      );
      // when he stops he offers it forward (drawn un-mirrored so the sponge reads)
      if (run >= 1) sponge(fx + 40, 393 + 18);
    },
  });
};

const drawMagic = (g: Gfx, f: number) =>
  drawPotClose(g, f, {
    mode: "moaj",
    wave: clamp((f - 15) / 75, 0, 1.05),
    shine: clamp((f - 92) / 20),
  });

const drawReunion = (g: Gfx, f: number) =>
  drawKitchen(g, f, {
    burning: false,
    smoke: 0,
    flame: false,
    shine: true,
    clockMin: 0,
    actors: (gg) => {
      const warm = f > 80;
      gg.flipX(64, () =>
        drawWoman(gg, 64, 278, {
          expr: warm ? "tender" : "calm",
          pose: f > 30 && f < 80 ? "reach" : "stand",
          look: "abaya",
          glasses: true,
          old: true,
        }),
      );
      drawWoman(gg, 214, 278, { expr: warm ? "happy" : "worried", pose: "stand", look: "red" });
      if (warm) gg.glow(140, 300, 120, "#ffd9a0", 0.12);
    },
  });

// ------------------------------------------------------------------ the film
export const Story: React.FC = () => {
  const S = STORY;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 1 · HOOK — in the middle of the disaster */}
      <Sequence from={S.hook[0]} durationInFrames={S.hook[1]}>
        <Shot draw={drawHook} dur={S.hook[1]} zoom={[1.0, 1.1]} origin="62% 58%">
          <Cap from={4} to={64} lines={["هذا القدر…", "عمره *عشرين* سنة."]} />
          <Cap from={66} to={134} lines={["وصاحبته…", "جاية بعد *ربع ساعة.*"]} />
        </Shot>
      </Sequence>

      {/* 2 · FLASHBACK — the wedding day */}
      <Sequence from={S.wedding[0]} durationInFrames={S.wedding[1]}>
        <Shot draw={drawFlashback} dur={S.wedding[1]} zoom={[1.06, 1.0]} flashIn={10} fadeOut={10}>
          <Cap from={10} to={88} lines={["قبل عشرين سنة…", "يوم *عرسي*،"]} />
          <Cap from={90} to={176} lines={["عطتني إياه وقالت:", "«*ديري بالك* عليه.»"]} />
        </Shot>
      </Sequence>

      {/* 3 · TONIGHT — Friday dinner */}
      <Sequence from={S.night[0]} durationInFrames={S.night[1]}>
        <Shot draw={drawNight} dur={S.night[1]} zoom={[1.12, 1.0]} origin="50% 60%" fadeIn={10}>
          <Cap from={12} to={118} lines={["والليلة…", "عزيمة *الجمعة* عندي."]} />
        </Shot>
      </Sequence>

      {/* 4 · RISING — scrubbing, nothing moves */}
      <Sequence from={S.scrub[0]} durationInFrames={S.scrub[1]}>
        <Shot draw={drawScrub} dur={S.scrub[1]} zoom={[1.0, 1.06]} shake={0.4}>
          <Cap from={6} to={74} lines={["فركت…", "وفركت…"]} />
          <Cap from={76} to={148} lines={["والأسود؟", "*ولا تحرّك.*"]} />
        </Shot>
      </Sequence>

      {/* 5 · LOW POINT — on the floor, the clock ticking */}
      <Sequence from={S.floor[0]} durationInFrames={S.floor[1]}>
        <Shot draw={drawFloor} dur={S.floor[1]} zoom={[1.0, 1.18]} origin="60% 78%" fadeIn={8}>
          <Cap from={10} to={118} lines={["قعدت جنبه…", "وقلت: *راحت عليّ.*"]} />
        </Shot>
      </Sequence>

      {/* 6 · SHE'S HERE — headlights on the gate */}
      <Sequence from={S.arrive[0]} durationInFrames={S.arrive[1]}>
        <Shot draw={drawArrive} dur={S.arrive[1]} zoom={[1.0, 1.04]} origin="30% 80%">
          <Cap from={40} to={90} size={80} lines={["…*وصلت.*"]} />
        </Shot>
      </Sequence>

      {/* 7 · FAHAD — the turn */}
      <Sequence from={S.fahad[0]} durationInFrames={S.fahad[1]}>
        <Shot draw={drawFahadIn} dur={S.fahad[1]} zoom={[1.0, 1.05]} origin="40% 75%">
          <Cap from={22} to={90} lines={["فهد:", "«يمه! *جرّبي هذي!*»"]} />
        </Shot>
      </Sequence>

      {/* 8 · CLIMAX — one scrub */}
      <Sequence from={S.magic[0]} durationInFrames={S.magic[1]}>
        <Shot draw={drawMagic} dur={S.magic[1]} zoom={[1.08, 1.0]}>
          <Cap from={12} to={148} size={76} lines={["فركة…", "*وحدة.*"]} />
        </Shot>
      </Sequence>

      {/* 9 · RESOLUTION — her verdict */}
      <Sequence from={S.reunion[0]} durationInFrames={S.reunion[1]}>
        <Shot draw={drawReunion} dur={S.reunion[1]} zoom={[1.0, 1.3]} origin="50% 62%" fadeIn={8}>
          <Cap from={84} to={178} lines={["حماتي:", "«كأنه يوم *عطيتك* إياه.»"]} />
        </Shot>
      </Sequence>

      {/* 10 · END CARD */}
      <Sequence from={S.hero[0]} durationInFrames={S.hero[1]}>
        <Shot draw={drawHero} dur={S.hero[1]} zoom={[1.06, 1.0]} fadeIn={10}>
          <Cap from={12} to={135} size={84} lines={["موج.", "يهتم باللي *يهمك.*"]} />
          <Cap from={50} to={135} top={1600} size={48} lines={["دوّرها على الرف"]} />
        </Shot>
      </Sequence>

      <Audio src={staticFile("audio/moaj-story.wav")} />
    </AbsoluteFill>
  );
};
